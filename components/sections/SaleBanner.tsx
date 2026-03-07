"use client";

import { useEffect, useState, useCallback } from "react";

interface Banner {
  id: number;
  title: string;
  description: string | null;
  discount_text: string | null;
  link: string | null;
  bg_color: string;
  text_color: string;
  end_date: string | null;
}

function useCountdown(endDate: string | null) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endDate) { setTimeLeft(""); return; }
    const target = new Date(endDate + "T23:59:59").getTime();
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft(""); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return timeLeft;
}

function BannerSlide({ banner }: { banner: Banner }) {
  const timeLeft = useCountdown(banner.end_date);

  const parts: string[] = [banner.title];
  if (banner.description) parts.push(banner.description);
  if (banner.discount_text) parts.push(banner.discount_text);
  const mainText = parts.join(" - ");

  return (
    <div
      className="w-full px-4 py-2 text-center"
      style={{ backgroundColor: banner.bg_color || "#000", color: banner.text_color || "#fff" }}
    >
      <span className="font-semibold tracking-wide text-xs sm:text-sm">
        {mainText}
      </span>
      {timeLeft && (
        <span className="text-xs sm:text-sm font-mono opacity-90 ml-2">
          | Ends in {timeLeft}
        </span>
      )}
    </div>
  );
}

export function SaleBanner() {
  const [banners, setBanners] = useState<Banner[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) setBanners(data.data);
        else setBanners([]);
      })
      .catch(() => setBanners([]));
  }, []);

  const goToNext = useCallback(() => {
    if (!banners || banners.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
      setIsTransitioning(false);
    }, 300);
  }, [banners]);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const id = setInterval(goToNext, 5000);
    return () => clearInterval(id);
  }, [banners, goToNext]);

  if (banners === null || banners.length === 0) return null;

  return (
    <div className="relative z-50 w-full">
      <div
        className="transition-opacity duration-300 ease-in-out"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        <BannerSlide banner={banners[current]} />
      </div>
    </div>
  );
}
