import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, serverTimestamp, doc, deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import type { AppFile, FileType } from '../types';
import { useAuth } from '../context/AuthContext';

function detectFileType(file: File): FileType {
  if (file.type.startsWith('audio')) return 'audio';
  if (file.type.startsWith('video')) return 'video';
  if (file.type.startsWith('image')) return 'image';
  return 'document';
}

export function useFiles(projectId?: string) {
  const { currentUser, appUser } = useAuth();
  const [files, setFiles] = useState<AppFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'files'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => {
          const raw = d.data();
          return {
            id: d.id,
            ...raw,
            createdAt: raw.createdAt?.toDate?.() ?? new Date(),
          } as AppFile;
        })
        .filter((f) => (projectId ? f.projectId === projectId : true));
      setFiles(data);
      setLoading(false);
    });
    return unsub;
  }, [projectId]);

  const uploadFile = async (
    file: File,
    fileProjectId?: string,
    fileProjectTitle?: string
  ) => {
    if (!currentUser || !appUser) return;
    setUploading(true);
    try {
      const fileType = detectFileType(file);
      const storageRef = ref(storage, `files/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'files'), {
        name: file.name,
        url,
        type: fileType,
        projectId: fileProjectId ?? null,
        projectTitle: fileProjectTitle ?? null,
        uploadedBy: currentUser.uid,
        uploaderName: appUser.name,
        size: file.size,
        createdAt: serverTimestamp(),
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, fileName: string) => {
    try {
      const storageRef = ref(storage, `files/${fileName}`);
      await deleteObject(storageRef);
    } catch (_) {
      // File might not exist in storage
    }
    await deleteDoc(doc(db, 'files', fileId));
  };

  return { files, loading, uploading, uploadFile, deleteFile };
}
