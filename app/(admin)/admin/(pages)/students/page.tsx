import UsersTable from "@/components/Admin/UsersTable";
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold mb-1">Users Overview</h1>
        <Button className="gap-2">
          <Users className="h-4 w-4" />
          Total Users: {users.length}
        </Button>
      </div>
      <UsersTable data={users} />
    </div>
  );
}
