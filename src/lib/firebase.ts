import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "smartsetu-landing",
  appId: "1:1035058494680:web:1c9277c1c3e691e4e3abad",
  storageBucket: "smartsetu-landing.firebasestorage.app",
  apiKey: "AIzaSyC6HcuTXuCxJYn0P0I28xY-0x8Sqfteim8",
  authDomain: "smartsetu-landing.firebaseapp.com",
  messagingSenderId: "1035058494680",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
