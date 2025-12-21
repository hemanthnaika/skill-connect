import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "./drizzle";
import { registrations, workshops } from "./schema";

export async function getUserConductWorkshops(userId: string) {
  return db
    .select({
      ...getTableColumns(workshops),

      studentsCount: sql<number>`
        COUNT(${registrations.id})
      `.as("studentsCount"),
    })
    .from(workshops)
    .leftJoin(registrations, eq(registrations.workshopId, workshops.id))
    .where(eq(workshops.createdBy, userId))
    .groupBy(workshops.id);
}

export async function getUserJoinedWorkshop(userId: string) {
  return db
    .select({
      id: workshops.id,
      slug: workshops.slug,
      thumbnailUrl: workshops.thumbnailUrl,
      registrationId: registrations.id,
      paymentStatus: registrations.paymentStatus,
      amountPaid: registrations.amountPaid,
      joinedAt: registrations.createdAt,
      workshopId: workshops.id,
      title: workshops.title,
      category: workshops.category,
      level: workshops.level,
      mode: workshops.mode,
      status: workshops.status,
      price: workshops.price,
    })
    .from(registrations)
    .innerJoin(workshops, eq(registrations.workshopId, workshops.id))
    .where(eq(registrations.userId, userId));
}
