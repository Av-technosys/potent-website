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
          q: "How do I actually use a pee funnel?",
          a: "Pull your clothing aside just far enough, hold the wide opening firmly against your body with the back edge just behind the urethra, tilt the spout down and away, start your stream slowly, then pee normally. Standing slightly forward helps. When you finish, slide it forward along the skin to catch the last drops, shake it dry and store it in the pouch.",
        },
        {
          q: "Which toilets does it work with — including Indian squat toilets?",
          a: "It works with all Western toilets, Indian squat toilets, public latrines, outdoor nature spots, and even into bottles or disposable urine bags while travelling. Stand over a Western seat without ever touching it, or aim directly into a squat toilet pan — no squatting and no skin contact.",
        },
        {
          q: "Do I have to undress?",
          a: "No! That's one of the biggest benefits. You only need to unzip or unbutton your pants and move your underwear to one side. You can use it while remaining fully dressed, even in cold weather, hiking gear, or formal wear.",
        },
        {
          q: "Can I use it in a moving car, bus or train?",
          a: "Yes. In a vehicle, pair the Looway Pee Funnel with a wide-mouth bottle or disposable urine bag (like our Looway Pee & Puke Bags). Brace yourself comfortably against the seat, maintain a firm seal against your body, and direct the flow into the container.",
        },
        {
          q: "Can I keep it ready and use it quickly?",
          a: "Absolutely. The soft silicone funnel folds flexibly into its compact cotton pouch. Keep it in your handbag, glove box, or jacket pocket so you can pull it out and position it within seconds whenever you find a roadside emergency or dirty restroom.",
        },
        {
          q: "How does the bottle method work in a car — won't it overflow or back up?",
          a: "The wide spout of the funnel fits easily into standard bottle openings or disposable bag necks. Control your stream at a moderate pace to allow gravity to drain the liquid smoothly into the bottle without splashing back.",
        },
        {
          q: "How much does it hold — do I have to stop partway?",
          a: "You do not need to stop partway. The funnel is an open flow-through channel with a deep basin and wide funnel neck designed to handle a full, natural bladder discharge rapidly without overflowing.",
        },
      ],
    },
    {
      title: "CLEANING & CARE",
      items: [
        {
          q: "How do I clean it, especially while I'm out?",
          a: "While you are out, give it a firm shake to shed liquid droplets (silicone is naturally hydrophobic), wipe it with a wet wipe or tissue, or rinse it under a water tap before slipping it into its breathable pouch. Once home, wash thoroughly with warm soap and water.",
        },
        {
          q: "Is it really reusable, and how long does it last?",
          a: "Yes, it is 100% reusable. Made from premium, high-grade medical silicone, it does not degrade, crack, or harden over time. With basic soap-and-water care, one Looway Pee Funnel lasts for 5+ years.",
        },
        {
          q: "Will it smell or stain over time?",
          a: "No. Medical-grade silicone is non-porous and naturally resists odor absorption and staining. As long as you rinse or wipe it after use and wash it properly with soap at home, it remains clean, fresh, and odor-free.",
        },
        {
          q: "Can I share it with a friend or family member?",
          a: "For personal hygiene and infection prevention, we recommend each person has their own dedicated Looway funnel. That is why our Pack of 2 is popular for sisters, mothers, daughters, or travel buddies.",
        },
        {
          q: "What if I can't rinse it at all — how long can it sit in my bag?",
          a: "If water or wipes aren't available, simply shake off excess drops, wipe with toilet paper if you have it, and place it in the breathable cotton pouch. The pouch allows air circulation to prevent moisture trapped inside. Wash it thoroughly as soon as you get home.",
        },
      ],
    },
    {
      title: "BUYING & DELIVERY",
      items: [
        {
          q: "Should I buy the Pack of 1 or the Pack of 2?",
          a: "The Pack of 1 (₹299) is ideal to test out or keep in your primary handbag. The Pack of 2 (₹499) offers the best value—keep one in your daily bag and leave one permanently in your car, travel backpack, or emergency kit so you are never caught without it.",
        },
        {
          q: "Do you sell the disposable Pee & Puke bags too — on subscription?",
          a: "Yes! We offer Looway Disposable Pee & Puke Bags which pair perfectly with the funnel for car rides and motion sickness. You can buy them standalone or add them to your cart during checkout.",
        },
        {
          q: "Do you deliver across India, and how do I pay?",
          a: "We deliver across all pin codes in India within 3–6 business days with free shipping. We accept all major payment methods including UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).",
        },
        {
          q: "What is your returns policy?",
          a: "Due to the intimate personal hygiene nature of this product, we cannot accept returns once opened. However, if your order arrives damaged, defective, or incorrect, contact our customer support within 7 days for a hassle-free replacement.",
        },
        {
          q: "Do you offer bulk or wholesale orders?",
          a: "Yes! We supply bulk orders for travel groups, corporate wellness kits, wedding hampers, trekking clubs, and retailers. Reach out to us via our contact page or email for custom bulk pricing.",
        },
      ],
    },
  ],
  right: [
    {
      title: "LEAKS & GETTING IT RIGHT",
      items: [
        {
          q: "Will I pee on myself the first time?",
          a: "Not if you get a good seal — and that is easier than it sounds. Hold the wide end snug against your body so it covers the whole area, start your stream slowly until the seal feels solid, then relax and pee normally. We recommend one practice run in the shower at home; almost everyone gets it right on the first or second try.",
        },
        {
          q: "What's the secret to a leak-free seal?",
          a: "The key is firm, continuous pressure upwards and backwards. Ensure the wide cup covers from just in front of the urethra to behind it, maintain upward pressure against your skin, and point the spout downwards before releasing your bladder.",
        },
        {
          q: "Do I really need to practise?",
          a: "We strongly recommend trying it once or twice in the shower or over your home toilet first. It helps build confidence and muscle memory in positioning the seal so you feel 100% comfortable when using it in a public restroom or outdoors.",
        },
        {
          q: "The funnel is soft silicone — won't it collapse or fold while I'm going?",
          a: "No. Looway is engineered with flexible yet structural silicone side walls and a reinforced outer rim. It yields comfortably to your body shape without collapsing inwards under normal holding pressure.",
        },
        {
          q: "Does pubic hair affect it?",
          a: "No. The wide soft-touch rim forms a tight seal over body contours regardless of pubic hair. Just press the cup firmly against your body to ensure snug contact around the perimeter.",
        },
      ],
    },
    {
      title: "COMFORT & DISCRETION",
      items: [
        {
          q: "Does it hurt or feel strange?",
          a: "It does not hurt at all. The funnel is completely external—it is held against your skin and never inserted. The medical-grade silicone is soft, smooth, and comfortable. Standing to pee for the first time may feel unusual, but after 1–2 uses it feels completely natural.",
        },
        {
          q: "Is it discreet? Will people notice?",
          a: "It is very discreet. Because you don't need to lower your pants completely, you remain fully covered. The funnel itself is compact and silent, fitting easily inside a pocket or clutch inside its plain cotton pouch.",
        },
        {
          q: "Can I use it during my period?",
          a: "Yes, you can use it while on your period. Since urine and menstrual flow exit externally, the funnel handles both cleanly. Simply rinse or wipe the funnel thoroughly after use.",
        },
        {
          q: "Is it comfortable for larger or smaller body types?",
          a: "Yes. The ergonomically curved wide basin is designed to adapt to diverse female anatomies, body shapes, and sizes comfortably.",
        },
      ],
    },
    {
      title: "WHO IT'S FOR & SAFETY",
      items: [
        {
          q: "Is it safe to use during pregnancy?",
          a: "Yes, it is 100% safe and extremely helpful! During pregnancy, frequent urges and difficulty squatting or sitting on low/dirty seats can be painful. Standing to pee eliminates knee, hip, and back strain.",
        },
        {
          q: "Can teenagers and older women use it?",
          a: "Yes. Women of all ages—from young girls and teenagers travelling for school/college to elderly women with arthritis, knee pain, or mobility restrictions—can easily use Looway.",
        },
        {
          q: "Can it help me avoid dirty-seat contact and holding it in?",
          a: "Absolutely. Holding urine for long periods increases the risk of UTIs and bladder strain. With Looway, you never have to hold it in or touch a dirty public toilet seat again.",
        },
        {
          q: "What's it made of, and is the material body-safe?",
          a: "It is made of 100% medical-grade silicone that is BPA-free, phthalate-free, toxin-free, and hypoallergenic. It is 100% skin-safe and designed for repeated external contact.",
        },
        {
          q: "Is it good for camping, treks and festivals?",
          a: "It is an essential item for outdoor lovers! Whether camping, trekking in the Himalayas, attending music festivals, or taking long highway road trips, it allows you to pee safely standing up anywhere without squatting in bushes or dirty portable loos.",
        },
      ],
    },
  ],
};

