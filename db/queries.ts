import { eq } from "drizzle-orm";
import { db } from "./drizzle";
import { registrations, workshops } from "./schema";

export async function getUserConductWorkshops(userId: string) {
  return db
    .select({
      id: workshops.id,
      slug: workshops.slug,
      workshopId: workshops.id,
      title: workshops.title,
      category: workshops.category,
      level: workshops.level,
      mode: workshops.mode,
      status: workshops.status,
      price: workshops.price,
      rejectionReason: workshops.rejectionReason,
      createdAt: workshops.createdAt,
      thumbnailUrl: workshops.thumbnailUrl,
    })
    .from(workshops)
    .where(eq(workshops.createdBy, userId));
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
