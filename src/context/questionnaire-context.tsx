
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type PersonalInfoData = {
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

type FinancialInfoData = {
  businessType?: string;
  businessDuration?: string;
  stockValue?: string;
  monthlyUpiTransactions?: string;
  monthlyCashIncome?: string;
  monthlyExpenses?: string;
  existingLoan?: "yes" | "no";
};

type AdditionalInfoData = {
  hasCibilScore?: "yes" | "no";
  cibilScore?: string;
  ownHouse?: "yes" | "no";
  ownBusiness?: "yes" | "no";
  govtBenefits?: "yes" | "no";
  benefitType?: string;
};

type DocumentUploadData = {
  aadhar?: string;
  pan?: string;
  shop?: string;
}

type QuestionnaireData = {
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
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ children, user }: { children: ReactNode, user: { email: string | null; displayName: string | null; } }) => {
  const [formData, setFormData] = useState<QuestionnaireData>({
    personalInfo: {
      firstName: user.displayName?.split(" ")[0] || "",
      lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
      email: user.email || "",
    },
    financialInfo: {},
    additionalInfo: {},
    documents: {}
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("questionnaireFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Ensure email and name are from the authenticated user, but keep other saved data
        setFormData({
            ...formData,
            ...parsedData,
            personalInfo: {
                ...formData.personalInfo,
                ...parsedData.personalInfo,
                firstName: user.displayName?.split(" ")[0] || parsedData.personalInfo.firstName,
                lastName: user.displayName?.split(" ").slice(1).join(" ") || parsedData.personalInfo.lastName,
                email: user.email || parsedData.personalInfo.email,
            }
        });
      }
    } catch (error) {
        console.error("Failed to parse questionnaire form data from localStorage", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.email, user.displayName]);

  useEffect(() => {
    try {
        localStorage.setItem("questionnaireFormData", JSON.stringify(formData));
    } catch (error) {
        console.error("Failed to save questionnaire form data to localStorage", error);
    }
  }, [formData]);

  const updateFormData = (data: Partial<QuestionnaireData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const setPersonalInfo = (data: PersonalInfoData) => {
    updateFormData({ personalInfo: data });
  };

  const setFinancialInfo = (data: FinancialInfoData) => {
    updateFormData({ financialInfo: data });
  };

  const setAdditionalInfo = (data: AdditionalInfoData) => {
    updateFormData({ additionalInfo: data });
  };

  const setDocuments = (data: DocumentUploadData) => {
    updateFormData({ documents: data });
  };

  return (
    <QuestionnaireContext.Provider value={{ formData, updateFormData, setPersonalInfo, setFinancialInfo, setAdditionalInfo, setDocuments }}>
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
