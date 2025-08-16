
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { PersonalInfoForm } from "@/components/questionnaire/personal-info-form";
import { FinancialInfoForm } from "@/components/questionnaire/financial-info-form";
import { AdditionalInfoForm } from "@/components/questionnaire/additional-info-form";
import { UploadDocumentsForm } from "@/components/questionnaire/upload-documents-form";
import { QuestionnaireProvider } from "@/context/questionnaire-context";
import { SubmitForm } from "@/components/questionnaire/submit-form";
import Footer from "@/components/footer";

const steps = [
  { id: 1, name: "Personal Info" },
  { id: 2, name: "Financial info" },
  { id: 3, name: "Additional" },
  { id: 4, name: "Upload Documents" },
  { id: 5, name: "Submit" },
];

function QuestionnaireContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();

  const handleNext = () => {
    setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };
  
  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F0FFF0]">
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Logo className="h-6 w-auto" />
                </Link>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif mb-2">Welcome {user!.displayName}!</h1>
                    <p className="text-muted-foreground font-serif tracking-wider">LET US KNOW YOU BETTER</p>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center w-full">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {step.id}
                                    </div>
                                    <p className="text-sm mt-2 text-center">{step.name}</p>
                                </div>
                                {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white/50 p-8 rounded-lg shadow-sm">
                    {currentStep === 1 && <PersonalInfoForm onNext={handleNext} />}
                    {currentStep === 2 && <FinancialInfoForm onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 3 && <AdditionalInfoForm onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 4 && <UploadDocumentsForm onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 5 && <SubmitForm onBack={handleBack} goToStep={goToStep} />}
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}


export default function QuestionnairePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/50">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <QuestionnaireProvider user={{email: user.email, displayName: user.displayName}}>
      <QuestionnaireContent />
    </QuestionnaireProvider>
  )
}
