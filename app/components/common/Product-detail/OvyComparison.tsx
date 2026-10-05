"use client";

import { CheckCircle2 } from "lucide-react";

interface ComparisonRow {
  feature: string;
  ovy: string;
  conventional: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "Coverage",
    ovy: "360° — front-to-back, leak-resistant back	",
    conventional: "Covers only where it sits — back leaks at night",
  },
  {
    feature: "Staying put",
    ovy: "Worn like underwear — nothing to shift",
    conventional: "Can bunch, fold or slip out of place",
  },
  {
    feature: "On the body",
    ovy: "Super-thin, dry-feel — no bulk, no line",
    conventional: "Bulkier — you feel it",
  },
  {
    feature: "Disposal",
    ovy: "Tear the sides, tuck it into its own wrapper & bin",
    conventional: "Roll it in tissue or the packet",
  },
  {
    feature: "Best for",
    ovy: "Heavy days, nights, travel & postpartum",
    conventional: "Lighter days & quick changes",
  },
];

export default function OvyComparison() {
  return (
    <section className="mt-16 border-t border-gray-200/80 pt-12">
      {/* Section Header */}
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
          AN HONEST COMPARISON
        </span>
        <h2 className="font-serif text-3xl font-semibold text-[#1A150F] sm:text-4xl">
          Why Ovy beats an ordinary pad
        </h2>
      </div>

      {/* Comparison Table Container */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white shadow-xs">
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full min-w-[480px] sm:min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <th className="w-1/3 p-3.5 pl-4 sm:p-5 sm:pl-7 font-semibold text-gray-500">
                  WHAT MATTERS
                </th>
                <th className="w-1/3 bg-[#FBF1FB] p-3.5 sm:p-5 font-bold text-[#7E4D77]">
                  OVY ORGANIC
                </th>
                <th className="w-1/3 p-3.5 pr-4 sm:p-5 sm:pr-7 font-semibold text-gray-500">
                  CONVENTIONAL PAD
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm md:text-base">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-gray-50/50">
                  {/* Feature Name */}
                  <td className="p-3.5 pl-4 sm:p-5 sm:pl-7 font-semibold text-[#1A150F]">
                    {row.feature}
                  </td>

                  {/* Ovy Column Highlighted */}
                  <td className="bg-[#FBF1FB]/80 p-3.5 sm:p-5 font-bold text-[#1A150F]">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-none text-[#9A5B90]" />
                      <span>{row.ovy}</span>
                    </div>
                  </td>

                  {/* Conventional Pad Column */}
                  <td className="p-3.5 pr-4 sm:p-5 sm:pr-7 font-medium text-gray-500">
                    {row.conventional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
