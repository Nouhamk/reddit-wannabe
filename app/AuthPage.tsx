// AuthPage.tsx

import React from "react";
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

interface Props {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthPage: React.FC<Props> = ({ setIsAuthenticated }) => {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(true); // To toggle between sign up and sign in
  const auth = getAuth();

  const handleAuthAction = () => {
    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setIsAuthenticated(true);
          const user = userCredential.user;
          console.log("User signed up:", user.email);
        })
        .catch((error) => {
          console.error("Sign Up Error:", error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setIsAuthenticated(true);
          const user = userCredential.user;
          console.log("User signed in:", user.email);
        })
        .catch((error) => {
          console.error("Sign In Error:", error.message);
        });
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
      <View style={styles.buttonContainer}>
        <Button title={isSignUp ? "Sign Up" : "Sign In"} onPress={handleAuthAction} color="#FF5700" />
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
