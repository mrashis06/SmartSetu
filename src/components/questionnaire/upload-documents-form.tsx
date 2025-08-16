
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useQuestionnaire } from "@/context/questionnaire-context";
import { verifyDocuments } from "@/ai/flows/verify-documents-flow";
import { Loader2, Upload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const documentsSchema = z.object({
  aadhar: z.string().optional(),
  pan: z.string().optional(),
  shop: z.string().optional(),
});

type VerificationStatus = "pending" | "approved" | "rejected";

type DocumentState = {
  file: File | null;
  preview: string | null;
  status: VerificationStatus;
};

type UploadDocumentsFormProps = {
  onNext: () => void;
  onBack: () => void;
};

export function UploadDocumentsForm({ onNext, onBack }: UploadDocumentsFormProps) {
  const { formData, updateFormData } = useQuestionnaire();
  const { toast } = useToast();

  const [aadhar, setAadhar] = useState<DocumentState>({ file: null, preview: null, status: "pending" });
  const [pan, setPan] = useState<DocumentState>({ file: null, preview: null, status: "pending" });
  const [shop, setShop] = useState<DocumentState>({ file: null, preview: null, status: "pending" });
  const [isVerifying, setIsVerifying] = useState(false);

  const aadharInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);
  const shopInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<DocumentState>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter({ file, preview: reader.result as string, status: 'pending' });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusIndicator = (status: VerificationStatus) => {
    switch (status) {
        case "approved":
            return <div className="flex items-center text-green-600"><CheckCircle2 className="mr-2" /> Approved</div>;
        case "rejected":
            return <div className="flex items-center text-red-600"><AlertCircle className="mr-2" /> Approval Pending</div>;
        default:
            return null;
    }
  }

  const handleVerify = async () => {
    if (!aadhar.file || !shop.file) {
      toast({
        variant: "destructive",
        title: "Missing Documents",
        description: "Please upload the mandatory Aadhar Card and Shop Photo.",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyDocuments({
        aadharDataUri: aadhar.preview!,
        shopPhotoDataUri: shop.preview!,
        panDataUri: pan.preview,
        businessType: formData.financialInfo.businessType,
      });

      setAadhar(prev => ({ ...prev, status: result.isAadharValid ? 'approved' : 'rejected' }));
      setShop(prev => ({ ...prev, status: result.isShopPhotoValid ? 'approved' : 'rejected' }));
      if (pan.file) {
        setPan(prev => ({ ...prev, status: result.isPanValid ? 'approved' : 'rejected' }));
      }
      
      toast({
        title: "Verification Complete",
        description: "Document verification process has finished.",
      });

    } catch (error) {
      console.error("Verification failed:", error);
       toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "An error occurred during document verification. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const allMandatoryApproved = aadhar.status === 'approved' && shop.status === 'approved';
  const panApprovedOrNotUploaded = pan.status === 'approved' || !pan.file;

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-serif tracking-wider text-lg">CHECK YOUR ELIGIBILITY</h3>
        <h4 className="font-sans text-muted-foreground">UPLOAD DOCUMENTS</h4>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="font-semibold">AADHAR CARD (MANDATORY)</p>
           <Card className="mt-2">
              <CardContent className="p-4">
                {aadhar.preview ? (
                  <div className="relative">
                    <Image src={aadhar.preview} alt="Aadhar Preview" width={200} height={120} className="rounded-md" />
                     <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => aadharInputRef.current?.click()}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => aadharInputRef.current?.click()}>
                    <Upload className="mr-2" /> Upload
                  </Button>
                )}
                 <input type="file" ref={aadharInputRef} onChange={(e) => handleFileChange(e, setAadhar)} className="hidden" accept="image/*" />
                 <div className="mt-2 font-medium">{getStatusIndicator(aadhar.status)}</div>
              </CardContent>
            </Card>
        </div>
        <div>
          <p className="font-semibold">PAN CARD (OPTIONAL)</p>
          <Card className="mt-2">
              <CardContent className="p-4">
                {pan.preview ? (
                  <div className="relative">
                    <Image src={pan.preview} alt="PAN Preview" width={200} height={120} className="rounded-md" />
                     <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => panInputRef.current?.click()}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => panInputRef.current?.click()}>
                    <Upload className="mr-2" /> Upload
                  </Button>
                )}
                 <input type="file" ref={panInputRef} onChange={(e) => handleFileChange(e, setPan)} className="hidden" accept="image/*" />
                 <div className="mt-2 font-medium">{getStatusIndicator(pan.status)}</div>
              </CardContent>
            </Card>
        </div>
        <div>
          <p className="font-semibold">SHOP PHOTO (MANDATORY)</p>
          <Card className="mt-2">
              <CardContent className="p-4">
                {shop.preview ? (
                  <div className="relative">
                    <Image src={shop.preview} alt="Shop Preview" width={200} height={120} className="rounded-md" />
                     <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => shopInputRef.current?.click()}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => shopInputRef.current?.click()}>
                    <Upload className="mr-2" /> Upload
                  </Button>
                )}
                 <input type="file" ref={shopInputRef} onChange={(e) => handleFileChange(e, setShop)} className="hidden" accept="image/*" />
                 <div className="mt-2 font-medium">{getStatusIndicator(shop.status)}</div>
              </CardContent>
            </Card>
        </div>
      </div>
       <div className="mt-8 flex justify-center">
            <Button onClick={handleVerify} disabled={isVerifying || !aadhar.file || !shop.file}>
                {isVerifying && <Loader2 className="mr-2 animate-spin" />}
                Verify Documents
            </Button>
        </div>
      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!allMandatoryApproved || !panApprovedOrNotUploaded}>Next</Button>
      </div>
    </div>
  );
}
