
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";

type HeroSectionProps = {
  onScrollToAbout: () => void;
};

const AnimatedWave = () => (
    <div className="absolute bottom-0 left-0 w-full h-40 overflow-hidden">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          initial={{ d: "M0,60 C240,110 480,10 720,60 S960,110 1200,60 S1440,10 1440,60 V120 H0 Z" }}
          animate={{ d: "M0,60 C240,10 480,110 720,60 S960,10 1200,60 S1440,110 1440,60 V120 H0 Z" }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="transparent"
        />
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
      <AnimatedWave />
    </section>
  );
}
