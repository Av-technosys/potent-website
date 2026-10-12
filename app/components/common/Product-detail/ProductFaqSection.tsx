/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
  q: string;
  a: string;
};

export type FaqGroup = {
  title: string;
  items: FaqItem[];
};

export type ProductFaqTheme = "looway" | "looway-blue" | "pink" | "ovy";

interface ThemeStyles {
  bg: string;
  sectionText: string;
  subtitle: string;
  title: string;
  cardBorder: string;
  cardText: string;
  cardTextHover: string;
  activePill: string;
  inactivePill: string;
  openChevron: string;
  closedChevron: string;
  answerText: string;
  divider: string;
}

const THEME_STYLES: Record<ProductFaqTheme, ThemeStyles> = {
  looway: {
    bg: "bg-[#F1F7F3]",
    sectionText: "text-[#17271E]",
    subtitle: "text-[#0E5C3A]",
    title: "text-[#0A4A2E]",
    cardBorder: "border-[#E4DED0]",
    cardText: "text-[#0A4A2E]",
    cardTextHover: "hover:text-[#0E5C3A]",
    activePill: "bg-[#0E5C3A] text-white shadow-2xs",
    inactivePill: "border border-[#E4DED0] bg-white text-[#17271E]/80",
    openChevron: "rotate-180 bg-[#0E5C3A] text-white",
    closedChevron: "bg-[#E4F0E8] text-[#0E5C3A]",
    answerText: "text-[#17271E]/80",
    divider: "border-[#E4DED0]/60",
  },
  "looway-blue": {
    bg: "bg-[#F5FAFD]",
    sectionText: "text-[#083B5C]",
    subtitle: "text-[#0F6DA6]",
    title: "text-[#083B5C]",
    cardBorder: "border-[#D3E7F4]",
    cardText: "text-[#083B5C]",
    cardTextHover: "hover:text-[#0F6DA6]",
    activePill: "bg-[#0F6DA6] text-white shadow-2xs",
    inactivePill: "border border-[#D3E7F4] bg-white text-[#083B5C]/80",
    openChevron: "rotate-180 bg-[#0F6DA6] text-white",
    closedChevron: "bg-[#EAF6FD] text-[#0F6DA6]",
    answerText: "text-[#083B5C]/80",
    divider: "border-[#D3E7F4]/60",
  },
  pink: {
    bg: "bg-[#fdeef4]",
    sectionText: "text-[#5A0E30]",
    subtitle: "text-[#b51e60]",
    title: "text-[#5A0E30]",
    cardBorder: "border-[#EAD6DC]",
    cardText: "text-[#5A0E30]",
    cardTextHover: "hover:text-[#a81a57]",
    activePill: "bg-[#a81a57] text-white shadow-2xs",
    inactivePill: "border border-[#EAD6DC] bg-white text-[#5A0E30]/80",
    openChevron: "rotate-180 bg-[#a81a57] text-white",
    closedChevron: "bg-[#fdeef4] text-[#a81a57]",
    answerText: "text-[#5A0E30]/80",
    divider: "border-[#EAD6DC]/60",
  },
  ovy: {
    bg: "bg-[#FAF6F8]",
    sectionText: "text-[#1A150F]",
    subtitle: "text-[#7E4D77]",
    title: "text-[#1A150F]",
    cardBorder: "border-[#EAD6DC]",
    cardText: "text-[#1A150F]",
    cardTextHover: "hover:text-[#7E4D77]",
    activePill: "bg-[#7E4D77] text-white shadow-2xs",
    inactivePill: "border border-[#EAD6DC] bg-white text-[#1A150F]/80",
    openChevron: "rotate-180 bg-[#7E4D77] text-white",
    closedChevron: "bg-[#F3E6F0] text-[#7E4D77]",
    answerText: "text-[#1A150F]/80",
    divider: "border-[#EAD6DC]/60",
  },
};

