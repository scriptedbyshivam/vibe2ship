import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Production-ready Firebase configuration using client-side environment variables
// with solid fallbacks derived from your AI Studio provisioned instance config.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyATkspYOt3Is-Td9anb_Dd-LhDhD5SV1I4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "verdant-tea-8d2jw.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "verdant-tea-8d2jw",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "verdant-tea-8d2jw.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "229084139257",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:229084139257:web:dced96863735085c50dc28",
};

// Custom Database ID provisioned specifically for your Firestore instance
const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-civicmindunderst-6769d349-18eb-4c53-ba64-4d3b3076bf2c";

// Initialize Firebase App instance safely (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with clean multi-tab cache settings if possible, or standard initialization
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
}, firestoreDatabaseId);

// Initialize Authentication and Storage
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
