import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase-config';
import PostList from '../../components/PostList';

const UserProfile = () => {
  const [user, setUser] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('No user is signed in');
        setLoading(false);
        return;
      }

      console.log('Current user ID:', currentUser.uid);

      const userDocRef = doc(db, 'users', currentUser.uid);
      const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('User data:', docSnapshot.data());
          setUser(docSnapshot.data());
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching user data: ', error);
        setLoading(false);
      });

      return () => {
        unsubscribeUser();
      };
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  const currentUser = auth.currentUser;

  return (
    <ImageBackground
      source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVNYTzliXNM8meVDzddEmaX4GSH3bNUoqqZ-g6PJQEZDzi5FGQ_V5msQX2KTjyiPaJkGs&usqp=CAU' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {user ? (
            <>
              <View style={styles.header}>
                <TouchableOpacity>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Image source={{ uri: user?.avatarUrl }} style={styles.avatar} />
              <Text style={styles.username}>{user.username}</Text>
              <View style={styles.stats}>
                <Text style={styles.statsText}>2 achievements</Text>
                <Text style={styles.statsText}>•</Text>
                <Text style={styles.statsText}>0 followers</Text>
              </View>
              <View style={styles.metaInfo}>
                <Text style={styles.metaInfoText}>u/{user.username} • {user.createdAt ? user.createdAt.toDate().toLocaleDateString() : ''}</Text>
              </View>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>+ Add Social Link</Text>
              </TouchableOpacity>
              <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>Comments</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>About</Text>
                </TouchableOpacity>
              </View>
              <PostList userId={auth.currentUser?.uid} />
            </>
          ) : (
            <Text>No user data available</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  fallbackBackground: {
    backgroundColor: '#f8f8f8',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    fontSize: 16,
    color: '#007BFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#000',
    marginHorizontal: 5,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metaInfoText: {
    fontSize: 14,
    color: '#555',
  },
  linkButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
});

export default UserProfile;
