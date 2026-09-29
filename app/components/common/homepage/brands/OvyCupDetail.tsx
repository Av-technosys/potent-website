"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import { toast } from "sonner";
import {
  getOvyProductId,
  getOvyVariantId,
  getOvyVariantLabel,
  getOvyVariantPrice,
  getOvyVariants,
  type OvyVariant,
} from "./ovyProductPricing";

interface ProductDetails {
  id?: string;
  _id?: string;
  name?: string | null;
  slug?: string | null;
  bannerImage?: string | null;
}

interface OvyCupDetailProps {
  productsBySlug?: Record<string, ProductDetails | null>;
}

export function OvyCupDetail({ productsBySlug }: OvyCupDetailProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const cupProduct =
    productsBySlug?.["ovy-cup"] || productsBySlug?.["menstrual-cup"];
  const cupVariant = getOvyVariants(cupProduct)[0] as OvyVariant | undefined;
  const cupPrice = getOvyVariantPrice(cupVariant);
  const cupProductId = getOvyProductId(cupProduct);
  const cupVariantId = getOvyVariantId(cupVariant);
  const cupImage =
    cupVariant?.bannerImage || cupVariant?.image || cupProduct?.bannerImage;
  const canAddToCart = Boolean(cupProductId && cupVariantId && cupPrice > 0);

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      toast.error("Cup product details are unavailable.");
      return;
    }

    setIsAdding(true);
    try {
      const added = await addToCart({
        productId: cupProductId,
        productVariantId: cupVariantId,
        sku: cupVariant?.sku,
        slug: cupProduct?.slug || "ovy-cup",
        title: `${cupProduct?.name || "Ovy Menstrual Cup"} - ${getOvyVariantLabel(cupVariant)}`,
        image: getImageUrl(cupImage || "/placeholder.jpg"),
        price: cupPrice,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (added === false) return;
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Cup cart add error:", error);
      toast.error("Unable to add the cup to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="w-full overflow-hidden bg-[#FAF0F6] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Swim Model Photo inside Magenta Beaded Frame with subtle tilt */}
          <div className="flex justify-center lg:col-span-5">
            <div className="-rotate-1.5 relative aspect-3/4 w-full max-w-md transform transition-transform">
              <div
                className="relative h-full w-full overflow-hidden rounded-3xl border border-pink-200/50 p-3.5 shadow-[0_15px_35px_rgba(192,38,138,0.15)]"
                style={{ backgroundColor: "#FCE8F3" }}
              >
                {/* SVG Magenta Beaded Frame Ring */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full p-1.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="6"
                    width="calc(100% - 12px)"
                    height="calc(100% - 12px)"
                    rx="22"
                    fill="none"
                    stroke="#C0428A"
                    strokeWidth="6"
                    strokeDasharray="0 14"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/ovy/m2-swim.jpg"
                    alt="Ovy Menstrual Cup Swim Model"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Header, 3 Size Cards, 3 Stat Boxes, Action Buttons */}
          <div className="flex h-full flex-col justify-between space-y-6 lg:col-span-7">
            {/* Header Section Inside Right Column */}
            <div>
              <span className="mb-1.5 block text-[11px] font-bold tracking-widest text-[#602E55] uppercase">
                OVY MENSTRUAL CUP
              </span>
              <h2 className="font-serif text-3xl leading-snug font-bold text-[#1F1915] sm:text-4xl lg:text-5xl">
                Three sizes. One price.
              </h2>
              <div className="mt-0.5 font-serif text-2xl font-normal text-[#C0428A] italic sm:text-3xl">
                Choose by fit, not by age.
              </div>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed font-normal text-[#5C524D] sm:text-sm">
                Cervix height decides first, then flow, then whether you have
                given birth vaginally. Not age, not weight, and never budget:
                every size costs the same. Up to 12 hours between changes, 100%
                medical-grade silicone, and a cotton pouch in the box.
              </p>
            </div>

            {/* 3 Cup Size Cards Row */}
            <div
              id="ovy-cup-size-finder"
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {/* Card 1: Teen XS */}
              <div className="flex flex-col items-center rounded-3xl border border-pink-50 bg-white p-4 text-center shadow-[0_8px_20px_rgba(240,200,220,0.35)]">
                <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF3EB] p-2 sm:h-20 sm:w-20">
                  <Image
                    src="/ovy/cup-xs.jpg"
                    alt="Teen XS 16ml"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="text-xs font-bold text-[#1F1915] sm:text-sm">
                  Teen XS{" "}
                  <span className="font-semibold text-[#602E55]">16ml</span>
                </h3>
                <span className="my-0.5 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                  PINK
                </span>
                <p className="mt-1 text-[11px] leading-tight font-normal text-[#5C524D]">
                  First periods and first-timers. Before any birth. Folds no
                  wider than a tampon.
                </p>
              </div>

              {/* Card 2: Medium */}
              <div className="flex flex-col items-center rounded-3xl border border-pink-50 bg-white p-4 text-center shadow-[0_8px_20px_rgba(240,200,220,0.35)]">
                <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF3EB] p-2 sm:h-20 sm:w-20">
                  <Image
                    src="/ovy/cup-m.jpg"
                    alt="Medium 25ml"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="text-xs font-bold text-[#1F1915] sm:text-sm">
                  Medium{" "}
                  <span className="font-semibold text-[#602E55]">25ml</span>
                </h3>
                <span className="my-0.5 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                  PURPLE OR RAINBOW
                </span>
                <p className="mt-1 text-[11px] leading-tight font-normal text-[#5C524D]">
                  The everyday all-rounder. No vaginal birth yet, C-section mums
                  included.
                </p>
              </div>

              {/* Card 3: Large */}
              <div className="flex flex-col items-center rounded-3xl border border-pink-50 bg-white p-4 text-center shadow-[0_8px_20px_rgba(240,200,220,0.35)]">
                <div className="relative mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF3EB] p-2 sm:h-20 sm:w-20">
                  <Image
                    src="/ovy/cup-l.jpg"
                    alt="Large 35ml"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="text-xs font-bold text-[#1F1915] sm:text-sm">
                  Large{" "}
                  <span className="font-semibold text-[#602E55]">35ml</span>
                </h3>
                <span className="my-0.5 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                  WHITE
                </span>
                <p className="mt-1 text-[11px] leading-tight font-normal text-[#5C524D]">
                  After a vaginal birth, a heavier or longer flow, or a higher
                  cervix.
                </p>
              </div>
            </div>

            {/* 3 Stat Boxes Row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-pink-100/60 bg-[#F7EAF3]/80 p-3.5">
                <div className="font-serif text-xl font-bold text-[#602E55] sm:text-2xl">
                  12 hrs
                </div>
                <p className="mt-0.5 text-[11px] leading-tight text-[#5C524D]">
                  between changes, swim and sleep included
                </p>
              </div>

              <div className="rounded-2xl border border-pink-100/60 bg-[#F7EAF3]/80 p-3.5">
                <div className="font-serif text-xl font-bold text-[#602E55] sm:text-2xl">
                  Years
                </div>
                <p className="mt-0.5 text-[11px] leading-tight text-[#5C524D]">
                  from one cup. Replace every 2 to 3 for best hygiene
                </p>
              </div>

              <div className="rounded-2xl border border-pink-100/60 bg-[#F7EAF3]/80 p-3.5">
                <div className="font-serif text-xl font-bold text-[#602E55] sm:text-2xl">
                  3
                </div>
                <p className="mt-0.5 text-[11px] leading-tight text-[#5C524D]">
                  sizes, four colours, one price
                </p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/product-detail/ovy-cup"
                className="inline-flex items-center gap-2 rounded-full bg-[#602E55] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#4A2040] sm:text-sm"
              >
                Shop the cup <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/product-detail/ovy-cup?scroll=size-finder#size-finder"
                className="rounded-full border border-[#602E55] bg-white/50 px-6 py-2.5 text-xs font-semibold text-[#602E55] transition-colors hover:bg-pink-100/50 sm:text-sm"
              >
                FIND YOUR SIZE
              </Link>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || !canAddToCart}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#602E55] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#4A2040] disabled:opacity-50 sm:text-sm"
              >
                <Plus className="h-4 w-4" />
                {isAdding
                  ? "Adding..."
                  : isAdded
                    ? "Added!"
                    : cupPrice > 0
                      ? `Add, ₹${cupPrice}`
                      : "Price unavailable"}
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-[11px] leading-relaxed font-normal text-[#6B5E57]">
              Latex-free, BPA-free, hypoallergenic. The cup ships in plain,
              plastic-free recycled card.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
