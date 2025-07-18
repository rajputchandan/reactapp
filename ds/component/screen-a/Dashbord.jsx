import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Img from '../../assets/icon.png'; // Your local admin icon

const screenWidth = Dimensions.get('window').width;

export default function Dashbord({ navigation }) {
  const [adminName, setAdminName] = useState('');
  const [dairyName, setDairyName] = useState('');
  const [dairyCode, setDairyCode] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      const name = await AsyncStorage.getItem('adminName');
      const dairy = await AsyncStorage.getItem('dairyName');
      const code = await AsyncStorage.getItem('dairyCode');
      if (name) setAdminName(name);
      if (dairy) setDairyName(dairy);
      if (code) setDairyCode(code);
    };
    fetchInfo();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar */}
      <View style={styles.navBar}>
        <View style={styles.rightNav}>
          <Image source={Img} style={styles.profileImage} />
          <View style={styles.nameInfo}>
            <Text style={styles.adminName}>{adminName || 'Admin'}</Text>
            <Text style={styles.dairyNameText}>
              {dairyName || 'No Dairy'} ({dairyCode || 'No Code'})
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#e53935" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Welcome to Dashboard</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AllFarmers')}>
          <Text style={styles.cardText}>👨‍🌾 View All Farmers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddMilkEntry')}>
          <Text style={styles.cardText}>🍼 Add Milk Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AllMilkEntry')}>
          <Text style={styles.cardText}>📋 All Milk Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DailySummary')}>
          <Text style={styles.cardText}>📊 Daily Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MonthlyReport')}>
          <Text style={styles.cardText}>📆 Monthly Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddFarmer')}>
          <Text style={styles.cardText}>➕ Add Farmer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MilkRate')}>
          <Text style={styles.cardText}>💰 Milk Rate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef3f9',
    paddingBottom: 20,
    alignItems: 'center',
    minHeight: '100%',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 16,
    marginTop: 12,
  },
  rightNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  nameInfo: {
    flexDirection: 'column',
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dairyNameText: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
  logoutButton: {
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
    width: screenWidth,
  },
  cardContainer: {
    width: screenWidth - 32,
  },
  card: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginVertical: 8,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 5,
    borderLeftColor: '#4a90e2',
  },
  cardText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});
