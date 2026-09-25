"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function FounderStory() {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-[#F8F6F1]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Mobile Header Layout (< lg): Circular Avatar Left + Header Right */}
        <div className="mb-4 flex items-start gap-4 lg:hidden">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
            <Image
              src="/divitaji.jpg"
              alt="Divita Agarwal - Founder Potent Hygiene"
              fill
              className="object-cover object-top"
              sizes="80px"
            />
          </div>
          <div>
            <span className="mb-1 block text-[11px] font-bold tracking-widest text-[#016271] uppercase">
              OUR STORY
            </span>
            <h2 className="font-serif text-lg font-bold leading-tight text-[#1C2424]">
              Made by a woman who needed it herself.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-14">
          {/* Desktop Left Image (lg:block, hidden on mobile < lg) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl shadow-sm lg:max-w-none">
              <Image
                src="/divitaji.jpg"
                alt="Divita Agarwal - Founder Potent Hygiene"
                width={600}
                height={700}
                className="h-auto w-full rounded-3xl object-cover"
              />
            </div>
          </div>

          {/* Content Container */}
          <div className="space-y-3 sm:space-y-5 lg:col-span-7">
            {/* Desktop Header Badge & Title (hidden on mobile < lg) */}
            <div className="hidden lg:block">
              <span className="mb-2 block text-xs font-semibold tracking-[0.2em] text-[#016271] uppercase">
                OUR STORY
              </span>
              <h2 className="font-serif text-3xl font-bold leading-[1.15] text-[#1C2424] sm:text-4xl lg:text-5xl">
                Made by a woman who needed it herself.
              </h2>
            </div>

            {/* Quote */}
            <p className="font-serif text-xs font-medium italic leading-relaxed text-[#016271] sm:text-xl lg:text-2xl">
              “I wanted the products I kept wishing existed: gentle on the body,
              honest on the label, and ready for the toilets we actually meet in
              India.”
            </p>

            {/* Paragraph (Desktop only) */}
            <p className="hidden text-sm font-normal leading-relaxed text-[#4F6467] sm:block sm:text-base">
              Divita Agarwal founded Potent Hygiene in Jaipur with one idea:
              hygiene should fit real Indian lives, from a first period at
              school to a long train journey. Today Ovy looks after periods and
              Looway looks after journeys, both made in India and both built to
              be trusted.
            </p>

            {/* Founder Signature / Info */}
            <div className="pt-1">
              <h4 className="text-sm font-bold text-[#1C2424] sm:text-base">
                Divita Agarwal
              </h4>
              <p className="text-xs font-normal text-gray-500">
                Founder, Potent Hygiene
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <a
                href="/about-us"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#016271] px-7 py-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#004851] sm:py-3.5 sm:text-base"
              >
                Read our full story <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/shop"
                className="hidden cursor-pointer items-center justify-center rounded-full border border-[#016271] px-7 py-3.5 font-medium text-[#016271] transition-colors hover:bg-[#016271]/10 sm:flex sm:text-base"
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
