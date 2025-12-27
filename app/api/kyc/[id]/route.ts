import { db } from "@/db/drizzle";
import { KYCVerification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/rbac";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // 🔐 Optional: protect route (admin or owner)
    const authUser = await requireAuth();

    // Optional admin check
    if (authUser.role !== "admin" && authUser.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const kyc = await db.query.KYCVerification.findFirst({
      where: eq(KYCVerification.userId, id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!kyc) {
      return NextResponse.json({ message: "KYC not found" }, { status: 404 });
    }

    return NextResponse.json(kyc, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch KYC" }, { status: 500 });
  }
}
