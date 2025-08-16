
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
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const user = result.user;
          // New user signed in via redirect. Check their application status.
          const docRef = doc(db, "loan_applications", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            router.push("/dashboard");
          } else {
            router.push("/questionnaire");
          }
        }
      } catch (error) {
         console.error("Error handling redirect result", error);
      }
    };
    
    // Only handle redirect if not loading and user is not yet set
    if (!loading && !user) {
        handleRedirect();
    }
  }, [router, loading, user]);


  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Use signInWithRedirect instead of signInWithPopup
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  }, [router]);

  const value = { user, loading, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
