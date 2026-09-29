"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PeriodSchoolArticle {
  title: string;
  desc: string;
}

const SCHOOL_ARTICLES: PeriodSchoolArticle[] = [
  {
    title: "How often should I change a pad?",
    desc: "Every 4 to 6 hours in the day, sooner if it feels damp. Up to about 8 hours overnight with an XL or XL+. Trapped moisture, not the pad, is what causes irritation.",
  },
  {
    title: "Why do night leaks happen at the back?",
    desc: "Lying down sends flow backwards, not down. The XL+ answers that with 320mm of length and a widened rear panel.",
  },
  {
    title: "How much blood is it, really?",
    desc: "A whole period is about 3 to 5 tablespoons spread over several days. It looks like far more than it is.",
  },
  {
    title: "Is a 28-day cycle the only normal?",
    desc: "No. Adults run 21 to 35 days; teens in their first year or two, about 21 to 45. Stress, travel and sleep shift it too.",
  },
  {
    title: "Liner or pad?",
    desc: "If it is your period, it is a pad. For everything in between, discharge, spotting, light leaks, it is a liner.",
  },
  {
    title: "Can a cup get lost inside me?",
    desc: "No. Your cervix closes off the top. Relax, bear down gently, pinch the base, and it comes down within reach.",
  },
];

const TICKER_ITEMS = [
  "One brand for life",
  "Potent Hygiene",
  "Where your wellness comes first",
  "Made in Jaipur",
  "Built for Indian bodies, Indian toilets, Indian journeys",
];

export function OvyPeriodSchool() {
  const repeatedItems = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];

  return (
    <section className="hidden md:block w-full bg-[#FAF5E8] overflow-hidden">
      
      {/* Top Thicker Infinite Looping Ticker Strap (No Bottom Border, Slower Speed) */}
      <div className="w-full bg-[#FAF5E8] py-4.5 border-t border-[#EBE0D3] overflow-hidden">
        <div
          className="animate-marquee flex items-center space-x-8 whitespace-nowrap font-serif text-sm sm:text-base font-medium text-[#602E55] w-max"
          style={{ animationDuration: "38s" }}
        >
          {repeatedItems.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-8 shrink-0">
              <span>{item}</span>
              <span className="text-xs sm:text-sm text-[#8C4F7C] font-bold">
                +
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Header Row: Title & Subtitle (Left) + 'Read the journal' Button (Right) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold tracking-widest text-[#602E55] uppercase block mb-1.5">
              OVY PERIOD SCHOOL
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1915] leading-tight">
              The stuff nobody explains properly.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#5C524D] leading-relaxed font-normal">
              Straight answers on the cycle, the body and the products, reviewed by a gynaecologist and written in plain words.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/blogs"
              className="border border-[#602E55] text-[#602E55] bg-white/60 hover:bg-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <span>Read the journal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Content Layout: 6 Q&A Cards (Left) + Sleeping Model Photo (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 6 Article / Q&A Cards Grid (2 Columns on Web, Stacked on Mobile) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {SCHOOL_ARTICLES.map((article, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/50 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-start"
              >
                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1F1915] mb-1.5 leading-snug">
                  {article.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#5C524D] leading-relaxed font-normal">
                  {article.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Sleeping Model Photo in Purple Beaded Frame */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm aspect-3/4">
              <div
                className="relative h-full w-full rounded-3xl p-3.5 shadow-sm border border-purple-200/50"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                {/* SVG Purple Beaded Frame Ring */}
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="6"
                    width="calc(100% - 12px)"
                    height="calc(100% - 12px)"
                    rx="22"
                    fill="none"
                    stroke="#602E55"
                    strokeWidth="6"
                    strokeDasharray="0 14"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/ovy/m2-nights.jpg"
                    alt="Ovy Period School Night Comfort"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
