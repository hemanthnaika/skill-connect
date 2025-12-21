import { db } from "@/db/drizzle";
import { workshops } from "@/db/schema";
import { auth } from "@/lib/auth";
import { StreamClient } from "@stream-io/node-sdk";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { id: workshopId } = await context.params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ Workshop check
    const workshop = await db.query.workshops.findFirst({
      where: eq(workshops.id, workshopId),
    });

    if (!workshop) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2️⃣ Author check
    if (workshop.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4️⃣ Create Stream meeting
    const meetingId = crypto.randomUUID();

    const serverClient = new StreamClient(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!
    );

    await serverClient.video.call("default", meetingId).getOrCreate({
      data: {
        created_by_id: session.user.id,
      },
    });

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meetings/${workshopId}/${meetingId}`;

    return NextResponse.json(
      { message: "Meeting created successfully", meetingLink },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const err = error instanceof Error ? error : new Error("Unknown error");
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
