"use client";

import { FramerCarousel } from "@/components/ui/framer-carousel";

const images = [
  "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1577201227227-b275785d8ee4?w=800&h=600&fit=crop",
];

export function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl w-full">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground tracking-tight">
              About <span className="text-foreground">Hyderabad Networks</span>
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-muted-foreground">
              <p className="text-justify">
                We specialize in premium corporate clock solutions for bulk
                gifting programs. With years of experience in manufacturing and
                customization, we help enterprises create memorable branded
                experiences.
              </p>
              <p className="text-justify">
                Our expertise includes bulk manufacturing, custom branding,
                laser engraving, logo printing, and personalized packaging. We
                work with businesses of all sizes to deliver high-quality clock
                solutions that reflect your brand identity.
              </p>
              <p className="text-justify">
                Trusted by leading corporations, we understand the
                importance of quality, timely delivery, and exceptional
                customer service in B2B relationships.
              </p>
            </div>
          </div>

          {/* Right Column - Autoplay Carousel */}
          <div className="relative h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px] rounded-lg overflow-hidden border">
            <FramerCarousel images={images} autoplayInterval={4000} className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

