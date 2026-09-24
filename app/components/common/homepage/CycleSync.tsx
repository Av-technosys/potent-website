"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";

export function CycleSync() {
  const features = [
    {
      title: "Timed to you",
      description: "Lands about 5 days before you are due, every cycle.",
    },
    {
      title: "Save on every box",
      description: "A subscriber price on every delivery.",
    },
    {
      title: "You stay in charge",
      description: "Pause, skip or cancel in two clicks.",
    },
    {
      title: "A little extra",
      description: "A surprise gift in every third box.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#E5F5F6]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center">
        {/* BADGE */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#016271] uppercase mb-3 block">
          SUBSCRIBE AND CYCLE-SYNC
        </span>

        {/* TITLE */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C2424] leading-tight mb-4">
          Your box, on your cycle.
        </h2>

        {/* SUBTITLE */}
        <p className="text-sm sm:text-base text-[#4F6467] max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12 font-normal">
          Tell us three dates once. Your box arrives about five days before your
          period, every cycle, with a saving on every order and nothing to
          remember.
        </p>

        {/* 4 CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <Check className="w-5 h-5 text-[#016271] stroke-[2.5] mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-[#1C2424] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C7275] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTONS ROW */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12">
          <a
            href="#subscribe"
            className="w-full sm:w-auto bg-[#016271] hover:bg-[#004851] text-white px-7 py-3.5 rounded-full font-medium text-sm sm:text-base transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            Start my subscription <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto border border-[#016271] text-[#016271] hover:bg-[#016271]/10 px-7 py-3.5 rounded-full font-medium text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center"
          >
            How Cycle-Sync works
          </a>
        </div>
      </div>
    </section>
  );
}
