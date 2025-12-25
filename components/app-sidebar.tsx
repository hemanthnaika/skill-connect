"use client";

import * as React from "react";
import {
  Banknote,
  Book,
  Frame,
  Group,
  Map,
  PieChart,
  Settings,
  Settings2,
  ShieldAlert,
  Users,
  Verified,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "john doe",
    email: "bB9lW@example.com",
    avatar: "https://github.com/shadcn.png",
  },

  navMain: [
    {
      title: "Users",
      url: "#",
      icon: Users,

      items: [
        {
          title: "All Users",
          url: "/admin/students",
        },
      ],
    },
    {
      title: "Workshops",
      url: "#",
      icon: Book,
      items: [
        {
          title: "All Workshops",
          url: "#",
        },
        {
          title: "Pending Approval",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: Banknote,
      items: [
        {
          title: " Transactions",
          url: "#",
        },
        {
          title: "Payouts",
          url: "#",
        },
        {
          title: "Refunds",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "KYC Verification",
      url: "/admin/kycVerification",
      icon: Verified,
    },
    {
      name: "Categories",
      url: "#",
      icon: Group,
    },
    {
      name: "Complaints",
      url: "#",
      icon: ShieldAlert,
    },
    {
      name: "Analytics",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={"/admin"}>
          <TeamSwitcher />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
