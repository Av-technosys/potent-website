/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Sparkles,
  Flame,
  Calendar,
  ArrowRight,
} from "lucide-react";

export function SubNavStrap() {
  const pathname = usePathname();
  const [brandsOpen, setBrandsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 hidden border-b border-gray-200/80 bg-[#FAF9F6]/95 text-gray-700 shadow-xs backdrop-blur-md md:block">
      <div className="container mx-auto flex h-13 items-center justify-center px-4 md:px-16">
        <nav className="flex items-center space-x-7 text-xs font-semibold tracking-wider text-gray-600 uppercase">
          {/* Best Sellers */}
          <Link
            href="/shop"
            className={`flex items-center gap-1.5 transition-colors hover:text-[#1A8D91] ${
              pathname === "/shop" ? "font-bold text-[#1A8D91]" : ""
            }`}
          >
            <Flame className="h-4 w-4 text-orange-500" />
            <span>Best Sellers</span>
          </Link>

          {/* Brands Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBrandsOpen(true)}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <button
              className={`flex items-center gap-1 py-2 transition-colors hover:text-[#1A8D91] ${
                pathname === "/looway" || pathname === "/ovy"
                  ? "font-bold text-[#1A8D91]"
                  : ""
              }`}
            >
              <span>Brands</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  brandsOpen ? "rotate-180 text-[#1A8D91]" : ""
                }`}
              />
            </button>

            {/* Rich Mega Dropdown Menu */}
            {brandsOpen && (
              <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-1/2 z-50 mt-1 w-[520px] -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-4.5 shadow-2xl ring-1 ring-black/5 transition-all duration-200">
                <div className="mb-3.5 flex items-center justify-between border-b border-gray-100 px-1 pb-2.5">
                  <span className="text-xs font-bold tracking-wider text-gray-800 normal-case uppercase">
                    Our Specialized Brands
                  </span>
                  <Link
                    href="/shop"
                    onClick={() => setBrandsOpen(false)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#1A8D91] normal-case hover:underline"
                  >
                    <span>View All Products</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Ovy Card */}
                  <Link
                    href="/ovy"
                    onClick={() => setBrandsOpen(false)}
                    className="group relative flex min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-[#AF71A7]/25 bg-gradient-to-br from-[#FFF4F9] via-[#FDF0F7] to-[#FCE7F3] p-4 shadow-sm transition-all hover:border-[#AF71A7]/60 hover:shadow-lg"
                  >
                    {/* Large Circle Brand Background Graphic */}
                    <div className="absolute -top-3 -right-3 h-36 w-36 overflow-hidden rounded-full border-4 border-white/90 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                      <Image
                        src="/ovy.png"
                        alt="Ovy Brand"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 max-w-[62%] space-y-1 text-left">
                      <div className="text-lg font-black tracking-tight text-gray-900 normal-case">
                        Ovy
                      </div>
                      <div className="text-[10px] font-bold tracking-wider text-[#AF71A7] uppercase">
                        Menstrual Care
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-snug font-medium text-gray-600 normal-case">
                        Organic pads, period panties & teen care
                      </p>
                    </div>

                    <div className="relative z-10 mt-3.5 self-start">
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#AF71A7] px-3.5 py-1.5 text-[11px] font-bold text-white normal-case shadow-xs transition-all group-hover:bg-[#94558e] group-hover:shadow-md">
                        <span>Explore Ovy</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>

                  {/* Looway Card */}
                  <Link
                    href="/looway"
                    onClick={() => setBrandsOpen(false)}
                    className="group relative flex min-h-[195px] flex-col justify-between overflow-hidden rounded-2xl border border-[#016271]/25 bg-gradient-to-br from-[#F2FAF9] via-[#EBF7F9] to-[#E6F4F6] p-4 shadow-sm transition-all hover:border-[#016271]/60 hover:shadow-lg"
                  >
                    {/* Large Circle Brand Background Graphic */}
                    <div className="absolute -top-3 -right-3 h-36 w-36 overflow-hidden rounded-full border-4 border-white/90 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                      <Image
                        src="/loway.png"
                        alt="Looway Brand"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 max-w-[62%] space-y-1 text-left">
                      <div className="text-lg font-black tracking-tight text-gray-900 normal-case">
                        Looway
                      </div>
                      <div className="text-[10px] font-bold tracking-wider text-[#016271] uppercase">
                        Travel Hygiene
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-snug font-medium text-gray-600 normal-case">
                        Pee funnels, seat covers & travel kits
                      </p>
                    </div>

                    <div className="relative z-10 mt-3.5 self-start">
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#016271] px-3.5 py-1.5 text-[11px] font-bold text-white normal-case shadow-xs transition-all group-hover:bg-[#014c58] group-hover:shadow-md">
                        <span>Explore Looway</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Travel Hygiene */}
          <Link
            href="/looway"
            className={`transition-colors hover:text-[#1A8D91] ${
              pathname === "/looway" ? "font-bold text-[#1A8D91]" : ""
            }`}
          >
            Travel Hygiene
          </Link>

          {/* Menstrual Care */}
          <Link
            href="/ovy"
            className={`transition-colors hover:text-[#1A8D91] ${
              pathname === "/ovy" ? "font-bold text-[#1A8D91]" : ""
            }`}
          >
            Menstrual Care
          </Link>

          {/* Period Tracker */}
          <Link
            href="/period-log"
            className={`flex items-center gap-1 transition-colors hover:text-[#1A8D91] ${
              pathname === "/period-log" ? "font-bold text-[#1A8D91]" : ""
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-[#1A8D91]" />
            <span>Period Tracker</span>
            <span className="ml-0.5 rounded-full bg-[#1A8D91]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#1A8D91] lowercase">
              free
            </span>
          </Link>

          {/* Hygiene Quiz */}
          <Link
            href="/quiz"
            className={`flex items-center gap-1 transition-colors hover:text-[#1A8D91] ${
              pathname === "/quiz" ? "font-bold text-[#1A8D91]" : ""
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Hygiene Quiz</span>
          </Link>

          {/* About Us */}
          <Link
            href="/about"
            className={`transition-colors hover:text-[#1A8D91] ${
              pathname === "/about" ? "font-bold text-[#1A8D91]" : ""
            }`}
          >
            About Us
          </Link>

          {/* Blog */}
          <Link
            href="/blog"
            className={`transition-colors hover:text-[#1A8D91] ${
              pathname === "/blog" ? "font-bold text-[#1A8D91]" : ""
            }`}
          >
            Blog
          </Link>
        </nav>
      </div>
    </div>
  );
}
