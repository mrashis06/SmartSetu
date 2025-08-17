
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Footer from "@/components/footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuestionnaireData } from "@/context/questionnaire-context";
import { AltScoreOutput } from "@/ai/flows/alt-score-flow";
import { RiskScoreOutput } from "@/ai/flows/risk-score-flow";
import AppHeader from "@/components/app-header";
import { useLanguage } from "@/context/language-context";

type ApplicationData = QuestionnaireData & {
  altScoreResult?: AltScoreOutput;
  riskScoreResult?: RiskScoreOutput;
};

// Define the structure for completion checks
const COMPLETION_CHECKS = {
    personalInfo: { fields: ['firstName', 'lastName', 'gender', 'dob', 'phone', 'address'], weight: 25 },
    financialInfo: { fields: ['businessType', 'businessDuration', 'stockValue', 'monthlyUpiTransactions', 'monthlyCashIncome', 'monthlyExpenses', 'existingLoan'], weight: 35 },
    additionalInfo: { fields: ['hasCibilScore', 'ownHouse', 'ownBusiness', 'govtBenefits'], weight: 20 },
    documents: { fields: ['aadharDataUri', 'shopPhotoDataUri'], weight: 20 },
};


export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
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
                    setApplicationData(docSnap.data() as ApplicationData);
                } else {
                    setError(t('profile.errors.noApplication'));
                }
            } catch (err) {
                console.error("Failed to fetch application data:", err);
                setError(t('profile.errors.fetchError'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        }
    }, [user, t]);

    const completionPercentage = useMemo(() => {
        if (!applicationData) return 0;

        let totalPercentage = 0;
        
        // This is a placeholder for document check, as we don't store files directly.
        // In a real app, you'd check for document URLs in Firestore.
        // For now, let's assume if the doc exists, some documents were processed.
        // We will simulate based on existence of score results which implies document upload happened.
        const documentsData = {
          aadharDataUri: applicationData.altScoreResult ? 'filled' : undefined,
          shopPhotoDataUri: applicationData.altScoreResult ? 'filled' : undefined,
        }

        const dataToCheck = {
            personalInfo: applicationData.personalInfo,
            financialInfo: applicationData.financialInfo,
            additionalInfo: applicationData.additionalInfo,
            documents: documentsData
        };

        for (const section in COMPLETION_CHECKS) {
            const { fields, weight } = COMPLETION_CHECKS[section as keyof typeof COMPLETION_CHECKS];
            const sectionData = dataToCheck[section as keyof typeof dataToCheck];
            if (sectionData) {
                const filledFields = fields.filter(field => {
                    const value = sectionData[field as keyof typeof sectionData];
                    return value !== null && value !== undefined && value !== '';
                }).length;
                totalPercentage += (filledFields / fields.length) * weight;
            }
        }

        return Math.round(totalPercentage);
    }, [applicationData]);


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
            {t('profile.title')}
          </h1>

          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                <p className="mt-4 text-muted-foreground font-sans">{t('profile.loading')}</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <p>{error}</p>
                 <Button onClick={() => router.push('/questionnaire')} className="mt-4">{t('profile.completeQuestionnaireButton')}</Button>
            </div>
          ) : applicationData && (
            <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>{t('profile.progress.title')}</CardTitle>
                        <CardDescription>{t('profile.progress.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Progress value={completionPercentage} className="w-full h-3" />
                            <span className="font-bold text-lg">{completionPercentage}%</span>
                        </div>
                        <Button variant="link" className="p-0 h-auto mt-2" onClick={() => router.push('/questionnaire')}>
                           {completionPercentage < 100 ? t('profile.progress.continueButton') : t('profile.progress.editButton')}
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.altScore.title')}</CardTitle>
                             <CardDescription>{t('profile.altScore.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {applicationData.altScoreResult ? (
                                <div className="text-center">
                                    <p className="text-6xl font-bold text-primary">{applicationData.altScoreResult.score}</p>
                                    <Button variant="link" className="mt-2" onClick={() => router.push('/alt-score')}>{t('profile.viewDetailsButton')}</Button>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">{t('profile.altScore.notCalculated')}</p>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('profile.riskScore.title')}</CardTitle>
                            <CardDescription>{t('profile.riskScore.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {applicationData.riskScoreResult ? (
                                <div className="text-center">
                                    <p className="text-6xl font-bold text-amber-500">{applicationData.riskScoreResult.risk_score} / 10</p>
                                    <p className="font-semibold text-lg text-muted-foreground">{applicationData.riskScoreResult.category} Risk</p>
                                    <Button variant="link" className="mt-2" onClick={() => router.push('/risk-score')}>{t('profile.viewDetailsButton')}</Button>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">{t('profile.riskScore.notCalculated')}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
