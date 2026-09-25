"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export function JournalSection() {
  const articles = [
    {
      category: "SANITARY PADS",
      title: "Why choose sanitary pads instead of cloth during periods?",
      date: "19 Aug 2026",
      link: "/blog",
    },
    {
      category: "PROTECTION",
      title: "Protection and women's hygiene",
      date: "19 Aug 2026",
      link: "/blog",
      highlighted: true,
    },
    {
      category: "SKIN",
      title: "Skin pimples: causes, prevention and simple care tips",
      date: "19 Aug 2026",
      link: "/blog",
    },
    {
      category: "AT WORK",
      title:
        "Periods, power, productivity: managing menstrual health at work",
      date: "2026",
      link: "/blog",
    },
  ];

  return (
    <section className="hidden sm:block py-12 sm:py-16 md:py-20 bg-[#F8F6F1]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* HEADER ROW */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#016271] uppercase mb-2 block">
              JOURNAL
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C2424] leading-tight mb-2">
              The stuff nobody explains properly.
            </h2>
            <p className="text-sm sm:text-base text-[#5C7275] max-w-xl font-normal">
              Straight answers on periods, the body and travel hygiene, with no
              euphemisms.
            </p>
          </div>

          <a
            href="/blog"
            className="border border-[#016271] text-[#016271] hover:bg-[#016271] hover:text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer inline-flex items-center gap-2 shrink-0"
          >
            Read the journal <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {articles.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className={`bg-white rounded-2xl p-6 shadow-xs transition-all flex flex-col justify-between group ${
                item.highlighted
                  ? "ring-1 ring-[#016271]/20 shadow-md"
                  : "border border-gray-100/80 hover:shadow-md"
              }`}
            >
              <div>
                {/* CATEGORY TAG */}
                <span className="bg-[#E2F4F7] text-[#016271] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full w-fit block mb-4">
                  {item.category}
                </span>

                {/* TITLE */}
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1C2424] leading-snug mb-4 group-hover:text-[#016271] transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* DATE */}
              <span className="text-xs text-gray-400 font-medium mt-auto">
                {item.date}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
