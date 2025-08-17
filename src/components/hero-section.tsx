
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/language-context";

type HeroSectionProps = {
  onScrollToAbout: () => void;
};

export default function HeroSection({ onScrollToAbout }: HeroSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="container mx-auto flex flex-col items-center justify-center text-center py-24 sm:py-32">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline">
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
    </section>
  );
}
