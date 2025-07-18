import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AllFarmersScreen = () => {
  const [groupedFarmers, setGroupedFarmers] = useState({});
  const [originalGroupedFarmers, setOriginalGroupedFarmers] = useState({});
  const [totalFarmers, setTotalFarmers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchFarmers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.get('http://192.168.43.119:5000/api/superadmin/all-farmers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const farmers = res.data.farmers;

      const grouped = {};
      farmers.forEach((f) => {
        const dairy = f.dairy || 'Unknown';
        if (!grouped[dairy]) grouped[dairy] = [];
        grouped[dairy].push(f.name);
      });

      setGroupedFarmers(grouped);
      setOriginalGroupedFarmers(grouped);
      setTotalFarmers(farmers.length);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      Alert.alert('Error', 'Failed to fetch farmers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setGroupedFarmers(originalGroupedFarmers);
      return;
    }

    const filtered = {};

    Object.entries(originalGroupedFarmers).forEach(([dairy, farmers]) => {
      const matched = farmers.filter(name =>
        name.toLowerCase().includes(text.toLowerCase()) ||
        dairy.toLowerCase().includes(text.toLowerCase())
      );
      if (matched.length > 0) {
        filtered[dairy] = matched;
      }
    });

    setGroupedFarmers(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text style={{ marginTop: 10 }}>Loading farmers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Farmers</Text>
      <Text style={styles.total}>
        Total Dairies: {Object.keys(originalGroupedFarmers).length} | Total Farmers: {totalFarmers}
      </Text>

      <TextInput
        placeholder="Search by farmer or dairy name..."
        value={searchText}
        onChangeText={handleSearch}
        style={styles.search}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {Object.entries(groupedFarmers).map(([dairy, farmers], index) => (
          <View key={index} style={styles.dairyGroup}>
            <Text style={styles.dairyHeader}>🏢 {dairy} (Total Farmers: {farmers.length})</Text>
            {farmers.map((name, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.name}>👤 {name}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AllFarmersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  total: { fontSize: 16, color: 'gray', marginBottom: 10 },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
  },
  dairyGroup: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dairyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#e9f7ef',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  name: { fontSize: 16, color: '#333' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
