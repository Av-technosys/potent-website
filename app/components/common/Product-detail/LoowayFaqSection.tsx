/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  q: string;
  a: string;
};

type FaqGroup = {
  title: string;
  items: FaqItem[];
};

const FAQ_DATA: { left: FaqGroup[]; right: FaqGroup[] } = {
  left: [
    {
      title: "USING IT",
      items: [
        {
          q: "How does a woman use it for urinating?",
          a: "The opening has a soft white foam rim that you spread wide with your fingers. It is cut on a slant, so one edge — the taller, soft white foam edge — sits higher (the high side). Women and girls hold the high side down, pressed close against the body so nothing escapes; men and boys hold it up. Urinate straight into the bag — the super-absorbent strip at the base turns it to gel in about 60 seconds — then press the sealable closure firmly until it locks. Every pack has a simple picture guide, and most people get it right the first time.",
        },
        {
          q: "Can men and boys use it too?",
          a: "Yes — it is completely unisex. The only difference is the angle you hold it: the soft white foam rim is cut on a slant with a taller edge (the high side), which men and boys point up and women and girls point down towards the body. The same bag works for the whole family, from young children to grandparents.",
        },
        {
          q: "How do I use it for a baby or toddler?",
          a: "Hold the wide opening securely around or under the child, the same way you would position a potty. The absorbent strip solidifies whatever goes in, so a wriggling toddler or a sudden spit-up is far less messy. Always keep the used, sealed bag out of the child's reach afterwards.",
        },
        {
          q: "Can I use it lying down, seated, or in a wheelchair?",
          a: "Yes. The bag is designed to be used in almost any position — seated in a car, lying in bed, or in a wheelchair. For anyone with limited mobility, it turns a difficult bathroom trip into something they can manage themselves, with privacy and dignity.",
        },
        {
          q: "How do I use it for vomiting or motion sickness?",
          a: "Open the bag fully and hold it close to the mouth with the opening facing forward — the soft white foam rim sits gently against your face. As soon as you are sick into it, the strip begins turning the contents to gel and locking odour in — so there is no sloshing and no smell for the rest of the journey. Seal it and bin it when you can.",
        },
        {
          q: "Can I open the bag and keep it ready in advance?",
          a: "Yes. On a bumpy road or a rough flight it helps to have a bag open and within reach so you are not fumbling in a hurry. The strip only activates when liquid touches it, so an open, unused bag is completely fine until you need it.",
        },
      ],
    },
    {
      title: "COMFORT & DISCRETION",
      items: [
        {
          q: "Will people around me notice?",
          a: "It is designed to be discreet. The bag is quiet to open and use, and in a car you can use it under a jacket or blanket without drawing attention. Once sealed, the contents are hidden and odour-locked, so nothing gives it away.",
        },
        {
          q: "Does it hurt or feel uncomfortable?",
          a: "Not at all. Nothing is inserted into your body — it is simply a soft, flexible bag that you go into, exactly as you would over a toilet. Most people find it far more comfortable than holding it in for hours.",
        },
        {
          q: "Will it smell while I am using it, or afterwards?",
          a: "The strip begins locking in odour the moment it starts to gel, and the sealed closure keeps it contained. So there is very little smell during use and effectively none once it is sealed.",
        },
        {
          q: "Is the opening wide enough to use without missing?",
          a: "Yes. The soft white foam rim spreads open into a wide, sturdy mouth that holds its shape, so it is easy to aim into, seated or standing. Following the simple hold in the picture guide keeps it clean and mess-free.",
        },
      ],
    },
    {
      title: "SAFETY & DISPOSAL",
      items: [
        {
          q: "Is the gel toxic? What if a child touches a used bag?",
          a: "The gel is safe against skin for external use, but the super-absorbent material is harmful if swallowed. Treat a used bag like any soiled hygiene product: keep it sealed, keep it away from young children and pets, and dispose of it promptly. If any is swallowed, contact a doctor.",
        },
        {
          q: "How do I dispose of it — can I flush it?",
          a: "Never flush it. Seal the bag fully and put it in any general rubbish bin. Even though the bag material is recyclable, the used contents and the gel should go to landfill waste, and flushing can block drains.",
        },
        {
          q: "How eco-friendly is it?",
          a: "The bag is made from recyclable material and it replaces messier, more wasteful improvised options on the road. Used bags do go into general household waste (they are not flushable or compostable), so please bin them responsibly rather than leaving anything behind outdoors.",
        },
        {
          q: "How long do unused bags last in storage?",
          a: "Store them in a cool, dry place away from direct sunlight and they are best used within 5 years of the packaging date. That long shelf life is exactly why they live so well in a glovebox, a go-bag or a hospital bag.",
        },
      ],
    },
  ],
  right: [
    {
      title: "CAPACITY & PERFORMANCE",
      items: [
        {
          q: "Will it really not leak or spill in a moving car?",
          a: "Correct. The super-absorbent strip converts the liquid into a firm, non-spillable gel in about 60 seconds. Once it has gelled there is nothing loose to escape, even if the sealed bag tips over or is held upside down, and the locking closure adds a second barrier.",
        },
        {
          q: "How much does one bag hold, and how many times can I use it?",
          a: "Each bag holds up to 700 ml of liquid and can be used 2 to 3 times until it reaches that capacity. Keep it sealed between uses. Once it is full — or 24 hours after you first opened it — dispose of it and start a fresh bag.",
        },
        {
          q: "How quickly does it solidify?",
          a: "Very fast — the liquid begins gelling on contact and is a firm gel within roughly 60 seconds. There is no waiting around and no risk of a spill while you seal it.",
        },
        {
          q: "Once it turns to gel, can it leak back out as liquid?",
          a: "No. The gel stays solid — it does not melt back into liquid — so a sealed, used bag is safe to carry in a bag or footwell until you find a bin. It simply holds its shape.",
        },
        {
          q: "Does it work in very hot or cold weather?",
          a: "Yes, it works across a wide range of temperatures — in an air-conditioned cabin or a hot car. Just store your unused bags away from direct sunlight and extreme heat so the material stays in good condition.",
        },
        {
          q: "Is it really odour-controlling?",
          a: "The absorbent gel locks the liquid in and greatly reduces odour at the source instead of just masking it, and the sealable closure keeps any smell contained. In practice that means a used bag can sit in a car or bag until you reach a bin without stinking.",
        },
        {
          q: "What is it actually made of?",
          a: "A durable, leak-proof recyclable bag with a sealable locking closure, a soft white foam rim around the opening (comfortable to hold against the body or face), and an internal super-absorbent strip — the same kind of material used inside baby diapers. It is soft, light and compact enough to keep anywhere.",
        },
      ],
    },
    {
      title: "WHO IT'S FOR & WHEN",
      items: [
        {
          q: "Is it safe to use during pregnancy?",
          a: "Yes. It is completely safe for external use during pregnancy — you use it exactly as any other adult would. Many expecting mums keep one in their bag for the nausea and frequent-loo runs that come with pregnancy travel.",
        },
        {
          q: "Does using a bag instead of holding it in help avoid UTIs?",
          a: "Doctors generally advise against holding a full bladder for hours — for some people it is linked to discomfort and a higher chance of a urinary-tract infection (UTI), and on a long journey it simply adds to the misery. With a bag you never have to hold on for hours or brave a filthy toilet: you can go the moment your body needs to, cleanly and in your own seat. It is a hygiene product, not a medical device, and does not claim to treat or prevent any condition — but many travellers find that simply not holding it in makes the whole trip far more comfortable.",
        },
        {
          q: "Is it safe for children and elderly people?",
          a: "Yes, with common-sense care. Children should be supervised, and everyone should keep used bags away from young children and pets because the solidified contents are harmful if swallowed. For seniors and anyone with reduced mobility it is one of the easiest, most dignified options available.",
        },
        {
          q: "Can I carry it on a flight or through airport security?",
          a: "The bags are dry, compact and contain no liquid until used, so they travel easily in hand luggage. Rules vary by airline and airport, so check your carrier if you are unsure — but as a dry hygiene product they are treated much like tissues or nappies.",
        },
        {
          q: "Is it good for camping, treks and the outdoors?",
          a: "Absolutely — it is one of the most popular uses. No digging a hole, no searching for privacy: use the bag, seal it, and pack it out responsibly. It is a leave-no-trace friendly way to answer nature's call where there are no facilities.",
        },
        {
          q: "Can I use it for a pet on a journey?",
          a: "It is made for people, but many pet parents keep a pack in the car for quick, clean pick-up of pet urine or vomit on a long drive. As with any used bag, keep the sealed bag away from the animal afterwards.",
        },
      ],
    },
    {
      title: "BUYING & DELIVERY",
      items: [
        {
          q: "Should I buy the pack of 10 or the pack of 20?",
          a: "The pack of 10 is a complete supply for one trip or one person. The pack of 20 is the best value and is ideal for families, frequent travellers or caregivers — the popular approach is to keep one supply in the car and one in your travel bag so you are never caught without.",
        },
        {
          q: "How does Subscribe & Save work?",
          a: "Choose Subscribe monthly (15% off) or every 2 months (12% off) at checkout and your bags arrive automatically on that schedule, with the discount applied every time. You can change, pause or cancel any time — it is built for people who want their car and bag always stocked.",
        },
        {
          q: "Do you deliver across India, and how do I pay?",
          a: "Yes, we deliver across India, and most orders arrive in 5 to 7 days — with free shipping over ₹599. Enter your PIN code in the delivery checker above for an estimate for your area. You can pay securely by UPI, credit or debit card, or net banking at checkout.",
        },
        {
          q: "What is your returns policy?",
          a: "As a hygiene product, returns and refunds don’t apply. If your order arrives damaged or incorrect, email care@potenthygiene.com and we’ll make it right.",
        },
        {
          q: "Do you offer bulk or wholesale orders?",
          a: "Yes. For offices, cab fleets, travel operators, hospitals, schools or events that need larger quantities, write to care@potenthygiene.com and we will help with bulk pricing.",
        },
      ],
    },
  ],
};

