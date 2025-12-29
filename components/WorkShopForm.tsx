"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

import CustomLayout from "@/components/CustomLayout";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Workshop schema
const workshopSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Select a category"),
  level: z.string().min(1, "Select a difficulty level"),
  date: z.string().min(1, "Select date"),
  time: z.string().min(1, "Select time"),
  duration: z.string().min(1, "Enter duration"),
  price: z.number().min(1, "Enter price"),
  mode: z.enum(["online", "offline", "both"], {
    message: "Select workshop mode",
  }),
  address: z.string().optional(), // will validate conditionally
  thumbnail: z
    .instanceof(File, { message: "Upload a valid image" })
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Max size is 5MB")
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp allowed"
    ),
  language: z.string().min(1, "Select a language"),
});

// refine address when offline or both
const WorkshopSchemaWithRefine = workshopSchema.superRefine((data, ctx) => {
  if ((data.mode === "offline" || data.mode === "both") && !data.address) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Address is required for offline or both mode",
      path: ["address"],
    });
  }
});

type WorkShopType = z.infer<typeof WorkshopSchemaWithRefine>;

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
  value?: string;
}

const FiledSelect = ({
  title,
  placeholder,
  options,
  onChange,
  error,
  value,
}: FiledSelectProps) => (
  <div className="space-y-2 w-full ">
    <Label>{title}</Label>
    <Select onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent className="bg-white shadow">
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const { request, loading, error } = useApi<WorkshopResponse>();
  const { data: session } = authClient.useSession();

  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<string>("online");
  const [cat, setCat] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (error && error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WorkShopType>({
    resolver: zodResolver(WorkshopSchemaWithRefine),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const fetchSlug = async () => {
      if (!slug) return;
      const res = await request({
        url: `/api/workshop/${slug}`,
        method: "GET",
      });
      if (!res) return;

      Object.entries(res.workshop).forEach(([key, value]) => {
        if (value !== undefined && key !== "thumbnailUrl") {
          setValue(key as keyof WorkShopType, value, { shouldValidate: true });
        }
      });

      const duration = parseFloat(res.workshop.duration);
      setValue("duration", duration.toString(), { shouldValidate: true });
      if (res.workshop.thumbnailUrl) {
        setPreview(res.workshop.thumbnailUrl);
      }
      if (res.workshop.mode) {
        setMode(res.workshop.mode);
        setValue("mode", res.workshop.mode, { shouldValidate: true });
      }
      if (res.workshop.category) {
        setCat(res.workshop.category);
        setValue("category", res.workshop.category, { shouldValidate: true });
      }
      if (res.workshop.level) {
        setLevel(res.workshop.level);
        setValue("level", res.workshop.level, { shouldValidate: true });
      }
      if (res.workshop.time) {
        setValue("time", res.workshop.time, { shouldValidate: true });
      }
      if (res.workshop.address === null) {
        setValue("address", "", { shouldValidate: true });
      }
      if (res.workshop.time) {
        const time = "10:00 AM";
        const extracted = time.split(" ")[0];
        setValue("time", extracted, { shouldValidate: true });
      }
    };
    fetchSlug();
  }, [slug]);

  const handleFileSelect = (file: File) => {
    setValue("thumbnail", file, { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: WorkShopType) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      // append logged-in user id
      if (data) {
        formData.append("createdBy", session?.user.id as string);
      }
      const url = slug ? `/api/workshop/${slug}` : "/api/workshops";
      const method = slug ? "PUT" : "POST";
      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Something went wrong!");
      } else {
        toast.success(result.message);
        reset();
        setPreview(null);
        setMode("");
        router.push("/profile");
      }
    } catch (error) {
      const err = error instanceof Error ? error.message : null;
      toast.error(err || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomLayout>
      <div className="pt-12 text-center">
        <h1 className="text-center font-bold  text-2xl tracking-wider">
          {slug ? "Update Workshop" : " Create New Workshop"} Workshop
        </h1>
        <p className="text-sm/loose ">
          {" "}
          {slug
            ? "Update your workshop details"
            : "Fill all details to publish your workshop on SkillConnect"}
        </p>
      </div>
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
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* GRID */}
          <div className="grid  grid-cols-3 md:grid-cols-6 gap-5">
            {/* CATEGORY */}
            <FiledSelect
              value={cat}
              title="Category"
              placeholder="Choose category"
              name="category"
              options={[
                { label: "Art & Creativity", value: "Art & Creativity" },
                { label: "Cooking & Lifestyle", value: "Cooking & Lifestyle" },
                {
                  label: "Writing & Communication",
                  value: "Writing & Communication",
                },
                { label: "Languages", value: "Languages" },
                { label: "Business & Money", value: "Business & Money" },
                {
                  label: "Personal Development",
                  value: "Personal Development",
                },
                { label: "Music & Performance", value: "Music & Performance" },
                { label: "Technology & Coding", value: "Technology & Coding" },
                { label: "Professional Skills", value: "Professional Skills" },
                { label: "Health & Fitness", value: "Health & Fitness" },
              ]}
              onChange={(v) =>
                setValue("category", v, { shouldValidate: true })
              }
              error={errors.category?.message}
            />
            <FiledInput
              title="Language"
              type="text"
              placeholder=""
              name="language"
              register={register}
              error={errors.date?.message}
            />
            {/* LEVEL */}
            <FiledSelect
              title="Difficulty Level"
              placeholder="Select level"
              name="level"
              value={level}
              options={[
                { label: "Beginner", value: "Beginner" },
                { label: "Intermediate", value: "Intermediate" },
                { label: "Advanced", value: "Advanced" },
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
              register={(name) => register(name, { valueAsNumber: true })}
              error={errors.price?.message}
            />
          </div>

          {/* ► WORKSHOP MODE */}
          <FiledSelect
            title="Workshop Mode"
            placeholder="Choose mode"
            name="mode"
            value={mode}
            options={[
              { label: "Online", value: "online" },
              { label: "Offline", value: "offline" },
              { label: "Both", value: "both" },
            ]}
            onChange={(v) => {
              setMode(v);
              setValue("mode", v as WorkShopType["mode"], {
                shouldValidate: true,
              });
            }}
            error={errors.mode?.message}
          />

          {/* ► ADDRESS (only offline / both) */}
          {(mode === "offline" || mode === "both") && (
            <div className="space-y-2">
              <Label>Offline Address</Label>
              <Textarea
                placeholder="Enter location address"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-red-500 text-xs">{errors.address.message}</p>
              )}
            </div>
          )}

          {/* IMAGE UPLOAD WITH DRAG & DROP */}
          <div
            className={`border-2 border-dashed rounded-md p-5 w-1/2 flex flex-col items-center justify-center cursor-pointer ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect(file);
            }}
          >
            <p className="text-gray-500 text-sm">
              Drag & drop your thumbnail here, or click to select
            </p>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            {preview && (
              <Image
                src={preview}
                alt="Workshop Thumbnail"
                width={200}
                height={200}
                className="mt-3 rounded-md object-cover"
              />
            )}
            {errors.thumbnail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center">
            <Button
              className="bg-primary text-white"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  Submitting...
                  <Loader className="animate-spin mr-2" />
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </CustomLayout>
  );
};

export default WorkShopForm;
