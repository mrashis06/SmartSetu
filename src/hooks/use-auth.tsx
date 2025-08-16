
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
  signInWithRedirect,
  getRedirectResult,
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
  
  // Handle the redirect result from Google Sign-In
  useEffect(() => {
    const handleRedirect = async () => {
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await handleUser(result.user);
        }
      } catch (error) {
         console.error("Error handling redirect result", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only call this on initial load
    const isRedirectResultHandled = sessionStorage.getItem('redirectResultHandled');
    if (!isRedirectResultHandled) {
        handleRedirect();
        sessionStorage.setItem('redirectResultHandled', 'true');
    }
    
    // Cleanup sessionStorage on component unmount
    return () => {
      sessionStorage.removeItem('redirectResultHandled');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  }, []);

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
