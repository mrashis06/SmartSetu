
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Loader2, CheckCircle2, AlertTriangle, Lightbulb, Home, LayoutDashboard, Settings } from "lucide-react";
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
import { calculateRiskScore, RiskScoreOutput } from "@/ai/flows/risk-score-flow";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/footer";

type ApplicationData = QuestionnaireData & {
  riskScoreResult?: RiskScoreOutput;
};

const RiskScoreMeter = ({ value }: { value: number }) => {
  const percentage = (value / 10) * 100;

  const getColor = (val: number) => {
    if (val <= 3) return "bg-green-500";
    if (val <= 6) return "bg-yellow-500";
    return "bg-red-500";
  }

  return (
    <div className="w-full max-w-lg mx-auto">
       <div className="relative h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
            className={`h-full rounded-full ${getColor(value)}`}
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        />
       </div>
      <div className="relative mt-2 flex justify-between font-bold text-sm text-muted-foreground">
        <span>0 (LOW RISK)</span>
        <span>10 (HIGH RISK)</span>
      </div>
    </div>
  );
};


export default function RiskScorePage() {
  const { user, loading: authLoading, signOut } = useAuth();
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
       <header className="sticky top-0 z-50 w-full bg-primary/80">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#" className="transition-colors hover:text-primary-foreground/80">FAQs</Link>
            <Link href="/" className="transition-colors hover:text-primary-foreground/80">Home</Link>
            <Link href="/dashboard" className="transition-colors hover:text-primary-foreground/80 font-bold">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                        <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                        <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/"><Home className="mr-2 h-4 w-4" /><span>Home</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 p-4">
                     <Link href="#" className="transition-colors hover:text-primary-foreground/80">FAQs</Link>
                     <Link href="/" className="transition-colors hover:text-primary-foreground/80">Home</Link>
                     <Link href="/dashboard" className="transition-colors hover:text-primary-foreground/80 font-bold">Dashboard</Link>
                    <Button onClick={signOut} variant="outline">Logout</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="container mx-auto max-w-4xl">
           <h1 className="text-3xl md:text-5xl font-bold font-serif mb-12 text-center">
            Welcome {user.displayName}
          </h1>

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
                    <RiskScoreMeter value={riskScoreResult.risk_score} />
                     <p className="text-xl font-bold mt-4 font-sans tracking-widest text-center">
                        YOUR RISK-SCORE: {riskScoreResult.risk_score} ({riskScoreResult.category})
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
                            {riskScoreResult.reasons.map((reason, i) => (
                                <li key={i} className="flex items-start font-sans">
                                    {getReasonIcon(reason)}
                                    <span>{reason}</span>
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
                           {riskScoreResult.tips.map((tip, i) => (
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
                    onClick={() => router.push('/loan-eligibility')}>
                    PROCEED TO LOAN ELIGIBILITY
                </Button>
            </motion.div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
