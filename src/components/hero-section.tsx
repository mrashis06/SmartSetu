
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";

type HeroSectionProps = {
  onScrollToAbout: () => void;
};

const AnimatedBridge = () => (
    <div className="absolute bottom-0 left-0 w-full h-48 overflow-hidden">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 800 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bridge Arch */}
        <motion.path
          d="M10 110 Q 400 10 790 110"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        {/* Bridge Deck */}
        <motion.path
          d="M10 110 H 790"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
         {/* Vertical Supports */}
        {[100, 200, 300, 500, 600, 700].map((x, i) => {
            const y = 10 + 3.8e-4 * Math.pow(x - 400, 2);
            return (
                 <motion.path
                    key={i}
                    d={`M ${x} 110 V ${y}`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 * i, repeat: Infinity, repeatType: "reverse" }}
                 />
            )
        })}
      </motion.svg>
    </div>
  );

export default function HeroSection({ onScrollToAbout }: HeroSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="relative container mx-auto flex flex-col items-center justify-center text-center py-24 sm:py-32">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline animate-glowing">
        {t('hero.headline')}
      </h1>
      <p className="max-w-2xl text-lg text-foreground/80 mb-8">
        {t('hero.subheadline')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href={user ? "/questionnaire" : "/signup"}>{t('hero.getStarted')}</Link>
        </Button>
        <Button variant="outline" size="lg" onClick={onScrollToAbout}>
          {t('hero.aboutUs')}
        </Button>
      </div>
      <AnimatedBridge />
    </section>
  );
}
