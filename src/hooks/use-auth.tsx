
"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const handleUser = useCallback(async (user: User | null) => {
    if (user) {
      const docRef = doc(db, "loan_applications", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        router.push("/dashboard");
      } else {
        router.push("/questionnaire");
      }
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await handleUser(result.user);
      }
    } catch (error: any) {
      // Don't log error if user closes popup
      if (error.code !== 'auth/popup-closed-by-user') {
          console.error("Error signing in with Google", error);
      }
    }
  }, [handleUser]);

  const signUpWithEmailAndPassword = useCallback(async (email: string, password: string, displayName: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await handleUser(userCredential.user);
  }, [handleUser]);

  const signInWithEmailAndPassword = useCallback(async (email: string, password: string) => {
      const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
      await handleUser(userCredential.user);
  }, [handleUser]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  }, [router]);

  const value = { user, loading, signInWithGoogle, signUpWithEmailAndPassword, signInWithEmailAndPassword, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
