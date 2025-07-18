import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, Alert, Modal, TextInput as RNTextInput, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewAllDairyAdmins = ({ navigation }) => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', dairyName: '' });

  const BASE_URL = 'http://192.168.43.119:5000';

  const fetchAdmins = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const res = await axios.get(`${BASE_URL}/api/superadmin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
      setFilteredAdmins(res.data);
    } catch (err) {
      console.error('❌ Fetch Admins Error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = admins.filter(admin =>
      admin.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAdmins(filtered);
  };

 const handleDelete = async (adminId, name, dbName) => {
  Alert.alert(
    'Confirm Delete',
    `Delete admin "${name}"?\n\nDatabase: ${dbName}`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          console.log('✅ Confirm pressed');  // debug
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              console.log('❌ Token missing');
              throw new Error('Token not found');
            }
            const url = `${BASE_URL}/api/superadmin/admins-delete/${adminId}`;
            console.log('➡️ Deleting admin at:', url);  // debug

            const res = await axios.delete(url, {
              headers: { Authorization: `Bearer ${token}` }
            });

            console.log('✅ Deleted response:', res.data);
            Alert.alert('Deleted', 'Admin and database removed');
            fetchAdmins();
          } catch (err) {
            console.error('❌ Delete Error:', err.response?.data || err.message);
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete admin');
          }
        },
        style: 'destructive'
      }
    ]
  );
};


  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const res = await axios.put(`${BASE_URL}/api/superadmin/admins/${selectedAdmin._id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalVisible(false);
      Alert.alert('Updated', 'Admin info updated');
      fetchAdmins();
    } catch (err) {
      console.error('❌ Update Error:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Failed to update admin');
    }
  };

  const renderAdmin = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Dairy Name: {item.dairyName}</Text>
      <Text>DB: {item.dbName}</Text>
      <Text>Username: {item.dairyCode}</Text>
      <Text>Password: {item.password}</Text>
       <Text>JoinAt: {item.createdAt}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => navigation.navigate('DairyData', { admin: item })}>
          <Text style={styles.btnText}>Show All Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => {
            setSelectedAdmin(item);
            setForm({ name: item.name, email: item.email, dairyName: item.dairyName });
            setModalVisible(true);
          }}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item._id, item.name, item.dbName)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="green" />;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by email..."
        value={searchText}
        onChangeText={handleSearch}
        style={styles.search}
      />
      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item._id}
        renderItem={renderAdmin}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Admin</Text>
            <RNTextInput
              placeholder="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              style={styles.input}
            />
            <RNTextInput
              placeholder="Email"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              style={styles.input}
            />
            <RNTextInput
              placeholder="Dairy Name"
              value={form.dairyName}
              onChangeText={(text) => setForm({ ...form, dairyName: text })}
              style={styles.input}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewAllDairyAdmins;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: '#fff' },
  card: { backgroundColor: '#f5f5f5', padding: 14, marginBottom: 12, borderRadius: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
  search: { backgroundColor: '#eee', padding: 10, borderRadius: 10, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  viewBtn: { backgroundColor: '#3498db', padding: 10, borderRadius: 6 },
  updateBtn: { backgroundColor: '#f39c12', padding: 10, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 6 },
  btnText: { color: '#fff' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
});
