import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { workshops } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1️⃣ Auth check
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: workshopId } = await context.params;

    if (!workshopId) {
      return NextResponse.json(
        { error: "Workshop ID required" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch workshop
    const workshop = await db.query.workshops.findFirst({
      where: eq(workshops.id, workshopId),
    });

    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Permission check
    const isAdmin = session.user.role === "admin";
    const isOwner = workshop.createdBy === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4️⃣ Delete workshop
    await db.delete(workshops).where(eq(workshops.id, workshopId));

    return NextResponse.json(
      {
        message: isAdmin
          ? "Workshop deleted by admin"
          : "Workshop deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE workshop error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
