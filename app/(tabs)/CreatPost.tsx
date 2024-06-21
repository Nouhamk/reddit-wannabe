import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { db, auth } from '../../firebase-config'; // Importing auth as well
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const PostCreationPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();

  const handleNext = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('User is not logged in');
        return;
      }

      await addDoc(collection(db, 'Posts'), {
        title,
        content,
        email: user.email, // Storing the user email
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      navigation.goBack(); // Navigate back after successful submission
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextButton}>Next</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.titleInput}
        onChangeText={setTitle}
        value={title}
        placeholder="Title"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.contentInput}
        onChangeText={setContent}
        value={content}
        placeholder="Content"
        placeholderTextColor="#aaa"
        multiline
      />
      <View style={styles.iconBar}>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="image-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="link-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="videocam-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <Ionicons name="bar-chart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextButton: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    textAlignVertical: 'top',
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  icon: {
    marginRight: 16,
  },
});

export default PostCreationPage;
