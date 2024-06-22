import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase-config';
import Community from '../../components/Community';

interface CommunityData {
  id: string;
  name: string;
  description: string;
  profileImage: string;
}

const CommunityList = () => {
  const [communities, setCommunities] = useState<CommunityData[]>([]);

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
        };
      });
      setCommunities(communitiesData);
    }, (error) => {
      console.error('Error fetching communities: ', error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FlatList
      data={communities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Community
          name={item.name}
          description={item.description}
          profileImage={item.profileImage}
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
  flatListContent: {
  },
});

export default CommunityList;
