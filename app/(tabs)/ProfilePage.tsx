import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase-config';

interface UserData {
  accountName: string;
  email: string;
  age: number | null;
  followers: number;
  following: number;
  avatarUrl: string;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null); // Specify UserData type

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const firestore = getFirestore();
        const userId = 'user_id_here'; // Replace with actual user ID
        const docRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Update userData state with retrieved data
          setUserData(docSnap.data() as UserData); // Type assertion to UserData
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Check if userData is null or undefined
  if (!userData) {
    return <Text>Loading...</Text>; // Handle loading state
  }

  // Example of rendering user data
  return (
    <View style={styles.container}>
      <Text>User Name: {userData.accountName}</Text>
      <Text>Email: {userData.email}</Text>
      {/* Render other user information */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default ProfilePage;
