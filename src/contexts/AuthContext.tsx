'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  Auth,
} from 'firebase/auth';
import { useAppStore } from '@/store/useAppStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  error: null,
});

// Lazy-load firebase to avoid crashing when keys are missing
let firebaseAuth: Auth | null = null;
let firebaseGoogle: any = null;
let firebaseGithub: any = null;

async function getFirebase() {
  if (firebaseAuth) return { auth: firebaseAuth, googleProvider: firebaseGoogle, githubProvider: firebaseGithub };
  try {
    const fb = await import('@/lib/firebase');
    firebaseAuth = fb.auth;
    firebaseGoogle = fb.googleProvider;
    firebaseGithub = fb.githubProvider;
    return { auth: fb.auth, googleProvider: fb.googleProvider, githubProvider: fb.githubProvider };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storeSetUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getFirebase().then((fb) => {
      if (!fb) {
        setLoading(false);
        return;
      }
      try {
        unsubscribe = onAuthStateChanged(fb.auth, (firebaseUser) => {
          setUser(firebaseUser);
          if (firebaseUser) {
            storeSetUser({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date(),
            });
          } else {
            storeSetUser(null);
          }
          setLoading(false);
        });
      } catch {
        setLoading(false);
      }
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, [storeSetUser]);

  const handleError = (err: unknown) => {
    const e = err as { code?: string; message?: string };
    const messages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'Email already registered.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/popup-closed-by-user': 'Sign-in cancelled.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/invalid-api-key': 'Firebase API key is invalid. Check your .env.local file.',
      'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Firebase API key is invalid. Check .env.local.',
    };
    setError(messages[e.code || ''] || e.message || 'An error occurred.');
    setTimeout(() => setError(null), 5000);
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const fb = await getFirebase();
      if (!fb) { setError('Firebase not configured. Add Firebase keys to .env.local'); return; }
      await signInWithPopup(fb.auth, fb.googleProvider);
    } catch (err) {
      handleError(err);
    }
  };

  const signInWithGithub = async () => {
    try {
      setError(null);
      const fb = await getFirebase();
      if (!fb) { setError('Firebase not configured'); return; }
      await signInWithPopup(fb.auth, fb.githubProvider);
    } catch (err) {
      handleError(err);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const fb = await getFirebase();
      if (!fb) { setError('Firebase not configured'); return; }
      await signInWithEmailAndPassword(fb.auth, email, password);
    } catch (err) {
      handleError(err);
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const fb = await getFirebase();
      if (!fb) { setError('Firebase not configured'); return; }
      const result = await createUserWithEmailAndPassword(fb.auth, email, password);
      await updateProfile(result.user, { displayName: name });
    } catch (err) {
      handleError(err);
    }
  };

  const logout = async () => {
    try {
      const fb = await getFirebase();
      if (fb) await signOut(fb.auth);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithGithub, signInWithEmail, registerWithEmail, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
