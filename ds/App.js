import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LandingScreen from './component/LandingScreen/LandingScreen';
import AddMilkEntry from './component/screen-a/AddMilkEntry';
import Dashboard from './component/screen-a/Dashbord';
import AddFarmer from './component/screen-a/AddFarmer';
import MilkRateScreen from './component/screen-a/MilkRate';
import DailySummary from './component/screen-a/DailySummary';
import MonthlyReport from './component/screen-a/MonthReport';
import ViewAllFarmers from './component/screen-a/ViewAllFarmer';
import AllMilkEntries from './component/screen-a/AllMilkEntries';
import Login from './component/loginScreen/Login';
import Img from './assets/icon.png'; // your admin profile image
import FarmerDashboard from './component/screen-b/FDashboard'; // Farmer Dashboard
import Rgester from './component/loginScreen/RegisterScreen'; 
import SuperAdminDashboard from './component/SupperAdminScreen/SuperAdminDashboard';
import ViewAllDairyAdmins from './component/SupperAdminScreen/ViewAllDairyAdmins';
import SuperViewAllFarmers from './component/SupperAdminScreen/AllFarmersScreen';
import AdminDailyMilkSummary from './component/SupperAdminScreen/DailyMilkSummaryScreen'; // Admin Daily Milk Summary
import SuperAdminMonthlySummary from './component/SupperAdminScreen/SuperAdminMonthlySummary'; // Super Admin Monthly Summary
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="LandingScreen">
        <Stack.Screen name="Login" component={Login}  />
        {/* ✅ Customized Dashboard Header */}
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />


  <Stack.Screen
          name="FarmerDashboard"
          component={FarmerDashboard}
          options={{
            headerTitle: '👨‍🌾 Farmer Dashboard', // Hide default title
            headerRight: () => (
              <View style={styles.headerFarmer}>
                
                
                <Image source={Img} style={styles.profileImage} />
                <TouchableOpacity>
                  <Ionicons name="notifications-outline" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        {/* ✅ Other screens with default header */}
        <Stack.Screen name="AddMilkEntry" component={AddMilkEntry} />
        <Stack.Screen name="AddFarmer" component={AddFarmer} />
        <Stack.Screen name="MilkRate" component={MilkRateScreen} />
        <Stack.Screen name="DailySummary" component={DailySummary} />
        <Stack.Screen name="MonthlyReport" component={MonthlyReport} />
        <Stack.Screen name="AllFarmers" component={ViewAllFarmers} />
        <Stack.Screen name="AllMilkEntry" component={AllMilkEntries} />
        <Stack.Screen name="LandingScreen" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Rgester} options={{ headerShown: false }} />
        <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="ViewAllDairyAdmins" component={ViewAllDairyAdmins}  />
        <Stack.Screen name="SuperViewAllFarmers" component={SuperViewAllFarmers}  />
        <Stack.Screen name="AdminDailyMilkSummary" component={AdminDailyMilkSummary}  />
        <Stack.Screen name="SuperAdminMonthlySummary" component={SuperAdminMonthlySummary}  />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerRight: {

    flexDirection: 'row',
    alignItems: 'center',
    // gap: 8,
    width: 190,
    height: 50,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerFarmer: {
    flexDirection: 'row',
    alignItems: 'center',
  justifyContent: 'flex-end',
    gap: 8,
    width: 150,
    height: 50,
    // borderWidth:2,
    marginLeft:60,
    paddingRight: 20,
  }
});
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import Login from './component/loginScreen/Login';
// import AdminDashboard from './';
// import FarmerDashboard from './screens/farmer/FarmerDashboard';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
//         <Stack.Screen name="FarmerDashboard" component={FarmerDashboard} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
