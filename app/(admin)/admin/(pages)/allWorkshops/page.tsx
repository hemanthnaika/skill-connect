import { requireAdmin } from "@/lib/rbac";

import { Badge } from "@/components/ui/badge";
import { Book } from "lucide-react";

import { DataTable } from "@/components/table";
import { allApprovedWorkshopColumns } from "@/components/columns";

const WorkShops = async () => {
  await requireAdmin();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workshops`, {
    cache: "no-store",
  });

  const data = await res.json();
  const workshops: AdminAllWorkshopResponse[] = data.workshops;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold mb-1">Approved Workshops</h1>
        <Badge className="gap-2 text-white p-2 bg-blue-600 text-sm">
          <Book className="h-4 w-4" />
          Total Workshops: {workshops.length}
        </Badge>
      </div>
      <div className="bg-white shadow-md  p-5 rounded-md">
        <DataTable
          data={workshops }
          placeholder="Search by title or creator name..."
          columns={allApprovedWorkshopColumns}
          searchColumns={["title","name"]}
        />
      </div>
    </div>
  );
};

export default WorkShops;
