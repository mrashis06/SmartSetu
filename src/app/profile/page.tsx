
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Menu, Loader2, Home, LayoutDashboard, Settings, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuestionnaireData } from "@/context/questionnaire-context";
import { AltScoreOutput } from "@/ai/flows/alt-score-flow";
import { RiskScoreOutput } from "@/ai/flows/risk-score-flow";
import AppHeader from "@/components/app-header";

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
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
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
                    setApplicationData(docSnap.data() as ApplicationData);
                } else {
                    setError("No application data found. Please complete the questionnaire.");
                }
            } catch (err) {
                console.error("Failed to fetch application data:", err);
                setError("An error occurred while fetching your data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        }
    }, [user]);

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
            User Profile
          </h1>

          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                <p className="mt-4 text-muted-foreground font-sans">Loading your profile...</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <p>{error}</p>
                 <Button onClick={() => router.push('/questionnaire')} className="mt-4">Complete Questionnaire</Button>
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
                        <CardTitle>Application Progress</CardTitle>
                        <CardDescription>This is how much of the application you have completed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Progress value={completionPercentage} className="w-full h-3" />
                            <span className="font-bold text-lg">{completionPercentage}%</span>
                        </div>
                        <Button variant="link" className="p-0 h-auto mt-2" onClick={() => router.push('/questionnaire')}>
                           {completionPercentage < 100 ? "Continue Application" : "Edit Application"}
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>ALT-SCORE</CardTitle>
                             <CardDescription>Your financial strength score.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {applicationData.altScoreResult ? (
                                <div className="text-center">
                                    <p className="text-6xl font-bold text-primary">{applicationData.altScoreResult.score}</p>
                                    <Button variant="link" className="mt-2" onClick={() => router.push('/alt-score')}>View Details</Button>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Not yet calculated. Complete your application to see your score.</p>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>RISK-SCORE</CardTitle>
                            <CardDescription>Your loan repayment risk assessment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {applicationData.riskScoreResult ? (
                                <div className="text-center">
                                    <p className="text-6xl font-bold text-amber-500">{applicationData.riskScoreResult.risk_score} / 10</p>
                                    <p className="font-semibold text-lg text-muted-foreground">{applicationData.riskScoreResult.category} Risk</p>
                                    <Button variant="link" className="mt-2" onClick={() => router.push('/risk-score')}>View Details</Button>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Not yet calculated. Complete the ALT-SCORE step first.</p>
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
