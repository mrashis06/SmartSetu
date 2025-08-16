
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type PersonalInfoData = {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
};

type QuestionnaireData = {
  personalInfo: PersonalInfoData;
};

interface QuestionnaireContextType {
  formData: QuestionnaireData;
  updateFormData: (data: Partial<QuestionnaireData>) => void;
  setPersonalInfo: (data: PersonalInfoData) => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider = ({ children, user }: { children: ReactNode, user: { email: string | null; displayName: string | null; } }) => {
  const [formData, setFormData] = useState<QuestionnaireData>({
    personalInfo: {
      firstName: user.displayName?.split(" ")[0] || "",
      lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
      email: user.email || "",
      middleName: "",
      gender: "",
      dob: "",
      phone: "",
      altPhone: "",
      address: "",
    },
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("questionnaireFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Ensure email and name are from the authenticated user, but keep other saved data
        setFormData({
            ...parsedData,
            personalInfo: {
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

  return (
    <QuestionnaireContext.Provider value={{ formData, updateFormData, setPersonalInfo }}>
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
