"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconSearch } from "@tabler/icons-react";

const products = [
  "Ovy Reusable Menstrual Cup",
  "Ovy Organic Panty Liners",
  "Ovy XL Sanitary Pads — 280mm",
  "Ovy XL+ Day-Night Pads — 320mm",
  "Ovy Teen Beginner Pack",
  "Ovy Teen Pro-Active Pack",
  "Looway Stand-to-Pee Reusable Funnel",
  "Looway Disposable Toilet Seat Covers",
] as const;

type ProductType = (typeof products)[number];

const categories = [
  "Product Usage",
  "Material & Safety",
  "Sizing & Variations",
  "Shipping & Delivery",
  "Return & Replacement",
  "Subscription & Offers",
] as const;

type CategoryType = (typeof categories)[number];

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: Record<ProductType, Record<CategoryType, FAQItem[]>> = {
  "Ovy Reusable Menstrual Cup": {
    "Product Usage": [
      {
        question: "How do I use the Ovy Menstrual Cup for the first time?",
        answer: `It takes 2–3 cycles to feel completely natural — this is completely normal.
1.Sterilise before first use: Boil the cup in water for 5–7 minutes. Do not let it touch the bottom of the pot.
2.Wash your hands thoroughly with soap and water.
3.Fold: Use the Punch-Down Fold — push one side of the rim down into the centre of the cup. This creates the smallest insertion point and is the easiest for beginners.
4.Insert: Relax your body, aim toward your tailbone (not straight up), and gently guide the folded cup in until it sits just below your cervix.
5.Check the seal: Run a finger around the base of the cup — it should feel round and smooth, not creased. Gently tug the stem. Some resistance means the seal is good.
6.Wear for up to 12 hours. On heavy flow days, empty sooner.
7.Remove: Pinch the base firmly to break the seal, then gently pull downward. Never pull by the stem alone.
Practise at home on a light flow day before using it in public for the first time.
`,
      },
      {
        question: "How often do I need to empty the cup?",
        answer:
          "Empty every 8–12 hours. Never exceed 12 hours of continuous wear. On heavy flow days (usually day 1–2 of your cycle): you may need to empty every 4–6 hours. On lighter days: most users comfortably wear it for the full 12 hours. In your first 1–2 cycles, empty the cup at the same intervals you would normally change a pad. Over time you will learn your own flow pattern.",
      },
      {
        question: "Can I sleep with the Ovy Cup in?",
        answer:
          "Yes — sleeping up to 12 hours with the cup in is completely safe. For your first few nights, wear a thin panty liner as a backup while you find the right insertion depth and angle for your body. Most users no longer need a backup liner after 2–3 cycles.",
      },
      {
        question: "Is it messy to use?",
        answer:
          "We will be honest — removal can feel unfamiliar at first, especially for first-time users. But with 2–3 cycles of practice, most users find it quick and clean. The key is pinching the base firmly to break the seal before pulling. If you try to pull by the stem without breaking the seal first, it can create resistance and feel messy. Pinch first, then gently pull.",
      },
    ],
    "Material & Safety": [
      {
        question: "What is the Ovy Cup made of? Is it safe?",
        answer:
          "The Ovy Menstrual Cup is made from 100% biocompatible, medical-grade VI silicone — the same class of silicone used in surgical implants. It contains absolutely no heavy metals (Chromium, Mercury, Lead, Arsenic), no latex, no BPA, no dyes, no fragrances, and no animal-origin materials. It has been independently lab-tested and certified as: non-cytotoxic, non-sensitising, and non-irritating. Safe for all body types including those with sensitive skin or latex allergies.",
      },
      {
        question: "Does using a menstrual cup affect my virginity?",
        answer:
          "No. The Ovy Cup is exceptionally soft — even menstruators who are not sexually active can insert and remove it comfortably with practice. The concept of virginity is not physically affected by an internal menstrual product. If this is a concern, speaking with a doctor or gynaecologist can provide further reassurance.",
      },
      {
        question: "Can I use it if I have an IUD?",
        answer:
          "If you have an IUD (copper or hormonal), consult your gynaecologist before using any menstrual cup. There is a small possibility that the suction created during cup removal could dislodge an IUD if the strings are cut short. Your doctor can advise based on your specific IUD positioning and string length. Many IUD users use cups safely — medical guidance first is essential.",
      },
    ],
    "Sizing & Variations": [
      {
        question: "Which cup size should I choose?",
        answer: `1.Teen (XS) — 16ml: For teenagers and first-time users. Light-to-moderate flow, no childbirth history, low-to-medium cervix height, tighter pelvic muscles.
         2.Standard (M) — 25ml: For women aged 20–30 with light-to-moderate flow, no vaginal childbirth history, average pelvic muscle tone.
         3.Large (L) — 35ml: For women over 30 or those who have given birth vaginally, moderate-to-heavy flow, medium-to-high cervix, or more relaxed pelvic muscles.
         Not sure? If you have never given birth vaginally and are under 30, start with Standard. If you are over 30 or have given birth vaginally, choose Large. Teenagers and first-time users should choose Teen (XS).
`,
      },
      {
        question: "How long does the Ovy Cup last?",
        answer:
          "The Ovy Cup lasts up to 10 years with proper care. We recommend replacing it every 3 years once you have started regular use — or immediately if you notice tears, cracks, a persistent foul odour, flaking, or any change in texture.",
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question: "Can I subscribe to receive cup accessories regularly?",
        answer:
          "Yes — subscribe to receive a fresh Ovy Menstrual Cup or cleaning accessories on a schedule that suits you. Subscribers receive up to 15% off and free shipping on every delivery. Manage, pause, or cancel your subscription anytime from your account page. No fees. No commitment period.",
      },
    ],
  },

  "Ovy Organic Panty Liners": {
    "Product Usage": [
      {
        question: " Can I wear Ovy Panty Liners every day?",
        answer:
          "Yes — Ovy Panty Liners are designed for daily use. However, daily wear does not mean all-day without changing. Replace your liner every 3–5 hours to maintain hygiene and prevent moisture buildup. Wearing a liner for an entire day without changing it is counterproductive and can cause irritation. They are safe for daily discharge, spotting before or after your period, light bladder leaks, and as a backup with your menstrual cup.",
      },
      {
        question: "Can I use liners during exercise?",
        answer:
          "Yes — Ovy liners can be worn during low-to-moderate exercise. The breathable cotton material prevents the humidity buildup that synthetic liners cause during physical activity. For intense sport or activities with heavy sweating, a menstrual cup is a more reliable option on period days. Change your liner immediately after any exercise session.",
      },
      {
        question: " How do I dispose of used panty liners hygienically?",
        answer: `1.Peel off the used liner.
2.Roll it tightly.
3.Wrap it in the packaging of your new liner or in tissue paper.
4.Dispose in a waste bin. Never flush — even biodegradable liners can block drains.
Ovy liners are 100% biodegradable and will decompose naturally in a landfill without leaving plastic behind.
`,
      },
    ],
    "Material & Safety": [
      {
        question: "What are Ovy Panty Liners made of?",
        answer: `1.Top sheet: 100% organic — hypoallergenic, plastic-free, fragrance-free
2.Absorbent core: Natural plant-based fibres
3.Back sheet: Biodegradable, plastic-free layer
4.Adhesive: Skin-safe, latex-free
Free from: Chlorine, parabens, artificial fragrances synthetic dyes, and all plastics.
Dimensions: 190mm length × 1mm thickness.

`,
      },
      {
        question: "Will these cause rashes or irritation?",
        answer:
          "No. Ovy liners are hypoallergenic, fragrance-free, and completely plastic-free. If you have experienced rashes from conventional liners, the organic cotton top sheet here is significantly different — it does not contain the synthetic mesh or plastic films that trap heat and cause irritation. If irritation occurs with any product, discontinue use and consult a doctor.",
      },
      {
        question: "Are Ovy liners safe during pregnancy?",
        answer:
          "Yes — Ovy Panty Liners are safe to use throughout pregnancy. The 100% organic cotton and chemical-free materials are gentle enough for the increased skin sensitivity that often comes with pregnancy. They are ideal for managing light discharge (leukorrhea) which is common during pregnancy, and for mild urinary urgency leaks in the later trimesters.",
      },
    ],
    "Sizing & Variations": [
      {
        question: "Which pack size should I buy?",
        answer: `1.Pack of 40 (2 packs × 20 liners): Best for first-time buyers or lighter daily use.
2.Pack of 60 (3 packs × 20 liners): Best for regular daily wearers.
3.Pack of 80 (4 packs × 20 liners): Best value — subscribe and save 15% on this pack for automatic monthly delivery.
All variants contain the same liner (190mm, 1mm thickness). Pack size only determines quantity.
`,
      },
      {
        question: "Can I use panty liners with my menstrual cup or tampon?",
        answer:
          "Yes — this is one of the most popular combinations. Wearing a thin Ovy liner as a backup with your menstrual cup gives you extra peace of mind, especially during the first few cycles while you are learning the correct insertion and seal technique. Many experienced cup users also wear a liner on their two heaviest days as added security.",
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question: "Can I subscribe to receive panty liners automatically?",
        answer:
          "Yes — subscribe to the 80-pack for up to 15% off, delivered every 1, 2, or 3 months. Never run out mid-cycle again. All subscription orders include free shipping. Cancel, skip, or pause anytime from your account page.",
      },
    ],
  },

  "Ovy XL Sanitary Pads — 280mm": {
    "Product Usage": [
      {
        question: "How often should I change the Ovy XL pad?",
        answer:
          "Change every 6–8 hours depending on your flow. On heavy days (day 1–2), change every 4–6 hours or when you feel full. After exercise or any physical activity, change your pad promptly regardless of how long you have been wearing it — sweat increases bacterial activity. Do not wear the same pad for longer than 8 hours.",
      },
      {
        question: "How do I get the best protection from the XL pad?",
        answer: `1.Peel the adhesive backing and place the pad sticky-side-down in the centre of your underwear.
2.The 280mm length is designed to sit slightly further back than a regular pad — this is intentional for better rear coverage during long periods of sitting.
3.Fold the extra-wide wings firmly around the underside of your underwear crotch and press flat. A firmly anchored wing is what prevents side leaks.
4.Change every 6–8 hours or sooner if you feel full.
5.Dispose: Roll the used pad, place in the wrapper or provided biodegradable disposal bag, and bin it. Never flush.
`,
      },
    ],
    "Material & Safety": [
      {
        question: "What is the Ovy XL pad made of?",
        answer: `1.Top sheet: Ultra-gentle, hypoallergenic plant-based fibres — 100% rash-free
2.Acquisition layer: Natural plant fibres that rapidly pull fluid away from your skin
3.Absorbent core: Super-Absorbent Polymer (SAP) gel core — locks in fluid and neutralises odour
4.Wings: Extra-wide secure adhesive wings — prevent side leakage
5.Disposal bag: Individual biodegradable compostable bag included per pad
Free from: Chlorine, parabens, artificial fragrances, synthetic dyes, and synthetic plastics.
Cruelty-free, vegan-friendly, and toxin-free.
`,
      },
      {
        question: "I get rashes with most pads. Will the Ovy XL be different?",
        answer:
          "Almost certainly yes. Rashes from pads are almost always caused by synthetic top sheets and plastic backsheets that trap heat and moisture against the skin. Ovy XL replaces both with plant-based fibres and a breathable backsheet — specifically designed to prevent chafing and irritation, even in India's humid climate. Ovy XL pads are dermatologically tested to be 100% rash-free.",
      },
      {
        question: "Does the pad contain any fragrance?",
        answer:
          "No — and this is intentional. Ovy XL uses active odour-lock technology in the absorbent gel core that neutralises odour at the source. Artificial fragrances in pads are one of the most common causes of intimate irritation and allergic reactions. We eliminated them entirely.",
      },
    ],
    "Sizing & Variations": [
      {
        question:
          "What is the difference between Ovy XL (280mm) and Ovy XL+ (320mm)?",
        answer:
          "Ovy XL (280mm): Designed for daytime use on medium-to-heavy flow days. Ideal for office, school, commuting, and long sitting periods. 280mm length provides excellent coverage without overnight bulk. Ovy XL+ (320mm): Designed for overnight use and very heavy flow. The extra length extends backward for sleeping position protection, with dual leak guards and a reinforced absorbent core for higher volume days. If you are unsure: use Ovy XL during the day and Ovy XL+ at night on your heaviest days.",
      },
      {
        question: "What is inside the Ovy XL pack?",
        answer:
          "Each Ovy XL pack contains 25 pieces: 21 XL pads (280mm) and 4 soft panty liners. This provides a complete monthly supply — 21 pads for your heaviest to medium flow days, and 4 liners for the lighter spotting days at the end of your cycle.",
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question: "Can I subscribe to receive Ovy XL pads monthly?",
        answer:
          "Yes — subscribe to receive one or more boxes every 1, 2, or 3 months at up to 15% off. Never do an emergency pharmacy run again. All subscription orders include free shipping. Skip, pause, or cancel anytime from your account page with no fees.",
      },
    ],
  },

  "Ovy XL+ Day-Night Pads — 320mm": {
    "Product Usage": [
      {
        question: "How do I use the XL+ pad for overnight protection?",
        answer: `1.Take out an XL+ pad — notice the extra length compared to a regular pad.
2.Peel the adhesive backing and place in your underwear sticky-side-down.
3.For overnight use: position the pad slightly further back than you would during the day. The wider rear section is designed to catch gravity-shifted flow while you lie down in any sleeping position.
4.Anchor the extra-wide wings firmly around your underwear crotch. This prevents twisting or bunching while you move in your sleep.
5.Wear for up to 8 hours of uninterrupted overnight protection.
6.Morning: Remove, roll tightly, seal in the provided disposal bag, and bin it.
`,
      },
      {
        question: " Can I use the XL+ pad during the day as well?",
        answer:
          "Yes. While designed primarily for overnight use and very heavy flow, many women with heavy cycles use the XL+ during their heaviest 1–2 daytime hours. The extra length and reinforced absorbent core make it a reliable choice for back-to-back heavy hours when you cannot change frequently.",
      },
    ],
    "Material & Safety": [
      {
        question: "What is the Ovy XL+ pad made of?",
        answer: `1.Top sheet: 100% cottony-soft, hypoallergenic plant-based layer — gentle on sensitive skin
2.Acquisition layer: Toxin-free natural fibres that rapidly wick moisture from the surface
3.Absorbent core: High-capacity Super-Absorbent Polymer (SAP) Heavy Flow Lock Core — engineered for heavy flow retention
4.Wings: Extra-wide, dual leak guard design
5.Disposal bag: Eco-friendly biodegradable individual bag per pad
Free from: Synthetic plastics, chlorine bleach, artificial fragrances, and dyes.
`,
      },
      {
        question: " Is the XL+ pad suitable for postpartum bleeding?",
        answer:
          "Yes — the Ovy XL+ is suitable for managing postpartum bleeding (lochia), which is typically heavier than a regular period. For the first few days postpartum when bleeding is very heavy, change the pad more frequently than every 8 hours. Consult your gynaecologist or midwife for personalised postpartum care guidance. Medical note: If you regularly saturate a pad within 1–2 hours regardless of size, please consult a doctor — this level of bleeding may need medical evaluation.",
      },
    ],
    "Sizing & Variations": [
      {
        question: "What is inside the Ovy XL+ pack?",
        answer:
          "Each Ovy XL+ pack contains 25 pieces: 21 XL+ pads (320mm) and 4 soft panty liners. 21 pads cover your heaviest flow nights and days. 4 liners handle the lighter spotting at the end of your cycle. One box, complete coverage.",
      },
      {
        question: "Will the extra length show through clothing?",
        answer:
          "At 320mm, the XL+ is longer than standard pads but remains flat and discreet under normal clothing. Wearing slightly higher-waisted underwear provides the most secure and invisible fit. The pad does not add visible bulk — the length extends backward within your underwear coverage, not outward.",
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question: "Can I subscribe to the Ovy XL+ pads?",
        answer:
          "Yes — subscribe for up to 15% off per box, delivered monthly, every 2 months, or every 3 months. Free shipping on all subscription orders. Pause, skip, or cancel anytime from your account page. No fees, no commitment.",
      },
    ],
  },

  "Ovy Teen Beginner Pack": {
    "Product Usage": [
      {
        question:
          "Which pad should my daughter start with on her first period?",
        answer:
          "Start with an XL (280mm) pad if she is unsure of her flow — it provides more coverage and will last longer before needing a change, giving her confidence during uncertain early days. Move to L (240mm) pads towards the end of the cycle when flow lightens. The 4 panty liners are perfect for the days before and after the main period when she is uncertain whether it has started or ended. The pack is specifically designed so she does not need to know her flow in advance — it covers all possibilities.",
      },
      {
        question:
          "How do I use a pad for the first time? Step-by-step guide for beginners.",
        answer: `
        1.Wash your hands with soap and water before touching a fresh pad.
2.Open the wrapper — keep it, you will need it for disposal.
3.Peel the paper strip from the adhesive on the back of the pad.
4.Place the pad inside your underwear, sticky side facing down onto the fabric — not against your skin.
5.Peel the backing off the wing flaps on each side. Fold each wing under and around the crotch of your underwear and press firmly. This keeps the pad from shifting during movement.
6.Change every 4–6 hours. On heavy days, change sooner when you feel full or damp.
7.To dispose: roll the used pad into the wrapper of your new pad or the provided biodegradable disposal bag. Put it in a bin. Never flush a pad.
`,
      },
      {
        question: "How do I change a pad discreetly at school?",
        answer:
          "The Ovy Teen Beginner Pack pads have a silent, non-crinkly wrapper — unlike conventional pads that make noise when opened, these open quietly so you can change in a school bathroom stall without drawing attention. Keep a spare pad in the inner zip pocket of your school bag for easy access. Roll the used pad tightly in the wrapper of your new pad — this keeps it compact, contained, and odour-free until you reach a bin. Plan for a mid-day change on your first 1–2 days of your period when flow is typically heaviest.",
      },
    ],
    "Material & Safety": [
      {
        question:
          "What are the Ovy Teen pads made of? Are they safe for young skin?",
        answer:
          "Top sheet: 100% organic cottony-soft layer — hypoallergenic and specifically gentle on teenage skin Absorbent core: Plant-based Bamboo & Cornstarch fibres with Gel-Lock technology Back sheet: Breathable layer — prevents stuffiness and sweating Disposal bag: 100% compostable & biodegradable — one bag per pad Free from: Chlorine, parabens, artificial fragrances, synthetic dyes, and synthetic plastics. Dermatologically tested. 100% rash-free.",
      },
      {
        question:
          "My daughter has very sensitive skin. Will these cause irritation?",
        answer:
          "No. Ovy Teen pads are dermatologically tested to be 100% rash-free. Teenage skin is more sensitive than adult skin, and most period rashes are caused by the synthetic top sheets and plastic layers in conventional pads. Ovy Teen pads replace these with organic plant-based fibres that breathe and do not trap heat. They are safe for the most sensitive skin types.",
      },
    ],
    "Sizing & Variations": [
      {
        question: " What is inside the Ovy Teen Beginner Pack?",
        answer: `1. 10 Large (L) Pads — 240mm: For light to medium flow days and the end of cycle
2. 11 Extra Large (XL) Pads — 280mm: For heavier flow days and overnight protection
3. 4 Soft Panty Liners — 190mm: For spotting, discharge, and pre/post-period uncertainty
3. Total: 25 pieces — a complete monthly supply for one full first cycle
The pack is specifically designed so one box covers every stage of an early, unpredictable cycle.
`,
      },
      {
        question:
          " When should we switch from the Beginner Pack to the Pro-Active Pack?",
        answer: `Switch to the Ovy Teen Pro-Active Pack when:
1.The cycle has become more regular and predictable (usually after 6–12 months)
2.She is physically active — playing sports, dancing, or travelling for competitions
3.She needs the XL+ (320mm) pad for heavier flow days or overnight use during activity
The Beginner Pack remains the right choice for a first period and early irregular cycles where unpredictability is the norm.
`,
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question:
          " Can I subscribe to the Ovy Teen Beginner Pack for regular delivery?",
        answer:
          "Yes — subscribe to receive the pack every 1, 2, or 3 months at up to 15% off with free shipping. As your daughter's cycle becomes more regular, you can switch to the Pro-Active Pack or Ovy XL Pack from your account. Manage, pause, or cancel your subscription anytime — no fees.",
      },
    ],
  },

  "Ovy Teen Pro-Active Pack": {
    "Product Usage": [
      {
        question: "How do I stop the pad from shifting during sports or dance?",
        answer: `The most common cause of pad shifting during activity is the wings not being secured properly.
1.After placing the pad in your underwear, pull each wing firmly around the crotch fabric.
2.Press each wing flat and tight — the stronger the grip on the fabric, the more the pad stays anchored.
3.Wear close-fitting sports underwear rather than loose-fit — this keeps the pad in place and reduces movement.
The Ovy Teen Pro-Active pads have extra-wide wings with stronger adhesive, specifically tested for high-movement activity.
`,
      },
      {
        question: "Should I change my pad after exercise?",
        answer:
          "Yes — always change your pad after sport or exercise, regardless of how long you have been wearing it. Sweat during exercise increases bacterial activity, and a damp pad worn after exercise raises the risk of irritation and infection. A fresh pad immediately after your workout or game is a hygiene essential, not just a comfort preference. Keep a spare pad in your sports bag so you can change straight after training.",
      },
      {
        question: " Can I use this pack as a travel kit for tournaments?",
        answer:
          "Yes — the Ovy Teen Pro-Active Pack is specifically designed to also work as a complete travel kit. 25 pieces (7L + 7XL + 7XL+ + 4 liners) covers a full cycle from heaviest to lightest days. Even if your period starts unexpectedly during a trip, you have the right pad for every flow level. Pack 2–3 extra liners in the inner pocket of your sports bag as a daily buffer, and you are tournament-ready without needing to find supplies in an unfamiliar city. ",
      },
    ],
    "Material & Safety": [
      {
        question: "What are the Pro-Active pads made of?",
        answer: `1.Top sheet: 100% cottony-soft plant-based layer — reduces friction burn during movement
2.Absorbent core: Bamboo & Cornstarch fibres with Heavy Flow Lock Core technology — instant fluid capture
3.Leak guards: Dual barriers on XL+ pads to prevent side spills during physical activity
4.Wings: Extra-wide, high-adhesion wings tested for high-movement security
5.Disposal bag: Individual biodegradable compostable bag per pad
Free from: Synthetic plastics, chlorine bleach, artificial fragrances, dyes.
`,
      },
      {
        question: "Will these pads cause chafing or rash during sports?",
        answer: `No — prevention of chafing is one of the core design priorities of the Pro-Active range.
Athletes are prone to friction rashes from repetitive movement — synthetic plastic pads trap heat and moisture, making chafing significantly worse. Ovy Pro-Active pads use natural soft fibres that reduce friction against the skin even during continuous running or dancing.
If any irritation occurs, switch to the L pad for lower-intensity sessions and save the XL+ for heavy flow days only.
`,
      },
    ],
    "Sizing & Variations": [
      {
        question: "What is inside the Ovy Teen Pro-Active Pack?",
        answer: `1. 7 Large (L) Pads — 240mm: Lightweight — for practice sessions and lighter flow days
2. 7 Extra Large (XL) Pads — 280mm: For long school days and moderate activity
3. 7 Extra Large+ (XL+) Pads — 320mm: Maximum coverage — heavy flow days, intense matches, overnight after competition
4. 4 Soft Panty Liners — 190mm: For daily freshness and backup protection
5. Total: 25 pieces — a complete active cycle kit with the right pad for every situation
`,
      },
      {
        question:
          "What is the difference between the Beginner Pack and Pro-Active Pack?",
        answer:
          "Ovy Teen Beginner Pack: Designed for first periods and early irregular cycles. Contains 10L + 11XL + 4 liners. Focus on gentleness, school discretion, and covering unpredictable first cycles. Ovy Teen Pro-Active Pack: Designed for active teens with more established cycles. Contains 7L + 7XL + 7XL+ + 4 liners. Adds the XL+ (320mm) pad for heavy flow and sports use. Three sizes give the right pad for every activity level. Simple rule: if her period is new and irregular, start with Beginner. If she is sporty or her cycle has settled, Pro-Active is the better fit. ",
      },
      {
        question: "Can I swim while wearing one of these pads?",
        answer: `No — pads are not suitable for swimming. They absorb water and lose all effectiveness when submerged.
For swimming during your period, use the Ovy Menstrual Cup (Teen XS size) — it provides complete waterproof protection and is safe for any water sport.
Use your Pro-Active pad before and after swimming sessions.
`,
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question:
          "Can I subscribe to the Pro-Active Pack for the whole sports season?",
        answer: `Yes — subscribe monthly, every 2 months, or every 3 months at up to 15% off with free shipping.
You can pause during the off-season and restart when training resumes — all from your account page. No cancellation fees.
`,
      },
    ],
  },

  "Looway Stand-to-Pee Reusable Funnel": {
    "Product Usage": [
      {
        question: "How do I use the Looway Pee Funnel correctly?",
        answer: `Practise at home first — with the shower running or over a toilet. Building comfort at home before using it in public is the single most important step.
1.Hold the funnel with the wide opening facing your body. The high side faces up, the pointed end faces downward and away.
2.Press the wide opening firmly against your body to create a seal. Stand with feet slightly apart for stability.
3.Relax and urinate naturally. The funnel channels flow cleanly away from your body.
4.After use: shake gently to remove drops. Wipe with a tissue or rinse if water is available. Store in the cotton pouch.
5.Full clean when you have access to a sink: wash with mild soap and water, air dry before storing.
`,
      },
      {
        question:
          " Does it work on both Indian (squat) and Western (sit-down) toilets?",
        answer:
          "Yes — this is one of the key advantages of the Looway Pee Funnel for Indian users. For a Western toilet: stand in front of the bowl normally and direct flow in. For an Indian squat-style toilet: stand over the opening and use the funnel to direct flow — no squatting needed. The funnel works in both settings, eliminating the need to squat or touch any surface in either toilet type.",
      },
      {
        question: " Can I use the funnel during my period?",
        answer: `Yes — the Looway Pee Funnel only directs urine flow and does not interfere with menstrual products.
You can use it while wearing a pad, panty liner, menstrual cup, or tampon without any impact on either product.
`,
      },
    ],
    "Material & Safety": [
      {
        question: " What is the Looway Pee Funnel made of?",
        answer: `The Looway Pee Funnel is made from premium silicone — soft, flexible, hypoallergenic, and skin-safe.
It comes with an organic cotton storage pouch for hygienic carry.
For external use only. Do not use internally.
`,
      },
      {
        question: "Is the funnel safe for pregnant women?",
        answer: `Yes — the Looway Pee Funnel is particularly helpful for pregnant women who find squatting or bending uncomfortable.
It allows standing urination without physical strain, minimising the discomfort of public restroom use in the later trimesters. For external use only.
`,
      },
      {
        question: " Can it prevent UTIs?",
        answer:
          "The Looway Pee Funnel helps reduce UTI risk by eliminating direct contact with unsanitary toilet seats and surrounding surfaces. UTIs from public restrooms are primarily caused by contact with contaminated surfaces during squatting or sitting. By allowing you to urinate standing without touching any surface, the funnel removes this risk factor.",
      },
    ],
    "Sizing & Variations": [
      {
        question:
          " What is the difference between the single funnel and the Pack of 2?",
        answer: `Single funnel: 1 Looway Pee Funnel + 1 organic cotton storage pouch.
Pack of 2 (Combo): 2 Looway Pee Funnels + 2 organic cotton pouches at better value.
The Pack of 2 is ideal for keeping one at home and one always in your travel bag, or for sharing with a travel companion, family member, or a friend.
`,
      },
      {
        question: " Will it fit my body? I am worried about leaks.",
        answer:
          "The ergonomic seal is designed to fit most adult body shapes and sizes. The flexible medical-grade silicone conforms to your body's contours when held firmly in place. Leaks almost always occur when the seal is not properly formed — either the funnel is not pressed firmly enough, or the angle is slightly off. This is why practising at home is essential. After 2–3 practice runs, most users find the correct position and experience no leaks at all.",
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question:
          " Can I subscribe to receive replacement funnels or travel hygiene products?",
        answer: `Yes — subscribe to receive a new Looway Pee Funnel every 3 or 6 months at a discount. You can also add Looway Pee & Puke Bags or Looway Toilet Seat Covers to build a complete auto-replenished travel hygiene kit.
Manage, pause, or cancel any subscription anytime from your account page.
`,
      },
    ],
  },

  "Looway Disposable Toilet Seat Covers": {
    "Product Usage": [
      {
        question: "How do I use a Looway Toilet Seat Cover?",
        answer: `1.Open the resealable pouch and remove one toilet seat cover.
2.Unfold the cover fully — it unfolds in two halves.
3.Gently detach the perforated centre panel to create the opening over the toilet bowl.
4.Place the cover evenly over the toilet seat, ensuring all edges are covered with no gaps.
5.Sit normally and use the toilet comfortably.
6.After use: remove the cover and dispose directly in the bin. Do NOT flush — even biodegradable covers can cause drain blockages.
7.Reseal the pouch to keep remaining covers clean, flat, and dry.
`,
      },
      {
        question: "Do these covers work on Indian squat-style toilets?",
        answer: `No — Looway Toilet Seat Covers are designed for Western (sit-down) toilet seats only. They require a seat surface to lie flat on.
For hygiene at Indian squat-style toilets, we recommend the Looway Pee Funnel, which allows you to urinate standing up without touching any surface — no seat cover needed.
`,
      },
    ],
    "Material & Safety": [
      {
        question: "What are the Looway Toilet Seat Covers made of?",
        answer: `Looway Toilet Seat Covers are made from biodegradable, water-resistant paper — no plastic components of any kind.
They are water-resistant, meaning moisture from the toilet seat does not seep through to your skin.
Each cover decompose naturally after disposal — leaving no plastic waste in the environment.
`,
      },
      {
        question: "Are these safe for children and pregnant women?",
        answer: `Yes — the covers are safe for all ages and are particularly helpful for:
Pregnant women who need extra protection and find hovering uncomfortable
Children using public restrooms where hygiene is unpredictable
Elderly individuals and anyone with mobility challenges who cannot hover or squat
The water-resistant barrier keeps the seat surface completely away from skin contact.
`,
      },
    ],
    "Sizing & Variations": [
      {
        question: "How many covers do I get per order?",
        answer: `Each order contains 30 toilet seat covers, supplied as 2 resealable packs of 15 sheets each.
The resealable pouch keeps unused covers flat, dry, and clean until each individual use.
Note for developer: Please ensure the listing displays "30 covers (2 × 15 sheets)". The previous listing incorrectly showed 60 — this has been corrected.
`,
      },
      {
        question: "Will these fit all toilet seat sizes?",
        answer: `Yes — Looway Toilet Seat Covers are designed to fit most standard adult toilet seat dimensions found across India and internationally, including airport, mall, railway station, hotel, hospital, and office restrooms.
`,
      },
    ],
    "Shipping & Delivery": [],
    "Return & Replacement": [],
    "Subscription & Offers": [
      {
        question:
          "Can I subscribe to receive toilet seat covers automatically?",
        answer: `Yes — subscribe for monthly, every 2 months, or every 3 months delivery at up to 15% off with free shipping.
Ideal for frequent travellers, daily commuters, or families who want to always be prepared. Cancel or pause anytime from your account page.
`,
      },
    ],
  },
};

