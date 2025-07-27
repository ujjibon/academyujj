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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
};

// Check if we have valid Firebase configuration
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-api-key-here';

let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let db: any = null;

if (hasValidConfig) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  db = getFirestore(app);
} else {
  console.warn('Firebase configuration is missing or using placeholder values. Please update your .env.local file with valid Firebase credentials.');
}

export const signInWithGoogle = () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase is not properly configured. Please check your environment variables.');
  }
  return signInWithPopup(auth, googleProvider);
};

export const signOut = () => {
    if (!auth) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.');
    }
    return firebaseSignOut(auth);
}

export const signInWithEmailPassword = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    throw new Error('Firebase is not properly configured. Please check your environment variables.');
  }
  return firebaseEmailSignIn(auth, email, password);
};

export const createUserWithEmailPassword = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    throw new Error('Firebase is not properly configured. Please check your environment variables.');
  }
  return firebaseCreateUser(auth, email, password);
};

export { auth, db };
