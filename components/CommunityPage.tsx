import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase-config'; // Adjust path as necessary

interface CommunityPageProps {
  communityId: string; // Prop for communityId
}

interface CommunityData {
  name: string;
  description: string;
  profileImage: string;
  bannerImage: string;
  members: string[];
}

interface PostData {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: any;
}

const CommunityPageComponent = ({ communityId }: CommunityPageProps) => {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'members'>('posts');
  const [userId, setUserId] = useState<string | null>(null);

  const fetchCommunity = async () => {
    try {
      const docRef = doc(db, 'Communities', communityId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCommunity(docSnap.data() as CommunityData);
      } else {
        console.log('No such community!');
      }
    } catch (error) {
      console.error('Error fetching community: ', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const postsQuery = query(collection(db, 'Posts'), where('communityId', '==', communityId));
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PostData[];
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const handleJoinCommunity = async () => {
    if (!userId || !community) return;

    try {
      // Add user to community members
      const communityRef = doc(db, 'Communities', communityId);
      await updateDoc(communityRef, {
        members: arrayUnion(userId),
      });

      // Add community to user's list of communities
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        communities: arrayUnion(communityId),
      });

      // Update local state to reflect the change
      setCommunity({
        ...community,
        members: [...community.members, userId],
      });
    } catch (error) {
      console.error('Error joining community: ', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };

    fetchUser();
    fetchCommunity();
    fetchPosts();
  }, [communityId]);

  if (!community) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: community.bannerImage }} style={styles.bannerImage} />
      <TouchableOpacity style={styles.returnButton} onPress={() => console.log('Return button pressed')}>
        <Text style={styles.returnButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Image source={{ uri: community.profileImage }} style={styles.profileImage} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{community.name}</Text>
          <Text style={styles.description}>{community.description}</Text>
        </View>
        {!community.members.includes(userId!) && (
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinCommunity}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'posts' ? styles.activeTab : null]}
          onPress={() => setSelectedTab('posts')}
        >
          <Text style={styles.tabButtonText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'members' ? styles.activeTab : null]}
          onPress={() => setSelectedTab('members')}
        >
          <Text style={styles.tabButtonText}>Members</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'posts' ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
              <Text style={styles.postUsername}>By {item.username}</Text>
              <Text style={styles.postDate}>{new Date(item.createdAt.toDate()).toLocaleString()}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.membersText}>Members content will go here</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  returnButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 50,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -50,
    zIndex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#777',
  },
  joinButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6347',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  post: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
  },
  postUsername: {
    fontSize: 14,
    color: '#555',
  },
  postDate: {
    fontSize: 12,
    color: '#888',
  },
  membersText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default CommunityPageComponent;
