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

const WorkshopTable = ({ workshop }: { workshop: Workshop[] }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(workshop.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = workshop.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className=" space-y-4">
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
          {currentData.map((item) => (
            <TableRow key={item.id}>
              {/* ID */}
              <TableCell title={item.id}>{item.id.slice(0, 10)}…</TableCell>

              {/* Title */}
              <TableCell>{item.title}</TableCell>

              {/* Thumbnail */}
              <TableCell>
                <DialogBox
                  title={`${item.title}`}
                  imageSrc={`${item.thumbnailUrl}`}
                  image={true}
                />
              </TableCell>

              {/* Price */}
              <TableCell>{item.price}</TableCell>

              {/* Date */}
              <TableCell>
                {" "}
                {new Date(item.date).toLocaleDateString("en-GB")}
              </TableCell>

              {/* Time */}
              <TableCell>{item.time}</TableCell>

              {/* Mode */}
              <TableCell className="capitalize">{item.mode}</TableCell>

              {/* Status */}
              <TableCell className="capitalize">
                <span className={statusStyles[item.status]}>{item.status}</span>

                {item.status === "rejected" && item.rejectionReason && (
                  <DialogBox
                    btnText="View Reason"
                    title="Rejection Reason"
                    description={item.rejectionReason}
                  />
                )}
              </TableCell>
              {/* Register Students */}
              <TableCell>{item.studentsCount}</TableCell>
              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-40 bg-white shadow-md "
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        // navigate to edit page
                        // router.push(`/admin/workshops/edit/${item.id}`)
                        console.log("Edit", item.id);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => {
                        // open delete confirmation modal
                        console.log("Delete", item.id);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
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
              <TableCell colSpan={8} className="text-center text-gray-500">
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
