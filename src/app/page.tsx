"use client";

import { useRef } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFaq = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onScrollToFaq={scrollToFaq} />
      <main className="flex-grow">
        <HeroSection onScrollToAbout={scrollToAbout} />
        <div ref={aboutRef}>
          <AboutSection />
        </div>
        <div ref={faqRef}>
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
