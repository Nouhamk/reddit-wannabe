import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons package

interface PostProps {
  title: string;
  content: string;
  username: string;
  time: string;
}

const Post = ({ title, content, username, time }: PostProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }} // Example avatar image
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome5 name="ellipsis-h" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="arrow-up" size={20} color="#878A8C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="arrow-down" size={20} color="#878A8C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="comment" size={20} color="#878A8C" />
          <Text style={styles.actionButtonText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="share" size={20} color="#878A8C" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1, // Add bottom border
    borderBottomColor: '#ccc', // Border color
    padding: 16,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: '#777',
  },
  followButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // More rounded corners
    marginRight: 8,  
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moreButton: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#555',
  },
});

export default Post;
