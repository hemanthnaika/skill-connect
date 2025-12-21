"use client";

import { useApi } from "@/hooks/useApi";
import {
  Call,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

import { useEffect, useState } from "react";

import { Channel as StreamChannel, StreamChat } from "stream-chat";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import "stream-chat-react/dist/css/v2/index.css";
import MeetingRoom from "./meeting-room";
import MeetingSetup from "./meetingSetup";
import { LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/* ---------- PROPS ---------- */

interface StreamVideoProviderProps {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  workshopId: string;
  meetingId: string;
}

interface TokenResponse {
  role: "host" | "participant";
  token: string;
  chatToken: string;
}

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

/* ---------- COMPONENT ---------- */

const StreamVideoProvider = ({
  user,
  workshopId,
  meetingId,
}: StreamVideoProviderProps) => {
  const { request, loading, error } = useApi<TokenResponse>();

  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );

  const [call, setCall] = useState<Call | null>(null);

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  const [channel, setChannel] = useState<StreamChannel | null>(null);

  const [role, setRole] = useState<"host" | "participant">("host");

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  /* ---------- INIT ---------- */

  useEffect(() => {
    let vc: StreamVideoClient | null = null;
    let activeCall: Call | null = null;
    let sc: StreamChat | null = null;

    const init = async () => {
      try {
        const res = await request({
          url: "/api/token",
          method: "POST",
          data: { workshopId, meetingId },
        });

        if (!res) return;

        const { role, token, chatToken } = res;
        setRole(role);

        /* ---------- VIDEO ---------- */

        vc = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: user.id,
            name: user.name,
            image: user.image ?? undefined, // ✅ no null
          },
          token,
        });

        activeCall = vc.call("default", meetingId);
        setVideoClient(vc);
        setCall(activeCall);

        /* ---------- CHAT ---------- */

        sc = StreamChat.getInstance(API_KEY);
        await sc.connectUser(
          {
            id: user.id,
            name: user.name,
            image: user.image ?? undefined,
          },
          chatToken
        );

        const chatChannel = sc.channel("messaging", meetingId);
        await chatChannel.watch();

        setChatClient(sc);
        setChannel(chatChannel);
      } catch (err) {
        console.error("Stream init error", err);
      }
    };

    init();

    return () => {
      activeCall?.leave();
      vc?.disconnectUser();
      sc?.disconnectUser();
    };
  }, []);

  /* ---------- STATES ---------- */
  if (error)
    return (
      <div className="h-screen bg-[#32455c] flex items-center justify-center">
        <Card className="bg-[#1D2938] shadow-md text-white w-md h-32 border-0">
          <CardHeader>
            <CardTitle className="bg-red-500 text-md py-2 px-5 text-center rounded-md">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );

  if (loading)
    return (
      <div className="h-screen bg-[#1D2938] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-5">
          <LoaderCircle className="animate-spin w-20 h-20 text-primary" />
          <h1 className="text-white">Connecting to meeting…</h1>
        </div>
      </div>
    );

  if (!videoClient || !call || !chatClient || !channel) {
    return (
      <div className="h-screen bg-[#1D2938] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-5">
          <LoaderCircle className="animate-spin w-20 h-20 text-primary" />
          <h1 className="text-white">Connecting to meeting…</h1>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="flex h-screen">
      {/* ---------------- VIDEO ---------------- */}
      <div className="flex-1">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <StreamTheme>
              {!isSetupComplete ? (
                <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
              ) : (
                <MeetingRoom
                  call={call}
                  role={role}
                  chatClient={chatClient}
                  channel={channel}
                />
              )}
            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
};

export default StreamVideoProvider;
