import { getUserConductWorkshops, getUserJoinedWorkshop } from "@/db/queries";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const conductedWorkshops = await getUserConductWorkshops(id);

    const joinedWorkshops = await getUserJoinedWorkshop(id);

    return NextResponse.json(
      { conductedWorkshops, joinedWorkshops },
      { status: 200 }
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
