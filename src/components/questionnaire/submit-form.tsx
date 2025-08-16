
"use client";

import { useState } from "react";
import { useQuestionnaire } from "@/context/questionnaire-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [hasConsented, setHasConsented] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!hasConsented) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please agree to the terms and conditions before submitting.",
      });
      return;
    }
    console.log("Form Submitted:", formData);
    // Here you would typically send the data to your backend
    toast({
      title: "Application Submitted!",
      description: "Thank you for submitting your application. We will be in touch shortly.",
    });
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
              By checking this box, I consent to the collection and processing of my personal data as described in the Privacy Policy. I confirm that all information provided is accurate and complete to the best of my knowledge.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleSubmit} disabled={!hasConsented}>Submit Application</Button>
      </div>
    </div>
  );
}
