"use client";

import {
  Call,
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { LayoutList, Menu, MessageCircle, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Channel as StreamChannel, StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/components/ui/tabs";

interface MeetingRoomProps {
  call: Call;
  role: "host" | "participant";
  chatClient: StreamChat;
  channel: StreamChannel;
}

type layout = "grid" | "speaker-left" | "speaker-right";

/* ---------------- Tabs Layout ---------------- */

const TabsLayout = ({
  chatClient,
  channel,
  isMobile = false,
}: {
  chatClient: StreamChat;
  channel: StreamChannel;
  isMobile?: boolean;
}) => (
  <Tabs
    defaultValue="participants"
    className={`${isMobile ? "block" : "hidden md:block"} h-full`}
  >
    <TabsList className="bg-primary w-full mb-4">
      <TabsTrigger value="participants">
        <Users />
        <span className="ml-2">Participants</span>
      </TabsTrigger>
      <TabsTrigger value="chat">
        <MessageCircle />
        <span className="ml-2">Chat</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="participants" className="h-full">
      <CallParticipantsList onClose={() => {}} />
    </TabsContent>

    <TabsContent value="chat" className="h-full">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </TabsContent>
  </Tabs>
);

/* ---------------- Main Component ---------------- */

const MeetingRoom = ({ call, role, chatClient, channel }: MeetingRoomProps) => {
  const router = useRouter();
  const [layout, setLayout] = useState<
    "grid" | "speaker-left" | "speaker-right"
  >("grid");

  // 🔒 Prevent double leave / redirect
  const hasExitedRef = useRef(false);

  /* -------- Global call-ended listener -------- */

  useEffect(() => {
    if (!call) return;

    const handleCallEnded = () => {
      if (hasExitedRef.current) return;
      hasExitedRef.current = true;

      toast("Meeting ended by host");
      setTimeout(() => router.replace("/profile"), 800);
    };

    call.on("call.ended", handleCallEnded);

    return () => {
      call.off("call.ended", handleCallEnded);
    };
  }, [call, router]);

  /* -------- Handlers -------- */

  const safeExit = async (action?: () => Promise<void>) => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    try {
      await action?.();
    } catch {
      // ignore – call already ended
    }

    router.replace("/profile");
  };

  const handleLeave = () =>
    safeExit(async () => {
      await call.leave();
    });

  const handleEndCall = () =>
    safeExit(async () => {
      await call.endCall(); // 🔥 ends for everyone
    });

  /* -------- Layout -------- */

  const renderCallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="right" />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="bg-[#1D2938] h-screen     text-white px-4 md:px-10 pt-10">
      <div className="flex h-full gap-6">
        {/* Video */}
        <div className="flex-1 relative">
          {renderCallLayout()}

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 flex-wrap md:flex-nowrap justify-center items-center">
            <CallControls onLeave={handleLeave} />
            <CallStatsButton />

            {role === "host" && (
              <Button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700"
              >
                End meeting
              </Button>
            )}

            {/* Layout Switch */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden md:block">
                <LayoutList className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuLabel>Layout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={layout}
                  onValueChange={(v) => setLayout(v as layout)}
                >
                  <DropdownMenuRadioItem value="grid">
                    Grid
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="speaker-left">
                    Speaker Left
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="speaker-right">
                    Speaker Right
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Drawer */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                  <Menu />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#1D2938] text-white p-4">
                <DrawerTitle>Meeting</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" className="ml-auto">
                    <X />
                  </Button>
                </DrawerClose>
                <TabsLayout
                  chatClient={chatClient}
                  channel={channel}
                  isMobile
                />
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Desktop Side Panel */}
        <div className="hidden md:block w-[380px]">
          <TabsLayout chatClient={chatClient} channel={channel} />
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
