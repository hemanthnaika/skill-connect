"use client";

import { Column, ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, ChevronRight, User, UserStar } from "lucide-react";
import ActionButton from "./actionButton";
import Image from "next/image";
import { about, profile } from "@/assets/images";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}
export function SortableHeader<TData, TValue>({
  column,
  title,
}: SortableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export const columns: ColumnDef<PendingWorkshop>[] = [
  {
    accessorFn: (row) => row.workshop.id,
    accessorKey: "id",
    header: () => <div className="text-right">#</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium ">{row.index + 1}</div>;
    },
  },
  {
    accessorFn: (row) => row.workshop.title,
    header: "Title",
    accessorKey: "title",
  },
  {
    accessorFn: (row) => row.workshop.category,
    header: "Category",
  },
  {
    accessorFn: (row) => row.workshop.level,
    header: "Level",
  },
  {
    accessorFn: (row) => row.workshop.language,

    header: "Language",
  },
  {
    accessorFn: (row) => row.workshop.price,

    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} title="Price" />,
  },

  {
    accessorFn: (row) => row.creator?.name,
    accessorKey: "name",
    header: "Creator",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-5">
          <Avatar>
            <AvatarImage
              src={
                row.original.creator?.image
                  ? row.original.creator?.image
                  : profile.src
              }
            />

            <AvatarFallback>
              {row.original.creator?.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-xs">
            <span>{row.original?.creator?.name}</span>
            <span>{row.original?.creator?.role}</span>
            <span>{row.original?.creator?.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.workshop.status,

    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const workshop = row.original;
      return (
        <ActionButton
          id={workshop.workshop.id}
          status={workshop.workshop.status}
        />
      );
    },
  },
  {
    accessorKey: "ViewDetails",
    header: "More Info",
    cell: ({ row }) => {
      const workshop = row.original;
      return (
        <Dialog>
          <DialogTrigger>
            <ChevronRight className="w-5 h-5 " />
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-black max-w-3xl rounded-xl ">
            <DialogHeader className="dark:text-white">
              <DialogTitle>{workshop.workshop.title}</DialogTitle>
              <DialogDescription>
                {workshop.workshop.description}
              </DialogDescription>
              <div>
                <Image
                  src={about}
                  alt="Thumbnail"
                  height={300}
                  className="w-full rounded-md"
                />

                <div>
                  {workshop.workshop.address && (
                    <span>{workshop.workshop.address}</span>
                  )}
                </div>
                <div>Mode:-{workshop.workshop.mode}</div>
                <div>Time:-{workshop.workshop.time}</div>
                <div>Duration:-{workshop.workshop.duration}</div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "user",
    header: "#",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar>
          <AvatarImage src={user.image ? user.image : profile.src} />
          <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="capitalize">
          {user.role === "admin" ? (
            <span className="flex items-center gap-2">
              <UserStar className="w-5 h-5 text-primary text-xs" /> Admin
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary text-xs" /> User
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "kycStatus",
    header: "KYC Status",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="capitalize">
          {user.kycStatus ? (
            user.kycStatus === "rejected" ? (
              <span className="text-white bg-red-500 px-2 py-1 rounded-md">
                Rejected
              </span>
            ) : (
              <span className="text-white bg-green-500 px-2 py-1 rounded-md">
                Approved
              </span>
            )
          ) : (
            "Not Submitted"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "conductedCount",
    header: "Workshops Conducted",
  },
  {
    accessorKey: "registeredCount",
    header: "Workshops Registered",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column} title="Joined At" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <div>{user.createdAt.toDateString()}</div>;
    },
  },
];

export const allApprovedWorkshopColumns: ColumnDef<AdminAllWorkshopResponse>[] =
  [
    {
      accessorFn: (row) => row.creatorName,
      accessorKey: "name",
      header: "#",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.creatorImage || profile.src} />
            <AvatarFallback>
              {row.original.creatorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 text-sm">
            <span>{row.original.creatorName}</span>
            <span>{row.original.createEmail}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
    {
      accessorKey: "price",
      header: ({ column }) => <SortableHeader column={column} title="Price" />,
    },
    {
      accessorKey: "studentsCount",
      header: ({ column }) => (
        <SortableHeader column={column} title="Total Registrations" />
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <ActionButton id={row.original.id} status={row.original.status} />
      ),
    },
    {
      accessorKey: "ViewDetails",
      header: "More Info",
      cell: ({ row }) => {
        const workshop = row.original;
        return (
          <Dialog>
            <DialogTrigger>
              <ChevronRight className="w-5 h-5 " />
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-black max-w-3xl rounded-xl ">
              <DialogHeader className="dark:text-white">
                <DialogTitle>{workshop.title}</DialogTitle>
                <DialogDescription>{workshop.description}</DialogDescription>
                <div>
                  <Image
                    src={about}
                    alt="Thumbnail"
                    height={300}
                    className="w-full rounded-md"
                  />

                  <div>
                    {workshop.address && (
                      <span>Address:- {workshop.address}</span>
                    )}
                  </div>
                  <div>Mode:-{workshop.mode}</div>
                  <div>Time:-{workshop.time}</div>
                  <div>Duration:-{workshop.duration}</div>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

export const registrationsColumns: ColumnDef<RegisterUserResponse>[] = [
  {
    accessorFn: (row) => row.user.name,
    accessorKey: "name",
    header: "#",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={user.user.image ? user.user.image : profile.src}
            />
            <AvatarFallback>{user.user.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 text-xs">
            <span>{user.user.name}</span>
            <span>{user.user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.workshop.title,
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorFn: (row) => row.workshop.price,
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} title="Price" />,
  },
  {
    accessorFn: (row) => row.registeredAt,

    accessorKey: "registeredAt",
    header: ({ column }) => (
      <SortableHeader column={column} title="Registered At" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.original.registeredAt).toDateString()}</div>
    ),
  },
  {
    accessorFn: (row) => row.paymentStatus,
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => (
      <div>
        {row.original.paymentStatus ? (
          <Badge className="text-xs bg-green-600  text-white px-5">Paid</Badge>
        ) : (
          <Badge className="text-xs bg-red-500  text-white px-5">Unpaid</Badge>
        )}
      </div>
    ),
  },
];
