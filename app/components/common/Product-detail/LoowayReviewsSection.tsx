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
    name: "Divya Nair",
    city: "Ahmedabad",
    group: "families",
    stage: "Parent",
    stars: 5,
    quote:
      "Potty-training a toddler plus highway travel used to be a disaster, until these. Open, done, sealed. No more roadside emergencies.",
  },
  {
    id: 2,
    name: "Arjun Pillai",
    city: "Kochi",
    group: "travellers",
    stage: "Traveller",
    stars: 4,
    quote:
      "Night bus with a broken toilet, and this saved the whole trip. Solidifies fast and truly no odour. Would love a slightly wider opening.",
  },
  {
    id: 3,
    name: "Fatima Sheikh",
    city: "Hyderabad",
    group: "caregivers",
    stage: "Caregiver",
    stars: 5,
    quote:
      "For my mother who uses a wheelchair, this means independence on outings. Leak-proof and dignified. We reorder every single month now.",
  },
  {
    id: 4,
    name: "Prakash Verma",
    city: "Nagpur",
    group: "seniors",
    stage: "Senior traveller",
    stars: 5,
    quote:
      "At 72, long bus journeys were stressful. This is discreet, clean and simple. The picture guide made it easy the very first time.",
  },
  {
    id: 5,
    name: "Karan Malhotra",
    city: "Delhi",
    group: "travellers",
    stage: "Road-tripper",
    stars: 5,
    quote:
      "Delhi traffic is unpredictable. Stuck for 2 hours once, and this was the difference between misery and a non-event. Keep one in the car, always.",
  },
  {
    id: 6,
    name: "Sneha Kulkarni",
    city: "Bengaluru",
    group: "families",
    stage: "Expecting mum",
    stars: 5,
    quote:
      "Pregnancy meant sudden nausea and constant loo trips on my commute. Having these in my bag took away so much anxiety. Completely comfortable to use.",
  },
  {
    id: 7,
    name: "Ritika Shah",
    city: "Surat",
    group: "travellers",
    stage: "First-timer",
    stars: 3,
    quote:
      "It genuinely works, but the first time in a moving car I fumbled the seal and there was a small spill. By the third use I had the hang of it.",
  },
  {
    id: 8,
    name: "Sandeep Rao",
    city: "Visakhapatnam",
    group: "travellers",
    stage: "Bus commuter",
    stars: 2,
    quote:
      "Needed a few goes to get comfortable, and I found the opening a little narrow for me. The team did email me the picture guide and were helpful.",
  },
  {
    id: 9,
    name: "Neha Joshi",
    city: "Indore",
    group: "families",
    stage: "Motion-sick traveller",
    stars: 1,
    quote:
      "With bad motion sickness I couldn't manage a bag in a lurching bus. Support replied fast with tips and a partial credit — great customer service.",
  },
];

const FILTERS = [
  { id: "all", label: "All reviews" },
  { id: "s5", label: "5★" },
  { id: "s4", label: "4★" },
  { id: "families", label: "Families" },
  { id: "travellers", label: "Travellers" },
  { id: "caregivers", label: "Caregivers" },
  { id: "seniors", label: "Seniors" },
];

const STAR_BREAKDOWN = [
  { stars: 5, count: 92, pct: "85%" },
  { stars: 4, count: 11, pct: "10%" },
  { stars: 3, count: 3, pct: "3%" },
  { stars: 2, count: 1, pct: "1%" },
  { stars: 1, count: 1, pct: "1%" },
];

export default function LoowayReviewsSection() {
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
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section id="reviews" className="w-full bg-[#FBF8F1] scroll-mt-32 sm:scroll-mt-36 py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <span className="text-[10.5px] sm:text-xs font-extrabold tracking-widest text-[#0E5C3A] uppercase block mb-1.5 sm:mb-2">
            WHAT TRAVELLERS SAY
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0A4A2E] leading-tight">
            Loved on every journey
          </h2>
        </div>

        {/* Rating Breakdown Top Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#E4DED0] bg-[#FAF6F0] p-4 sm:p-8 md:p-10 shadow-2xs mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center">
            {/* Left Score Summary */}
            <div className="md:col-span-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#E4DED0]/70 pb-4 md:pb-0 md:pr-8">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-6xl font-extrabold text-[#0A4A2E]">
                    4.8
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-[#17271E]/50">
                    / 5
                  </span>
                </div>

                <div className="flex flex-col items-end md:items-start">
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-[#D99B00] my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#D99B00]" />
                    ))}
                  </div>

                  <div className="text-[11px] sm:text-xs font-semibold text-[#17271E]/70">
                    Based on <strong className="text-[#0A4A2E]">108</strong> verified reviews
                  </div>
                </div>
              </div>

              <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0E5C3A]">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0E5C3A]" />
                <span>Every review from a verified purchase</span>
              </div>
            </div>

            {/* Right Rating Breakdown Bars */}
            <div className="md:col-span-7">
              <div className="text-[11px] sm:text-xs font-bold text-[#0A4A2E] mb-2.5 sm:mb-3">
                Rating breakdown <span className="font-normal text-[#17271E]/60">• tap a row to filter</span>
              </div>


              <div className="space-y-2 text-xs font-semibold">
                {STAR_BREAKDOWN.map((row) => (
                  <button
                    key={row.stars}
                    onClick={() =>
                      setActiveFilter(row.stars === 5 ? "s5" : row.stars === 4 ? "s4" : "all")
                    }
                    className="flex w-full items-center gap-3 group text-left rounded-lg p-1 transition-colors hover:bg-white/60"
                  >
                    <span className="w-6 font-bold text-[#0A4A2E] shrink-0">
                      {row.stars} ★
                    </span>
                    <div className="h-3 flex-1 rounded-full bg-[#EAE5D9] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#D99B00] transition-all duration-500"
                        style={{ width: row.pct }}
                      />
                    </div>
                    <span className="w-8 text-right text-[#17271E]/70 font-bold shrink-0">
                      {row.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition-all whitespace-nowrap ${
                activeFilter === f.id
                  ? "bg-[#0E5C3A] text-white shadow-2xs"
                  : "bg-white text-[#17271E]/80 border border-[#E4DED0] hover:border-[#0E5C3A]"
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
            className="absolute top-1/2 -left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E5C3A] shadow-md border border-[#E4DED0] hover:scale-105 transition-all"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Scroll Nav Arrow Right */}
          <button
            onClick={scrollRight}
            className="absolute top-1/2 -right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E5C3A] shadow-md border border-[#E4DED0] hover:scale-105 transition-all"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-1 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="w-[78vw] max-w-[285px] sm:w-[350px] shrink-0 snap-start rounded-2xl border border-[#E4DED0] bg-white p-4 sm:p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center text-[#D99B00] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rev.stars
                            ? "fill-[#D99B00] text-[#D99B00]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-[#17271E] leading-relaxed font-medium">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                {/* Footer User Info */}
                <div className="mt-5 border-t border-[#E4DED0]/60 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F0E8] font-bold text-[#0A4A2E] text-sm">
                      {rev.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-[#0A4A2E] truncate">
                        {rev.name}
                      </div>
                      <div className="text-[11px] text-[#17271E]/60 font-medium">
                        {rev.city}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#E4F0E8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#0E5C3A]">
                      {rev.stage}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
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
