"use client";

import { useMultiStepForm } from "@/hooks/use-multi-step-from";

import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { StepFormData } from "@/types/fromType";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";

import { formStep, FormStepData } from "@/constants";
import { DynamicFormField } from "./DynamicFormField";
import { cn } from "@/lib/utils";
import { Form } from "../ui/form";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const StepInfo = ({
  title,
  info,
  icon,
  last = false,
  currentStep,
  i,
}: {
  title: string;
  info: string;
  icon: React.ElementType;
  last?: boolean;
  currentStep?: number;
  i: number;
}) => {
  const Icon = icon;
  return (
    <div className="flex  items-center gap-3">
      <div
        className={cn(
          " rounded-full p-2 bg-gray-200",
          currentStep! >= i && "bg-black text-white"
        )}
      >
        <Icon className="w-5 h-5 " />
      </div>
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-sm">{info}</p>
      </div>
      {!last && <ChevronRight className="w-5 h-5 " />}
    </div>
  );
};

const InstructorRegisterForm = () => {
  const params = useSearchParams();

  const {
    currentStep,
    goToPreviousStep,
    goToNextStep,
    getCurrentStepSchema,
    formData,
    updateFormData,
    submitForm,
    isSubmitted,
    isLastStep,
  } = useMultiStepForm();
  const form = useForm<StepFormData>({
    resolver: zodResolver(getCurrentStepSchema()),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: formData,
  });
  React.useEffect(() => {
    form.reset(formData);
  }, [currentStep, formData, form]);

  const onNext = async (data: StepFormData) => {
    const isValid = await form.trigger();
    if (!isValid) return; // Stop if validation fails

    // Merge current step data with all previous data

    const updatedData = { ...formData, ...data };
    updateFormData(updatedData);

    if (isLastStep) {
      // Last step - time to submit!
      try {
        submitForm(updatedData);
      } catch (error) {
        console.error("Submission failed:", error);
      }
    } else {
      // Not last step - just move forward
      goToNextStep();
    }
  };
  useEffect(() => {
    if (params.get("reason") === "required") {
      toast.error("Please complete your KYC to create a workshop!");
    }
  }, []);
  return (
    <section className="flex flex-col gap-5 ">
      <div className="flex items-center gap-5 flex-wrap md:flex-nowrap">
        {formStep.map((step, i) => (
          <StepInfo
            i={i}
            key={i}
            title={step.title}
            info={step.description}
            icon={step.icon}
            last={i === formStep.length - 1}
            currentStep={currentStep}
          />
        ))}
      </div>
      <div>
        <Form {...form}>
          <form className="grid  md:grid-cols-2 gap-4 mt-5">
            {FormStepData[currentStep].fields.map((field) => (
              <DynamicFormField key={field.name} form={form} item={field} />
            ))}
          </form>
        </Form>
      </div>
      <div className="flex items-center justify-between align-bottom">
        <Button
          className="bg-primary text-white"
          onClick={goToPreviousStep}
          disabled={isSubmitted}
        >
          Prev
        </Button>
        <Button
          disabled={isSubmitted}
          className="bg-primary text-white"
          onClick={form.handleSubmit(onNext)}
        >
          {isLastStep ? "Submit" : "Next"}
        </Button>
      </div>
    </section>
  );
};

export default InstructorRegisterForm;
