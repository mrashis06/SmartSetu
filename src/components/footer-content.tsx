
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
    chatSupport: { title: "Chat Support", description: "Live support", body: <p>Our chat support is available 24/7. Click the chat icon on the bottom right to start a conversation.</p>},
    safety: { title: "Safety", description: "Our commitment to your security", body: <p>We use industry-standard encryption and security protocols to protect your data. Your financial safety is our top priority.</p>},
    feedback: { title: "Feedback", description: "Help us improve", body: <p>We value your feedback. Please send your suggestions to feedback@smartsetu.com.</p>},
    cookieSettings: { title: "Cookie Settings", description: "Manage your preferences", body: <p>You can manage your cookie preferences in your browser settings. We use cookies to enhance your experience.</p>},
    guidelines: { title: "Community Guidelines", description: "Our rules of engagement", body: <p>We expect all users to interact respectfully. Any form of harassment or fraudulent activity will result in an immediate ban.</p>},
    acknowledgements: { title: "Acknowledgements", description: "Thanks to the community", body: <p>SmartSetu is built on open-source technology. We are grateful to the developer community for their contributions.</p>},
    licenses: { title: "Licenses", description: "Software licenses", body: <p>Our platform uses software licensed under the MIT, Apache 2.0, and other open-source licenses.</p>},
    companyInfo: { title: "Company Information", description: "Official details", body: <p>SmartSetu Pvt. Ltd. is registered in India. CIN: U12345XYZ. Registered Office: 123 Tech Park, Bangalore, India.</p>},
  },
  hindi: {
    aboutUs: {
      title: "हमारे बारे में",
      description: "SmartSetu के मिशन और विजन के बारे में और जानें।",
      body: (
        <div className="space-y-4">
          <p>SmartSetu में, हम मानते हैं कि हर किसी को बढ़ने, सफल होने और पहचाने जाने का एक समान अवसर मिलना चाहिए। हमारा प्लेटफ़ॉर्म उन व्यक्तियों और छोटे व्यवसायों के लिए अवसरों को खोलने के लिए बनाया गया है, जिन्हें पारंपरिक वित्तीय प्रणाली में अक्सर पीछे छोड़ दिया जाता है।</p>
          <p>हमारा मिशन है महत्वाकांक्षा और अवसर के बीच की खाई को पाटना, ताकि हर विक्रेता, छोटे उद्यमी और समुदाय का सदस्य एक मज़बूत और सुरक्षित भविष्य बना सके।</p>
        </div>
      ),
    },
    contactUs: {
      title: "हमसे संपर्क करें",
      description: "SmartSetu टीम से संपर्क करें।",
      body: <p>सहायता या पूछताछ के लिए, कृपया हमें support@smartsetu.com पर ईमेल करें या +91-1234567890 पर कॉल करें।</p>,
    },
    terms: {
        title: "सेवा की शर्तें",
        description: "कृपया हमारी सेवा की शर्तों को ध्यान से पढ़ें।",
        body: <p>SmartSetu का उपयोग करके, आप हमारे नियमों और शर्तों से सहमत होते हैं। ये शर्तें हमारी सेवाओं और प्लेटफ़ॉर्म के आपके उपयोग को नियंत्रित करती हैं। हम किसी भी समय इन शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। सेवा का निरंतर उपयोग नई शर्तों की स्वीकृति का गठन करता है।</p>
    },
    privacy: {
        title: "गोपनीयता नीति",
        description: "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है।",
        body: <p>हम आपके डेटा को केवल हमारी सेवाओं को बेहतर बनाने और आपकी ऋण पात्रता निर्धारित करने के लिए एकत्र और उपयोग करते हैं। हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं और आपकी स्पष्ट सहमति के बिना इसे कभी भी तीसरे पक्ष के साथ साझा नहीं करेंगे। सभी डेटा एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत है।</p>
    },
    chatSupport: { title: "चैट सहायता", description: "लाइव सहायता", body: <p>हमारी चैट सहायता 24/7 उपलब्ध है। बातचीत शुरू करने के लिए नीचे दाईं ओर चैट आइकन पर क्लिक करें।</p>},
    safety: { title: "सुरक्षा", description: "आपकी सुरक्षा के प्रति हमारी प्रतिबद्धता", body: <p>हम आपके डेटा की सुरक्षा के लिए उद्योग-मानक एन्क्रिप्शन और सुरक्षा प्रोटोकॉल का उपयोग करते हैं। आपकी वित्तीय सुरक्षा हमारी सर्वोच्च प्राथमिकता है।</p>},
    feedback: { title: "प्रतिक्रिया", description: "हमें बेहतर बनाने में मदद करें", body: <p>हम आपकी प्रतिक्रिया को महत्व देते हैं। कृपया अपने सुझाव feedback@smartsetu.com पर भेजें।</p>},
    cookieSettings: { title: "कुकी सेटिंग्स", description: "अपनी प्राथमिकताएं प्रबंधित करें", body: <p>आप अपनी ब्राउज़र सेटिंग्स में अपनी कुकी प्राथमिकताएं प्रबंधित कर सकते हैं। हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं।</p>},
    guidelines: { title: "सामुदायिक दिशानिर्देश", description: "हमारे जुड़ाव के नियम", body: <p>हम सभी उपयोगकर्ताओं से सम्मानपूर्वक बातचीत करने की अपेक्षा करते हैं। किसी भी प्रकार के उत्पीड़न या धोखाधड़ी की गतिविधि के परिणामस्वरूप तत्काल प्रतिबंध लगाया जाएगा।</p>},
    acknowledgements: { title: "स्वीकृतियाँ", description: "समुदाय को धन्यवाद", body: <p>SmartSetu ओपन-सोर्स तकनीक पर बनाया गया है। हम उनके योगदान के लिए डेवलपर समुदाय के आभारी हैं।</p>},
    licenses: { title: "लाइसेंस", description: "सॉफ्टवेयर लाइसेंस", body: <p>हमारा प्लेटफ़ॉर्म MIT, Apache 2.0 और अन्य ओपन-सोर्स लाइसेंस के तहत लाइसेंस प्राप्त सॉफ़्टवेयर का उपयोग करता है।</p>},
    companyInfo: { title: "कंपनी की जानकारी", description: "आधिकारिक विवरण", body: <p>SmartSetu Pvt. Ltd. भारत में पंजीकृत है। CIN: U12345XYZ. पंजीकृत कार्यालय: 123 टेक पार्क, बैंगलोर, भारत।</p>},
  },
  bengali: {
    aboutUs: {
      title: "আমাদের সম্পর্কে",
      description: "SmartSetu-এর লক্ষ্য ও দৃষ্টিভঙ্গি সম্পর্কে আরও জানুন।",
      body: (
        <div className="space-y-4">
          <p>SmartSetu-তে, আমরা বিশ্বাস করি প্রত্যেকেরই বেড়ে ওঠার, সফল হওয়ার এবং স্বীকৃতি পাওয়ার ন্যায্য সুযোগ থাকা উচিত। আমাদের প্ল্যাটফর্মটি এমন ব্যক্তি ও ছোট ব্যবসার জন্য তৈরি, যাদেরকে প্রথাগত আর্থিক ব্যবস্থায় প্রায়শই পিছিয়ে রাখা হয়।</p>
          <p>আমাদের লক্ষ্য হলো উচ্চাকাঙ্ক্ষা ও সুযোগের মধ্যে সেতুবন্ধন তৈরি করা, যাতে প্রতিটি বিক্রেতা, ক্ষুদ্র উদ্যোক্তা এবং সমাজের সদস্য একটি শক্তিশালী ও নিরাপদ ভবিষ্যৎ গড়ে তুলতে পারে।</p>
        </div>
      ),
    },
    contactUs: {
      title: "যোগাযোগ করুন",
      description: "SmartSetu দলের সাথে যোগাযোগ করুন।",
      body: <p>সহায়তা বা অনুসন্ধানের জন্য, অনুগ্রহ করে আমাদের support@smartsetu.com এ ইমেল করুন বা +91-1234567890 নম্বরে কল করুন।</p>,
    },
    terms: {
        title: "পরিষেবার শর্তাবলী",
        description: "অনুগ্রহ করে আমাদের পরিষেবার শর্তাবলী মনোযোগ সহকারে পড়ুন।",
        body: <p>SmartSetu ব্যবহার করে, আপনি আমাদের নিয়ম ও শর্তাবলীতে সম্মত হচ্ছেন। এই শর্তাবলী আমাদের পরিষেবা এবং প্ল্যাটফর্মের আপনার ব্যবহার নিয়ন্ত্রণ করে। আমরা যে কোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি। পরিষেবার ক্রমাগত ব্যবহার নতুন শর্তাবলীর স্বীকৃতি হিসাবে গণ্য হবে।</p>
    },
    privacy: {
        title: "গোপনীয়তা নীতি",
        description: "আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ।",
        body: <p>আমরা আপনার ডেটা শুধুমাত্র আমাদের পরিষেবা উন্নত করতে এবং আপনার ঋণের যোগ্যতা নির্ধারণ করতে সংগ্রহ ও ব্যবহার করি। আমরা আপনার ব্যক্তিগত তথ্য রক্ষা করতে প্রতিশ্রুতিবদ্ধ এবং আপনার স্পষ্ট সম্মতি ছাড়া তৃতীয় পক্ষের সাথে কখনো শেয়ার করব না। সমস্ত ডেটা এনক্রিপ্ট করা এবং সুরক্ষিতভাবে সংরক্ষণ করা হয়।</p>
    },
    chatSupport: { title: "চ্যাট সাপোর্ট", description: "লাইভ সাপোর্ট", body: <p>আমাদের চ্যাট সাপোর্ট ২৪/৭ উপলব্ধ। কথোপকথন শুরু করতে নীচের ডানদিকের চ্যাট আইকনে ক্লিক করুন।</p>},
    safety: { title: "নিরাপত্তা", description: "আপনার সুরক্ষার প্রতি আমাদের প্রতিশ্রুতি", body: <p>আমরা আপনার ডেটা সুরক্ষিত রাখতে ইন্ডাস্ট্রি-স্ট্যান্ডার্ড এনক্রিপশন এবং সুরক্ষা প্রোটোকল ব্যবহার করি। আপনার আর্থিক নিরাপত্তাই আমাদের সর্বোচ্চ অগ্রাধিকার।</p>},
    feedback: { title: "মতামত", description: "আমাদের উন্নত করতে সাহায্য করুন", body: <p>আমরা আপনার মতামতকে মূল্য দিই। অনুগ্রহ করে আপনার পরামর্শ feedback@smartsetu.com-এ পাঠান।</p>},
    cookieSettings: { title: "কুকি সেটিংস", description: "আপনার পছন্দ পরিচালনা করুন", body: <p>আপনি আপনার ব্রাউজার সেটিংসে আপনার কুকি পছন্দ পরিচালনা করতে পারেন। আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি।</p>},
    guidelines: { title: "সম্প্রদায়ের নির্দেশিকা", description: "আমাদের অংশগ্রহণের নিয়ম", body: <p>আমরা আশা করি সকল ব্যবহারকারী সম্মানজনকভাবে মতবিনিময় করবেন। যেকোনো ধরনের হয়রানি বা প্রতারণামূলক কার্যকলাপের ফলে অবিলম্বে নিষেধাজ্ঞা জারি করা হবে।</p>},
    acknowledgements: { title: "স্বীকৃতি", description: "সম্প্রদায়কে ধন্যবাদ", body: <p>SmartSetu ওপেন-সোর্স প্রযুক্তির উপর নির্মিত। আমরা ডেভেলপার সম্প্রদায়ের অবদানের জন্য কৃতজ্ঞ।</p>},
    licenses: { title: "লাইসেন্স", description: "সফ্টওয়্যার লাইসেন্স", body: <p>আমাদের প্ল্যাটফর্ম এমআইটি, অ্যাপাচি ২.০ এবং অন্যান্য ওপেন-সোর্স লাইসেন্সের অধীনে লাইসেন্সপ্রাপ্ত সফ্টওয়্যার ব্যবহার করে।</p>},
    companyInfo: { title: "কোম্পানির তথ্য", description: "অফিসিয়াল বিবরণ", body: <p>SmartSetu Pvt. Ltd. ভারতে নিবন্ধিত। CIN: U12345XYZ। নিবন্ধিত কার্যালয়: ১২৩ টেক পার্ক, ব্যাঙ্গালোর, ভারত।</p>},
  },
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
           <SheetHeader>
            <SheetTitle className="text-2xl font-headline">{content?.title || 'Loading...'}</SheetTitle>
            <SheetDescription>{content?.description || ''}</SheetDescription>
           </SheetHeader>
           {content && (
            <ScrollArea className="h-[calc(100%-4rem)] pr-4">
              <div className="py-6 text-foreground/80">
                {content.body}
              </div>
            </ScrollArea>
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
