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
import { toast } from "sonner";
import {
  getOvyProductId,
  getOvyVariantLabel,
  getOvyVariantId,
  getOvyVariantPrice,
  getOvyVariants,
  type OvyVariant,
} from "./ovyProductPricing";

interface ProductCardConfig {
  id: string;
  slug: string;
  badge: string;
  borderColor: string;
  fallbackImage: string;
}

interface ProductCardData extends ProductCardConfig {
  title: string;
  subtitle: string;
  audience: string;
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

interface ProductDetails {
  id?: string;
  _id?: string;
  name?: string | null;
  description?: string | null;
  bannerImage?: string | null;
  highlights?: string[] | null;
  custimizeBoxInfo?: string | null;
  productMediaRes?: {
    productVariantId?: string | null;
    mediaURL?: string | null;
  }[];
}

function cleanProductText(value: unknown) {
  return typeof value === "string"
    ? value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

function getProductDescription(product?: ProductDetails | null) {
  const description = cleanProductText(product?.description);
  return description.split(/(?<=[.!?])\s+/)[0] || description;
}

function getVariantSummary(variants: OvyVariant[]) {
  return Array.from(
    new Set(
      variants
        .flatMap((variant) => [variant.size, variant.flowType, variant.name])
        .map(cleanProductText)
        .filter(Boolean),
    ),
  ).join(" · ");
}

function getProductBadge(variants: OvyVariant[]) {
  return Array.from(
    new Set(
      variants
        .flatMap((variant) => [variant.flowType, variant.size])
        .map(cleanProductText)
        .filter(Boolean),
    ),
  )
    .slice(0, 2)
    .join(" · ")
    .toUpperCase();
}

function getProductHighlights(
  product: ProductDetails | null | undefined,
  variants: OvyVariant[],
) {
  const highlights = Array.isArray(product?.highlights)
    ? product.highlights.map(cleanProductText).filter(Boolean)
    : [];

  if (highlights.length > 0) return highlights.slice(0, 3);

  return Array.from(
    new Set(
      variants
        .flatMap((variant) => [variant.size, variant.flowType, variant.name])
        .map(cleanProductText)
        .filter(Boolean),
    ),
  ).slice(0, 3);
}

function getProductImage(
  product: ProductDetails | null | undefined,
  variant: OvyVariant | undefined,
  fallback: string,
) {
  const variantId = variant?.id || variant?._id;
  const media = product?.productMediaRes?.find(
    (item) => item?.productVariantId === variantId,
  );

  return getImageUrl(
    variant?.bannerImage ||
      variant?.image ||
      media?.mediaURL ||
      product?.bannerImage ||
      fallback,
  );
}

const PRODUCTS_DATA: ProductCardConfig[] = [
  {
    id: "ovy-pads",
    slug: "ovy-pads",
    badge: "OVY",
    borderColor: "#8C4F7C",
    fallbackImage: "/products/pads-l.jpg",
  },
  {
    id: "ovy-teen",
    slug: "ovy-teen",
    badge: "OVY",
    borderColor: "#8C4F7C",
    fallbackImage: "/products/teen.jpg",
  },
  {
    id: "ovy-cup",
    slug: "ovy-cup",
    badge: "OVY",
    borderColor: "#C42B5B",
    fallbackImage: "/products/cup-rbw.jpg",
  },
  {
    id: "ovy-liners",
    slug: "ovy-liners",
    badge: "OVY",
    borderColor: "#1B6A85",
    fallbackImage: "/products/liners.jpg",
  },
];

export function OvyShopSection({
  productsBySlug,
}: {
  productsBySlug: Record<string, ProductDetails | null>;
}) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, number>
  >({
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

    try {
      const fullProduct = productsBySlug[cardData.slug];
      const realVariant = getOvyVariants(fullProduct).find(
        (variant) => getOvyVariantId(variant) === variantObj?.variantId,
      );
      const productId = getOvyProductId(fullProduct);
      const productVariantId = getOvyVariantId(realVariant);
      const price = getOvyVariantPrice(realVariant);

      if (!productId || !productVariantId || price <= 0) {
        throw new Error("Product variant details are unavailable");
      }

      setAddingState((prev) => ({ ...prev, [cardData.id]: true }));

      const added = await addToCart({
        productId,
        productVariantId,
        sku: realVariant?.sku,
        slug: cardData.slug,
        title: `${cardData.title} - ${variantObj.label}`,
        image: getImageUrl(cardData.image),
        price,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (added === false) {
        toast.error("Unable to add this variant to cart. Please try again.");
        return;
      }
      setAddedState((prev) => ({ ...prev, [cardData.id]: true }));
      setTimeout(() => {
        setAddedState((prev) => ({ ...prev, [cardData.id]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed adding to cart:", err);
      toast.error("Unable to add this variant to cart. Please try again.");
    } finally {
      setAddingState((prev) => ({ ...prev, [cardData.id]: false }));
    }
  };

  return (
    <section className="w-full bg-[#FAF5E8] pt-10 pb-0">
      {/* Header */}
      <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10">
        <span className="mb-2 inline-block rounded-full border border-gray-200 bg-white/90 px-4 py-1 text-[10px] font-bold tracking-widest text-[#016271] uppercase shadow-2xs sm:mb-3 sm:text-[11px]">
          SHOP OVY
        </span>
        <h2 className="font-serif text-3xl leading-tight font-bold text-[#1F1915] sm:text-5xl">
          Four kinds of day.
        </h2>
        <div className="mt-1 inline-block -rotate-1 transform rounded-2xl bg-[#D6C5F7] px-4 py-1.5 shadow-2xs sm:mt-2 sm:px-5 sm:py-2">
          <span className="font-serif text-2xl font-bold text-[#4A2040] italic sm:text-4xl">
            One Ovy for each.
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-md text-xs font-normal text-[#5C524D] sm:max-w-none sm:text-base">
          Choose the pack, see its price, add it. Every box ships within 24
          hours.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS_DATA.map((card) => {
            const fullProduct = productsBySlug[card.slug];
            const dynamicVariants = getOvyVariants(fullProduct);
            const selectedVariantIndex = Math.min(
              selectedVariants[card.id] || 0,
              Math.max(dynamicVariants.length - 1, 0),
            );
            const selectedProductVariant =
              dynamicVariants[selectedVariantIndex] || dynamicVariants[0];
            const dynamicDescription = getProductDescription(fullProduct);
            const renderedCard: ProductCardData = {
              ...card,
              title: cleanProductText(fullProduct?.name),
              subtitle: dynamicDescription,
              audience: getVariantSummary(dynamicVariants),
              badge: getProductBadge(dynamicVariants) || card.badge,
              image: getProductImage(
                fullProduct,
                selectedProductVariant,
                card.fallbackImage,
              ),
              bullets: getProductHighlights(fullProduct, dynamicVariants),
              footerNote: cleanProductText(fullProduct?.custimizeBoxInfo),
              variants: dynamicVariants.length
                ? dynamicVariants.map((variant) => ({
                    label: getOvyVariantLabel(variant),
                    price: getOvyVariantPrice(variant),
                    sku: variant.sku,
                    variantId: variant.id || variant._id,
                  }))
                : [],
            };
            const currentVarIdx = selectedVariantIndex;
            const currentVariant =
              renderedCard.variants[currentVarIdx] || renderedCard.variants[0];
            const currentPrice = currentVariant?.price || 0;
            const isVariantComingSoon = Boolean(
              currentVariant?.label?.toLowerCase().includes("first period") ||
              currentVariant?.label?.toLowerCase().includes("50 pcs") ||
              currentVariant?.sku?.toLowerCase().includes("first")
            );

            const canAddToCart = Boolean(
              !isVariantComingSoon &&
              fullProduct &&
              dynamicVariants.length > 0 &&
              currentVariant?.variantId &&
              currentVariant.price > 0,
            );
            const isAdding = addingState[card.id];
            const isAdded = addedState[card.id];
            const isLiked = likedState[card.id];

            return (
              <div
                key={card.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl"
              >
                {/* ------------------------------------------------------------- */}
                {/* 1. MOBILE CARD VIEW (< md) - MATCHES MOBILE SCREENSHOT 1      */}
                {/* ------------------------------------------------------------- */}
                <div className="block p-3 md:hidden">
                  {/* Top Beaded Dotted Border Bar */}
                  <div
                    className="mb-2.5 h-3.5 w-full overflow-hidden rounded-t-xl"
                    style={{
                      backgroundColor: card.borderColor,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6' cy='6' r='2.5' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Category Badge Text */}
                  <div
                    className="mb-2 text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: card.borderColor }}
                  >
                    {renderedCard.badge}
                  </div>

                  {/* Image + Info Row */}
                  <div className="flex items-start gap-3">
                    {/* Left Image Box */}
                    <div
                      className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl p-1.5"
                      style={{ backgroundColor: "#FAF3EB" }}
                    >
                      <Image
                        src={renderedCard.image}
                        alt={renderedCard.title}
                        fill
                        className="rounded-lg object-cover"
                        sizes="120px"
                      />
                    </div>

                    {/* Right Info */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base leading-snug font-bold text-[#1F1915]">
                          {renderedCard.title}
                        </h3>
                        <p
                          className="mt-0.5 font-serif text-[11px] font-semibold italic"
                          style={{ color: card.borderColor }}
                        >
                          {renderedCard.subtitle}
                        </p>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-tight font-bold text-[#4A2040]">
                        {renderedCard.audience}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Variant Buttons Grid */}
                  <div
                    className={`mt-3.5 grid gap-2 ${renderedCard.variants.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
                  >
                    {renderedCard.variants.map((v, idx) => {
                      const isActive = currentVarIdx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectVariant(card.id, idx)}
                          className={`rounded-xl border p-2 text-left transition-all ${
                            isActive
                              ? "border-2 border-[#602E55] bg-[#F5EFF6] shadow-2xs"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="text-[10px] leading-none font-semibold text-gray-500">
                            {v.label}
                          </div>
                          <div className="mt-1 font-serif text-xs font-bold text-[#1F1915]">
                            ₹{v.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Price & Add to Bag Row */}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                    <div className="font-serif text-xl font-bold text-[#1F1915]">
                      {isVariantComingSoon
                        ? "Coming soon"
                        : currentPrice > 0
                        ? `₹${currentPrice}`
                        : "Price unavailable"}
                    </div>

                    <button
                      onClick={() => handleAddProductToCart(renderedCard)}
                      disabled={isAdding || !canAddToCart || isVariantComingSoon}
                      className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold shadow-sm transition-all ${
                        isVariantComingSoon
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                          : "bg-[#602E55] text-white hover:bg-[#4E2445] disabled:opacity-50"
                      }`}
                    >
                      {!isVariantComingSoon && <ShoppingBag className="h-3.5 w-3.5" />}
                      <span>
                        {isVariantComingSoon
                          ? "Coming soon"
                          : isAdding
                          ? "Adding..."
                          : isAdded
                          ? "Added! ✓"
                          : "+ Add to bag"}
                      </span>
                    </button>
                  </div>

                  <p className="mt-2 text-[12px] leading-snug text-gray-500">
                    {renderedCard.footerNote}
                  </p>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* 2. DESKTOP CARD VIEW (md:) - MATCHES DESKTOP SCREENSHOT       */}
                {/* ------------------------------------------------------------- */}
                <div className="hidden h-full flex-col justify-between p-4 md:flex">
                  <div>
                    {/* Top Image Media Box with Full Beaded Ring */}
                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl p-3"
                      style={{ backgroundColor: "#FAF3EB" }}
                    >
                      {/* SVG Beaded Frame Ring */}
                      <svg
                        className="pointer-events-none absolute inset-0 h-full w-full p-1"
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
                      <span className="absolute top-3 left-3 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#4A2040] uppercase shadow-2xs">
                        {renderedCard.badge}
                      </span>

                      {/* Heart button top-right */}
                      <button
                        onClick={() => toggleLike(card.id)}
                        className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-2xs transition-transform hover:scale-110"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isLiked
                              ? "fill-pink-600 text-pink-600"
                              : "text-gray-500"
                          }`}
                        />
                      </button>

                      {/* Image */}
                      <div className="relative h-full w-full overflow-hidden rounded-xl bg-purple-50">
                        <Image
                          src={renderedCard.image}
                          alt={renderedCard.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="350px"
                        />
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="mt-4 px-1">
                      <h3 className="font-serif text-lg leading-snug font-bold text-[#1F1915]">
                        {renderedCard.title}
                      </h3>
                      <p
                        className="mt-0.5 font-serif text-xs font-semibold italic"
                        style={{ color: card.borderColor }}
                      >
                        {renderedCard.subtitle}
                      </p>

                      <p className="mt-2 text-xs font-bold text-[#4A2040]">
                        {renderedCard.audience}
                      </p>

                      {/* Bullets */}
                      <ul className="mt-3 space-y-1.5 text-xs text-[#5C524D]">
                        {renderedCard.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[2.5] text-[#016271]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Desktop Actions & Price */}
                  <div className="mt-5 border-t border-gray-100 px-1 pt-3">
                    {/* Variant Selector Buttons */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {renderedCard.variants.map((v, idx) => {
                        const isActive = currentVarIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectVariant(card.id, idx)}
                            className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                              isActive
                                ? "border-[#602E55] bg-purple-50/80 font-bold text-[#602E55] shadow-2xs ring-1 ring-[#602E55]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {v.label}{" "}
                            <span className="font-serif">₹{v.price}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Price & Add to Bag Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-serif text-xl font-bold text-[#1F1915] sm:text-2xl">
                        {isVariantComingSoon
                          ? "Coming soon"
                          : currentPrice > 0
                          ? `₹${currentPrice}`
                          : "Price unavailable"}
                      </div>

                      <button
                        onClick={() => handleAddProductToCart(renderedCard)}
                        disabled={isAdding || !canAddToCart || isVariantComingSoon}
                        className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold shadow-sm transition-all ${
                          isVariantComingSoon
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                            : "bg-[#602E55] text-white hover:scale-105 hover:bg-[#4E2445] disabled:opacity-50"
                        }`}
                      >
                        {!isVariantComingSoon && <ShoppingBag className="h-3.5 w-3.5" />}
                        <span>
                          {isVariantComingSoon
                            ? "Coming soon"
                            : isAdding
                            ? "Adding..."
                            : isAdded
                            ? "Added! ✓"
                            : "+ Add to bag"}
                        </span>
                      </button>
                    </div>

                    <p className="mt-3 text-[10px] leading-snug text-gray-500">
                      {renderedCard.footerNote}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Or Build Your Own Box Banner */}
      <div className="mx-auto mt-8 max-w-7xl px-3 sm:mt-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-[#D6C5F7] bg-[#f2e2f4] p-4 shadow-2xs sm:gap-6 sm:rounded-3xl sm:p-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex shrink-0 items-center -space-x-3">
              <div className="relative h-14 w-12 overflow-hidden rounded-xl border-2 border-white shadow-md sm:h-16 sm:w-14">
                <Image
                  src="/products/pads-l.jpg"
                  alt="Pad 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 h-14 w-12 overflow-hidden rounded-xl border-2 border-white shadow-md sm:h-16 sm:w-14">
                <Image
                  src="/products/teen.jpg"
                  alt="Pad 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-20 h-14 w-12 overflow-hidden rounded-xl border-2 border-white shadow-md sm:h-16 sm:w-14">
                <Image
                  src="/products/pads-l.jpg"
                  alt="Pad 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-[#1F1915] sm:text-2xl">
                Or build your own box.
              </h3>
              <p className="mt-0.5 max-w-xl text-[11px] text-[#5C524D] sm:mt-1 sm:text-sm">
                Put 21 pads across L, XL and XL+ in any split, with 4 liners.
                One flat price, whatever the split.
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/shop"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#602E55] px-6 py-2.5 text-center text-xs font-semibold text-white shadow-md transition-all hover:bg-[#4E2445] sm:w-auto sm:px-7 sm:py-3"
            >
              <span>Build your box</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="mt-3 mb-6 px-2 text-center text-[10px] text-[#7C726D] sm:mt-4 sm:mb-8 sm:text-sm">
          Pads can also come on your cycle: Cycle-Sync delivers about 5 days
          before your period. Pause, skip or cancel in two clicks.
        </p>
      </div>

      {/* Bottom 4 Dark Purple Trust Bar */}
      <div className="w-full bg-[#602E55] py-6 text-white sm:py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="mt-0.5 shrink-0 rounded-full bg-[#753B69] p-2 sm:p-2.5">
              <ShieldCheck className="h-4 w-4 text-purple-200 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold sm:text-sm">
                Dermatologically tested
              </h4>
              <p className="mt-0.5 text-[10px] leading-tight text-purple-200/80 sm:text-[11px]">
                On 24 volunteers, to IS 4011:2018
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="mt-0.5 shrink-0 rounded-full bg-[#753B69] p-2 sm:p-2.5">
              <Leaf className="h-4 w-4 text-purple-200 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold sm:text-sm">
                Organic and toxin-free
              </h4>
              <p className="mt-0.5 text-[10px] leading-tight text-purple-200/80 sm:text-[11px]">
                No chlorine bleach, parabens or dyes
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="mt-0.5 shrink-0 rounded-full bg-[#753B69] p-2 sm:p-2.5">
              <Heart className="h-4 w-4 text-purple-200 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold sm:text-sm">
                pH-balanced, cruelty-free
              </h4>
              <p className="mt-0.5 text-[10px] leading-tight text-purple-200/80 sm:text-[11px]">
                Both certified, and vegan-friendly
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 sm:space-x-3">
            <div className="mt-0.5 shrink-0 rounded-full bg-[#753B69] p-2 sm:p-2.5">
              <PackageCheck className="h-4 w-4 text-purple-200 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold sm:text-sm">
                Ships within 24 hours
              </h4>
              <p className="mt-0.5 text-[10px] leading-tight text-purple-200/80 sm:text-[11px]">
                Damaged or wrong? Replaced free
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
