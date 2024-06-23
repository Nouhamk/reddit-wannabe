import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

interface CommunityProps {
  communityId: string;
  name: string;
  description: string;
  profileImage: string;
  userId: string;
  members: string[];
  onJoin: () => void;
}

const Community = ({ communityId, name, description, profileImage, userId, members, onJoin }: CommunityProps) => {
  const isMember = members.includes(userId);

  return (
    <View style={styles.container}>
      <Link href={`/community/${communityId}`} style={styles.link}>
        <View style={styles.header}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          </View>
      </Link>
          {!isMember && (
            <TouchableOpacity style={styles.buttonJoin} onPress={onJoin}>
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          )}
        
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
    marginVertical: 8,
    marginHorizontal: 16,
  },
  link: {
    textDecorationLine: 'none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  buttonJoin: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 'auto', // Align button to the right
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Community;
