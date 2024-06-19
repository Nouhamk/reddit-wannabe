// components/PostList.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState<{ id: string, title: string, post: string, username: string }[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Posts'));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          post: doc.data().post,
          username: doc.data().username
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Post title={item.title} content={item.post} username={item.username} time="3 hours ago" />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostList;
