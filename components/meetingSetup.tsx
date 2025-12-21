"use client";

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const call = useCall();
  if (!call) throw new Error("MeetingSetup must be used inside StreamCall");

  const [isMicCamOff, setIsMicCamOff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(true);
  const [hasCamPermission, setHasCamPermission] = useState(true);

  // ✅ Check permissions
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setHasMicPermission(true);
        setHasCamPermission(true);
      } catch (err) {
        console.error(err);
        toast.error("Camera or microphone permission denied");
        setHasMicPermission(false);
        setHasCamPermission(false);
      }
    };

    checkPermissions();
  }, []);

  // ✅ Enable / disable devices BEFORE join
  useEffect(() => {
    if (!call) return;

    if (isMicCamOff) {
      call.microphone.disable();
      call.camera.disable();
    } else {
      if (hasMicPermission) call.microphone.enable();
      if (hasCamPermission) call.camera.enable();
    }
  }, [isMicCamOff, call, hasMicPermission, hasCamPermission]);

  // ✅ Join safely (NO audio/video options)
  const handleJoin = async () => {
    try {
      setLoading(true);

      await call.join({
        create: false,
      });

      setIsSetupComplete(true);
    } catch (err) {
      console.error("Join failed:", err);
      toast.error("Failed to join meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D2938] flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-[#111827] p-6 text-white">
        <h1 className="text-center text-2xl font-semibold mb-2">
          Meeting setup
        </h1>

        {!hasMicPermission && (
          <p className="text-red-400 text-sm text-center">
            Microphone permission denied
          </p>
        )}
        {!hasCamPermission && (
          <p className="text-red-400 text-sm text-center">
            Camera permission denied
          </p>
        )}

        <div className="my-4 flex justify-center">
          {hasCamPermission ? (
            <VideoPreview />
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400">
              Camera unavailable
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isMicCamOff}
              onChange={(e) => setIsMicCamOff(e.target.checked)}
            />
            Join with mic & camera off
          </label>

          <DeviceSettings />
        </div>

        <Button className="w-full" disabled={loading} onClick={handleJoin}>
          {loading ? "Joining..." : "Join meeting"}
        </Button>
      </div>
    </div>
  );
};

export default MeetingSetup;
