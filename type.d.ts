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
  thumbnailUrl: string;
  isApproved: boolean;
  createdAt: string;
}

interface WorkshopResponse {
  workshop: Workshop;
  relatedWorkshops: Workshop[];
}
