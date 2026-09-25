"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import {
  findOvyVariant,
  getOvyProductId,
  getOvyVariantId,
  getOvyVariantPrice,
} from "./ovyProductPricing";

interface MomentData {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  modelImage: string;
  productTitle: string;
  productSubtitle: string;
  productImage: string;
  price: number;
  slug: string;
  compareLinkText: string;
}

const MOMENTS_DATA: MomentData[] = [
  {
    id: "first-period",
    tabLabel: "Her first period",
    badge: "HER FIRST PERIOD",
    title: "Her first period, sorted.",
    description:
      "Two sizes so she learns her own flow, 4 liners, a disposal bag for every pad, and a wrapper that stays silent at school.",
    modelImage: "/ovy/m2-first-period.jpg",
    productTitle: "Teen Kits",
    productSubtitle: "Starter Pack",
    productImage: "/products/teen.jpg",
    price: 378,
    slug: "ovy-teen-starter-pack",
    compareLinkText: "Compare the two teen kits →",
  },
  {
    id: "school-work",
    tabLabel: "School, work, the commute",
    badge: "SCHOOL & WORK",
    title: "Long hours, zero leaks.",
    description:
      "High-absorbency organic cotton pads with double wings that stay fixed during long commutes and active school days.",
    modelImage: "/ovy/m2-school.jpg",
    productTitle: "Ovy Organic Sanitary Pads",
    productSubtitle: "Regular & XL Mix",
    productImage: "/products/pads-l.jpg",
    price: 378,
    slug: "ovy-organic-sanitary-pads",
    compareLinkText: "See all pad sizes →",
  },
  {
    id: "heavy-days",
    tabLabel: "Heavy days and nights",
    badge: "HEAVY FLOW",
    title: "Overnight security & heavy flow protection.",
    description:
      "320mm XL+ extra wide back coverage so you sleep peacefully without worrying about sheet stains.",
    modelImage: "/ovy/m2-nights.jpg",
    productTitle: "Ovy XL+ Night Pads",
    productSubtitle: "Heavy Flow Pack",
    productImage: "/products/pads-xlplus.jpg",
    price: 398,
    slug: "ovy-organic-sanitary-pads",
    compareLinkText: "Explore night pads →",
  },
  {
    id: "sport-swim",
    tabLabel: "Sport and swimming",
    badge: "SPORT & SWIM",
    title: "12-hour freedom in water and on the track.",
    description:
      "100% medical-grade silicone cup that lets you swim, run, and workout without restrictions.",
    modelImage: "/ovy/m2-swim.jpg",
    productTitle: "Ovy Reusable Menstrual Cup",
    productSubtitle: "Medium, Rainbow",
    productImage: "/products/cup-rbw.jpg",
    price: 459,
    slug: "menstrual-cup",
    compareLinkText: "Find your cup size →",
  },
  {
    id: "after-baby",
    tabLabel: "After a baby",
    badge: "POSTPARTUM CARE",
    title: "Gentle, ultra-soft postpartum care.",
    description:
      "Extra wide and soft organic cotton topsheet designed for sensitive post-natal recovery and heavy bleeding.",
    modelImage: "/ovy/moment-postpartum.jpg",
    productTitle: "Ovy Organic Postpartum Pads",
    productSubtitle: "Postpartum XL+ Pack",
    productImage: "/products/pads-l.jpg",
    price: 398,
    slug: "ovy-organic-sanitary-pads",
    compareLinkText: "Learn about post-natal care →",
  },
  {
    id: "every-day",
    tabLabel: "Every day in between",
    badge: "DAILY FRESHNESS",
    title: "Freshness on non-period days.",
    description:
      "Ultra-thin 1mm panty liners for daily discharge, spotting, and keeping your underwear fresh.",
    modelImage: "/ovy/m2-every-day.jpg",
    productTitle: "Ovy Daily Panty Liners",
    productSubtitle: "Pack of 40",
    productImage: "/products/liners.jpg",
    price: 269,
    slug: "ovy-daily-panty-liners",
    compareLinkText: "Choose liner pack size →",
  },
];

