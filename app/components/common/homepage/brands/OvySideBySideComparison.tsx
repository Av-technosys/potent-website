"use client";

import Image from "next/image";

interface ComparisonItem {
  featureKey: string;
  featureTitle: string;
  ovyValue: string;
  usualValue: string;
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    featureKey: "lengths",
    featureTitle: "LENGTHS",
    ovyValue: "Three: L 240mm, XL 280mm, XL+ 320mm",
    usualValue: "Usually one or two",
  },
  {
    featureKey: "build-box",
    featureTitle: "BUILD YOUR OWN BOX",
    ovyValue: "Any split of 21 across all three, one flat price",
    usualValue: "Fixed packs",
  },
  {
    featureKey: "in-box",
    featureTitle: "IN THE BOX",
    ovyValue: "21 pads, 4 liners, a biodegradable disposal bag for every piece",
    usualValue: "Pads, sometimes liners",
  },
  {
    featureKey: "skin-testing",
    featureTitle: "SKIN TESTING",
    ovyValue: "24 volunteers, IS 4011:2018, mean score 0.04 of 2.0, published",
    usualValue: '"Dermatologically tested", subject count not published',
  },
  {
    featureKey: "fragrance",
    featureTitle: "FRAGRANCE, DYES, CHLORINE BLEACH",
    ovyValue: "None added",
    usualValue: "The premium packs also leave them out; the mass packs often do not",
  },
  {
    featureKey: "delivery",
    featureTitle: "DELIVERY",
    ovyValue: "Timed to your predicted period, about 5 days before",
    usualValue: "A calendar date, if a subscription exists at all",
  },
];

export function OvySideBySideComparison() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-8">
          <span className="text-xs font-bold tracking-widest text-[#602E55] uppercase block mb-2">
            SIDE BY SIDE
          </span>
          <h2 className="hidden md:block font-serif text-3xl sm:text-5xl font-bold text-[#1F1915] leading-tight">
            Ovy pads and the usual pack.
          </h2>
          <p className="hidden md:block mt-2 text-xs sm:text-base font-normal text-[#5C524D]">
            Facts from the packs and the study reports. Prices are on the product pages.
          </p>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* MOBILE VIEW (< md) - MATCHES MOBILE SCREENSHOT EXACTLY (NO IMAGE)  */}
        {/* ------------------------------------------------------------------- */}
        <div className="block md:hidden space-y-3.5">
          {COMPARISON_DATA.slice(0, 3).map((item) => (
            <div
              key={item.featureKey}
              className="bg-white rounded-2xl p-4 border border-gray-150 shadow-2xs"
            >
              <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-2">
                {item.featureTitle}
              </div>

              {/* OVY Row */}
              <div className="mb-3">
                <div className="text-xs font-bold text-[#602E55] uppercase tracking-wider mb-1">
                  OVY
                </div>
                <div className="bg-[#F5EFF6] p-3 rounded-xl font-bold text-xs text-[#1F1915] leading-snug">
                  {item.ovyValue}
                </div>
              </div>

              {/* Usual Pack Row */}
              <div>
                <div className="text-[10px] font-bold text-[#602E55] uppercase tracking-wider mb-0.5">
                  THE USUAL PACK
                </div>
                <div className="text-xs text-gray-500 leading-snug">
                  {item.usualValue}
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* ------------------------------------------------------------------- */}
        {/* DESKTOP VIEW (md:) - MATCHES WEB SCREENSHOT EXACTLY (WITH IMAGE)    */}
        {/* ------------------------------------------------------------------- */}
        <div className="hidden md:grid grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Comparison Table */}
          <div className="col-span-7 bg-white/70 rounded-3xl p-4 sm:p-6 border border-gray-200/60 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-2 w-1/4"></th>
                  <th className="py-3 px-3 text-[#602E55] bg-purple-50/70 rounded-t-xl w-5/12 font-extrabold">
                    OVY
                  </th>
                  <th className="py-3 px-3 w-5/12">THE USUAL PACK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON_DATA.map((item, idx) => (
                  <tr key={item.featureKey}>
                    <td className="py-4 px-2 font-bold text-[#1F1915] align-top">
                      {item.featureTitle.charAt(0) + item.featureTitle.slice(1).toLowerCase()}
                    </td>
                    <td
                      className={`py-4 px-3 bg-[#ebd9ee] text-[#4A2040] font-semibold align-top leading-snug ${
                        idx === COMPARISON_DATA.length - 1 ? "rounded-b-xl" : ""
                      }`}
                    >
                      {item.ovyValue}
                    </td>
                    <td className="py-4 px-3 text-gray-500 align-top leading-snug">
                      {item.usualValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column: Pad Diagram Image inside Purple Beaded Frame */}
          <div className="col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-md aspect-square overflow-hidden rounded-3xl p-3 shadow-md"
              style={{ backgroundColor: "#FAF3EB" }}
            >
              {/* SVG Beaded Frame Ring */}
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none p-1.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="5"
                  y="5"
                  width="calc(100% - 10px)"
                  height="calc(100% - 10px)"
                  rx="24"
                  fill="none"
                  stroke="#602E55"
                  strokeWidth="7"
                  strokeDasharray="0 16"
                  strokeLinecap="round"
                />
              </svg>

              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-purple-50">
                <Image
                  src="/ovy/pad-callouts.jpg"
                  alt="Ovy pad features diagram"
                  fill
                  className="object-cover"
                  sizes="450px"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
