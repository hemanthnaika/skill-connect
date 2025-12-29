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
  address: string | null;
  language: string;
  studentsCount: number;
  thumbnailUrl: string;
  studentsCount: number;
  rating: number;
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
  role: "user" | "admin";
  createdAt: Date;
  image: string | null;
  conductedCount: number;
  registeredCount: number;
  kycStatus: "pending" | "approved" | "rejected" | null;
}

interface KYCUpdateResponse {
  message: string;
}

interface PendingWorkshop {
  workshop: {
    id: string;
    slug: string;
    title: string;
    description: string;
    createdBy: string;
    category: string;
    language: string;
    level: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    mode: "online" | "offline" | "both";
    address: string | null;
    thumbnailUrl: string;
    status: "pending" | "approved" | "rejected";
    rejectionReason: string | null;
    createdAt: Date;
  };
  creator: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    image: string;
  } | null;
}

interface AdminWorkshop extends Workshop {
  createdBy: string;
  thumbnailUrl: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: Date;
}

interface AdminAllWorkshopResponse {
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
  address: string | null;
  language: string;
  studentsCount: number;
  thumbnailUrl: string;
  studentsCount: number;
  status: "pending" | "approved" | "rejected";
  creatorName: string;
  creatorImage: string;
  createEmail: string;
}

interface RegisterUserResponse {
  registrationId: string;
  paymentStatus: string;
  amountPaid: number;
  registeredAt: Date;
  user: RegistrationUser;
  workshop: Workshop;
}

interface RegistrationUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "user" | "admin";
}

interface Workshop {
  id: string;
  title: string;
  slug: string;
  category: string;
  language: string;
  level: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  mode: string;
  thumbnailUrl: string;
  status: string;
}

interface DashboardData {
  stats: Stats;
  revenueData: RevenueDatum[];
  upcomingWorkshops: UpcomingWorkshop[];
  recentUsers: RecentUser[];
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface UpcomingWorkshop {
  id: string;
  title: string;
  date: string;
  time: string;
  price: number;
  mode: string;
}

interface RevenueDatum {
  month: string;
  revenue: number;
}

interface Stats {
  totalUsers: number;
  totalWorkshops: number;
  pendingKyc: number;
  totalRevenue: number;
}