import { registrationsColumns } from "@/components/columns";
import { DataTable } from "@/components/table";
import { db } from "@/db/drizzle";
import { registrations, user, workshops } from "@/db/schema";
import { requireAdmin } from "@/lib/rbac";
import { eq } from "drizzle-orm";

const Registrations = async () => {
  await requireAdmin();

  const registrationsInfo = await db
    .select({
      registrationId: registrations.id,
      paymentStatus: registrations.paymentStatus,
      amountPaid: registrations.amountPaid,
      registeredAt: registrations.createdAt,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },

      workshop: {
        id: workshops.id,
        title: workshops.title,
        slug: workshops.slug,
        category: workshops.category,
        language: workshops.language,
        level: workshops.level,
        date: workshops.date,
        time: workshops.time,
        duration: workshops.duration,
        price: workshops.price,
        mode: workshops.mode,
        thumbnailUrl: workshops.thumbnailUrl,
        status: workshops.status,
      },
    })
    .from(registrations)
    .innerJoin(user, eq(registrations.userId, user.id))
    .innerJoin(workshops, eq(registrations.workshopId, workshops.id));

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Registrations List</h1>

      {/* TABLE */}
      <div className="bg-white rounded-md shadow-md px-4 dark:bg-black space-y-5">
        <DataTable
          columns={registrationsColumns}
          data={registrationsInfo as RegisterUserResponse[]}
          placeholder="Search by title or user name..."
          searchColumns={["title", "name"]}
        />
      </div>
    </div>
  );
};

export default Registrations;
