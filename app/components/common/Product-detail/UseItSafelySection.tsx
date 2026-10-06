/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ShieldAlert, AlertCircle, Check } from "lucide-react";

export default function UseItSafelySection() {
  return (
    <section className="w-full bg-[#FBF8F1] py-8 sm:py-14 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="rounded-2xl sm:rounded-3xl border-2 border-[#E5B834] bg-[#FAF6F0] p-4 sm:p-8 md:p-10 shadow-2xs">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-7">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4C430] text-[#0A4A2E] shadow-2xs">
              <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#0A4A2E]">
              Use it safely
            </h3>
          </div>

          {/* 2-Column Grid on Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-x-3 sm:gap-x-10 gap-y-3.5 sm:gap-y-5 text-[11px] sm:text-[13.5px] leading-relaxed text-[#24372C]">
            {/* Point 1 (Warning) */}
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#C05621] mt-0.5 stroke-[2.2]" />
              <div>
                <strong className="font-bold text-[#0A4A2E]">
                  For external use only.
                </strong>{" "}
                The super-absorbent strip is harmful if swallowed — keep used bags away from young children and pets.
              </div>
            </div>

            {/* Point 2 (Warning) */}
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#C05621] mt-0.5 stroke-[2.2]" />
              <div>
                Do not let children or pets handle a used bag — the solidified contents can be harmful if chewed or ingested.
              </div>
            </div>

            {/* Point 3 (Check) */}
            <div className="flex items-start gap-2 sm:gap-3">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#0E5C3A] stroke-[3] mt-0.5" />
              <div>
                Seal the bag immediately after each use. Don&apos;t leave an opened bag unsealed for more than 24 hours.
              </div>
            </div>

            {/* Point 4 (Check) */}
            <div className="flex items-start gap-2 sm:gap-3">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#0E5C3A] stroke-[3] mt-0.5" />
              <div>
                Never flush the bag — even recyclable material can block drains. Dispose of it in a rubbish bin.
              </div>
            </div>

            {/* Point 5 (Check) */}
            <div className="flex items-start gap-2 sm:gap-3">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#0E5C3A] stroke-[3] mt-0.5" />
              <div>
                Store unused bags in a cool, dry place away from direct sunlight. Best used within 5 years of packaging.
              </div>
            </div>

            {/* Point 6 (Check) */}
            <div className="flex items-start gap-2 sm:gap-3">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#0E5C3A] stroke-[3] mt-0.5" />
              <div>
                <strong className="font-bold text-[#0A4A2E]">
                  Pregnant women:
                </strong>{" "}
                completely safe for external use — use exactly as any other adult.{" "}
                <strong className="font-bold text-[#0A4A2E]">Children:</strong>{" "}
                supervise at all times.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}

