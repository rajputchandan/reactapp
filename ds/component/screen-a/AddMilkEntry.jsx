import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function AddMilkEntry() {
  const [allFarmers, setAllFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [milkEntryType, setMilkEntryType] = useState("");
  const [rateType, setRateType] = useState("");
  const [cowRateType, setCowRateType] = useState("");
  const [buffaloRateType, setBuffaloRateType] = useState("");
  const [cowLiters, setCowLiters] = useState("");
  const [buffaloLiters, setBuffaloLiters] = useState("");
  const [liters, setLiters] = useState("");
  const [cowFat, setCowFat] = useState("");
  const [buffaloFat, setBuffaloFat] = useState("");
  const [fat, setFat] = useState("");
  const [snf, setSnf] = useState("");
  const [cowSnf, setCowSnf] = useState("");
  const [buffaloSnf, setBuffaloSnf] = useState("");
  const [price, setPrice] = useState(0);
  const [cowPrice, setCowPrice] = useState(0);
  const [buffaloPrice, setBuffaloPrice] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
            const token = await AsyncStorage.getItem('token'); // 👈 get token
        const res = await axios.get("http://192.168.43.119:5000/api/farmers/all" , {
            headers: {
        Authorization: `Bearer ${token}`, // ✅ Add token in header
      },
        });
        setAllFarmers(res.data);
      } catch (err) {
        Alert.alert("Error", "Failed to load farmers");
      }
    };
    fetchFarmers();
  }, []);

  const getShift = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "AM" : "PM";
  };

 useEffect(() => {
  if (!selectedFarmer) return;

  let total = 0,
    cowTotal = 0,
    buffaloTotal = 0;

  const fatVal = parseFloat(fat || 0);
  const cowFatVal = parseFloat(cowFat || 0);
  const buffaloFatVal = parseFloat(buffaloFat || 0);
  const litersVal = parseFloat(liters || 0);
  const cowLitersVal = parseFloat(cowLiters || 0);
  const buffaloLitersVal = parseFloat(buffaloLiters || 0);

  if (milkEntryType === "both") {
    if (cowRateType === "fixed") {
      cowTotal = cowLitersVal * selectedFarmer.cowRate;
    } else {
      cowTotal = cowLitersVal * cowFatVal * selectedFarmer.cowRate;
    }

    if (buffaloRateType === "fixed") {
      buffaloTotal = buffaloLitersVal * selectedFarmer.buffaloRate;
    } else {
      buffaloTotal = buffaloLitersVal * buffaloFatVal * selectedFarmer.buffaloRate;
    }

    total = cowTotal + buffaloTotal;

  } else if (milkEntryType === "cow") {
    if (rateType === "fixed") {
      total = litersVal * selectedFarmer.cowRate;
    } else {
      total = litersVal * fatVal * selectedFarmer.cowRate;
    }

  } else if (milkEntryType === "buffalo") {
    if (rateType === "fixed") {
      total = litersVal * selectedFarmer.buffaloRate;
    } else {
      total = litersVal * fatVal * selectedFarmer.buffaloRate;
    }

  } else if (milkEntryType === "mix") {
    if (selectedFarmer.mixRateType === "fixed") {
      total = litersVal * selectedFarmer.mixRate;
    } else {
      total = litersVal * fatVal * selectedFarmer.mixRate;
    }
  }

  setPrice(total.toFixed(2));
  setCowPrice(cowTotal.toFixed(2));
  setBuffaloPrice(buffaloTotal.toFixed(2));
}, [
  liters,
  cowLiters,
  buffaloLiters,
  fat,
  cowFat,
  buffaloFat,
  selectedFarmer,
  milkEntryType,
  rateType,
  cowRateType,
  buffaloRateType,
]);



  const handleFarmerSelect = (id) => {
    const farmer = allFarmers.find((f) => f.farmerId === id);
    if (!farmer) return;

    setSelectedFarmerId(id);
    setSelectedFarmer(farmer);
    setRateType(farmer?.rateType || "");
    setMilkEntryType(farmer?.milkType || "");
    setCowRateType(farmer?.cowRateType || "");
    setBuffaloRateType(farmer?.buffaloRateType || "");
    setCowLiters("");
    setBuffaloLiters("");
    setCowFat("");
    setBuffaloFat("");
    setLiters("");
    setFat("");
    setSnf("");
    setCowSnf("");
    setBuffaloSnf("");
    setPrice(0);
    setCowPrice(0);
    setBuffaloPrice(0);
  };

  const handleSubmit = async () => {
    if (!selectedFarmer) return Alert.alert("Error", "Please select a farmer");

    const payload = {
      farmerId: selectedFarmer.farmerId,
      name: selectedFarmer.name,
      date: date,
      shift: getShift(),
      milkType: milkEntryType,
      rateType: rateType,
      cowRateType,
      buffaloRateType,
      liters,
      fat,
      snf,
      cowLiters,
      cowFat,
      cowSnf,
      buffaloLiters,
      buffaloFat,
      buffaloSnf,
      cowPrice,
      buffaloPrice,
      totalPrice: price,
    };

    try {
       const token = await AsyncStorage.getItem('token');
  const res = await axios.post("http://192.168.43.119:5000/api/milk/add", payload ,{
     headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
  });
  Alert.alert("✅ Success", `Milk entry saved. Total Price ₹${price}`);
  resetForm();
} catch (err) {
  if (err.response && err.response.status === 400) {
    // Custom backend error like duplicate shift
    Alert.alert("⚠️ Duplicate Entry", err.response.data.message);
  } else {
    Alert.alert("❌ Error", "Failed to save milk entry. Please try again.");
    console.log("Save error:", err);
  }
}

resetForm();
  };

  const resetForm = () => {
    setSelectedFarmer(null);
    setSelectedFarmerId("");
    setMilkEntryType("");
    setRateType("");
    setCowRateType("");
    setBuffaloRateType("");
    setCowLiters("");
    setBuffaloLiters("");
    setLiters("");
    setCowFat("");
    setBuffaloFat("");
    setFat("");
    setSnf("");
    setCowSnf("");
    setBuffaloSnf("");
    setPrice(0);
    setCowPrice(0);
    setBuffaloPrice(0);
    setDate(new Date());
  };

  const renderInputs = () => {
    if (milkEntryType === "both") {
      return (
        <>
          <TextInput style={styles.input} placeholder="Cow Liters" value={cowLiters} onChangeText={setCowLiters} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder={cowRateType === "fat" ? "Cow Fat (Fat Based)" : "Cow Fat (Fixed Rate, Still Required)"} value={cowFat} onChangeText={setCowFat} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Cow SNF (Optional)" value={cowSnf} onChangeText={setCowSnf} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Buffalo Liters" value={buffaloLiters} onChangeText={setBuffaloLiters} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder={buffaloRateType === "fat" ? "Buffalo Fat (Fat Based)" : "Buffalo Fat (Fixed Rate, Still Required)"} value={buffaloFat} onChangeText={setBuffaloFat} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Buffalo SNF (Optional)" value={buffaloSnf} onChangeText={setBuffaloSnf} keyboardType="numeric" />
        </>
      );
    } else {
      return (
        <>
          <TextInput style={styles.input} placeholder="Liters" value={liters} onChangeText={setLiters} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder={rateType === "fat" ? "Fat (Fat Based)" : "Fat (Fixed Rate, Still Required)"} value={fat} onChangeText={setFat} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="SNF (Optional)" value={snf} onChangeText={setSnf} keyboardType="numeric" />
        </>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
{selectedFarmer && (
  <View style={styles.topBoxContainer}>
    <View style={styles.topBox}>
      {milkEntryType === "both" ? (
        <>
          <Text style={styles.topBoxValue}>
            Cow: ₹
            {selectedFarmer?.cowRateType === "fat"
              ? `${selectedFarmer?.cowRate} /Fat`
              : `${selectedFarmer?.cowRate} /Ltr`}
          </Text>
          <Text style={styles.topBoxValue}>
            Buffalo: ₹
            {selectedFarmer?.buffaloRateType === "fat"
              ? `${selectedFarmer?.buffaloRate} /Fat`
              : `${selectedFarmer?.buffaloRate} /Ltr`}
          </Text>
        </>
      ) : milkEntryType === "mix" ? (
        <Text style={styles.topBoxValue}>
          ₹
          {selectedFarmer?.mixRateType === "fat"
            ? `${selectedFarmer?.mixRate} /Fat`
            : `${selectedFarmer?.mixRate} /Ltr`}
        </Text>
      ) : milkEntryType === "cow" ? (
        <Text style={styles.topBoxValue}>
          ₹
          {selectedFarmer?.rateType === "fat"
            ? `${selectedFarmer?.cowRate} /Fat`
            : `${selectedFarmer?.cowRate} /Ltr`}
        </Text>
      ) : milkEntryType === "buffalo" ? (
        <Text style={styles.topBoxValue}>
          ₹
          {selectedFarmer?.rateType === "fat"
            ? `${selectedFarmer?.buffaloRate} /Fat`
            : `${selectedFarmer?.buffaloRate} /Ltr`}
        </Text>
      ) : null}
    </View>

    <View style={styles.topBox}>
      <Text style={styles.topBoxValue}>{getShift()}</Text>
    </View>
  </View>
)}


      <Picker selectedValue={selectedFarmerId} onValueChange={handleFarmerSelect} style={styles.input}>
        <Picker.Item label="Select Farmer" value="" />
        {allFarmers.map((f) => (
          <Picker.Item key={f.farmerId} label={`${f.farmerId} - ${f.name}`} value={f.farmerId} />
        ))}
      </Picker>

      {selectedFarmer && (
        <>
          <Text style={styles.label}>Milk Type</Text>
          <Picker selectedValue={milkEntryType} onValueChange={setMilkEntryType} style={styles.input}>
            <Picker.Item label="Cow" value="cow" />
            <Picker.Item label="Buffalo" value="buffalo" />
            <Picker.Item label="Both" value="both" />
            <Picker.Item label="Mix" value="mix" />
          </Picker>

          {milkEntryType === "both" ? (
            <>
              <Text style={styles.label}>Cow Rate Type</Text>
              <Picker selectedValue={cowRateType} onValueChange={setCowRateType} style={styles.input}>
                <Picker.Item label="Fixed" value="fixed" />
                <Picker.Item label="Fat Based" value="fat" />
              </Picker>
              <Text style={styles.label}>Buffalo Rate Type</Text>
              <Picker selectedValue={buffaloRateType} onValueChange={setBuffaloRateType} style={styles.input}>
                <Picker.Item label="Fixed" value="fixed" />
                <Picker.Item label="Fat Based" value="fat" />
              </Picker>
            </>
          ) : (
            <>
              <Text style={styles.label}>Rate Type</Text>
              <Picker selectedValue={rateType} onValueChange={setRateType} style={styles.input}>
                <Picker.Item label="Fixed" value="fixed" />
                <Picker.Item label="Fat Based" value="fat" />
              </Picker>
            </>
          )}
        </>
      )}

      {renderInputs()}

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
        <Text>
          <Icon name="calendar" size={16} /> {date.toDateString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selected) => {
            setShowPicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      <View style={styles.priceRow}>
        {milkEntryType === "both" && (
          <>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Cow Price</Text>
              <Text style={styles.priceValue}>₹ {cowPrice}</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Buffalo Price</Text>
              <Text style={styles.priceValue}>₹ {buffaloPrice}</Text>
            </View>
          </>
        )}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceValue}>₹ {price}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>✅ Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 20 },

  topBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  topBox: {
    backgroundColor: "#e6f7ff",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#ccc",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  topBoxTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 5,
  },
  topBoxValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
  },

  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  label: { fontWeight: "600", marginBottom: 5, marginTop: 5, color: "#444" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    flexWrap: "wrap",
    gap: 10,
  },
  priceBox: {
    backgroundColor: "#f1f8ff",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#ccc",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
});
