import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SaleBanner } from "@/components/sections/SaleBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hyderabad Networks - Premium Corporate Clocks",
  description: "Premium corporate clock solutions for bulk gifting and custom branding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SaleBanner />
        {children}
      </body>
    </html>
  );
}
