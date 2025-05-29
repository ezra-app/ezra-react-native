import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddReportScreen from '../screens/AddReportScreen';
import ReportListScreen from '../screens/ReportListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import WorkDaysScreen from '../screens/WorkDaysScreen';
import MonthlyGoalScreen from '../screens/MonthlyGoalScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddReport" component={AddReportScreen} />
      <Stack.Screen name="ReportList" component={ReportListScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="WorkDays" component={WorkDaysScreen} />
      <Stack.Screen name="MonthlyGoal" component={MonthlyGoalScreen} />
    </Stack.Navigator>
  );
} 