import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/shared/AppNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GravityLens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0A0A0F] text-white`}>
        <AppNavbar />
        {children}
      </body>
    </html>
  );
}