/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Check } from "lucide-react";

type Review = {
  id: number;
  name: string;
  city: string;
  group: string;
  stage: string;
  stars: number;
  quote: string;
};

const REVIEWS_DATA: Review[] = [
  {
    id: 1,
    name: "Meena Iyer",
    city: "Chennai",
    group: "seniors",
    stage: "Senior traveller",
    stars: 5,
    quote:
      "At 68 my knees can't take squatting and I won't sit on a public seat. This gave me back the confidence to travel with my daughters. Practising once at home first made it easy.",
  },
  {
    id: 2,
    name: "Kavya Rawat",
    city: "Dehradun",
    group: "travellers",
    stage: "Trekker",
    stars: 4,
    quote:
      "Took it on a four-day trek — no more wandering off looking for a private bush. Takes a couple of goes to trust the seal, so definitely practise at home first, but then it's brilliant.",
  },
  {
    id: 3,
    name: "Sneha Kulkarni",
    city: "Bengaluru",
    group: "travellers",
    stage: "Daily commuter",
    stars: 5,
    quote:
      "Our office washroom at peak hours is grim. Now I stand, go, and I'm back at my desk without a second thought. Slips into my handbag pouch and no one's any wiser.",
  },
  {
    id: 4,
    name: "Lakshmi Menon",
    city: "Kochi",
    group: "joint",
    stage: "Arthritis",
    stars: 5,
    quote:
      "My knees won't let me squat any more and I refuse to sit on public toilets. This has genuinely given me my freedom back — I stand, I go, and I've stopped planning my whole day around finding a clean bathroom.",
  },
  {
    id: 5,
    name: "Divya Nair",
    city: "Ahmedabad",
    group: "mums",
    stage: "Mum-to-be",
    stars: 5,
    quote:
      "Third-trimester travel and a tiny bladder do not mix. This has been the one thing that made long drives bearable. Soft, comfortable, and completely safe to use externally.",
  },
  {
    id: 6,
    name: "Ritu Sharma",
    city: "Delhi",
    group: "travellers",
    stage: "Festival-goer",
    stars: 4,
    quote:
      "Sunburn festival, thirty women in the loo queue, and I just walked past all of them. Total game-changer. Took me one practice run at home to get the angle right — worth it.",
  },
  {
    id: 7,
    name: "Fatima Sheikh",
    city: "Hyderabad",
    group: "seniors",
    stage: "Caring for mum",
    stars: 5,
    quote:
      "I bought it for my mother who can't lower onto low toilets any more. It's given her independence on outings again — she calls it her little freedom. Reusable and easy to wash.",
  },
  {
    id: 8,
    name: "Nisha Reddy",
    city: "Hyderabad",
    group: "travellers",
    stage: "Road-tripper",
    stars: 5,
    quote:
      "I was sceptical it wouldn't leak, but after two tries in the bathroom I was completely sold. Now it lives in my car door. Every woman who drives long distances should own one.",
  },
  {
    id: 9,
    name: "Ananya Bose",
    city: "Kolkata",
    group: "travellers",
    stage: "Still practising",
    stars: 3,
    quote:
      "Honest review: it took me four or five goes at home before I stopped leaking a little, so there's a real learning curve — practise before you rely on it. Once the angle clicks it does work, but three stars because it isn't foolproof on day one.",
  },
];

const FILTERS = [
  { id: "all", label: "All reviews" },
  { id: "s5", label: "5★" },
  { id: "s4", label: "4★" },
  { id: "travellers", label: "Travellers" },
  { id: "joint", label: "Joint pain" },
  { id: "mums", label: "Mums-to-be" },
  { id: "seniors", label: "Seniors" },
];

const STAR_BREAKDOWN = [
  { stars: 5, count: 104, pct: "86%" },
  { stars: 4, count: 12, pct: "10%" },
  { stars: 3, count: 3, pct: "2.5%" },
  { stars: 2, count: 1, pct: "1%" },
  { stars: 1, count: 1, pct: "1%" },
];

