"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Check,
  ArrowRight,
  ShieldCheck,
  Leaf,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import {
  findOvyVariant,
  getOvyProductId,
  getOvyVariantLabel,
  getOvyVariantId,
  getOvyVariantPrice,
  getOvyVariants,
} from "./ovyProductPricing";

interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  audience: string;
  badge: string;
  borderColor: string;
  image: string;
  bullets: string[];
  footerNote: string;
  variants: {
    label: string;
    price: number;
    sku?: string;
    variantId?: string;
  }[];
}

const PRODUCTS_DATA: ProductCardData[] = [
  {
    id: "ovy-pads",
    slug: "ovy-organic-sanitary-pads",
    title: "Ovy Organic Sanitary Pads",
    subtitle: "Your period doesn't decide today's plans.",
    audience: "For light days, full days, nights and after a baby",
    badge: "LIGHT DAYS, HEAVY DAYS, NIGHTS",
    borderColor: "#8C4F7C",
    image: "/products/pads-l.jpg",
    bullets: [
      "L 240mm, XL 280mm, XL+ 320mm: one for each kind of day",
      "Organic, cottony-soft top sheet, certified toxin-free",
      "21 pads, 4 liners and a disposal bag for every piece",
    ],
    footerNote: "Flow changes across the month? Build your own box, below.",
    variants: [
      { label: "L", price: 378 },
      { label: "XL", price: 388 },
      { label: "XL+", price: 398 },
    ],
  },
  {
    id: "ovy-teen",
    slug: "ovy-teen-starter-pack",
    title: "Ovy Teen Kits",
    subtitle: "Her first period, sorted.",
    audience: "For first periods, and the parents buying for them",
    badge: "HER FIRST PERIOD",
    borderColor: "#8C4F7C",
    image: "/products/teen.jpg",
    bullets: [
      "Starter: 10 L and 11 XL, so she learns her own flow",
      "Pro-Active: three sizes and sport-tested wings",
      "A wrapper that stays silent at school",
    ],
    footerNote: "The First Period Box, the complete 50-piece gift, is launching soon.",
    variants: [
      { label: "Starter Pack", price: 378 },
      { label: "Pro-Active Pack", price: 378 },
    ],
  },
  {
    id: "ovy-cup",
    slug: "menstrual-cup",
    title: "Ovy Reusable Menstrual Cup",
    subtitle: "Your flow, your rules.",
    audience: "Teen XS, Medium or Large: choose by fit, not by age",
    badge: "SWIM, SPORT, 12 HOURS",
    borderColor: "#C42B5B",
    image: "/products/cup-rbw.jpg",
    bullets: [
      "Up to 12 hours between changes, swim and sleep included",
      "100% medical-grade silicone, latex-free and BPA-free",
      "Years from one cup; replace every 2 to 3 for hygiene",
    ],
    footerNote: "Every size and every colour is the same price.",
    variants: [
      { label: "Medium, purple", price: 459 },
      { label: "Medium, rainbow", price: 459 },
      { label: "Large, white", price: 459 },
      { label: "Teen XS, pink", price: 459 },
    ],
  },
  {
    id: "ovy-liners",
    slug: "ovy-daily-panty-liners",
    title: "Ovy Daily Liners",
    subtitle: "Fresh every day, the clean way.",
    audience: "For discharge, spotting and light leaks, not period flow",
    badge: "THE DAYS IN BETWEEN",
    borderColor: "#1B6A85",
    image: "/products/liners.jpg",
    bullets: [
      "About 1mm thin and 190mm long",
      "No added fragrance and no added dyes",
      "Individually wrapped, so one lives in every bag",
    ],
    footerNote: "A fresh liner every 3 to 4 hours: about four for a full day.",
    variants: [
      { label: "Pack of 40", price: 269 },
      { label: "Pack of 60", price: 404 },
      { label: "Pack of 80", price: 538 },
    ],
  },
];

