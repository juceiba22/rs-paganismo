import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, serverTimestamp, doc, deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { AppEvent } from '../types';
import { useAuth } from '../context/AuthContext';

export function useEvents() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('datetime', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          datetime: raw.datetime?.toDate?.() ?? new Date(),
          createdAt: raw.createdAt?.toDate?.() ?? new Date(),
        } as AppEvent;
      });
      setEvents(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const createEvent = async (
    title: string,
    description: string,
    datetime: Date,
    projectId?: string,
    projectTitle?: string
  ) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'events'), {
      title,
      description,
      datetime,
      projectId: projectId ?? null,
      projectTitle: projectTitle ?? null,
      createdBy: currentUser.uid,
      createdAt: serverTimestamp(),
    });
  };

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, 'events', id));
  };

  const upcoming = events.filter((e) => e.datetime >= new Date());
  const past = events.filter((e) => e.datetime < new Date());

  return { events, upcoming, past, loading, createEvent, deleteEvent };
}
