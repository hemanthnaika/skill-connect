import { workshops, user } from "@/db/schema";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import { DataTable } from "@/components/table";
import { columns } from "@/components/columns";

export default async function PendingApprovalWorkshops() {
  const pendingWorkshops = await db
    .select({
      workshop: workshops,
      creator: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    })
    .from(workshops)
    .leftJoin(user, eq(workshops.createdBy, user.id))
    .where(eq(workshops.status, "pending"));

  const tableData = pendingWorkshops.map((row) => ({
    ...row.workshop,
    createdByName: row.creator?.name ?? null,
    createdByEmail: row.creator?.email ?? null,
    createdByRole: row.creator?.role ?? null,
    createdByImage: row.creator?.image ?? null,
  }));

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Pending Workshop Approvals</h1>

      {/* TABLE */}
      <div className="bg-white rounded-md shadow-md px-4 dark:bg-black space-y-5">
        <DataTable
          columns={columns}
          data={tableData} // ✅ FLAT DATA
          placeholder="Search by title or creator name..."
          searchColumns={["title", "createdByName"]}
        />
      </div>
    </div>
  );
}
