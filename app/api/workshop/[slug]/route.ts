import { db } from "@/db/drizzle";
import { registrations, workshops } from "@/db/schema";
import { and, eq, not, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const workshopResult = await db
      .select({
        id: workshops.id,
        slug: workshops.slug,
        title: workshops.title,
        description: workshops.description,
        category: workshops.category,
        level: workshops.level,
        date: workshops.date,
        time: workshops.time,
        duration: workshops.duration,
        price: workshops.price,
        mode: workshops.mode,
        address: workshops.address,
        thumbnailUrl: workshops.thumbnailUrl,
        language: workshops.language,
  

        // ✅ paid students count
        studentsCount: sql<number>`
        COUNT(
          CASE
            WHEN ${registrations.paymentStatus} = 'paid'
            THEN 1
          END
        )
      `.as("studentsCount"),
      })
      .from(workshops)
      .leftJoin(registrations, eq(registrations.workshopId, workshops.id))
      .where(eq(workshops.slug, slug))
      .groupBy(workshops.id)
      .limit(1);

    if (workshopResult.length === 0) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      );
    }

    const workshop = workshopResult[0];
    const relatedWorkshops = await db
      .select({
        id: workshops.id,
        slug: workshops.slug,
        title: workshops.title,
        price: workshops.price,
        date: workshops.date,
        thumbnailUrl: workshops.thumbnailUrl,
        studentsCount: sql<number>`
        COUNT(
          CASE
            WHEN ${registrations.paymentStatus} = 'paid'
            THEN 1
          END
        )
      `.as("studentsCount"),
      })
      .from(workshops)
      .leftJoin(registrations, eq(registrations.workshopId, workshops.id))
      .where(
        and(
          eq(workshops.category, workshop.category),
          not(eq(workshops.id, workshop.id))
        )
      )
      .groupBy(workshops.id)
      .limit(5);
    return NextResponse.json({
      workshop,
      relatedWorkshops,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
