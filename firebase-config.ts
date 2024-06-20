// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvLx9UYJPwikU4N5A66lIOjhJQEH_ozN0",
  authDomain: "reddit-wannabe.firebaseapp.com",
  projectId: "reddit-wannabe",
  storageBucket: "reddit-wannabe.appspot.com",
  messagingSenderId: "883377091503",
  appId: "1:883377091503:web:8ed0d86259bb43b9f1755a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };
