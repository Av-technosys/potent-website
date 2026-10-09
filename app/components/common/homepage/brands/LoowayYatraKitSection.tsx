"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface KitCardData {
  id?: string;
  kicker: string;
  title: string;
  contents: string;
  isDark?: boolean;
  isYellow?: boolean;
}

const KITS_DATA: KitCardData[] = [
  {
    id: "complete",
    kicker: "EVERY SITUATION",
    title: "Complete",
    contents: "Seat covers · Pee and puke bags · Pee funnel for her",
    isDark: true,
  },
  {
    id: "solo",
    kicker: "SOLO, SHORT TRIP",
    title: "Weekender",
    contents: "Seat covers · Pee and puke bags",
  },
  {
    id: "family",
    kicker: "GROUP, LONG TRIP",
    title: "Family",
    contents: "2 seat-cover boxes · 2 packs of bags · Pee funnel for her",
  },
  {
    id: "girls",
    kicker: "GIRLS ONLY",
    title: "Girls’ Trip",
    contents: "2 seat-cover boxes · Pee funnel · Ovy period care",
  },
  {
    id: "boys",
    kicker: "MATES’ GETAWAY",
    title: "Boys’ Trip",
    contents: "Seat covers · 2 packs of bags",
  },
  {
    id: "teerth",
    kicker: "PILGRIMAGES",
    title: "Teerth Yatra",
    contents: "2 seat-cover boxes · Pee funnel for her · Pee and puke bags",
  },
  {
    id: "preg",
    kicker: "MUMS-TO-BE",
    title: "Pregnancy Travel",
    contents: "Seat covers · Pee funnel · Pee and puke bags · Ovy period care",
  },
  {
    id: "toddler",
    kicker: "WITH LITTLE ONES",
    title: "Toddler Travel",
    contents: "2 seat-cover boxes · Pee and puke bags",
  },
  {
    id: "working",
    kicker: "OFFICE AND COMMUTES",
    title: "Working Woman",
    contents: "Seat covers · Ovy period care",
  },
  {
    id: "sports",
    kicker: "TREKS AND OUTDOORS",
    title: "Sports & Adventure",
    contents: "Seat covers · Pee funnel for her · 2 packs of bags",
  },
  {
    id: "carekit",
    kicker: "HOSPITAL AND CAREGIVING",
    title: "Care & Recovery",
    contents: "2 seat-cover boxes · 2 packs of bags",
  },
  {
    id: "builder",
    kicker: "ANY TRIP",
    title: "Make it yours",
    contents:
      "Open any kit, then add or remove what you like. At least two different items; Ovy period care can go in too.",
    isYellow: true,
  },
];

