"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { updateWorkshopStatus } from "@/actions/updateWorkshopStatus";
import { cn } from "@/lib/utils";

const statusList = ["pending", "approved", "rejected"] as const;

const statusStyles: Record<(typeof statusList)[number], string> = {
  pending: "bg-gray-100 text-gray-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ActionButton({
  status,
  id,
}: {
  status: string;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (value: string) => {
    if (value === "rejected") {
      setOpen(true);
      return;
    }

    try {
      setLoading(true);
      await updateWorkshopStatus({
        id,
        status: value as "pending" | "approved" | "rejected",
      });
      toast.success("Workshop status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;

    try {
      setLoading(true);
      await updateWorkshopStatus({
        id,
        status: "rejected",
        rejectionReason: reason,
      });
      toast.success("Workshop rejected");
      setOpen(false);
      setReason("");
    } catch {
      toast.error("Failed to reject workshop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* STATUS SELECT */}
      <Select defaultValue={status} onValueChange={handleStatusChange}>
        <SelectTrigger
          className="w-[150px] h-9 text-sm border-neutral-50 capitalize"
          disabled={loading}
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="bg-white">
          {statusList.map((item) => (
            <SelectItem key={item} value={item}>
              <div className="flex items-center gap-2 ">
                <Badge
                  className={cn(" px-5 py-1 capitalize", statusStyles[item])}
                >
                  {item}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* REJECTION MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Reject Workshop
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Please provide a reason for rejecting this workshop. This will be
              visible to the creator.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setReason("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              disabled={loading || !reason.trim()}
              onClick={() => handleReject()}
            >
              Reject Workshop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
