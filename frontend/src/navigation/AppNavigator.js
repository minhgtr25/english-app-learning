import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from '../screens/welcome/LandingScreen';
import OnboardingScreen from '../screens/welcome/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import QuizScreen from '../screens/main/QuizScreen';
import ChatRoomScreen from '../screens/main/ChatRoomScreen';
import LeaderboardScreen from '../screens/stats/LeaderboardScreen';
import AdminDashboardScreen from '../screens/stats/AdminDashboardScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { useAuth } from '../state/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { booting, isAuthenticated } = useAuth();

  if (booting) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? 'Home' : 'Landing'}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
