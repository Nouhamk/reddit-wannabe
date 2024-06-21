import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { db } from '../firebase-config';

interface Props {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthPage: React.FC<Props> = ({ setIsAuthenticated }) => {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [username, onChangeUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const auth = getAuth();
  const firestore = getFirestore();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        email: email,
        username: username,
        age: null, // Add more fields as needed
        followers: 0,
        following: 0,
        avatarUrl: '', // Placeholder for avatar URL
      });

      setIsAuthenticated(true);
      console.log("User signed up:", user.email);
    } catch (error: any) {
      console.error("Sign Up Error:", error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setIsAuthenticated(true);
      console.log("User signed in:", user.email);
    } catch (error: any) {
      console.error("Sign In Error:", error.message);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Reddit-Logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>{isSignUp ? "Sign Up to Reddit" : "Sign In to Reddit"}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
      {isSignUp && (
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="Username"
          autoCapitalize="words"
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title={isSignUp ? "Sign Up" : "Sign In"} onPress={isSignUp ? handleSignUp : handleSignIn} color="#FF5700" />
      </View>
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity style={styles.authButton}>
        <Image
          source={require('../assets/images/Google-logo.png')}
          style={styles.authLogo}
        />
        <Text style={styles.authText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.authButton}>
        <Image
          source={require('../assets/images/Apple.png')}
          style={styles.authLogo}
        />
        <Text style={styles.authText}>Continue with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleAuthMode}>
        <Text style={styles.switchText}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 110,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  orText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#aaa',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginVertical: 5,
  },
  authLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  authText: {
    fontSize: 16,
    color: '#555',
  },
  switchText: {
    marginTop: 20,
    fontSize: 16,
    color: '#007BFF',
  },
});

export default AuthPage;
