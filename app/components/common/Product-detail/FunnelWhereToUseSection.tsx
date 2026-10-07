/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Car,
  Bus,
  Plane,
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
  Clock,
  Compass,
} from "lucide-react";

const STOPS_DATA = [
  {
    id: "car",
    icon: Car,
    title: "Cars & road trips",
    desc: "Highways can run for hours with no clean toilet in sight. Step out beside the car, stay fully dressed, and go in seconds — no squatting in the dust, no filthy dhaba loo, no ruined road-trip mood.",
    keepIn: "your handbag",
  },
  {
    id: "bus",
    icon: Bus,
    title: "Buses & trains",
    desc: "One grim toilet for the whole carriage? Stand over it and go without ever lowering onto the seat — quick, clean and steady even on a moving train.",
    keepIn: "your tote",
  },
  {
    id: "plane",
    icon: Plane,
    title: "Flights & airports",
    desc: "Cramped lavatories and long queues. The funnel makes an aeroplane toilet fast and completely contactless, then slips easily back into your carry-on.",
    keepIn: "your carry-on",
  },
  {
    id: "loo",
    icon: ShieldCheck,
    title: "Dirty public toilets",
    desc: "The grimy loo at a bus stand, market, mall or highway dhaba. Stand over the seat and go — no hovering, no squatting, and your skin never touches it.",
    keepIn: "your handbag",
  },
  {
    id: "temple",
    icon: Building2,
    title: "Pilgrimage & yatra",
    desc: "Char Dham, Vaishno Devi, Tirupati, the Kumbh — long climbs and endless darshan queues with no clean toilet for hours. Stand and go with dignity, no squatting on tired knees, whatever the route demands.",
    keepIn: "the yatra bag",
  },
  {
    id: "mountain",
    icon: Mountain,
    title: "Treks, camping & adventures",
    desc: "School trips, camping with schoolmates, friends or family, treks and weekend adventures — no facilities for miles and nowhere private to squat. Stand discreetly and direct the flow away, the clean leave-no-trace way to go.",
    keepIn: "your daypack",
  },
  {
    id: "music",
    icon: Music,
    title: "Festivals & events",
    desc: "Queues thirty women deep for overflowing portaloos? Skip them entirely, stay hydrated, and get straight back to the music in under a minute.",
    keepIn: "your festival bag",
  },
  {
    id: "cross",
    icon: Activity,
    title: "Hospitals & clinics",
    desc: "Shared toilets and limited mobility during a visit, a test or recovery. Standing to pee — no contact, no crouching — is far easier and more dignified to manage.",
    keepIn: "the hospital bag",
  },
  {
    id: "baby",
    icon: Baby,
    title: "Out with little ones",
    desc: "You can't balance over a squat toilet holding a toddler. Stand and go quickly while they wait safely in the pram or car seat — one less roadside scramble.",
    keepIn: "the nappy bag",
  },
  {
    id: "preg",
    icon: Baby,
    title: "Pregnancy travel",
    desc: "A smaller bladder and sore hips arrive exactly when squatting and dirty seats feel hardest. Stand with no crouching and no contact — safe for external use right through pregnancy.",
    keepIn: "your handbag",
  },
  {
    id: "heart",
    icon: Heart,
    title: "Caring for elders",
    desc: "Helping a mother or grandmother who can no longer squat or lower onto a low, dirty seat. Standing to pee gives her relief on her own terms — gently, cleanly, with her dignity intact.",
    keepIn: "the day bag",
  },
  {
    id: "drive",
    icon: Car,
    title: "Traffic jams",
    desc: "Bumper-to-bumper with no exit for kilometres. Direct it into a bottle or a Looway bag right in your seat — no painful holding on, no risky stop on the shoulder.",
    keepIn: "the car door pocket",
  },
  {
    id: "bed",
    icon: Clock,
    title: "Bedside at home",
    desc: "For anyone who can't reach the bathroom quickly at night, relief into a container by the bed — without a risky walk in the dark or a struggle onto the toilet.",
    keepIn: "the bedside drawer",
  },
];

