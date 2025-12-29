import { dashboardFetch } from "@/actions/dashboardFetch";
import CardSection from "@/components/Admin/card-section";
import ChartArea from "@/components/Admin/chart";
import UpcomingWorkshop from "@/components/Admin/upcoming-workshop";
import RecentUser from "@/components/Admin/user-table";
import { requireAdmin } from "@/lib/rbac";

import { Banknote, Book, Users, Verified } from "lucide-react";

const Dashboard = async () => {
  await requireAdmin();
  const {
    totalUsers,
    totalWorkshops,
    pendingKyc,
    totalRevenue,
    revenueData,
    upcomingWorkshops,
    recentUsers,
  } = await dashboardFetch();
  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5">
        <CardSection
          title="Total Users"
          total={totalUsers}
          icon={Users}
          link="/admin/users"
        />
        <CardSection
          title="Total Workshops"
          total={totalWorkshops}
          icon={Book}
          link="/admin/allWorkshops"
        />
        <CardSection
          title="Pending KYC"
          total={pendingKyc}
          icon={Verified}
          link="/admin/kycVerification"
        />
        <CardSection
          title="Revenue"
          total={totalRevenue}
          icon={Banknote}
          link="/admin/registrations"
        />
      </div>
      <ChartArea data={revenueData} />
      <div className="grid grid-cols-2 gap-5">
        <UpcomingWorkshop data={upcomingWorkshops} />
        <RecentUser data={recentUsers} />
      </div>
    </section>
  );
};

export default Dashboard;
