import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import PostList from '../../components/PostList';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <PostList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
