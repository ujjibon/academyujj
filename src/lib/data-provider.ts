
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from 'firebase/auth';
import { courses as courseList } from './courses';
import advancedCss from '@/data/courses/advanced-css.json';
import digitalProductivity from '@/data/courses/digital-productivity-mastery.json';
import reactFundamentals from '@/data/courses/react-fundamentals.json';

export type Course = {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  duration: number; // in minutes
  introduction: {
    videoUrl: string;
    text: string;
  };
  practice: Quiz;
  project: Project;
  assessment: Quiz;
};

export type Quiz = {
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
};

export type Project = {
  title: string;
  description: string;
};

// This is a map of the course IDs to the imported JSON data.
// In a real application, you would fetch this from a database.
const coursesData: { [key: string]: Course } = {
  'react-fundamentals': reactFundamentals,
  'advanced-css': advancedCss,
  'digital-productivity-mastery': digitalProductivity,
};


export interface UserProfile extends DocumentData {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  dailyStreak: number;
  weeklyProgress: number;
  activeCourseId?: string;
  activeLessonId?: string;
  strengths: Array<{ name: string; value: number }>;
  weaknesses: Array<{ name: string; value: number }>;
  badges: Array<{ name: string; icon: string }>;
}


export const fetchUserProfile = async (user: User): Promise<UserProfile> => {
  if (!user.uid) throw new Error('User not authenticated');
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }
  return userDoc.data() as UserProfile;
};

export const observeLeaderboard = (
  callback: (entries: Array<{ id: string } & DocumentData>) => void
) => {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('xp', 'desc'),
    limit(10)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(entries);
  });
};



export function getCourse(id: string): Course | undefined {
  return coursesData[id];
}


