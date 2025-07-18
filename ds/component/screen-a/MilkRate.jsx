import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MilkRateScreen() {
  // Cow Milk
 
  const [cowPerFatRate, setCowPerFatRate] = useState('');
  const [cowFixedRate, setCowFixedRate] = useState('');

  // Buffalo Milk

  const [buffaloPerFatRate, setBuffaloPerFatRate] = useState('');
  const [buffaloFixedRate, setBuffaloFixedRate] = useState('');

  // Mix Milk
 
  const [mixFixedRate, setMixFixedRate] = useState('');
const backendURL = "http://192.168.43.119:5000"; // Replace with your IP
const handleSubmit = async () => {
  const rates = {
    cow: {
      perFat: cowPerFatRate,
      fixed: cowFixedRate,
    },
    buffalo: {
      perFat: buffaloPerFatRate,
      fixed: buffaloFixedRate,
    },
    mix: {
      fixed: mixFixedRate,
    },
  };

  if (
    !cowPerFatRate || !cowFixedRate ||
    !buffaloPerFatRate || !buffaloFixedRate ||
    !mixFixedRate
  ) {
    Alert.alert('Validation Error', 'Please fill all fields for all milk types.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');

    const res = await axios.post(
      `${backendURL}/api/milkrate/set`,
      rates, // ✅ this is the body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    Alert.alert('✅ Success', res.data.message);
  } catch (error) {
    console.error("Milk Rate Save Error:", error?.response?.data || error);
    Alert.alert('❌ Error', error.response?.data?.message || 'Failed to save milk rates');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💰 Set All Milk Rates</Text>

      {/* Cow Milk */}
      <Text style={styles.section}>🐄 Cow Milk</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Per Fat % Rate (₹)"
        keyboardType="numeric"
        value={cowPerFatRate}
        onChangeText={setCowPerFatRate}
      />
      <TextInput
        style={styles.input}
        placeholder="Fixed Rate (₹)"
        keyboardType="numeric"
        value={cowFixedRate}
        onChangeText={setCowFixedRate}
      />

      {/* Buffalo Milk */}
      <Text style={styles.section}>🐃 Buffalo Milk</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Per Fat % Rate (₹)"
        keyboardType="numeric"
        value={buffaloPerFatRate}
        onChangeText={setBuffaloPerFatRate}
      />
      <TextInput
        style={styles.input}
        placeholder="Fixed Rate (₹)"
        keyboardType="numeric"
        value={buffaloFixedRate}
        onChangeText={setBuffaloFixedRate}
      />

      {/* Mix Milk */}
      <Text style={styles.section}>🥛 Mix Milk (Cow + Buffalo)</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Fixed Rate (₹)"
        keyboardType="numeric"
        value={mixFixedRate}
        onChangeText={setMixFixedRate}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>💾 Save All Rates</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f7fc',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#34495e',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dcdde1',
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
