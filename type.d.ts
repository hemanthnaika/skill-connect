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
  mode: string;
  address: null;
  language: string;
  studentsCount: number;
  thumbnailUrl: string;
  isApproved: boolean;
  createdAt: string;
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
