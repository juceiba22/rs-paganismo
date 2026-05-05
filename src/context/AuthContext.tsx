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
  appUser: AppUser | null | undefined;
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
  try {
    const ref = doc(db, 'users', user.uid);

    // Cambio 1b: timeout de 8s para evitar cold-start colgado
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 8000)
    );

    const snap = await Promise.race([getDoc(ref), timeoutPromise]);

    if (!snap || !snap.exists()) return null;

    const data = snap.data();
    return {
      uid: user.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      artisticRole: data.artisticRole,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    };
  } catch (err) {
    console.error('Firestore read failed:', err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false); // Cambio 1a: Auth resolvió → desbloquear UI inmediatamente

      if (user) {
        try {
          const au = await fetchOrCreateAppUser(user);
          setAppUser(au);
        } catch (err) {
          console.error('Error fetching app user:', err);
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
    });

    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName ?? '',
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
          role: 'pending',
          artisticRole: 'other',
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Firestore write failed (Google):', err);
    }
    // Cambio 1c: fetch eliminado — onAuthStateChanged ya lo dispara
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth || !db) throw new Error('Firebase not initialized');

    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (!user?.uid) throw new Error('User creation failed');

    try {
      const ref = doc(db, 'users', user.uid);
      await setDoc(ref, {
        uid: user.uid,
        name: '',
        email: user.email ?? '',
        photoURL: '',
        role: 'pending',
        artisticRole: 'other',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Firestore write failed (signup):', err);
    }

    // ✅ FIX Bug 1: actualizar appUser en el estado local
    // sin esto la UI queda congelada en "Cargando..." tras el registro
    const au = await fetchOrCreateAppUser(user);
    setAppUser(au);
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
