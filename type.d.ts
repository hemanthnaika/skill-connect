interface Workshops {
  workshops: Workshop[];
}

interface Workshop {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  mode: "online" | "offline" | "both";
  address?: string | null;
  language: string;
  studentsCount: number;
  thumbnailUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  rejectionReason: string | null;
  creatorName: string;
  creatorImage: string;
  createdBy?: string;
  createEmail: string;
}

interface WorkshopResponse {
  workshop: Workshop;
  relatedWorkshops: Workshop[];
}

interface ProfileResponse {
  conductedWorkshops: Workshop[];
  joinedWorkshops: JoinedWorkshop[];
}

interface JoinedWorkshop extends Workshop {
  registrationId: string;
  paymentStatus: string;
  amountPaid: number;
  joinedAt: string;
  workshopId: string;
}

interface User {
  id: string;
  role: string;
  image?: string;
  name?: string;
}

interface KYCResponse {
  KYC: KYC[];
}

interface KYC {
  id: string;
  userId: string;
  phone: string;
  socialLink: string;
  experience: string;
  skills: string;
  document: string;
  selfie: string;
  upiId: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface KYCUpdateResponse {
  message: string;
}

interface WorkshopCreator {
  id: string;
  name: string;
  email: string;
}

interface PendingWorkshop {
  workshop: Workshop;
  user: WorkshopCreator | null; // leftJoin → can be null
}
