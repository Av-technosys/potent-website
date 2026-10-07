/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Filter, Droplets, ShieldCheck } from "lucide-react";

export default function FunnelHowItWorksSection() {
  const steps = [
    {
      step: "1",
      icon: Filter,
      title: "Cover the whole area",
      desc: (
        <>
          Hold the wide opening flush against your body so the back edge sits{" "}
          <strong className="font-bold text-[#5A0E30]">just behind where you pee</strong> — about a thumb&apos;s width back, not forward. This is the seal, and it&apos;s the whole secret.
        </>
      ),
    },
    {
      step: "2",
      icon: Droplets,
      title: "Tilt down, start slow",
      desc: (
        <>
          Angle the spout down and away, then{" "}
          <strong className="font-bold text-[#5A0E30]">start your stream gently</strong> until the seal feels solid. Standing slightly forward with feet apart helps the funnel catch every drop.
        </>
      ),
    },
    {
      step: "3",
      icon: ShieldCheck,
      title: "Relax & go",
      desc: (
        <>
          Once the seal holds, just pee normally. When you finish, slide the funnel forward along the skin to catch the last drops, give it a shake, and slip it back into its pouch.
        </>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#fcf8f3] py-12 sm:py-18 lg:py-22 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2 sm:mb-3">
            WHY IT DOESN&apos;T LEAK
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight">
            How it works
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#2A1620]/75 leading-relaxed font-normal">
            It&apos;s simpler than it looks. The wide, soft rim makes a gentle seal against your body, and the ergonomic shape channels the flow down and away. Get the seal right and gravity does the rest — no leaks, no mess, nothing on you.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
          {steps.map((st, idx) => {
            const IconComp = st.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#f8dce8] bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Large Background Step Number */}
                <span className="absolute top-3 right-5 font-serif text-5xl sm:text-6xl font-extrabold text-[#f8dce8]/70 select-none">
                  {st.step}
                </span>

                {/* Crimson Rounded Square Icon Box with Yellow Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a81a57] text-[#F4C430] mb-5 relative z-10 shadow-2xs">
                  <IconComp className="h-6 w-6 stroke-[2.2]" />
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#5A0E30] mb-2.5 relative z-10">
                  {st.title}
                </h3>
                <div className="text-xs sm:text-sm text-[#2A1620]/75 leading-relaxed font-normal relative z-10">
                  {st.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Practice Makes It Foolproof Banner Callout */}
        <div className="mt-8 rounded-xl sm:rounded-2xl bg-[#fdeef4] border-l-4 border-[#a81a57] p-4 sm:p-5 text-xs sm:text-sm text-[#2A1620]/80 leading-relaxed font-normal">
          <strong className="text-[#a81a57] font-bold">Practice makes it foolproof.</strong>{" "}
          One try in the shower at home and you&apos;ll never look back — almost every woman gets it on the first or second go. See the full step-by-step and the practice guide below.
        </div>
      </div>
    </section>
  );
}