export function buildFaqGroups(
  dbFaqs?: Array<{ question?: string; answer?: string; q?: string; a?: string; priority?: number }>,
  contentGroups?: Array<[string, Array<[string, string]>]>,
): { left: FaqGroup[]; right: FaqGroup[] } {
  const fallbackGroups = contentGroups || [];

  if (!dbFaqs || dbFaqs.length === 0) {
    if (fallbackGroups.length > 0) {
      const all: FaqGroup[] = fallbackGroups.map(([title, items]) => ({
        title: title.toUpperCase(),
        items: items.map(([q, a]) => ({ q, a })),
      }));
      const left: FaqGroup[] = [];
      const right: FaqGroup[] = [];
      all.forEach((g, idx) => {
        if (idx % 2 === 0) left.push(g);
        else right.push(g);
      });
      return { left, right };
    }
    return { left: [], right: [] };
  }

  // Predefined template groups
  const templateGroups: Array<{ title: string; originalQuestions: string[] }> =
    fallbackGroups.map(([title, items]) => ({
      title: title.toUpperCase(),
      originalQuestions: items.map(([q]) => q.trim().toLowerCase()),
    }));

  const populatedGroups: FaqGroup[] = templateGroups.map((tg) => ({
    title: tg.title,
    items: [],
  }));

  const qToGroup = new Map<string, number>();
  templateGroups.forEach((tg, gIdx) => {
    tg.originalQuestions.forEach((q) => {
      qToGroup.set(q, gIdx);
    });
  });

  const unassigned: FaqItem[] = [];

  let cumulativeCount = 0;
  const groupRanges = templateGroups.map((tg) => {
    const start = cumulativeCount;
    cumulativeCount += tg.originalQuestions.length;
    return { start, end: cumulativeCount };
  });

  dbFaqs.forEach((item, idx) => {
    const qText = (item.question || item.q || "").trim();
    const aText = item.answer || item.a || "";
    if (!qText) return;

    const matchedIdx = qToGroup.get(qText.toLowerCase());
    if (matchedIdx !== undefined) {
      populatedGroups[matchedIdx].items.push({ q: qText, a: aText });
    } else {
      const priority = item.priority ?? idx;
      const rangeIdx = groupRanges.findIndex(
        (r) => priority >= r.start && priority < r.end,
      );
      if (rangeIdx !== -1) {
        populatedGroups[rangeIdx].items.push({ q: qText, a: aText });
      } else {
        unassigned.push({ q: qText, a: aText });
      }
    }
  });

  let activeGroups = populatedGroups.filter((g) => g.items.length > 0);

  if (unassigned.length > 0) {
    if (activeGroups.length > 0) {
      activeGroups.push({
        title: "MORE QUESTIONS",
        items: unassigned,
      });
    } else {
      // Split unassigned directly into two groups
      const half = Math.ceil(unassigned.length / 2);
      return {
        left: [{ title: "FREQUENTLY ASKED QUESTIONS", items: unassigned.slice(0, half) }],
        right: [{ title: "ADDITIONAL QUESTIONS", items: unassigned.slice(half) }],
      };
    }
  }

  if (activeGroups.length === 0) {
    if (fallbackGroups.length > 0) {
      const all: FaqGroup[] = fallbackGroups.map(([title, items]) => ({
        title: title.toUpperCase(),
        items: items.map(([q, a]) => ({ q, a })),
      }));
      const left: FaqGroup[] = [];
      const right: FaqGroup[] = [];
      all.forEach((g, idx) => {
        if (idx % 2 === 0) left.push(g);
        else right.push(g);
      });
      return { left, right };
    }
    return { left: [], right: [] };
  }

  const left: FaqGroup[] = [];
  const right: FaqGroup[] = [];

  activeGroups.forEach((group, idx) => {
    if (idx % 2 === 0) {
      left.push(group);
    } else {
      right.push(group);
    }
  });

  return { left, right };
}

