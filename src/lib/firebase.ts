import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "smartsetu-landing",
  appId: "1:1035058494680:web:1c9277c1c3e691e4e3abad",
  storageBucket: "smartsetu-landing.firebasestorage.app",
  apiKey: "AIzaSyDOH8fizsMCyagh-I-gKPVp57nmmbcUcNo",
  authDomain: "smartsetu-landing.firebaseapp.com",
  messagingSenderId: "1035058494680",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
