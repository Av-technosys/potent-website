/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Navigation,
  Baby,
  Building2,
  Heart,
  UserCheck,
  Mountain,
  Music,
  ShieldAlert,
  Activity,
  ChevronDown,
  PlusSquare,
} from "lucide-react";

const AUDIENCES_DATA = [
  {
    id: "travellers",
    icon: Navigation,
    title: "Travellers & road-trippers",
    desc: "Highway drives, train journeys and long commutes with filthy public loos. Stand over the seat with zero contact — no hovering, no touching grimy bowls.",
  },
  {
    id: "girls",
    icon: Baby,
    title: "Young girls & their mums",
    desc: "Potty-training or school trips — no balancing little girls over filthy squat toilets. Clean, quick, and stress-free.",
  },
  {
    id: "pilgrims",
    icon: Building2,
    title: "Pilgrims & yatris",
    desc: "Char Dham, Vaishno Devi or Tirupati queue lines — hours on foot with no clean toilet anywhere. Stand and go with dignity on tired knees.",
  },
  {
    id: "pregnant",
    icon: Heart,
    title: "Pregnant women",
    desc: "Pregnancy brings frequent urgency and painful joint stiffness when squatting on low toilets. Standing to pee eliminates crouching completely — keeping your knees, back and baby comfortable.",
  },
  {
    id: "seniors",
    icon: UserCheck,
    title: "Older women & sore knees",
    desc: "Knee arthritis or joint stiffness makes lowering onto low seats painful. Standing to pee gives full independence and comfort on every outing.",
  },
  {
    id: "trekkers",
    icon: Mountain,
    title: "Trekkers, campers & adventurers",
    desc: "Trekking, camping with schoolmates, friends or family, or any adventure weekend — no toilet for miles and nowhere private to squat. Stand discreetly and go, the clean leave-no-trace way.",
  },
  {
    id: "festivals",
    icon: Music,
    title: "Festival & event-goers",
    desc: "Queues thirty women deep for overflowing portaloos? Skip them entirely, stay hydrated, and get straight back to the music in under a minute.",
  },
  {
    id: "uti",
    icon: PlusSquare,
    title: "UTI-prone & germ-conscious",
    desc: "Never touch a dirty seat again. Prevents contact with contaminated surfaces and reduces UTI risks.",
  },
  {
    id: "surgery",
    icon: Activity,
    title: "Post-surgery & recovery",
    desc: "Post-surgery recovery or limited movement — pee standing up without painful bending or struggling to sit.",
  },
];

export default function FunnelWhoItsForSection() {
  // ALL ACCORDION CARDS CLOSED BY DEFAULT
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="who-its-for" className="w-full bg-[#fdeef4] scroll-mt-32 sm:scroll-mt-36 py-12 sm:py-18 lg:py-22 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2">
            FOR EVERY WOMAN
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight">
            Who it&apos;s for
          </h2>
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-[#2A1620]/75 leading-relaxed font-normal">
            For women and girls on the move — travellers, mums-to-be, and anyone who struggles with squatting or dirty public toilets. Tap a card to see how it helps.
          </p>
        </div>

        {/* 2-Column Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 items-start">
          {AUDIENCES_DATA.map((aud) => {
            const isOpen = openId === aud.id;
            const IconComp = aud.icon;
            return (
              <div
                key={aud.id}
                className={`rounded-2xl transition-all duration-200 bg-white ${
                  isOpen
                    ? "border-2 border-[#a81a57] shadow-md p-4 sm:p-5"
                    : "border border-[#f8dce8] shadow-2xs hover:border-[#a81a57] p-4 sm:p-4.5"
                }`}
              >
                {/* Header Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(aud.id)}
                  className="flex w-full cursor-pointer items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-1">
                    {/* Mustard Yellow Square Icon Box */}
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4C430] text-[#5A0E30] shadow-2xs">
                      <IconComp className="h-5 w-5 stroke-[2]" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#5A0E30] truncate">
                      {aud.title}
                    </h3>
                  </div>

                  {/* Toggle Arrow Badge */}
                  <div
                    className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                      isOpen
                        ? "bg-[#a81a57] text-white rotate-180"
                        : "bg-[#fdeef4] text-[#a81a57]"
                    }`}
                  >
                    <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
                  </div>
                </button>

                {/* Expanded Body Content */}
                {isOpen && (
                  <div className="mt-3 border-t border-[#f8dce8] pt-3 text-xs sm:text-sm text-[#2A1620]/80 leading-relaxed font-normal animate-in fade-in duration-200">
                    {aud.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
