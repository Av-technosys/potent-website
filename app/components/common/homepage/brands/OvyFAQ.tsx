"use client";

import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const OVY_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Which size is right for me, L, XL or XL+?",
    answer:
      "Choose L (240mm) for regular or light flow days, XL (280mm) for heavy flow or active days, and XL+ (320mm) with dual leak guards for overnight sleep or extra-heavy flow days. You can also mix all three sizes in a single box.",
  },
  {
    id: 2,
    question: "What is Mix Your Box, and does the price change with the split?",
    answer:
      "Mix Your Box allows you to choose any combination of 21 pads across L, XL, and XL+ sizes to match your personal period flow. The price stays exactly the same regardless of which size split you choose.",
  },
  {
    id: 3,
    question: "Are Ovy pads safe for sensitive skin?",
    answer:
      "Yes, Ovy pads feature a 100% organic cotton top sheet with zero added chlorine bleach, parabens, dyes, or synthetic fragrances. They are dermatologically tested and hypoallergenic to prevent irritation and rashes.",
  },
  {
    id: 4,
    question: "How many pads are in one box?",
    answer:
      "Every Ovy box contains 21 organic power pads (in your chosen size split) plus 4 complimentary daily panty liners. Every single pad and liner includes its own biodegradable disposal wrapper.",
  },
  {
    id: 5,
    question: "How does Cycle-Sync subscription delivery work?",
    answer:
      "You enter three period dates once during checkout. Our algorithm predicts your next cycle and delivers your fresh box about 5 days before your period is due. You can pause, skip, or cancel your subscription anytime.",
  },
  {
    id: 6,
    question: "Are Ovy products rash-free and plastic-free?",
    answer:
      "Yes! Our pads use a breathable organic cotton top layer and natural plant fibers instead of plastic top sheets. This prevents heat and sweat buildup, keeping you 100% rash-free and fresh.",
  },
  {
    id: 7,
    question: "How do I care for and wash the Menstrual Cup?",
    answer:
      "Boil your Ovy Cup in water for 5–7 minutes before your first use and after each cycle. During your period, simply wash it with warm water and mild fragrance-free soap between empties.",
  },
  {
    id: 8,
    question: "What is the return/exchange policy for hygiene products?",
    answer:
      "Due to strict intimate hygiene safety standards, opened hygiene products cannot be returned. However, if your order arrives damaged or defective, contact our support team within 7 days for a hassle-free replacement.",
  },
];

export function OvyFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggleItem = (id: number) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const displayedFaqs = showAll ? OVY_FAQS : OVY_FAQS.slice(0, 4);

  return (
    <section className="w-full bg-[#F4EBFA] py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#602E55] uppercase block mb-2">
            QUESTIONS, ANSWERED
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1915] leading-tight">
            Before you buy.
          </h2>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3 text-left mb-8">
          {displayedFaqs.map((faq) => {
            const isOpen = openIndex === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-purple-100/70 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-base text-[#1F1915] hover:text-[#602E55] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.question}</span>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5EFF6] text-[#602E55] flex items-center justify-center shrink-0 transition-transform duration-200">
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-[#5C524D] leading-relaxed border-t border-purple-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Toggle Show All 8 Questions Button */}
        <div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="border border-[#602E55] text-[#602E55] bg-white hover:bg-[#F5EFF6] rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <span>
              {showAll ? "Show fewer questions" : `Show all ${OVY_FAQS.length} questions`}
            </span>
            {showAll ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
