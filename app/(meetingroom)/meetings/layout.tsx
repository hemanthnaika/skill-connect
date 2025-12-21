import type { Metadata } from "next";
import "../../globals.css";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Skill Connect- Meeting Room",
  description:
    "A community platform where people teach, learn, and join online/offline workshops — all in one place.",
  icons: {
    icon: "/logo.png",
  },
};

export default async function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
}
