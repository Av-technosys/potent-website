"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Plus } from "lucide-react";
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
} from "./ovyProductPricing";

interface ProductDetails {
  id?: string;
  _id?: string;
  name?: string | null;
  bannerImage?: string | null;
}

interface StepItem {
  num: string;
  text: string;
}

const STEPS: StepItem[] = [
  {
    num: "1",
    text: "In the shower, water off",
  },
  {
    num: "2",
    text: "Over the toilet, undressed",
  },
  {
    num: "3",
    text: "Underwear moved aside",
  },
  {
    num: "4",
    text: "Fully dressed",
  },
];

const SEAL_TIPS = [
  "Aim further back",
  "Press the rim snug",
  "Ease the stream in gently",
];

export function LoowayFunnelGuideSection({
  productsBySlug,
}: {
  productsBySlug: Record<string, ProductDetails | null>;
}) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const product = productsBySlug["looway-pee-funnel"];
  const variant = getOvyVariants(product)[0];
  const price = getOvyVariantPrice(variant);

  const handleAddFunnel = async () => {
    const productId = getOvyProductId(product);
    const productVariantId = getOvyVariantId(variant);

    if (!productId || !productVariantId || price <= 0) {
      toast.error("The funnel variant is unavailable right now.");
      return;
    }

    setAdding(true);
    try {
      const result = await addToCart({
        productId,
        productVariantId,
        sku: variant?.sku,
        slug: "looway-pee-funnel",
        title: `${product?.name || "Looway Pee Funnel"} - ${getOvyVariantLabel(variant)}`,
        image: getImageUrl(
          variant?.bannerImage || variant?.image || product?.bannerImage,
        ),
        price,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (result === false) return;
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed adding Looway funnel to cart:", error);
      toast.error("Unable to add the funnel to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="w-full overflow-hidden bg-[#FDF0F5] pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Photo Card (Hidden on Mobile) */}
          <div className="hidden justify-center lg:col-span-5 lg:flex">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-md">
              <Image
                src="/looway/scen-funnel.jpg"
                alt="Woman using Looway pee funnel"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
              />
            </div>
          </div>

          {/* Right Column: Text Content & Steps */}
          <div className="lg:col-span-7">
            {/* Kicker */}
            <span className="mb-2 block text-[11px] font-bold tracking-widest text-[#C02670] uppercase">
              NEW TO THE FUNNEL?
            </span>

            {/* Headline */}
            <h2 className="mb-3 font-serif text-[27px] leading-[29.16px] font-semibold text-[#1A150F] sm:text-[46px] sm:leading-[49.68px]">
              Practise at home, then take it anywhere.
            </h2>

            {/* Description */}
            <p className="mb-8 max-w-xl text-xs leading-relaxed font-normal text-[#6B5A63] sm:text-base">
              Give it two to five tries in private. A little spill while you
              learn is normal, and it gets easier each time.
            </p>

            {/* 4 Step Cards Grid */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="flex items-center gap-2.5 rounded-2xl border border-pink-100/60 bg-white p-3 shadow-2xs transition-shadow hover:shadow-xs sm:p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C02670] text-xs font-bold text-white">
                    {step.num}
                  </div>
                  <h3 className="text-[11px] leading-snug font-bold text-[#1F1915] sm:text-xs">
                    {step.text}
                  </h3>
                </div>
              ))}
            </div>

            {/* Sub-section: The three things that make the seal */}
            <div className="mb-8">
              <h4 className="mb-3 text-xs font-bold text-[#1F1915] sm:text-sm">
                The three things that make the seal
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {SEAL_TIPS.map((tip, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-bold text-[#C02670] shadow-2xs"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3] text-[#C02670]" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAddFunnel}
                disabled={adding || price <= 0}
                className="inline-flex items-center gap-2 rounded-full bg-[#C02670] px-7 py-3.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#a01f5d] sm:px-8 sm:text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {adding
                    ? "Adding..."
                    : added
                      ? "Added"
                      : `Add the funnel${price > 0 ? `, ₹${price}` : ""}`}
                </span>
              </button>

              <Link
                href="/product-detail/looway-pee-funnel?scroll=how-it-works#how-it-works"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#006573] hover:underline sm:text-sm"
              >
                <span>Read the full guide</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
