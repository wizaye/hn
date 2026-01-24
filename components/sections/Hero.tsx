"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NoiseBackground } from "@/components/ui/noise-background";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/api/placeholder/video" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl text-center text-white">
        <h1 className="mb-4 sm:mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl max-w-5xl">
          Premium Corporate Clocks
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          for Bulk Gifting
        </h1>
        <p className="mb-6 sm:mb-8 max-w-xl md:max-w-2xl lg:max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 px-4">
          Custom branding • Bulk pricing • Trusted by enterprises
        </p>
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto px-4">
          <NoiseBackground
            containerClassName="w-full sm:w-fit p-1.5 sm:p-2 rounded-full"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <Link
              href="/enquire"
              className="flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-neutral-100 via-neutral-100 to-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg text-black shadow-[0px_2px_0px_0px_rgb(245,245,245)_inset,0px_0.5px_1px_0px_rgb(163,163,163)] transition-all duration-100 active:scale-[0.98] dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_rgb(10,10,10)_inset,0px_1px_0px_0px_rgb(38,38,38)] hover:shadow-lg"
            >
              Enquire Now &rarr;
            </Link>
          </NoiseBackground>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
          >
            <Link href="/products">View Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

