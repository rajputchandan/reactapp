import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function AllMilkEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({}); // for collapse/expand

  useEffect(() => {
    const fetchEntries = async () => {
      try {
         const token = await AsyncStorage.getItem('token'); // 👈 get token
        const res = await axios.get("http://192.168.43.119:5000/api/milk/all" ,{
           headers: {
        Authorization: `Bearer ${token}`, // ✅ Add token in header
      },
        });
        setEntries(res.data);
      } catch (err) {
        console.error("Failed to fetch milk entries", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Group entries by farmerId
  const groupedEntries = entries.reduce((acc, entry) => {
    const key = entry.farmerId + " - " + entry.name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const toggleExpand = (farmerId) => {
    setExpanded((prev) => ({ ...prev, [farmerId]: !prev[farmerId] }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📋 All Milk Entries</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : Object.entries(groupedEntries).map(([farmerKey, entries]) => (
        <View key={farmerKey} style={styles.card}>
          <TouchableOpacity onPress={() => toggleExpand(farmerKey)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{farmerKey}</Text>
              <Icon
                name={expanded[farmerKey] ? "chevron-up" : "chevron-down"}
                size={24}
                color="#333"
              />
            </View>
          </TouchableOpacity>

          {expanded[farmerKey] && (
            <View style={styles.entryList}>
              {entries.map((entry, index) => (
                <View key={index} style={styles.entryBox}>
                  <Text>📅 {new Date(entry.date).toDateString()}</Text>
                  <Text>Shift: {entry.shift}</Text>
                  <Text>Milk Type: {entry.milkType}</Text>
                  {entry.liters && <Text>Liters: {entry.liters}</Text>}
                  {entry.fat && <Text>Fat: {entry.fat}</Text>}
                  {entry.cowLiters && <Text>Cow: {entry.cowLiters} L</Text>}
                  {entry.buffaloLiters && <Text>Buffalo: {entry.buffaloLiters} L</Text>}
                  <Text style={{ fontWeight: "bold" }}>💰 ₹{entry.totalPrice}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
  },
  card: {
    backgroundColor: "#f1f8ff",
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  entryList: {
    marginTop: 10,
  },
  entryBox: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});
