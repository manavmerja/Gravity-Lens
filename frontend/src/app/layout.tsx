import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppNavbar from "@/components/shared/AppNavbar";
import { Preloader } from "@/components/ui/preloader";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
      <body className={`${spaceGrotesk.variable} font-sans antialiased bg-[#0A0A0F] text-white`}>
        <Preloader />
        <AppNavbar />
        {children}
      </body>
    </html>
  );
}