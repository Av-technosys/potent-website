"use client";

import { ShieldCheck, Check, Droplets, Leaf, Heart } from "lucide-react";

export function OvySixProofPoints() {
  return (
    <section className="w-full bg-[#FDF5F8] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="inline-block rounded-full border border-purple-200 bg-white/90 px-4 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest text-[#602E55] uppercase mb-2 shadow-2xs">
            TESTED. TRUSTED. SAFE.
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1915] leading-tight">
            Six things every Ovy pack can prove.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base font-normal text-[#5C524D] max-w-2xl mx-auto leading-relaxed px-1">
            Most packs say “dermatologically tested” and stop there. Ovy names the lab, the standard, the number of people and the score.
          </p>
        </div>

        {/* 6 Proof Cards Grid - 3 COLUMNS ON MOBILE (< lg), 6 COLUMNS ON DESKTOP (lg:) */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8">
          
          {/* 1. Dermatologically tested */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 text-center shadow-xs border border-purple-100/70 flex flex-col items-center justify-start hover:shadow-md transition-all">
            <div className="rounded-full bg-purple-100 p-2 sm:p-3 text-[#602E55] mb-1.5 sm:mb-3 shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="font-bold text-[10.5px] sm:text-sm text-[#1F1915] leading-snug">
              Dermatologically tested
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 mt-2 leading-relaxed">
              On 24 human volunteers, in an ISO-certified lab, under a dermatologist.
            </p>
          </div>

          {/* 2. Non-irritant */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 text-center shadow-xs border border-pink-100/70 flex flex-col items-center justify-start hover:shadow-md transition-all">
            <div className="rounded-full bg-pink-100 p-2 sm:p-3 text-[#C42B5B] mb-1.5 sm:mb-3 shrink-0">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-[10.5px] sm:text-sm text-[#1F1915] leading-snug">
              Non-irritant
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 mt-2 leading-relaxed">
              Tested to IS 4011:2018, the Indian Standard. Mean score 0.04 against a 2.0 threshold.
            </p>
          </div>

          {/* 3. Rash-free */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 text-center shadow-xs border border-blue-100/70 flex flex-col items-center justify-start hover:shadow-md transition-all">
            <div className="rounded-full bg-blue-100 p-2 sm:p-3 text-[#1B6A85] mb-1.5 sm:mb-3 shrink-0">
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="font-bold text-[10.5px] sm:text-sm text-[#1F1915] leading-snug">
              Rash-free
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 mt-2 leading-relaxed">
              Zero redness or swelling in 23 of 24 volunteers at 24 hours and again at day 8.
            </p>
          </div>

          {/* 4. Toxin-free */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 text-center shadow-xs border border-purple-100/70 flex flex-col items-center justify-start hover:shadow-md transition-all">
            <div className="rounded-full bg-purple-100 p-2 sm:p-3 text-[#602E55] mb-1.5 sm:mb-3 shrink-0">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="font-bold text-[10.5px] sm:text-sm text-[#1F1915] leading-snug">
              Toxin-free
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 mt-2 leading-relaxed">
              Certified for the Ovy menstrual range. No chlorine bleach, parabens, fragrance or dyes.
            </p>
          </div>

          {/* 5. pH-balanced */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 text-center shadow-xs border border-purple-100/70 flex flex-col items-center justify-start hover:shadow-md transition-all">
            <div className="rounded-full bg-purple-100 p-2 sm:p-2.5 text-[#602E55] mb-1.5 sm:mb-3 font-bold text-[10px] sm:text-xs flex items-center justify-center h-8 w-8 sm:h-11 sm:w-11 shrink-0">
              pH
            </div>
            <h3 className="font-bold text-[10.5px] sm:text-sm text-[#1F1915] leading-snug">
              pH-balanced
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 mt-2 leading-relaxed">
              Certified. Kind to the skin's own balance, which sits at a different pH to the rest of you.
            </p>
          </div>

          {/* 6. Cruelty-free */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-2.5 sm:p-4 text-center shadow-xs border border-blue-100/70 flex flex-col items-center justify-start hover:shadow-md transition-all">
            <div className="rounded-full bg-blue-100 p-2 sm:p-3 text-[#1B6A85] mb-1.5 sm:mb-3 shrink-0">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="font-bold text-[10.5px] sm:text-sm text-[#1F1915] leading-snug">
              Cruelty-free
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 mt-2 leading-relaxed">
              Certified. Never tested on animals, and vegan-friendly.
            </p>
          </div>

        </div>

        {/* Bottom Purple Numbers Banner */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#602E55] text-white p-4 sm:p-8 max-w-4xl mx-auto shadow-lg">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center divide-x divide-purple-400/30">
            <div>
              <div className="font-serif text-2xl sm:text-5xl font-bold text-white">24</div>
              <div className="text-[9px] sm:text-xs text-purple-200 mt-0.5 sm:mt-1 font-medium">human volunteers</div>
            </div>

            <div className="px-1">
              <div className="font-serif text-2xl sm:text-5xl font-bold text-white">0.04</div>
              <div className="text-[9px] sm:text-xs text-purple-200 mt-0.5 sm:mt-1 font-medium leading-tight">
                mean irritation score, against a 2.0 threshold
              </div>
            </div>

            <div className="px-1">
              <div className="font-serif text-2xl sm:text-5xl font-bold text-white">Day 8</div>
              <div className="text-[9px] sm:text-xs text-purple-200 mt-0.5 sm:mt-1 font-medium leading-tight">
                follow-up, all scores zero
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[9.5px] sm:text-xs text-gray-500 mt-3 sm:mt-4">
          Study reports and certificates are held on file and shared on request: care@potenthygiene.com
        </p>

      </div>
    </section>
  );
}
