import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dairyId, setDairyId] = useState('');

 const handleLogin = async () => {
  if (!email || !password || (role === 'farmer' && !dairyId)) {
    Alert.alert('Validation Error', 'Please fill all required fields');
    return;
  }

  try {
    const res = await axios.post('http://10.61.9.3:5000/api/admin/login', {
      role,
      email,
      password,
      dairyId: role === 'farmer' ? dairyId : undefined,
    });

    const { token, admin, farmer } = res.data;

    await AsyncStorage.setItem('token', token);

    // ✅ Store data based on role
    if (role === 'admin' || role === 'superadmin') {
      if (admin?.dbName) await AsyncStorage.setItem('dbName', admin.dbName);
      if (admin?.name) await AsyncStorage.setItem('adminName', admin.name);
      if (admin?.dairyName) await AsyncStorage.setItem('dairyName', admin.dairyName);
      if (admin?.dairyCode) await AsyncStorage.setItem('dairyCode', admin.dairyCode);
    }

    if (role === 'farmer') {
      if (farmer?.name) await AsyncStorage.setItem('farmerName', farmer.name);
      if (farmer?.farmerId) await AsyncStorage.setItem('farmerId', farmer.farmerId);
      if (farmer?.dairyId) await AsyncStorage.setItem('dairyId', farmer.dairyId);
    }

    // ✅ Navigate based on actual role
    const userRole = admin?.role || farmer?.role;

    if (userRole === 'superadmin') {
      navigation.replace('SuperAdminDashboard');
    } else if (userRole === 'admin') {
      navigation.replace('Dashboard');
    } else if (userRole === 'farmer') {
      navigation.replace('FarmerDashboard');
    } else {
      Alert.alert('Unknown Role');
    }

  } catch (err) {
    console.error(err.response?.data || err.message);
    Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
  }
};


  return (
    <View style={styles.container}>
      <LinearGradient colors={['#2193b0', '#6dd5ed']} style={styles.header}>
        <Text style={styles.headerText}>Welcome to Dairy Management System</Text>
      </LinearGradient>

      <Text style={styles.headerTextl}>Please Login</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'admin' && styles.activeRole]}
          onPress={() => setRole('admin')}
        >
          <Text style={styles.roleText}>Login as Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'farmer' && styles.activeRole]}
          onPress={() => setRole('farmer')}
        >
          <Text style={styles.roleText}>Login as Farmer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {role === 'farmer' && (
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Dairy ID"
              style={styles.input}
              value={dairyId}
              onChangeText={setDairyId}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 260,
    width: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 70,
  },
  headerText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTextl: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  form: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
  },
  button: {
    backgroundColor: '#2193b0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  roleButton: {
    borderColor: '#2193b0',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  activeRole: {
    backgroundColor: '#2193b0',
  },
  roleText: {
    color: '#000',
    fontSize: 14,
  },
});
