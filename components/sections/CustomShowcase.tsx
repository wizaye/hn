"use client";

import { useState } from "react";
import { NoiseBackground } from "@/components/ui/noise-background";
import { Marquee } from "@/components/ui/marquee";

const showcaseItems = [
  {
    title: "Single Color Screen Printing",
    description: "Precise single-color prints perfect for minimalist logos and high-contrast branding",
    image: "/custom_work/single color.png",
    gradient: ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"],
  },
  {
    title: "Double Color Screen Printing",
    description: "Two-tone printing for logos requiring more depth and visual hierarchy",
    image: "/custom_work/double color.png",
    gradient: ["rgb(100, 150, 255)", "rgb(150, 100, 255)", "rgb(255, 150, 100)"],
  },
  {
    title: "Multi Color Screen Printing",
    description: "Vibrant multi-color screen printing for complex manufacturing and colorful designs",
    image: "/custom_work/multi color.png",
    gradient: ["rgb(255, 150, 100)", "rgb(100, 200, 255)", "rgb(255, 200, 100)"],
  },
  {
    title: "Dial Printing",
    description: "Custom printed clock dials featuring your brand identity right on the face",
    image: "/custom_work/Dial.png",
    gradient: ["rgb(150, 255, 100)", "rgb(255, 150, 200)", "rgb(100, 200, 255)"],
  },
  {
    title: "Sticker Customization",
    description: "High-quality stickers for branding and personalization",
    image: "/custom_work/sticker.png",
    gradient: ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"],
  },
  {
    title: "Box Customization",
    description: "Fully customized box packaging to match your corporate identity",
    image: "",
    gradient: ["rgb(255, 200, 100)", "rgb(100, 150, 255)", "rgb(255, 100, 150)"],
  },
  {
    title: "Customized Packing",
    description: "Specialized packing solutions ensuring safety and premium unboxing experience",
    image: "",
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
                      {item.image && !imageErrors[idx] ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-contain p-4"
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

