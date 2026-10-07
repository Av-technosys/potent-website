/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ShieldAlert, AlertCircle, Check } from "lucide-react";

export default function FunnelUseItSafelySection() {
  return (
    <section id="safety" className="w-full bg-[#fcf8f3] scroll-mt-32 sm:scroll-mt-36 py-10 sm:py-16 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="rounded-2xl sm:rounded-3xl border-2 border-[#E5B834] bg-[#FAF1E6]/70 p-5 sm:p-8 md:p-10 shadow-2xs">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#F4C430] text-[#5A0E30] shadow-2xs">
              <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#5A0E30]">
              Use it safely
            </h3>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-5 text-xs sm:text-sm leading-relaxed text-[#2A1620]/85 font-normal">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-5">
              {/* Point 1 (Warning) */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#B4451F] mt-0.5 stroke-[2.2]" />
                <div>
                  <strong className="font-bold text-[#5A0E30]">
                    For external use only.
                  </strong>{" "}
                  The funnel is never inserted — it sits gently against the outside of your body to direct the flow away.
                </div>
              </div>

              {/* Point 2 (Check) */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Check className="h-4 w-4 shrink-0 text-[#b51e60] stroke-[2.5] mt-0.5" />
                <div>
                  Don&apos;t use it if you have any skin irritation, cut or infection in the area of contact — wait until it has fully healed.
                </div>
              </div>

              {/* Point 3 (Check) */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Check className="h-4 w-4 shrink-0 text-[#b51e60] stroke-[2.5] mt-0.5" />
                <div>
                  Store it clean and dry in its cotton pouch, away from direct sunlight. Kept well, it lasts for years.
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-5">
              {/* Point 4 (Check) */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Check className="h-4 w-4 shrink-0 text-[#b51e60] stroke-[2.5] mt-0.5" />
                <div>
                  Easy to clean. While you&apos;re out, wipe it with wet wipes or rinse it under plain water; once you&apos;re home, wash it thoroughly with soap and water and let it air-dry before storing.
                </div>
              </div>

              {/* Point 5 (Check) */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Check className="h-4 w-4 shrink-0 text-[#b51e60] stroke-[2.5] mt-0.5" />
                <div>
                  Inspect it for cracks or tears before each use, and replace it if it&apos;s damaged or has lost its shape. Don&apos;t share your funnel with others.
                </div>
              </div>

              {/* Point 6 (Check) */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Check className="h-4 w-4 shrink-0 text-[#b51e60] stroke-[2.5] mt-0.5" />
                <div>
                  <strong className="font-bold text-[#5A0E30]">
                    Pregnant women:
                  </strong>{" "}
                  safe for external use and especially helpful — check with your doctor if you have any concerns.{" "}
                  <strong className="font-bold text-[#5A0E30]">
                    Teen girls:
                  </strong>{" "}
                  perfectly suitable for avoiding dirty toilets.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
