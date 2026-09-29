"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function OvySizedToFlow() {
  return (
    <section className="w-full bg-[#FAF5E8] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="inline-block rounded-full border border-gray-200 bg-white/90 px-4 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest text-[#016271] uppercase mb-2 shadow-2xs">
            WHICH PAD IS YOURS?
          </span>
          <h2 className="font-serif text-2.5xl sm:text-5xl font-bold text-[#1F1915] leading-tight">
            Sized to your flow, not to an average.
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base font-normal text-[#5C524D] max-w-2xl mx-auto leading-relaxed px-1">
            Most brands sell one length. Ovy sells three, and a box you build yourself, because the same month has light days, heavy days and nights.
          </p>
        </div>

        {/* 4 Cards Grid - 2 COLUMNS ON MOBILE (< lg), 4 COLUMNS ON DESKTOP (lg:) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          
          {/* Card 1: L */}
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-3 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Top Beaded Dotted Strip */}
              <div
                className="w-full h-2.5 sm:h-3.5 rounded-t-lg sm:rounded-t-xl mb-2.5 sm:mb-4 overflow-hidden"
                style={{
                  backgroundColor: "#8C4F7C",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2.5' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "center",
                }}
              />
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#8C4F7C]">L</div>
              <div className="text-[10px] sm:text-xs font-bold text-gray-500 mt-0.5">240mm</div>

              <h3 className="font-serif text-xs sm:text-base font-bold text-[#1F1915] mt-2 sm:mt-3 leading-snug">
                Light days
              </h3>
              <p className="text-[10.5px] sm:text-xs text-[#5C524D] mt-1 sm:mt-1.5 leading-tight sm:leading-relaxed">
                School, work, the commute, the tail end of a period.
              </p>
            </div>

            <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-2 sm:pt-3">
              <div className="text-[9.5px] sm:text-[11px] text-gray-400 font-medium leading-tight">
                Holds up to 100ml · 4 to 6 hours
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-bold text-[#8C4F7C] hover:underline mt-2 sm:mt-3"
              >
                <span>Shop L</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: XL */}
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-3 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Top Beaded Dotted Strip */}
              <div
                className="w-full h-2.5 sm:h-3.5 rounded-t-lg sm:rounded-t-xl mb-2.5 sm:mb-4 overflow-hidden"
                style={{
                  backgroundColor: "#602E55",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2.5' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "center",
                }}
              />
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#602E55]">XL</div>
              <div className="text-[10px] sm:text-xs font-bold text-gray-500 mt-0.5">280mm</div>

              <h3 className="font-serif text-xs sm:text-base font-bold text-[#1F1915] mt-2 sm:mt-3 leading-snug">
                The everyday workhorse
              </h3>
              <p className="text-[10.5px] sm:text-xs text-[#5C524D] mt-1 sm:mt-1.5 leading-tight sm:leading-relaxed">
                Medium to heavy days, full school or office days.
              </p>
            </div>

            <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-2 sm:pt-3">
              <div className="text-[9.5px] sm:text-[11px] text-gray-400 font-medium leading-tight">
                Holds up to 120ml · up to 8 hours
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-bold text-[#602E55] hover:underline mt-2 sm:mt-3"
              >
                <span>Shop XL</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: XL+ */}
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-3 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Top Beaded Dotted Strip */}
              <div
                className="w-full h-2.5 sm:h-3.5 rounded-t-lg sm:rounded-t-xl mb-2.5 sm:mb-4 overflow-hidden"
                style={{
                  backgroundColor: "#C42B5B",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2.5' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "center",
                }}
              />
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#C42B5B]">XL+</div>
              <div className="text-[10px] sm:text-xs font-bold text-gray-500 mt-0.5">320mm</div>

              <h3 className="font-serif text-xs sm:text-base font-bold text-[#1F1915] mt-2 sm:mt-3 leading-snug">
                Heavy days and nights
              </h3>
              <p className="text-[10.5px] sm:text-xs text-[#5C524D] mt-1 sm:mt-1.5 leading-tight sm:leading-relaxed">
                Very heavy flow, overnight, postpartum, the first two days. A widened back and dual leak guards.
              </p>
            </div>

            <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-2 sm:pt-3">
              <div className="text-[9.5px] sm:text-[11px] text-gray-400 font-medium leading-tight">
                Holds up to 150ml · up to 8 hours
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-bold text-[#C42B5B] hover:underline mt-2 sm:mt-3"
              >
                <span>Shop XL+</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Mix (Purple Card) */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#602E55] text-white p-3 sm:p-5 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Top Beaded Dotted Strip (Yellow/Gold Dots) */}
              <div
                className="w-full h-2.5 sm:h-3.5 rounded-t-lg sm:rounded-t-xl mb-2.5 sm:mb-4 overflow-hidden"
                style={{
                  backgroundColor: "#E5A93C",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2.5' fill='%23602E55'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "center",
                }}
              />
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">Mix</div>
              <div className="text-[10px] sm:text-xs font-medium text-purple-200 mt-0.5">Any split of 21</div>

              <h3 className="font-serif text-xs sm:text-base font-bold text-white mt-2 sm:mt-3 leading-snug">
                Your own box
              </h3>
              <p className="text-[10.5px] sm:text-xs text-purple-100/90 mt-1 sm:mt-1.5 leading-tight sm:leading-relaxed">
                Flow changes across the month? Build 21 pads across L, XL and XL+. One flat price, whatever the split.
              </p>
            </div>

            <div className="mt-4 sm:mt-6 border-t border-purple-400/30 pt-2 sm:pt-3">
              <div className="text-[9.5px] sm:text-[11px] text-purple-200/80 font-medium leading-tight">
                Suggested mix: 6 L · 9 XL · 6 XL+
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-bold text-white hover:underline mt-2 sm:mt-3"
              >
                <span>Build your box</span>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Callout Row with Model Photo */}
        <div className="mt-8 sm:mt-12 max-w-4xl flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {/* Model Image with Purple Beaded Frame */}
          <div
            className="relative w-40 sm:w-60 aspect-[3/4] md:block hidden shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-md"
            style={{ backgroundColor: "#FAF3EB" }}
          >
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none p-1 sm:p-1.5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="4"
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                rx="16"
                fill="none"
                stroke="#602E55"
                strokeWidth="6"
                strokeDasharray="0 14"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl bg-purple-50">
              <Image
                src="/ovy/hero-pads.jpg"
                alt="Ovy model"
                fill
                className="object-cover"
                sizes="260px"
              />
            </div>
          </div>

          <p className="text-xs sm:text-base font-normal text-[#5C524D] leading-relaxed text-center sm:text-left max-w-xl">
            Buying for someone else and not sure of her size? Choose XL+, the most protective, or Mix Your Box so she gets every size.
          </p>
        </div>

      </div>
    </section>
  );
}
