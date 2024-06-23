import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { db, auth } from '../firebase-config';
import { doc, updateDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';

interface PostProps {
  postId: string;
  title: string;
  content: string;
  username: string;
  time: string;
}

interface CommentData {
  id: string;
  postId: string;
  content: string;
  username: string;
  time: string; 
}

const Post = ({ postId, title, content, username, time }: PostProps) => {
  const [userId, setUserId] = useState<string>('');
  const [likes, setLikes] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false); // État pour afficher/cacher le formulaire de commentaire

  useEffect(() => {
    const fetchUser = () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };

    const fetchPostData = async () => {
      const postDoc = await getDoc(doc(db, 'Posts', postId));
      if (postDoc.exists()) {
        const postData = postDoc.data();
        setLikes(postData.likes || []);
        setDislikes(postData.dislikes || []);
      }
    };

    const fetchComments = () => {
      const q = query(collection(db, 'Comments'), orderBy('createdAt', 'asc'), where('postId', '==', postId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedComments: CommentData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            postId: postId,
            content: data.content || '',
            username: data.username,
            time: data.createdAt ? data.createdAt.toDate().toLocaleString() : 'No Date',
          };
        });
        setComments(fetchedComments);
      }, (error) => {
        console.error('Error fetching comments: ', error);
      });
      return unsubscribe;
    };

    fetchUser();
    fetchPostData();
    const unsubscribeComments = fetchComments();

    return () => unsubscribeComments();
  }, [postId]);

  const handleLike = async () => {
    if (userId) {
      const newLikes = likes.includes(userId) ? likes.filter(id => id !== userId) : [...likes, userId];
      const newDislikes = dislikes.filter(id => id !== userId);
      await updateDoc(doc(db, 'Posts', postId), { likes: newLikes, dislikes: newDislikes });
      setLikes(newLikes);
      setDislikes(newDislikes);
    }
  };

  const handleDislike = async () => {
    if (userId) {
      const newDislikes = dislikes.includes(userId) ? dislikes.filter(id => id !== userId) : [...dislikes, userId];
      const newLikes = likes.filter(id => id !== userId);
      await updateDoc(doc(db, 'Posts', postId), { likes: newLikes, dislikes: newDislikes });
      setDislikes(newDislikes);
      setLikes(newLikes);
    }
  };

  const handleAddComment = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('User is not logged in');
        return;
      }

      const newCommentData = {
        postId: postId,
        content: newComment,
        username: username,
        time: new Date().toLocaleString(), // Ajout de la propriété 'time'
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'Comments'), newCommentData);
      const commentId = docRef.id;
      setComments([...comments, { id: commentId, ...newCommentData }]);
      setNewComment('');
      setShowCommentForm(false); // Cacher le formulaire après l'ajout du commentaire
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm); // Basculer l'état de l'affichage du formulaire de commentaire
  };

  const currentUser = auth.currentUser as { username?: string } | null;
  const isCurrentUserPost = currentUser && currentUser.username === username;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.redd.it/rrz3hmsxcll71.png' }} 
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        {!isCurrentUserPost && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome5 name="ellipsis-h" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <FontAwesome5 name="arrow-up" size={20} color={likes.includes(userId) ? "blue" : "#878A8C"} />
          <Text>{likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDislike} style={styles.actionButton}>
          <FontAwesome5 name="arrow-down" size={20} color={dislikes.includes(userId) ? "red" : "#878A8C"} />
          <Text>{dislikes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCommentForm} style={styles.actionButton}>
          <FontAwesome5 name="comment" size={20} color="#878A8C" />
          <Text style={styles.actionButtonText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="share" size={20} color="#878A8C" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
      {showCommentForm && (
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            placeholderTextColor="#aaa"
            multiline
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.commentButton}>
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.commentsContainer}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.commentUsername}>{item.username}</Text>
              <Text style={styles.commentContent}>{item.content}</Text>
              <Text style={styles.commentTime}>{item.time}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1, // Add bottom border
    borderBottomColor: '#ccc', // Border color
    padding: 16,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: '#777',
  },
  followButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // More rounded corners
    marginRight: 8,  
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moreButton: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#555',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 14,
  },
  commentButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentsContainer: {
    marginTop: 16,
  },
  commentContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentContent: {
    marginBottom: 4,
  },
  commentTime: {
    color: '#777',
    fontSize: 12,
  },
});

export default Post;
