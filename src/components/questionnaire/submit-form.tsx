
"use client";

import { useState } from "react";
import { useQuestionnaire } from "@/context/questionnaire-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

type SubmitFormProps = {
  onBack: () => void;
  goToStep: (step: number) => void;
};

const Section = ({ title, data, onEdit }: { title: string; data: Record<string, any>; onEdit: () => void; }) => {
  const renderValue = (value: any) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === 'yes' || value === 'no') return value.charAt(0).toUpperCase() + value.slice(1);
    return value || 'N/A';
  }

  // A simple formatter for keys
  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1') // insert a space before all caps
      .replace(/^./, (str) => str.toUpperCase()); // capitalize the first letter
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-serif">{title}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit {title}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <p className="text-sm font-medium text-muted-foreground">{formatKey(key)}</p>
              <p className="font-semibold">{renderValue(value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


export function SubmitForm({ onBack, goToStep }: SubmitFormProps) {
  const { formData } = useQuestionnaire();
  const { user } = useAuth();
  const router = useRouter();
  const [hasConsented, setHasConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!hasConsented) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please agree to the terms and conditions before submitting.",
      });
      return;
    }

    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to submit the form.",
        });
        return;
    }

    setIsSubmitting(true);

    try {
      const docRef = doc(db, "loan_applications", user.uid);
      await setDoc(docRef, {
        ...formData,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
      });

      console.log("Form Submitted:", formData);
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for submitting your application. We will be in touch shortly.",
      });

      // Clear local storage after successful submission
      localStorage.removeItem("questionnaireFormData");

      router.push("/dashboard");

    } catch (error) {
        console.error("Error saving to Firestore:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was an error saving your application. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h3 className="font-serif tracking-wider text-2xl font-bold">Review Your Application</h3>
        <p className="font-sans text-muted-foreground">Please review all the information below and ensure it is correct.</p>
      </div>

      <Section title="Personal Information" data={formData.personalInfo} onEdit={() => goToStep(1)} />
      <Section title="Financial Information" data={formData.financialInfo} onEdit={() => goToStep(2)} />
      <Section title="Additional Information" data={formData.additionalInfo} onEdit={() => goToStep(3)} />

      <Separator className="my-8" />

      <div className="space-y-6">
        <div className="items-top flex space-x-2">
           <Checkbox id="consent" checked={hasConsented} onCheckedChange={(checked) => setHasConsented(Boolean(checked))} />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="consent" className="font-semibold">
              Consent & Agreement
            </Label>
            <p className="text-sm text-muted-foreground">
              I agree that the data is mine and give consent for the next process.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>Back</Button>
        <Button onClick={handleSubmit} disabled={!hasConsented || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
        </Button>
      </div>
    </div>
  );
}
