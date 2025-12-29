import { requireAdmin } from "@/lib/rbac";

import { workshops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const body = await req.json();

    const { status, rejectionReason } = body;

    if (!status || !["pending", "rejected"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    await db
      .update(workshops)
      .set({
        status,
        rejectionReason: status === "rejected" ? rejectionReason : null,
      })
      .where(eq(workshops.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    const err = error instanceof Error ? error : new Error("Unknown error");
    return Response.json({ err: err.message }, { status: 500 });
  }
}
