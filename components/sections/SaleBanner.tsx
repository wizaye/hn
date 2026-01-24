"use client";

import { useState, useEffect } from "react";
import { X, Gift, Sparkles, TrendingDown, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const messages = [
  {
    title: "Bulk Orders Open!",
    description: "Get your hands on premium corporate clocks at unbeatable prices—limited time only!",
    icon: Gift,
  },
  {
    title: "Custom Branding Available",
    description: "Professional logo engraving and printing services for your corporate gifting needs",
    icon: Sparkles,
  },
  {
    title: "Special Discounts",
    description: "Save more on orders above 100 units—perfect for large organizations!",
    icon: TrendingDown,
  },
  {
    title: "Free Delivery",
    description: "Complimentary shipping on all bulk corporate orders across India",
    icon: Truck,
  },
];

export function SaleBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentMessage = messages[currentIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="sticky top-0 z-50 w-full text-foreground cursor-pointer bg-linear-to-b from-[#FBBF24] to-[#F59E0B] py-1.5 dark:from-[#2487EB] dark:to-[#1D69DE]">
      <div className="mx-auto flex max-w-7xl gap-x-2 px-4 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 max-md:mt-0.5"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4 opacity-80" />
          </div>
          <div className="flex grow flex-col justify-between gap-1 md:flex-row md:items-center transition-opacity duration-300">
            <div className="mt-0.5 flex flex-col items-start gap-1 md:mt-0 md:flex-row md:items-center">
              <p className="text-sm font-medium">{currentMessage.title}</p>
              <p className="text-foreground/80 text-sm">{currentMessage.description}</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group pointer-events-auto -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent hover:text-foreground"
          aria-label="Close banner"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100" />
        </Button>
      </div>
    </div>
  );
}

