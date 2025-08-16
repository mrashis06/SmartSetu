
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/footer";

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


export default function CalculatingPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/alt-score');
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
            <ThemeToggle />
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

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold font-serif mb-8">
            Welcome {user.displayName}
          </h1>
          
          <LoadingBlocks />
          <FlippingText />
        </div>
      </main>
      <Footer />
    </div>
  );
}