interface ProductFaqSectionProps {
  faqs?: Array<{ question?: string; answer?: string; q?: string; a?: string; priority?: number }>;
  content?: any;
  theme?: ProductFaqTheme;
  id?: string;
}

export default function ProductFaqSection({
  faqs,
  content,
  theme = "ovy",
  id = "faq",
}: ProductFaqSectionProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const styles = THEME_STYLES[theme] || THEME_STYLES.ovy;

  const faqData = useMemo(() => {
    return buildFaqGroups(faqs, content?.FAQ_GROUPS);
  }, [faqs, content]);

  const toggleItem = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const allGroups = useMemo(
    () => [...faqData.left, ...faqData.right],
    [faqData.left, faqData.right],
  );

  const categories = useMemo(() => {
    return [
      { id: "all", label: "All questions" },
      ...allGroups.map((g) => ({ id: g.title, label: g.title })),
    ];
  }, [allGroups]);

  if (allGroups.length === 0) {
    return null;
  }

  const renderGroup = (
    group: FaqGroup,
    groupIdx: number,
    colPrefix: string,
  ) => (
    <div key={groupIdx} className="mb-6 space-y-2">
      <h4
        className={`mb-2.5 text-[11px] font-extrabold tracking-widest uppercase ${styles.subtitle}`}
      >
        {group.title}
      </h4>
      <div className="space-y-2">
        {group.items.map((item, itemIdx) => {
          const itemKey = `${colPrefix}-${groupIdx}-${itemIdx}`;
          const isOpen = openKey === itemKey;

          return (
            <div
              key={itemIdx}
              className={`overflow-hidden rounded-2xl border ${styles.cardBorder} bg-white shadow-2xs transition-all duration-200`}
            >
              <button
                onClick={() => toggleItem(itemKey)}
                className={`flex w-full items-center justify-between p-3.5 text-left font-sans text-xs font-bold sm:p-4.5 sm:text-sm transition-colors ${styles.cardText} ${styles.cardTextHover}`}
              >
                <span className="pr-2.5 leading-snug">{item.q}</span>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-300 sm:h-7 sm:w-7 ${
                    isOpen ? styles.openChevron : styles.closedChevron
                  }`}
                >
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </button>

              {isOpen && (
                <div
                  className={`border-t ${styles.divider} px-3.5 pt-3 pb-4 text-xs leading-relaxed font-normal sm:px-4.5 sm:text-sm ${styles.answerText}`}
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section
      id={id}
      className={`w-full scroll-mt-32 py-8 sm:scroll-mt-36 sm:py-16 lg:py-20 ${styles.bg} ${styles.sectionText}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-12">
          <span
            className={`mb-1.5 block text-[10.5px] font-extrabold tracking-widest uppercase sm:mb-2 sm:text-xs ${styles.subtitle}`}
          >
            GOOD TO KNOW
          </span>
          <h2
            className={`font-serif text-2xl leading-tight font-extrabold sm:text-4xl lg:text-[40px] ${styles.title}`}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* Mobile Category Filter Tabs (< lg screens) */}
        {categories.length > 2 && (
          <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? styles.activePill
                    : styles.inactivePill
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Mobile View: Show selected category group or all */}
        <div className="block lg:hidden">
          {allGroups
            .filter(
              (g) => activeCategory === "all" || g.title === activeCategory,
            )
            .map((group, idx) => renderGroup(group, idx, "mob"))}
        </div>

        {/* Desktop View (lg:grid 2 Columns) */}
        <div className="hidden grid-cols-2 items-start gap-x-8 gap-y-4 lg:grid">
          {/* Left Column */}
          <div>
            {faqData.left.map((group, idx) => renderGroup(group, idx, "left"))}
          </div>

          {/* Right Column */}
          <div>
            {faqData.right.map((group, idx) =>
              renderGroup(group, idx, "right"),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

