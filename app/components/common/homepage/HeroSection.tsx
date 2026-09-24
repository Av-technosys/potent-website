"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Pause, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface HeroSlide {
  hook: string;
  sub: string;
  cta: { label: string; href: string };
  cta2: { label: string; href: string };
  image: string;
  image2: string;
  alt: string;
  stickers: string[];
  tint: "teal" | "mauve" | "cream";
}

const HERO_SLIDES: HeroSlide[] = [
  {
    hook: "Car sick? Morning sick? Nowhere to go?",
    sub: "Sealable pee and puke bags for the traffic jam, motion sickness on a hill road, pregnancy nausea on a flight, the elder on a long journey. Odour locked in about 60 seconds.",
    cta: { label: "Shop the bags", href: "/product-detail/looway-pee-puke" },
    cta2: { label: "See all Looway", href: "/looway-yatra-kit" },
    image: "/looway/scen-bags-sick.jpg",
    image2: "/products/pukebags.jpg",
    alt: "A teenager in a car using a Looway bag for motion sickness",
    stickers: ["from ₹549", "Pee and vomit"],
    tint: "teal",
  },
  {
    hook: "Periods don’t pause for bad toilets.",
    sub: "Organic pads and a stand-to-pee funnel from the same house, because the problem was never only the period.",
    cta: { label: "Shop bestsellers", href: "/shop" },
    cta2: { label: "Find what I need", href: "/quiz" },
    image: "/products/pads.jpg",
    image2: "/products/funnel.jpg",
    alt: "Ovy organic sanitary pads with the Looway pee funnel",
    stickers: ["from ₹378", "Ships in 24 hrs"],
    tint: "mauve",
  },
  {
    hook: "Squat toilet? Stand up.",
    sub: "The Looway pee funnel. Stand, go, touch nothing, clothes just moved aside. Reusable, with its own carry pouch.",
    cta: { label: "Shop the funnel", href: "/looway-toilet-seat-covers" },
    cta2: { label: "How it works", href: "/looway-toilet-seat-covers" },
    image: "/looway/scen-funnel.jpg",
    image2: "/products/funnel.jpg",
    alt: "A pregnant woman holding the Looway pee funnel beside a clean toilet",
    stickers: ["from ₹299", "Reusable"],
    tint: "teal",
  },
  {
    hook: "Her first period, handled with love.",
    sub: "Two pad sizes so she learns her own flow, a guidebook written for her, and a wrapper that stays silent at school.",
    cta: { label: "Shop teen kits", href: "/menstrual-cup" },
    cta2: { label: "See the First Period Box", href: "/menstrual-cup" },
    image: "/products/teen.jpg",
    image2: "/products/teen-pro.jpg",
    alt: "Ovy Teen Starter Pack",
    stickers: ["Silent wrapper", "Gift-ready"],
    tint: "mauve",
  },
  {
    hook: "Three sizes. One box. Your mix.",
    sub: "Build a 21-pad box across L, XL and XL+, with 4 liners always in, then let Cycle-Sync land it about 5 days before you are due.",
    cta: { label: "Build your box", href: "/shop" },
    cta2: { label: "How Cycle-Sync works", href: "/shop" },
    image: "/products/pads-l.jpg",
    image2: "/products/pads-xlplus.jpg",
    alt: "Ovy organic sanitary pads in L and XL+",
    stickers: ["21 pads, your mix", "Cycle-Sync"],
    tint: "mauve",
  },
  {
    hook: "One cup. Twelve hours. Zero waste.",
    sub: "Medical-grade silicone, up to 12 hours between changes, and a 30-second size finder so you get it right first time.",
    cta: { label: "Shop the cup", href: "/menstrual-cup" },
    cta2: { label: "Find my size", href: "/menstrual-cup" },
    image: "/products/cup-rbw.jpg",
    image2: "/products/cup.jpg",
    alt: "Ovy reusable menstrual cup with its carry pouch",
    stickers: ["from ₹459", "Reusable for years"],
    tint: "teal",
  },
  {
    hook: "Pack for the toilets, not just the trip.",
    sub: "Eleven ready-made Yatra Kits, from Girls’ Trip to Teerth Yatra to Pregnancy. Open one and change what is inside.",
    cta: { label: "Build your Yatra Kit", href: "/looway-yatra-kit" },
    cta2: { label: "See the presets", href: "/looway-yatra-kit" },
    image: "/looway/yatra.jpg",
    image2: "/products/seatcovers.jpg",
    alt: "A mother packing the Looway funnel pouch into a travel bag at a campsite",
    stickers: ["Eleven kits", "Change what is inside"],
    tint: "cream",
  },
];

