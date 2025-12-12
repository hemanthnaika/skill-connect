import CardSection from "@/components/Admin/card-section";
import ChartArea from "@/components/Admin/chart";
import UpcomingWorkshop from "@/components/Admin/upcoming-workshop";
import RecentUser from "@/components/Admin/user-table";

import { Banknote, Book, Users, Verified } from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  return (
    <section className="flex flex-col gap-5">
      <Link href={"/"}>Home</Link>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5">
        <CardSection title="Total Users" total={100} icon={Users} />
        <CardSection title="Total Workshops" total={100} icon={Book} />
        <CardSection title="Pending KYC" total={100} icon={Verified} />
        <CardSection title="Revenue" total={100} icon={Banknote} />
      </div>
      <ChartArea />
      <div className="grid grid-cols-2 gap-5">
        <UpcomingWorkshop />
        <RecentUser />
      </div>
    </section>
  );
};

export default Dashboard;
