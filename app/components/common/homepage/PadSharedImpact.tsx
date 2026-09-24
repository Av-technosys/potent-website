"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export function PadSharedImpact() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#016271] text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl text-center flex flex-col items-center">
        {/* BADGE */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#76D2DC] uppercase mb-3 block">
          EVERY ORDER GIVES BACK
        </span>

        {/* TITLE */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4">
          A pad bought is a pad shared.
        </h2>

        {/* SUBTITLE */}
        <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          A portion of every Ovy order goes to Roshni Manav Utthaan Sansthaan,
          which puts safe, organic period products into the hands of girls and
          women who cannot afford them.
        </p>

        {/* ITALIC SCRIPT QUOTE */}
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white/95 my-2 font-normal">
          So she can have her period with dignity.
        </p>

        {/* DIVIDER */}
        <div className="w-full max-w-lg border-t border-white/20 my-6" />

        {/* PARTNERSHIP FOOTER */}
        <p className="text-xs sm:text-sm text-white/70 font-normal mb-8">
          In partnership with{" "}
          <span className="font-semibold text-white">
            Roshni Manav Utthaan Sansthaan
          </span>{" "}
          · Reg. 580/Jaipur/1997-98
        </p>

        {/* BUTTON */}
        <a
          href="/ovy"
          className="bg-white text-[#016271] hover:bg-white/90 px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          Shop Ovy pads <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
