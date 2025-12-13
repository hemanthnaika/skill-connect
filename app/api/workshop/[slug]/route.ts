import { db } from "@/db/drizzle";
import { workshops } from "@/db/schema";
import { eq, and, not } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  // 1️⃣ Fetch the requested workshop
  const workshopResult = await db
    .select()
    .from(workshops)
    .where(eq(workshops.slug, slug))
    .limit(1);

  if (workshopResult.length === 0) {
    return NextResponse.json(
      { message: "Workshop not found" },
      { status: 404 }
    );
  }

  const workshop = workshopResult[0];

  // 2️⃣ Fetch related workshops (same category, excluding current workshop)
  // Make sure your schema has `category` field
  const relatedWorkshops = await db
    .select()
    .from(workshops)
    .where(
      and(
        eq(workshops.category, workshop.category),
        not(eq(workshops.id, workshop.id))
      )
    )
    .limit(5); // limit for performance

  // 3️⃣ Return combined response
  return NextResponse.json({
    workshop,
    relatedWorkshops,
  });
}
