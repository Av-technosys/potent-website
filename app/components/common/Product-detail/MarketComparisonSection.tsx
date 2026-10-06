/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Check, X, Minus } from "lucide-react";

export default function MarketComparisonSection() {
  const features = [
    {
      feature: "Turns liquid to solid gel",
      looway: true,
      ordinaryBag: false,
      cheaperDisposables: "dash",
      makingDo: false,
    },
    {
      feature: "Leak-proof seal",
      looway: true,
      ordinaryBag: false,
      cheaperDisposables: "dash",
      makingDo: false,
    },
    {
      feature: "Odour control",
      looway: true,
      ordinaryBag: false,
      cheaperDisposables: "dash",
      makingDo: false,
    },
    {
      feature: "Shaped to actually use",
      looway: true,
      ordinaryBag: false,
      cheaperDisposables: "dash",
      makingDo: false,
    },
    {
      feature: "Reusable until full",
      looway: true,
      ordinaryBag: false,
      cheaperDisposables: "dash",
      makingDo: false,
    },
    {
      feature: "Truly portable",
      looway: true,
      ordinaryBag: "dash",
      cheaperDisposables: "dash",
      makingDo: false,
    },
  ];

  return (
    <section id="why-looway" className="w-full bg-[linear-gradient(90deg,#E4F0E8_0%,#F1F7F3_30%,#FBF8F1_80%)] scroll-mt-32 sm:scroll-mt-36 py-8 sm:py-16 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <span className="text-[10.5px] sm:text-xs font-extrabold tracking-widest text-[#0E5C3A] uppercase block mb-1.5 sm:mb-2">
            WHY LOOWAY
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#073B24] leading-tight">
            Better than the market alternatives
          </h2>
          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-[#17271E]/80 leading-relaxed font-semibold">
            Everything a clean, mess-free journey needs — In one bag. Here&apos;s how Looway compares to the usual options at a glance.
          </p>
        </div>


        {/* Comparison Table Container */}
        <div className="flex items-center justify-between sm:hidden mb-2">
          <span className="text-[10.5px] font-bold text-[#0E5C3A]">← Swipe table to compare →</span>
          <span className="text-[10px] font-medium text-[#17271E]/50">6 features</span>
        </div>
        <div className="overflow-x-auto no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-w-[720px] overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D5CDBF] bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#083E26] text-white">
                  <th className="py-4 px-6 font-extrabold text-xs sm:text-sm w-2/5 tracking-wide">
                    What a journey needs
                  </th>
                  <th className="py-4 px-4 font-extrabold text-center text-xs sm:text-sm bg-[#0E5C3A] text-white w-1/5 tracking-wide shadow-xs">
                    Looway
                  </th>
                  <th className="py-4 px-4 font-extrabold text-center text-xs sm:text-sm w-1/5 text-white/90 tracking-wide">
                    Ordinary bag
                  </th>
                  <th className="py-4 px-4 font-extrabold text-center text-xs sm:text-sm w-1/5 text-white/90 tracking-wide">
                    Cheaper disposables
                  </th>
                  <th className="py-4 px-4 font-extrabold text-center text-xs sm:text-sm w-1/5 text-white/90 tracking-wide">
                    Making do
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DED0]">
                {features.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-[#FBF8F1]/60"
                  >
                    {/* Feature Title */}
                    <td className="py-4 px-6 font-bold text-[#073B24]">
                      {row.feature}
                    </td>

                    {/* Looway Column (Highlighted Light Green Background) */}
                    <td className="py-4 px-4 text-center bg-[#E4F0E8]/80 font-bold text-[#0E5C3A] border-x border-[#0E5C3A]/10">
                      <div className="flex items-center justify-center">
                        <Check className="h-4 w-4 stroke-[3] text-[#0E5C3A]" />
                      </div>
                    </td>

                    {/* Ordinary Bag */}
                    <td className="py-4 px-4 text-center text-[#17271E]/40">
                      <div className="flex items-center justify-center">
                        {(row.ordinaryBag as any) === false ? (
                          <X className="h-4 w-4 stroke-[2.2] text-gray-400" />
                        ) : (
                          <Minus className="h-4 w-4 stroke-[2.2] text-gray-400" />
                        )}
                      </div>
                    </td>

                    {/* Cheaper Disposables */}
                    <td className="py-4 px-4 text-center text-[#17271E]/40">
                      <div className="flex items-center justify-center">
                        {(row.cheaperDisposables as any) === false ? (
                          <X className="h-4 w-4 stroke-[2.2] text-gray-400" />
                        ) : (
                          <Minus className="h-4 w-4 stroke-[2.2] text-gray-400" />
                        )}
                      </div>
                    </td>

                    {/* Making Do */}
                    <td className="py-4 px-4 text-center text-[#17271E]/40">
                      <div className="flex items-center justify-center">
                        {(row.makingDo as any) === false ? (
                          <X className="h-4 w-4 stroke-[2.2] text-gray-400" />
                        ) : (
                          <Minus className="h-4 w-4 stroke-[2.2] text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-6 text-center text-xs sm:text-sm font-bold text-[#073B24]">
          <span className="inline-flex items-center justify-center gap-1.5">
            <Check className="h-4 w-4 stroke-[3] text-[#0E5C3A] shrink-0" />
            Looway is the only option that does all six — that&apos;s why it&apos;s built for the journey, not improvised for it.
          </span>
        </div>
      </div>
    </section>
  );
}

