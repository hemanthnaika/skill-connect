"use server";

import { db } from "@/db/drizzle";
import { workshops } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateWorkshopStatus({
  id,
  status,
  rejectionReason,
}: {
  id: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}) {
  if (status === "rejected" && !rejectionReason) {
    throw new Error("Rejection reason is required");
  }

  await db
    .update(workshops)
    .set({
      status,
      rejectionReason: status === "rejected" ? rejectionReason : null,
    })
    .where(eq(workshops.id, id));
}
