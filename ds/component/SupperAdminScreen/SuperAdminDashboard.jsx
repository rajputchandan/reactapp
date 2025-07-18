import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SuperAdminDashboard = () => {
  const navigation = useNavigation();

  const options = [
    {
      title: 'Manage All Admins',
      icon: 'account-multiple',
      screen: 'ViewAllDairyAdmins',
      color: '#1abc9c',
    },
    {
      title: 'View All Farmers',
      icon: 'cow',
      screen: 'SuperViewAllFarmers',
      color: '#3498db',
    },
    {
      title: 'Milk Entry Records',
      icon: 'glass-mug-variant',
      screen: 'SuperAdminMonthlySummary',
      color: '#f39c12',
    },
    {
      title: 'Daily Milk Summary',
      icon: 'calendar-month-outline',
      screen: 'AdminDailyMilkSummary',
      color: '#9b59b6',
    },
  ];

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('token'); // if token stored
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>👑 Super Admin Dashboard</Text>

      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate(item.screen)}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Icon name={item.icon} size={26} color={item.color} />
          </View>
          <Text style={styles.cardText}>{item.title}</Text>
          <Icon name="chevron-right" size={24} color="#ccc" style={styles.chevron} />
        </TouchableOpacity>
      ))}

      {/* 🔒 Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f6f8',
    flexGrow: 1,
  },
  heading: {
    
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
    marginTop: 10,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  chevron: {
    marginLeft: 10,
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: '#ffecec',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SuperAdminDashboard;
