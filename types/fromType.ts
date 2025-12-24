import * as z from "zod";

export const PersonalInfo = z.object({
  phone: z
    .string()
    .min(10, "Phone number required")
    .max(10, "Invalid phone number"),
  socialLink: z
    .string()
    .regex(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Invalid URL format"
    ),
  experience: z.string().min(5, "Please explain your experience"),
  skills: z.array(z.string()).min(1, "Select at least one category"),
});

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const GovInfo = z.object({
  document: z
    .instanceof(File, { message: "Please upload a file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  selfie: z
    .instanceof(File, { message: "Please upload a file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export const BankInfo = z.object({
  upiId: z
    .string()
    .regex(
      /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
      "Invalid UPI ID format. Must be in the format 'username@bankhandle' and not contain spaces."
    ),
});

// Zod is convert the data to a type automatically
export type PersonalInfo = z.infer<typeof PersonalInfo>;
export type GovInfo = z.infer<typeof GovInfo>;
export type BankInfo = z.infer<typeof BankInfo>;

export type StepFormData = PersonalInfo | GovInfo | BankInfo;

export type AllFormFields = PersonalInfo & GovInfo & BankInfo;
