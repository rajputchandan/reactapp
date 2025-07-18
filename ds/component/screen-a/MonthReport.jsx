import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get('window').width;

export default function MonthlyReport() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = 'http://192.168.43.119:5000'; // replace with your IP

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // 👈 get token
        const res = await axios.get(`${backendURL}/api/milk/month` ,{
   headers: {
        Authorization: `Bearer ${token}`, // ✅ Add token in header
      },
        });
        const raw = res.data;

        const processed = Object.entries(raw).map(([date, entries]) => {
          let cowTotal = 0,
            buffaloTotal = 0,
            mixTotal = 0,
            bothTotal = 0;

          const farmersSubmitted = [];

          entries.forEach((entry) => {
            const milkType = entry.milkType?.toLowerCase();

            if (milkType === 'cow') {
              cowTotal += entry.cowLiters || entry.liters || 0;
              farmersSubmitted.push({
                name: entry.name,
                cow: entry.cowLiters || entry.liters || 0,
              });
            } else if (milkType === 'buffalo') {
              buffaloTotal += entry.buffaloLiters || entry.liters || 0;
              farmersSubmitted.push({
                name: entry.name,
                buffalo: entry.buffaloLiters || entry.liters || 0,
              });
            } else if (milkType === 'mix') {
              mixTotal += entry.liters || 0;
              farmersSubmitted.push({
                name: entry.name,
                mix: entry.liters || 0,
              });
            } else if (milkType === 'both') {
              const cow = entry.cowLiters || 0;
              const buffalo = entry.buffaloLiters || 0;
              cowTotal += cow;
              buffaloTotal += buffalo;
              bothTotal += cow + buffalo;

              farmersSubmitted.push({
                name: entry.name,
                cow,
                buffalo,
              });
            }
          });

          return {
            date,
            cowTotal,
            buffaloTotal,
            mixTotal,
            bothTotal,
            farmersSubmitted,
            totalFarmers: 0, // optional: you can replace with real total if needed
          };
        });

        setMonthlyData(processed);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching monthly data:', err);
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
        <Text>Loading Monthly Report...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📅 Monthly Milk Report</Text>

      {monthlyData.map((entry, index) => {
        const totalCollected =
          entry.cowTotal + entry.buffaloTotal + entry.mixTotal + entry.bothTotal;
        const farmersCount = entry.farmersSubmitted.length;

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.date}>{entry.date}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>🐄 Cow:</Text>
              <Text style={styles.value}>{entry.cowTotal} L</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>🦬 Buffalo:</Text>
              <Text style={styles.value}>{entry.buffaloTotal} L</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>🧪 Mix:</Text>
              <Text style={styles.value}>{entry.mixTotal} L</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>🔁 Both:</Text>
              <Text style={styles.value}>{entry.bothTotal} L</Text>
            </View>

            <View style={[styles.row, styles.totalRow]}>
              <Text style={[styles.label, { fontWeight: '700' }]}>📊 Total Collected:</Text>
              <Text style={[styles.value, { fontWeight: '700', color: '#27ae60' }]}>
                {totalCollected} L
              </Text>
            </View>

            <Text style={styles.submitted}>
              ✅ Farmers Submitted: {farmersCount}
            </Text>

            <Text style={styles.farmerTitle}>👥 Farmer Details:</Text>
            {entry.farmersSubmitted.map((farmer, i) => (
              <Text key={i} style={styles.farmerDetail}>
                • {farmer.name}
                {farmer.cow ? `  🐄 ${farmer.cow}L` : ''}
                {farmer.buffalo ? `  🦬 ${farmer.buffalo}L` : ''}
                {farmer.mix ? `  🧪 ${farmer.mix}L` : ''}
              </Text>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f9ff',
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#ffffff',
    width: screenWidth - 32,
    alignSelf: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#aaa',
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2980b9',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalRow: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 6,
  },
  label: {
    fontSize: 14,
    color: '#2c3e50',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  submitted: {
    marginTop: 8,
    fontSize: 13,
    color: '#8e44ad',
  },
  farmerTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
  },
  farmerDetail: {
    fontSize: 13,
    marginLeft: 10,
    marginTop: 2,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
