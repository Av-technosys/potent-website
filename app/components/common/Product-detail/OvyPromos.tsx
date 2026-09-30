"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle, Luggage, Star } from "lucide-react";

interface OvyPromosProps {
  onOpenQuiz?: () => void;
}

export default function OvyPromos({ onOpenQuiz }: OvyPromosProps) {
  return (
    <section className="mt-16 border-t border-gray-200/80 pt-12">
      {/* Section Header */}
      <div className="mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
          GOOD TO KNOW
        </span>
        <h2 className="font-serif text-3xl font-semibold text-[#1A150F] sm:text-4xl">
          Questions, answered
        </h2>
      </div>

      {/* 3 Promo Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Looway Yatra Kit */}
        <Link
          href="/looway-yatra-kit"
          className="group flex items-center justify-between gap-4 rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9A5B90] hover:shadow-md"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[#FBF1FB] text-[#7E4D77]">
              <Luggage className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-base font-semibold text-[#1A150F] group-hover:text-[#7E4D77]">
                Looway Yatra Kit
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                Heading out? Build your travel-ready Looway Yatra Kit.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 flex-none text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#9A5B90]" />
        </Link>

        {/* Card 2: Potent Rewards Club */}
        <Link
          href="/quiz"
          className="group flex items-center justify-between gap-4 rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9A5B90] hover:shadow-md"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[#FBF1FB] text-[#7E4D77]">
              <Star className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-base font-semibold text-[#1A150F] group-hover:text-[#7E4D77]">
                Potent Rewards Club
              </h3>
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                Free rupee credits across Ovy & Looway — ₹100 to join.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 flex-none text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#9A5B90]" />
        </Link>

        {/* Card 3: Not sure what you need (Opens Quiz Modal directly) */}
        <button
          type="button"
          onClick={onOpenQuiz}
          className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-3xl border border-[#F3E6F0] bg-[#FBF1FB] p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9A5B90] hover:shadow-md sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white text-[#7E4D77] shadow-xs">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-base font-semibold text-[#1A150F] group-hover:text-[#7E4D77]">
                Not sure what you need
              </h3>
              <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">
                Take the Period Fit quiz to find your ideal fit.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 flex-none text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#9A5B90]" />
        </button>
      </div>
    </section>
  );
}
