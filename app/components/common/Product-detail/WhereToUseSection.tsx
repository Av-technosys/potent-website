/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Car,
  Bus,
  Plane,
  Ship,
  Building2,
  Mountain,
  Music,
  Activity,
  Baby,
  Heart,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STOPS_DATA = [
  {
    id: "car",
    icon: Car,
    title: "Cars & road trips",
    desc: "Highways can run for hours with no clean toilet in sight. Keep the drive moving — discreet relief right from your seat, with no anxious hunt for the next dhaba loo and no ruined road-trip mood.",
    keepIn: "the glovebox",
  },
  {
    id: "bus",
    icon: Bus,
    title: "Buses & trains",
    desc: "A broken or filthy onboard toilet no longer ruins the journey. Quiet, private relief from your seat or berth, gelled and sealed away until you reach a bin.",
    keepIn: "your backpack",
  },
  {
    id: "plane",
    icon: Plane,
    title: "Flights & airports",
    desc: "Turbulence, long taxi delays, or a queue for the lavatory — a dry, compact bag is easy hand luggage and always ready when the seatbelt sign is on.",
    keepIn: "your carry-on",
  },
  {
    id: "boat",
    icon: Ship,
    title: "Boats, ferries & cruises",
    desc: "Backwater ferries, a river cruise or a choppy island crossing — seasickness can hit fast and there is nowhere to run. Keep a bag within reach to be sick or to relieve yourself cleanly, seal it away, and enjoy the water instead of dreading it.",
    keepIn: "your day bag",
  },
  {
    id: "temple",
    icon: Building2,
    title: "Teerth yatra & pilgrimages",
    desc: "Char Dham, Vaishno Devi or a long Tirupati darshan can mean hours in a bus or on foot with elderly parents and no clean toilet anywhere. A pack in the bag lets the whole family keep their dignity, whatever the route demands.",
    keepIn: "the yatra bag",
  },
  {
    id: "mountain",
    icon: Mountain,
    title: "Camping & trekking",
    desc: "No facilities on the trail and nowhere private to go. Use a bag, seal it and pack it out — the clean, leave-no-trace way to answer nature's call in the wild.",
    keepIn: "your daypack",
  },
  {
    id: "music",
    icon: Music,
    title: "Festivals & events",
    desc: "Endless queues for overflowing portable toilets? Skip them entirely, stay hydrated, and get straight back to the crowd.",
    keepIn: "your festival bag",
  },
  {
    id: "cross",
    icon: Activity,
    title: "Hospitals & clinics",
    desc: "Long waits, shared toilets and limited mobility during a visit, a test, or recovery all become far easier and more dignified to manage.",
    keepIn: "the hospital bag",
  },
  {
    id: "baby",
    icon: Baby,
    title: "Travelling with a toddler",
    desc: "Potty-training a little one on a highway means accidents and a roadside stop every hour. Open a bag, let them go, seal it — no ruined car seats and no frantic search for a clean loo.",
    keepIn: "the nappy bag",
  },
  {
    id: "preg",
    icon: Baby,
    title: "Pregnancy travel",
    desc: "A smaller bladder and sudden nausea arrive exactly when you can least sprint to a toilet. Completely safe for external use, it takes the worry out of every third-trimester journey.",
    keepIn: "your handbag",
  },
  {
    id: "heart",
    icon: Heart,
    title: "Hospice & elder care",
    desc: "For a loved one in hospice or home care, night-time and travel toilet trips can be painful and undignified. A bag at the bedside means relief on their terms — gently, cleanly, whenever they need it.",
    keepIn: "the bedside drawer",
  },
  {
    id: "drive",
    icon: Car,
    title: "Traffic jams",
    desc: "Bumper-to-bumper with no exit for kilometres. Instead of holding it in or a risky stop on the shoulder, use a bag right in your seat and carry on.",
    keepIn: "the car door pocket",
  },
  {
    id: "bed",
    icon: ShieldCheck,
    title: "Bedside at home",
    desc: "For anyone who cannot reach the bathroom quickly at night — immediate, dignified relief without the struggle or the fall risk.",
    keepIn: "the bedside drawer",
  },
];

