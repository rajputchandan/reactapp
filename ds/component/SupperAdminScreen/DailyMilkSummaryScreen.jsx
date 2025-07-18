import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyMilkSummaryScreen = () => {
  const [summary, setSummary] = useState(null);
  const [dairyData, setDairyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://192.168.43.119:5000/api/superadmin/all-Milk-summary', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSummary(res.data.summary);
      setDairyData(res.data.perDairy);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load milk summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text style={{ marginTop: 10 }}>Loading Daily Summary...</Text>
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No summary data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>📊 Daily Milk Summary</Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalText}>🐄 Cow Milk: <Text style={styles.bold}>{summary.totalCow}</Text> L</Text>
        <Text style={styles.totalText}>🐃 Buffalo Milk: <Text style={styles.bold}>{summary.totalBuffalo}</Text> L</Text>
        <Text style={styles.totalText}>🥛 Mix Milk: <Text style={styles.bold}>{summary.totalMix}</Text> L</Text>
        <Text style={styles.totalText}>📦 Grand Total: <Text style={styles.bold}>{summary.grandTotal}</Text> L</Text>
        <Text style={styles.totalText}>🧾 Total Entries: <Text style={styles.bold}>{summary.totalEntries}</Text></Text>
      </View>

      <Text style={styles.subHeader}>📋 Dairy-wise Breakdown:</Text>

      {dairyData.length === 0 ? (
        <Text style={{ textAlign: 'center', color: 'gray' }}>No dairy data available.</Text>
      ) : (
        dairyData.map((d, i) => (
          <View key={i} style={styles.dairyCard}>
            <Text style={styles.dairyTitle}>🏢 {d.dairy}</Text>
            <Text style={styles.itemText}>🐄 Cow: <Text style={styles.bold}>{d.cow}</Text> L</Text>
            <Text style={styles.itemText}>🐃 Buffalo: <Text style={styles.bold}>{d.buffalo}</Text> L</Text>
            <Text style={styles.itemText}>🥛 Mix: <Text style={styles.bold}>{d.mix}</Text> L</Text>
            <Text style={styles.itemText}>📦 Total: <Text style={styles.bold}>{d.dairyTotal}</Text> L</Text>
            <Text style={styles.itemText}>🧾 Entries: <Text style={styles.bold}>{d.entries}</Text></Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default DailyMilkSummaryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  totalCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    borderLeftColor: '#2ecc71',
    borderLeftWidth: 6,
    elevation: 2,
  },
  totalText: { fontSize: 16, marginBottom: 8, color: '#2c3e50' },
  bold: { fontWeight: 'bold', color: '#000' },
  dairyCard: {
    backgroundColor: '#fdfdfd',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    elevation: 1,
  },
  dairyTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  itemText: { fontSize: 15, marginBottom: 4, color: '#555' },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
});
