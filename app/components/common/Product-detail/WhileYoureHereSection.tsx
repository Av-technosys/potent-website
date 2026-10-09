"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, Luggage, Gift } from "lucide-react";

interface WhileYoureHereProps {
  onOpenQuiz?: () => void;
  brandTheme?: "looway" | "ovy";
}

export default function WhileYoureHereSection({
  onOpenQuiz,
  brandTheme = "looway",
}: WhileYoureHereProps) {
  const isLooway = brandTheme === "looway";

  const textColor = isLooway ? "text-[#5A0E30]" : "text-[#1A150F]";
  const eyebrowColor = isLooway ? "text-[#b51e60]" : "text-[#7E4D77]";
  const accentColor = isLooway ? "text-[#C21E63]" : "text-[#9A5B90]";
  const iconBg = isLooway ? "bg-[#FDEEF4] text-[#C21E63]" : "bg-[#FBF1FB] text-[#7E4D77]";
  const pinkCardBg = isLooway ? "bg-[#FDEEF4]/70 border-[#F3D5E2]" : "bg-[#FBF1FB] border-[#F3E6F0]";

  return (
    <section className="w-full bg-[#fcf8f3] py-12 sm:py-16 lg:py-20 text-[#5A0E30]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <span className={`text-[11px] font-extrabold uppercase tracking-widest block mb-2 ${eyebrowColor}`}>
            MORE FROM POTENT HYGIENE
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold ${textColor}`}>
            While you&apos;re here
          </h2>
        </div>

        {/* 3 Promo Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Looway Yatra Kit */}
          <Link
            href="/looway-yatra-kit"
            className="group flex items-center justify-between gap-4 rounded-3xl border border-[#EAD6DC] bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C21E63] hover:shadow-md"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${iconBg}`}>
                <Luggage className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className={`font-serif text-base font-bold ${textColor} group-hover:${accentColor}`}>
                  Looway Yatra Kit
                </h3>
                <p className="mt-0.5 text-xs text-[#5A0E30]/70 leading-snug line-clamp-2">
                  Heading out? Build your travel-ready Looway Yatra Kit.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 flex-none text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#C21E63]" />
          </Link>

          {/* Card 2: Potent Rewards Club */}
          <Link
            href="/dashboard/security"
            className="group flex items-center justify-between gap-4 rounded-3xl border border-[#EAD6DC] bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C21E63] hover:shadow-md"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl ${iconBg}`}>
                <Gift className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className={`font-serif text-base font-bold ${textColor} group-hover:${accentColor}`}>
                  Potent Rewards Club
                </h3>
                <p className="mt-0.5 text-xs text-[#5A0E30]/70 leading-snug line-clamp-2">
                  Earn credits across Ovy &amp; Looway — ₹100 to join.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 flex-none text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#C21E63]" />
          </Link>

          {/* Card 3: Not sure what you need? (Pink Card) */}
          <a
            href={onOpenQuiz ? undefined : "#guide"}
            onClick={onOpenQuiz ? (e) => { e.preventDefault(); onOpenQuiz(); } : undefined}
            className={`group relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-3xl border ${pinkCardBg} p-5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C21E63] hover:shadow-md sm:col-span-2 lg:col-span-1`}
          >
            {/* Free Badge */}
            <span className="absolute top-4 right-4 rounded-full bg-[#C21E63] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white tracking-wider shadow-2xs">
              Free
            </span>

            <div className="flex items-center gap-4 min-w-0 pr-12">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white text-[#C21E63] shadow-xs">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className={`font-serif text-base font-bold ${textColor} group-hover:${accentColor}`}>
                  Not sure what you need?
                </h3>
                <p className="mt-0.5 text-xs text-[#5A0E30]/75 leading-snug line-clamp-2">
                  Take the 30-second travel quiz.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 flex-none text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#C21E63]" />
          </a>
        </div>
      </div>
    </section>
  );
}
