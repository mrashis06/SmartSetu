
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuestionnaireData } from "@/context/questionnaire-context";
import { calculateRiskScore, RiskScoreOutput } from "@/ai/flows/risk-score-flow";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import AppHeader from "@/components/app-header";
import { Loader2, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { RiskScoreMeter } from "@/components/risk-score-meter";

type ApplicationData = QuestionnaireData & {
  riskScoreResult?: RiskScoreOutput;
};

export default function RiskScorePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [riskScoreResult, setRiskScoreResult] = useState<RiskScoreOutput | null>(null);
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
            
            if (data.riskScoreResult && data.riskScoreResult.risk_score !== undefined) {
              setRiskScoreResult(data.riskScoreResult);
            } else {
              const result = await calculateRiskScore({
                financialInfo: data.financialInfo,
                additionalInfo: data.additionalInfo,
              });
              setRiskScoreResult(result);
              await updateDoc(docRef, {
                riskScoreResult: result,
              });
            }

          } else {
            setError("Loan application not found. Please complete the questionnaire first.");
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
  
  const getReasonIcon = (reason: string) => {
    const negativeKeywords = ['high cash', 'negative', 'existing loan', 'short duration', 'no cibil', 'not owning', 'low stock'];
    const isNegative = negativeKeywords.some(keyword => reason.toLowerCase().includes(keyword));
    
    if (!isNegative) {
        return <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />;
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="container mx-auto max-w-4xl">
           <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold font-serif mb-12 text-center text-foreground/80">
            Welcome {user.displayName}
          </motion.h1>

          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                <p className="mt-4 text-muted-foreground font-sans">Calculating your RISK-SCORE...</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <p>{error}</p>
                 <Button onClick={() => router.push('/questionnaire')} className="mt-4">Complete Questionnaire</Button>
            </div>
          ) : riskScoreResult && (
            <div className="space-y-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center space-y-4"
                >
                    <p className="text-lg font-sans tracking-widest text-muted-foreground text-center">
                        YOUR RISK-SCORE
                    </p>
                     <p className="text-6xl font-bold font-serif my-2 text-center">
                        {riskScoreResult.risk_score}
                    </p>
                    <RiskScoreMeter value={riskScoreResult.risk_score} />
                     <p className="text-xl font-bold mt-4 font-sans tracking-widest text-center">
                        ({riskScoreResult.category})
                    </p>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
                     <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                     >
                        <motion.h3 variants={itemVariants} className="font-bold font-sans tracking-wider mb-3">WHY THIS SCORE?</motion.h3>
                        <ul className="space-y-2">
                            {riskScoreResult.reasons.map((reason, i) => (
                                <motion.li key={i} variants={itemVariants} className="flex items-start font-sans">
                                    {getReasonIcon(reason)}
                                    <span>{reason}</span>
                                </motion.li>
                            ))}
                        </ul>
                     </motion.div>
                     <motion.div
                         variants={containerVariants}
                         initial="hidden"
                         animate="visible"
                        className="space-y-4"
                     >
                        <motion.h3 variants={itemVariants} className="font-bold font-sans tracking-wider mb-3 flex items-center"><Lightbulb className="h-5 w-5 text-yellow-400 mr-2" /> TIPS TO IMPROVE:</motion.h3>
                        <ul className="space-y-2 list-disc list-inside font-sans">
                           {riskScoreResult.tips.map((tip, i) => (
                                <motion.li key={i} variants={itemVariants}>{tip}</motion.li>
                            ))}
                        </ul>
                     </motion.div>
                </div>
                 <motion.div 
                    className="pt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Button 
                        size="lg" 
                        className="rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white dark:text-foreground text-lg font-bold px-10 py-6 shadow-lg hover:shadow-xl transition-shadow" 
                        onClick={() => router.push('/loan-eligibility')}>
                        Proceed to Loan Eligibility <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