export function OvyShopSection({ productsBySlug }: { productsBySlug: Record<string, any> }) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({
    "ovy-pads": 0,
    "ovy-teen": 0,
    "ovy-cup": 1,
    "ovy-liners": 0,
  });

  const [addingState, setAddingState] = useState<Record<string, boolean>>({});
  const [addedState, setAddedState] = useState<Record<string, boolean>>({});
  const [likedState, setLikedState] = useState<Record<string, boolean>>({});

  const handleSelectVariant = (productId: string, variantIdx: number) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantIdx }));
  };

  const toggleLike = (productId: string) => {
    setLikedState((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddProductToCart = async (cardData: ProductCardData) => {
    const vIdx = selectedVariants[cardData.id] || 0;
    const variantObj = cardData.variants[vIdx] || cardData.variants[0];

    const fullProduct = productsBySlug[cardData.slug];
    if (!fullProduct) throw new Error("Product details are unavailable");

    setAddingState((prev) => ({ ...prev, [cardData.id]: true }));

    try {
      const realVariant = findOvyVariant(fullProduct, variantObj.label, vIdx);
      const price = getOvyVariantPrice(realVariant) || Number(variantObj.price);

      const added = await addToCart({
        productId: getOvyProductId(fullProduct) || cardData.id,
        productVariantId: getOvyVariantId(realVariant) || variantObj.variantId,
        sku: realVariant?.sku || variantObj.sku,
        slug: cardData.slug,
        title: `${cardData.title} - ${variantObj.label}`,
        image: getImageUrl(cardData.image),
        price,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (added === false) return;
      setAddedState((prev) => ({ ...prev, [cardData.id]: true }));
      setTimeout(() => {
        setAddedState((prev) => ({ ...prev, [cardData.id]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed adding to cart:", err);
    } finally {
      setAddingState((prev) => ({ ...prev, [cardData.id]: false }));
    }
  };

  return (
    <section className="w-full bg-[#FAF5E8] pt-10 pb-0">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center px-4 mb-8 sm:mb-10">
        <span className="inline-block rounded-full border border-gray-200 bg-white/90 px-4 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest text-[#016271] uppercase mb-2 sm:mb-3 shadow-2xs">
          SHOP OVY
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1915] leading-tight">
          Four kinds of day.
        </h2>
        <div className="mt-1 sm:mt-2 inline-block -rotate-1 transform rounded-2xl bg-[#D6C5F7] px-4 py-1.5 sm:px-5 sm:py-2 shadow-2xs">
          <span className="font-serif text-2xl sm:text-4xl font-bold italic text-[#4A2040]">
            One Ovy for each.
          </span>
        </div>
        <p className="mt-3 text-xs sm:text-base font-normal text-[#5C524D] max-w-md sm:max-w-none mx-auto">
          Choose the pack, see its price, add it. Every box ships within 24 hours.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PRODUCTS_DATA.map((card) => {
            const fullProduct = productsBySlug[card.slug];
            const dynamicVariants = getOvyVariants(fullProduct);
            const renderedCard: ProductCardData = {
              ...card,
              title: fullProduct?.name || card.title,
              variants: dynamicVariants.length
                ? dynamicVariants.map((variant) => ({
                    label: getOvyVariantLabel(variant),
                    price: getOvyVariantPrice(variant),
                    sku: variant.sku,
                    variantId: variant.id || variant._id,
                  }))
                : card.variants,
            };
            const currentVarIdx = selectedVariants[card.id] || 0;
            const currentVariant =
              renderedCard.variants[currentVarIdx] || renderedCard.variants[0];
            const isAdding = addingState[card.id];
            const isAdded = addedState[card.id];
            const isLiked = likedState[card.id];

            return (
              <div
                key={card.id}
                className="overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                {/* ------------------------------------------------------------- */}
                {/* 1. MOBILE CARD VIEW (< md) - MATCHES MOBILE SCREENSHOT 1      */}
                {/* ------------------------------------------------------------- */}
                <div className="block md:hidden p-3">
                  {/* Top Beaded Dotted Border Bar */}
                  <div
                    className="w-full h-3.5 rounded-t-xl mb-2.5 overflow-hidden"
                    style={{
                      backgroundColor: card.borderColor,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2.5' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Category Badge Text */}
                  <div className="text-[10px] font-bold tracking-wider uppercase mb-2" style={{ color: card.borderColor }}>
                    {card.badge}
                  </div>

                  {/* Image + Info Row */}
                  <div className="flex items-start gap-3">
                    {/* Left Image Box */}
                    <div
                      className="relative w-28 h-28 shrink-0 overflow-hidden rounded-xl p-1.5"
                      style={{ backgroundColor: "#FAF3EB" }}
                    >
                      <Image
                        src={card.image}
                        alt={renderedCard.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="120px"
                      />
                    </div>

                    {/* Right Info */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#1F1915] leading-snug">
                          {renderedCard.title}
                        </h3>
                        <p className="font-serif text-[11px] font-semibold italic mt-0.5" style={{ color: card.borderColor }}>
                          {card.subtitle}
                        </p>
                      </div>
                      <p className="text-[11px] font-bold text-[#4A2040] mt-1.5 leading-tight">
                        {card.audience}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Variant Buttons Grid */}
                  <div className={`grid gap-2 mt-3.5 ${renderedCard.variants.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                    {renderedCard.variants.map((v, idx) => {
                      const isActive = currentVarIdx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectVariant(card.id, idx)}
                          className={`rounded-xl p-2 text-left transition-all border ${
                            isActive
                              ? "border-2 border-[#602E55] bg-[#F5EFF6] shadow-2xs"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="text-[10px] font-semibold text-gray-500 leading-none">{v.label}</div>
                          <div className="font-serif text-xs font-bold text-[#1F1915] mt-1">₹{v.price}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Price & Add to Bag Row */}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                    <div className="font-serif text-xl font-bold text-[#1F1915]">
                      ₹{currentVariant.price}
                    </div>

                    <button
                      onClick={() => handleAddProductToCart(renderedCard)}
                      disabled={isAdding}
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#602E55] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#4E2445] disabled:opacity-50"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{isAdding ? "Adding..." : isAdded ? "Added! ✓" : "+ Add to bag"}</span>
                    </button>
                  </div>

                  <p className="mt-2 text-[12px] text-gray-500 leading-snug">
                    {card.footerNote}
                  </p>
                </div>


                {/* ------------------------------------------------------------- */}
                {/* 2. DESKTOP CARD VIEW (md:) - MATCHES DESKTOP SCREENSHOT       */}
                {/* ------------------------------------------------------------- */}
                <div className="hidden md:flex flex-col justify-between p-4 h-full">
                  <div>
                    {/* Top Image Media Box with Full Beaded Ring */}
                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl p-3"
                      style={{ backgroundColor: "#FAF3EB" }}
                    >
                      {/* SVG Beaded Frame Ring */}
                      <svg
                        className="absolute inset-0 h-full w-full pointer-events-none p-1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="4"
                          y="4"
                          width="calc(100% - 8px)"
                          height="calc(100% - 8px)"
                          rx="20"
                          fill="none"
                          stroke={card.borderColor}
                          strokeWidth="6"
                          strokeDasharray="0 14"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Badge top-left */}
                      <span className="absolute top-3 left-3 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#4A2040] shadow-2xs uppercase">
                        {card.badge}
                      </span>

                      {/* Heart button top-right */}
                      <button
                        onClick={() => toggleLike(card.id)}
                        className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-2xs transition-transform hover:scale-110"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isLiked ? "fill-pink-600 text-pink-600" : "text-gray-500"
                          }`}
                        />
                      </button>

                      {/* Image */}
                      <div className="relative h-full w-full overflow-hidden rounded-xl bg-purple-50">
                        <Image
                          src={card.image}
                          alt={renderedCard.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="350px"
                        />
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="mt-4 px-1">
                      <h3 className="font-serif text-lg font-bold text-[#1F1915] leading-snug">
                        {renderedCard.title}
                      </h3>
                      <p
                        className="font-serif text-xs font-semibold italic mt-0.5"
                        style={{ color: card.borderColor }}
                      >
                        {card.subtitle}
                      </p>

                      <p className="mt-2 text-xs font-bold text-[#4A2040]">
                        {card.audience}
                      </p>

                      {/* Bullets */}
                      <ul className="mt-3 space-y-1.5 text-xs text-[#5C524D]">
                        {card.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-[#016271] shrink-0 mt-0.5 stroke-[2.5]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Desktop Actions & Price */}
                  <div className="mt-5 border-t border-gray-100 pt-3 px-1">
                    {/* Variant Selector Buttons */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {renderedCard.variants.map((v, idx) => {
                        const isActive = currentVarIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectVariant(card.id, idx)}
                            className={`rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-all border ${
                              isActive
                                ? "border-[#602E55] bg-purple-50/80 text-[#602E55] shadow-2xs font-bold ring-1 ring-[#602E55]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {v.label} <span className="font-serif">₹{v.price}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Price & Add to Bag Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-serif text-xl sm:text-2xl font-bold text-[#1F1915]">
                        ₹{currentVariant.price}
                      </div>

                      <button
                        onClick={() => handleAddProductToCart(renderedCard)}
                        disabled={isAdding}
                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#602E55] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:scale-105 hover:bg-[#4E2445] disabled:opacity-50"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>
                          {isAdding ? "Adding..." : isAdded ? "Added! ✓" : "+ Add to bag"}
                        </span>
                      </button>
                    </div>

                    <p className="mt-3 text-[10px] text-gray-500 leading-snug">
                      {card.footerNote}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Or Build Your Own Box Banner */}
      <div className="mt-8 sm:mt-12 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl border border-dashed border-[#D6C5F7] bg-[#f2e2f4] p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center -space-x-3 shrink-0">
              <div className="w-12 sm:w-14 h-14 sm:h-16 relative rounded-xl overflow-hidden border-2 border-white shadow-md">
                <Image src="/products/pads-l.jpg" alt="Pad 1" fill className="object-cover" />
              </div>
              <div className="w-12 sm:w-14 h-14 sm:h-16 relative rounded-xl overflow-hidden border-2 border-white shadow-md z-10">
                <Image src="/products/teen.jpg" alt="Pad 2" fill className="object-cover" />
              </div>
              <div className="w-12 sm:w-14 h-14 sm:h-16 relative rounded-xl overflow-hidden border-2 border-white shadow-md z-20">
                <Image src="/products/pads-l.jpg" alt="Pad 3" fill className="object-cover" />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-base sm:text-2xl font-bold text-[#1F1915]">
                Or build your own box.
              </h3>
              <p className="text-[11px] sm:text-sm text-[#5C524D] mt-0.5 sm:mt-1 max-w-xl">
                Put 21 pads across L, XL and XL+ in any split, with 4 liners. One flat price, whatever the split.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 rounded-full bg-[#602E55] px-6 py-2.5 sm:px-7 sm:py-3 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#4E2445] w-full sm:w-auto text-center"
            >
              <span>Build your box</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] sm:text-sm text-[#7C726D] mt-3 sm:mt-4 mb-6 sm:mb-8 px-2">
          Pads can also come on your cycle: Cycle-Sync delivers about 5 days before your period. Pause, skip or cancel in two clicks.
        </p>
      </div>

      {/* Bottom 4 Dark Purple Trust Bar */}
      <div className="w-full bg-[#602E55] py-6 sm:py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="rounded-full bg-[#753B69] p-2 sm:p-2.5 shrink-0 mt-0.5">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200" />
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm">Dermatologically tested</h4>
              <p className="text-[10px] sm:text-[11px] text-purple-200/80 mt-0.5 leading-tight">On 24 volunteers, to IS 4011:2018</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="rounded-full bg-[#753B69] p-2 sm:p-2.5 shrink-0 mt-0.5">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200" />
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm">Organic and toxin-free</h4>
              <p className="text-[10px] sm:text-[11px] text-purple-200/80 mt-0.5 leading-tight">No chlorine bleach, parabens or dyes</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="rounded-full bg-[#753B69] p-2 sm:p-2.5 shrink-0 mt-0.5">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200" />
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm">pH-balanced, cruelty-free</h4>
              <p className="text-[10px] sm:text-[11px] text-purple-200/80 mt-0.5 leading-tight">Both certified, and vegan-friendly</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="rounded-full bg-[#753B69] p-2 sm:p-2.5 shrink-0 mt-0.5">
              <PackageCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200" />
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm">Ships within 24 hours</h4>
              <p className="text-[10px] sm:text-[11px] text-purple-200/80 mt-0.5 leading-tight">Damaged or wrong? Replaced free</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
