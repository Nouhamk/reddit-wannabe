import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CommunityPage from '../../components/CommunityPage';

const CommunityDetailPage = () => {
  const { communityId } = useLocalSearchParams();

  if (!communityId || Array.isArray(communityId)) {
    return (
      <View style={styles.container}>
        <Text>Error: Invalid community ID</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CommunityPage communityId={communityId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
});

export default CommunityDetailPage;
