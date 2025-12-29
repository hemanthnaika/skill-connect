import { formStep } from "@/constants";
import {
  BankInfo,
  GovInfo,
  PersonalInfo,
  StepFormData,
} from "@/types/fromType";
import { useState } from "react";
import { useApi } from "./useApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const stepSchema = [PersonalInfo, GovInfo, BankInfo];
type KYCResponse = {
  message: string;
};
export function useMultiStepForm() {
  const router = useRouter();
  const { request, loading, error } = useApi<KYCResponse>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<StepFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === formStep.length - 1;

  const getCurrentStepSchema = () => stepSchema[currentStep];
  const goToNextStep = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
  };
  const goToPreviousStep = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  const updateFormData = (newData: Partial<StepFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const submitForm = async (
    data: StepFormData & { document?: File; selfie?: File }
  ) => {

    setIsSubmitted(true);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Handle files and array (skills)
          if (key === "document" || key === "selfie") {
            formData.append(key, value as File);
          } else if (key === "skills") {
            formData.append(key, JSON.stringify(value)); // convert array to JSON
          } else {
            formData.append(key, value as string);
          }
        }
      });

      const res = await fetch("/api/kyc", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Submission failed");
        return;
      }

      toast.success(result.message);
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setFormData({});
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  return {
    currentStep,
    formData,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    submitForm,
    isSubmitted,
    resetForm,
    getCurrentStepSchema,
  };
}
