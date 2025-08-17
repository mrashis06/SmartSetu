
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Loader2, Home, LayoutDashboard, Settings, Banknote, Landmark, Lightbulb, TrendingUp, TrendingDown, Hourglass, User as UserIcon } from "lucide-react";
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
import { QuestionnaireData } from "@/context/questionnaire-context";
import { determineLoanEligibility, LoanEligibilityOutput } from "@/ai/flows/loan-eligibility-flow";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/footer";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AltScoreOutput } from "@/ai/flows/alt-score-flow";
import { RiskScoreOutput } from "@/ai/flows/risk-score-flow";
import { Label } from "@/components/ui/label";
import AppHeader from "@/components/app-header";

type ApplicationData = QuestionnaireData & {
  altScoreResult?: AltScoreOutput;
  riskScoreResult?: RiskScoreOutput;
  loanEligibilityResult?: LoanEligibilityOutput;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};


export default function LoanEligibilityPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [loanEligibilityResult, setLoanEligibilityResult] = useState<LoanEligibilityOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [loanAmount, setLoanAmount] = useState(0);
    const [tenure, setTenure] = useState(12); // Default to 12 months

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
                
                if (!data.altScoreResult || !data.riskScoreResult) {
                    setError("ALT-SCORE or RISK-SCORE is missing. Please complete the previous steps.");
                    setIsLoading(false);
                    return;
                }
                
                if (data.loanEligibilityResult) {
                    setLoanEligibilityResult(data.loanEligibilityResult);
                    setLoanAmount(Math.min(45000, data.loanEligibilityResult.maxLoanAmount));
                } else {
                    const hasCibil = data.additionalInfo.hasCibilScore === 'yes';
                    const result = await determineLoanEligibility({
                        altScore: data.altScoreResult,
                        riskScore: data.riskScoreResult,
                        hasCibil: hasCibil,
                    });
                    setLoanEligibilityResult(result);
                    setLoanAmount(Math.min(45000, result.maxLoanAmount));
                    await updateDoc(docRef, {
                        loanEligibilityResult: result,
                    });
                }

            } else {
                setError("Loan application not found. Please complete the questionnaire first.");
            }
            } catch (err) {
            console.error(err);
            setError("Failed to fetch application data or determine eligibility.");
            } finally {
            setIsLoading(false);
            }
        };
        fetchData();
        }
    }, [user]);

    const { emi, totalRepayment } = useMemo(() => {
        if (loanAmount === 0) return { emi: 0, totalRepayment: 0 };

        const principal = loanAmount;
        const annualRate = 0.10; // 10%
        const monthlyRate = annualRate / 12;
        const numberOfMonths = tenure;

        if (monthlyRate === 0) {
            return { emi: principal / numberOfMonths, totalRepayment: principal };
        }

        const emiCalc = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
        const totalRepaymentCalc = emiCalc * numberOfMonths;

        return { emi: Math.round(emiCalc), totalRepayment: Math.round(totalRepaymentCalc) };

    }, [loanAmount, tenure]);

    const getChanceIcon = (chance: 'High' | 'Medium' | 'Low') => {
        switch(chance) {
            case 'High': return <TrendingUp className="h-5 w-5 text-green-500" />;
            case 'Medium': return <Hourglass className="h-5 w-5 text-yellow-500" />;
            case 'Low': return <TrendingDown className="h-5 w-5 text-red-500" />;
        }
    }


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
        <div className="container mx-auto max-w-6xl">
           <h1 className="text-3xl md:text-5xl font-bold font-serif mb-2 text-center">
            Hey, {user.displayName}
          </h1>
           <p className="text-center text-muted-foreground mb-12 font-sans tracking-wider">HERE ARE YOUR LOAN ELIGIBILITY DETAILS</p>

          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
                <p className="mt-4 text-muted-foreground font-sans">Determining your loan eligibility...</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <p>{error}</p>
                 <Button onClick={() => router.push('/questionnaire')} className="mt-4">Complete Questionnaire</Button>
            </div>
          ) : loanEligibilityResult && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <Card className="lg:col-span-2 bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="font-serif tracking-wider">Loan Eligibility Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 font-sans">
                        <div>
                            <Label>Slide how much loan do you want. (Max: {formatCurrency(loanEligibilityResult.maxLoanAmount)})</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <Slider
                                    value={[loanAmount]}
                                    onValueChange={(value) => setLoanAmount(value[0])}
                                    max={loanEligibilityResult.maxLoanAmount}
                                    step={1000}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Slide your tenure.</Label>
                             <div className="flex items-center gap-4 mt-2">
                                <Slider
                                    value={[tenure]}
                                    onValueChange={(value) => setTenure(value[0])}
                                    max={24}
                                    min={6}
                                    step={1}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 text-lg font-medium border-t pt-6">
                           <div className="flex justify-between items-center">
                                <p>Loan Amount:</p>
                                <p className="font-bold">{formatCurrency(loanAmount)}</p>
                           </div>
                           <div className="flex justify-between items-center text-muted-foreground">
                                <p>Interest:</p>
                                <p>10% PA</p>
                           </div>
                           <div className="flex justify-between items-center">
                                <p>Tenure:</p>
                                <p className="font-bold">{tenure} Months</p>
                           </div>
                            <div className="flex justify-between items-center text-primary font-bold text-xl pt-4 border-t">
                                <p>Monthly EMI:</p>
                                <p>{formatCurrency(emi)}</p>
                           </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                <p>Total Repayment:</p>
                                <p>{formatCurrency(totalRepayment)}</p>
                           </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-serif tracking-wider flex items-center"><Landmark className="mr-2 h-5 w-5 text-primary"/> Bank Chances</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 font-sans">
                            {['High', 'Medium', 'Low'].map(chanceCategory => {
                                const banksInCategory = loanEligibilityResult.banks.filter(b => b.chance === chanceCategory);
                                if (banksInCategory.length === 0) return null;
                                return (
                                <div key={chanceCategory}>
                                    <div className="flex items-center font-semibold mb-2">
                                       {getChanceIcon(chanceCategory as 'High' | 'Medium' | 'Low')}
                                        <p className="ml-2">{chanceCategory} Chance</p>
                                    </div>
                                    <ul className="list-disc list-inside text-muted-foreground ml-4">
                                        {banksInCategory.map(bank => <li key={bank.name}>{bank.name}</li>)}
                                    </ul>
                                </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-serif tracking-wider flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400" /> Tips:</CardTitle>
                        </CardHeader>
                        <CardContent className="font-sans">
                             <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                {loanEligibilityResult.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
          )}

          {!isLoading && !error && (
             <motion.div 
                className="mt-16 flex justify-center items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Button 
                    size="lg" 
                    className="rounded-full bg-primary/80 hover:bg-primary text-primary-foreground px-8 py-4 text-lg"
                >
                    APPLY NOW
                </Button>
                <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full px-8 py-4 text-lg" 
                    onClick={() => router.push('/dashboard')}>
                    BACK TO DASHBOARD
                </Button>
            </motion.div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
