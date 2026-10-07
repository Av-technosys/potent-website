/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  X,
  Waves,
  Heart,
  Building2,
  Mountain,
  UserCheck,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  Filter,
  Droplets,
} from "lucide-react";

export const CHAPTERS_DATA = [
  {
    num: "01",
    eyebrow: "START HERE",
    title: "Master it",
    items: [
      {
        id: "use",
        title: "How to use your funnel",
        sub: "Six simple steps, start to store",
        slides: [
          {
            h: "Easy as 1, 2, 3",
            b: "Standing to pee is simple and natural with the Looway Pee Funnel. Unzip your trousers or pull clothing aside slightly.",
            tip: "Pro Tip: Standing slightly forward with feet apart helps position the funnel perfectly.",
          },
          {
            h: "1 · Place & position",
            b: "Hold the wide opening flush against your body so the back edge sits just behind where you pee — about a thumb's width back.",
            tip: "Ensure a snug seal against your skin from front to back to prevent leaks.",
          },
          {
            h: "2 · Stand & pee",
            b: "Tilt the spout down and away into the toilet bowl or container. Relax and pee normally — the wide funnel catches the stream smoothly.",
            tip: "Start your stream gently until the seal feels solid, then relax.",
          },
          {
            h: "3 · Wipe & store",
            b: "Slide forward along the skin to catch the last drops, shake dry or rinse under water, and slip it into your cotton pouch.",
            tip: "Rinse or wipe clean before stashing back in your handbag.",
          },
        ],
      },
      {
        id: "seal",
        title: "Why it doesn't leak",
        sub: "The three-part leak-free seal",
        slides: [
          {
            h: "The secret to zero leaks",
            b: "100% Medical-grade soft silicone conforms snugly against your body to form a leak-free anatomical barrier.",
          },
          {
            h: "Gravity does the work",
            b: "As long as the spout is angled downwards, gravity channels every drop straight out — no overflow, no mess.",
            tip: "Keep the back edge placed snug against skin before starting your stream.",
          },
        ],
      },
      {
        id: "practice",
        title: "Practice at home",
        sub: "Nail it before you go",
        slides: [
          {
            h: "One shower test = 100% confidence",
            b: "Try the funnel once in the shower at home before your trip. Almost every woman gets it right on the very first try!",
            tip: "A practice run eliminates first-time nerves completely.",
          },
        ],
      },
    ],
  },
  {
    num: "02",
    eyebrow: "ON EVERY JOURNEY",
    title: "Where & when it helps",
    items: [
      {
        id: "toilets",
        title: "Any toilet — or none",
        sub: "Seats, squats & outdoors",
        slides: [
          {
            h: "Western, Indian or Outdoors",
            b: "Stand over a Western seat without touching it, aim over a squat toilet pan, or step out beside the car on the highway.",
            tip: "Your skin never touches a single public toilet seat again.",
          },
        ],
      },
      {
        id: "squat",
        title: "When squatting hurts",
        sub: "Joint pain, pregnancy & UTIs",
        slides: [
          {
            h: "Zero squatting, zero strain",
            b: "Relieve knee arthritis strain, joint stiffness and back pressure. Standing to pee means no painful crouching or bending.",
            tip: "Gentle relief when your knees or bump need it most.",
          },
        ],
      },
      {
        id: "treks",
        title: "Treks, camping & festivals",
        sub: "Nowhere to squat? No problem",
        slides: [
          {
            h: "The outdoor & festival solution",
            b: "Pee standing up in the wild, at music festivals or camping without squatting in bushes or waiting in portaloo queues.",
            tip: "Leave-no-trace outdoor hygiene made simple.",
          },
        ],
      },
    ],
  },
  {
    num: "03",
    eyebrow: "FOR EVERY WOMAN",
    title: "Made for you",
    items: [
      {
        id: "preg",
        title: "Pregnancy travel",
        sub: "No squatting, no contact",
        slides: [
          {
            h: "Pregnancy travel relief",
            b: "Frequent urgency and sore hips arrive when squatting is hardest. Standing to pee gives safe, external relief right through pregnancy.",
            tip: "100% Safe for external use during all trimesters.",
          },
        ],
      },
      {
        id: "seniors",
        title: "Seniors & sore knees",
        sub: "Independence, restored",
        slides: [
          {
            h: "Dignified independence",
            b: "Senior women and mothers get full independence on travel and outings without painful crouching on low dirty toilets.",
          },
        ],
      },
      {
        id: "why",
        title: "Why a pee funnel?",
        sub: "What makes it worth it",
        slides: [
          {
            h: "Built for every woman's freedom",
            b: "100% Medical-grade silicone, soft, reusable for 5+ years, splash-guard rim, and includes a breathable cotton travel pouch.",
          },
        ],
      },
    ],
  },
  {
    num: "04",
    eyebrow: "CONFIDENCE",
    title: "Clean & discreet",
    items: [
      {
        id: "clean",
        title: "Cleaning & care",
        sub: "Reusable for years",
        slides: [
          {
            h: "Rinse or sanitize easily",
            b: "Wipe with wet wipes or rinse with water while travelling. Soak in boiling water for 2-3 minutes at home for deep sanitization.",
          },
        ],
      },
      {
        id: "discreet",
        title: "Discreet & first-time nerves",
        sub: "Easier than you think",
        slides: [
          {
            h: "Pocket-sized privacy",
            b: "Folds compactly into the breathable cotton pouch — fits in any purse, handbag, or glovebox for total peace of mind.",
          },
        ],
      },
    ],
  },
];

