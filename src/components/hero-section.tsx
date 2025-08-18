
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";

type HeroSectionProps = {
  onScrollToAbout: () => void;
};

const AnimatedBridge = () => {
  const numSuspenders = 18;
  return (
    <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="hsl(var(--primary))" strokeWidth="1.5">
          {/* Main Towers */}
          <motion.path
            d="M 150 200 V 80"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
          />
          <motion.path
            d="M 650 200 V 80"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
          />
          {/* Main Suspension Cable */}
          <motion.path
            d="M 150 80 Q 400 180 650 80"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
          />
          {/* Bridge Deck */}
          <motion.path
            d="M 10 160 H 790"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
          />
          {/* Vertical Suspenders */}
          {Array.from({ length: numSuspenders }).map((_, i) => {
            const t = (i + 1) / (numSuspenders + 1);
            const x = 150 + t * (650 - 150);
            // Quadratic Bézier curve formula: y = (1-t)^2*P0y + 2(1-t)*t*P1y + t^2*P2y
            const y = Math.pow(1 - t, 2) * 80 + 2 * (1 - t) * t * 180 + Math.pow(t, 2) * 80;
            return (
              <motion.path
                key={i}
                d={`M ${x} ${y} V 160`}
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 2 + i * 0.1, repeat: Infinity, repeatDelay: 4 }}
              />
            );
          })}
        </g>
      </motion.svg>
    </div>
  );
};


export default function HeroSection({ onScrollToAbout }: HeroSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="relative container mx-auto flex flex-col items-center justify-center text-center py-48 sm:py-64">
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
