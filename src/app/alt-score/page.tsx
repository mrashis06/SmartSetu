
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuestionnaireData } from "@/context/questionnaire-context";
import { calculateAltScore, AltScoreOutput } from "@/ai/flows/alt-score-flow";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import AppHeader from "@/components/app-header";
import { Loader2, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Info } from "lucide-react";
import { AltScoreMeter } from "@/components/alt-score-meter";
import { useLanguage } from "@/context/language-context";

type ApplicationData = QuestionnaireData & {
  altScoreResult?: AltScoreOutput;
};

export default function AltScorePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [altScoreResult, setAltScoreResult] = useState<AltScoreOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

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
            
            if (data.altScoreResult && data.altScoreResult.score) {
              setAltScoreResult(data.altScoreResult);
            } else {
              const result = await calculateAltScore({
                financialInfo: data.financialInfo,
                additionalInfo: data.additionalInfo,
              });
              setAltScoreResult(result);
              await updateDoc(docRef, {
                altScoreResult: result,
              });
            }

          } else {
            setError(t('altScore.errors.noApplication'));
          }
        } catch (err) {
          console.error(err);
          setError(t('altScore.errors.fetchError'));
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user, router, t]);
  
  const getReasonIcon = (type: 'positive' | 'negative') => {
    if (type === 'positive') {
        return <CheckCircle2 className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />;
    }
    return <AlertTriangle className="h-6 w-6 text-yellow-500 mr-4 flex-shrink-0" />;
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
        <div className="container mx-auto max-w-2xl">
           <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold font-serif mb-12 text-center text-foreground/80">
            {t('altScore.welcome', { name: user.displayName || 'User' })}
          </motion.h1>

          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                <p className="mt-4 text-muted-foreground font-sans">{t('altScore.loading')}</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <p>{error}</p>
                 <Button onClick={() => router.push('/questionnaire')} className="mt-4">{t('altScore.completeQuestionnaireButton')}</Button>
            </div>
          ) : altScoreResult && (
            <div className="space-y-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <p className="text-lg font-sans tracking-widest text-muted-foreground text-center">
                        {t('altScore.title')}
                    </p>
                    <p className="text-6xl font-bold font-serif my-2 text-center">
                        {altScoreResult.score}
                    </p>
                    <AltScoreMeter value={altScoreResult.score} />
                </motion.div>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold font-serif text-center">{t('altScore.reasonsTitle')}</motion.h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {altScoreResult.reasons.map((r, i) => (
                             <motion.div key={i} variants={itemVariants}>
                                <Card className="h-full">
                                    <CardContent className="p-4 flex items-center">
                                        {getReasonIcon(r.type)}
                                        <span className="font-sans flex-1">{t(r.key)}</span>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                                    <Info className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 text-sm font-sans">
                                                <p>{t(r.key + '.explanation')}</p>
                                            </PopoverContent>
                                        </Popover>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold font-serif text-center flex items-center justify-center gap-2"><Lightbulb className="h-6 w-6 text-yellow-400" /> {t('altScore.tipsTitle')}</motion.h2>
                    <div className="grid gap-4">
                        {altScoreResult.tips.map((tipKey, i) => (
                           <motion.div key={i} variants={itemVariants}>
                                <Card>
                                    <CardContent className="p-4 flex items-center">
                                        <span className="font-sans flex-1">{t(tipKey)}</span>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                                    <Info className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 text-sm font-sans">
                                                 <p>{t(tipKey + '.explanation')}</p>
                                            </PopoverContent>
                                        </Popover>
                                    </CardContent>
                                </Card>
                           </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    className="pt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Button 
                        size="lg" 
                        className="rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white dark:text-foreground text-lg font-bold px-10 py-6 shadow-lg hover:shadow-xl transition-shadow" 
                        onClick={() => router.push('/calculating-risk')}>
                        {t('altScore.proceedButton')} <ArrowRight className="ml-2 h-5 w-5" />
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
