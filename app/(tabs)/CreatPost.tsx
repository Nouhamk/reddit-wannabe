import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from 'expo-router';
import { db, auth } from '../../firebase-config'; 
import { addDoc, collection, getDoc, doc, serverTimestamp } from 'firebase/firestore';

const PostCreationPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Reset the state when the screen is focused
      setTitle('');
      setContent('');
    }, [])
  );

  const handleNext = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('User is not logged in');
        return;
      }

      // Fetch the user's profile from Firestore to get the username
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.log('User document does not exist');
        return;
      }
      const userData = userDoc.data();

      await addDoc(collection(db, 'Posts'), {
        title,
        content,
        email: user.email, // Storing the user email
        userId: user.uid,
        createdAt: serverTimestamp(),
        uid: user.uid, // Storing the user ID
        username: userData?.username, // Storing the user username
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
        placeholderTextColor="Title"
      />
      <TextInput
        style={styles.contentInput}
        onChangeText={setContent}
        value={content}
        placeholder="Content"
        placeholderTextColor="#Text"
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
