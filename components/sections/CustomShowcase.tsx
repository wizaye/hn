"use client";

import { MagicCard } from "@/components/ui/magic-card";

const showcaseItems = [
  {
    title: "Laser Engraving",
    description: "Precision laser engraving for custom text and logos on premium materials",
    image: "/api/placeholder/400/300",
  },
  {
    title: "Logo Printing",
    description: "High-quality logo printing with vibrant colors and durable finishes",
    image: "/api/placeholder/400/300",
  },
  {
    title: "Custom Packaging",
    description: "Branded packaging solutions that make your corporate gifts stand out",
    image: "/api/placeholder/400/300",
  },
  {
    title: "Bulk Corporate Themes",
    description: "Themed clock collections designed for large-scale corporate gifting programs",
    image: "/api/placeholder/400/300",
  },
];

export function CustomShowcase() {
  return (
    <section id="custom-work" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Customized Clocks Crafted for Brands
          </h2>
          <p className="mx-auto max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            Explore our customization capabilities and see how we bring your brand vision to life
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {showcaseItems.map((item, idx) => (
            <MagicCard
              key={idx}
              className="relative h-full cursor-pointer border p-4 sm:p-5 md:p-6"
            >
              <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden rounded-lg bg-muted mb-3 sm:mb-4">
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
              </div>
              <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-semibold">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}

