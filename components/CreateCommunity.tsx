import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { db, auth } from '../firebase-config'; // Importing auth as well
import { addDoc, collection, serverTimestamp, updateDoc, doc, arrayUnion } from 'firebase/firestore';

const CreateCommunity = () => {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const handleCreateCommunity = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('User is not logged in');
        return;
      }

      const communityDocRef = await addDoc(collection(db, 'Communities'), {
        name: communityName,
        description: description,
        creatorId: user.uid,
        createdAt: serverTimestamp(),
        members: [user.uid], // Adding the creator as a member
      });

      // Optionally update the user's document to include the new community
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        communities: arrayUnion(communityDocRef.id),
      });

      navigation.goBack(); // Navigate back after successful creation
    } catch (error) {
      console.error('Error creating community: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateCommunity}>
          <Text style={styles.createButton}>Create</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setCommunityName}
        value={communityName}
        placeholder="Community Name"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        placeholder="Description"
        placeholderTextColor="#aaa"
        multiline
      />
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
  createButton: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
});

export default CreateCommunity;
