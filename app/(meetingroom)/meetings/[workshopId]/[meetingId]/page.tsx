"use client";
import StreamVideoProvider from "@/components/stream-video-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createAuthClient } from "better-auth/react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
const { useSession } = createAuthClient();

export default function WorkshopMeeting() {
  const params = useParams<{
    workshopId: string;
    meetingId: string;
  }>();

  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = useSession();

  if (error) {
    return (
      <div className="h-screen bg-[#32455c] flex items-center justify-center">
        <Card className="bg-[#1D2938] shadow-md text-white w-md h-32 border-0">
          <CardHeader>
            <CardTitle className="bg-red-500 text-md py-2 px-5 text-center rounded-md">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="h-screen bg-[#1D2938] flex items-center justify-center">
        <LoaderCircle className="animate-spin w-20 h-20 text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="h-screen  bg-[#32455c] flex items-center justify-center">
        <Card className="bg-[#1D2938] shadow-md text-white w-sm h-32 border-0">
          <CardHeader>
            <CardTitle className="text-center">Please Login</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <Link
              href="/signIn"
              className="bg-primary w-full  block text-center py-2 rounded-md"
            >
              Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <StreamVideoProvider
      user={session.user}
      workshopId={params.workshopId}
      meetingId={params.meetingId}
    />
  );
}
