
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Loader2, CheckCircle2, AlertTriangle, Lightbulb, Home, LayoutDashboard, Settings, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuestionnaire, QuestionnaireData } from "@/context/questionnaire-context";
import { calculateAltScore, AltScoreOutput } from "@/ai/flows/alt-score-flow";
import { ScoreBar } from "@/components/score-bar";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/footer";
import AppHeader from "@/components/app-header";

// Extend QuestionnaireData to include the optional altScoreResult
type ApplicationData = QuestionnaireData & {
  altScoreResult?: AltScoreOutput;
};

export default function AltScorePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [altScoreResult, setAltScoreResult] = useState<AltScoreOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const docRef = doc(db, "loan_applications", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as ApplicationData;
            setApplicationData(data);
            
            // Check if score already exists
            if (data.altScoreResult && data.altScoreResult.score) {
              setAltScoreResult(data.altScoreResult);
            } else {
              // If not, calculate it
              const result = await calculateAltScore({
                financialInfo: data.financialInfo,
                additionalInfo: data.additionalInfo,
              });
              setAltScoreResult(result);
              // And save it back to Firestore
              await updateDoc(docRef, {
                altScoreResult: result,
              });
            }

          } else {
            setError("Loan application not found. Please complete the questionnaire.");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to fetch application data or calculate score.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);
  
  const getReasonIcon = (type: 'positive' | 'negative') => {
    if (type === 'positive') {
        return <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />;
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="container mx-auto max-w-4xl">
           <h1 className="text-3xl md:text-5xl font-bold font-serif mb-12 text-center">
            Welcome {user.displayName}
          </h1>

          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                <p className="mt-4 text-muted-foreground font-sans">Calculating your ALT-SCORE...</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
                <p>{error}</p>
                 <Button onClick={() => router.push('/questionnaire')} className="mt-4">Complete Questionnaire</Button>
            </div>
          ) : altScoreResult && (
            <div className="space-y-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <ScoreBar value={altScoreResult.score} />
                     <p className="text-xl font-bold mt-4 font-sans tracking-widest text-center">
                        YOUR ALT-SCORE: {altScoreResult.score}
                    </p>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-4"
                     >
                        <h3 className="font-bold font-sans tracking-wider mb-3">WHY THIS SCORE?</h3>
                        <ul className="space-y-2">
                            {altScoreResult.reasons.map((r, i) => (
                                <li key={i} className="flex items-center font-sans">
                                    {getReasonIcon(r.type)}
                                    <span>{r.reason}</span>
                                </li>
                            ))}
                        </ul>
                     </motion.div>
                     <motion.div
                         initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-4"
                     >
                        <h3 className="font-bold font-sans tracking-wider mb-3 flex items-center"><Lightbulb className="h-5 w-5 text-yellow-400 mr-2" /> TIPS TO IMPROVE:</h3>
                        <ul className="space-y-2 list-disc list-inside font-sans">
                           {altScoreResult.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                     </motion.div>
                </div>
            </div>
          )}

          {!isLoading && !error && (
             <motion.div 
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Button 
                    size="lg" 
                    className="rounded-full bg-primary/80 hover:bg-primary text-primary-foreground px-8 py-4" 
                    onClick={() => router.push('/calculating-risk')}>
                    PROCEED TO RISK SCORE
                </Button>
            </motion.div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
