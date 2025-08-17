import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Config 1: Firestore (smartsetu-landing)
const landingConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,   // smartsetu-landing
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Config 2: Storage (smartsetu-469314)
const storageConfig = {
  apiKey: process.env.NEXT_PUBLIC_STORAGE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_STORAGE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_STORAGE_PROJECT_ID,   // smartsetu-469314
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,   // smartsetu-469314.appspot.com
  appId: process.env.NEXT_PUBLIC_STORAGE_APP_ID,
};

// Initialize Firestore app
const landingApp =
  getApps().find((app) => app.name === "landingApp") ||
  initializeApp(landingConfig, "landingApp");
export const auth = getAuth(landingApp);
export const db = getFirestore(landingApp);

// Initialize Storage app
const storageApp =
  getApps().find((app) => app.name === "storageApp") ||
  initializeApp(storageConfig, "storageApp");
export const storage = getStorage(storageApp);
