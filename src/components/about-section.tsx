import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about-us" className="bg-secondary/50 py-12 sm:py-24">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 font-headline">About SmartSetu</h2>
          <p className="text-foreground/80 mb-4">
            We believe in building bridges—not just with technology, but between people, ideas, and opportunities. SmartSetu was founded on the principle of simplifying complexity and empowering individuals and teams to achieve their full potential.
          </p>
          <p className="text-foreground/80">
            Our platform is designed to be intuitive, powerful, and adaptable to your unique workflow, ensuring that you have the right tools to build your own bridge to success.
          </p>
        </div>
        <div>
          <Card className="overflow-hidden rounded-lg shadow-md">
            <Image
              src="https://placehold.co/600x400.png"
              alt="A diverse team collaborating in a modern office"
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
