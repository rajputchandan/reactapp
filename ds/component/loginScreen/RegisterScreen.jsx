import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [dairyName, setDairyName] = useState('');
  const [dairyCode, setDairyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [joinDate, setJoinDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkDairyCodeAvailability = async (code) => {
    if (!code) {
      setCodeAvailable(null);
      return;
    }

    try {
      setChecking(true);
      const res = await axios.get(`http://10.61.9.3:5000/api/admin/check-code/${code.toLowerCase()}`);
      setCodeAvailable(res.data.available);
    } catch (err) {
      console.error('Code check error:', err.message);
      setCodeAvailable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleRegister = async () => {
    if (!dairyName || !email || !password || !dairyCode) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    if (!codeAvailable) {
      Alert.alert('Dairy Code Unavailable', 'Please choose a unique dairy code');
      return;
    }

    const dbName = dairyName.replace(/\s/g, '').toLowerCase();

    const payload = {
      name: dairyName,
      dairyName,
      dairyCode: dairyCode.toLowerCase(),
      email,
      password,
      joinDate,
      dbName,
    };

    try {
      setLoading(true);
      const res = await axios.post('http://10.61.9.3:5000/api/admin/register', payload);
      Alert.alert('Success', 'Your dairy has been registered');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Register Error:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Your Dairy</Text>

      <TextInput
        style={styles.input}
        placeholder="Dairy Name"
        value={dairyName}
        onChangeText={setDairyName}
      />

      <TextInput
        style={[
          styles.input,
          dairyCode && codeAvailable === false && { borderColor: 'red', borderWidth: 2 },
          dairyCode && codeAvailable === true && { borderColor: 'green', borderWidth: 2 }
        ]}
        placeholder="Unique Dairy Code"
        autoCapitalize="none"
        value={dairyCode}
        onChangeText={(text) => {
          setDairyCode(text);
          checkDairyCodeAvailability(text);
        }}
      />

      {dairyCode.length > 0 && codeAvailable === false && (
        <Text style={{ color: 'red', marginBottom: 10 }}>Not Available</Text>
      )}
      {dairyCode.length > 0 && codeAvailable === true && (
        <Text style={{ color: 'green', marginBottom: 10 }}>Available</Text>
      )}
      {checking && <Text style={{ color: '#999', marginBottom: 10 }}>Checking...</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar" size={20} color="#555" />
        <Text style={styles.dateText}>{joinDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={joinDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setJoinDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.dbName}>
        DB Name: {dairyName ? dairyName.replace(/\s/g, '').toLowerCase() : '—'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={() => {
          setDairyName('');
          setDairyCode('');
          setEmail('');
          setPassword('');
          setJoinDate(new Date());
          setCodeAvailable(null);
        }}
      >
        <Text style={[styles.buttonText, { color: '#2e7d32' }]}>Reset</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  dbName: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  resetButton: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
