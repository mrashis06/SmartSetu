import { Button } from "@/components/ui/button";
import Link from "next/link";

type HeroSectionProps = {
  onScrollToAbout: () => void;
};

export default function HeroSection({ onScrollToAbout }: HeroSectionProps) {
  return (
    <section className="container mx-auto flex flex-col items-center justify-center text-center py-24 sm:py-32">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline">
        Your Bridge to a Better Future
      </h1>
      <p className="max-w-2xl text-lg text-foreground/80 mb-8">
        SmartSetu is your all-in-one platform for seamless collaboration, innovative solutions, and unparalleled growth. Connect, create, and conquer your goals with us.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button variant="outline" size="lg" onClick={onScrollToAbout}>
          About Us
        </Button>
      </div>
    </section>
  );
}
