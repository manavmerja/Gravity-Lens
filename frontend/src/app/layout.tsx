import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import AppNavbar from "@/components/shared/AppNavbar";
import { SmoothScrollProvider } from "@/components/shared/smooth-scroll";
import { Preloader } from "@/components/ui/preloader";
import { Metadata } from "next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GravityLens",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasShown = cookieStore.get("gravity-preloader-shown")?.value === "true";

  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-[#0A0A0F] text-white`}>
        <Preloader isSecondary={hasShown} />
        <AppNavbar />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}