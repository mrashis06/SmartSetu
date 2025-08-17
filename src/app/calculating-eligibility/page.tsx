
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import AppHeader from "@/components/app-header";


const loadingTexts = [
  "SMARTSETU-AI IS ANALYZING YOUR DATA",
  "PREPARING YOUR REPORT",
  "ALMOST THERE...",
];

const blockVariants = {
  initial: {
    y: 0,
  },
  animate: (i: number) => ({
    y: [0, -20, 0],
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  }),
};

const LoadingBlocks = () => (
  <div className="flex justify-center space-x-2 my-8">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        custom={i}
        variants={blockVariants}
        initial="initial"
        animate="animate"
        className="w-6 h-6 rounded-sm bg-primary/50"
      />
    ))}
  </div>
);

const FlippingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 w-full overflow-hidden text-center">
      <AnimatePresence>
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          className="absolute inset-0 font-sans tracking-widest text-muted-foreground"
        >
          {loadingTexts[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};


export default function CalculatingEligibilityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/loan-eligibility');
    }, 6000);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold font-serif mb-8">
            Welcome {user.displayName}
          </h1>
          
          <LoadingBlocks />
          <FlippingText />
        </div>
      </main>
    </div>
  );
}
