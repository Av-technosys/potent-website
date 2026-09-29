"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  productMediaRes?: {
    productVariantId?: string | null;
    mediaURL?: string | null;
  }[];
}

interface HowItWorksStep {
  num: string;
  title: string;
  desc: string;
}

interface HowItWorksTabData {
  id: string;
  tabLabel: string;
  tabColorClass: string;
  badgeBgColor: string;
  image: string;
  steps: HowItWorksStep[];
  yellowNote: string;
  buttonLabel: string;
  linkText: string;
  linkHref: string;
  productSlug: string;
}

const HOW_IT_WORKS_DATA: HowItWorksTabData[] = [
  {
    id: "funnel",
    tabLabel: "Pee funnel",
    tabColorClass: "bg-[#C02670] text-white",
    badgeBgColor: "#C02670",
    image: "/looway/lw-wash.jpg",
    steps: [
      {
        num: "1",
        title: "Undress just enough",
        desc: "Trousers to mid-thigh, or lift your skirt and move your underwear aside.",
      },
      {
        num: "2",
        title: "Seal it",
        desc: "Cover the whole area with the wide opening, its back edge about a thumb’s width behind where you pee (not forward), and press the rim snug.",
      },
      {
        num: "3",
        title: "Tilt and go",
        desc: "Spout down and away. Start slowly so the seal settles, then relax.",
      },
      {
        num: "4",
        title: "Rinse and pouch",
        desc: "Slide forward for the last drops, rinse or wipe, and back into its cotton pouch.",
      },
    ],
    yellowNote:
      "Works over a Western seat, an Indian squat pan, outdoors, or into a wide bottle or an open Looway bag in the car.",
    buttonLabel: "Add the funnel",
    linkText: "Shop the funnel",
    linkHref: "/shop/looway-pee-funnel",
    productSlug: "looway-pee-funnel",
  },
  {
    id: "seatcovers",
    tabLabel: "Seat covers",
    tabColorClass: "bg-[#0B6E7D] text-white",
    badgeBgColor: "#0B6E7D",
    image: "/looway/lw-howto-seat.jpg",
    steps: [
      {
        num: "1",
        title: "Pull one sheet",
        desc: "Unfold one paper cover from the pack with dry hands.",
      },
      {
        num: "2",
        title: "Pop the center",
        desc: "Break the three small paper tabs so the middle flap hangs down into the bowl.",
      },
      {
        num: "3",
        title: "Place and sit",
        desc: "Lay the cover over the seat with the flap towards the front. Sit normally and relax.",
      },
      {
        num: "4",
        title: "Bin, never flush",
        desc: "After use, fold the cover inward and toss it in the dustbin.",
      },
    ],
    yellowNote:
      "Fits any Western seat shape: round, oval, square or elongated. Water-resistant paper protects from wet seats.",
    buttonLabel: "Add seat covers",
    linkText: "Shop seat covers",
    linkHref: "/shop/looway-toilet-seat-covers",
    productSlug: "looway-toilet-seat-covers",
  },
  {
    id: "pukebags",
    tabLabel: "Pee and puke bags",
    tabColorClass: "bg-[#1E5E41] text-white",
    badgeBgColor: "#1E5E41",
    image: "/looway/lw-howto-bags.jpg",
    steps: [
      {
        num: "1",
        title: "Open the bag",
        desc: "Unseal the ziplock top and expand the rigid foam opening.",
      },
      {
        num: "2",
        title: "Position securely",
        desc: "Place the ergonomic opening firmly against your body or mouth.",
      },
      {
        num: "3",
        title: "Use and wait",
        desc: "Relieve yourself or vomit into the bag. The inner pouch turns liquid into odorless gel in ~60s.",
      },
      {
        num: "4",
        title: "Zip and bin",
        desc: "Press the ziplock seal tightly closed and dispose of it in any trash bin.",
      },
    ],
    yellowNote:
      "Gels liquid in about 60 seconds. Odor-free, leak-proof, and discreet to dispose of in any dustbin.",
    buttonLabel: "Add bags",
    linkText: "Shop bags",
    linkHref: "/shop/looway-pee-puke",
    productSlug: "looway-pee-puke",
  },
];

