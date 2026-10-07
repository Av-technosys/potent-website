/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Filter, ShoppingBag } from "lucide-react";

export default function FunnelPackAndSpecsSection() {
  const specs = [
    { k: "Material", v: "Soft silicone" },
    { k: "Storage pouch", v: "Cotton (included)" },
    { k: "Reusable", v: "Yes — lasts for years with proper care" },
    { k: "Design", v: "Ergonomic, leak-free, body-contoured" },
    { k: "Size", v: "Compact — fits any bag or pocket" },
    { k: "Use type", v: "External use only — never inserted" },
    { k: "Works with", v: "Western seats, Indian squat toilets, outdoors, bottles & Looway bags" },
    { k: "Best for", v: "Road trips, treks, day trips, festivals, public & office washrooms" },
    { k: "Suitable for", v: "Women & girls — travellers, joint pain, pregnancy, seniors, limited mobility" },
    { k: "Care", v: "Wet wipes or plain water while out; wash thoroughly at home" },
    { k: "Pack options", v: "Pack of 1 or Pack of 2" },
    { k: "Best before", v: "No fixed expiry with proper care" },
  ];

  return (
    <section id="specs" className="w-full bg-[#f8f1ea] py-12 sm:py-18 lg:py-22 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2">
            THE DETAILS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight">
            What&apos;s in the pack &amp; specs
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: What's in the box Magenta/Crimson Card */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#c21e63] p-6 sm:p-8 text-white shadow-md">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
              What&apos;s in the box
            </h3>

            <div className="space-y-5">
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F4C430] shadow-2xs">
                  <Filter className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    1 Pee Funnel
                  </h4>
                  <p className="mt-0.5 text-xs text-white/85">
                    Soft silicone — light &amp; compact
                  </p>
                </div>
              </div>

              <div className="border-t border-white/20 my-4" />

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F4C430] shadow-2xs">
                  <ShoppingBag className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Cotton storage pouch
                  </h4>
                  <p className="mt-0.5 text-xs text-white/85">
                    Breathable &amp; washable — carry it hygienically
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Specs Table */}
          <div className="lg:col-span-7 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#f8dce8] bg-white shadow-2xs divide-y divide-[#f8dce8]/80">
            {specs.map((spec, idx) => (
              <div
                key={idx}
                className={`flex flex-row justify-between items-start p-3.5 sm:p-4 text-xs sm:text-sm gap-3 ${
                  idx % 2 === 0 ? "bg-[#fcf8f3]/60" : "bg-white"
                }`}
              >
                <div className="w-5/12 sm:w-4/12 font-bold text-[#5A0E30] shrink-0 text-xs sm:text-sm leading-tight sm:leading-normal">
                  {spec.k}
                </div>
                <div className="w-7/12 sm:w-8/12 text-[#2A1620]/80 font-normal leading-tight sm:leading-relaxed text-xs sm:text-sm">
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
