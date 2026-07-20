// frontend/src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Member 1 Screens
import LandingScreen from '../screens/welcome/LandingScreen';
import OnboardingScreen from '../screens/welcome/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';

// Member 2 & 3 Placeholders (Sẽ được thay thế khi TV2 & TV3 ráp code vào)
import QuizScreen from '../screens/main/QuizScreen'; 
import ChatRoomScreen from '../screens/main/ChatRoomScreen';
import LeaderboardScreen from '../screens/stats/LeaderboardScreen';
import AdminDashboardScreen from '../screens/stats/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
      {/* Member 1 Flow */}
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Member 2 Flow */}
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />

      {/* Member 3 Flow */}
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    </Stack.Navigator>
  );
}