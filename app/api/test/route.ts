import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { registrations, user, workshops } from "@/db/schema";

export async function GET() {
  try {
    const data = await db
      .select({
        registrationId: registrations.id,
        paymentStatus: registrations.paymentStatus,
        amountPaid: registrations.amountPaid,
        registeredAt: registrations.createdAt,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        },

        workshop: {
          id: workshops.id,
          title: workshops.title,
          slug: workshops.slug,
          category: workshops.category,
          language: workshops.language,
          level: workshops.level,
          date: workshops.date,
          time: workshops.time,
          duration: workshops.duration,
          price: workshops.price,
          mode: workshops.mode,
          thumbnailUrl: workshops.thumbnailUrl,
          status: workshops.status,
        },
      })
      .from(registrations)
      .innerJoin(user, eq(registrations.userId, user.id))
      .innerJoin(workshops, eq(registrations.workshopId, workshops.id));

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("GET REGISTRATIONS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
