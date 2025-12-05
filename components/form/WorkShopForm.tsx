"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";

import { Button } from "../ui/button";
import z from "zod";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const workshopSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Select a category"),
  level: z.string().min(1, "Select a difficulty level"),
  date: z.string().min(1, "Select date"),
  time: z.string().min(1, "Select time"),
  duration: z.string().min(1, "Enter duration"),
  price: z.string().min(1, "Enter price"),
  thumbnail: z
    .instanceof(File, { message: "Upload a valid image" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max size is 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp allowed"
    ),
});

type WorkShopType = z.infer<typeof workshopSchema>;

interface FiledInputProps {
  title: string;
  type?: string;
  placeholder: string;
  name: keyof WorkShopType;
  register: UseFormRegister<WorkShopType>;
  error?: string;
}

const FiledInput = ({
  title,
  type = "text",
  placeholder,
  name,
  register,
  error,
}: FiledInputProps) => (
  <div className="space-y-2 w-full">
    <Label className="font-semibold text-sm tracking-wider">{title}</Label>
    <Input placeholder={placeholder} type={type} {...register(name)} />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

interface OptionType {
  label: string;
  value: string;
}
interface FiledSelectProps {
  title: string;
  placeholder: string;
  name: keyof WorkShopType;
  options: OptionType[];
  onChange: (value: string) => void;
  error?: string;
}

const FiledSelect = ({
  title,
  placeholder,

  options,
  onChange,
  error,
}: FiledSelectProps) => (
  <div className="space-y-2 w-full">
    <Label>{title}</Label>
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem value={o.value} key={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const WorkShopForm = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkShopType>({
    resolver: zodResolver(workshopSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: WorkShopType) => {
    console.log("WORKSHOP DATA:", data);
    alert("Workshop created successfully!");
  };

  return (
    <div className="shadow-md bg-white px-10 py-7 space-y-5 rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* TITLE */}
        <FiledInput
          title="Workshop Title"
          placeholder="Ex: Beginner Guitar Class"
          name="title"
          register={register}
          error={errors.title?.message}
        />

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Describe what students will learn"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-6 gap-5">
          {/* CATEGORY */}
          <FiledSelect
            title="Category"
            placeholder="Choose category"
            name="category"
            options={[
              { label: "Art & Creativity", value: "art" },
              { label: "Music", value: "music" },
              { label: "Technology", value: "tech" },
              { label: "Dance & Fitness", value: "dance" },
              { label: "Career Development", value: "career" },
            ]}
            onChange={(v) => setValue("category", v, { shouldValidate: true })}
            error={errors.category?.message}
          />

          {/* LEVEL */}
          <FiledSelect
            title="Difficulty Level"
            placeholder="Select level"
            name="level"
            options={[
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ]}
            onChange={(v) => setValue("level", v, { shouldValidate: true })}
            error={errors.level?.message}
          />

          {/* DATE */}
          <FiledInput
            title="Date"
            type="date"
            placeholder=""
            name="date"
            register={register}
            error={errors.date?.message}
          />

          {/* TIME */}
          <FiledInput
            title="Time"
            type="time"
            placeholder=""
            name="time"
            register={register}
            error={errors.time?.message}
          />

          {/* DURATION */}
          <FiledInput
            title="Duration (hours)"
            type="number"
            placeholder="Ex: 2"
            name="duration"
            register={register}
            error={errors.duration?.message}
          />

          {/* PRICE */}
          <FiledInput
            title="Price (₹)"
            type="number"
            placeholder="Price"
            name="price"
            register={register}
            error={errors.price?.message}
          />
        </div>

        <div className="space-y-2 w-1/2">
          <Label>Workshop Thumbnail</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setValue("thumbnail", file, { shouldValidate: true });
                // preview
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {errors.thumbnail && (
            <p className="text-red-500 text-xs">{errors.thumbnail.message}</p>
          )}
        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="space-y-2">
            <Label>Thumbnail Preview</Label>
            <Image
              src={preview}
              alt="Workshop Thumbnail"
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-center">
          <Button className="bg-primary text-white">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default WorkShopForm;
