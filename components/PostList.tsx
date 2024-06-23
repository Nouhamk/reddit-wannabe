import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
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
    const fetchPosts = () => {
      const q = query(collection(db, 'Posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedPosts: PostData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'No Title',
            content: data.content || 'No Content',
            username: data.username || 'Anonymous',
            time: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'No Date',
          };
        });
        setPosts(fetchedPosts);
      }, (error) => {
        console.error('Error fetching posts: ', error);
      });
      return unsubscribe;
    };

    const unsubscribePosts = fetchPosts();

    return () => unsubscribePosts();
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Post
          postId={item.id}
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
    padding: 8,
  },
});

export default PostList;
