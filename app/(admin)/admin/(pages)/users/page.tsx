import UsersTable from "@/components/Admin/UsersTable";
import { userColumns } from "@/components/columns";
import { DataTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db/drizzle";
import { user, workshops, registrations, KYCVerification } from "@/db/schema";
import { requireAdmin } from "@/lib/rbac";
import { eq, sql } from "drizzle-orm";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      image: user.image,

      // 🔢 conducted workshops
      conductedCount: sql<number>`
        COUNT(DISTINCT ${workshops.id})
      `.as("conductedCount"),

      // 🔢 registered workshops
      registeredCount: sql<number>`
        COUNT(DISTINCT ${registrations.id})
      `.as("registeredCount"),

      // 🪪 KYC status
      kycStatus: KYCVerification.status,
    })
    .from(user)
    .leftJoin(workshops, eq(workshops.createdBy, user.id))
    .leftJoin(registrations, eq(registrations.userId, user.id))
    .leftJoin(KYCVerification, eq(KYCVerification.userId, user.id))
    .groupBy(
      user.id,
      user.name,
      user.email,
      user.role,
      user.createdAt,
      KYCVerification.status
    )
    .orderBy(sql`${user.createdAt} DESC`);
  console.log(users);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold mb-1">Users Overview</h1>
      <div className="bg-white shadow p-5 rounded-md">
        <DataTable
          columns={userColumns}
          data={users}
          placeholder="Search by name,role or email...."
          searchColumns={["email", "name", "role"]}
        />
      </div>
    </div>
  );
}
