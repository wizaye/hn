"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          className="h-full w-full object-cover brightness-50"
          suppressHydrationWarning
        >
          {/* <source src="https://videos.pexels.com/video-files/2795392/2795392-uhd_2560_1440_25fps.mp4" type="video/mp4" /> */}
          <source src="/bg_video_2.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl text-center text-white">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/70">
          Hyderabad Network
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Premium Corporate
          <br />
          <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Clocks for Gifting
          </span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-white/80 sm:text-xl">
          Custom branding • Competitive bulk pricing
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-semibold px-8"
          >
            <Link href="/enquire">
              Get a Quote
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 px-8"
          >
            <Link href="/products">Browse Catalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

