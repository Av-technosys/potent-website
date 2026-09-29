"use client";

import { useState } from "react";
import Image from "next/image";

type TabType = "Pads" | "Cup" | "Liners";

interface LayerDetail {
  num: string;
  title: string;
  desc: string;
}

interface ContentData {
  kicker: string;
  title: string;
  image: string;
  showTwistOverlay: boolean;
  twistImage?: string;
  twistText?: string;
  layers: LayerDetail[];
  pills: string[];
  footerNote: string;
}

const CONTENT_BY_TAB: Record<TabType, ContentData> = {
  Pads: {
    kicker: "NOT YOUR AVERAGE PAD",
    title: "Four layers, and nothing you would not want next to your skin.",
    image: "/ovy/pad-callouts.jpg",
    showTwistOverlay: true,
    twistImage: "/ovy/pad-twist.jpg",
    twistText:
      "The twist test: a used pad, wrung out. The core keeps what it took in.",
    layers: [
      {
        num: "01",
        title: "Organic top sheet",
        desc: "100% organic, cottony-soft, hypoallergenic fibres. Rash-free, never a plastic feel.",
      },
      {
        num: "02",
        title: "Acquisition layer",
        desc: "Natural fibres pull fluid away from the skin fast, so the surface stays dry.",
      },
      {
        num: "03",
        title: "Super-absorbent core",
        desc: "A gel core that locks fluid and odour at source, instead of perfuming over it. Twist a used pad and nothing comes back out.",
      },
      {
        num: "04",
        title: "Breathable backsheet",
        desc: "Lets heat out, so there is no sweat build-up in an Indian summer. Extra-wide wings hold everything in place; the XL+ adds dual leak guards.",
      },
    ],
    pills: [
      "No chlorine bleach",
      "No parabens",
      "No fragrance",
      "No dyes",
      "No synthetic plastics",
    ],
    footerNote:
      "Every pad comes with its own biodegradable, compostable disposal bag. Roll, seal, bin. Never flush.",
  },
  Cup: {
    kicker: "100% MEDICAL-GRADE SILICONE",
    title: "Flexible, zero-waste protection for ultimate freedom.",
    image: "/ovy/cup-m.jpg",
    showTwistOverlay: false,
    layers: [
      {
        num: "01",
        title: "Medical-grade silicone",
        desc: "Biocompatible, non-reactive, and free of toxins for delicate internal skin.",
      },
      {
        num: "02",
        title: "Suction seal rim",
        desc: "Engineered rim forms a leak-proof seal during swim, sport, and sleep.",
      },
      {
        num: "03",
        title: "Textured grip stem",
        desc: "Ridged base and flexible stem ensure painless, easy insertion and removal.",
      },
      {
        num: "04",
        title: "10-year durability",
        desc: "Sanitize and reuse for years, cutting single-use menstrual waste to zero.",
      },
    ],
    pills: [
      "100% Medical Grade",
      "BPA Free",
      "Hypoallergenic",
      "10-Year Lifespan",
      "Zero Waste",
    ],
    footerNote:
      "Includes a breathable cotton storage pouch and step-by-step sterilization guide.",
  },
  Liners: {
    kicker: "DAILY FRESHNESS & SPOT PROTECTION",
    title: "Feather-light, ultra-thin liners for every day confidence.",
    image: "/ovy/liner-cotton.jpg",
    showTwistOverlay: false,
    layers: [
      {
        num: "01",
        title: "100% Organic top layer",
        desc: "Soft cotton cover for daily vaginal discharge and light spot days.",
      },
      {
        num: "02",
        title: "Breathable air-flow core",
        desc: "Permeable backing allows skin to breathe naturally, eliminating odor.",
      },
      {
        num: "03",
        title: "Contoured panty fit",
        desc: "Adheres securely without twisting or bunching under seamless underwear.",
      },
      {
        num: "04",
        title: "Individual paper wrap",
        desc: "Completely plastic-free disposal wrapper for discreet carrying.",
      },
    ],
    pills: [
      "No chlorine bleach",
      "No parabens",
      "No fragrance",
      "Ultra-thin",
      "Compostable Bag",
    ],
    footerNote:
      "Individually wrapped in compostable envelopes for on-the-go freshness.",
  },
};

export function OvyFourLayers() {
  const [activeTab, setActiveTab] = useState<TabType>("Pads");
  const content = CONTENT_BY_TAB[activeTab];

  return (
    <section className="w-full bg-[#FAF5E8] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header: Kicker + Tab Switcher */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[11px] font-bold tracking-widest text-[#602E55] uppercase block mb-3">
            UP CLOSE
          </span>

          {/* Tab Selector Capsule */}
          <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200/80 shadow-xs">
            {(["Pads", "Cup", "Liners"] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 sm:px-7 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Visual Column: Diagram / Image Box with Beaded Dot Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
              
              {/* Beaded Dot Border Outer Container */}
              <div
                className="relative h-full w-full rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-200/40"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                {/* SVG Purple Beaded Frame Ring */}
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1.5 sm:p-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="6"
                    width="calc(100% - 12px)"
                    height="calc(100% - 12px)"
                    rx="22"
                    fill="none"
                    stroke="#8C4F7C"
                    strokeWidth="6"
                    strokeDasharray="0 14"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Main Product / Diagram Image */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2">
                  <Image
                    src={content.image}
                    alt={content.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 550px"
                    priority
                  />
                </div>

                {/* Inset Overlay Photo (Twist Test) - Bottom Right */}
                {content.showTwistOverlay && content.twistImage && (
                  <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 max-w-[160px] sm:max-w-[210px] bg-white rounded-2xl p-2 sm:p-3 shadow-xl border border-purple-100/80 z-10 transition-all">
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-purple-50 mb-1.5">
                      <Image
                        src={content.twistImage}
                        alt="The twist test"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-[#4A3B47] leading-tight font-medium">
                      {content.twistText}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Text Spec Column: Numbered Items, Pills & Footer Note */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Kicker & Title */}
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-widest text-[#602E55] uppercase block mb-1.5">
                {content.kicker}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-4xl font-bold text-[#1F1915] leading-snug">
                {content.title}
              </h2>
            </div>

            {/* Numbered Layers List (01 - 04) */}
            <div className="divide-y divide-[#EAE1D3] border-t border-b border-[#EAE1D3] mb-6">
              {content.layers.map((layer) => (
                <div key={layer.num} className="py-3.5 sm:py-4 flex items-start gap-4">
                  <span className="font-serif text-xl sm:text-2xl font-normal text-[#602E55] w-7 sm:w-8 shrink-0">
                    {layer.num}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1F1915] leading-snug">
                      {layer.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C524D] mt-0.5 leading-relaxed font-normal">
                      {layer.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {content.pills.map((pill) => (
                <span
                  key={pill}
                  className="bg-[#F5EFF6] text-[#602E55] text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#E8DAEC] shadow-2xs"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Bottom Note */}
            <p className="text-xs text-[#6B5E57] leading-relaxed font-normal">
              {content.footerNote}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
