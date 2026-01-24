"use client";

import { Marquee } from "@/components/ui/marquee";

const images = [
  "/api/placeholder/400/300",
  "/api/placeholder/400/300",
  "/api/placeholder/400/300",
  "/api/placeholder/400/300",
  "/api/placeholder/400/300",
];

export function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl w-full">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              About Hyderabad Networks
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-muted-foreground">
              <p>
                We specialize in premium corporate clock solutions for bulk
                gifting programs. With years of experience in manufacturing and
                customization, we help enterprises create memorable branded
                experiences.
              </p>
              <p>
                Our expertise includes bulk manufacturing, custom branding,
                laser engraving, logo printing, and personalized packaging. We
                work with businesses of all sizes to deliver high-quality clock
                solutions that reflect your brand identity.
              </p>
              <p>
                Trusted by leading corporations, we understand the
                importance of quality, timely delivery, and exceptional
                customer service in B2B relationships.
              </p>
            </div>
          </div>

          {/* Right Column - Carousel */}
          <div className="relative">
            <Marquee pauseOnHover className="[--duration:20s]">
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className="relative h-[200px] w-[280px] sm:h-[250px] sm:w-[350px] md:h-[300px] md:w-[400px] overflow-hidden rounded-lg border bg-muted"
                >
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}