export function LoowayYatraKitSection() {
  return (
    <section className="w-full overflow-hidden bg-[#EBF7F8] pt-0 pb-16 md:pb-24">
      {/* Top Alternating Teal & Yellow Pattern Strap */}
      <div
        className="mb-10 h-3 w-full border-b border-teal-900/10"
        style={{
          background:
            "repeating-linear-gradient(90deg, #004851 0 12px, #F6D353 12px 24px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Row: Title & Subtitle (Left) + 3 Overlapping Cards Visual (Right) */}
        <div className="mb-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left: Text & Action Button */}
          <div className="lg:col-span-7">
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-[#006573] uppercase">
              LOOWAY YATRA KIT
            </span>
            <h2 className="mb-2 font-serif text-[27px] leading-[29.16px] font-semibold text-[#1A150F] sm:text-[46px] sm:leading-[49.68px]">
              Eleven ready-made kits.
            </h2>
            <div className="mb-4">
              <span className="relative inline-block leading-tight">
                <span className="absolute inset-x-0 bottom-1 h-[38%] bg-[#F6D353] sm:bottom-2" />
                <span className="relative font-serif text-2xl font-bold text-[#004851] sm:text-4xl lg:text-5xl">
                  Open one. Make it yours.
                </span>
              </span>
            </div>
            <p className="mb-6 max-w-xl text-xs leading-relaxed font-normal text-[#4C6467] sm:text-base">
              Each kit is built for the toilets one kind of trip throws at you.
              Tap one open, change anything inside, and pay only for what you
              pack. Ten pH-balanced intimate wipes come free with every kit.
            </p>

            <div>
              <Link
                href="/looway-yatra-kit"
                className="inline-flex items-center gap-2 rounded-full bg-[#004851] px-7 py-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#00373e] sm:text-sm"
              >
                <span>Build your Yatra Kit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: 3 Overlapping Cards Graphic with Beaded Frames (Hidden on Mobile) */}
          <div className="hidden justify-center lg:col-span-5 lg:flex lg:justify-end">
            <div className="relative flex items-center justify-center p-6">
              <div className="absolute inset-0 scale-90 transform rounded-full bg-teal-200/40 blur-3xl" />

              {/* Stacked Cards */}
              <div className="relative flex items-center justify-center -space-x-3 ">
                {/* Left Tilted Card */}
                <div className="relative h-36 w-24 -rotate-12 transform rounded-2xl bg-[#004851] p-1.5 shadow-lg transition-transform hover:rotate-0 sm:h-44 sm:w-32">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full p-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="calc(100% - 4px)"
                      height="calc(100% - 4px)"
                      rx="12"
                      fill="none"
                      stroke="#F6D353"
                      strokeWidth="3"
                      strokeDasharray="0 8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-white p-1">
                    <Image
                      src="/products/seatcovers.jpg"
                      alt="Seat covers"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Center Featured Card */}
                <div className="relative z-10 h-40 w-28 scale-105 transform rounded-2xl bg-[#C02670] p-1.5 shadow-xl transition-transform hover:scale-110 sm:h-48 sm:w-36">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full p-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="calc(100% - 4px)"
                      height="calc(100% - 4px)"
                      rx="12"
                      fill="none"
                      stroke="#F6D353"
                      strokeWidth="3"
                      strokeDasharray="0 8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-white p-1">
                    <Image
                      src="/products/funnel.jpg"
                      alt="Pee funnel"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Right Tilted Card */}
                <div className="relative h-36 w-24 rotate-12 transform rounded-2xl bg-[#1E5E41] p-1.5 shadow-lg transition-transform hover:rotate-0 sm:h-44 sm:w-32">
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full p-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="calc(100% - 4px)"
                      height="calc(100% - 4px)"
                      rx="12"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      strokeDasharray="0 8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-white p-1">
                    <Image
                      src="/products/pukebags.jpg"
                      alt="Pee and puke bags"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 12 Kits Grid (2 Columns on Mobile - showing 7 cards, 4 Columns on Desktop - showing 12 cards) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {KITS_DATA.map((kit, idx) => {
            const tiltDirection =
              idx % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1";

            if (kit.isDark) {
              return (
                <div
                  key={idx}
                  className={`group flex transform flex-col justify-between rounded-2xl bg-[#004851] p-3.5 text-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] sm:p-6 ${tiltDirection} min-h-[180px] sm:min-h-[220px] cursor-pointer hover:shadow-xl`}
                >
                  <div>
                    <span className="mb-1 block text-[9px] font-bold tracking-wider text-teal-200 uppercase sm:text-[10px] sm:tracking-widest">
                      {kit.kicker}
                    </span>
                    <h3 className="mb-1.5 font-serif text-base font-bold leading-tight text-white sm:mb-2 sm:text-xl">
                      {kit.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed font-normal text-white/85 sm:text-xs">
                      {kit.contents}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1 border-t border-white/10 pt-3 sm:mt-4 sm:space-y-1.5 sm:pt-4">
                    <div className="text-[10px] font-bold text-[#F6D353] sm:text-xs">
                      + 10 free intimate wipes
                    </div>
                    <Link
                      href={kit.id ? `/looway-yatra-kit?kit=${kit.id}#choose-kit` : "/looway-yatra-kit#choose-kit"}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-white group-hover:underline sm:text-xs"
                    >
                      <span>See it in the builder</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1.5 sm:h-3.5 sm:w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            }

            if (kit.isYellow) {
              return (
                <div
                  key={idx}
                  className={`group col-span-2 flex transform flex-col justify-between rounded-2xl bg-[#F6D353] p-4 text-[#004851] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] sm:p-6 lg:col-span-1 ${tiltDirection} min-h-[150px] sm:min-h-[220px] cursor-pointer border border-yellow-300 hover:shadow-xl`}
                >
                  <div>
                    <span className="mb-1 block text-[9px] font-bold tracking-wider uppercase opacity-80 sm:text-[10px] sm:tracking-widest">
                      {kit.kicker}
                    </span>
                    <h3 className="mb-1.5 font-serif text-base font-bold leading-tight sm:mb-2 sm:text-xl">
                      {kit.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed font-normal text-[#004851]/90 sm:text-xs">
                      {kit.contents}
                    </p>
                  </div>

                  <div className="mt-3 border-t border-black/10 pt-3 sm:mt-4 sm:pt-4">
                    <Link
                      href={kit.id ? `/looway-yatra-kit?kit=${kit.id}#choose-kit` : "/looway-yatra-kit#choose-kit"}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004851] group-hover:underline sm:text-xs"
                    >
                      <span>Open the builder</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1.5 sm:h-3.5 sm:w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            }

            const isExtraOnMobile = idx >= 6;

            return (
              <div
                key={idx}
                className={`${isExtraOnMobile ? "hidden sm:flex" : "flex"} group transform flex-col justify-between rounded-2xl border border-teal-100/80 bg-white p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] sm:p-6 ${tiltDirection} min-h-[180px] sm:min-h-[220px] cursor-pointer hover:shadow-xl`}
              >
                <div>
                  <span className="mb-1 block text-[9px] font-bold tracking-wider text-gray-400 uppercase sm:text-[10px] sm:tracking-widest">
                    {kit.kicker}
                  </span>
                  <h3 className="mb-1.5 font-serif text-base font-bold leading-tight text-[#1F1915] sm:mb-2 sm:text-xl">
                    {kit.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed font-normal text-[#5C7275] sm:text-xs">
                    {kit.contents}
                  </p>
                </div>

                <div className="mt-3 space-y-1 border-t border-gray-100 pt-3 sm:mt-4 sm:space-y-1.5 sm:pt-4">
                  <div className="text-[10px] font-bold text-emerald-600 sm:text-xs">
                    + 10 free intimate wipes
                  </div>
                  <Link
                    href={kit.id ? `/looway-yatra-kit?kit=${kit.id}#choose-kit` : "/looway-yatra-kit#choose-kit"}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004851] group-hover:underline sm:text-xs"
                  >
                    <span>See it in the builder</span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1.5 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
