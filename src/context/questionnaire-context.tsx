
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";


export type PersonalInfoData = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  email?: string;
  phone?: string;
  altPhone?: string;
  address?: string;
};

export type FinancialInfoData = {
  businessType?: string;
  businessDuration?: string;

  stockValue?: string;
  monthlyUpiTransactions?: string;
  monthlyCashIncome?: string;
  monthlyExpenses?: string;
  existingLoan?: "yes" | "no";
};

export type AdditionalInfoData = {
  hasCibilScore?: "yes" | "no";
  cibilScore?: string;
  ownHouse?: "yes" | "no";
  ownBusiness?: "yes" | "no";
  govtBenefits?: "yes" | "no";
  benefitType?: string;
};

export type DocumentUploadData = {
  aadhar?: string;
  pan?: string;
  shop?: string;
}

export type QuestionnaireData = {
  personalInfo: PersonalInfoData;
  financialInfo: FinancialInfoData;
  additionalInfo: AdditionalInfoData;
  documents: DocumentUploadData;
};

interface QuestionnaireContextType {
  formData: QuestionnaireData;
  updateFormData: (data: Partial<QuestionnaireData>) => void;
  setPersonalInfo: (data: PersonalInfoData) => void;
  setFinancialInfo: (data: FinancialInfoData) => void;
  setAdditionalInfo: (data: AdditionalInfoData) => void;
  setDocuments: (data: DocumentUploadData) => void;
  isLoading: boolean;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<QuestionnaireData>({
    personalInfo: {
      firstName: user?.displayName?.split(" ")[0] || "",
      lastName: user?.displayName?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
    },
    financialInfo: {},
    additionalInfo: {},
    documents: {}
  });

  useEffect(() => {
    const loadFormData = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        };

        setIsLoading(true);
        try {
            // First, try to load from Firestore (for submitted applications)
            const docRef = doc(db, "loan_applications", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const firestoreData = docSnap.data() as QuestionnaireData;
                setFormData(firestoreData);
            } else {
                // If no Firestore data, fall back to localStorage (for in-progress applications)
                const savedData = localStorage.getItem("questionnaireFormData");
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    setFormData((prevData) => ({
                        ...prevData,
                        ...parsedData,
                        personalInfo: {
                            ...prevData.personalInfo,
                            ...parsedData.personalInfo,
                            firstName: user.displayName?.split(" ")[0] || parsedData.personalInfo?.firstName,
                            lastName: user.displayName?.split(" ").slice(1).join(" ") || parsedData.personalInfo?.lastName,
                            email: user.email || parsedData.personalInfo?.email,
                        }
                    }));
                }
            }
        } catch (error) {
            console.error("Failed to load questionnaire form data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadFormData();
  }, [user]);


  useEffect(() => {
    // This effect runs whenever formData changes, saving it to localStorage.
    try {
        if (!isLoading && (Object.keys(formData.personalInfo).length > 2 || Object.keys(formData.financialInfo).length > 0 || Object.keys(formData.additionalInfo).length > 0)) {
            localStorage.setItem("questionnaireFormData", JSON.stringify(formData));
        }
    } catch (error) {
        console.error("Failed to save questionnaire form data to localStorage", error);
    }
  }, [formData, isLoading]);


  const updateFormData = (data: Partial<QuestionnaireData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const setPersonalInfo = (data: PersonalInfoData) => {
    setFormData(prev => ({ ...prev, personalInfo: data }));
  };

  const setFinancialInfo = (data: FinancialInfoData) => {
    setFormData(prev => ({ ...prev, financialInfo: data }));
  };

  const setAdditionalInfo = (data: AdditionalInfoData) => {
    setFormData(prev => ({ ...prev, additionalInfo: data }));
  };

  const setDocuments = (data: DocumentUploadData) => {
    setFormData(prev => ({ ...prev, documents: data }));
  };

  return (
    <QuestionnaireContext.Provider value={{ formData, updateFormData, setPersonalInfo, setFinancialInfo, setAdditionalInfo, setDocuments, isLoading }}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }
  return context;
};
