import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is SmartSetu?",
      answer: "SmartSetu is a comprehensive platform designed to streamline collaboration, project management, and communication for teams of all sizes. It acts as a digital bridge, connecting different parts of your workflow into one cohesive experience.",
    },
    {
      question: "Who is SmartSetu for?",
      answer: "SmartSetu is for anyone looking to improve their productivity and collaboration. This includes startups, established enterprises, freelancers, and students. Our flexible tools can be adapted to any industry or project type.",
    },
    {
      question: "Can I integrate SmartSetu with other tools?",
      answer: "Yes! We are constantly expanding our library of integrations. SmartSetu is designed to work seamlessly with the tools you already use, creating a centralized hub for all your work.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Absolutely. You can sign up using the 'Get Started' button to explore the core features of SmartSetu with a 14-day free trial. No credit card required.",
    },
  ];
  return (
    <section id="faqs" className="container mx-auto py-12 sm:py-24">
      <h2 className="text-3xl font-bold text-center mb-8 font-headline">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
