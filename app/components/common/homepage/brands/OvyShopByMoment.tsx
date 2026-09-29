"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import { toast } from "sonner";
import {
  findOvyVariant,
  getOvyProductId,
  getOvyVariantId,
  getOvyVariantPrice,
  getOvyVariantLabel,
  getOvyVariants,
  type OvyVariant,
} from "./ovyProductPricing";

interface MomentData {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  modelImage: string;
  slug: string;
  variantHint?: string;
  variantIndex?: number;
  compareLinkText: string;
}

interface ProductDetails {
  id?: string;
  _id?: string;
  name?: string | null;
  bannerImage?: string | null;
  freeShippingOver?: number | string | null;
  productMediaRes?: {
    productVariantId?: string | null;
    mediaURL?: string | null;
  }[];
}

function getMomentVariantImage(
  product: ProductDetails | null | undefined,
  variant: OvyVariant | undefined,
) {
  const variantId = getOvyVariantId(variant);
  const media = product?.productMediaRes?.find(
    (item) => item.productVariantId === variantId,
  );

  return getImageUrl(
    variant?.bannerImage ||
      variant?.image ||
      media?.mediaURL ||
      product?.bannerImage ||
      "/placeholder.jpg",
  );
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
    slug: "ovy-teen",
    variantHint: "Starter",
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
    slug: "ovy-pads",
    variantIndex: 0,
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
    slug: "ovy-pads",
    variantHint: "XL+",
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
    slug: "ovy-cup",
    variantHint: "Medium Rainbow",
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
    slug: "ovy-pads",
    variantHint: "XL+",
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
    slug: "ovy-liners",
    variantHint: "40",
    compareLinkText: "Choose liner pack size →",
  },
];

