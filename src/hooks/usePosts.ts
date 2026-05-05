import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, serverTimestamp, doc, updateDoc, increment,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import type { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';

export function usePosts(projectId?: string) {
  const { currentUser, appUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => {
          const raw = d.data();
          return {
            id: d.id,
            ...raw,
            createdAt: raw.createdAt?.toDate?.() ?? new Date(),
          } as Post;
        })
        .filter((p) => (projectId ? p.projectId === projectId : true));
      setPosts(data);
      setLoading(false);
    });
    return unsub;
  }, [projectId]);

  const createPost = async (
    content: string,
    imageFile?: File,
    linkURL?: string,
    postProjectId?: string,
    postProjectTitle?: string
  ) => {
    if (!currentUser || !appUser) return;
    let imageURL: string | undefined;

    if (imageFile) {
      const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'posts'), {
      authorId: currentUser.uid,
      authorName: appUser.name,
      authorPhoto: appUser.photoURL ?? '',
      content,
      imageURL: imageURL ?? null,
      linkURL: linkURL ?? null,
      projectId: postProjectId ?? null,
      projectTitle: postProjectTitle ?? null,
      createdAt: serverTimestamp(),
      commentCount: 0,
    });
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, 'posts', postId));
  };

  return { posts, loading, createPost, deletePost };
}

export function useComments(postId: string) {
  const { currentUser, appUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          createdAt: raw.createdAt?.toDate?.() ?? new Date(),
        } as Comment;
      });
      setComments(data);
      setLoading(false);
    });
    return unsub;
  }, [postId]);

  const addComment = async (content: string) => {
    if (!currentUser || !appUser) return;
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      authorId: currentUser.uid,
      authorName: appUser.name,
      authorPhoto: appUser.photoURL ?? '',
      content,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'posts', postId), { commentCount: increment(1) });
  };

  return { comments, loading, addComment };
}
