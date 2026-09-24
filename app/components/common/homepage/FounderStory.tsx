"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function FounderStory() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#F8F6F1]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* LEFT SIDE IMAGE */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-sm max-w-md mx-auto lg:max-w-none">
              <Image
                src="/divitaji.jpg"
                alt="Divita Agarwal - Founder Potent Hygiene"
                width={600}
                height={700}
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* BADGE */}
            <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#016271] uppercase block">
              OUR STORY
            </span>

            {/* TITLE */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C2424] leading-[1.15]">
              Made by a woman who needed it herself.
            </h2>

            {/* QUOTE */}
            <p className="font-serif italic text-lg sm:text-xl lg:text-2xl text-[#016271] leading-relaxed font-medium">
              “I wanted the products I kept wishing existed: gentle on the body,
              honest on the label, and ready for the toilets we actually meet in
              India.”
            </p>

            {/* PARAGRAPH */}
            <p className="text-sm sm:text-base text-[#4F6467] leading-relaxed max-w-xl font-normal">
              Divita Agarwal founded Potent Hygiene in Jaipur with one idea:
              hygiene should fit real Indian lives, from a first period at
              school to a long train journey. Today Ovy looks after periods and
              Looway looks after journeys, both made in India and both built to
              be trusted.
            </p>

            {/* FOUNDER SIGNATURE / INFO */}
            <div className="pt-1">
              <h4 className="text-base font-bold text-[#1C2424]">
                Divita Agarwal
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                Founder, Potent Hygiene
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <a
                href="/about-us"
                className="bg-[#016271] hover:bg-[#004851] text-white px-7 py-3.5 rounded-full font-medium text-sm sm:text-base transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                Read our full story <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/shop"
                className="border border-[#016271] text-[#016271] hover:bg-[#016271]/10 px-7 py-3.5 rounded-full font-medium text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center"
              >
                Shop the range
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