export default function FunnelWhereToUseSection() {
  const [activeStopIndex, setActiveStopIndex] = useState(5); // Default to Treks & Camping as shown in screenshot
  const activeStop = STOPS_DATA[activeStopIndex] || STOPS_DATA[5];
  const stepperRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (activeStopIndex > 0) {
      setActiveStopIndex((prev) => prev - 1);
    }
  };

  const scrollNext = () => {
    if (activeStopIndex < STOPS_DATA.length - 1) {
      setActiveStopIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (stepperRef.current && stepperRef.current.children[activeStopIndex]) {
      const activeNode = stepperRef.current.children[activeStopIndex] as HTMLElement;
      const container = stepperRef.current;
      const nodeLeft = activeNode.offsetLeft;
      const nodeWidth = activeNode.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: nodeLeft - containerWidth / 2 + nodeWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeStopIndex]);

  return (
    <section id="where-to-use" className="w-full bg-[#fcf8f3] py-12 sm:py-18 lg:py-22 text-[#2A1620]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2">
            ANYWHERE A TOILET ISN&apos;T
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight">
            Where you&apos;ll be glad you packed one
          </h2>
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-[#2A1620]/75 leading-relaxed font-normal">
            Tap a situation to see how Looway saves the moment.
          </p>
        </div>

        {/* Dashed Stepper Line & Nodes Bar */}
        <div className="relative mb-6">
          {/* Arrow Buttons Top Right */}
          <div className="flex items-center justify-end gap-2 mb-3">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={activeStopIndex === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#f8dce8] text-[#a81a57] hover:bg-[#fdeef4] disabled:opacity-30 cursor-pointer shadow-2xs transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={activeStopIndex === STOPS_DATA.length - 1}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#f8dce8] text-[#a81a57] hover:bg-[#fdeef4] disabled:opacity-30 cursor-pointer shadow-2xs transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Stepper Scroll Container with Connecting Line */}
          <div className="relative w-full">
            {/* Horizontal Dashed Line behind nodes */}
            <div className="absolute top-[18px] left-0 right-0 h-0.5 border-t-2 border-dashed border-[#f8dce8] z-0" />

            <div
              ref={stepperRef}
              className="flex items-start gap-6 sm:gap-10 overflow-x-auto pt-2 pb-4 no-scrollbar relative z-10 scroll-smooth"
            >
              {STOPS_DATA.map((stop, idx) => {
                const isSelected = idx === activeStopIndex;
                return (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => setActiveStopIndex(idx)}
                    className="flex flex-col items-center shrink-0 max-w-[110px] text-center cursor-pointer group"
                  >
                    {/* Node Dot */}
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 mb-2.5 ${
                        isSelected
                          ? "border-[#a81a57] bg-[#a81a57] ring-4 ring-[#fdeef4] shadow-2xs scale-110"
                          : "border-[#a81a57] bg-white group-hover:bg-[#fdeef4]"
                      }`}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>

                    {/* Node Title */}
                    <span
                      className={`text-[11px] sm:text-xs font-bold leading-tight transition-colors ${
                        isSelected ? "text-[#a81a57]" : "text-[#2A1620]/75 group-hover:text-[#5A0E30]"
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

        {/* Selected Stop Card Box */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#f8dce8] bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-5 sm:gap-6 items-start">
          {/* Mustard Yellow Square Icon Box */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4C430] text-[#5A0E30] shrink-0 shadow-2xs">
            {React.createElement(activeStop.icon, { className: "h-7 w-7 stroke-[2]" })}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#5A0E30] mb-2">
              {activeStop.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-base text-[#2A1620]/80 leading-relaxed font-normal mb-4">
              {activeStop.desc}
            </p>

            {/* Bottom Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fdeef4] px-4 py-1.5 text-xs font-bold text-[#a81a57]">
              <Check className="h-3.5 w-3.5 stroke-[3]" /> Keep one in {activeStop.keepIn}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
