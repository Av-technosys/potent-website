"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const MARQUEE_ITEMS = [
  "4 liners in every box",
  "Cycle-Sync delivery",
  "Dermatologically tested",
  "Clinically tested on 24 volunteers",
  "Certified toxin-free",
  "Rash-free",
  "pH-balanced",
  "Non-irritant to IS 4011:2018",
  "Cruelty-free",
];

export function OvyHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#efe9d9] pt-6 pb-0 sm:pt-12 md:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* 1. VISUAL IMAGES CONTAINER (Order 1 on Mobile < lg, Order 2 on Desktop lg:) */}
          <div className="order-1 flex items-center justify-center pt-2 pb-6 lg:order-2 lg:col-span-6 lg:py-12">
     <div className="relative flex w-full items-center justify-center gap-1 sm:gap-0 px-1 sm:px-0">
              
              {/* Card 1: Left Tilted (Teen kits) */}
              <Link
                href="/product-detail/ovy-teen"
                className="group/card relative z-10 w-[32%] shrink-0 -rotate-3 transform cursor-pointer transition-all duration-300 ease-out hover:z-40 hover:rotate-0 hover:scale-110 sm:w-56 sm:-mr-12 lg:-mr-16 lg:w-60 lg:-rotate-12 block"
              >
                <div
                  className="relative overflow-hidden rounded-[1.6rem] p-2 shadow-xl transition-all duration-300 group-hover/card:shadow-purple-300/50 sm:rounded-[2.2rem] sm:p-4"
                  style={{ backgroundColor: "#8C4F7C" }}
                >
                  {/* SVG Beaded Border Ring (White Dots along the frame) */}
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none p-0.5 sm:p-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="calc(100% - 6px)"
                      height="calc(100% - 6px)"
                      rx="22"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeDasharray="0 14"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-purple-50 z-10 sm:rounded-2xl">
                    <Image
                      src="/products/teen.jpg"
                      alt="Teen kits"
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 768px) 150px, 320px"
                    />
                  </div>
                </div>

                <div className="-mt-3.5 text-center relative z-30 sm:-mt-5">
                  <div className="inline-block rounded-xl bg-white px-2 py-1 shadow-md border border-gray-100/80 transition-transform group-hover/card:scale-105 sm:rounded-2xl sm:px-5 sm:py-2.5">
                    <div className="text-[9px] font-bold tracking-tight text-[#5C524D] sm:text-xs">Teen kits</div>
                    <div className="font-serif text-[11px] font-extrabold text-[#8C4F7C] sm:text-base leading-tight mt-0.5">₹378</div>
                  </div>
                </div>
              </Link>

              {/* Card 2: Center Prominent (Pads, 3 sizes) */}
              <Link
                href="/shop"
                className="group/card relative z-20 w-[36%] shrink-0 scale-105 transform cursor-pointer transition-all duration-300 ease-out hover:z-40 hover:rotate-0 hover:scale-115 sm:w-64 lg:w-60 block -mt-4 sm:-mt-20"
              >
                <div
                  className="relative overflow-hidden rounded-[1.8rem] p-2.5 shadow-2xl transition-all duration-300 group-hover/card:shadow-purple-900/50 sm:rounded-[2.5rem] sm:p-5"
                  style={{ backgroundColor: "#592751" }}
                >
                  {/* SVG Beaded Border Ring (White Dots along the frame) */}
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none p-1 sm:p-1.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="calc(100% - 8px)"
                      height="calc(100% - 8px)"
                      rx="26"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="6"
                      strokeDasharray="0 16"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-purple-50 z-10 sm:rounded-2xl">
                    <Image
                      src="/products/pads-l.jpg"
                      alt="Pads, 3 sizes"
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 768px) 180px, 400px"
                    />
                  </div>
                </div>

                <div className="-mt-4 text-center relative z-30 sm:-mt-6">
                  <div className="inline-block rounded-xl bg-white px-2.5 py-1 shadow-lg border border-gray-100/80 transition-transform group-hover/card:scale-105 sm:rounded-2xl sm:px-7 sm:py-3">
                    <div className="text-[9.5px] font-bold tracking-tight text-[#5C524D] sm:text-sm">Pads, 3 sizes</div>
                    <div className="font-serif text-xs font-extrabold text-[#592751] sm:text-xl leading-tight mt-0.5">from ₹378</div>
                  </div>
                </div>
              </Link>

              {/* Card 3: Right Tilted (Menstrual cup) */}
              <Link
                href="/product-detail/ovy-cup"
                className="group/card relative z-10 w-[32%] shrink-0 rotate-3 transform cursor-pointer transition-all duration-300 ease-out hover:z-40 hover:rotate-0 hover:scale-110 sm:w-56 sm:-ml-12 lg:-ml-16 lg:w-60 lg:rotate-12 block"
              >
                <div
                  className="relative overflow-hidden rounded-[1.6rem] p-2 shadow-xl transition-all duration-300 group-hover/card:shadow-pink-300/50 sm:rounded-[2.2rem] sm:p-4"
                  style={{ backgroundColor: "#C42B5B" }}
                >
                  {/* SVG Beaded Border Ring (White Dots along the frame) */}
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none p-0.5 sm:p-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="calc(100% - 6px)"
                      height="calc(100% - 6px)"
                      rx="22"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeDasharray="0 14"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-purple-50 z-10 sm:rounded-2xl">
                    <Image
                      src="/products/cup-rbw.jpg"
                      alt="Menstrual cup"
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 768px) 150px, 320px"
                    />
                  </div>
                </div>

                <div className="-mt-3.5 text-center relative z-30 sm:-mt-5">
                  <div className="inline-block rounded-xl bg-white px-2 py-1 shadow-md border border-gray-100/80 transition-transform group-hover/card:scale-105 sm:rounded-2xl sm:px-5 sm:py-2.5">
                    <div className="text-[9px] font-bold tracking-tight text-[#5C524D] sm:text-xs">Menstrual cup</div>
                    <div className="font-serif text-[11px] font-extrabold text-[#C42B5B] sm:text-base leading-tight mt-0.5">₹459</div>
                  </div>
                </div>
              </Link>

            </div>
          </div>

          {/* 2. LEFT TEXT CONTENT (Order 2 on Mobile < lg, Order 1 on Desktop lg:) */}
          <div className="order-2 flex flex-col text-left lg:order-1 lg:col-span-6">
            {/* Top Badge */}
            <div className="mb-4">
              <span className="inline-block rounded-full border border-gray-200/80 bg-white/95 px-4 py-1.5 text-[10px] font-bold tracking-widest text-[#016271] uppercase shadow-2xs sm:text-xs">
                OVY BY POTENT HYGIENE
              </span>
            </div>

            {/* Main Heading */}
     <h1 className="mb-4 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl tracking-tight">
              <span className="block text-[#602E55] leading-[1.16] sm:leading-[0.92]">Heavy night?</span>
              <span className="block text-[#C42B5B] leading-[1.16] sm:leading-[0.92]">First period?</span>
              <span className="block text-[#1B6A85] leading-[1.16] sm:leading-[0.92] mb-3 sm:mb-4">Swim day?</span>
              
              {/* Updated Ovy Box */}
              <span className="inline-block mt-2 transform -rotate-2 rounded-2xl bg-[#DBC4F0] py-3 pl-5 pr-28 sm:py-4 sm:pl-6 sm:pr-40 shadow-sm">
                <span className="block font-serif text-2xl font-black italic text-[#603356] leading-[1.1] tracking-normal sm:text-3xl lg:text-5xl">
                  There’s an
                </span>
                <span className="block font-serif text-2xl font-black italic text-[#603356] leading-[1.1] tracking-normal sm:text-3xl lg:text-5xl">
                  Ovy for that.
                </span>
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="my-4 max-w-xl text-xs leading-relaxed font-normal text-[#5C524D] sm:text-base">
              Organic pads in three lengths, teen kits written for her first
              period, a cup that lasts years and liners for the days in
              between. Dermatologically tested on 24 volunteers.
            </p>

            {/* Action Buttons */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/shop"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#602E55] px-7 py-3.5 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#4E2445] sm:text-sm"
              >
                <span>Shop the range</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#shop-by"
                className="flex cursor-pointer items-center justify-center rounded-full border border-[#602E55] bg-[#FAF3EB] px-7 py-3.5 text-xs font-semibold text-[#602E55] shadow-2xs transition-all hover:bg-white sm:text-sm"
              >
                What does today look like?
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5C524D]">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#016271] stroke-[2.5]" /> Ships within 24 hours
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#016271] stroke-[2.5]" /> Free delivery over ₹499
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#016271] stroke-[2.5]" /> Made in Jaipur
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM MARQUEE TICKER STRIP WITH LIGHT LAVENDER DOTTED STRIP & PURPLE MARQUEE BAR */}
      <div className="mt-8 w-full sm:mt-12">
        {/* Top Lavender Dotted Strip */}
        <div className="w-full h-5 bg-[#D6C5F7] flex items-center overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='4' fill='%23602E55'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Main Dark Purple Marquee Bar */}
        <div className="w-full bg-[#602E55] py-3.5 text-white shadow-inner">
          <div className="animate-marquee flex items-center space-x-8 font-serif text-sm tracking-wide whitespace-nowrap">
            {MARQUEE_ITEMS.concat(MARQUEE_ITEMS, MARQUEE_ITEMS).map(
              (item, idx) => (
                <div key={idx} className="flex shrink-0 items-center space-x-4">
                  <span className="font-serif font-medium text-white">{item}</span>
                  <span className="text-[#D6C5F7] text-xs">✦</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
