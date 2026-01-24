"use client";

import { useState } from "react";
import { NoiseBackground } from "@/components/ui/noise-background";
import { Marquee } from "@/components/ui/marquee";

const showcaseItems = [
  {
    title: "Laser Engraving",
    description: "Precision laser engraving for custom text and logos on premium materials",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop",
    gradient: ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"],
  },
  {
    title: "Logo Printing",
    description: "High-quality logo printing with vibrant colors and durable finishes",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&h=400&fit=crop",
    gradient: ["rgb(100, 150, 255)", "rgb(150, 100, 255)", "rgb(255, 150, 100)"],
  },
  {
    title: "Custom Packaging",
    description: "Branded packaging solutions that make your corporate gifts stand out",
    image: "https://images.unsplash.com/photo-1594831289848-b8e1b8908ea8?w=400&h=400&fit=crop",
    gradient: ["rgb(255, 150, 100)", "rgb(100, 200, 255)", "rgb(255, 200, 100)"],
  },
  {
    title: "Bulk Corporate Themes",
    description: "Themed clock collections designed for large-scale corporate gifting programs",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
    gradient: ["rgb(150, 255, 100)", "rgb(255, 150, 200)", "rgb(100, 200, 255)"],
  },
  {
    title: "Personalized Designs",
    description: "Unique clock designs tailored to your company's aesthetic and values",
    image: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&h=400&fit=crop",
    gradient: ["rgb(255, 200, 100)", "rgb(100, 150, 255)", "rgb(255, 100, 150)"],
  },
  {
    title: "Premium Materials",
    description: "Luxury materials including wood, metal, and glass for executive gifts",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=400&fit=crop",
    gradient: ["rgb(100, 200, 255)", "rgb(255, 150, 100)", "rgb(150, 255, 100)"],
  },
];

export function CustomShowcase() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <section id="custom-work" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground tracking-tight">
            Customized Clocks <span className="text-foreground">Crafted for Brands</span>
          </h2>
          <p className="mx-auto max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            Explore our customization capabilities and see how we bring your brand vision to life
          </p>
        </div>

        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <Marquee pauseOnHover className="[--duration:40s]">
            {showcaseItems.map((item, idx) => (
              <div key={idx} className="mx-2 w-[280px] sm:w-[320px]">
                <NoiseBackground
                  gradientColors={item.gradient}
                  className="h-full"
                >
                  <div className="flex h-[380px] sm:h-[400px] flex-col overflow-hidden rounded-lg bg-white text-center dark:bg-neutral-800">
                    {/* Icon/Image Section */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                      {!imageErrors[idx] ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            onError={() => handleImageError(idx)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </>
                      ) : (
                        <>
                          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl sm:text-6xl">🕐</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col px-3 sm:px-4 py-3 sm:py-4 min-h-0">
                      <div className="flex-1 flex flex-col justify-between min-h-0">
                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2 line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3">
                          {item.description}
                        </p>

                        {/* Action Tag */}
                        <div className="text-xs font-medium text-primary">
                          Learn More →
                        </div>
                      </div>
                    </div>
                  </div>
                </NoiseBackground>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

