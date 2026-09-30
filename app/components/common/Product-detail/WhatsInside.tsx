"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface LayerInfo {
  id: number;
  title: string;
  sub: string;
  dotColor: string;
  bgTint: string;
  borderColor: string;
}

const LAYERS: LayerInfo[] = [
  {
    id: 0,
    title: "Cottony-soft top sheet",
    sub: "Organic, hypoallergenic fibres — rash-free, never a plastic feel.",
    dotColor: "#F3E6F0",
    bgTint: "rgba(243, 230, 240, 0.4)",
    borderColor: "#E8C8DF",
  },
  {
    id: 1,
    title: "Acquisition layer",
    sub: "Natural fibres pull fluid away from the skin to keep the surface dry.",
    dotColor: "#E8C8DF",
    bgTint: "rgba(232, 200, 223, 0.4)",
    borderColor: "#D9A0CB",
  },
  {
    id: 2,
    title: "Super-Absorbent Gel Core",
    sub: "SAP core locks fluid and neutralises odour instead of masking it.",
    dotColor: "#9A5B90",
    bgTint: "rgba(154, 91, 144, 0.12)",
    borderColor: "#9A5B90",
  },
  {
    id: 3,
    title: "Breathable backsheet",
    sub: "Releases heat to prevent the sweat buildup that causes rashes.",
    dotColor: "#D1E9EC",
    bgTint: "rgba(209, 233, 236, 0.4)",
    borderColor: "#B5DFE4",
  },
];

