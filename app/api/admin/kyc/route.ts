import { db } from "@/db/drizzle";
import { requireAdmin } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    await requireAdmin();
    const KYC = await db.query.KYCVerification.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: (kyc, { desc }) => [desc(kyc.createdAt)],
    });

    return NextResponse.json({ KYC }, { status: 200 });
  } catch (error) {
    console.log(error);
    const err = error instanceof Error ? error : new Error("Unknown error");
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
