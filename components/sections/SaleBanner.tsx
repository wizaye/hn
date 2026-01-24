"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const messages = [
  {
    title: "🎁 Bulk Orders Open!",
    description: "Premium corporate clocks at unbeatable prices - Limited Time Only",
    mobileDescription: "Premium clocks - Limited Time",
  },
  {
    title: "✨ Custom Branding",
    description: "Professional logo engraving & printing services - Free Design Mockup",
    mobileDescription: "Logo engraving & printing",
  },
  {
    title: "💰 Special Discounts",
    description: "Save big on orders above 100 units - Up to 30% Off",
    mobileDescription: "Up to 30% Off on bulk orders",
  },
  {
    title: "🚚 Free Delivery",
    description: "Complimentary shipping on bulk orders - All India",
    mobileDescription: "Free shipping - All India",
  },
];

export function SaleBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentMessage = messages[currentIndex];

  return (
    <div className="sticky top-0 z-30 w-full bg-black transition-all duration-500">
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between gap-2 py-1.5 sm:py-2">
            {/* Main Content - Centered */}
            <div className={`flex flex-1 items-center justify-center gap-2 min-w-0 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-center">
                <span className="text-[10px] sm:text-xs md:text-sm font-bold text-white">
                  {currentMessage.title}
                </span>
                <span className="mx-1.5 sm:mx-2 text-white/60 hidden sm:inline">•</span>
                <span className="text-[9px] sm:text-[11px] md:text-xs text-white/90">
                  <span className="sm:hidden">{currentMessage.mobileDescription}</span>
                  <span className="hidden sm:inline">{currentMessage.description}</span>
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex items-center shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-white/20 text-white shrink-0"
                aria-label="Close banner"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </div>
          </div>

          {/* Progress Indicators - Hidden */}
          <div className="hidden">
            {messages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`h-0.5 sm:h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-6 sm:w-8 bg-white' 
                    : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to message ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

