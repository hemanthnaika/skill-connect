import { db } from "@/db/drizzle";
import { KYCVerification } from "@/db/schema";
import { requireAdmin } from "@/lib/rbac";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const kyc = await db.query.KYCVerification.findFirst({
      where: eq(KYCVerification.id, params.id),
      with: { user: true },
    });

    if (!kyc) {
      return Response.json({ error: "KYC not found" }, { status: 404 });
    }

    return Response.json(kyc);
  } catch (error) {
    console.log(error);
    const err = error instanceof Error ? error : new Error("Unknown error");
    return Response.json({ err: err.message }, { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Ensure only admin can update KYC
    const admin = await requireAdmin();

    // ✅ Read payload from frontend
    const body = await req.json();
    const { status, rejectionReason } = body;

    // ✅ Validate status
    if (!["approved", "rejected"].includes(status)) {
      return Response.json({ error: "Invalid KYC status" }, { status: 400 });
    }

    // ✅ If rejected, rejection reason is required
    if (status === "rejected" && !rejectionReason) {
      return Response.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // ✅ Update KYC
    await db
      .update(KYCVerification)
      .set({
        status,
        reviewedAt: new Date(),
        reviewedBy: admin.id,
        rejectionReason: status === "rejected" ? rejectionReason : null,
      })
      .where(eq(KYCVerification.id, params.id));

    return Response.json({
      message: `KYC ${status} successfully`,
    });
  } catch (error) {
    console.error("KYC update failed:", error);

    const err = error instanceof Error ? error : new Error("Unknown error");

    return Response.json({ error: err.message }, { status: 500 });
  }
}
