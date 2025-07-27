'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import type { UserCredential } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword as firebaseEmailSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signOut = () => {
    return firebaseSignOut(auth);
}

export const signInWithEmailPassword = (email: string, password: string): Promise<UserCredential> => {
  return firebaseEmailSignIn(auth, email, password);
};

export const createUserWithEmailPassword = (email: string, password: string): Promise<UserCredential> => {
  return firebaseCreateUser(auth, email, password);
};

export const db = getFirestore(app);
export { auth };
