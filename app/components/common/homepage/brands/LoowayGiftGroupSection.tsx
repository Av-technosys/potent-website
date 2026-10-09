"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LoowayGiftGroupSection() {
  return (
    <section className="w-full bg-white py-8 sm:py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Card 1: Gift Kit (Dark Teal) */}
          <div className="bg-[#004851] text-white rounded-[2rem] p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#F6D353] uppercase block mb-3">
                SEND ONE WITH MAA AND PAPA
              </span>
              <h2 className="font-serif text-2xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-3">
                A Yatra Kit makes a thoughtful gift.
              </h2>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal mb-8 max-w-md">
                Turn on gift mode when you check out: we hide the price and put your note, up to 200 characters, in the box.
              </p>
            </div>

            <div>
              <Link
                href="/looway-yatra-kit?kit=carekit#choose-kit"
                className="bg-[#F6D353] hover:bg-[#ebd048] text-[#004851] font-bold text-xs sm:text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-2xs transition-all"
              >
                <span>Build a gift kit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Group Travelling (Cream Yellow) */}
          <div className="bg-[#FFF8D6] text-[#1F1915] rounded-[2rem] p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow border border-yellow-200/80">
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#006573] uppercase block mb-3">
                TRAVELLING AS A GROUP?
              </span>
              <h2 className="font-serif text-2xl sm:text-2xl lg:text-3xl font-bold text-[#1F1915] leading-tight mb-3">
                Kits for the whole yatra.
              </h2>
              <p className="text-xs sm:text-sm text-[#5C7275] leading-relaxed font-normal mb-8 max-w-md">
                Yatra groups and tour operators, hotels, hospitals, schools and offices: tell us how many travellers and where they are going.
              </p>
            </div>

            <div>
              <a
                href="mailto:care@potenthygiene.com"
                className="border border-[#006573] hover:bg-[#006573]/5 text-[#006573] font-bold text-xs sm:text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all shadow-2xs"
              >
                <span>Email care@potenthygiene.com</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
