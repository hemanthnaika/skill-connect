import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

import Navbar from "@/layout/navbar";
import Footer from "@/layout/footer";

const roboto = Bricolage_Grotesque({
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
    <html lang="en" className={roboto.className}>
      <body className="relative">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
