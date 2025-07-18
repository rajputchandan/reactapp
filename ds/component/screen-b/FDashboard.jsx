import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function FarmerDashboard({ route, navigation }) {
  const farmer = route.params?.farmer || {
    name: 'Ram Kumar',
    farmerId: 'F001',
    milkType: 'both',
    rateType: 'fat',
    cowRate: '6.5',
    buffaloRate: '7.5',
    joinDate: '2024-01-15',
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top row with title and logout */}
      <View style={styles.headerRow}>
        {/* <Text style={styles.title}>👨‍🌾 Farmer Dashboard</Text> */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Farmer Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="person-circle-outline" size={20} /> Farmer Details
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{farmer.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Farmer ID:</Text>
          <Text style={styles.value}>{farmer.farmerId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Join Date:</Text>
          <Text style={styles.value}>{formatDate(farmer.joinDate)}</Text>
        </View>
      </View>

      {/* Milk Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="cow" size={20} /> Milk Information
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Milk Type:</Text>
          <Text style={styles.value}>{farmer.milkType.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rate Type:</Text>
          <Text style={styles.value}>
            {farmer.rateType === 'fat' ? 'Per Fat' : 'Per Liter'}
          </Text>
        </View>
      </View>

      {/* Rate Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="cash-outline" size={20} /> Rate Details
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Cow Rate:</Text>
          <Text style={styles.value}>{farmer.cowRate ? `${farmer.cowRate} ₹` : 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Buffalo Rate:</Text>
          <Text style={styles.value}>
            {farmer.buffaloRate ? `${farmer.buffaloRate} ₹` : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Action Buttons in Row Box */}
      <View style={styles.actionCard}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#3498db' }]}
          onPress={() => navigation.navigate('DailySummary', { farmerId: farmer.farmerId })}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Daily Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#9b59b6' }]}
          onPress={() => navigation.navigate('MonthlyReport', { farmerId: farmer.farmerId })}
        >
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Monthly Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ecf0f1',
    flexGrow: 1,
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  card: {
    width: screenWidth - 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34495e',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionCard: {
    width: screenWidth - 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 3,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
