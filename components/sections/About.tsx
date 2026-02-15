"use client";

import { FramerCarousel } from "@/components/ui/framer-carousel";

const images = [
  "/shop/shop1.jpeg",
  "/shop/shop2.jpeg",
];

export function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl w-full">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground tracking-tight">
              About <span className="text-foreground">Hyderabad Network</span>
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-muted-foreground">
              <p className="text-justify">
                Hyderabad Network began in 1953, when our father, Mohammed Osman, founded the Record Watch Company at M.J. Market, Hyderabad. What started as a small luxury shop soon became a trusted name for quality wall clocks and wristwatches.
              </p>
              <p className="text-justify">
                In 1999, we expanded our legacy by becoming distributors for the renowned Ajanta Group. Over the years, our presence at the Nampally Exhibition has earned us multiple awards, including Best Stall for more than a decade.
              </p>
              <p className="text-justify">
                Today, we've grown beyond clocks and watches into corporate gifting solutions for businesses and institutions across South India. From Abids, Hyderabad, we continue to serve with the same values of trust, authenticity, and lasting relationships.
              </p>
              <p className="text-justify font-semibold text-foreground">
                Hyderabad Network - A heritage of trust, evolving with time.
              </p>
            </div>
          </div>

          {/* Right Column - Autoplay Carousel */}
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] w-full rounded-lg overflow-hidden border shadow-lg">
            <FramerCarousel images={images} autoplayInterval={4000} className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

