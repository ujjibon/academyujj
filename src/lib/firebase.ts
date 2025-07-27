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

// Check if we have valid Firebase configuration
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-api-key-here' &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'AIzaSyDemoApiKey123456789' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project';

// Create mock auth object for development when Firebase is not configured
const createMockAuth = () => ({
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Immediately call with null user
    setTimeout(() => callback(null), 0);
    // Return unsubscribe function
    return () => {};
  }
});

let app: any;
let auth: any;
let googleProvider: any;
let db: any;

if (hasValidConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    auth = createMockAuth();
  }
} else {
  console.warn('Firebase configuration is missing or using placeholder values. Please update your .env.local file with valid Firebase credentials.');
  auth = createMockAuth();
}

export const signInWithGoogle = () => {
  if (!auth || !googleProvider) {
    return Promise.reject(new Error('Firebase is not properly configured. Please check your environment variables.'));
  }
  return signInWithPopup(auth, googleProvider);
};

export const signOut = () => {
  if (!auth || !hasValidConfig) {
    return Promise.reject(new Error('Firebase is not properly configured. Please check your environment variables.'));
  }
  return firebaseSignOut(auth);
};

export const signInWithEmailPassword = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    return Promise.reject(new Error('Firebase is not properly configured. Please check your environment variables.'));
  }
  return firebaseEmailSignIn(auth, email, password);
};

export const createUserWithEmailPassword = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    return Promise.reject(new Error('Firebase is not properly configured. Please check your environment variables.'));
  }
  return firebaseCreateUser(auth, email, password);
};

export { auth, db };
