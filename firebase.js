import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCGepflypS2JZMtcPtqueHPIUJmJrHxnlk',
  authDomain: 'mymapapp-86e0a.firebaseapp.com',
  projectId: 'mymapapp-86e0a',
  storageBucket: 'mymapapp-86e0a.firebasestorage.app',
  messagingSenderId: '1007203089577',
  appId: '1:1007203089577:web:e2fe13122572e68fb7bdb8',
};

const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// Log ind anonymt, så Firestore-reglerne tillader adgang.
export const authReady = signInAnonymously(auth);