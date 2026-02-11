import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SaleBanner } from "@/components/sections/SaleBanner";
import { EnquiryCartProvider } from "@/hooks/use-enquiry-cart";
import { CartOpenProvider, EnquiryCart } from "@/components/products/EnquiryCart";
import { Toaster } from "@/components/ui/sonner";
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
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EnquiryCartProvider>
          <CartOpenProvider>
            <SaleBanner />
            <EnquiryCart />
            {children}
            <Toaster position="bottom-right" />
          </CartOpenProvider>
        </EnquiryCartProvider>
      </body>
    </html>
  );
}
