// import { StreamClient } from "@stream-io/node-sdk";

import { db } from "@/db/drizzle";
import { registrations, workshops } from "@/db/schema";
import { auth } from "@/lib/auth";
import { StreamClient } from "@stream-io/node-sdk";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


import { StreamChat } from "stream-chat";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workshopId, meetingId } = await req.json();

    // 2️⃣ Get workshop
    const workshop = await db.query.workshops.findFirst({
      where: eq(workshops.id, workshopId),
    });

    if (!workshop) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Check role
    const isHost = workshop.createdBy === session.user.id;

    if (!isHost) {
      const registered = await db.query.registrations.findFirst({
        where: and(
          eq(registrations.workshopId, workshop.id),
          eq(registrations.userId, session.user.id)
        ),
      });

      if (!registered) {
        return NextResponse.json(
          { error: "Not registered for this workshop" },
          { status: 403 }
        );
      }
    }

    // 4️⃣ Generate Stream token
    const serverClient = new StreamClient(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!
    );

    try {
      await serverClient.video.call("default", meetingId).get();
    } catch (error: unknown) {
      // Narrow error type
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status: number }).status === 404
      ) {
        return NextResponse.json(
          { error: "Meeting does not exist" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Meeting does not exist" },
        { status: 404 }
      );
    }
    await serverClient.upsertUsers([
      {
        id: session.user.id,
        name: session.user.name ?? session.user.id,
        role: isHost ? "admin" : "user",
      },
    ]);

    const now = Math.floor(Date.now() / 1000);
    const token = serverClient.generateUserToken({
      user_id: session.user.id,
      iat: now - 30,
      exp: now + 24 * 60 * 60,
    });

    const serverChatClient = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!
    );
    const chatToken = serverChatClient.createToken(session.user.id);
    const channel = serverChatClient.channel("messaging", meetingId);
    try {
      // 1️⃣ If channel exists → add user
      await channel.addMembers([session.user.id]);
    } catch (err: unknown) {
      // 2️⃣ If channel does not exist → create it WITH the user
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code: number }).code === 16
      ) {
        const createChannel = serverChatClient.channel("messaging", meetingId, {
          members: [session.user.id],
          created_by_id: session.user.id,
        });

        await createChannel.create();
      } else {
        throw err;
      }
    }
    if (!chatToken) {
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      token,
      role: isHost ? "host" : "participant",
      chatToken,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