export function OvyShopByMoment({
  productsBySlug,
}: {
  productsBySlug: Record<string, ProductDetails | null>;
}) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const currentMoment = MOMENTS_DATA[activeTabIdx] || MOMENTS_DATA[0];
  const currentProduct = productsBySlug[currentMoment.slug] as
    ProductDetails | null | undefined;
  const currentVariants = getOvyVariants(currentProduct);
  const currentVariant = findOvyVariant(
    currentProduct,
    currentMoment.variantHint || "",
    currentMoment.variantIndex || 0,
  );
  const currentProductTitle = currentProduct?.name || "Product unavailable";
  const currentProductSubtitle = getOvyVariantLabel(currentVariant);
  const currentProductPrice = getOvyVariantPrice(currentVariant);
  const currentProductImage = getMomentVariantImage(
    currentProduct,
    currentVariant,
  );
  const freeShippingOver = Number(currentProduct?.freeShippingOver || 0);
  const freeShippingMessage =
    freeShippingOver > currentProductPrice
      ? `₹${freeShippingOver - currentProductPrice} more for free delivery`
      : "Free delivery eligible";
  const canAddToCart = Boolean(
    currentProduct &&
    currentVariants.length > 0 &&
    getOvyProductId(currentProduct) &&
    getOvyVariantId(currentVariant) &&
    currentProductPrice > 0,
  );

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      const productId = getOvyProductId(currentProduct);
      const productVariantId = getOvyVariantId(currentVariant);

      if (!productId || !productVariantId || currentProductPrice <= 0) {
        throw new Error("Product variant details are unavailable");
      }

      const added = await addToCart({
        productId,
        productVariantId,
        sku: currentVariant?.sku,
        slug: currentMoment.slug,
        title: `${currentProductTitle} - ${currentProductSubtitle}`,
        image: currentProductImage,
        price: currentProductPrice,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (added === false) {
        toast.error("Unable to add this variant to cart. Please try again.");
        return;
      }
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Cart add error:", err);
      toast.error("Unable to add this variant to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section id="shop-by" className="w-full bg-[#FAF5E8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <span className="mb-2 inline-block rounded-full border border-gray-200 bg-white/90 px-4 py-1 text-[10px] font-bold tracking-widest text-[#016271] uppercase shadow-2xs sm:text-[11px]">
            SHOP BY MOMENT
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F1915] sm:text-5xl">
            What does today look like?
          </h2>
          <p className="mt-2 text-xs font-normal text-[#5C524D] sm:text-sm">
            Pick the day you&apos;re having and add the set for it in one tap.
          </p>
        </div>

        {/* Category Tabs Bar */}
        <div className="no-scrollbar -mx-4 mb-8 flex items-center justify-start gap-2 overflow-x-auto px-4 pb-4 sm:mx-0 sm:justify-center sm:px-0">
          {MOMENTS_DATA.map((moment, idx) => {
            const isActive = activeTabIdx === idx;
            return (
              <button
                key={moment.id}
                onClick={() => setActiveTabIdx(idx)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? "bg-[#602E55] font-semibold text-white shadow-md"
                    : "border border-gray-200 bg-white font-medium text-[#602E55] hover:border-gray-300"
                }`}
              >
                {moment.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Main Interactive Moment Card */}
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
          {/* ------------------------------------------------------------------- */}
          {/* MOBILE VIEW (< md) - MATCHES MOBILE SCREENSHOT                      */}
          {/* ------------------------------------------------------------------- */}
          <div className="block md:hidden">
            {/* Top Row: Model Image Left + Badge & Title Right */}
            <div className="flex items-start gap-3">
              {/* Model Image with Beaded Purple Dot Frame */}
              <div
                className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl p-1.5"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full p-1"
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
                <span className="mb-1 text-[10px] font-bold tracking-wider text-[#C42B5B] uppercase">
                  {currentMoment.badge}
                </span>
                <h3 className="font-serif text-xl leading-tight font-bold text-[#602E55]">
                  {currentMoment.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-xs leading-relaxed text-[#5C524D]">
              {currentMoment.description}
            </p>

            {/* Included Product Pill Box */}
            <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-purple-100/60 bg-[#F5EFF6] p-3">
              <div className="flex items-center gap-2.5">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                  <Image
                    src={currentProductImage}
                    alt={currentProductTitle}
                    fill
                    className="object-cover"
                    sizes="50px"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1F1915]">
                    {currentProductTitle}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {currentProductSubtitle}
                  </div>
                </div>
              </div>

              <div className="font-serif text-sm font-bold text-[#1F1915]">
                {currentProductPrice > 0
                  ? `₹${currentProductPrice}`
                  : "Price unavailable"}
              </div>
            </div>

            {/* Price & Add to Bag Row */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                <div className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                  PRICE
                </div>
                <div className="mt-0.5 font-serif text-2xl leading-none font-extrabold text-[#1F1915]">
                  {currentProductPrice > 0
                    ? `₹${currentProductPrice}`
                    : "Price unavailable"}
                </div>
                <div className="mt-1 text-[10px] font-semibold text-emerald-700">
                  {freeShippingMessage}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || !canAddToCart}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#602E55] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#4E2445] disabled:opacity-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>
                  {isAdding
                    ? "Adding..."
                    : isAdded
                      ? "Added! ✓"
                      : "+ Add to bag"}
                </span>
              </button>
            </div>

            {/* Compare Link */}
            <Link
              href="/shop"
              className="mt-3 inline-block text-xs font-semibold text-[#602E55] hover:underline"
            >
              {currentMoment.compareLinkText}
            </Link>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* DESKTOP VIEW (md:) - MATCHES WEB SCREENSHOT                         */}
          {/* ------------------------------------------------------------------- */}
          <div className="hidden grid-cols-12 items-center gap-8 md:grid">
            {/* Left Column: Model Image inside Beaded Purple Dot Frame */}
            <div className="col-span-5">
              <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl p-3"
                style={{ backgroundColor: "#FAF3EB" }}
              >
                {/* SVG Beaded Frame Ring */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full p-1.5"
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
                <span className="mb-1 block text-xs font-bold tracking-wider text-[#C42B5B] uppercase">
                  {currentMoment.badge}
                </span>

                <h3 className="font-serif text-3xl leading-tight font-bold text-[#602E55] lg:text-4xl">
                  {currentMoment.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5C524D]">
                  {currentMoment.description}
                </p>

                {/* Included Product Pill Box */}
                <div className="mt-5 flex max-w-lg items-center justify-between rounded-2xl border border-purple-100/80 bg-[#F5EFF6] p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                      <Image
                        src={currentProductImage}
                        alt={currentProductTitle}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1F1915]">
                        {currentProductTitle}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentProductSubtitle}
                      </div>
                    </div>
                  </div>

                  <div className="font-serif text-base font-bold text-[#1F1915]">
                    {currentProductPrice > 0
                      ? `₹${currentProductPrice}`
                      : "Price unavailable"}
                  </div>
                </div>
              </div>

              {/* Price & Add to Bag Row */}
              <div className="mt-6 flex max-w-lg items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    PRICE
                  </div>
                  <div className="mt-0.5 font-serif text-3xl leading-none font-extrabold text-[#1F1915]">
                    {currentProductPrice > 0
                      ? `₹${currentProductPrice}`
                      : "Price unavailable"}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-emerald-700">
                    {freeShippingMessage}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !canAddToCart}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#602E55] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#4E2445] disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    {isAdding
                      ? "Adding..."
                      : isAdded
                        ? "Added! ✓"
                        : "+ Add to bag"}
                  </span>
                </button>
              </div>

              <Link
                href="/shop"
                className="mt-4 inline-block text-xs font-semibold text-[#602E55] hover:underline"
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
