
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Typewriter = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};


const AnimatedProgress = ({ value }: { value: number }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return <Progress value={progress} className="w-full h-2 bg-green-200 [&>div]:bg-green-500" />;
}

const tools = [
  {
    title: "ALT-SCORE",
    description: "Know your financial strength from UPI and cash flow",
    image: "https://placehold.co/300x200.png",
    hint: "financial growth",
    path: "/calculating"
  },
  {
    title: "RISK-SCORE",
    description: "Check your repayment profile and risk level.",
    image: "https://placehold.co/300x200.png",
    hint: "risk assessment",
    path: "/risk-score"
  },
  {
    title: "LOAN ELIGIBILITY",
    description: "See your loan amount, interest, EMI, and tenure",
    image: "https://placehold.co/300x200.png",
    hint: "loan document",
    path: "/loan-eligibility"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  const handleCheckNow = (path: string) => {
    router.push(path);
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
      <header className="sticky top-0 z-50 w-full">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#" className="transition-colors hover:text-primary">FAQs</Link>
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/dashboard" className="transition-colors hover:text-primary font-bold">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
              <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 p-4">
                    <Link href="#" className="transition-colors hover:text-primary">FAQs</Link>
                    <Link href="/" className="transition-colors hover:text-primary">Home</Link>
                    <Link href="/dashboard" className="transition-colors hover:text-primary font-bold">Dashboard</Link>
                    <Button onClick={signOut} variant="outline">Logout</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
             <Button onClick={signOut} variant="outline" className="hidden md:flex">Logout</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-serif mb-4">
            <Typewriter text={`Welcome ${user.displayName}`} />
          </h1>
          <div className="max-w-md mx-auto">
            <p className="text-muted-foreground uppercase tracking-widest mb-2 font-sans">
              YOUR LOAN APPLICATION: 
              <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full ml-2">UNDER REVIEW...</span>
            </p>
            <AnimatedProgress value={33} />
          </div>

          <p className="mt-8 text-muted-foreground uppercase tracking-widest font-sans">
            Till then you can explore our smart AI tools
          </p>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tools.map((tool) => (
              <motion.div key={tool.title} variants={itemVariants}>
                <Card className="text-center bg-transparent border-primary/50 h-full flex flex-col justify-between">
                    <div>
                        <CardHeader>
                            <CardTitle className="font-bold tracking-widest">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 border border-primary/50 rounded-lg p-2 inline-block">
                            <Image
                                src={tool.image}
                                alt={tool.title}
                                width={200}
                                height={150}
                                className="rounded-md"
                                data-ai-hint={tool.hint}
                            />
                            </div>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardContent>
                    </div>
                    <motion.div 
                        className="p-6 pt-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button className="rounded-full bg-primary/80 hover:bg-primary text-primary-foreground w-full" onClick={() => handleCheckNow(tool.path)}>
                            Check Now <SparkleIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
