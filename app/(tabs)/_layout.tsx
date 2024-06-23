import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import NavBar from '../../components/NavBar'; // Import the styled NavBar component

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <NavBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF4500', // Orange color for active tab
          tabBarInactiveTintColor: '#878A8C', // Default inactive color
        }}
      />
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
            headerShown: false, // Hide header for this screen
          }}
        />

        <Tabs.Screen
          name="CommunityList"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
            ),
            headerShown: false, // Hide header for this screen
          }}
        />
        <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} size={24} color={color} />
    ),
        }}
      />
        <Tabs.Screen
          name="CreatPost"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
            ),
            headerShown: false, // Hide header for this screen
          }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
