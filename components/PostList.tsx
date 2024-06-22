// PostList.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { collection, onSnapshot, DocumentData, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import Post from './Post';

interface PostData {
  id: string;
  title: string;
  content: string;
  username: string;
  time: string;
}

interface PostListProps {
  userId?: string; // Optional userId prop to filter posts by user
}

const PostList: React.FC<PostListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    let q = query(collection(db, 'Posts'), orderBy('createdAt', 'desc'));

    if (userId) {
      q = query(collection(db, 'Posts'), where('uid', '==', userId), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: PostData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'No Title',
          content: data.content || 'No Content',
          username: data.username,
          time: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'No Date',
        };
      });
      setPosts(postsData);
    }, (error) => {
      console.error('Error fetching posts: ', error);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [userId]);

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
  },
});

export default PostList;