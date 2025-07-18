// ✅ ViewAllFarmersScreen with Both Milk Type Support (Separate Cow/Buffalo RateType)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const API_BASE = "http://192.168.43.119:5000/api/farmers";

const ViewAllFarmersScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    fetchFarmers();
  }, []);

 const fetchFarmers = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); // 👈 get token

    const res = await axios.get(`${API_BASE}/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Add token in header
      },
    });

    setFarmers(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    Alert.alert("Error", "Failed to fetch farmers");
  }
};

  const openUpdateModal = (farmer) => {
    setSelectedFarmer(farmer);
    setUpdatedData({ ...farmer });
    setModalVisible(true);
  };

  const handleUpdateSave = async () => {
  try {
    const token = await AsyncStorage.getItem('token'); // 👈 fetch token
    await axios.put(`${API_BASE}/update/${selectedFarmer._id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ pass token
      },
    });

    Alert.alert("Success", "Farmer updated successfully");
    fetchFarmers();
    setModalVisible(false);
  } catch (err) {
    console.error(err.response?.data || err.message);
    Alert.alert("Error", "Failed to update farmer");
  }
};


const handleDelete = (id) => {
  Alert.alert("Confirm Delete", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          const token = await AsyncStorage.getItem('token'); // 👈 fetch token
          await axios.delete(`${API_BASE}/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ pass token
            },
          });

          fetchFarmers();
          Alert.alert("Deleted", "Farmer deleted successfully");
        } catch (err) {
          console.error(err.response?.data || err.message);
          Alert.alert("Error", "Failed to delete farmer");
        }
      },
    },
  ]);
};


  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.farmerId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👨‍🌾 All Farmers</Text>

      <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#777" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search by name or ID"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>
      <Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }}>
    <View style={{
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Update Farmer</Text>

      <TextInput
        placeholder="Name"
        value={updatedData.name}
        onChangeText={(text) => setUpdatedData({ ...updatedData, name: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={updatedData.email}
        onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={updatedData.password}
        secureTextEntry
        onChangeText={(text) => setUpdatedData({ ...updatedData, password: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      {/* Add more fields as needed, based on milkType */}
      {/* You can conditionally show fields here like cowRate, etc. */}

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            marginRight: 10,
            backgroundColor: '#ccc',
            borderRadius: 6,
          }}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpdateSave}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            backgroundColor: '#3B82F6',
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#fff' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      <ScrollView contentContainerStyle={styles.scrollArea}>
        {filteredFarmers.map((farmer, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>
              <Icon name="person-circle-outline" size={18} /> {farmer.name}
            </Text>
            <Text style={styles.detail}>ID: {farmer.farmerId}</Text>
            <Text style={styles.detail}>Email: {farmer.email}</Text>
            <Text style={styles.detail}>Milk Type: {farmer.milkType}</Text>
            <Text style={styles.detail}>Role: {farmer.role}</Text>

            {farmer.milkType === "both" ? (
              <>
                <Text style={styles.detail}>Cow Rate Type: {farmer.cowRateType}</Text>
                <Text style={styles.detail}>Cow Rate: ₹{farmer.cowRate}</Text>
                <Text style={styles.detail}>Buffalo Rate Type: {farmer.buffaloRateType}</Text>
                <Text style={styles.detail}>Buffalo Rate: ₹{farmer.buffaloRate}</Text>
              </>
            ) : farmer.milkType === "mix" ? (
              <>
                <Text style={styles.detail}>Rate Type: {farmer.rateType}</Text>
                <Text style={styles.detail}>Mix Rate: ₹{farmer.fixedRate || farmer.cowRate}</Text>
              </>
            ) : (
              <>
                <Text style={styles.detail}>Rate Type: {farmer.rateType}</Text>
                <Text style={styles.detail}>
                  {farmer.milkType.charAt(0).toUpperCase() + farmer.milkType.slice(1)} Rate: ₹
                  {farmer.fixedRate || farmer.cowRate || farmer.buffaloRate}
                </Text>
              </>
            )}

            <Text style={styles.detail}>
              Join Date: {new Date(farmer.createdAt).toLocaleDateString()}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.updateBtn} onPress={() => openUpdateModal(farmer)}>
                <Icon name="create-outline" size={16} color="#fff" />
                <Text style={styles.btnText}> Update</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(farmer._id)}>
                <Icon name="trash-outline" size={16} color="#fff" />
                <Text style={styles.btnText}> Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {filteredFarmers.length === 0 && <Text style={styles.noResult}>No farmers found.</Text>}
      </ScrollView>
    </View>
  );
};

export default ViewAllFarmersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F4F6" },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#111827",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 15 },
  scrollArea: { paddingBottom: 80 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1F2937",
  },
  detail: { fontSize: 14, marginBottom: 2, color: "#374151" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  updateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  noResult: {
    textAlign: "center",
    marginTop: 30,
    color: "#6B7280",
  },
});