import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, orderBy, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase-config'; // Adjust path as necessary
import Community from '../../components/Community';

interface CommunityData {
  id: string;
  name: string;
  description: string;
  profileImage: string;
  members: string[]; // List of community members
}

const CommunityList = () => {
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'Communities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const communitiesData: CommunityData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'No Name',
          description: data.description || 'No Description',
          profileImage: data.profileImage || 'https://via.placeholder.com/50',
          members: data.members || [],
        };
      });
      setCommunities(communitiesData);
    }, (error) => {
      console.error('Error fetching communities: ', error);
    });

    return () => unsubscribe();
  }, []);

  const handleJoinCommunity = async (communityId: string) => {
    if (!userId) return;

    try {
      const communityRef = doc(db, 'Communities', communityId);
      await updateDoc(communityRef, {
        members: arrayUnion(userId),
      });

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        communities: arrayUnion(communityId),
      });

      setCommunities((prevCommunities) =>
        prevCommunities.map((community) =>
          community.id === communityId
            ? { ...community, members: [...community.members, userId] }
            : community
        )
      );
    } catch (error) {
      console.error('Error joining community: ', error);
    }
  };

  return (
    <FlatList
      data={communities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Community
          communityId={item.id}
          name={item.name}
          description={item.description}
          profileImage={item.profileImage}
          userId={userId || ''}
          members={item.members}
          onJoin={() => handleJoinCommunity(item.id)}
        />
      )}
      contentContainerStyle={styles.flatListContent}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  flatListContent: {},
});

export default CommunityList;
