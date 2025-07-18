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

export default function DailySummary() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    cowMilk: 0,
    buffaloMilk: 0,
    mixMilk: 0,
    bothMilk: 0,
    totalMilk: 0,
    submittedFarmers: [],
    pendingFarmers: [],
  });

  const backendURL = 'http://192.168.43.119:5000'; // ✅ Replace with your server IP

  useEffect(() => {
    const fetchData = async () => {
      try {
         const token = await AsyncStorage.getItem('token'); // 👈 get token
        const [farmersRes, entriesRes] = await Promise.all([
          axios.get(`${backendURL}/api/farmers/all`,{
                     headers: {
        Authorization: `Bearer ${token}`, // ✅ Add token in header
      },
          }),
          axios.get(`${backendURL}/api/milk/today` ,{
                     headers: {
        Authorization: `Bearer ${token}`, // ✅ Add token in header
      },
          })
        ]);

        const farmers = farmersRes.data;
        const entries = entriesRes.data;

        processSummary(farmers, entries);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processSummary = (farmers, entries) => {
    let cow = 0, buffalo = 0, mix = 0, both = 0;
    const submittedDetails = [];

    entries.forEach(entry => {
      const farmer = farmers.find(f =>
        f.farmerId === entry.farmerId || String(f._id) === entry.farmerId
      );
      if (!farmer) return;

      const milkType = entry.milkType?.toLowerCase();

      if (milkType === 'cow') {
        const cowLiters = entry.cowLiters || entry.liters || 0;
        cow += cowLiters;
        submittedDetails.push({ name: farmer.name, type: 'Cow', liters: cowLiters });
      } else if (milkType === 'buffalo') {
        const buffaloLiters = entry.buffaloLiters || entry.liters || 0;
        buffalo += buffaloLiters;
        submittedDetails.push({ name: farmer.name, type: 'Buffalo', liters: buffaloLiters });
      } else if (milkType === 'mix') {
        const mixLiters = entry.liters || 0;
        mix += mixLiters;
        submittedDetails.push({ name: farmer.name, type: 'Mix', liters: mixLiters });
      } else if (milkType === 'both') {
        const cowVal = entry.cowLiters || 0;
        const buffaloVal = entry.buffaloLiters || 0;
        cow += cowVal;
        buffalo += buffaloVal;
        both += cowVal + buffaloVal;

        submittedDetails.push({
          name: farmer.name,
          type: 'Both',
          cow: cowVal,
          buffalo: buffaloVal,
        });
      }
    });

    const submittedIds = entries.map(e => e.farmerId);
    const pending = farmers.filter(f => {
      const farmerId = f.farmerId || String(f._id);
      return !submittedIds.includes(farmerId);
    });

    setSummary({
      cowMilk: cow,
      buffaloMilk: buffalo,
      mixMilk: mix,
      bothMilk: both,
      totalMilk: cow + buffalo + mix,
      submittedFarmers: submittedDetails,
      pendingFarmers: pending,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Loading summary...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Daily Milk Summary</Text>

      <View style={styles.gridRow}>
        <View style={[styles.card, { backgroundColor: '#eafaf1' }]}>
          <Text style={styles.cardTitle}>🐄 Cow Milk</Text>
          <Text style={styles.cardValue}>{summary.cowMilk} L</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#fff6e5' }]}>
          <Text style={styles.cardTitle}>🦬 Buffalo Milk</Text>
          <Text style={styles.cardValue}>{summary.buffaloMilk} L</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={[styles.card, { backgroundColor: '#e6f0ff' }]}>
          <Text style={styles.cardTitle}>🌀 Mix Milk</Text>
          <Text style={styles.cardValue}>{summary.mixMilk} L</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#fceff6' }]}>
          <Text style={styles.cardTitle}>🧪 Total Milk</Text>
          <Text style={styles.cardValue}>{summary.totalMilk} L</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Farmers Submitted</Text>
        {summary.submittedFarmers.map((f, idx) => (
          <View key={idx} style={styles.farmerRow}>
            <Text style={styles.farmerName}>👤 {f.name}</Text>
            {f.type === 'Both' ? (
              <Text style={styles.farmerMilk}>Cow: {f.cow} L, Buffalo: {f.buffalo} L</Text>
            ) : (
              <Text style={styles.farmerMilk}>{f.type}: {f.liters} L</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❌ Pending Farmers</Text>
        {summary.pendingFarmers.length === 0 ? (
          <Text style={styles.allSubmitted}>All farmers submitted ✅</Text>
        ) : (
          summary.pendingFarmers.map((f, idx) => (
            <Text key={idx} style={styles.pendingFarmer}>
              👤 {f.name} ({f.farmerId || f._id})
            </Text>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f7fa',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2c3e50',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: screenWidth - 32,
  },
  card: {
    width: (screenWidth - 48) / 2,
    height: 110,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 16,
    width: screenWidth - 32,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#34495e',
  },
  farmerRow: {
    marginBottom: 10,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  farmerMilk: {
    fontSize: 15,
    color: '#34495e',
    marginLeft: 10,
  },
  pendingFarmer: {
    fontSize: 16,
    marginBottom: 5,
    color: '#e74c3c',
  },
  allSubmitted: {
    fontSize: 16,
    color: 'green',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
