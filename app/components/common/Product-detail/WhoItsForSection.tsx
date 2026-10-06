/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Baby,
  Heart,
  UserCheck,
  Accessibility,
  HeartHandshake,
  Navigation,
  Mountain,
  PlusCircle,
  ChevronDown,
} from "lucide-react";

const AUDIENCES_DATA = [
  {
    id: "parents",
    icon: Baby,
    title: "Parents & young kids",
    desc: "Potty-training toddlers, sudden car-sickness or a child who needs to go NOW with no stop in sight — open a bag, done, sealed. No roadside emergencies and no ruined seats.",
  },
  {
    id: "pregnant",
    icon: Heart,
    title: "Pregnant women",
    desc: "Pregnancy brings frequent-loo urgency and sudden waves of nausea, especially while travelling. Completely safe for external use, and a huge weight off your mind on any journey.",
  },
  {
    id: "seniors",
    icon: UserCheck,
    title: "Senior citizens",
    desc: "Long journeys, a weaker bladder, and stiff knees or joint pain that make lowering onto a squat or low toilet genuinely painful are a stressful mix. Simple, discreet and dignified, with a picture guide that makes the very first use easy.",
  },
  {
    id: "disability",
    icon: Accessibility,
    title: "People with disabilities",
    desc: "For wheelchair users and anyone with limited mobility, it means managing your own hygiene needs independently, on your own terms, wherever you are.",
  },
  {
    id: "caregivers",
    icon: HeartHandshake,
    title: "Caregivers",
    desc: "Caring for a bed-ridden or elderly family member? A bedside essential for night-time needs and hospital stays — sealable, odour-locked and easy to dispose of.",
  },
  {
    id: "travellers",
    icon: Navigation,
    title: "Travellers & commuters",
    desc: "Road-trippers, long-distance drivers and anyone who half-lives out of their car keeps a pack handy for whatever the road throws up.",
  },
  {
    id: "trekkers",
    icon: Mountain,
    title: "Trekkers & campers",
    desc: "The clean, leave-no-trace way to answer the call of nature where there are simply no facilities for miles.",
  },
  {
    id: "patients",
    icon: PlusCircle,
    title: "Patients & post-surgery",
    desc: "Reduced mobility after an operation or during an illness — relief without a difficult, painful trip to the bathroom.",
  },
];

export default function WhoItsForSection() {
  const [openId, setOpenId] = useState<string | null>(null); // ALL CLOSED BY DEFAULT

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-[#F1F7F3] py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-[10.5px] sm:text-[11px] font-extrabold tracking-widest text-[#0E5C3A] uppercase">
            FOR EVERY BODY
          </span>
          <h2 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A4A2E]">
            Who it&apos;s for
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed text-[#17271E]/75 font-normal">
            One product for the whole family. Tap a card to see how it helps.
          </p>
        </div>

        {/* 2-Column Accordion Grid */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-5 items-start">
          {AUDIENCES_DATA.map((aud) => {
            const isOpen = openId === aud.id;
            const IconComp = aud.icon;
            return (
              <div
                key={aud.id}
                className={`rounded-2xl bg-white transition-all duration-200 ${
                  isOpen
                    ? "col-span-2 md:col-span-1 border-2 border-[#0E5C3A] shadow-md p-3 sm:p-5"
                    : "col-span-1 border border-[#E4DED0] shadow-2xs hover:border-[#0E5C3A] p-2.5 sm:p-5"
                }`}
              >
                {/* Header Toggle Button */}
                <button
                  onClick={() => toggleAccordion(aud.id)}
                  className="flex w-full cursor-pointer items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 pr-1">
                    {/* Yellow Icon Box */}
                    <div className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4C430] text-[#0A4A2E] shadow-2xs">
                      <IconComp className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xs sm:text-lg font-bold text-[#0A4A2E] truncate">
                      {aud.title}
                    </h3>
                  </div>

                  {/* Toggle Arrow Badge */}
                  <div
                    className={`flex h-5 w-5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#0E5C3A] text-white rotate-180"
                        : "bg-[#E4F0E8] text-[#0E5C3A]"
                    }`}
                  >
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 stroke-[2.5]" />
                  </div>
                </button>

                {/* Expanded Body Content */}
                {isOpen && (
                  <div className="mt-2.5 sm:mt-3.5 border-t border-[#E4DED0]/60 pt-2.5 sm:pt-3.5 text-[11px] sm:text-sm text-[#17271E]/80 leading-relaxed font-normal animate-in fade-in duration-200">
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
