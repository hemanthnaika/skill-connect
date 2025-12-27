import { db } from "@/db/drizzle";
import { KYCVerification } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserKycStatus(userId: string) {
  const kyc = await db.query.KYCVerification.findFirst({
    where: eq(KYCVerification.userId, userId),
    columns: {
      status: true,
      rejectionReason: true,
    },
  });


  return kyc ?? null; // "approved" | "pending" | "rejected" | null
}