export default function FunnelFaqSection() {
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
    <div key={groupIdx} className="mb-6">
      <h4 className="text-[11.5px] font-extrabold tracking-widest text-[#b51e60] uppercase mb-3">
        {group.title}
      </h4>
      <div className="space-y-2.5">
        {group.items.map((item, itemIdx) => {
          const itemKey = `${colPrefix}-${groupIdx}-${itemIdx}`;
          const isOpen = openKey === itemKey;

          return (
            <div
              key={itemIdx}
              className="rounded-2xl border border-[#EAD6DC] bg-white shadow-2xs overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleItem(itemKey)}
                className="flex w-full items-center justify-between p-4 sm:p-4.5 text-left font-sans text-xs sm:text-sm font-semibold text-[#5A0E30] hover:text-[#a81a57] transition-colors"
              >
                <span className="pr-3 leading-snug">{item.q}</span>
                <div
                  className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                    isOpen
                      ? "rotate-180 bg-[#a81a57] text-white"
                      : "bg-[#fdeef4] text-[#a81a57]"
                  }`}
                >
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4.5 sm:px-4.5 sm:pb-5 text-xs sm:text-sm text-[#5A0E30]/80 leading-relaxed border-t border-[#EAD6DC]/60 pt-3 font-normal">
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
    <section id="faq" className="w-full bg-[#fdeef4] scroll-mt-32 sm:scroll-mt-36 py-10 sm:py-16 lg:py-20 text-[#5A0E30]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mx-auto max-w-2xl mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-[#b51e60] uppercase block mb-2">
            GOOD TO KNOW
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#5A0E30] leading-tight">
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
                  ? "bg-[#a81a57] text-white shadow-2xs"
                  : "bg-white text-[#5A0E30]/80 border border-[#EAD6DC]"
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

