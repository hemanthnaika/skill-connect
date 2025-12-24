import {
  Palette,
  Music,
  Laptop,
  Languages,
  BriefcaseBusiness,
  HeartPulse,
  Utensils,
  BookOpenCheck,
  Sparkles,
  PenLine,
  User,
  FileUp,
  Banknote,
} from "lucide-react";

export const navBar = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Workshops",
    link: "/workshops",
  },

  {
    name: "About Us",
    link: "/about",
  },
  {
    name: "Contact",
    link: "/contact",
  },
];

export const Categories = [
  { name: "Art & Creativity", icon: Palette },
  { name: "Music & Performance", icon: Music },
  { name: "Technology & Coding", icon: Laptop },
  { name: "Languages", icon: Languages },
  { name: "Business & Money", icon: BriefcaseBusiness },
  { name: "Health & Fitness", icon: HeartPulse },
  { name: "Cooking & Lifestyle", icon: Utensils },
  { name: "Professional Skills", icon: BookOpenCheck },
  { name: "Personal Development", icon: Sparkles },
  { name: "Writing & Communication", icon: PenLine },
];

export const testimonials = [
  {
    quote:
      "SkillConnect helped me run my first paid workshop — the booking, payments and live video all just worked. I filled my class in two days!",
    name: "Anita Rao",
    role: "Guitar Instructor",
  },
  {
    quote:
      "I attended a 6-week web dev bootcamp and the live sessions plus resources made learning practical and fast. I built my portfolio in weeks.",
    name: "Devansh Patel",
    role: "Frontend Developer",
  },
  {
    quote:
      "As a busy mom, I loved the flexibility — I joined short live classes and downloaded lesson notes to practice later. Real community support too.",
    name: "Meera Sharma",
    role: "Content Creator",
  },
  {
    quote:
      "Hosting in-person sketching meetups in my city has never been easier. The platform handles RSVPs and student communication so I can focus on teaching.",
    name: "Karan Singh",
    role: "Artist & Workshop Host",
  },
  {
    quote:
      "The instructor ratings and reviews helped me pick the right teacher. The live class felt interactive — I could ask questions and get immediate feedback.",
    name: "Priya Menon",
    role: "UX Designer",
  },
  {
    quote:
      "I monetized my baking skills by creating a weekend class. Payments and attendee lists are simple to manage — great for small business owners.",
    name: "Rohit Kumar",
    role: "Home Baker",
  },
  {
    quote:
      "The Jitsi-powered live rooms worked flawlessly on mobile and desktop. No installs, just join and learn — excellent for remote students.",
    name: "Sara Ali",
    role: "Music Producer",
  },
  {
    quote:
      "I found a local yoga teacher and joined their offline class — the map and booking features made it easy to discover nearby workshops.",
    name: "Nikhil Verma",
    role: "Fitness Enthusiast",
  },
  {
    quote:
      "I switched from one-off tutorials to hosting regular sessions. The recurring workshop tools and student management saved me hours every week.",
    name: "Lakshmi Iyer",
    role: "Photography Coach",
  },
  {
    quote:
      "SkillConnect’s community is amazing — helpful peers, shared resources, and honest reviews. I learned practical skills and found collaborators.",
    name: "Arjun Desai",
    role: "Product Manager",
  },
];

export const formStep = [
  {
    icon: User,
    title: "Personal Details",
    description: "Enter your basic personal information",
  },

  {
    icon: FileUp,
    title: "Document Verification",
    description: "Upload ID, selfie & skill details",
  },
  {
    icon: Banknote,
    title: "Bank Details",
    description: "Enter your bank details to receive payments",
  },
];

export type FieldName =
  | "phone"
  | "socialLink"
  | "document"
  | "selfie"
  | "skills"
  | "experience"
  | "upiId";

interface FieldItem {
  name: FieldName;
  placeholder: string;
  type: "text" | "number" | "file" | "checkbox" | "textarea";
  accept?: string;
  options?: { label: string; value: string }[];
}

export const FormStepData: { step: number; fields: FieldItem[] }[] = [
  {
    step: 0,
    fields: [
      { name: "phone", placeholder: "Phone Number", type: "number" },
      { name: "socialLink", placeholder: "Social Links", type: "text" },
      {
        name: "experience",
        placeholder: "Explain your experience…",
        type: "text",
      },
      {
        name: "skills",
        placeholder: "Select Skill ",
        type: "checkbox",
        options: [
          { label: "Art", value: "art" },
          { label: "Technology", value: "tech" },
          { label: "Music", value: "music" },
          { label: "Dance", value: "dance" },
          { label: "Career", value: "career" },
        ],
      },
    ],
  },
  {
    step: 1,
    fields: [
      {
        name: "document",
        placeholder: "Upload Aadhar/PAN",
        type: "file",
        accept: "image/*",
      },
      {
        name: "selfie",
        placeholder: "Upload a selfie",
        type: "file",
        accept: "image/*",
      },
    ],
  },
  {
    step: 2,
    fields: [
      {
        name: "upiId",
        placeholder: "UPI ID (example: yourname@upi)",
        type: "text",
      },
    ],
  },
];