export function OvyShopByMoment({ productsBySlug }: { productsBySlug: Record<string, any> }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const currentMoment = MOMENTS_DATA[activeTabIdx] || MOMENTS_DATA[0];

  const handleAddToCart = async () => {
    const fullProduct = productsBySlug[currentMoment.slug];
    if (!fullProduct) throw new Error("Product details are unavailable");

    setIsAdding(true);

    try {
      const variant = findOvyVariant(
        fullProduct,
        `${currentMoment.productTitle} ${currentMoment.productSubtitle}`,
      );
      const price = getOvyVariantPrice(variant) || Number(currentMoment.price);

      const added = await addToCart({
        productId: getOvyProductId(fullProduct) || currentMoment.id,
        productVariantId: getOvyVariantId(variant),
        sku: variant?.sku,
        slug: currentMoment.slug,
        title: `${currentMoment.productTitle} - ${currentMoment.productSubtitle}`,
        image: getImageUrl(currentMoment.productImage),
        price,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (added === false) return;
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Cart add error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section id="shop-by" className="w-full bg-[#FAF5E8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-block rounded-full border border-gray-200 bg-white/90 px-4 py-1 text-[10px] sm:text-[11px] font-bold tracking-widest text-[#016271] uppercase mb-2 shadow-2xs">
            SHOP BY MOMENT
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1915]">
            What does today look like?
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-normal text-[#5C524D]">
            Pick the day you're having and add the set for it in one tap.
          </p>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {MOMENTS_DATA.map((moment, idx) => {
            const isActive = activeTabIdx === idx;
            return (
              <button
                key={moment.id}
                onClick={() => setActiveTabIdx(idx)}
                className={`shrink-0 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#602E55] text-white font-semibold shadow-md"
                    : "bg-white text-[#602E55] border border-gray-200 hover:border-gray-300 font-medium"
                }`}
              >
                {moment.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Main Interactive Moment Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100 max-w-5xl mx-auto">
          
          {/* ------------------------------------------------------------------- */}
          {/* MOBILE VIEW (< md) - MATCHES MOBILE SCREENSHOT                      */}
          {/* ------------------------------------------------------------------- */}
          <div className="block md:hidden">
            {/* Top Row: Model Image Left + Badge & Title Right */}
            <div className="flex items-start gap-3">
              {/* Model Image with Beaded Purple Dot Frame */}
              <div
                className="relative w-36 h-36 shrink-0 overflow-hidden rounded-2xl p-1.5"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4"
                    y="4"
                    width="calc(100% - 8px)"
                    height="calc(100% - 8px)"
                    rx="16"
                    fill="none"
                    stroke="#602E55"
                    strokeWidth="5"
                    strokeDasharray="0 14"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-full w-full overflow-hidden rounded-xl bg-purple-50">
                  <Image
                    src={currentMoment.modelImage}
                    alt={currentMoment.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>

              {/* Title & Badge */}
              <div className="flex flex-col pt-1">
                <span className="text-[10px] font-bold tracking-wider text-[#C42B5B] uppercase mb-1">
                  {currentMoment.badge}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#602E55] leading-tight">
                  {currentMoment.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#5C524D] mt-3 leading-relaxed">
              {currentMoment.description}
            </p>

            {/* Included Product Pill Box */}
            <div className="bg-[#F5EFF6] rounded-2xl p-3 flex items-center justify-between mt-3.5 border border-purple-100/60">
              <div className="flex items-center gap-2.5">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                  <Image
                    src={currentMoment.productImage}
                    alt={currentMoment.productTitle}
                    fill
                    className="object-cover"
                    sizes="50px"
                  />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1F1915]">
                    {currentMoment.productTitle}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {currentMoment.productSubtitle}
                  </div>
                </div>
              </div>

              <div className="font-serif text-sm font-bold text-[#1F1915]">
                ₹{currentMoment.price}
              </div>
            </div>

            {/* Price & Add to Bag Row */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  PRICE
                </div>
                <div className="font-serif text-2xl font-extrabold text-[#1F1915] leading-none mt-0.5">
                  ₹{currentMoment.price}
                </div>
                <div className="text-[10px] font-semibold text-emerald-700 mt-1">
                  ₹121 more for free delivery
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#602E55] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#4E2445] disabled:opacity-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>
                  {isAdding ? "Adding..." : isAdded ? "Added! ✓" : "+ Add to bag"}
                </span>
              </button>
            </div>

            {/* Compare Link */}
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#602E55] hover:underline mt-3 inline-block"
            >
              {currentMoment.compareLinkText}
            </Link>
          </div>


          {/* ------------------------------------------------------------------- */}
          {/* DESKTOP VIEW (md:) - MATCHES WEB SCREENSHOT                         */}
          {/* ------------------------------------------------------------------- */}
          <div className="hidden md:grid grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Model Image inside Beaded Purple Dot Frame */}
            <div className="col-span-5">
              <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl p-3"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                {/* SVG Beaded Frame Ring */}
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none p-1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="5"
                    width="calc(100% - 10px)"
                    height="calc(100% - 10px)"
                    rx="24"
                    fill="none"
                    stroke="#602E55"
                    strokeWidth="7"
                    strokeDasharray="0 16"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-purple-50">
                  <Image
                    src={currentMoment.modelImage}
                    alt={currentMoment.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Moment Details */}
            <div className="col-span-7 flex flex-col justify-between py-2">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#C42B5B] uppercase block mb-1">
                  {currentMoment.badge}
                </span>

                <h3 className="font-serif text-3xl lg:text-4xl font-bold text-[#602E55] leading-tight">
                  {currentMoment.title}
                </h3>

                <p className="text-sm text-[#5C524D] mt-3 leading-relaxed max-w-xl">
                  {currentMoment.description}
                </p>

                {/* Included Product Pill Box */}
                <div className="bg-[#F5EFF6] rounded-2xl p-3.5 flex items-center justify-between mt-5 border border-purple-100/80 max-w-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
                      <Image
                        src={currentMoment.productImage}
                        alt={currentMoment.productTitle}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1F1915]">
                        {currentMoment.productTitle}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentMoment.productSubtitle}
                      </div>
                    </div>
                  </div>

                  <div className="font-serif text-base font-bold text-[#1F1915]">
                    ₹{currentMoment.price}
                  </div>
                </div>
              </div>

              {/* Price & Add to Bag Row */}
              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between max-w-lg">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    PRICE
                  </div>
                  <div className="font-serif text-3xl font-extrabold text-[#1F1915] leading-none mt-0.5">
                    ₹{currentMoment.price}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1">
                    ₹121 more for free delivery
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#602E55] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#4E2445] disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    {isAdding ? "Adding..." : isAdded ? "Added! ✓" : "+ Add to bag"}
                  </span>
                </button>
              </div>

              <Link
                href="/shop"
                className="text-xs font-semibold text-[#602E55] hover:underline mt-4 inline-block"
              >
                {currentMoment.compareLinkText}
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
