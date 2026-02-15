import { Navbar } from "@/components/layout/Navbar";

import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { BestSellers } from "@/components/sections/BestSellers";
import { CustomShowcase } from "@/components/sections/CustomShowcase";
import { VisitUs } from "@/components/sections/VisitUs";
import { EnquiryCart } from "@/components/products/EnquiryCart";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <BestSellers />
        <CustomShowcase />
        <VisitUs />
      </main>
      <Footer />
      <EnquiryCart />
    </div>
  );
}
