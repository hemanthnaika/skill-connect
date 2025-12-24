import { db } from "@/db/drizzle";
import { registrations, workshops } from "@/db/schema";

import cloudinary from "@/lib/cloudinary";
import { eq, sql } from "drizzle-orm";

import { NextResponse } from "next/server";

// Cloudinary upload result type
interface CloudinaryUploadResult {
  secure_url: string;
}

// Generate slug from title
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Ensure slug is unique in DB
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const exists = await db.query.workshops.findFirst({
      where: eq(workshops.slug, slug),
    });

    if (!exists) return slug;

    slug = `${baseSlug}-${count++}`;
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Get thumbnail file
    const file = form.get("thumbnail") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No image file!" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload thumbnail to Cloudinary
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

    // Generate unique slug
    const title = form.get("title") as string;
    const baseSlug = createSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Prepare workshop data
    const data = {
      slug, // slug as primary key
      title,
      language: form.get("language") as string,
      description: form.get("description") as string,
      category: form.get("category") as string,
      level: form.get("level") as string,
      date: form.get("date") as string,
      time: form.get("time") as string,
      duration: form.get("duration") as string,
      price: form.get("price") as string,
      mode: form.get("mode") as "online" | "offline" | "both",
      address: (form.get("address") as string) || null,
      thumbnailUrl: upload.secure_url,
      createdBy: form.get("createdBy") as string,
    };

    // Insert into DB
    await db.insert(workshops).values(data);

    return NextResponse.json({ message: "Workshop created!", slug });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const approvedWorkshops = await db
      .select({
        id: workshops.id,
        slug: workshops.slug,
        title: workshops.title,
        category: workshops.category,
        level: workshops.level,
        date: workshops.date,
        price: workshops.price,
        thumbnailUrl: workshops.thumbnailUrl,

        // ✅ count ONLY paid students
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
      .where(eq(workshops.status, "approved"))
      .groupBy(workshops.id)
      .orderBy(workshops.date);

    return NextResponse.json({ workshops: approvedWorkshops });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch workshops" },
      { status: 500 }
    );
  }
}
