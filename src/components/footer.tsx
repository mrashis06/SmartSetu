import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Instagram, Facebook, Youtube, X, LucideProps } from "lucide-react";

// A component for the TikTok icon as it's not in lucide-react
const TikTokIcon = (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 8v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z" />
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M16 12a3 3 0 1 0 0-6" />
    </svg>
);


export default function Footer() {
  const socialIcons = [
    { href: "#", icon: <X className="h-5 w-5" /> },
    { href: "#", icon: <Instagram className="h-5 w-5" /> },
    { href: "#", icon: <Facebook className="h-5 w-5" /> },
    { href: "#", icon: <Youtube className="h-5 w-5" /> },
    { href: "#", icon: <TikTokIcon className="h-5 w-5" /> },
  ];

  const footerLinks = {
    Company: [
      { href: "#", text: "About us" },
      { href: "#", text: "Contact us" },
    ],
    Resources: [
      { href: "#", text: "Chat Support" },
      { href: "#", text: "Safety" },
      { href: "#", text: "Feedback" },
    ],
    Policies: [
      { href: "#", text: "Terms" },
      { href: "#", text: "Privacy" },
      { href: "#", text: "Cookie Settings" },
      { href: "#", text: "Guidelines" },
      { href: "#", text: "Acknowledgements" },
      { href: "#", text: "Licenses" },
      { href: "#", text: "Company Information" },
    ],
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Social and Language Column */}
          <div className="col-span-2 md:col-span-1">
             <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Language</p>
              <Select defaultValue="english">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
                 <p className="text-sm font-semibold mb-2">Social</p>
                <div className="flex space-x-4">
                    {socialIcons.map((social, index) => (
                        <Link href={social.href} key={index} className="text-secondary-foreground/80 hover:text-secondary-foreground">
                            {social.icon}
                        </Link>
                    ))}
                </div>
            </div>
          </div>
          {/* Navigation Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-primary mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.text}>
                    <Link href={link.href} className="text-secondary-foreground/80 hover:text-secondary-foreground text-sm">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-primary/50" />

        <div className="flex justify-between items-center pt-8">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