const Frequently = () => {
  const [activeProduct, setActiveProduct] = useState<ProductType>(
    "Ovy Reusable Menstrual Cup",
  );

  const [activeCategory, setActiveCategory] =
    useState<CategoryType>("Product Usage");

  const [searchText, setSearchText] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(
    faqData[activeProduct][activeCategory],
  );

  useEffect(() => {
    const filteredFAQ = Object.entries(faqData)
      .flatMap(([product, categories]) =>
        Object.entries(categories).flatMap(([category, faqs]) =>
          faqs.map((faq) => ({
            product,
            category,
            question: faq.question,
            answer: faq.answer,
          })),
        ),
      )
      .filter((faq) => {
        const text = searchText.toLowerCase();
        return (
          faq.question.toLowerCase().includes(text) ||
          faq.answer.toLowerCase().includes(text)
        );
      });
    setFilteredFAQs(filteredFAQ);
  }, [searchText]);

  return (
    <section className="w-full bg-white py-12 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold text-black sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500">
            Find answers to common questions about our products.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <IconSearch
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for answers"
              className="h-11 rounded-full pl-11"
            />
          </div>
        </div>

        {searchText == "" && (
          <>
            {/* PRODUCT TABS */}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {products.map((product) => (
                <button
                  key={product}
                  onClick={() => {
                    setActiveProduct(product);
                    setActiveCategory("Product Usage");
                  }}
                  className={`rounded-full border px-5 py-2 text-sm transition ${
                    activeProduct === product
                      ? "border-[#016271] bg-[#016271] text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {product}
                </button>
              ))}
            </div>

            {/* CATEGORY TABS */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`mt-7 rounded-full border px-4 py-2 text-sm transition ${
                    activeCategory === cat
                      ? "border-[#016271] bg-[#016271] text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 rounded-xl border border-gray-200 p-4">
          {searchText ? (
            filteredFAQs.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                No results found.
              </p>
            ) : (
              <Accordion type="single" collapsible>
                {filteredFAQs.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`search-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>

                    <AccordionContent className="whitespace-pre-line text-gray-600">
                      <p className="text-xs font-medium text-teal-600">
                        {faq?.product} ({faq.category})
                      </p>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )
          ) : faqData[activeProduct][activeCategory]?.length === 0 ? (
            <p className="py-6 text-center text-gray-500">
              No FAQs available for this section.
            </p>
          ) : (
            <Accordion type="single" collapsible>
              {faqData[activeProduct][activeCategory].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="whitespace-pre-line text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
};

export default Frequently;
