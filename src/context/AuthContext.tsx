import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import type { AppUser } from '../types';

interface AuthContextType {
  currentUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isApproved: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

async function fetchOrCreateAppUser(user: User): Promise<AppUser | null> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    return {
      uid: user.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      artisticRole: data.artisticRole,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    } as AppUser;
  }

  // New user → needs onboarding
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const au = await fetchOrCreateAppUser(user);
        setAppUser(au);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      // Will be handled by onboarding — stub record
      await setDoc(ref, {
        name: user.displayName ?? '',
        email: user.email ?? '',
        photoURL: user.photoURL ?? '',
        role: 'pending',
        artisticRole: 'other',
        createdAt: serverTimestamp(),
      });
    }
    const au = await fetchOrCreateAppUser(user);
    setAppUser(au);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, {
      name: '',
      email: user.email ?? '',
      photoURL: '',
      role: 'pending',
      artisticRole: 'other',
      createdAt: serverTimestamp(),
    });
  };

  const logout = async () => {
    await signOut(auth);
    setAppUser(null);
  };

  const isAdmin = appUser?.role === 'admin';
  const isApproved =
    appUser?.role === 'admin' ||
    appUser?.role === 'core' ||
    appUser?.role === 'extended';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        appUser,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        isAdmin,
        isApproved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
