import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Dashbord';
import AddFarmer from './AddFarmer';
import ViewFarmers from './ViewAllFarmer';

const Tab = createBottomTabNavigator();

export default function AdminDashboard() {
  return (

      <Tab.Screen name="Home"  component={Home} />
      
    
  );
}
