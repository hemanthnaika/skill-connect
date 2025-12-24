"use client";

import { useState } from "react";

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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, MoreVertical, Trash } from "lucide-react";

import Image from "next/image";
import WorkshopButton from "./workshopButton";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Link from "next/link";

const TABLE_COLUMNS = [
  "Id",
  "Title",
  "Thumbnail",
  "Price",
  "Date",
  "Time",
  "Mode",
  "Status",
  "Register Students",
  "Actions",
  "Create Meeting Link",
];

const statusStyles: Record<string, string> = {
  approved: "text-green-600 font-medium",
  rejected: "text-red-500 font-medium",
  pending: "text-yellow-600 font-medium",
};

const ITEMS_PER_PAGE = 5;

type DialogBoxProps = {
  btnText?: string;
  title: string;
  description?: string;
  image?: boolean;
  imageSrc?: string;
};

type DeleteWorkshopResponse = {
  message: string;
  error?: string;
};

const DialogBox = ({
  btnText,
  title,
  description,
  image = false,
  imageSrc,
}: DialogBoxProps) => (
  <Dialog>
    <DialogTrigger asChild>
      {image ? (
        <Image
          src={imageSrc || ""}
          width={50}
          height={50}
          alt={title}
          className="rounded-md cursor-pointer hover:opacity-80"
        />
      ) : (
        <button className="mt-1 block text-xs text-blue-600 underline">
          {btnText}
        </button>
      )}
    </DialogTrigger>

    <DialogContent className="bg-white shadow">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      {image ? (
        <Image
          src={imageSrc || ""}
          width={400}
          height={300}
          alt={title}
          className="rounded-md w-full h-auto"
        />
      ) : (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </DialogContent>
  </Dialog>
);

const WorkshopTable = ({
  initialWorkshops,
}: {
  initialWorkshops: Workshop[];
}) => {
  const { request, loading } = useApi<DeleteWorkshopResponse>();
  const [page, setPage] = useState(1);
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);

  const totalPages = Math.ceil(workshops.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = workshops.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = async (id: string) => {
    if (!id) return;
    const confirmed = confirm("Are you sure you want to delete this workshop?");
    if (!confirmed) return;

    const res = await request({
      url: `/api/workshops/${id}`,
      method: "DELETE",
    });

    if (!res) {
      toast.error("Something went wrong!");
      return;
    }

    if (res.error) {
      toast.error(res.error);
      return;
    }

    // ✅ remove workshop from state
    setWorkshops((prev) => prev.filter((w) => w.id !== id));

    toast.success(res.message);
  };

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_COLUMNS.map((heading) => (
              <TableHead key={heading}>{heading}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: TABLE_COLUMNS.length }).map((_, i) => (
                    <TableCell key={i}>
                      <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell title={item.id}>{item.id.slice(0, 10)}…</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <DialogBox
                      title={`${item.title}`}
                      imageSrc={`${item.thumbnailUrl}`}
                      image={true}
                    />
                  </TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell className="capitalize">{item.mode}</TableCell>
                  <TableCell className="capitalize">
                    <span className={statusStyles[item.status]}>
                      {item.status}
                    </span>
                    {item.status === "rejected" && item.rejectionReason && (
                      <DialogBox
                        btnText="View Reason"
                        title="Rejection Reason"
                        description={item.rejectionReason}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.studentsCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-40 bg-white shadow-md"
                      >
                        <DropdownMenuItem>
                          <Link
                            href={`/workshops/conductWorkshop?slug=${item.slug}`}
                            className="flex items-center"
                          >
                            <Edit className="mr-3 h-4 w-4 text-orange-500" />
                            <span className="text-orange-500">
                              Edit Workshop
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled={loading}
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <WorkshopButton isCreate={true} workshopId={item.id} />
                  </TableCell>
                </TableRow>
              ))}

          {currentData.length === 0 && (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-gray-500">
                No workshops found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopTable;