export function LoowayHowItWorks({
  productsBySlug,
}: {
  productsBySlug: Record<string, ProductDetails | null>;
}) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const currentTab = HOW_IT_WORKS_DATA[activeTabIdx];
  const currentProduct = productsBySlug[currentTab.productSlug];
  const currentVariant = getOvyVariants(currentProduct)[0];
  const currentPrice = getOvyVariantPrice(currentVariant);

  const getProductImage = () => {
    const variantId = getOvyVariantId(currentVariant);
    const media = currentProduct?.productMediaRes?.find(
      (item) => item?.productVariantId === variantId,
    );

    return getImageUrl(
      currentVariant?.bannerImage ||
        currentVariant?.image ||
        media?.mediaURL ||
        currentProduct?.bannerImage ||
        "/placeholder.jpg",
    );
  };

  const handleAddProduct = async () => {
    const productId = getOvyProductId(currentProduct);
    const productVariantId = getOvyVariantId(currentVariant);

    if (!productId || !productVariantId || currentPrice <= 0) {
      toast.error("This product variant is unavailable right now.");
      return;
    }

    setAdding(true);
    try {
      const result = await addToCart({
        productId,
        productVariantId,
        sku: currentVariant?.sku,
        slug: currentTab.productSlug,
        title: `${currentProduct?.name || currentTab.tabLabel} - ${getOvyVariantLabel(currentVariant)}`,
        image: getProductImage(),
        price: currentPrice,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (result === false) return;
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed adding Looway product to cart:", error);
      toast.error("Unable to add this product to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="w-full overflow-hidden bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <span className="mb-2 block text-[11px] font-bold tracking-widest text-[#0B6E7D] uppercase">
            HOW IT WORKS
          </span>
          <h2 className="font-serif text-[27px] leading-[29.16px] font-semibold text-[#1A150F] sm:text-[46px] sm:leading-[49.68px]">
            Four steps each. No learning curve on two of them.
          </h2>
        </div>

        {/* 3 Interactive Tab Switcher Capsule */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex w-full max-w-xl items-center justify-between gap-1.5 rounded-full bg-[#E5F3F5] p-1.5 shadow-2xs">
            {HOW_IT_WORKS_DATA.map((tab, idx) => {
              const isActive = activeTabIdx === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`flex-1 cursor-pointer rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:px-6 sm:text-sm ${
                    isActive
                      ? tab.tabColorClass + " shadow-xs"
                      : "text-[#0B6E7D] hover:bg-white/60"
                  }`}
                >
                  {tab.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout: Left Image + Right 4 Steps & Note */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Product Usage Photo */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-lg">
              <Image
                src={currentTab.image}
                alt={currentTab.tabLabel}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
                priority
              />
            </div>
          </div>

          {/* Right Column: 4 Steps, Yellow Note & Action Buttons */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-7">
            {/* 4 Numbered Steps List */}
            <div className="space-y-4">
              {currentTab.steps.map((step) => (
                <div key={step.num} className="flex items-start gap-3.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-2xs sm:h-9 sm:w-9 sm:text-base"
                    style={{ backgroundColor: currentTab.badgeBgColor }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-sm leading-snug font-bold text-[#1F1915] sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed font-normal text-[#5C7275] sm:text-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Yellow Highlighted Callout Box */}
            <div className="rounded-2xl border border-yellow-200/60 bg-[#FFF9D6] p-4 text-xs leading-relaxed font-normal text-[#6B5E47] sm:text-sm">
              {currentTab.yellowNote}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleAddProduct}
                disabled={adding || currentPrice <= 0}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0B6E7D] px-6 py-3 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#085561] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <span>
                  {adding
                    ? "Adding..."
                    : added
                      ? "Added"
                      : `${currentTab.buttonLabel}${currentPrice > 0 ? `, ₹${currentPrice}` : ""}`}
                </span>
              </button>

              <Link
                href={currentTab.linkHref}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#0B6E7D] hover:underline sm:text-sm"
              >
                <span>{currentTab.linkText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
