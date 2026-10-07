/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ShieldAlert, Car, Mountain, MapPin } from "lucide-react";

export default function FunnelNoToiletSection() {
  const cards = [
    {
      icon: ShieldAlert,
      title: "Filthy public toilets",
      desc: "Stand over the seat and go — your skin never touches it. No hovering, no squatting, no dread.",
    },
    {
      icon: Car,
      title: "Road trips & highways",
      desc: "No clean dhaba loo for 200 km? Step out, stay fully dressed, and go beside the car in seconds.",
    },
    {
      icon: Mountain,
      title: "Treks, camps & festivals",
      desc: "Camping with friends, family or schoolmates, or a festival queue thirty deep — stand discreetly, go, and get back to it.",
    },
    {
      icon: MapPin,
      title: "Pregnancy & sore knees",
      desc: "No painful squatting and no lowering onto a dirty seat — gentle relief when your body needs it most.",
    },
  ];

  return (
    <section id="no-toilet" className="w-full bg-[#fdeef4] scroll-mt-32 sm:scroll-mt-36 py-12 sm:py-18 lg:py-22 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Eyebrow */}
        <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2 sm:mb-3">
          FREEDOM TO GO, ANYWHERE
        </span>

        {/* Main Heading */}
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight max-w-4xl">
          When the toilet&apos;s <br/> filthy,{" "}
          <span className="text-[#a81a57]">just stand <br/> &amp; go.</span>
        </h2>

        {/* Sub-paragraph */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-[#2A1620]/75 leading-relaxed font-normal max-w-3xl">
          The road from Jaipur to Jodhpur can run 300 km without a single clean toilet. A trek with nowhere private to squat. A festival with a queue thirty women deep. A young girl at a school camp with no clean toilet in sight. The Looway Pee Funnel is built for all of it — stand up, stay covered, and never let your skin, or your daughter&apos;s, touch a dirty seat again.
        </p>

        {/* 4 Cards Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl sm:rounded-3xl border border-[#f8dce8] bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Soft Pink Icon Box */}
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#fdeef4] text-[#a81a57] mb-4 shadow-2xs">
                    <IconComp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#5A0E30] mb-2 leading-snug">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs sm:text-sm text-[#2A1620]/75 leading-relaxed font-normal">
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
