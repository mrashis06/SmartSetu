
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PersonalInfoForm } from "@/components/questionnaire/personal-info-form";
import { FinancialInfoForm } from "@/components/questionnaire/financial-info-form";
import { AdditionalInfoForm } from "@/components/questionnaire/additional-info-form";
import { UploadDocumentsForm } from "@/components/questionnaire/upload-documents-form";
import { QuestionnaireProvider, useQuestionnaire } from "@/context/questionnaire-context";
import { SubmitForm } from "@/components/questionnaire/submit-form";
import AppHeader from "@/components/app-header";
import { Loader2 } from "lucide-react";

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
  const { isLoading } = useQuestionnaire();

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

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="animate-spin h-8 w-8" />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--pale-off-white))] dark:bg-background">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-8">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif mb-2 text-foreground/80">Welcome {user!.displayName}!</h1>
                    <p className="text-muted-foreground font-serif tracking-wider">LET US KNOW YOU BETTER</p>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center w-full">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id ? 'bg-primary border-primary text-primary-foreground' : 'bg-secondary border-border'}`}>
                                        {step.id}
                                    </div>
                                    <p className="text-sm mt-2 text-center text-muted-foreground">{step.name}</p>
                                </div>
                                {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-background/80 p-8 rounded-lg shadow-lg">
                    {currentStep === 1 && <PersonalInfoForm onNext={handleNext} />}
                    {currentStep === 2 && <FinancialInfoForm onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 3 && <AdditionalInfoForm onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 4 && <UploadDocumentsForm onNext={handleNext} onBack={handleBack} />}
                    {currentStep === 5 && <SubmitForm onBack={handleBack} goToStep={goToStep} />}
                </div>
            </div>
        </main>
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
    <QuestionnaireProvider>
      <QuestionnaireContent />
    </QuestionnaireProvider>
  )
}