export default function WhereToUseSection() {
  const [activeIdx, setActiveIdx] = useState<number>(1); // Default "Buses & trains"
  const trackRef = useRef<HTMLDivElement>(null);

  const currentStop = STOPS_DATA[activeIdx] || STOPS_DATA[0];
  const IconComponent = currentStop.icon;

  useEffect(() => {
    if (trackRef.current && trackRef.current.children[activeIdx]) {
      const activeNode = trackRef.current.children[activeIdx] as HTMLElement;
      const container = trackRef.current;
      const nodeLeft = activeNode.offsetLeft;
      const nodeWidth = activeNode.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: nodeLeft - containerWidth / 2 + nodeWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeIdx]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : STOPS_DATA.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < STOPS_DATA.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="where-to-use" className="w-full bg-[#FBF8F1] scroll-mt-32 sm:scroll-mt-36 py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-[10.5px] sm:text-[11px] font-extrabold tracking-widest text-[#0E5C3A] uppercase">
            ANYWHERE A TOILET ISN&apos;T
          </span>
          <h2 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A4A2E]">
            Where you&apos;ll be glad you packed one
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed text-[#17271E]/75 font-normal">
            Tap a situation to see how Looway saves the moment.
          </p>
        </div>

        {/* Stepper Timeline Track Section */}
        <div className="relative mt-6 sm:mt-8">
          {/* Controls Arrows on Right */}
          <div className="flex justify-end gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
            <button
              onClick={handlePrev}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[#E4DED0] bg-white text-[#0E5C3A] shadow-2xs hover:bg-[#0E5C3A] hover:text-white transition-colors"
              aria-label="Previous situation"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[#E4DED0] bg-white text-[#0E5C3A] shadow-2xs hover:bg-[#0E5C3A] hover:text-white transition-colors"
              aria-label="Next situation"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Stepper Track with Dashed Line */}
          <div className="relative">
            {/* Horizontal Dashed Line */}
            <div className="absolute top-[13px] left-0 right-0 h-[2px] border-t-2 border-dashed border-[#0E5C3A]/30 z-0" />

            <div
              ref={trackRef}
              className="relative z-10 flex items-start gap-4 sm:gap-12 overflow-x-auto pb-4 pt-1 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {STOPS_DATA.map((stop, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={stop.id}
                    onClick={() => setActiveIdx(idx)}
                    className="group flex flex-col items-center shrink-0 cursor-pointer focus:outline-none min-w-[75px] sm:min-w-[90px] text-center"
                  >
                    {/* Circle Node */}
                    <div
                      className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-all ${
                        isActive
                          ? "bg-[#0E5C3A] text-white ring-4 ring-[#0E5C3A]/20 scale-110 shadow-sm"
                          : "border-2 border-[#0E5C3A] bg-white text-[#0E5C3A] hover:bg-[#E4F0E8]"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                          isActive ? "bg-[#F4C430]" : "bg-[#0E5C3A]"
                        }`}
                      />
                    </div>

                    {/* Situation Label */}
                    <span
                      className={`mt-2 text-[10.5px] sm:text-[11px] font-bold leading-tight transition-colors max-w-[90px] sm:max-w-[100px] ${
                        isActive
                          ? "text-[#0A4A2E] underline underline-offset-4 decoration-2 decoration-[#0E5C3A]"
                          : "text-[#17271E]/60 group-hover:text-[#0A4A2E]"
                      }`}
                    >
                      {stop.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Situation Detail Card */}
        <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border border-[#E4DED0] bg-white p-4 sm:p-8 shadow-xs transition-all">
          <div className="flex flex-row items-start gap-3.5 sm:gap-5">
            {/* Gold Icon Box */}
            <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#F4C430] text-[#0A4A2E] shadow-2xs">
              <IconComponent className="h-5 w-5 sm:h-7 sm:w-7 stroke-[2]" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Situation Title */}
              <h3 className="font-serif text-base sm:text-2xl font-bold text-[#0A4A2E]">
                {currentStop.title}
              </h3>

              {/* Situation Description */}
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-base leading-relaxed text-[#17271E]/80 font-normal">
                {currentStop.desc}
              </p>

              {/* Bottom Tag / Keep in location */}
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#EBF5EF] px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#0E5C3A]">
                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
                <span>Keep a pack in {currentStop.keepIn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
