
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { useLanguage } from "@/context/language-context";

type Content = {
  title: string;
  description: string;
  body: ReactNode;
};

// Hardcoded content, structured for easy replacement later
const contentData: Record<string, Record<string, Content>> = {
  english: {
    aboutUs: {
      title: "About Us",
      description: "Learn more about SmartSetu's mission and vision.",
      body: (
        <div className="space-y-4">
          <p>At SmartSetu, we believe that everyone deserves a fair chance to grow, succeed, and be recognized. Our platform is designed to unlock opportunities for individuals and small businesses who are often left behind in the traditional financial system.</p>
          <p>Our mission is to bridge the gap between ambition and opportunity, so that every vendor, small entrepreneur, and community member can build a stronger, more secure future.</p>
        </div>
      ),
    },
    contactUs: {
      title: "Contact Us",
      description: "Get in touch with the SmartSetu team.",
      body: <p>For support or inquiries, please email us at support@smartsetu.com or call us at +91-1234567890.</p>,
    },
    terms: {
        title: "Terms of Service",
        description: "Please read our terms of service carefully.",
        body: <p>By using SmartSetu, you agree to our terms and conditions. These terms govern your use of our services and platform. We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
    },
    privacy: {
        title: "Privacy Policy",
        description: "Your privacy is important to us.",
        body: <p>We collect and use your data only to improve our services and determine your loan eligibility. We are committed to protecting your personal information and will never share it with third parties without your explicit consent. All data is encrypted and stored securely.</p>
    },
    // Add other content sections here...
    chatSupport: { title: "Chat Support", description: "Live support", body: <p>Our chat support is available 24/7. Click the chat icon on the bottom right to start a conversation.</p>},
    safety: { title: "Safety", description: "Our commitment to your security", body: <p>We use industry-standard encryption and security protocols to protect your data. Your financial safety is our top priority.</p>},
    feedback: { title: "Feedback", description: "Help us improve", body: <p>We value your feedback. Please send your suggestions to feedback@smartsetu.com.</p>},
    cookieSettings: { title: "Cookie Settings", description: "Manage your preferences", body: <p>You can manage your cookie preferences in your browser settings. We use cookies to enhance your experience.</p>},
    guidelines: { title: "Community Guidelines", description: "Our rules of engagement", body: <p>We expect all users to interact respectfully. Any form of harassment or fraudulent activity will result in an immediate ban.</p>},
    acknowledgements: { title: "Acknowledgements", description: "Thanks to the community", body: <p>SmartSetu is built on open-source technology. We are grateful to the developer community for their contributions.</p>},
    licenses: { title: "Licenses", description: "Software licenses", body: <p>Our platform uses software licensed under the MIT, Apache 2.0, and other open-source licenses.</p>},
    companyInfo: { title: "Company Information", description: "Official details", body: <p>SmartSetu Pvt. Ltd. is registered in India. CIN: U12345XYZ. Registered Office: 123 Tech Park, Bangalore, India.</p>},
  },
  // Add hindi and bengali versions here...
};


interface FooterContentContextType {
  openContent: (contentId: string) => void;
}

const FooterContentContext = createContext<FooterContentContextType | undefined>(undefined);

export const FooterContentProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const { language } = useLanguage();

  const openContent = (contentId: string) => {
    // Fallback to English if the language or content doesn't exist
    const langData = contentData[language] || contentData.english;
    const selectedContent = langData[contentId] || contentData.english[contentId];

    if (selectedContent) {
      setContent(selectedContent);
      setIsOpen(true);
    }
  };

  return (
    <FooterContentContext.Provider value={{ openContent }}>
      {children}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-lg">
           {content && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-headline">{content.title}</SheetTitle>
                <SheetDescription>{content.description}</SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100%-4rem)] pr-4">
                <div className="py-6 text-foreground/80">
                  {content.body}
                </div>
              </ScrollArea>
            </>
           )}
        </SheetContent>
      </Sheet>
    </FooterContentContext.Provider>
  );
};

export const useFooterContent = () => {
  const context = useContext(FooterContentContext);
  if (context === undefined) {
    throw new Error("useFooterContent must be used within a FooterContentProvider");
  }
  return context;
};
