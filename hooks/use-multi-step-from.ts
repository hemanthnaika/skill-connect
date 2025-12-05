import { formStep } from "@/constants";
import {
  BankInfo,
  GovInfo,
  PersonalInfo,
  StepFormData,
} from "@/types/fromType";
import { useState } from "react";

const stepSchema = [PersonalInfo, GovInfo, BankInfo];
export function useMultiStepForm() {
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

  const submitForm = (data: StepFormData) => {
    console.log("Final Data", data);
    setIsSubmitted(true);
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
