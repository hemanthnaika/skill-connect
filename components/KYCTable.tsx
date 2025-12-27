"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis, Loader, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const TableColumns = ["ID", "User", "Status", "Actions"];

const KYCTable = () => {
  const { request: DataFetch, loading } = useApi<KYCResponse>();
  const { request: kycUpdate, loading: kycUpdateLoading } =
    useApi<KYCUpdateResponse>();

  const [data, setData] = useState<KYC[]>([]);
  const [selectedItem, setSelectedItem] = useState<KYC | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await DataFetch({ url: "/api/admin/kyc", method: "GET" });
      if (!res) return;
      setData(res.KYC);
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAction = async (item: KYC, action: "approved" | "rejected") => {
    if (action === "rejected" && !rejectionReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    try {
      const res = await kycUpdate({
        url: `/api/admin/kyc/${item.id}`,
        method: "PATCH",
        data: {
          status: action,
          rejectionReason: action === "rejected" ? rejectionReason : null,
        },
      });
      console.log(res);
      if (!res) return;
      if (res.message) {
        toast.success(res.message);
        // Update the table locally
        setData((prev) =>
          prev.map((d) =>
            d.id === item.id
              ? { ...d, status: action, rejectionReason: rejectionReason }
              : d
          )
        );
        setSelectedItem(null);
        setShowRejectReason(false);
        setRejectionReason("");
      }
    } catch (err) {
      console.error("KYC update failed", err);
      alert("Failed to update KYC");
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-[50vh] items-center justify-center">
        <Loader className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className=" ">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50 dark:bg-black">
          <TableRow>
            {TableColumns.map((column, i) => (
              <TableHead
                key={i}
                className="text-left text-sm font-semibold  px-6 py-3"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white dark:bg-black divide-y divide-gray-200 dark:text-white">
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="px-6 py-4 font-medium ">
                {item.id.slice(0, 8)}
              </TableCell>

              <TableCell className="px-6 py-4 font-medium ">
                <div className="flex flex-col">
                  <span className="font-semibold">{item.user.name}</span>
                  <span className="text-sm text-gray-500">
                    {item.user.email}
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </TableCell>

              <TableCell className="px-6 py-4 text-right">
                <Dialog>
                  <DialogTrigger className="p-2 rounded-full hover:bg-gray-100 transition">
                    <Ellipsis className="w-5 h-5 " />
                  </DialogTrigger>

                  <DialogContent className="bg-white rounded-xl p-6 max-w-lg mx-auto shadow-lg  max-h-[90vh] overflow-y-auto dark:bg-black dark:text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold ">
                        KYC Details
                      </DialogTitle>
                      <DialogDescription className=" text-sm mt-1">
                        Review and manage this KYC submission
                      </DialogDescription>
                    </DialogHeader>

                    {/* User Info */}
                    <div className="mt-2 space-y-2">
                      {[
                        ["ID", item.id],
                        ["Name", item.user.name],
                        ["Email", item.user.email],
                        ["Phone", item.phone],
                        ["UPI ID", item.upiId],
                        ["Experience", item.experience],
                      ].map(([label, value], idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="font-medium ">{label}:</span>
                          <span>{value}</span>
                        </div>
                      ))}

                      {/* Skills */}
                      <div className="flex flex-col gap-2">
                        <span className="font-medium ">Skills:</span>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(
                            item.skills
                              .replaceAll("{", "[")
                              .replaceAll("}", "]")
                          ).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Documents Gallery */}
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="font-medium ">Documents:</span>
                        <div className="grid grid-cols-2 gap-3">
                          {[item.document, item.selfie].map((src, idx) => (
                            <Link
                              key={idx}
                              href={src}
                              target="_blank"
                              className="overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition"
                            >
                              <Image
                                src={src}
                                alt={`Document ${idx + 1}`}
                                width={300}
                                height={200}
                                className="w-full h-28 object-cover transform hover:scale-105 transition"
                              />
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={item.socialLink}
                          target="_blank"
                          className="text-blue-600 hover:underline text-sm mt-1"
                        >
                          View Social Proof
                        </Link>
                      </div>
                    </div>

                    {/* Dropdown Actions & Reject Reason */}
                    <div className="mt-1 flex flex-col gap-3">
                      {showRejectReason && selectedItem?.id === item.id && (
                        <textarea
                          placeholder="Enter rejection reason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                      )}

                      <div className="flex justify-end gap-3">
                        {showRejectReason && selectedItem?.id === item.id ? (
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white "
                            onClick={() => handleAction(item, "rejected")}
                          >
                            Submit Rejection
                          </Button>
                        ) : (
                          <>
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleAction(item, "approved")}
                              disabled={kycUpdateLoading}
                            >
                              Approve
                            </Button>

                            <Button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowRejectReason(true);
                              }}
                              disabled={kycUpdateLoading}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        <DialogClose asChild>
                          <Button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                            onClick={() => {
                              setSelectedItem(null);
                              setShowRejectReason(false);
                            }}
                          >
                            Close
                          </Button>
                        </DialogClose>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KYCTable;