export default function LoowayFaqSection() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const toggleItem = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const allGroups = [...FAQ_DATA.left, ...FAQ_DATA.right];

  const categories = [
    { id: "all", label: "All questions" },
    ...allGroups.map((g) => ({ id: g.title, label: g.title })),
  ];

  const renderGroup = (group: FaqGroup, groupIdx: number, colPrefix: string) => (
    <div key={groupIdx} className="space-y-2 mb-6">
      <h4 className="text-[11px] font-extrabold tracking-widest text-[#0E5C3A] uppercase mb-2.5">
        {group.title}
      </h4>
      <div className="space-y-2">
        {group.items.map((item, itemIdx) => {
          const itemKey = `${colPrefix}-${groupIdx}-${itemIdx}`;
          const isOpen = openKey === itemKey;

          return (
            <div
              key={itemIdx}
              className="rounded-2xl border border-[#E4DED0] bg-white shadow-2xs overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleItem(itemKey)}
                className="flex w-full items-center justify-between p-3.5 sm:p-4.5 text-left font-sans text-xs sm:text-sm font-bold text-[#0A4A2E] hover:text-[#0E5C3A] transition-colors"
              >
                <span className="pr-2.5 leading-snug">{item.q}</span>
                <div
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 bg-[#0E5C3A] text-white"
                      : "bg-[#E4F0E8] text-[#0E5C3A]"
                  }`}
                >
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-3.5 pb-4 sm:px-4.5 text-xs sm:text-sm text-[#17271E]/80 leading-relaxed border-t border-[#E4DED0]/60 pt-3 font-normal">
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
    <section id="faq" className="w-full bg-[#F1F7F3] scroll-mt-32 sm:scroll-mt-36 py-8 sm:py-16 lg:py-20 text-[#17271E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mx-auto max-w-2xl mb-6 sm:mb-12">
          <span className="text-[10.5px] sm:text-xs font-extrabold tracking-widest text-[#0E5C3A] uppercase block mb-1.5 sm:mb-2">
            GOOD TO KNOW
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0A4A2E] leading-tight">
            Frequently asked questions
          </h2>
        </div>

        {/* Mobile Category Filter Tabs (< lg screens) */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-[#0E5C3A] text-white shadow-2xs"
                  : "bg-white text-[#17271E]/80 border border-[#E4DED0]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile View: Show selected category group or all */}
        <div className="block lg:hidden">
          {allGroups
            .filter((g) => activeCategory === "all" || g.title === activeCategory)
            .map((group, idx) => renderGroup(group, idx, "mob"))}
        </div>

        {/* Desktop View (lg:grid 2 Columns) */}
        <div className="hidden lg:grid grid-cols-2 gap-x-8 gap-y-4 items-start">
          {/* Left Column */}
          <div>
            {FAQ_DATA.left.map((group, idx) => renderGroup(group, idx, "left"))}
          </div>

          {/* Right Column */}
          <div>
            {FAQ_DATA.right.map((group, idx) => renderGroup(group, idx, "right"))}
          </div>
        </div>
      </div>
    </section>
  );
}
