import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

interface Props {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutPage: React.FC<Props> = ({ setIsAuthenticated }) => {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
      })
      .catch((error) => {
        console.error('Logout Error:', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to log out?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} color="#FF5700" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default LogoutPage;
