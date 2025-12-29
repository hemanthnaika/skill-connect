import { db } from "@/db/drizzle";
import { registrations, user, workshops } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { and, eq, not, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

interface CloudinaryUploadResult {
  secure_url: string;
}

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
        rating:workshops.rating,

        // 👤 creator info
        creator: {
          name: user.name,
          email: user.email,
          image: user.image,
        },

        // 👥 paid students count
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
      .leftJoin(user, eq(user.id, workshops.createdBy))
      .leftJoin(registrations, eq(registrations.workshopId, workshops.id))
      .where(eq(workshops.slug, slug))
      .groupBy(workshops.id, user.id)
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

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const form = await req.formData();

    // Prepare object for update
    const updateData: Partial<{
      title: string;
      language: string;
      description: string;
      category: string;
      level: string;
      date: string;
      time: string;
      duration: string;
      price: number;
      mode: "online" | "offline" | "both";
      address: string | null;
      thumbnailUrl: string;
    }> = {};

    // Optional fields from form
    const fields: (keyof typeof updateData)[] = [
      "title",
      "language",
      "description",
      "category",
      "level",
      "date",
      "time",
      "duration",
      "price",
      "mode",
      "address",
    ];
    fields.forEach((key) => {
      const value = form.get(key);
      if (value === null) return;

      if (key === "mode") {
        const modeValue = value.toString() as "online" | "offline" | "both";
        if (["online", "offline", "both"].includes(modeValue)) {
          updateData.mode = modeValue;
        }
      } else if (key === "price") {
        const num = Number(value);
        if (!isNaN(num)) {
          updateData.price = num;
        }
      } else if (key === "address") {
        updateData.address = value.toString() || null;
      } else {
        updateData[key] = value.toString();
      }
    });

    // Handle thumbnail upload if provided
    const file = form.get("thumbnail") as File | null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload: CloudinaryUploadResult = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "skillConnect/workshops" },
              (err, result) => {
                if (err || !result) return reject(err);
                resolve({ secure_url: result.secure_url });
              }
            )
            .end(buffer);
        }
      );

      updateData.thumbnailUrl = upload.secure_url;
    }

    // Update DB
    const updated = await db
      .update(workshops)
      .set(updateData)
      .where(eq(workshops.slug, slug));

    if (!updated) {
      return NextResponse.json(
        { error: "Workshop not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Workshop updated successfully",
      slug,
    });
  } catch (err) {
    console.error("Workshop update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
