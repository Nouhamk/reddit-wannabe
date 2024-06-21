import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { collection, onSnapshot, DocumentData, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import Post from './Post';

interface PostData {
  id: string;
  title: string;
  content: string;
  username: string;
  time: string;
}

const PostList = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'Posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: PostData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'No Title',
          content: data.content || 'No Content',
          username: data.username || 'Anonymous',
          time: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'No Date',
        };
      });
      setPosts(postsData);
    }, (error) => {
      console.error('Error fetching posts: ', error);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Post
          title={item.title}
          content={item.content}
          username={item.username}
          time={item.time}
        />
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
    padding: 8,
  },
});

export default PostList;
