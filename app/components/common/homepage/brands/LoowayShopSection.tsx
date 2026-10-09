"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Check, Plus } from "lucide-react";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/WishlistStore";
import { addToWishlist, removeFromWishlist } from "@/store/WishlistActions";
import {
  getOvyProductId,
  getOvyVariantId,
  getOvyVariantLabel,
  getOvyVariantPrice,
  getOvyVariants,
  type OvyVariant,
} from "./ovyProductPricing";

const TICKER_ITEMS = [
  "Ships within 24 hours",
  "Filthy seat? Sit down.",
  "Squat toilet? Stand up.",
  "No toilet? Looway.",
  "Car sick? Morning sick? Bag it.",
];

interface ProductCard {
  id: string;
  slug: string;
  badge: string;
  badgeBg: string;
  taglineColor: string;
  footerNote: string;
  fallbackImage: string;
}

interface ProductDetails {
  id?: string;
  _id?: string;
  name?: string | null;
  description?: string | null;
  bannerImage?: string | null;
  highlights?: string[] | null;
  productMediaRes?: {
    productVariantId?: string | null;
    mediaURL?: string | null;
  }[];
}

interface ProductCardData extends ProductCard {
  title: string;
  tagline: string;
  audience: string;
  image: string;
  bullets: string[];
  variants: {
    label: string;
    price: number;
    sku?: string;
    variantId?: string;
  }[];
}

const LOOWAY_PRODUCTS: ProductCard[] = [
  {
    id: "seatcovers",
    slug: "looway-toilet-seat-covers",
    badge: "THE FILTHY WESTERN SEAT",
    badgeBg: "bg-white text-gray-700",
    taglineColor: "text-[#0B6E7D]",
    footerNote: "Western seats only. Fold it, bin it, never flush it.",
    fallbackImage: "/products/seatcovers.jpg",
  },
  {
    id: "funnel",
    slug: "looway-pee-funnel",
    badge: "THE SQUAT TOILET YOU'D RATHER NOT USE",
    badgeBg: "bg-white text-gray-700",
    taglineColor: "text-[#C02670]",
    footerNote: "External use only. Nothing goes inside.",
    fallbackImage: "/products/funnel.jpg",
  },
  {
    id: "pukebags",
    slug: "looway-pee-puke",
    badge: "NO TOILET AT ALL",
    badgeBg: "bg-white text-gray-700",
    taglineColor: "text-[#1E5E41]",
    footerNote:
      "Seal it, bin it, never flush it. Harmful if swallowed; keep used bags away from children and pets.",
    fallbackImage: "/products/pukebags.jpg",
  },
];

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

