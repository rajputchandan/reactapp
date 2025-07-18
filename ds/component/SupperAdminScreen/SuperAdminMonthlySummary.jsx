import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { captureRef } from 'react-native-view-shot'; // Optional for native print/save later

const SuperAdminDateRangeSummary = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overallTotals, setOverallTotals] = useState({});
  const [dairyWiseTotals, setDairyWiseTotals] = useState([]);

  const printableRef = useRef(); // For optional printing

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://192.168.43.119:5000/api/superadmin/monthly-summary?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`
      );

      if (res.data.success) {
        setSummaryData(res.data.data);
        setOverallTotals(res.data.overallTotals);
        setDairyWiseTotals(res.data.dairyWiseTotals);
      } else {
        setSummaryData([]);
      }
    } catch (err) {
      console.error(err);
      setSummaryData([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 On first load → set current month range
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setFromDate(firstDay);
    setToDate(now);
  }, []);

  // 🔁 When fromDate & toDate are set → fetch data
  useEffect(() => {
    if (fromDate && toDate) {
      fetchSummary();
    }
  }, [fromDate, toDate]);

  const renderDateGroup = ({ item }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateTitle}>📅 {item.date}</Text>
      {item.dairies.map((dairy, index) => (
        <View key={index} style={styles.dairyCard}>
          <Text style={styles.dairyName}>🏢 {dairy.dairyName}</Text>
          <Text>🐄 Cow: {dairy.cow} L</Text>
          <Text>🐃 Buffalo: {dairy.buffalo} L</Text>
          <Text>🧪 Mix: {dairy.mix} L</Text>
          <Text style={styles.dairyTotal}>Total: {dairy.total} L</Text>
        </View>
      ))}
    </View>
  );

  const handlePrint = () => {
    window.print(); // Works in PWA or Web. Native print = use external libs
  };

  return (
    <View style={styles.container} ref={printableRef}>
      <Text style={styles.heading}>📆 Select Date Range</Text>

      <View style={styles.dateRow}>
        <TouchableOpacity onPress={() => setShowFromPicker(true)} style={styles.datePicker}>
          <Text>From: {fromDate ? formatDate(fromDate) : '--'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowToPicker(true)} style={styles.datePicker}>
          <Text>To: {toDate ? formatDate(toDate) : '--'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={fetchSummary} style={styles.filterBtn}>
          <Text style={{ color: 'white' }}>Filter</Text>
        </TouchableOpacity>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      ) : summaryData.length === 0 ? (
        <Text style={styles.noData}>❌ No available data</Text>
      ) : (
        <FlatList
          data={summaryData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDateGroup}
        />
      )}

      {Object.keys(overallTotals).length > 0 && (
        <View style={styles.totalsBox}>
          <Text style={styles.sectionTitle}>📊 Overall Totals:</Text>
          <Text>🐄 Cow: {overallTotals.cow} L</Text>
          <Text>🐃 Buffalo: {overallTotals.buffalo} L</Text>
          <Text>🧪 Mix: {overallTotals.mix} L</Text>
          <Text style={styles.dairyTotal}>Grand Total: {overallTotals.total} L</Text>
        </View>
      )}

      {dairyWiseTotals.length > 0 && (
        <View style={styles.totalsBox}>
          <Text style={styles.sectionTitle}>📁 Dairy-wise Summary:</Text>
          {dairyWiseTotals.map((d, i) => (
            <Text key={i}>🏢 {d.name}: {d.total} L</Text>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={handlePrint} style={styles.printBtn}>
        <Text style={{ color: 'white' }}>🖨️ Print</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  dateRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 10, alignItems: 'center'
  },
  datePicker: {
    backgroundColor: '#eee', padding: 10, borderRadius: 10
  },
  filterBtn: {
    backgroundColor: 'blue', padding: 10, borderRadius: 10
  },
  dateGroup: {
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8
  },
  dateTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  dairyCard: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 6,
    marginTop: 5
  },
  dairyName: { fontWeight: 'bold' },
  dairyTotal: { fontWeight: 'bold', marginTop: 2 },
  totalsBox: {
    marginTop: 15,
    backgroundColor: '#d0f0c0',
    padding: 10,
    borderRadius: 10
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5
  },
  noData: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'red'
  },
  printBtn: {
    backgroundColor: '#333',
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center'
  }
});

export default SuperAdminDateRangeSummary;
