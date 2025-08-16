"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onScrollToFaq: () => void;
};

export default function Header({ onScrollToFaq }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-6 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button
            onClick={onScrollToFaq}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            aria-label="Scroll to Frequently Asked Questions"
          >
            FAQs
          </button>
          <Link href="/login" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
        {/* A mobile menu can be added here in the future */}
      </div>
    </header>
  );
}
