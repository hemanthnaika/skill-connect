import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Connect",
  description:
    "A community platform where people teach, learn, and join online/offline workshops — all in one place.",
  icons: {
    icon: "/logo.png",
  },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body className="relative ">{children}</body>
    </html>
  );
}
