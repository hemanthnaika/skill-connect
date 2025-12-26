import type { Metadata } from "next";
import "../../globals.css";

import { Toaster } from "react-hot-toast";

import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/themButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Skill Connect- Admin Dashboard",
  description:
    "A community platform where people teach, learn, and join online/offline workshops — all in one place.",
  icons: {
    icon: "/logo.png",
  },
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user?.role != "admin") {
    return notFound();
  }
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster position="top-center" reverseOrder={false} />
        <SidebarProvider className="bg-secondary dark:bg-black">
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex  items-center justify-between w-full px-4">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  <Avatar>
                    <AvatarImage
                      src={session?.user?.image ?? ""}
                      alt={session?.user?.name ?? ""}
                    />
                  </Avatar>
                </div>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