export default function FunnelReviewsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredReviews = REVIEWS_DATA.filter((rev) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "s5") return rev.stars === 5;
    if (activeFilter === "s4") return rev.stars === 4;
    return rev.group === activeFilter;
  });

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section id="reviews" className="w-full bg-[#fcf8f3] scroll-mt-32 sm:scroll-mt-36 py-12 sm:py-18 lg:py-22 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10 max-w-3xl">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2">
            WHAT TRAVELLERS SAY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight">
            Loved on every journey
          </h2>
        </div>

        {/* Rating Breakdown Top Summary Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#f8dce8] bg-[#FAF1E6]/50 p-5 sm:p-8 md:p-10 shadow-2xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Score Summary */}
            <div className="md:col-span-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#f8dce8] pb-6 md:pb-0 md:pr-8">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl sm:text-6xl font-extrabold text-[#5A0E30]">
                    4.8
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-[#2A1620]/50">
                    / 5
                  </span>
                </div>

                <div className="flex flex-col items-end md:items-start">
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-[#F4C430] my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#F4C430]" />
                    ))}
                  </div>

                  <div className="text-xs font-semibold text-[#2A1620]/70">
                    <strong className="text-[#5A0E30] font-bold">121</strong> verified reviews
                  </div>
                </div>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D]">
                <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                <span>Every review from a verified purchase</span>
              </div>
            </div>

            {/* Right Rating Breakdown Bars */}
            <div className="md:col-span-7">
              <div className="text-xs font-bold text-[#5A0E30] mb-3">
                Rating breakdown <span className="font-normal text-[#2A1620]/60">• tap a row to filter</span>
              </div>

              <div className="space-y-2 text-xs font-semibold">
                {STAR_BREAKDOWN.map((row) => (
                  <button
                    key={row.stars}
                    onClick={() =>
                      setActiveFilter(row.stars === 5 ? "s5" : row.stars === 4 ? "s4" : "all")
                    }
                    className="flex w-full items-center gap-3 group text-left rounded-lg p-1 transition-colors hover:bg-white/60 cursor-pointer"
                  >
                    <span className="w-6 font-bold text-[#5A0E30] shrink-0">
                      {row.stars} ★
                    </span>
                    <div className="h-3 flex-1 rounded-full bg-[#f8dce8]/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F4C430] transition-all duration-500"
                        style={{ width: row.pct }}
                      />
                    </div>
                    <span className="w-8 text-right text-[#2A1620]/70 font-bold shrink-0">
                      {row.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === f.id
                  ? "bg-[#a81a57] text-white shadow-xs"
                  : "bg-white text-[#2A1620]/80 border border-[#f8dce8] hover:border-[#a81a57]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews Carousel Slider */}
        <div className="relative">
          {/* Scroll Nav Arrow Left */}
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 -left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#a81a57] shadow-md border border-[#f8dce8] hover:scale-105 transition-all cursor-pointer"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Scroll Nav Arrow Right */}
          <button
            onClick={scrollRight}
            className="absolute top-1/2 -right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#a81a57] shadow-md border border-[#f8dce8] hover:scale-105 transition-all cursor-pointer"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-1 no-scrollbar scroll-smooth"
          >
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="w-[82vw] max-w-[320px] sm:w-[350px] shrink-0 snap-start rounded-2xl sm:rounded-3xl border border-[#f8dce8] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center text-[#F4C430] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rev.stars
                            ? "fill-[#F4C430] text-[#F4C430]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#2A1620] leading-relaxed font-normal">
                    {rev.quote}
                  </p>
                </div>

                {/* Footer User Info */}
                <div className="mt-6 border-t border-[#f8dce8]/80 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fdeef4] font-bold text-[#a81a57] text-sm">
                      {rev.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-[#5A0E30] truncate">
                        {rev.name}
                      </div>
                      <div className="text-[11px] text-[#2A1620]/60 font-medium">
                        {rev.city}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#fdeef4] px-2.5 py-0.5 text-[10.5px] font-bold text-[#a81a57]">
                      {rev.stage}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D]">
                      <Check className="h-3 w-3 stroke-[3]" /> Verified purchase
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