const TRUST_ITEMS = [
  "Certified toxin-free",
  "Dermatologically tested",
  "pH-balanced and non-irritant",
  "Cruelty-free",
  "Ships within 24 hours",
  "Made in Jaipur, India",
];

const TICKER_ITEMS = [
  "Certified toxin-free",
  "Cycle-Sync delivery",
  "Pee standing up",
  "Made in Jaipur",
  "A pad bought is a pad shared",
  "Free delivery over ₹499",
  "Ships within 24 hours",
];

export function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const slideIntervalMs = 5500;

  const goToSlide = useCallback((n: number) => {
    setActiveIdx(
      ((n % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, slideIntervalMs);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        goToSlide(activeIdx + 1);
      } else {
        goToSlide(activeIdx - 1);
      }
    }
  };

  const slide = HERO_SLIDES[activeIdx];

  // Background tint class generator matching reference project
  const getBgColorClass = (tint: HeroSlide["tint"]) => {
    switch (tint) {
      case "mauve":
        return "bg-[#F7EFF2]";
      case "cream":
        return "bg-[#FAF6EE]";
      case "teal":
      default:
        return "bg-[#E6F4F6]";
    }
  };

  return (
    <section className="relative w-full overflow-hidden transition-colors duration-700">
      {/* Main Hero Container */}
      <div
        className={`w-full px-4 py-7 transition-colors duration-700 sm:px-8 sm:py-12 md:py-16 lg:px-16 ${getBgColorClass(
          slide.tint,
        )}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* 
            MOBILE ORDERING: 
            On Mobile: Image Stage is ORDER 1 (Top). Text Copy is ORDER 2 (Bottom).
            On Desktop (lg:): Text Copy is ORDER 1 (Left), Image Stage is ORDER 2 (Right).
          */}

          {/* Right Stage (Dual Image Cards & Carousel Controls) */}
          <div className="relative order-1 flex w-full items-center justify-center lg:order-2 lg:col-span-5">
            <div className="relative aspect-[1/0.92] w-full max-w-[340px] sm:aspect-[1/1.02] sm:max-w-[420px]">
              {/* Secondary Layered Image Card (Tucked Behind Bottom-Left) */}
              <div className="absolute bottom-[4%] left-0 z-10 aspect-[4/5] w-[38%] -rotate-6 transform overflow-hidden rounded-[18px] border-4 border-white/90 bg-white shadow-lg transition-all duration-500 sm:bottom-[6%] sm:w-[40%] sm:rounded-[22px]">
                <Image
                  src={slide.image2}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 130px, 180px"
                />
              </div>

              {/* Primary Main Image Card (Right Aligned Top) */}
              <div className="absolute top-0 right-0 z-20 aspect-[4/5] w-[74%] overflow-hidden rounded-[24px] border-4 border-white bg-white shadow-2xl transition-all duration-500 sm:w-[78%] sm:rounded-[28px]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority
                  className="object-cover transition-all duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 260px, 480px"
                />
              </div>

              {/* Sticker 1 (Top Right - Pinned Label, rotated) */}
              {slide.stickers[0] && (
                <div className="absolute top-[6%] right-[-2px] z-30 rotate-6 transform rounded-full border border-gray-100 bg-white px-3 py-1.5 text-xs font-extrabold whitespace-nowrap text-[#016271] shadow-md sm:right-[-6px] sm:px-4 sm:py-2 sm:text-sm">
                  {slide.stickers[0]}
                </div>
              )}

              {/* Sticker 2 (Bottom Right - Dark Label, rotated) */}
              {slide.stickers[1] && (
                <div className="absolute right-[4%] bottom-[20%] z-30 -rotate-3 transform rounded-full bg-[#016271] px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-lg sm:right-[6%] sm:bottom-[22%] sm:px-4 sm:py-2 sm:text-sm">
                  {slide.stickers[1]}
                </div>
              )}

              {/* Carousel Controls Bar (Dots & Play/Pause Button) */}
              <div className="absolute right-[2%] bottom-0 z-40 flex items-center gap-2 rounded-full border border-gray-100 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md sm:right-[0%]">
                <div
                  className="flex items-center gap-1.5"
                  role="group"
                  aria-label="Choose slide"
                >
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => goToSlide(idx)}
                      className={`relative h-2.5 rounded-full transition-all duration-300 ${
                        idx === activeIdx
                          ? "w-7 bg-[#016271] sm:w-9"
                          : "w-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                    >
                      {idx === activeIdx && !isPaused && (
                        <span className="absolute inset-0 animate-pulse rounded-full bg-[#016271]" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                  className="ml-1 rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#016271]"
                >
                  {isPaused ? (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Pause className="h-3.5 w-3.5 fill-current" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Left Text Column */}
          <div className="order-2 flex flex-col items-start space-y-5 text-left lg:order-1 lg:col-span-7">
            <Badge className="rounded-full border-none bg-white/95 px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-[#1A8D91] uppercase shadow-xs backdrop-blur-xs sm:text-xs">
              INDIA’S FIRST SCENARIO-BASED HYGIENE BRAND
            </Badge>

            <div className="flex min-h-[170px] flex-col justify-center space-y-3 sm:min-h-[160px]">
              <h1 className="font-serif text-[32px] leading-[1.14] font-bold tracking-tight text-gray-900 transition-all duration-500 sm:text-4xl lg:text-[52px]">
                {slide.hook}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed font-normal text-gray-600 sm:text-lg">
                {slide.sub}
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 pt-2 sm:w-auto">
              <Link href={slide.cta.href} className="w-full sm:w-auto">
                <Button className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#016271] px-7 py-6 text-base font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-[#137688] sm:w-auto">
                  {slide.cta.label}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href={slide.cta2.href} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex min-h-[48px] w-full items-center justify-center rounded-full border-[#016271] px-7 py-6 text-base font-semibold text-[#016271] transition-all hover:bg-[#016271]/10 sm:w-auto"
                >
                  {slide.cta2.label}
                </Button>
              </Link>
            </div>

            <p className="pt-1 text-xs font-medium text-gray-500 sm:text-sm">
              Woman-founded. Made in Jaipur. Live on Amazon.in.
            </p>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Marquee Ticker Strip */}
      <div className="w-full overflow-hidden bg-[#016271] py-3 text-white shadow-inner">
        <div className="animate-marquee flex items-center space-x-8 text-sm font-medium tracking-wide whitespace-nowrap sm:text-base">
          {TICKER_ITEMS.concat(TICKER_ITEMS, TICKER_ITEMS).map((item, idx) => (
            <div key={idx} className="flex shrink-0 items-center space-x-3">
              <span className="font-semibold">{item}</span>
              <span className="text-teal-200">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Items Strip */}
      <div className="w-full border-b border-gray-100 bg-white px-4 py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-gray-600 sm:text-sm">
          {TRUST_ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-1.5">
              <Check className="h-4 w-4 shrink-0 text-[#016271]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
