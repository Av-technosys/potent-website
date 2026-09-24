"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HonestByDesign() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#E5F5F6]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* LEFT SIDE IMAGE */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md max-w-md mx-auto lg:max-w-none">
              <Image
                src="/cup.jpg"
                alt="Menstrual Cup Potent Hygiene"
                width={600}
                height={600}
                className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl"
              />
            </div>
          </div>

          {/* RIGHT SIDE TEXT */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#016271] uppercase block">
              HONEST BY DESIGN
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C2424] leading-[1.15]">
              Every word on our packs is one we can stand behind.
            </h2>

            <p className="text-sm sm:text-base text-[#4F6467] leading-relaxed max-w-xl font-normal">
              Certified toxin-free. Dermatologically tested. pH-balanced and
              non-irritant. Every Ovy and Looway product carries only the claims
              we can show you the certificate for, written in plain words, so
              choosing well feels easy and never like a gamble.
            </p>

            <div>
              <a
                href="/shop"
                className="border border-[#016271] text-[#016271] hover:bg-[#016271] hover:text-white px-7 py-3 rounded-full font-medium text-sm sm:text-base transition-all inline-flex items-center gap-2 mt-2 cursor-pointer"
              >
                Shop with confidence <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
