import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { BestSellers } from "@/components/sections/BestSellers";
import { CustomShowcase } from "@/components/sections/CustomShowcase";
import { EnquirySection } from "@/components/sections/EnquirySection";
import { EnquiryCartProvider } from "@/hooks/use-enquiry-cart";
import { CartOpenProvider } from "@/components/products/EnquiryCart";
import { EnquiryCart } from "@/components/products/EnquiryCart";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <EnquiryCartProvider>
      <CartOpenProvider>
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <About />
          <BestSellers />
          <CustomShowcase />
          <EnquirySection />
          <Footer />
          <EnquiryCart />
          <Toaster />
        </div>
      </CartOpenProvider>
    </EnquiryCartProvider>
  );
}
