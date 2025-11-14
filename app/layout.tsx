import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";

const bric = Bricolage_Grotesque({
  weight: "200",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={(bric.className, "light")}>
      <body>{children}</body>
    </html>
  );
}
