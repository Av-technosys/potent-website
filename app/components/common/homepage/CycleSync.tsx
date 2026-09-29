"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";

interface CycleSyncProps {
  bgColor?: string;
  badgeColor?: string;
  accentColor?: string;
  buttonBgColor?: string;
}

export function CycleSync({
  bgColor = "#E5F5F6",
  badgeColor = "#016271",
  accentColor = "#016271",
  buttonBgColor = "#016271",
}: CycleSyncProps) {
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
    <section className="py-10 sm:py-16 md:py-20" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center">
        {/* BADGE */}
        <span
          className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-2 sm:mb-3 block"
          style={{ color: badgeColor }}
        >
          SUBSCRIBE AND CYCLE-SYNC
        </span>

        {/* TITLE */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C2424] leading-tight mb-3 sm:mb-4">
          Your box, on your cycle.
        </h2>

        {/* SUBTITLE */}
        <p className="text-xs sm:text-base text-[#4F6467] max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-10 md:mb-12 font-normal">
          Tell us three dates once. Your box arrives about five days before your
          period, every cycle, with a saving on every order and nothing to
          remember.
        </p>

        {/* 4 CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-left">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3.5 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <Check
                  className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] mb-2 sm:mb-4"
                  style={{ color: accentColor }}
                />
                <h3 className="text-xs sm:text-lg font-bold text-[#1C2424] mb-1 sm:mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-sm text-[#5C7275] leading-snug sm:leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTONS ROW */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12">
          <a
            href="#subscribe"
            className="w-full sm:w-auto text-white px-7 py-3 sm:py-3.5 rounded-full font-medium text-sm sm:text-base transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: buttonBgColor }}
          >
            Start my subscription <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#how-it-works"
            className="hidden sm:flex w-full sm:w-auto border px-7 py-3.5 rounded-full font-medium text-sm sm:text-base transition-colors cursor-pointer items-center justify-center"
            style={{
              borderColor: buttonBgColor,
              color: buttonBgColor,
            }}
          >
            How Cycle-Sync works
          </a>
        </div>
      </div>
    </section>
  );
}
