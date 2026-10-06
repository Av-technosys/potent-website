/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  X,
  Waves,
  Car,
  Heart,
  Plane,
  Building2,
  Baby,
  User,
  Sparkles,
  Shield,
  HelpCircle,
} from "lucide-react";

export const LOOWAY_STORIES = [
  {
    id: "use",
    rail: "How to use",
    ch: "START HERE",
    cat: "Using it",
    t: "Using your bag",
    label: "How to use your bag",
    sub: "Four simple steps, start to seal",
    ic: Waves,
    slides: [
      {
        h: "Cleaner than you'd think",
        b: "Four simple steps, about ten seconds. Here's exactly how a Looway urine & vomit bag works.",
      },
      {
        h: "1 · Open the mouth wide",
        b: "Pull the soft white foam rim apart with your fingers. It spreads open and holds its shape, giving you a steady target. What gels the liquid is the super-absorbent strip inside, at the base.",
      },
      {
        h: "2 · Position by the high side",
        b: "The soft white foam rim is cut on a slant, so one edge sits higher — the high side. Men & boys hold it UP. Women & girls hold it DOWN, pressed close to the body.",
      },
      {
        h: "3 · Let it go",
        b: "Aim straight in. The super-absorbent strip at the base turns up to 700 ml of liquid into firm gel within seconds — no sloshing, no spills.",
      },
      {
        h: "4 · Seal & bin",
        b: "Press the sealable closure firmly until it locks — leak-proof and odour-locked — then drop it in any bin.",
        tip: "Keep two per traveller within easy reach — a bag you can't grab in five seconds won't help in a hurry.",
      },
    ],
  },
  {
    id: "motion",
    rail: "Motion sickness",
    ch: "START HERE",
    cat: "Using it",
    t: "For nausea & vomiting",
    label: "For motion sickness",
    sub: "Ready before the nausea hits",
    ic: Car,
    slides: [
      {
        h: "When the nausea hits",
        b: "A Looway bag isn't only for the toilet. Keep one within reach for carsickness, morning sickness or a sudden stomach turn.",
      },
      {
        h: "Open early",
        b: "At the first wave, pull the wide mouth open and hold it up close to your face. Far better ready than sorry.",
      },
      {
        h: "It holds it all",
        b: "The bag takes up to 700 ml, and the super-absorbent strip gels vomit just like liquid — no splashback, and the smell stays locked in.",
      },
      {
        h: "Seal & carry on",
        b: "Press the closure firmly until it locks, then slip it into the seat pocket or a side bin until you can dispose of it properly.",
      },
    ],
  },
  {
    id: "dispose",
    rail: "Dispose it",
    ch: "START HERE",
    cat: "Using it",
    t: "Sealing & binning",
    label: "Sealing & binning",
    sub: "Clean, discreet disposal",
    ic: Heart,
    slides: [
      {
        h: "Zero mess, zero fuss",
        b: "Because the contents are gelled solid and the closure is locked shut, disposal is as clean as throwing away a wrapper.",
      },
      {
        h: "Any bin works",
        b: "No special disposal needed. Drop the sealed bag into any dustbin — roadside, train, hospital or home.",
      },
      {
        h: "Discreet by design",
        b: "Opaque bag, sealed top. Nobody around you needs to know what's inside.",
      },
      {
        h: "Far from a bin?",
        b: "Fold and stash it in the outer pocket of your bag. It won't leak or smell until you reach one.",
        tip: "Never flush a bag. The gelled contents belong in a dustbin, not the toilet or drain.",
      },
    ],
  },
  {
    id: "pack",
    rail: "Pack smart",
    ch: "ON EVERY JOURNEY",
    cat: "Where it saves the day",
    t: "Pack light, worry less",
    label: "Pack light, worry less",
    sub: "The 2-minute travel check",
    ic: Plane,
    slides: [
      {
        h: "The 2-minute pack check",
        b: "Before any trip: water, a power bank, basic meds, wet wipes — and two Looway bags per traveller. The small stuff saves the day.",
      },
      {
        h: "Keep them where you'll reach",
        b: "Glovebox, handbag, nappy bag, backpack side pocket. Stash a few where you can grab one in seconds.",
      },
      {
        h: "One per person, plus spares",
        b: "For a short day out, 2 each is plenty. For long journeys or road trips, keep a pack of 20 in the car so you never run short.",
      },
      {
        h: "Build a little kit",
        b: "Pair Looway with seat covers for dodgy public loos and a reusable pee funnel for women & girls — a complete travel-hygiene kit.",
      },
    ],
  },
  {
    id: "yatra",
    rail: "Teerth yatra",
    ch: "ON EVERY JOURNEY",
    cat: "Where it saves the day",
    t: "Teerth yatra & pilgrimage",
    label: "Teerth yatra & pilgrimage",
    sub: "Dignity on the long route",
    ic: Building2,
    slides: [
      {
        h: "The yatra of a lifetime",
        b: "Char Dham, Vaishno Devi, Sabarimala, the Kumbh, Tirupati, Amarnath — sacred journeys, but rarely a clean toilet anywhere along the way.",
      },
      {
        h: "Hours in the queue",
        b: "A steep climb or a long darshan line can mean three or four hours with nowhere to go. A bag in the jhola keeps a full bladder from rushing a moment you travelled so far for.",
      },
      {
        h: "Don't let elders miss it",
        b: "So many parents quietly give up their dream yatra for fear of no clean toilet. Looway gives them a private, dignified option — so age and a weak bladder never stand between them and their darshan.",
      },
      {
        h: "Overnight buses & sleeper trains",
        b: "Yatra coaches run six to eight hours between stops. Everyone rests easier with a clean, sealable backup within reach of the seat or berth.",
      },
      {
        h: "Light enough for the jhola",
        b: "Flat, unisex and odour-locked — a few tuck in beside the prasad, the water bottle and the gamcha. Enough for the whole parivaar, the whole route.",
      },
    ],
  },
  {
    id: "toddlers",
    rail: "Toddlers",
    ch: "ON EVERY JOURNEY",
    cat: "Where it saves the day",
    t: "Travelling with toddlers",
    label: "Travelling with toddlers",
    sub: "No warning? No problem",
    ic: Baby,
    slides: [
      {
        h: "'I need to go — NOW'",
        b: "Toddlers give zero warning. Stuck in traffic or mid-highway, a Looway bag turns a meltdown into a non-event.",
      },
      {
        h: "Carsickness happens",
        b: "Little tummies and winding roads don't mix. Keep a bag in the door pocket for the sudden 'I feel funny'.",
      },
      {
        h: "Potty-training on the move",
        b: "Away from home during those tricky weeks? A familiar, clean option keeps the progress going.",
      },
      {
        h: "Calm parent, calm child",
        b: "When you're not panicking about the mess, they stay calm too.",
      },
    ],
  },
  {
    id: "pregnancy",
    rail: "Pregnancy & care",
    ch: "FOR EVERYONE",
    cat: "Care & confidence",
    t: "Pregnancy & bedside",
    label: "Pregnancy & bedside",
    sub: "Morning sickness to hospice",
    ic: Heart,
    slides: [
      {
        h: "Morning sickness, anywhere",
        b: "Nausea doesn't check your calendar. An expecting mum can keep a bag in her handbag for the sudden turns.",
      },
      {
        h: "Frequent trips, long journeys",
        b: "A growing bump and a smaller bladder make travel stressful. Looway means never being caught out between stops.",
      },
      {
        h: "Hospice & bedside dignity",
        b: "For someone bedridden or in palliative care, a clean, private option at the bedside protects their dignity and eases the carer's load.",
      },
      {
        h: "Kind to carers too",
        b: "Less laundry, less scrubbing, less strain — more time for what actually matters.",
      },
    ],
  },
  {
    id: "women",
    rail: "Women & girls",
    ch: "FOR EVERYONE",
    cat: "Care & confidence",
    t: "Women & girls on the go",
    label: "Women & girls on the go",
    sub: "Skip the dirty public loo",
    ic: User,
    slides: [
      {
        h: "Dirty public toilets? Skip them",
        b: "Highway dhabas, festival grounds, trekking trails — when the loo is unusable, you have a clean private alternative.",
      },
      {
        h: "Hold the high side down",
        b: "Women & girls hold the soft white foam high side (the taller foam edge) DOWN, pressed gently and securely against the body.",
      },
      {
        h: "Pair it with a pee funnel",
        b: "A reusable funnel makes standing use easy and mess-free. Together they're a small-space game-changer.",
      },
      {
        h: "Period-friendly too",
        b: "On heavy-flow travel days, that's one less worry about finding a clean bathroom.",
      },
    ],
  },
  {
    id: "why",
    rail: "Why Looway",
    ch: "FOR EVERYONE",
    cat: "Care & confidence",
    t: "Why not just any bag?",
    label: "Why not just any bag?",
    sub: "What makes Looway different",
    ic: Shield,
    slides: [
      {
        h: "A plastic bag isn't a plan",
        b: "Ordinary bags leak, tip over and reek. There's nothing to turn liquid solid and nothing to seal the smell away.",
      },
      {
        h: "The strip is the difference",
        b: "Looway's super-absorbent strip locks up to 700 ml into firm gel in seconds — so there's nothing left to spill.",
      },
      {
        h: "Sealed, opaque, odour-locked",
        b: "The sealable locking closure keeps everything in, and the opaque bag keeps it out of sight.",
      },
      {
        h: "Made for real journeys",
        b: "Compact, unisex, all-ages, and priced for keeping a few everywhere you go.",
      },
    ],
  },
  {
    id: "hygiene",
    rail: "Stay fresh",
    ch: "GOOD TO KNOW",
    cat: "Confidence & hygiene",
    t: "Hygiene on the road",
    label: "Hygiene on the road",
    sub: "Clean, even far from a tap",
    ic: Sparkles,
    slides: [
      {
        h: "Clean, even far from a tap",
        b: "No sink for hours? A Looway bag keeps the mess contained; a little hand sanitiser and a wet wipe finish the job.",
      },
      {
        h: "Seal, then sanitise",
        b: "Press the closure shut first, set the bag down, then clean your hands. Order matters — seal before you touch anything else.",
        tip: "Keep a small sanitiser bottle and a few wet wipes in the same pouch as your bags.",
      },
      {
        h: "Keep the car & bag clean",
        b: "Because the contents gel solid and the top locks, nothing leaks onto seats, floors or luggage.",
      },
      {
        h: "One pouch, sorted",
        b: "A small zip pouch — bags, wipes, sanitiser — turns 'ugh, now what?' into a ten-second, hygienic fix.",
      },
    ],
  },
  {
    id: "firsttime",
    rail: "First time?",
    ch: "GOOD TO KNOW",
    cat: "Confidence & hygiene",
    t: "First-time nerves",
    label: "First-time nerves",
    sub: "It's easier than it looks",
    ic: HelpCircle,
    slides: [
      {
        h: "It's easier than it looks",
        b: "Most people get it right on the very first go. Open wide, aim, go, seal — that's genuinely all there is to it.",
      },
      {
        h: "Practise the open once",
        b: "Before you need it, pull a bag's mouth wide open so you know how sturdy it is. It holds its shape and won't collapse.",
        tip: "A quick dry run at home means zero fumbling when it actually matters.",
      },
      {
        h: "Privacy is built in",
        b: "The bag is opaque and the seal is quiet. In a car or behind a dupatta, no one around you needs to know.",
      },
      {
        h: "You've got a plan now",
        b: "No anxiety about the next stop, no holding it in until your head hurts. You're ready for the road.",
      },
    ],
  },
];

