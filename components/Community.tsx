import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface CommunityProps {
  name: string;
  description: string;
  profileImage: string;
}

const Community = ({ name, description, profileImage }: CommunityProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
        </View>
        <TouchableOpacity style={[styles.button, styles.buttonJoin]}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    margin: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonJoin: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // More rounded corners
    marginRight: 8,  
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
});

export default Community;
