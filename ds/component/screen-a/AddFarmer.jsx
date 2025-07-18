import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get('window').width;
const API_URL = 'http://192.168.43.119:5000/api/farmers/add'; // Replace <YOUR_LOCAL_IP>

export default function AddFarmer() {
  const [farmerId, setFarmerId] = useState('');
  const [name, setName] = useState('');
  const [milkType, setMilkType] = useState('cow');
  const [rateType, setRateType] = useState('fixed');

  const [cowRate, setCowRate] = useState('');
  const [buffaloRate, setBuffaloRate] = useState('');
  const [mixRate, setMixRate] = useState('');

  const [cowRateType, setCowRateType] = useState('fixed');
  const [buffaloRateType, setBuffaloRateType] = useState('fixed');
  const [mixRateType, setMixRateType] = useState('fixed');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!farmerId || !name || !email || !password) {
      return Alert.alert('Error', 'Please fill all required fields');
    }

    let data = {
      farmerId,
      name,
      email,
      password,
      milkType,
      role: 'farmer',
    };

    if (milkType === 'cow') {
      data.rateType = rateType;
      data.cowRate = cowRate;
    } else if (milkType === 'buffalo') {
      data.rateType = rateType;
      data.buffaloRate = buffaloRate;
    } else if (milkType === 'mix') {
      data.mixRateType = mixRateType;
      data.mixRate = mixRate;
    } else if (milkType === 'both') {
      data.cowRateType = cowRateType;
      data.buffaloRateType = buffaloRateType;
      data.cowRate = cowRate;
      data.buffaloRate = buffaloRate;
    }

    try {
     const token = await AsyncStorage.getItem('token');
 // Replace if needed
      await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Farmer added successfully');

      setFarmerId('');
      setName('');
      setEmail('');
      setPassword('');
      setCowRate('');
      setBuffaloRate('');
      setMixRate('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Add Farmer</Text>

      <TextInput style={styles.input} placeholder="Farmer ID" value={farmerId} onChangeText={setFarmerId} />
      <TextInput style={styles.input} placeholder="Farmer Name" value={name} onChangeText={setName} />

      <Text style={styles.label}>Milk Type</Text>
      <Picker selectedValue={milkType} onValueChange={setMilkType} style={styles.picker}>
        <Picker.Item label="Cow" value="cow" />
        <Picker.Item label="Buffalo" value="buffalo" />
        <Picker.Item label="Mix (Cow + Buffalo)" value="mix" />
        <Picker.Item label="Both (Cow & Buffalo separate)" value="both" />
      </Picker>

      {/* Rate Type selection and input based on milk type */}
      {milkType === 'cow' && (
        <>
          <Text style={styles.label}>Rate Type</Text>
          <Picker selectedValue={rateType} onValueChange={setRateType} style={styles.picker}>
            <Picker.Item label="Fat Based" value="fat" />
            <Picker.Item label="Fixed Rate" value="fixed" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Cow Rate"
            keyboardType="numeric"
            value={cowRate}
            onChangeText={setCowRate}
          />
        </>
      )}

      {milkType === 'buffalo' && (
        <>
          <Text style={styles.label}>Rate Type</Text>
          <Picker selectedValue={rateType} onValueChange={setRateType} style={styles.picker}>
            <Picker.Item label="Fat Based" value="fat" />
            <Picker.Item label="Fixed Rate" value="fixed" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Buffalo Rate"
            keyboardType="numeric"
            value={buffaloRate}
            onChangeText={setBuffaloRate}
          />
        </>
      )}

      {milkType === 'mix' && (
        <>
          <Text style={styles.label}>Rate Type</Text>
          <Picker selectedValue={mixRateType} onValueChange={setMixRateType} style={styles.picker}>
            <Picker.Item label="Fat Based" value="fat" />
            <Picker.Item label="Fixed Rate" value="fixed" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Mix Milk Rate"
            keyboardType="numeric"
            value={mixRate}
            onChangeText={setMixRate}
          />
        </>
      )}

      {milkType === 'both' && (
        <>
          <Text style={styles.label}>Cow Rate Type</Text>
          <Picker selectedValue={cowRateType} onValueChange={setCowRateType} style={styles.picker}>
            <Picker.Item label="Fat Based" value="fat" />
            <Picker.Item label="Fixed Rate" value="fixed" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Cow Rate"
            keyboardType="numeric"
            value={cowRate}
            onChangeText={setCowRate}
          />

          <Text style={styles.label}>Buffalo Rate Type</Text>
          <Picker selectedValue={buffaloRateType} onValueChange={setBuffaloRateType} style={styles.picker}>
            <Picker.Item label="Fat Based" value="fat" />
            <Picker.Item label="Fixed Rate" value="fixed" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Buffalo Rate"
            keyboardType="numeric"
            value={buffaloRate}
            onChangeText={setBuffaloRate}
          />
        </>
      )}

      <TextInput style={styles.input} placeholder="Email (for login)" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password (for login)" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>💾 Save Farmer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f7fa',
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f4f7',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    width: screenWidth - 40,
  },
  picker: {
    backgroundColor: '#f0f4f7',
    marginBottom: 16,
    borderRadius: 10,
    width: screenWidth - 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    width: screenWidth - 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
