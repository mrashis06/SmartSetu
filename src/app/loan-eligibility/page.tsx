
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { QuestionnaireData } from "@/context/questionnaire-context";
import { determineLoanEligibility, LoanEligibilityOutput } from "@/ai/flows/loan-eligibility-flow";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AltScoreOutput } from "@/ai/flows/alt-score-flow";
import { RiskScoreOutput } from "@/ai/flows/risk-score-flow";
import { Label } from "@/components/ui/label";
import AppHeader from "@/components/app-header";
import { Loader2, Banknote, Landmark, Lightbulb, TrendingUp, TrendingDown, Hourglass, ArrowRight } from "lucide-react";

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
    const { user, loading: authLoading } = useAuth();
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
                
                if (data.loanEligibilityResult && data.loanEligibilityResult.maxLoanAmount) {
                    setLoanEligibilityResult(data.loanEligibilityResult);
                    setLoanAmount(data.loanEligibilityResult.maxLoanAmount > 0 ? Math.min(45000, data.loanEligibilityResult.maxLoanAmount) : 0);
                } else {
                    const hasCibil = data.additionalInfo.hasCibilScore === 'yes';
                    const result = await determineLoanEligibility({
                        altScore: data.altScoreResult,
                        riskScore: data.riskScoreResult,
                        hasCibil: hasCibil,
                    });
                    setLoanEligibilityResult(result);
                    setLoanAmount(result.maxLoanAmount > 0 ? Math.min(45000, result.maxLoanAmount) : 0);
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

    const getChanceIconAndColor = (chance: 'High' | 'Medium' | 'Low') => {
        switch(chance) {
            case 'High': return { icon: <TrendingUp className="h-6 w-6 text-green-500" />, color: "text-green-500" };
            case 'Medium': return { icon: <Hourglass className="h-6 w-6 text-yellow-500" />, color: "text-yellow-500" };
            case 'Low': return { icon: <TrendingDown className="h-6 w-6 text-red-500" />, color: "text-red-500" };
            default: return { icon: null, color: "" };
        }
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
        <div className="container mx-auto max-w-2xl">
           <h1 className="text-3xl md:text-5xl font-bold font-serif mb-2 text-center text-foreground/80">
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
            <div className="space-y-12">
                <motion.div variants={itemVariants} initial="hidden" animate="visible">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif tracking-wider text-2xl">Loan Eligibility Result</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 font-sans">
                            <div>
                                <Label htmlFor="loanAmount" className="text-muted-foreground">Slide how much loan do you want. (Max: {formatCurrency(loanEligibilityResult.maxLoanAmount)})</Label>
                                <Slider
                                    id="loanAmount"
                                    value={[loanAmount]}
                                    onValueChange={(value) => setLoanAmount(value[0])}
                                    max={loanEligibilityResult.maxLoanAmount}
                                    step={1000}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tenure" className="text-muted-foreground">Slide your tenure.</Label>
                                <Slider
                                    id="tenure"
                                    value={[tenure]}
                                    onValueChange={(value) => setTenure(value[0])}
                                    max={24}
                                    min={6}
                                    step={1}
                                    className="mt-2"
                                />
                            </div>

                            <div className="space-y-4 text-lg font-medium border-t pt-6">
                            <div className="flex justify-between items-center">
                                    <p className="text-muted-foreground">Loan Amount:</p>
                                    <p className="font-bold">{formatCurrency(loanAmount)}</p>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground">
                                    <p>Interest:</p>
                                    <p>10% PA</p>
                            </div>
                            <div className="flex justify-between items-center">
                                    <p className="text-muted-foreground">Tenure:</p>
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
                </motion.div>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold font-serif text-center flex items-center justify-center gap-2"><Landmark className="h-6 w-6 text-primary" /> Bank Chances</motion.h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['High', 'Medium', 'Low'].map(chanceCategory => {
                            const banksInCategory = loanEligibilityResult.banks.filter(b => b.chance === chanceCategory);
                            if (banksInCategory.length === 0) return null;
                            const { icon, color } = getChanceIconAndColor(chanceCategory as 'High' | 'Medium' | 'Low');
                            return (
                            <motion.div key={chanceCategory} variants={itemVariants}>
                               <Card className="h-full">
                                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                                        {icon}
                                        <CardTitle className={`font-serif text-xl ${color}`}>{chanceCategory} Chance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside text-muted-foreground font-sans">
                                            {banksInCategory.map(bank => <li key={bank.name}>{bank.name}</li>)}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
                
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    <motion.h2 variants={itemVariants} className="text-2xl font-bold font-serif text-center flex items-center justify-center gap-2"><Lightbulb className="h-6 w-6 text-yellow-400" /> Tips to Improve</motion.h2>
                    <div className="grid gap-4">
                        {loanEligibilityResult.tips.map((tip, i) => (
                           <motion.div key={i} variants={itemVariants}>
                                <Card>
                                    <CardContent className="p-4 flex items-center">
                                        <Lightbulb className="h-6 w-6 text-yellow-400 mr-4 flex-shrink-0" />
                                        <span className="font-sans flex-1">{tip}</span>
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
                        >
                        APPLY NOW <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                        size="lg" 
                        variant="ghost"
                        className="rounded-full px-8 py-6 text-lg mt-4" 
                        onClick={() => router.push('/dashboard')}>
                        BACK TO DASHBOARD
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
