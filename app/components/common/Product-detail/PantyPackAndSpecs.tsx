/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Package, ShieldCheck, Sparkles } from "lucide-react";

export default function PantyPackAndSpecs({ activeVariant }: { activeVariant?: any }) {
  const sizeName = activeVariant?.name || "M-XL";
  const isXXL = sizeName.includes("XXL");
  const waistDesc = isXXL
    ? "Waist ~44–56 in (112–142 cm) · Fuller fit"
    : "Waist ~28–44 in (71–112 cm) · Fits most";

  const specs = [
    { k: "Pack count", v: "8 individually-wrapped period panties" },
    { k: "Selected size", v: `${sizeName} (${waistDesc})` },
    { k: "Absorbency", v: "Super-absorbent core — holds as much as 5 regular pads" },
    { k: "Wear time", v: "Up to 10–12 hours of protection (change sooner on heavy days)" },
    { k: "Profile", v: "Genuinely super-thin — feels like normal underwear under clothes" },
    { k: "Coverage", v: "360° front-to-back leak-resistant back + soft elastic leak guards" },
    { k: "Wear & Removal", v: "Step in like underwear · tear-away perforated side seams to remove" },
    { k: "Wrapper", v: "Soft non-woven — opens from top, doubles as clean disposal wrapper" },
    { k: "Disposal", v: "Tuck into wrapper and bin — single-use only, never flush or wash" },
    { k: "Free from", v: "Chlorine bleach, parabens, added fragrances and synthetic dyes" },
  ];

  return (
    <section id="specs" className="mt-12 sm:mt-16 border-t border-gray-200/80 pt-8 sm:pt-12">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
          THE DETAILS
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#1A150F]">
          What&apos;s in the box &amp; specs
        </h2>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: What's in the box Card */}
        <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#602E55] p-6 sm:p-8 text-white shadow-md">
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
                  8 Period Panties (Size {sizeName})
                </h4>
                <p className="mt-0.5 text-xs text-white/85">
                  Each panty individually sealed in its own soft wrapper
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 my-4" />

            {/* Item 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F4C430] shadow-2xs">
                <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  360° All-Round Leak Protection
                </h4>
                <p className="mt-0.5 text-xs text-white/85">
                  Leak-resistant back &amp; soft side leak guards — holds up to 5 pads
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 my-4" />

            {/* Item 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F4C430] shadow-2xs">
                <Sparkles className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Super-Thin &amp; Tear-Away Sides
                </h4>
                <p className="mt-0.5 text-xs text-white/85">
                  Feels like underwear without bulk · quick tear-away removal
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
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">8</strong>
              <span className="text-gray-700">Disposable panties</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">Up to 10–12h</strong>
              <span className="text-gray-700">leak-free wear</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">5 Pads</strong>
              <span className="text-gray-700">absorbency capacity</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">100%</strong>
              <span className="text-gray-700">Tear-away removal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Specs: Free from & Care Notes */}
      <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-xs text-gray-600 sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
          <span className="w-28 flex-none font-bold text-[#1A150F]">Free from</span>
          <span className="text-gray-700">
            Chlorine bleach, parabens, added fragrances and synthetic dyes.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
          <span className="w-28 flex-none font-bold text-[#1A150F]">Care</span>
          <span className="leading-relaxed text-gray-700">
            Single-use only — tear the perforated sides to remove it, tuck it back into its wrapper and bin it. Never flush, and never wash and re-wear a used panty.
          </span>
        </div>
      </div>
    </section>
  );
}