export const ALL_STORIES_FLAT = CHAPTERS_DATA.flatMap((ch) =>
  ch.items.map((item) => ({ ...item, category: `${ch.num} ${ch.eyebrow}` }))
);

export default function FunnelGuideSection() {
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const openStory = (story: any) => {
    setActiveStory(story);
    setActiveSlideIndex(0);
  };

  const closeStory = () => {
    setActiveStory(null);
    setActiveSlideIndex(0);
  };

  const nextSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex < activeStory.slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
    } else {
      closeStory();
    }
  };

  const prevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
    }
  };

  const scrollToHeroPacks = () => {
    const el = document.getElementById("specs");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="guide" className="w-full bg-[#fcf8f3] scroll-mt-32 sm:scroll-mt-36 py-12 sm:py-18 lg:py-22 text-[#2A1620]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Eyebrow & Header */}
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2">
              WATCH, DON&apos;T READ
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#5A0E30] leading-[1.08] tracking-tight">
              Step inside the Looway guide
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-[#2A1620]/75 leading-relaxed font-normal">
              Quick, tappable stories — how to use it, how to get a leak-free seal, how to keep it clean, and every kind of journey it saves. Tap a circle to enter, then tap or swipe through.
            </p>
          </div>

          {/* Top Question Pills Box */}
          <div className="rounded-2xl bg-[#fdeef4] border border-[#f8dce8] p-5 sm:p-6 mb-8 shadow-2xs">
            <p className="text-xs sm:text-sm font-semibold text-[#5A0E30] mb-3">
              Got a question before you buy? Tap a common one — or dive into the full guide below.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {ALL_STORIES_FLAT.slice(0, 5).map((story) => (
                <button
                  key={story.id}
                  onClick={() => openStory(story)}
                  className="rounded-full bg-white border border-[#f8dce8] px-4 py-2 text-xs font-bold text-[#a81a57] hover:bg-[#a81a57] hover:text-white transition-all shadow-2xs cursor-pointer"
                >
                  {story.title}?
                </button>
              ))}
            </div>
            <button
              onClick={scrollToHeroPacks}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b51e60] hover:underline cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>I&apos;m all set — take me to the packs</span>
            </button>
          </div>

          {/* Banner Bar Button */}
          <div
            onClick={() => openStory(ALL_STORIES_FLAT[0])}
            className="rounded-2xl bg-gradient-to-r from-[#a81a57] to-[#5A0E30] p-4 sm:p-6 text-white flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-[#F4C430]">
                <Play className="h-6 w-6 fill-[#F4C430]" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Enter the Looway guide
                </h3>
                <p className="text-xs sm:text-sm text-white/85">
                  Tap to step in — 11 quick stories, swipe through in a minute
                </p>
              </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4C430] text-[#5A0E30] font-bold">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* Full Width Top Strap for 11 Story Circles */}
          <div className="w-full rounded-2xl bg-white border border-[#f8dce8] p-3 sm:p-4 shadow-2xs mb-10">
            <div className="w-full flex items-center justify-between gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              {ALL_STORIES_FLAT.map((story) => (
                <button
                  key={story.id}
                  onClick={() => openStory(story)}
                  className="flex flex-col items-center gap-1.5 shrink-0 min-w-[70px] max-w-[85px] text-center cursor-pointer group"
                >
                  <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-[#F4C430] bg-white p-1 shadow-2xs group-hover:scale-105 transition-all">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#fdeef4] text-[#a81a57]">
                      <Filter className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
                    </div>
                    <span className="absolute bottom-0 right-0 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#a81a57] text-white shadow-xs">
                      <Play className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-white" />
                    </span>
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] font-bold text-[#5A0E30] leading-tight line-clamp-2">
                    {story.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4 CHAPTER CATEGORIZED GRID - EXACT SCREENSHOT MATCH */}
          <div className="space-y-10">
            {CHAPTERS_DATA.map((ch) => (
              <div key={ch.num}>
                {/* Chapter Header Badge & Title Stack */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#a81a57] text-sm font-extrabold text-white shrink-0 mt-0.5 shadow-2xs">
                    {ch.num}
                  </span>
                  <div>
                    <span className="text-[10.5px] font-extrabold tracking-widest text-[#b51e60] uppercase block leading-none mb-1">
                      {ch.eyebrow}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#5A0E30] leading-tight">
                      {ch.title}
                    </h3>
                  </div>
                </div>

                {/* Chapter Cards Grid */}
                <div
                  className={
                    ch.items.length === 2
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                  }
                >
                  {ch.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openStory(item)}
                      className="flex items-center justify-between rounded-2xl border border-[#f8dce8] bg-white p-4 sm:p-5 text-left shadow-2xs hover:border-[#a81a57] hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#5A0E30] group-hover:text-[#a81a57] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#2A1620]/60 mt-1 font-medium">
                          {item.sub}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#b51e60]/60 group-hover:text-[#a81a57] shrink-0 ml-3 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERTICAL MOBILE STORY OVERLAY POPUP MODAL */}
      {activeStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-[360px] h-[640px] max-h-[90vh] rounded-[32px] bg-gradient-to-b from-[#5A0E30] via-[#7A1543] to-[#2A1620] text-white p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden border-2 border-white/20">
            {/* Top Progress Segment Bars */}
            <div>
              <div className="mb-4 flex gap-1.5">
                {activeStory.slides.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      idx <= activeSlideIndex ? "bg-[#F4C430]" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              {/* Story Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[#F4C430] border border-white/20">
                    <Filter className="h-4 w-4 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#F4C430]">
                      LOOWAY GUIDE
                    </span>
                    <h4 className="text-xs font-bold text-white truncate max-w-[190px]">
                      {activeStory.title}
                    </h4>
                  </div>
                </div>

                {/* Close X Button */}
                <button
                  type="button"
                  onClick={closeStory}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Vertical Centered Story Content */}
            <div className="my-auto py-4 flex flex-col justify-center space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                Slide {activeSlideIndex + 1} of {activeStory.slides.length}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F4C430] leading-tight">
                {activeStory.slides[activeSlideIndex].h}
              </h3>
              <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium">
                {activeStory.slides[activeSlideIndex].b}
              </p>

              {activeStory.slides[activeSlideIndex].tip && (
                <div className="mt-2 rounded-xl bg-white/10 border border-white/15 p-3 text-xs text-white/90 font-normal leading-relaxed">
                  💡 {activeStory.slides[activeSlideIndex].tip}
                </div>
              )}
            </div>

            {/* Vertical Bottom Navigation Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/15">
              <button
                type="button"
                onClick={prevSlide}
                disabled={activeSlideIndex === 0}
                className="flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="flex items-center gap-1.5 rounded-full bg-[#F4C430] px-5 py-2.5 text-xs font-extrabold text-[#5A0E30] shadow-md hover:bg-white cursor-pointer transition-all"
              >
                {activeSlideIndex < activeStory.slides.length - 1 ? (
                  <>Next <ChevronRight className="h-4 w-4" /></>
                ) : (
                  "Done"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