function getProductImage(
  product: ProductDetails | null | undefined,
  variant: OvyVariant | undefined,
  fallback: string,
) {
  const variantId = getOvyVariantId(variant);
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

export function LoowayShopSection({
  productsBySlug,
}: {
  productsBySlug: Record<string, ProductDetails | null>;
}) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, number>
  >({
    seatcovers: 0,
    funnel: 0,
    pukebags: 0,
  });

  const wishlistItems = useWishlistStore((state) => state.items);
  const [addingState, setAddingState] = useState<Record<string, boolean>>({});
  const [addedState, setAddedState] = useState<Record<string, boolean>>({});

  const toggleWishlist = async (productData: ProductCardData) => {
    const fullProd = productsBySlug[productData.slug];
    const prodId = getOvyProductId(fullProd) || productData.id;
    if (!prodId) return;
    const isLiked = wishlistItems.some(
      (item) => item.productId === prodId || item.productId === productData.slug || item.slug === productData.slug
    );
    if (isLiked) {
      await removeFromWishlist(prodId);
    } else {
      const vIdx = selectedVariants[productData.id] || 0;
      const variantObj = productData.variants[vIdx] || productData.variants[0];
      const realVariant = fullProd
        ? getOvyVariants(fullProd).find(
            (variant) => getOvyVariantId(variant) === variantObj?.variantId,
          )
        : null;

      const currentSelectedVariant = realVariant || variantObj;
      const availableVariants = fullProd ? getOvyVariants(fullProd) : productData.variants;

      await addToWishlist({
        ...(fullProd || {}),
        productId: prodId,
        name: productData.title,
        image: productData.image,
        slug: productData.slug,
        selectedVariant: currentSelectedVariant,
        variants: availableVariants,
      });
    }
  };

  const handleVariantSelect = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantIndex }));
  };

  const renderedProducts: ProductCardData[] = LOOWAY_PRODUCTS.map((card) => {
    const product = productsBySlug[card.slug];
    const rawVariants = getOvyVariants(product);
    const variants = rawVariants.map((variant) => ({
      label: getOvyVariantLabel(variant),
      price: getOvyVariantPrice(variant),
      sku: variant.sku,
      variantId: getOvyVariantId(variant),
    }));

    return {
      ...card,
      title: cleanProductText(product?.name) || card.badge,
      tagline: getProductDescription(product),
      audience: getVariantSummary(rawVariants),
      image: getProductImage(
        product,
        rawVariants[selectedVariants[card.id] || 0] || rawVariants[0],
        card.fallbackImage,
      ),
      bullets: getProductHighlights(product, rawVariants),
      variants,
    };
  });

  const addProductToCart = async (card: ProductCardData) => {
    const variantIndex = Math.min(
      selectedVariants[card.id] || 0,
      Math.max(card.variants.length - 1, 0),
    );
    const selectedVariant = card.variants[variantIndex] || card.variants[0];
    const product = productsBySlug[card.slug];
    const realVariant = getOvyVariants(product).find(
      (variant) => getOvyVariantId(variant) === selectedVariant?.variantId,
    );
    const productId = getOvyProductId(product);
    const productVariantId = getOvyVariantId(realVariant);
    const price = getOvyVariantPrice(realVariant);

    if (!productId || !productVariantId || !selectedVariant || price <= 0) {
      toast.error("This product variant is unavailable right now.");
      return false;
    }

    const added = await addToCart({
      productId,
      productVariantId,
      sku: realVariant?.sku,
      slug: card.slug,
      title: `${card.title} - ${selectedVariant.label}`,
      image: getImageUrl(card.image),
      price,
      quantity: 1,
      isQuantityChangable: true,
    });

    if (added === false) {
      toast.error("Unable to add this variant to cart. Please try again.");
      return false;
    }

    return true;
  };

  const handleAddProduct = async (card: ProductCardData) => {
    setAddingState((prev) => ({ ...prev, [card.id]: true }));
    try {
      const added = await addProductToCart(card);
      if (added) {
        setAddedState((prev) => ({ ...prev, [card.id]: true }));
        setTimeout(() => {
          setAddedState((prev) => ({ ...prev, [card.id]: false }));
        }, 2000);
      }
    } catch (error) {
      console.error("Failed adding Looway product to cart:", error);
      toast.error("Unable to add this variant to cart. Please try again.");
    } finally {
      setAddingState((prev) => ({ ...prev, [card.id]: false }));
    }
  };

  const handleAddAllThree = async () => {
    setAddingState((prev) => ({ ...prev, combo: true }));
    try {
      for (const card of renderedProducts) {
        const added = await addProductToCart(card);
        if (!added) return;
      }
      setAddedState((prev) => ({ ...prev, combo: true }));
      setTimeout(() => {
        setAddedState((prev) => ({ ...prev, combo: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed adding Looway products to cart:", error);
      toast.error("Unable to add all Looway products. Please try again.");
    } finally {
      setAddingState((prev) => ({ ...prev, combo: false }));
    }
  };

  const comboPrice = renderedProducts.reduce((total, product) => {
    const variantIndex = Math.min(
      selectedVariants[product.id] || 0,
      Math.max(product.variants.length - 1, 0),
    );
    return total + (product.variants[variantIndex]?.price || 0);
  }, 0);

  const tickerItemsRepeated = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];

  return (
    <section id="looway-shop-section" className="w-full bg-[#FAF8F3] pb-16">
      {/* Top Ticker Strap with Top Checkerboard Patti */}
      <div className="w-full overflow-hidden">
        {/* Top Pattern Patti */}
        <div
          className="h-3 w-full"
          style={{
            background:
              "repeating-conic-gradient(#F6D353 0 25%, #004851 0 50%) 0 0 / 24px 24px",
          }}
        />

        {/* Yellow Marquee Ticker Bar */}
        <div className="w-full border-b border-[#E5BC35] bg-[#F6D353] py-3.5">
          <div
            className="animate-marquee flex w-max items-center space-x-8 font-serif text-xs font-semibold whitespace-nowrap text-[#004851] sm:text-sm"
            style={{ animationDuration: "35s" }}
          >
            {tickerItemsRepeated.map((item, idx) => (
              <div key={idx} className="flex shrink-0 items-center space-x-8">
                <span>{item}</span>
                <span className="text-xs font-bold text-[#004851]">+</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <span className="mb-2 block text-[11px] font-bold tracking-widest text-[#0B6E7D] uppercase">
            SHOP LOOWAY
          </span>
          <h2 className="font-serif text-[27px] leading-[29.16px] font-semibold text-[#1A150F] sm:text-[46px] sm:leading-[49.68px]">
            Three kinds of toilet on a trip.
          </h2>
          <div className="mt-1">
            <span className="relative inline-block leading-tight">
              <span className="absolute inset-x-0 bottom-1 h-[38%] bg-[#F6D353] sm:bottom-2" />
              <span className="relative font-serif text-2xl font-bold text-[#004851] sm:text-4xl">
                One answer for each.
              </span>
            </span>
          </div>
          <p className="mt-4 text-xs leading-relaxed font-normal text-[#5C7275] sm:text-base">
            Pick the one you need, or take all three. Every pack slips into a
            handbag, a glovebox or a diaper bag.
          </p>
        </div>

        {/* 3 Product Cards Grid */}
        <div className="mb-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8">
          {renderedProducts.map((product) => {
            const activeVariantIdx = Math.min(
              selectedVariants[product.id] || 0,
              Math.max(product.variants.length - 1, 0),
            );
            const activeVariant = product.variants[activeVariantIdx];
            const fullProd = productsBySlug[product.slug];
            const realProdId = getOvyProductId(fullProd) || product.id;
            const isLiked = wishlistItems.some(
              (item) =>
                item.productId === realProdId ||
                item.productId === product.slug ||
                item.slug === product.slug,
            );

            return (
              <div
                key={product.id}
                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Top Beaded / Checkerboard Pattern Patti */}
                <div
                  className="h-2.5 w-full shrink-0"
                  style={{
                    background:
                      "repeating-conic-gradient(#004851 0 25%, #F6D353 0 50%) 0 0 / 16px 16px",
                  }}
                />

                {/* 1. MOBILE CARD VIEW (block md:hidden) */}
                <div className="block p-4 md:hidden">
                  {/* Top Kicker Badge */}
                  <div className="mb-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                    {product.badge}
                  </div>

                  {/* Top Row: Image + Main Info */}
                  <div className="flex items-start gap-3.5">
                    {/* Product Image */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-[#F3FAF8] p-2">
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-2xs transition-colors hover:text-red-500"
                        aria-label="Toggle Wishlist"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </button>
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                        sizes="110px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex min-h-[112px] flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold leading-tight text-[#1F1915]">
                          {product.title}
                        </h3>
                        <p
                          className={`mt-0.5 text-xs font-semibold italic ${product.taglineColor}`}
                        >
                          {product.tagline}
                        </p>
                      </div>

                      <p className="mt-1 text-[11px] font-medium leading-snug text-[#5C7275]">
                        {product.audience || product.bullets.join(" · ")}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Variant Buttons Grid */}
                  <div
                    className={`mt-3.5 grid gap-2 ${
                      product.variants.length === 2 ? "grid-cols-2" : "grid-cols-3"
                    }`}
                  >
                    {product.variants.map((variant, vIdx) => {
                      const isSelected = activeVariantIdx === vIdx;
                      return (
                        <button
                          key={vIdx}
                          onClick={() => handleVariantSelect(product.id, vIdx)}
                          className={`rounded-xl border p-2 text-left transition-all ${
                            isSelected
                              ? "border-2 border-[#0B6E7D] bg-teal-50/70 font-bold text-[#0B6E7D] shadow-2xs"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase leading-none">
                            {variant.label}
                          </div>
                          <div className="mt-1 font-serif text-xs font-bold text-[#1F1915]">
                            ₹{variant.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Price & Add to Bag Row */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="font-serif text-xl font-bold text-[#1F1915]">
                      {activeVariant
                        ? `₹${activeVariant.price}`
                        : "Price unavailable"}
                    </div>

                    <button
                      onClick={() => handleAddProduct(product)}
                      disabled={
                        addingState[product.id] ||
                        !activeVariant ||
                        activeVariant.price <= 0
                      }
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0B6E7D] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#085561] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      <span>
                        {addingState[product.id]
                          ? "Adding..."
                          : addedState[product.id]
                            ? "Added"
                            : "Add to bag"}
                      </span>
                    </button>
                  </div>

                  {/* Mobile Footer Note */}
                  <p className="mt-2 text-[10px] leading-tight text-gray-400">
                    {product.footerNote}
                  </p>
                </div>

                {/* 2. DESKTOP CARD VIEW (hidden md:flex) */}
                <div className="hidden flex-1 flex-col justify-between space-y-4 p-5 md:flex">
                  {/* Top Image Container */}
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#F3FAF8] p-3">
                    {/* Top Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="rounded-full border border-gray-100 bg-white/95 px-3 py-1 text-[9px] font-bold tracking-wider text-gray-700 uppercase shadow-2xs sm:text-[10px]">
                        {product.badge}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-2xs transition-colors hover:text-red-500"
                    >
                      <Heart
                        className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </button>

                    {/* Product Image */}
                    <div className="relative h-full w-full">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain"
                        sizes="350px"
                      />
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="flex flex-1 flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-sm leading-snug font-bold text-[#1F1915] sm:text-base">
                        {product.title}
                      </h3>
                      <div
                        className={`text-xs font-bold sm:text-sm ${product.taglineColor} mt-0.5`}
                      >
                        {product.tagline}
                      </div>
                      <div className="mt-1 text-[11px] font-medium text-gray-400">
                        {product.audience}
                      </div>

                      {/* Bullets List */}
                      <ul className="mt-3 space-y-1.5 text-xs text-[#5C7275]">
                        {product.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[2.5] text-[#0B6E7D]" />
                            <span className="leading-tight">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Variant Selection Pills */}
                    <div className="pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {product.variants.map((variant, vIdx) => {
                          const isSelected = activeVariantIdx === vIdx;
                          return (
                            <button
                              key={vIdx}
                              onClick={() =>
                                handleVariantSelect(product.id, vIdx)
                              }
                              className={`rounded-xl border p-2 text-left text-xs transition-all ${
                                isSelected
                                  ? "border-[#0B6E7D] bg-teal-50/60 font-bold text-[#0B6E7D]"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              <div className="text-[10px] font-semibold tracking-wider uppercase">
                                {variant.label}
                              </div>
                              <div className="font-bold">₹{variant.price}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price & Add to Bag */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                      <div className="font-serif text-xl font-bold text-[#1F1915]">
                        {activeVariant
                          ? `₹${activeVariant.price}`
                          : "Price unavailable"}
                      </div>

                      <button
                        onClick={() => handleAddProduct(product)}
                        disabled={
                          addingState[product.id] ||
                          !activeVariant ||
                          activeVariant.price <= 0
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0B6E7D] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#085561] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                        <span>
                          {addingState[product.id]
                            ? "Adding..."
                            : addedState[product.id]
                              ? "Added"
                              : "Add to bag"}
                        </span>
                      </button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-[10px] leading-tight text-gray-400">
                      {product.footerNote}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Combo Banner ("Take all three.") */}
        <div className="rounded-2xl border border-dashed border-[#F7CE46] bg-[#FFF9E5] p-4 shadow-2xs sm:p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Left side: Thumbnails & Description */}
            <div className="flex items-center gap-4">
              <div className="flex shrink-0 -space-x-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-yellow-200 bg-white p-1 shadow-2xs">
                  <Image
                    src={
                      renderedProducts[0]?.image || "/products/seatcovers.jpg"
                    }
                    alt={renderedProducts[0]?.title || "Seat covers"}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-yellow-200 bg-white p-1 shadow-2xs">
                  <Image
                    src={renderedProducts[1]?.image || "/products/funnel.jpg"}
                    alt={renderedProducts[1]?.title || "Pee funnel"}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-yellow-200 bg-white p-1 shadow-2xs">
                  <Image
                    src={renderedProducts[2]?.image || "/products/pukebags.jpg"}
                    alt={renderedProducts[2]?.title || "Pee and puke bags"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-base font-bold text-[#1F1915] sm:text-lg">
                  Take all three.
                </h3>
                <p className="text-xs leading-tight text-[#5C7275]">
                  A funnel for her, 50 seat covers and 10 bags: the three
                  toilets a trip can throw at you, in one bag.
                </p>
              </div>
            </div>

            {/* Right side: Price & Action Buttons */}
            <div className="flex shrink-0 items-center gap-4">
              <div className="text-right">
                <div className="font-serif text-xl font-bold text-[#1F1915]">
                  {comboPrice > 0 ? `₹${comboPrice}` : "Price unavailable"}
                </div>
                <div className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Free delivery
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <button
                  onClick={handleAddAllThree}
                  disabled={
                    addingState.combo ||
                    renderedProducts.some((product) =>
                      product.variants.every((variant) => variant.price <= 0),
                    )
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0B6E7D] px-5 py-2.5 text-xs font-semibold whitespace-nowrap text-white shadow-2xs transition-all hover:bg-[#085561] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {addingState.combo
                      ? "Adding..."
                      : addedState.combo
                        ? "Added"
                        : "Add all three"}
                  </span>
                </button>

                <Link
                  href="/looway-yatra-kit"
                  className="px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#0B6E7D] hover:underline"
                >
                  Or build a Yatra Kit →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subtext below Combo Banner */}
        <p className="mx-auto mt-4 max-w-3xl text-center text-[11px] leading-relaxed text-gray-500">
          Seat covers and bags can also come on a schedule, monthly or every two
          months: choose Subscribe on each product page. Pause, skip or cancel
          in two clicks.
        </p>
      </div>
    </section>
  );
}
