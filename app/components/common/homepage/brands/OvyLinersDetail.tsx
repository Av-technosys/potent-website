"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import { addToCart } from "@/store/cartActions";
import { toast } from "sonner";
import {
  getOvyProductId,
  getOvyVariantId,
  getOvyVariantLabel,
  getOvyVariantPrice,
  getOvyVariants,
} from "./ovyProductPricing";

interface OvyLinersDetailProps {
  productsBySlug?: Record<string, any>;
}

export function OvyLinersDetail({ productsBySlug }: OvyLinersDetailProps) {
  const handleAddToCart = async () => {
    const linerProduct = productsBySlug?.["ovy-daily-panty-liners"];
    const linerVariant = getOvyVariants(linerProduct)[0];
    const productId = getOvyProductId(linerProduct);
    const productVariantId = getOvyVariantId(linerVariant);
    const price = getOvyVariantPrice(linerVariant);

    if (!productId || !productVariantId || price <= 0) {
      toast.error("Liner product details are unavailable.");
      return;
    }

    try {
      await addToCart({
        productId,
        productVariantId,
        sku: linerVariant?.sku,
        slug: "ovy-daily-panty-liners",
        title: `${linerProduct?.name || "Ovy Daily Panty Liners"} - ${getOvyVariantLabel(linerVariant)}`,
        image: getImageUrl(
          linerVariant?.bannerImage ||
            linerVariant?.image ||
            linerProduct?.bannerImage,
        ),
        price,
        quantity: 1,
        isQuantityChangable: true,
      });
    } catch (error) {
      console.error("Liner cart add error:", error);
      toast.error("Unable to add liners to cart. Please try again.");
    }
  };

  return (
    <section className="w-full bg-[#EEF7FC] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Title, Quote, Checkmarks, Stats & Buttons */}
          <div className="flex flex-col justify-center space-y-6 lg:col-span-7">
            {/* Header */}
            <div>
              <span className="mb-1.5 block text-[11px] font-bold tracking-widest text-[#602E55] uppercase">
                OVY DAILY LINERS
              </span>
              <h2 className="font-serif text-2xl leading-snug font-bold text-[#1F1915] sm:text-4xl lg:text-5xl">
                Fresh every day,{" "}
                <span className="font-serif font-normal text-[#2563EB] italic">
                  the clean way.
                </span>
              </h2>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed font-normal text-[#5C524D] sm:text-sm">
                About 1mm thin and 190mm long, with a breathable, cottony-soft
                top sheet, no added fragrance and no added dyes. Individually
                wrapped, so one lives in every bag.
              </p>
            </div>

            {/* Quote Callout Box */}
            <div className="max-w-xl rounded-r-2xl border-l-4 border-[#2563EB] bg-white p-4 shadow-2xs">
              <p className="font-serif text-sm font-medium text-[#1F1915] italic sm:text-base">
                “If it is your period, it is a pad. If it is everything in
                between, it is a liner.”
              </p>
            </div>

            {/* 2-Column Checkmarks Grid */}
            <div className="grid max-w-xl grid-cols-1 gap-2.5 text-xs text-[#1F1915] sm:grid-cols-2 sm:text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />
                <span>Everyday discharge</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />
                <span>Spotting before or after a period</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />
                <span>Light bladder leaks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />
                <span>Backup with a cup on light days</span>
              </div>
            </div>

            {/* 3 Stat Boxes Row */}
            <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-2xs">
                <div className="font-serif text-2xl font-bold text-[#602E55]">
                  40
                </div>
                <div className="mt-0.5 text-[11px] font-bold text-[#1F1915]">
                  about 10 days
                </div>
                <div className="text-[10px] text-gray-400">Trying Ovy</div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-2xs">
                <div className="font-serif text-2xl font-bold text-[#602E55]">
                  60
                </div>
                <div className="mt-0.5 text-[11px] font-bold text-[#1F1915]">
                  about a fortnight
                </div>
                <div className="text-[10px] text-gray-400">
                  Our pick for daily wear
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-2xs">
                <div className="font-serif text-2xl font-bold text-[#602E55]">
                  80
                </div>
                <div className="mt-0.5 text-[11px] font-bold text-[#1F1915]">
                  about three weeks
                </div>
                <div className="text-[10px] text-gray-400">
                  Best value per liner
                </div>
              </div>
            </div>

            <p className="text-[11px] leading-tight text-gray-500">
              At a fresh liner every 3 to 4 hours, a full day is about four.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/shop/ovy-daily-panty-liners"
                className="inline-flex items-center gap-2 rounded-full bg-[#602E55] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#4A2040] sm:text-sm"
              >
                Shop liners <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={handleAddToCart}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#602E55] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#4A2040] sm:text-sm"
              >
                <Plus className="h-4 w-4" /> Add, from ₹269
              </button>
            </div>
          </div>

          {/* Right Column: Cotton Flower Image with Blue Beaded Frame */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative aspect-square w-full max-w-md">
              <div
                className="relative h-full w-full rounded-3xl border border-blue-200/50 p-4 shadow-sm sm:p-5"
                style={{ backgroundColor: "#E3F2FD" }}
              >
                {/* SVG Blue Beaded Frame Ring */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full p-1.5 sm:p-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="6"
                    width="calc(100% - 12px)"
                    height="calc(100% - 12px)"
                    rx="22"
                    fill="none"
                    stroke="#1E6091"
                    strokeWidth="6"
                    strokeDasharray="0 14"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Main Cotton Flower Image */}
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
                  <Image
                    src="/ovy/liner-cotton.jpg"
                    alt="Ovy Daily Liner Cotton Soft Top"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                  />
                </div>

                {/* Inset Overlay Photo (Feather Liner) - Bottom Left */}
                <div className="absolute bottom-3 left-3 z-10 max-w-[140px] rounded-2xl border border-blue-100/80 bg-white p-2 shadow-xl sm:bottom-5 sm:left-5 sm:max-w-[170px] sm:p-2.5">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-blue-50">
                    <Image
                      src="/ovy/liner-feather.jpg"
                      alt="Ultra-thin feather feel liner"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
