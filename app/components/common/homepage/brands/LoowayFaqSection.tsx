"use client";

import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    q: "Will the funnel leak on me?",
    a: "Once the seal settles, it holds. Place the back edge about a thumb’s width behind where you pee (not forward), press the rim snug and start slowly. Practise two to five times at home first; a little spill while you learn is normal, and it gets easier each time.",
  },
  {
    q: "Do I have to undress to use the funnel?",
    a: "Only a little. Lower your trousers to mid-thigh, or lift a skirt or saree and move your underwear aside. With practice you can use it with your clothes barely moved.",
  },
  {
    q: "Can I use Looway in pregnancy?",
    a: "Yes. The funnel is for external use and means no squatting, the covers let you sit on a public seat, and the bags are there if nausea strikes on the road. Check with your doctor if you have any concerns.",
  },
  {
    q: "How do I clean the funnel on a train?",
    a: "Wipe or rinse it with plain water and put it back in its cotton pouch. If you cannot rinse it, keep it in the pouch and wash it with soap and water the same day, then let it air-dry.",
  },
  {
    q: "Do the seat covers work on Indian squat toilets?",
    a: "No, they are made for Western, sit-down seats, including larger oval ones. For a squat pan, the funnel lets you stand instead.",
  },
  {
    q: "Where do used bags and covers go?",
    a: "In any general bin. Never flush them. The covers are plain paper that breaks down once binned; the bags are made from recyclable material, and a used bag goes into general waste. On a trek, pack them out.",
  },
  {
    q: "Can children use the pee and puke bag?",
    a: "Yes, with an adult. Hold it like a potty for a toddler, or close to the face for a car-sick child. The absorbent strip is harmful if swallowed, so keep used bags away from young children and pets.",
  },
  {
    q: "Can I carry the bags on a flight?",
    a: "They are flat, dry and hold no liquid until you use them, so they pack like any other travel item. Rules vary by airline and airport, so check yours before you fly.",
  },
  {
    q: "What if my order arrives damaged?",
    a: "We replace anything damaged or wrong, free. Email a photo and your order number to care@potenthygiene.com. For hygiene reasons, Looway can’t be returned or exchanged once shipped.",
  },
];

const TICKER_ITEMS = [
  "Filthy seat? Sit down.",
  "Squat toilet? Stand up.",
  "No toilet? Looway.",
  "Car sick? Morning sick? Bag it.",
  "Fits in a handbag",
  "Bin it, never flush it",
  "Eleven Yatra Kits",
  "Ships within 24 hours",
];

export function LoowayFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const visibleFaqs = showAll ? FAQS_DATA : FAQS_DATA.slice(0, 4);

  const repeatedTicker = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];

  return (
    <section className="w-full overflow-hidden bg-[#EBF7F8] pt-12 pb-0 md:pt-20">
      {/* Main Container */}
      <div className="mx-auto mb-12 max-w-4xl px-4 sm:mb-16 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <span className="mb-2 block text-[11px] font-bold tracking-widest text-[#006573] uppercase">
            QUESTIONS, ANSWERED
          </span>
          <h2 className="font-serif text-[27px] leading-[29.16px] font-semibold text-[#1A150F] sm:text-[46px] sm:leading-[49.68px]">
            Before you pack.
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-2 sm:space-y-2">
          {visibleFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-teal-100/70 bg-white p-4 shadow-2xs transition-all duration-200 sm:p-5"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <span className="text-sm font-bold text-[#1F1915] sm:text-base">
                    {faq.q}
                  </span>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#006573] transition-transform duration-200">
                    {isOpen ? (
                      <Minus className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 border-t border-gray-100 pt-3 text-xs leading-relaxed font-normal text-[#4C6467] sm:text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Toggle Show All / Show Less Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#006573] px-6 py-2.5 text-xs font-semibold text-[#006573] shadow-2xs transition-all hover:bg-teal-50/60 sm:text-sm"
          >
            <span>{showAll ? "Show less" : "Show all 9 questions"}</span>
            {showAll ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Loop Ticker Strap with Top Checkerboard Patti */}
      <div className="w-full overflow-hidden">
        {/* Top Patti */}
      

        {/* Yellow Marquee Ticker Bar */}
        <div className="w-full bg-[#f3efe4] py-4">
          <div
            className="animate-marquee flex w-max items-center space-x-8 font-serif text-sm font-bold whitespace-nowrap text-[#004851] sm:text-base"
            style={{ animationDuration: "35s" }}
          >
            {repeatedTicker.map((item, idx) => (
              <div key={idx} className="flex shrink-0 items-center space-x-8">
                <span>{item}</span>
                <span className="text-xs font-bold text-[#004851]/70">+</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
