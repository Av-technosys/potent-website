/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Package, ShieldCheck } from "lucide-react";

export default function PackAndSpecsSection() {
  const specs = [
    { k: "Liquid capacity", v: "Up to 700 ml per bag" },
    { k: "Uses per bag", v: "2–3 uses until full" },
    { k: "Solidifies in", v: "About 60 seconds" },
    { k: "Closure", v: "Sealable locking closure" },
    { k: "Pack size", v: "Pack of 10 or Pack of 20" },
    { k: "Reusable", v: "Yes — until 700 ml capacity is reached" },
    {
      k: "Best for",
      v: "Road trips, treks, camping, motion sickness, caregiving, hospitals, outdoor events",
    },
    {
      k: "Suitable for",
      v: "All ages & genders — babies, children, adults, seniors, pregnant women, people with disabilities",
    },
    { k: "Material", v: "Recyclable material + super-absorbent strip" },
    { k: "Use type", v: "External use only" },
    { k: "Disposal", v: "Dispose in a rubbish bin — never flush" },
    { k: "Shelf life", v: "Best within 5 years of packaging" },
  ];

  return (
    <section id="specs" className="w-full bg-[#F6F1E7] py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-[10.5px] sm:text-[11px] font-extrabold tracking-widest text-[#0E5C3A] uppercase">
            THE DETAILS
          </span>
          <h2 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A4A2E]">
            What&apos;s in the pack &amp; specs
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          {/* Left Column: What's in the box Green Card */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#0E5C3A] p-4 sm:p-8 text-white shadow-md">
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              What&apos;s in the box
            </h3>

            <div className="space-y-4 sm:space-y-5">
              {/* Item 1 */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white/14 text-[#F4C430]">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    10 urine &amp; vomit bags
                  </h4>
                  <p className="mt-0.5 text-xs text-white/85">
                    Compact, sealable, single-piece bags
                  </p>
                </div>
              </div>

              <div className="border-t border-white/16 my-3 sm:my-4" />

              {/* Item 2 */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white/14 text-[#F4C430]">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Super-absorbent strip
                  </h4>
                  <p className="mt-0.5 text-xs text-white/85">
                    Solidifies up to 700 ml per bag
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Specs Table */}
          <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-[#E4DED0] bg-white shadow-2xs divide-y divide-[#E4DED0]/70">
            {specs.map((spec, idx) => (
              <div
                key={idx}
                className={`flex flex-row justify-between items-start p-2.5 sm:p-4 text-xs sm:text-sm gap-2 ${
                  idx % 2 === 0 ? "bg-[#FBF8F1]" : "bg-white"
                }`}
              >
                <div className="w-5/12 font-bold text-[#0A4A2E] shrink-0 text-[11px] sm:text-sm leading-tight sm:leading-normal">
                  {spec.k}
                </div>
                <div className="w-7/12 text-[#17271E]/80 font-normal leading-tight sm:leading-relaxed text-[11px] sm:text-sm text-right sm:text-left">
                  {spec.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}
