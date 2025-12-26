"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

/* ----------------------------------
   Types
----------------------------------- */

export type KYCStatus = "pending" | "approved" | "rejected" | null;
export type UserRole = "user" | "admin";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  conductedCount: number;
  registeredCount: number;
  kycStatus: KYCStatus;
}

/* ----------------------------------
   KYC Badge
----------------------------------- */

function KYCStatusBadge({ status }: { status: KYCStatus }) {
  if (!status) {
    return <span className="text-xs text-muted-foreground">Not submitted</span>;
  }

  const colorMap: Record<Exclude<KYCStatus, null>, string> = {
    approved: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-600 border border-red-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${colorMap[status]}`}
    >
      {status}
    </span>
  );
}

/* ----------------------------------
   Columns
----------------------------------- */

const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        variant={row.original.role === "admin" ? "secondary" : "outline"}
        className="capitalize"
      >
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "conductedCount",
    header: "Conducted",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.conductedCount}</span>
    ),
  },
  {
    accessorKey: "registeredCount",
    header: "Registered",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.registeredCount}</span>
    ),
  },
  {
    accessorKey: "kycStatus",
    header: "KYC",
    cell: ({ row }) => <KYCStatusBadge status={row.original.kycStatus} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="gap-1"
      >
        Joined
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.createdAt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

/* ----------------------------------
   Component
----------------------------------- */

export default function UsersTable({ data }: { data: UserRow[] }) {
  const [search, setSearch] = useState("");

  /* -------- Search Logic -------- */
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* ----------------------------------
         Header
      ----------------------------------- */}

      {/* ----------------------------------
         Search
      ----------------------------------- */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ----------------------------------
         Table Card
      ----------------------------------- */}
      <div className=" rounded-md shadow    px-5 py-4 bg-white dark:bg-black">
        <Table>
          <TableHeader className="bg-primary/10 ">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs uppercase tracking-wide text-black"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-secondary/90 transition "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ----------------------------------
           Pagination
        ----------------------------------- */}
        <div className="flex items-center justify-between border-t px-4 py-3 bg-muted/30">
          <span className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
