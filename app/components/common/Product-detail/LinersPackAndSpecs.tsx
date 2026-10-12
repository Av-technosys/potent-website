/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Package, ShieldCheck, Sparkles } from "lucide-react";

export default function LinersPackAndSpecs({ activeVariant }: { activeVariant?: any }) {
  const packName = activeVariant?.name || "Pack of 60";
  const count = packName.includes("40") ? "40" : packName.includes("80") ? "80" : "60";

  const specs = [
    { k: "Pack count", v: `${count} panty liners (${packName})` },
    { k: "Length", v: "190mm" },
    { k: "Thickness", v: "Ultra-thin (~1mm) — invisible under clothes" },
    { k: "Top sheet", v: "100% Breathable, cottony-soft & hypoallergenic" },
    { k: "Absorbency", v: "Daily discharge, spotting & light bladder leaks" },
    { k: "Adhesive", v: "Full-length secure stay-put adhesive strip" },
    { k: "Scent & Dyes", v: "100% Fragrance-free & dye-free" },
    { k: "Packaging", v: "Individually wrapped in soft, silent wrappers" },
    { k: "Disposal", v: "Roll, seal in wrapper and bin — never flush" },
    { k: "Recommended change", v: "Every 3 to 4 hours (or when damp)" },
  ];

  return (
    <section id="specs" className="mt-12 sm:mt-16 border-t border-gray-200/80 pt-8 sm:pt-12">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
          THE DETAILS
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#1A150F]">
          What&apos;s in the pack &amp; specs
        </h2>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: What's in the box Card */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#7E4D77] p-6 sm:p-8 text-white shadow-md">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
            What&apos;s in the box
          </h3>

          <div className="space-y-5">
            {/* Item 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F4C430] shadow-2xs">
                <Package className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {count} Daily Liners ({packName})
                </h4>
                <p className="mt-0.5 text-xs text-white/85">
                  Individually wrapped in soft silent wrappers — easy to carry
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 my-4" />

            {/* Item 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F4C430] shadow-2xs">
                <Sparkles className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  190mm Length • ~1mm Profile
                </h4>
                <p className="mt-0.5 text-xs text-white/85">
                  Ultra-thin everyday coverage for normal underwear gussets
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 my-4" />

            {/* Item 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F4C430] shadow-2xs">
                <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Breathable, Rash-Free Cottony Top
                </h4>
                <p className="mt-0.5 text-xs text-white/85">
                  Gentle on intimate skin, zero plastic feel, fragrance-free
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Specs Table */}
        <div className="lg:col-span-7 overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EAD6DC] bg-white shadow-2xs divide-y divide-[#EAD6DC]/60 text-xs sm:text-sm">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-1 sm:gap-4 hover:bg-[#FAF6F8]/50 transition-colors"
            >
              <span className="font-bold text-[#1A150F] w-44 shrink-0">{item.k}</span>
              <span className="text-gray-600 sm:text-right font-medium">{item.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* In Every Pack Strip (Cream Card) */}
      <div className="mt-6 sm:mt-8 rounded-2xl border border-[#EAE4D6] bg-[#F4F1E8] p-3.5 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs sm:text-base">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
              IN EVERY PACK
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">{count}</strong>
              <span className="text-gray-700">Daily Liners</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">190mm</strong>
              <span className="text-gray-700">length</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">~1mm</strong>
              <span className="text-gray-700">ultra-thin profile</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">100%</strong>
              <span className="text-gray-700">Individually wrapped</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Specs: Free from & Care Notes */}
      <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-xs text-gray-600 sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
          <span className="w-28 flex-none font-bold text-[#1A150F]">Free from</span>
          <span className="text-gray-700">
            Chlorine bleach, parabens, added fragrance, dyes &amp; synthetic plastic top layers.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
          <span className="w-28 flex-none font-bold text-[#1A150F]">Care</span>
          <span className="leading-relaxed text-gray-700">
            Change every 3 to 4 hours or whenever damp; roll, wrap in its silent pouch and bin it — never flush. Not designed for period flow: use Ovy organic pads or a menstrual cup for period flow.
          </span>
        </div>
      </div>
    </section>
  );
}

