"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BrandAccordion() {
  return (
    <section className="w-full border-b border-gray-100 bg-[#f4f1ec] py-10 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-6 space-y-2 text-center sm:mb-12 sm:space-y-3 md:mb-16">
          <span className="text-[11px] font-bold tracking-widest text-[#016271] uppercase sm:text-xs">
            ONE HOUSE, TWO RANGES
          </span>
          <h2 className="font-serif text-2xl leading-tight font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Periods, handled.<br className="sm:hidden" /> Journeys, handled.
          </h2>
          <p className="mx-auto hidden max-w-2xl text-sm leading-relaxed font-normal text-gray-600 sm:block sm:text-base md:text-lg">
            Two ranges with one promise between them: nothing about your body
            should ever make you pause your life.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-1 md:grid-cols-3 sm:gap-6 lg:gap-8">
          {/* Card 1: Ovy */}
          <Link
            href="/shop"
            className="group relative flex min-h-[200px] flex-col justify-between rounded-2xl border border-purple-100/50 bg-[#f5e7eb] p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:min-h-[380px] sm:rounded-[28px] sm:p-8 lg:p-10"
          >
            <div className="space-y-3 sm:space-y-6">
              {/* Mark / Logo */}
              <div className="flex h-10 items-center sm:h-16">
                <Image
                  src="/brand/ovy-mark.png"
                  alt="Ovy"
                  width={140}
                  height={80}
                  className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h3 className="font-serif text-xs font-bold leading-tight text-gray-900 sm:text-xl md:text-2xl">
                  Period and intimate care
                </h3>
                <p className="hidden text-sm leading-relaxed font-normal text-gray-600 sm:block sm:text-base">
                  Organic pads sized to your real flow, first-period kits, a
                  reusable cup and daily liners.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3 text-center sm:pt-8 sm:text-left">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#016271] shadow-xs transition-all duration-300 group-hover:bg-[#016271] group-hover:text-white sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm">
                Shop Ovy
                <ArrowRight className="hidden h-4 w-4 sm:inline-block" />
              </span>
            </div>
          </Link>

          {/* Card 2: Looway (with top patterned strip) */}
          <Link
            href="/looway-yatra-kit"
            className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-teal-100/50 bg-[#E6F4F6] p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:min-h-[380px] sm:rounded-[28px] sm:p-8 lg:p-10"
          >
            {/* Top Checkerboard Accent Pattern */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-[repeating-linear-gradient(45deg,#016271,#016271_10px,#E5C158_10px,#E5C158_20px)] opacity-90 sm:h-3 sm:bg-[repeating-linear-gradient(45deg,#016271,#016271_12px,#E5C158_12px,#E5C158_24px)]" />

            <div className="space-y-3 pt-1 sm:space-y-6 sm:pt-2">
              {/* Mark / Logo */}
              <div className="flex h-10 items-center sm:h-16">
                <Image
                  src="/brand/looway-mark.png"
                  alt="Looway"
                  width={160}
                  height={70}
                  className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h3 className="font-serif text-xs font-bold leading-tight text-gray-900 sm:text-xl md:text-2xl">
                  Travel and everyday hygiene
                </h3>
                <p className="hidden text-sm leading-relaxed font-normal text-gray-600 sm:block sm:text-base">
                  A stand-to-pee funnel, seat covers, pee and puke bags for
                  motion sickness and morning sickness, and a build-your-own
                  Yatra Kit. Bags and seat covers for all genders and all ages.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3 text-center sm:pt-8 sm:text-left">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#016271] shadow-xs transition-all duration-300 group-hover:bg-[#016271] group-hover:text-white sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm">
                Shop Looway
                <ArrowRight className="hidden h-4 w-4 sm:inline-block" />
              </span>
            </div>
          </Link>

          {/* Card 3: Wellness Hub (Coming soon) */}
          <div className="col-span-2 relative flex flex-row items-center justify-between rounded-2xl border border-amber-100/60 bg-[#f4eee2] p-4 shadow-2xs sm:col-span-1 sm:flex-col sm:justify-between sm:min-h-[380px] sm:rounded-[28px] sm:p-8 lg:p-10">
            <div className="space-y-0.5 sm:space-y-6">
              {/* Wordmark */}
              <div className="flex items-center sm:h-16">
                <span className="font-serif text-base font-bold tracking-tight text-gray-800 sm:text-2xl md:text-3xl">
                  Wellness Hub
                </span>
              </div>

              <div className="space-y-0.5 sm:space-y-2">
                <p className="text-xs font-normal text-gray-600 sm:font-serif sm:text-xl sm:font-bold sm:text-gray-900 md:text-2xl">
                  Free tools, not products
                </p>
                <p className="hidden text-sm leading-relaxed font-normal text-gray-600 sm:block sm:text-base">
                  Hormonal Health Decoder, Cycle Tracker, Build-Your-Kit and
                  Travel Architect. Our tools guide you. They do not diagnose.
                </p>
              </div>
            </div>

            {/* Coming Soon Pill */}
            <div className="shrink-0 sm:pt-8">
              <span className="inline-block rounded-full bg-[#EAE4D9] px-3.5 py-1.5 text-xs font-bold tracking-wide text-gray-600 sm:px-4 sm:py-2">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
