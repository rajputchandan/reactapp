import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../assets/icon.png';

const screenWidth = Dimensions.get('window').width;

const features = [
  { icon: 'account-multiple', label: 'Farmer Management' },
  { icon: 'calendar-month', label: 'Milk Records' },
  { icon: 'chart-line', label: 'Daily Reports' },
  { icon: 'database-lock', label: 'Secure DB' },
  { icon: 'cash-multiple', label: 'Salary Tracker' },
];

const LandingScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#ffffff', '#e8f5e9']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Hero */}
        <LinearGradient colors={['#a5d6a7', '#e8f5e9']} style={styles.hero}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.appName}>Multi-Dairy Manager</Text>
          <Text style={styles.subTitle}>Modern solution for dairy owners</Text>
        </LinearGradient>

        {/* Stat Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="home" size={24} color="#2e7d32" />
            <Text style={styles.statValue}>05</Text>
            <Text style={styles.statLabel}>Dairies</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#2e7d32" />
            <Text style={styles.statValue}>312</Text>
            <Text style={styles.statLabel}>Farmers</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="water" size={24} color="#2e7d32" />
            <Text style={styles.statValue}>24k</Text>
            <Text style={styles.statLabel}>Litres</Text>
          </View>
        </View>

        {/* Feature Scroll */}
        <Text style={styles.sectionTitle}>✨ Features</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={features}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.featureCard}>
              <MaterialCommunityIcons name={item.icon} size={28} color="#1b5e20" />
              <Text style={styles.featureLabel}>{item.label}</Text>
            </View>
          )}
        />

        {/* Gallery */}
        <Text style={styles.sectionTitle}>📸 Dairy Preview</Text>
        <View style={styles.previewRow}>
          <Image source={require('../../assets/icon.png')} style={styles.previewImg} />
          <Image source={require('../../assets/icon.png')} style={styles.previewImg} />
          <Image source={require('../../assets/icon.png')} style={styles.previewImg} />
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Register')}>
            <Ionicons name="person-add" size={24} color="#fff" />
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
            <Ionicons name="log-in" size={24} color="#2e7d32" />
            <Text style={[styles.btnText, { color: '#2e7d32' }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  hero: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  welcome: {
    fontSize: 16,
    color: '#2e7d32',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  subTitle: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginTop: 30,
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: '#e0f2f1',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    width: 120,
    elevation: 2,
  },
  featureLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#1b5e20',
    textAlign: 'center',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  previewImg: {
    width: '30%',
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  btnPrimary: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    width: '45%',
    justifyContent: 'center',
  },
  btnSecondary: {
    backgroundColor: '#e8f5e9',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    width: '45%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  btnText: {
    fontSize: 16,
    marginLeft: 6,
    fontWeight: 'bold',
    color: '#fff',
  },
});
