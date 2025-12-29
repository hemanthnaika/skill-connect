import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "../globals.css";

import Navbar from "@/layout/navbar";
import Footer from "@/layout/footer";
import { Toaster } from "react-hot-toast";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
