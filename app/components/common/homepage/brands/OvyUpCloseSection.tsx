"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { addToCart } from "@/store/cartActions";
import { OvyPadsDetail } from "./OvyPadsDetail";
import { OvyCupDetail } from "./OvyCupDetail";
import { OvyLinersDetail } from "./OvyLinersDetail";

type TabType = "Pads" | "Cup" | "Liners";

interface OvyUpCloseSectionProps {
  productsBySlug?: Record<string, any>;
}

export function OvyUpCloseSection({ productsBySlug }: OvyUpCloseSectionProps) {
  const [activeMobileTab, setActiveMobileTab] = useState<TabType>("Pads");

  const handleAddCup = () => {
    const cupProduct = productsBySlug?.["menstrual-cup"];
    const variantId = cupProduct?.variants?.[0]?.id || cupProduct?.id || "menstrual-cup";
    addToCart(variantId);
  };

  const handleAddLiners = () => {
    const linerProduct = productsBySlug?.["ovy-daily-panty-liners"];
    const variantId = linerProduct?.variants?.[0]?.id || linerProduct?.id || "ovy-daily-panty-liners";
    addToCart(variantId);
  };

  const scrollToQuiz = () => {
    const quizEl = document.getElementById("find-my-fit");
    if (quizEl) {
      quizEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      
      {/* =================================================================== */}
      {/* DESKTOP VIEW (hidden md:block): Renders 3 separate full-width sections */}
      {/* =================================================================== */}
      <div className="hidden md:block">
        <OvyPadsDetail />
        <OvyCupDetail productsBySlug={productsBySlug} />
        <OvyLinersDetail productsBySlug={productsBySlug} />
      </div>

      {/* =================================================================== */}
      {/* MOBILE VIEW (block md:hidden): Single merged component with tabs   */}
      {/* =================================================================== */}
      <div className="block md:hidden bg-[#FAF5E8] py-8 px-4">
        
        {/* Mobile Top Kicker + Tab Capsule Switcher */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold tracking-widest text-[#602E55] uppercase block mb-2.5">
            UP CLOSE
          </span>

          <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200/90 shadow-xs w-full max-w-xs justify-between">
            {(["Pads", "Cup", "Liners"] as TabType[]).map((tab) => {
              const isActive = activeMobileTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveMobileTab(tab)}
                  className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#602E55] text-white shadow-xs"
                      : "text-[#5C524D] hover:text-[#602E55]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* MOBILE TAB 1: PADS                                                  */}
        {/* ------------------------------------------------------------------- */}
        {activeMobileTab === "Pads" && (
          <div className="space-y-6">
            {/* Diagram Box with Purple Beaded Frame */}
            <div className="relative w-full aspect-square max-w-sm mx-auto">
              <div
                className="relative h-full w-full rounded-3xl p-4 shadow-xs border border-purple-200/50"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="5"
                    width="calc(100% - 10px)"
                    height="calc(100% - 10px)"
                    rx="20"
                    fill="none"
                    stroke="#8C4F7C"
                    strokeWidth="5"
                    strokeDasharray="0 12"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2">
                  <Image
                    src="/ovy/pad-callouts.jpg"
                    alt="Four layers pad diagram"
                    fill
                    className="object-contain p-1"
                    priority
                  />
                </div>

                {/* Twist Test Overlay Box */}
                <div className="absolute bottom-3 right-3 max-w-[150px] bg-white rounded-2xl p-2 shadow-lg border border-purple-100/80 z-10">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-purple-50 mb-1">
                    <Image
                      src="/ovy/pad-twist.jpg"
                      alt="The twist test"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[9px] text-[#4A3B47] leading-tight font-medium">
                    The twist test: a used pad, wrung out. The core keeps what it took in.
                  </p>
                </div>
              </div>
            </div>

            {/* Title Block */}
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#602E55] uppercase block mb-1">
                NOT YOUR AVERAGE PAD
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1915] leading-snug">
                Four layers, and nothing you would not want next to your skin.
              </h2>
            </div>

            {/* Numbered Layers List (01 - 04) */}
            <div className="divide-y divide-[#EAE1D3] border-t border-b border-[#EAE1D3]">
              <div className="py-3 flex items-start gap-3">
                <span className="font-serif text-lg font-normal text-[#602E55] w-6 shrink-0">
                  01
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#1F1915]">
                    Organic top sheet
                  </h3>
                  <p className="text-[11px] text-[#5C524D] mt-0.5 leading-relaxed">
                    100% organic, cottony-soft, hypoallergenic fibres. Rash-free, never a plastic feel.
                  </p>
                </div>
              </div>

              <div className="py-3 flex items-start gap-3">
                <span className="font-serif text-lg font-normal text-[#602E55] w-6 shrink-0">
                  02
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#1F1915]">
                    Acquisition layer
                  </h3>
                  <p className="text-[11px] text-[#5C524D] mt-0.5 leading-relaxed">
                    Natural fibres pull fluid away from the skin fast, so the surface stays dry.
                  </p>
                </div>
              </div>

              <div className="py-3 flex items-start gap-3">
                <span className="font-serif text-lg font-normal text-[#602E55] w-6 shrink-0">
                  03
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#1F1915]">
                    Super-absorbent core
                  </h3>
                  <p className="text-[11px] text-[#5C524D] mt-0.5 leading-relaxed">
                    A gel core that locks fluid and odour at source, instead of perfuming over it. Twist a used pad and nothing comes back out.
                  </p>
                </div>
              </div>

              <div className="py-3 flex items-start gap-3">
                <span className="font-serif text-lg font-normal text-[#602E55] w-6 shrink-0">
                  04
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#1F1915]">
                    Breathable backsheet
                  </h3>
                  <p className="text-[11px] text-[#5C524D] mt-0.5 leading-relaxed">
                    Lets heat out, so there is no sweat build-up in an Indian summer. Extra-wide wings hold everything in place; the XL+ adds dual leak guards.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "No chlorine bleach",
                "No parabens",
                "No fragrance",
                "No dyes",
                "No synthetic plastics",
              ].map((pill) => (
                <span
                  key={pill}
                  className="bg-[#F5EFF6] text-[#602E55] text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#E8DAEC]"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Footer Note */}
            <p className="text-[11px] text-[#6B5E57] leading-relaxed">
              Every pad comes with its own biodegradable, compostable disposal bag. Roll, seal, bin. Never flush.
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MOBILE TAB 2: CUP                                                   */}
        {/* ------------------------------------------------------------------- */}
        {activeMobileTab === "Cup" && (
          <div className="space-y-5">
            {/* Swim Model Image Box with Magenta Beaded Frame */}
            <div className="relative w-full aspect-square max-w-xs mx-auto">
              <div
                className="relative h-full w-full rounded-3xl p-3 shadow-xs border border-pink-200/60 overflow-hidden"
                style={{ backgroundColor: "#FCE8F3" }}
              >
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="5"
                    width="calc(100% - 10px)"
                    height="calc(100% - 10px)"
                    rx="20"
                    fill="none"
                    stroke="#C0428A"
                    strokeWidth="5"
                    strokeDasharray="0 12"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/ovy/m2-swim.jpg"
                    alt="Ovy Menstrual Cup Swim Model"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Title Block */}
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#602E55] uppercase block mb-1">
                OVY MENSTRUAL CUP
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1915] leading-snug">
                Three sizes. One price.
              </h2>
              <div className="font-serif italic text-lg font-normal text-[#C0428A] mt-0.5">
                Choose by fit, not by age.
              </div>
              <p className="text-[11px] text-[#5C524D] mt-2 leading-relaxed">
                Cervix height decides first, then flow, then whether you have given birth vaginally. Not age, not weight, and never budget: every size costs the same. Up to 12 hours between changes, 100% medical-grade silicone, and a cotton pouch in the box.
              </p>
            </div>

            {/* 3 Size Cards Grid (3 Columns on Mobile) */}
            <div className="grid grid-cols-3 gap-2">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-2.5 border border-pink-100 text-center flex flex-col items-center">
                <div className="relative w-12 h-12 mb-1">
                  <Image
                    src="/ovy/cup-xs.jpg"
                    alt="Teen XS"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-[11px] text-[#1F1915] leading-tight">
                  Teen XS <span className="font-medium text-[#602E55]">16ml</span>
                </h3>
                <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                  PINK
                </span>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-2.5 border border-pink-100 text-center flex flex-col items-center">
                <div className="relative w-12 h-12 mb-1">
                  <Image
                    src="/ovy/cup-m.jpg"
                    alt="Medium"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-[11px] text-[#1F1915] leading-tight">
                  Medium <span className="font-medium text-[#602E55]">25ml</span>
                </h3>
                <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5 leading-none">
                  PURPLE OR RAINBOW
                </span>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-2.5 border border-pink-100 text-center flex flex-col items-center">
                <div className="relative w-12 h-12 mb-1">
                  <Image
                    src="/ovy/cup-l.jpg"
                    alt="Large"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-[11px] text-[#1F1915] leading-tight">
                  Large <span className="font-medium text-[#602E55]">35ml</span>
                </h3>
                <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                  WHITE
                </span>
              </div>
            </div>

            {/* 3 Stat Boxes Grid (3 Columns on Mobile) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#F8E7F1]/70 rounded-2xl p-2.5 border border-pink-100 text-left">
                <div className="font-serif text-base font-bold text-[#602E55]">
                  12 hrs
                </div>
                <p className="text-[9px] text-[#5C524D] leading-tight mt-0.5">
                  between changes, swim and sleep included
                </p>
              </div>

              <div className="bg-[#F8E7F1]/70 rounded-2xl p-2.5 border border-pink-100 text-left">
                <div className="font-serif text-base font-bold text-[#602E55]">
                  Years
                </div>
                <p className="text-[9px] text-[#5C524D] leading-tight mt-0.5">
                  from one cup. Replace every 2 to 3 for best hygiene
                </p>
              </div>

              <div className="bg-[#F8E7F1]/70 rounded-2xl p-2.5 border border-pink-100 text-left">
                <div className="font-serif text-base font-bold text-[#602E55]">
                  3
                </div>
                <p className="text-[9px] text-[#5C524D] leading-tight mt-0.5">
                  sizes, four colours, one price
                </p>
              </div>
            </div>

            {/* Mobile Cup Action Buttons */}
            <div className="space-y-2">
              {/* Full Width Top Button */}
              <button
                onClick={handleAddCup}
                className="w-full bg-[#602E55] text-white rounded-full py-3 text-xs font-bold hover:bg-[#4A2040] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add, ₹459
              </button>

              {/* Side-by-Side 2 Buttons Row */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/product-detail/ovy-cup"
                  className="bg-[#602E55] text-white rounded-full py-2.5 px-3 text-xs font-semibold hover:bg-[#4A2040] transition-colors flex items-center justify-center gap-1 text-center"
                >
                  Shop the cup <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={scrollToQuiz}
                  className="border border-[#602E55] text-[#602E55] rounded-full py-2.5 px-3 text-xs font-semibold hover:bg-pink-50 transition-colors text-center"
                >
                  Find my size
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* MOBILE TAB 3: LINERS                                                */}
        {/* ------------------------------------------------------------------- */}
        {activeMobileTab === "Liners" && (
          <div className="space-y-5">
            {/* Cotton Flower Image Box with Blue Beaded Frame */}
            <div className="relative w-full aspect-square max-w-xs mx-auto">
              <div
                className="relative h-full w-full rounded-3xl p-3 shadow-xs border border-blue-200/60"
                style={{ backgroundColor: "#E3F2FD" }}
              >
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="5"
                    width="calc(100% - 10px)"
                    height="calc(100% - 10px)"
                    rx="20"
                    fill="none"
                    stroke="#1E6091"
                    strokeWidth="5"
                    strokeDasharray="0 12"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2">
                  <Image
                    src="/ovy/liner-cotton.jpg"
                    alt="Ovy Daily Liner Cotton Soft Top"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Title Block */}
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#602E55] uppercase block mb-1">
                OVY DAILY LINERS
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F1915] leading-snug">
                Fresh every day,
              </h2>
              <div className="font-serif italic text-lg font-normal text-[#2563EB] mt-0.5">
                the clean way.
              </div>
              <p className="text-[11px] text-[#5C524D] mt-2 leading-relaxed">
                About 1mm thin and 190mm long, with a breathable, cottony-soft top sheet, no added fragrance and no added dyes. Individually wrapped, so one lives in every bag.
              </p>
            </div>

            {/* Quote Box */}
            <div className="bg-white rounded-r-2xl border-l-4 border-[#2563EB] p-3.5 shadow-2xs">
              <p className="font-serif text-xs font-medium text-[#1F1915] italic">
                “If it is your period, it is a pad. If it is everything in between, it is a liner.”
              </p>
            </div>

            {/* 2-Column Checkmarks Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#1F1915]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>Everyday discharge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>Spotting before or after a period</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>Light bladder leaks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>Backup with a cup on light days</span>
              </div>
            </div>

            {/* 3 Stat Boxes Grid (3 Columns on Mobile) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-2xl p-2.5 border border-blue-100 shadow-2xs text-center">
                <div className="font-serif text-lg font-bold text-[#602E55]">
                  40
                </div>
                <div className="text-[10px] font-bold text-[#1F1915] mt-0.5">
                  about 10 days
                </div>
                <div className="text-[8px] text-gray-400">
                  Trying Ovy
                </div>
              </div>

              <div className="bg-white rounded-2xl p-2.5 border border-blue-100 shadow-2xs text-center">
                <div className="font-serif text-lg font-bold text-[#602E55]">
                  60
                </div>
                <div className="text-[10px] font-bold text-[#1F1915] mt-0.5">
                  about a fortnight
                </div>
                <div className="text-[8px] text-gray-400">
                  Our pick for daily wear
                </div>
              </div>

              <div className="bg-white rounded-2xl p-2.5 border border-blue-100 shadow-2xs text-center">
                <div className="font-serif text-lg font-bold text-[#602E55]">
                  80
                </div>
                <div className="text-[10px] font-bold text-[#1F1915] mt-0.5">
                  about three weeks
                </div>
                <div className="text-[8px] text-gray-400">
                  Best value per liner
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 leading-tight">
              At a fresh liner every 3 to 4 hours, a full day is about four.
            </p>

            {/* Mobile Liners Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleAddLiners}
                className="w-full bg-[#602E55] text-white rounded-full py-3 text-xs font-bold hover:bg-[#4A2040] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add, from ₹269
              </button>

              <Link
                href="/product-detail/ovy-liners"
                className="w-full bg-[#602E55] text-white rounded-full py-2.5 text-xs font-semibold hover:bg-[#4A2040] transition-colors flex items-center justify-center gap-1.5 text-center shadow-xs"
              >
                Shop liners <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
