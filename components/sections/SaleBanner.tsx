"use client";

import "react";
const messages = [
  "PREMIUM CORPORATE CLOCKS FOR MODERN OFFICES   •   EXPERT CUSTOM BRANDING & BULK ORDERS   •   NATIONWIDE SHIPPING AVAILABLE   •   ENQUIRE TODAY FOR EXCLUSIVE CORPORATE DISCOUNTS",
];

export function SaleBanner() {
  return (
    <div className="relative z-50 flex items-center justify-between bg-black py-2 text-sm text-white transition-all duration-500 overflow-hidden w-full max-w-[100vw]">
      <div className="flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee gap-16">
          {[...messages, ...messages, ...messages].map((message, i) => (
            <div key={i} className="flex items-center">
              <span className="font-medium tracking-wide text-sm md:text-base whitespace-nowrap">{message}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 78s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

