"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type WorkshopBtnProps = {
  isCreate?: boolean;
  workshopId?: string;
};

type MeetingResponse = {
  message: string;
  meetingLink: string;
};

const WorkshopButton = ({
  isCreate = false,
  workshopId = "",
}: WorkshopBtnProps) => {
  const [meetingLink, setMeetingLink] = useState("");
  const { request, loading, error } = useApi<MeetingResponse>();

  const title = isCreate ? "Create Meeting" : "Join Meeting";
  const description = isCreate
    ? "Click Create Meeting to generate a meeting link. Copy and share it with others."
    : "Paste the meeting link you received from the host to join the meeting.";

  /* ✅ handle error safely */
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCreateMeeting = async () => {
    const res = await request({
      url: `/api/meetings/create/${workshopId}`,
      method: "POST",
    });

    if (!res) return;

    setMeetingLink(res.meetingLink);
    toast.success("Meeting created successfully");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      toast.success("Meeting link copied to clipboard");
    } catch {
      toast.error("Failed to copy meeting link");
    }
  };

  const handleJoinMeeting = () => {
    if (!meetingLink) return;
    toast.success("Joining meeting...");
    // router.push(meetingLink)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white">{title}</Button>
      </DialogTrigger>

      <DialogContent className="bg-white shadow">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* CREATE MEETING */}
        {isCreate && (
          <div className="space-y-3">
            {!meetingLink ? (
              <Button
                disabled={loading}
                onClick={handleCreateMeeting}
                className="w-full bg-primary text-white"
              >
                Create Meeting
              </Button>
            ) : (
              <>
                <Input value={meetingLink} readOnly />
                <Button
                  onClick={handleCopy}
                  className="w-full bg-green-600 text-white"
                >
                  Copy Meeting Link
                </Button>
                <Button
                  disabled={loading}
                  onClick={handleCreateMeeting}
                  className="w-full bg-primary text-white"
                >
                  Create Meeting Again
                </Button>
              </>
            )}
          </div>
        )}

        {/* JOIN MEETING */}
        {!isCreate && (
          <div className="space-y-3">
            <Input
              placeholder="Paste meeting link here"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
            <Button
              onClick={handleJoinMeeting}
              disabled={!meetingLink}
              className="w-full bg-primary text-white"
            >
              Join Meeting
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopButton;
