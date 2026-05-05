import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, serverTimestamp, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Project } from '../types';
import { useAuth } from '../context/AuthContext';

export function useProjects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          createdAt: raw.createdAt?.toDate?.() ?? new Date(),
        } as Project;
      });
      setProjects(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const createProject = async (title: string, description: string, members: string[]) => {
    if (!currentUser) return;
    const allMembers = Array.from(new Set([currentUser.uid, ...members]));
    await addDoc(collection(db, 'projects'), {
      title,
      description,
      members: allMembers,
      createdBy: currentUser.uid,
      createdAt: serverTimestamp(),
    });
  };

  const updateProject = async (id: string, data: Partial<Omit<Project, 'id'>>) => {
    await updateDoc(doc(db, 'projects', id), data as Record<string, unknown>);
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const addMember = async (projectId: string, uid: string) => {
    await updateDoc(doc(db, 'projects', projectId), { members: arrayUnion(uid) });
  };

  const removeMember = async (projectId: string, uid: string) => {
    await updateDoc(doc(db, 'projects', projectId), { members: arrayRemove(uid) });
  };

  return { projects, loading, createProject, updateProject, deleteProject, addMember, removeMember };
}
