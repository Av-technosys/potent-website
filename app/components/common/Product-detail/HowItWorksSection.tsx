/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Clock, ShieldCheck, Maximize2 } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "1",
      icon: Maximize2,
      title: "Open & use",
      desc: "Spread the wide mouth open and go directly into the bag — for urine or vomit, standing, seated or lying down.",
    },
    {
      num: "2",
      icon: Clock,
      title: "It solidifies",
      desc: "The absorbent strip locks up to 700 ml of liquid into a firm gel in about 60 seconds — and controls odour at the same time.",
    },
    {
      num: "3",
      icon: ShieldCheck,
      title: "Seal & dispose",
      desc: "Press the sealable closure firmly until it locks — the bag is leak-proof and odour-locked — then drop it in any rubbish bin. Never flush; even recyclable material can block drains.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#F6F1E7] scroll-mt-32 sm:scroll-mt-36 py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl">
          {/* Subtitle Kicker */}
          <span className="text-[10.5px] sm:text-[11px] font-extrabold tracking-widest text-[#0E5C3A] uppercase">
            THE SCIENCE, SIMPLY
          </span>

          {/* Main Heading */}
          <h2 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#0A4A2E]">
            How it works
          </h2>

          {/* Subtitle Description */}
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base leading-relaxed text-[#17271E]/75 font-normal max-w-2xl">
            A super-absorbent strip — the same kind of material used inside baby diapers —
            does the heavy lifting. It turns liquid into a firm gel, so there&apos;s nothing
            left to spill, leak or smell.
          </p>
        </div>

        {/* 3 Steps Grid: Horizontal scroll on mobile, 3 cols on desktop */}
        <div className="mt-4 flex items-center justify-between md:hidden ">
          <span className="text-[10.5px] font-bold text-[#0E5C3A]">Swipe steps →</span>
          <span className="text-[10px] font-medium text-[#17271E]/50">3 easy steps</span>
        </div>
        <div className="mt-2 sm:mt-10 border border-blue-500  flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-2.5 sm:gap-6 pb-2 md:pb-0 no-scrollbar [::-webkit-scrollbar]:hidden">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="relative flex w-[78vw] max-w-[275px] shrink-0 md:w-auto snap-start flex-col justify-between overflow-hidden rounded-2xl border border-[#E4DED0] bg-white p-4 sm:p-6 shadow-2xs transition-all hover:shadow-md"
              >
                {/* Background Step Watermark Number */}
                <span className="absolute top-2 right-4 pointer-events-none font-serif text-4xl sm:text-5xl font-extrabold text-[#E4F0E8] select-none">
                  {step.num}
                </span>

                <div>
                  {/* Dark Green Icon Container with Gold Icon */}
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#0E5C3A] text-[#F4C430] shadow-2xs">
                    <IconComp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
                  </div>

                  {/* Step Title */}
                  <h3 className="mt-3.5 sm:mt-5 font-sans text-base sm:text-lg font-bold text-[#0A4A2E]">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-[#17271E]/75 font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-4 sm:mt-6 flex items-start sm:items-center gap-3 rounded-2xl border-l-4 border-l-[#0E5C3A] border border-[#E4DED0] bg-[#EBF5EF] p-3.5 sm:p-4 text-xs sm:text-sm text-[#0A4A2E] shadow-2xs">
          <div>
            <strong className="font-bold text-[#0A4A2E]">Reusable until full.</strong>{" "}
            Each bag holds up to 700 ml across 2–3 uses. Keep it sealed between uses, and dispose of it once full or within 24 hours of first opening.
          </div>
        </div>
      </div>
    </section>

  );
}
