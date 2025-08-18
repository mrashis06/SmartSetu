
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
    <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 800 150"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bridge Arch */}
        <motion.path
          d="M10 140 Q 400 10 790 140"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
        />
        {/* Bridge Deck */}
        <motion.path
          d="M10 140 H 790"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
        />
         {/* Vertical Supports */}
        {Array.from({ length: 15 }).map((_, i) => {
            const x = 50 + i * 50;
            // This quadratic formula calculates the y-position on the arc for a given x.
            // It's derived from the Bézier curve's properties to ensure the pillars meet the arc.
            const t = (x - 10) / (790 - 10);
            const y = Math.pow(1 - t, 2) * 140 + 2 * (1 - t) * t * 10 + Math.pow(t, 2) * 140;

            return (
                 <motion.path
                    key={i}
                    d={`M ${x} 140 V ${y}`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 + i * 0.1, repeat: Infinity, repeatDelay: 2 }}
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
