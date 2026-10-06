/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Car, Mountain, Activity, HeartHandshake } from "lucide-react";

export default function NoToiletLoowaySection() {
  const cards = [
    {
      icon: Car,
      title: "Stuck in traffic",
      desc: "No exit, no loo, no panic. Discreet relief without leaving your seat.",
    },
    {
      icon: Mountain,
      title: "Travel & camping",
      desc: "Treks, road trips and festivals where a clean restroom simply doesn't exist.",
    },
    {
      icon: Activity,
      title: "Motion sickness",
      desc: "Nausea in a car, bus, boat or plane — open, use, seal. No mess to clean.",
    },
    {
      icon: HeartHandshake,
      title: "Caregiving",
      desc: "Dignified bedside relief for seniors and people with limited mobility.",
    },
  ];

  return (
    <section className="w-full bg-[#F6F1E7] py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl">
          {/* Subtitle / Kicker Badge */}
          <span className="text-[10.5px] sm:text-[11px] font-extrabold tracking-widest text-[#0E5C3A] uppercase">
            MADE FOR LIFE&apos;S UNEXPECTED MOMENTS
          </span>

          {/* Main Heading */}
          <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#17271E]">
            When there&apos;s no toilet,{" "}
            <span className="text-[#0E5C3A]">there&apos;s Looway.</span>
          </h2>

          {/* Description Paragraph */}
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base leading-relaxed text-[#17271E]/75 font-normal">
            The road from Jaipur to Jodhpur can run 300 km without a clean roadside
            toilet. A toddler who can&apos;t hold it on the highway. A night bus with a broken
            loo. A campsite with nowhere to go discreetly. These urine &amp; vomit bags are
            built for all of it — one bag, every situation.
          </p>
        </div>

        {/* 4 Cards Grid - 2 columns on mobile, 4 on desktop */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-[#E4DED0] bg-white p-3.5 sm:p-5 shadow-2xs transition-all hover:shadow-md"
              >
                <div>
                  {/* Icon Box */}
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#E4F0E8] text-[#0E5C3A]">
                    <IconComp className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
                  </div>

                  {/* Card Title */}
                  <h3 className="mt-2.5 sm:mt-4 text-xs sm:text-base font-bold text-[#0A4A2E]">
                    {card.title}
                  </h3>

                  {/* Card Subtitle */}
                  <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-[#17271E]/70 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

  );
}
