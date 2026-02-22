"use client";

import { CustomWorkCard } from "@/components/sections/CustomWorkCard";
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
  return (
    <section id="custom-work" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background overflow-hidden w-full max-w-[100vw]">
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
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <Marquee pauseOnHover className="[--duration:40s] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {showcaseItems.map((item, idx) => (
              <div key={idx} className="mx-3 w-[240px] sm:w-[280px] h-full">
                <CustomWorkCard
                  title={item.title}
                  description={item.description}
                  image={item.image}
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

