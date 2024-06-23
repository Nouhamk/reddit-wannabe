import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavBar = () => {
  return (
    <View style={styles.navBar}>
      <View style={styles.leftIcons}>
        <Ionicons name="menu-outline" size={24} color="#878A8C" />
        <Ionicons name="logo-reddit" size={32} color="#FF4500" style={styles.logo} />
      </View>
      <Text style={styles.title}>Reddit Wannabe</Text>
      <View style={styles.rightIcons}>
        <Ionicons name="search-outline" size={24} color="#878A8C" />
        <Ionicons name="notifications-outline" size={24} color="#878A8C" />
        <Ionicons name="person-circle-outline" size={24} color="#878A8C" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff', // Background color similar to Reddit app
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Border color
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4500', // Title color similar to Reddit app
  },
});

export default NavBar;