export default function LoowayGuideSection() {
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const handleOpenStory = (storyId: string) => {
    const found = LOOWAY_STORIES.find((s) => s.id === storyId) || LOOWAY_STORIES[0];
    setActiveStory(found);
    setActiveSlideIndex(0);
  };

  const handleNextSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex < activeStory.slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
    } else {
      // Find next story
      const currIdx = LOOWAY_STORIES.findIndex((s) => s.id === activeStory.id);
      if (currIdx < LOOWAY_STORIES.length - 1) {
        setActiveStory(LOOWAY_STORIES[currIdx + 1]);
        setActiveSlideIndex(0);
      } else {
        setActiveStory(null);
      }
    }
  };

  const handlePrevSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
    } else {
      const currIdx = LOOWAY_STORIES.findIndex((s) => s.id === activeStory.id);
      if (currIdx > 0) {
        const prevStory = LOOWAY_STORIES[currIdx - 1];
        setActiveStory(prevStory);
        setActiveSlideIndex(prevStory.slides.length - 1);
      }
    }
  };

  return (
    <section id="watch-dont-read" className="w-full bg-[#FBF8F1] py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-[10.5px] sm:text-[11px] font-extrabold tracking-widest text-[#0E5C3A] uppercase">
            WATCH, DON&apos;T READ
          </span>
          <h2 className="mt-1.5 sm:mt-2 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A4A2E]">
            Step inside the Looway guide
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed text-[#17271E]/75 font-normal max-w-2xl">
            Quick, tappable stories — how to use it, how to bin it, and every kind of journey it saves. Tap a circle to enter, then tap or swipe through.
          </p>
        </div>

        {/* Got a Question Box */}
        <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border border-[#E4DED0] bg-white/90 p-4 sm:p-5 shadow-2xs">
          <p className="text-xs sm:text-sm font-semibold text-[#17271E]/80 mb-2.5">
            Got a question before you buy? Tap a common one — or dive into the full guide below.
          </p>

          <div className="flex overflow-x-auto pb-1 gap-1.5 mb-2.5 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { label: "Will it leak?", id: "why" },
              { label: "How does a woman use it?", id: "women" },
              { label: "Is the gel safe?", id: "use" },
              { label: "Can I fly with it?", id: "pack" },
              { label: "How do I dispose it?", id: "dispose" },
            ].map((pill) => (
              <button
                key={pill.label}
                onClick={() => handleOpenStory(pill.id)}
                className="cursor-pointer whitespace-nowrap rounded-full border border-[#E4DED0] bg-[#F6F1E7] px-3.5 py-1 text-[11.5px] sm:text-xs font-bold text-[#0A4A2E] transition-all hover:bg-[#0E5C3A] hover:text-white"
              >
                {pill.label}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              document.getElementById("pdp-hero")?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#0E5C3A] hover:underline"
          >
            ↑ I&apos;m all set — take me to the packs
          </button>
        </div>

        {/* Enter the Looway Guide Banner */}
        <div
          onClick={() => handleOpenStory(LOOWAY_STORIES[0].id)}
          className="group mt-6 flex cursor-pointer items-center justify-between rounded-3xl bg-gradient-to-r from-[#0E5C3A] via-[#0A4A2E] to-[#073622] p-5 text-white shadow-md transition-all hover:shadow-lg active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-xs">
              <Play className="ml-0.5 h-6 w-6 fill-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Enter the Looway guide
              </h3>
              <p className="text-xs text-white/80">
                Tap to step in — 11 quick stories, swipe through in a minute
              </p>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4C430] text-[#0A4A2E] transition-transform group-hover:translate-x-1">
            <ChevronRight className="h-5 w-5 stroke-[3]" />
          </div>
        </div>

        {/* Story Circles Full-Width Horizontal Scroll Bar */}
        <div className="mt-8 w-full flex items-start justify-between gap-2.5 sm:gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {LOOWAY_STORIES.map((st) => {
            const IconComp = st.ic;
            return (
              <button
                key={st.id}
                onClick={() => handleOpenStory(st.id)}
                className="group flex flex-col items-center gap-2 shrink-0 sm:flex-1 min-w-[68px] sm:min-w-0 cursor-pointer focus:outline-none transition-transform active:scale-95"
              >
                <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-[#0E5C3A] bg-white p-1 shadow-2xs transition-all group-hover:scale-105 group-hover:border-[#F4C430] group-hover:shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F6F1E7] text-[#0E5C3A]">
                    <IconComp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
                  </div>
                  <div className="absolute bottom-0 right-0 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#0E5C3A] text-white shadow-xs">
                    <Play className="ml-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 fill-white" />
                  </div>
                </div>
                <span className="text-[10.5px] sm:text-[11.5px] font-bold text-[#0A4A2E] text-center leading-tight max-w-[72px] sm:max-w-none">
                  {st.rail}
                </span>
              </button>
            );
          })}
        </div>

        {/* Categorized Guide Cards Section */}
        <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
          {/* Category 1 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-[#0E5C3A] text-[10px] sm:text-[11px] font-extrabold text-white">
                01
              </span>
              <div className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#0A4A2E] uppercase">
                START HERE • <span className="text-[#17271E]">Using it</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {[LOOWAY_STORIES[0], LOOWAY_STORIES[1], LOOWAY_STORIES[2]].map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleOpenStory(card.id)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#E4DED0] bg-white p-3 sm:p-4 shadow-2xs transition-all hover:border-[#0E5C3A] hover:shadow-md"
                >
                  <div className="min-w-0 pr-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A4A2E] truncate">
                      {card.label}
                    </h4>
                    <p className="mt-0.5 text-[10.5px] sm:text-xs text-[#17271E]/60 truncate">
                      {card.sub}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0E5C3A] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Category 2 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-[#0E5C3A] text-[10px] sm:text-[11px] font-extrabold text-white">
                02
              </span>
              <div className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#0A4A2E] uppercase">
                ON EVERY JOURNEY • <span className="text-[#17271E]">Where it saves the day</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {[LOOWAY_STORIES[3], LOOWAY_STORIES[4], LOOWAY_STORIES[5]].map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleOpenStory(card.id)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#E4DED0] bg-white p-3 sm:p-4 shadow-2xs transition-all hover:border-[#0E5C3A] hover:shadow-md"
                >
                  <div className="min-w-0 pr-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A4A2E] truncate">
                      {card.label}
                    </h4>
                    <p className="mt-0.5 text-[10.5px] sm:text-xs text-[#17271E]/60 truncate">
                      {card.sub}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0E5C3A] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Category 3 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-[#0E5C3A] text-[10px] sm:text-[11px] font-extrabold text-white">
                03
              </span>
              <div className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#0A4A2E] uppercase">
                FOR EVERYONE • <span className="text-[#17271E]">Care &amp; confidence</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {[LOOWAY_STORIES[6], LOOWAY_STORIES[7], LOOWAY_STORIES[8]].map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleOpenStory(card.id)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#E4DED0] bg-white p-3 sm:p-4 shadow-2xs transition-all hover:border-[#0E5C3A] hover:shadow-md"
                >
                  <div className="min-w-0 pr-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A4A2E] truncate">
                      {card.label}
                    </h4>
                    <p className="mt-0.5 text-[10.5px] sm:text-xs text-[#17271E]/60 truncate">
                      {card.sub}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0E5C3A] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Category 4 */}
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-[#0E5C3A] text-[10px] sm:text-[11px] font-extrabold text-white">
                04
              </span>
              <div className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#0A4A2E] uppercase">
                NO ANXIETY • <span className="text-[#17271E]">Travel ready</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-4">
              {[LOOWAY_STORIES[9], LOOWAY_STORIES[10]].map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleOpenStory(card.id)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#E4DED0] bg-white p-3 sm:p-4 shadow-2xs transition-all hover:border-[#0E5C3A] hover:shadow-md"
                >
                  <div className="min-w-0 pr-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A4A2E] truncate">
                      {card.label}
                    </h4>
                    <p className="mt-0.5 text-[10.5px] sm:text-xs text-[#17271E]/60 truncate">
                      {card.sub}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0E5C3A] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* STORY READER POPUP MODAL                                                 */}
      {/* ========================================================================= */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex h-[85vh] max-h-[640px] w-full max-w-sm flex-col justify-between overflow-hidden rounded-3xl bg-[#0E5C3A] text-white shadow-2xl">
            {/* Top Bar: Progress Bars + Header */}
            <div className="p-5 pb-2">
              {/* Progress Bar Segments */}
              <div className="flex gap-1.5 mb-4">
                {activeStory.slides.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
                  >
                    <div
                      className={`h-full bg-[#F4C430] transition-all duration-300 ${
                        idx === activeSlideIndex
                          ? "w-full"
                          : idx < activeSlideIndex
                          ? "w-full"
                          : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Title & Close */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#F4C430] uppercase tracking-wider">
                  {activeStory.t}
                </span>
                <button
                  onClick={() => setActiveStory(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Slide Content Body */}
            <div className="flex-1 px-6 py-4 flex flex-col justify-center">
              <h3 className="font-serif text-2xl font-extrabold text-white leading-tight">
                {activeStory.slides[activeSlideIndex]?.h}
              </h3>
              <p className="mt-3 text-sm text-white/90 leading-relaxed font-normal">
                {activeStory.slides[activeSlideIndex]?.b}
              </p>

              {activeStory.slides[activeSlideIndex]?.tip && (
                <div className="mt-6 rounded-2xl bg-white/10 p-3.5 border border-white/20 text-xs text-[#F4C430] font-semibold">
                  💡 {activeStory.slides[activeSlideIndex].tip}
                </div>
              )}
            </div>

            {/* Bottom Nav Controls */}
            <div className="p-5 pt-2 flex items-center justify-between border-t border-white/10">
              <button
                onClick={handlePrevSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="text-xs font-bold text-white/70">
                {activeSlideIndex + 1} of {activeStory.slides.length}
              </span>

              <button
                onClick={handleNextSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4C430] text-[#0A4A2E] font-bold hover:bg-yellow-400"
              >
                <ChevronRight className="h-5 w-5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
