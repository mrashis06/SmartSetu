
"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about-us" className="bg-secondary/50 py-12 sm:py-24">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 font-headline">{t('about.title')}</h2>
          <p className="text-foreground/80 mb-4">
            {t('about.paragraph1')}
          </p>
          <p className="text-foreground/80">
            {t('about.paragraph2')}
          </p>
        </div>
        <div>
          <Card className="overflow-hidden rounded-lg shadow-md">
            <Image
              src="https://placehold.co/600x400.png"
              alt={t('about.imageAlt')}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              data-ai-hint="team collaboration"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
