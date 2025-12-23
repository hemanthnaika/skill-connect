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