export default function WhatsInside() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <section className="mt-12 sm:mt-16 border-t border-gray-200/80 pt-8 sm:pt-12">
      {/* Section Eyebrow & Heading */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
          ENGINEERED IN LAYERS
        </span>
        <h2 className="font-serif text-2xl font-semibold text-[#1A150F] sm:text-4xl">
          What’s inside
        </h2>
      </div>

      {/* Main 2-Column Responsive Card Layout */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Interactive Layer Diagram Card */}
        <div className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#F3E6F0] bg-[#FBF1FB]/60 p-4 sm:p-8 lg:col-span-5">
          <div className="relative my-auto flex w-full items-center justify-center py-4 sm:py-6">
            <svg
              viewBox="0 0 380 230"
              className="h-auto w-full max-w-[290px] sm:max-w-[340px] drop-shadow-sm select-none"
              aria-label="Pad cross section layers diagram"
            >
              <defs>
                <filter id="layer-glow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#7E4D77" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Main Pad Outer Contour */}
              <path
                d="M 50 15 C 170 2 210 2 310 15 C 325 70 325 150 310 205 C 210 218 170 218 50 205 C 35 150 35 70 50 15 Z"
                fill="none"
                stroke="#7E4D77"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Layer 0: Top Sheet */}
              <g
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActiveLayer(0)}
                onMouseLeave={() => setActiveLayer(null)}
                onClick={() => setActiveLayer(activeLayer === 0 ? null : 0)}
              >
                <path
                  d="M 52 18 C 170 6 210 6 308 18 C 314 42 314 42 308 60 C 210 60 170 60 52 60 C 46 42 46 42 52 18 Z"
                  fill={activeLayer === 0 ? "#FFFFFF" : "#FAF2FA"}
                  stroke="#7E4D77"
                  strokeWidth={activeLayer === 0 ? "2" : "1"}
                  filter={activeLayer === 0 ? "url(#layer-glow)" : undefined}
                />
                <line x1="308" y1="38" x2="355" y2="38" stroke="#7E4D77" strokeWidth="1.2" strokeDasharray="3 2" />
              </g>

              {/* Layer 1: Acquisition Layer */}
              <g
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActiveLayer(1)}
                onMouseLeave={() => setActiveLayer(null)}
                onClick={() => setActiveLayer(activeLayer === 1 ? null : 1)}
              >
                <path
                  d="M 52 62 C 170 62 210 62 308 62 C 314 80 314 80 308 100 C 210 100 170 100 52 100 C 46 80 46 80 52 62 Z"
                  fill={activeLayer === 1 ? "#E4C0D9" : "#E8C8DF"}
                  stroke="#7E4D77"
                  strokeWidth={activeLayer === 1 ? "2" : "1"}
                  filter={activeLayer === 1 ? "url(#layer-glow)" : undefined}
                />
                <line x1="308" y1="80" x2="355" y2="80" stroke="#7E4D77" strokeWidth="1.2" strokeDasharray="3 2" />
              </g>

              {/* Layer 2: Super-Absorbent Gel Core */}
              <g
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActiveLayer(2)}
                onMouseLeave={() => setActiveLayer(null)}
                onClick={() => setActiveLayer(activeLayer === 2 ? null : 2)}
              >
                <path
                  d="M 52 102 C 170 102 210 102 308 102 C 314 125 314 135 308 155 C 210 155 170 155 52 155 C 46 135 46 125 52 102 Z"
                  fill={activeLayer === 2 ? "#8A4E7E" : "#9A5B90"}
                  stroke="#7E4D77"
                  strokeWidth={activeLayer === 2 ? "2.5" : "1"}
                  filter={activeLayer === 2 ? "url(#layer-glow)" : undefined}
                />
                {/* Embedded SAP Gel Dots */}
                <circle cx="100" cy="128" r="3.5" fill="#582C51" opacity="0.85" />
                <circle cx="130" cy="140" r="3" fill="#582C51" opacity="0.85" />
                <circle cx="160" cy="120" r="4" fill="#582C51" opacity="0.85" />
                <circle cx="190" cy="132" r="3" fill="#582C51" opacity="0.85" />
                <circle cx="215" cy="144" r="3.5" fill="#582C51" opacity="0.85" />
                <circle cx="240" cy="124" r="4" fill="#582C51" opacity="0.85" />
                <circle cx="265" cy="138" r="3" fill="#582C51" opacity="0.85" />

                <line x1="308" y1="128" x2="355" y2="128" stroke="#7E4D77" strokeWidth="1.2" strokeDasharray="3 2" />
              </g>

              {/* Layer 3: Breathable Backsheet */}
              <g
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setActiveLayer(3)}
                onMouseLeave={() => setActiveLayer(null)}
                onClick={() => setActiveLayer(activeLayer === 3 ? null : 3)}
              >
                <path
                  d="M 52 157 C 170 157 210 157 308 157 C 302 188 280 200 180 202 C 80 200 58 188 52 157 Z"
                  fill={activeLayer === 3 ? "#BCE3E8" : "#D1E9EC"}
                  stroke="#7E4D77"
                  strokeWidth={activeLayer === 3 ? "2" : "1"}
                  filter={activeLayer === 3 ? "url(#layer-glow)" : undefined}
                />
                <line x1="308" y1="176" x2="355" y2="176" stroke="#7E4D77" strokeWidth="1.2" strokeDasharray="3 2" />
              </g>
            </svg>
          </div>

          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 font-caveat text-xl font-semibold text-[#7E4D77]/80">
              <Sparkles className="h-4 w-4" /> Hover or tap a layer to explore it
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Layer Details List */}
        <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
          <div className="space-y-3">
            {LAYERS.map((layer) => {
              const isActive = activeLayer === layer.id;

              return (
                <div
                  key={layer.id}
                  onMouseEnter={() => setActiveLayer(layer.id)}
                  onMouseLeave={() => setActiveLayer(null)}
                  onClick={() => setActiveLayer(isActive ? null : layer.id)}
                  className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                    isActive
                      ? "scale-[1.01] border-[#9A5B90] bg-[#FBF1FB] shadow-md"
                      : "border-transparent bg-white hover:border-gray-200 hover:bg-gray-50/80"
                  }`}
                >
                  {/* Layer Color Pill Dot */}
                  <div
                    className="mt-1 h-5 w-5 flex-none rounded-lg border border-black/10 shadow-xs transition-transform group-hover:scale-110"
                    style={{ backgroundColor: layer.dotColor }}
                  />

                  {/* Layer Text Information */}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold text-[#1A150F] group-hover:text-[#7E4D77]">
                      {layer.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {layer.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* In Every Pack Strip (Cream Card) */}
      <div className="mt-6 sm:mt-8 rounded-2xl border border-[#EAE4D6] bg-[#F4F1E8] p-3.5 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs sm:text-base">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
              IN EVERY PACK
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">21</strong>
              <span className="text-gray-700">pads</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">4</strong>
              <span className="text-gray-700">panty liners</span>
            </div>

            <div className="flex items-center gap-1.5">
              <strong className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">
                Biodegradable
              </strong>
              <span className="text-gray-700">disposal bag per pad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Specs: Free from & Care Notes */}
      <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-xs text-gray-600 sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
          <span className="w-28 flex-none font-bold text-[#1A150F]">Free from</span>
          <span className="text-gray-700">
            Chlorine bleach, parabens, added fragrance, dyes & synthetic plastic top layers.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
          <span className="w-28 flex-none font-bold text-[#1A150F]">Care</span>
          <span className="leading-relaxed text-gray-700">
            Change every 4–8 hours; roll, seal in the biodegradable bag and bin it — never flush. For postpartum or very heavy / PCOS flow the XL+ is built for it; if you soak through an XL+ in under 2 hours, check with a doctor.
          </span>
        </div>
      </div>
    </section>
  );
}
