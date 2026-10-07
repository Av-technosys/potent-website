/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Check, X, Minus } from "lucide-react";

export default function FunnelMarketComparisonSection() {
  const features = [
    {
      feature: "Never touch a dirty seat",
      looway: "check",
      hovering: "cross",
      paperCovers: "dash",
      holding: "cross",
    },
    {
      feature: "Pee standing, fully dressed",
      looway: "check",
      hovering: "cross",
      paperCovers: "cross",
      holding: "cross",
    },
    {
      feature: "Works when there's no toilet",
      looway: "check",
      hovering: "dash",
      paperCovers: "cross",
      holding: "cross",
    },
    {
      feature: "Kind to knees, back & bladder",
      looway: "check",
      hovering: "cross",
      paperCovers: "dash",
      holding: "cross",
    },
    {
      feature: "Reusable for years",
      looway: "check",
      hovering: "dash",
      paperCovers: "cross",
      holding: "cross",
    },
    {
      feature: "Leak-free once you've practised",
      looway: "check",
      hovering: "cross",
      paperCovers: "cross",
      holding: "cross",
    },
  ];

  const renderIcon = (val: string) => {
    if (val === "check") {
      return <Check className="h-4 w-4 stroke-[3] text-[#15803D]" />;
    }
    if (val === "cross") {
      return <X className="h-4 w-4 stroke-[2.2] text-gray-400" />;
    }
    return <Minus className="h-4 w-4 stroke-[2.2] text-amber-700" />;
  };

  return (
    <section id="why-looway" className="w-full bg-[#f8f1ea] py-12 sm:py-18 lg:py-22 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10 max-w-3xl">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2">
            WHY LOOWAY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight">
            Better than the market alternatives
          </h2>
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-[#2A1620]/75 leading-relaxed font-normal">
            Everything a clean, dignified pee needs — standing up, fully dressed. Here&apos;s how the Looway funnel compares to the usual options at a glance.
          </p>
        </div>

        {/* Mobile Scroll Hint */}
        <div className="flex items-center justify-between sm:hidden mb-2">
          <span className="text-[10.5px] font-bold text-[#b51e60]">← Swipe table to compare →</span>
          <span className="text-[10px] font-medium text-[#2A1620]/50">6 features</span>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[720px] overflow-hidden rounded-2xl sm:rounded-3xl border border-[#f8dce8] bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="py-4 px-6 font-serif font-bold text-xs sm:text-sm w-2/6 tracking-wide bg-[#5A0E30] text-white">
                    What a clean pee needs
                  </th>
                  <th className="py-4 px-4 font-bold text-center text-xs sm:text-sm bg-[#a81a57] text-white w-1/6 tracking-wide shadow-xs">
                    Looway
                  </th>
                  <th className="py-4 px-4 font-bold text-center text-xs sm:text-sm bg-[#a81a57] text-white w-1/6 tracking-wide">
                    Hovering / squatting
                  </th>
                  <th className="py-4 px-4 font-bold text-center text-xs sm:text-sm bg-[#a81a57] text-white w-1/6 tracking-wide">
                    Paper seat covers
                  </th>
                  <th className="py-4 px-4 font-bold text-center text-xs sm:text-sm bg-[#a81a57] text-white w-1/6 tracking-wide">
                    Just holding it
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8dce8]">
                {features.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-[#fdeef4]/40"
                  >
                    {/* Feature Title */}
                    <td className="py-4 px-6 font-bold text-[#5A0E30]">
                      {row.feature}
                    </td>

                    {/* Looway Column (Highlighted Light Pink) */}
                    <td className="py-4 px-4 text-center bg-[#fdeef4]/80 font-bold border-x border-[#a81a57]/15">
                      <div className="flex items-center justify-center">
                        {renderIcon(row.looway)}
                      </div>
                    </td>

                    {/* Hovering / Squatting */}
                    <td className="py-4 px-4 text-center text-[#2A1620]/40">
                      <div className="flex items-center justify-center">
                        {renderIcon(row.hovering)}
                      </div>
                    </td>

                    {/* Paper Seat Covers */}
                    <td className="py-4 px-4 text-center text-[#2A1620]/40">
                      <div className="flex items-center justify-center">
                        {renderIcon(row.paperCovers)}
                      </div>
                    </td>

                    {/* Just Holding It */}
                    <td className="py-4 px-4 text-center text-[#2A1620]/40">
                      <div className="flex items-center justify-center">
                        {renderIcon(row.holding)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-8 text-center text-xs sm:text-sm font-bold text-[#a81a57]">
          <span className="inline-flex items-center justify-center gap-1.5">
            <Check className="h-4 w-4 stroke-[3] text-[#15803D] shrink-0" />
            Looway is the only option that does all six — clean, dry, dressed and dignified, every single time.
          </span>
        </div>
      </div>
    </section>
  );
}
