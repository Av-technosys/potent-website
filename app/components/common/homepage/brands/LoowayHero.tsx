"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import { getOvyVariantPrice, getOvyVariants } from "./ovyProductPricing";

interface ProductDetails {
  name?: string | null;
  bannerImage?: string | null;
}

interface HeroCard {
  slug: string;
  href: string;
  label: string;
  fallbackImage: string;
  image: string;
  price: number;
}

const HERO_CARD_CONFIG = [
  {
    slug: "looway-toilet-seat-covers",
    href: "/product-detail/looway-toilet-seat-covers",
    label: "Seat covers",
    fallbackImage: "/products/seatcovers.jpg",
  },
  {
    slug: "looway-pee-funnel",
    href: "/product-detail/looway-pee-funnel",
    label: "Pee funnel",
    fallbackImage: "/products/funnel.jpg",
  },
  {
    slug: "looway-pee-puke",
    href: "/product-detail/looway-pee-puke",
    label: "Pee and puke bags",
    fallbackImage: "/products/pukebags.jpg",
  },
] as const;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : "";
}

function getHeroCard(
  config: (typeof HERO_CARD_CONFIG)[number],
  product: ProductDetails | null,
): HeroCard {
  const variants = getOvyVariants(product);
  const firstVariant = variants[0];
  const variantPrices = variants
    .map(getOvyVariantPrice)
    .filter((price) => price > 0);
  const mediaImage = firstVariant?.bannerImage || firstVariant?.image;

  return {
    ...config,
    label: cleanText(product?.name) || config.label,
    image: getImageUrl(
      mediaImage || product?.bannerImage || config.fallbackImage,
    ),
    price: variantPrices.length ? Math.min(...variantPrices) : 0,
  };
}

export function LoowayHero({
  productsBySlug,
}: {
  productsBySlug: Record<string, ProductDetails | null>;
}) {
  const [seatCovers, funnel, pukeBags] = HERO_CARD_CONFIG.map((config) =>
    getHeroCard(config, productsBySlug[config.slug]),
  );

  const scrollToShop = () => {
    const shopEl = document.getElementById("looway-shop-section");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#EAF7F8] pt-8 pb-10 sm:pt-14 sm:pb-16"
      style={{
        background:
          "radial-gradient(circle at 88% 12%, rgba(246, 211, 83, 0.45) 0%, rgba(246, 211, 83, 0.18) 38%, rgba(234, 247, 248, 0) 70%), #EAF7F8",
      }}
    >
      {/* Top-Right Soft Yellow Glow Overlay */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[450px] w-[450px] rounded-full bg-[#F6D353]/5 blur-3xl lg:h-[650px] lg:w-[650px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Text & Actions (Order 2 on Mobile, Order 1 on Desktop) */}
          <div className="order-2 flex flex-col text-left lg:order-1 lg:col-span-6">
            {/* Kicker Badge */}
            <div>
              <span className="mb-4 inline-block rounded-full border border-teal-100 bg-white/90 px-3.5 py-1 text-[10px] font-bold tracking-widest text-[#0B6E7D] uppercase shadow-2xs sm:text-xs">
                LOOWAY BY POTENT HYGIENE
              </span>
            </div>

            <h1
              className="looway-hero-headline mb-3 text-[42px] leading-[42.84px] font-semibold sm:text-[56px] sm:leading-[57.12px] lg:text-[70px] lg:leading-[71.4px]"
              style={{
                fontFamily:
                  '"Rupee", var(--font-fredoka), "Fredoka", "Fredoka Fallback", sans-serif',
              }}
            >
              <span className="block text-[#0F6DA6]">Filthy seat?</span>
              <span className="block text-[#C02670]">Squat toilet?</span>
              <span className="block text-[#1E5E41]">No toilet at all?</span>
              <span className="mt-2.5 inline-block -rotate-[1.5deg] transform rounded-xl sm:rounded-2xl bg-[#F6D353] px-3.5 py-1.5 sm:px-5 sm:py-2 text-[#004851] shadow-2xs">
                <span className="block">There’s a</span>
                <span className="block">Looway for that.</span>
              </span>
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="my-4 max-w-xl text-xs leading-relaxed font-normal text-[#5C7275] sm:text-base">
              A reusable stand-to-pee funnel, paper seat covers you can actually
              sit on, and a pee and puke bag that turns liquid to gel in about
              60 seconds. All three fit in a handbag.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToShop}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0B6E7D] px-7 py-3 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#085561] sm:text-sm"
              >
                <span>Shop the range</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/looway#shop-by-trip"
                onClick={(e) => {
                  const el = document.getElementById("shop-by-trip");
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center rounded-full border border-[#0B6E7D] bg-white/70 px-7 py-3 text-xs font-semibold text-[#0B6E7D] shadow-2xs transition-all hover:bg-white sm:text-sm"
              >
                Where are you going?
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#0B6E7D]">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 stroke-[2.5] text-[#0B6E7D]" />
                <span>Ships within 24 hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 stroke-[2.5] text-[#0B6E7D]" />
                <span>Free delivery over ₹499</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 stroke-[2.5] text-[#0B6E7D]" />
                <span>Damaged or wrong? Replaced free</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Overlapping Product Cards (Order 1 on Mobile, Order 2 on Desktop) */}
          <div className="order-1 flex items-center justify-center pt-2 pb-2 lg:order-2 lg:col-span-6 lg:py-0">
            <div className="relative flex w-full items-center justify-center gap-1 px-1 sm:gap-0 sm:px-0">
              {/* Card 1: Seat Covers (Left Tilted) */}
              <Link
                href={seatCovers.href}
                aria-label="Shop Looway disposable toilet seat covers"
                className="group/card relative z-10 block w-[32%] shrink-0 -rotate-3 transform cursor-pointer transition-all duration-300 ease-out hover:z-40 hover:scale-110 hover:rotate-0 sm:-mr-12 sm:w-56 lg:-mr-16 lg:w-60 lg:-rotate-12"
              >
                <div
                  className="relative overflow-hidden rounded-[1.6rem] p-2 shadow-xl transition-all duration-300 sm:rounded-[2.2rem] sm:p-4"
                  style={{ backgroundColor: "#F6D353" }}
                >
                  {/* Beaded Border Ring */}
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full p-0.5 sm:p-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="calc(100% - 6px)"
                      height="calc(100% - 6px)"
                      rx="22"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeDasharray="0 14"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                    <Image
                      src={seatCovers.image}
                      alt={seatCovers.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 768px) 150px, 320px"
                    />
                  </div>
                </div>

                <div className="relative z-30 -mt-3.5 text-center sm:-mt-5">
                  <div className="inline-block rounded-xl border border-gray-100/80 bg-white px-2 py-1 shadow-md transition-transform group-hover/card:scale-105 sm:rounded-2xl sm:px-5 sm:py-2.5">
                    <div className="text-[9px] font-bold tracking-tight text-gray-500 sm:text-xs">
                      {seatCovers.label}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-tight font-extrabold text-[#1F1915] sm:text-base">
                      {seatCovers.price > 0
                        ? `from ₹${seatCovers.price}`
                        : "View product"}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 2: Pee Funnel (Center Featured Card) */}
              <Link
                href={funnel.href}
                aria-label="Shop Looway pee funnel"
                className="group/card relative z-20 -mt-4 block w-[36%] shrink-0 scale-105 transform cursor-pointer transition-all duration-300 ease-out hover:z-40 hover:scale-[1.15] hover:rotate-0 sm:-mt-20 sm:w-64 lg:w-60"
              >
                <div
                  className="relative overflow-hidden rounded-[1.8rem] p-2.5 shadow-2xl transition-all duration-300 sm:rounded-[2.5rem] sm:p-5"
                  style={{ backgroundColor: "#C02670" }}
                >
                  {/* Beaded Border Ring */}
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full p-1 sm:p-1.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="calc(100% - 6px)"
                      height="calc(100% - 6px)"
                      rx="26"
                      fill="none"
                      stroke="#F6D353"
                      strokeWidth="6"
                      strokeDasharray="0 16"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                    <Image
                      src={funnel.image}
                      alt={funnel.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 768px) 180px, 400px"
                      priority
                    />
                  </div>
                </div>

                <div className="relative z-30 -mt-4 text-center sm:-mt-6">
                  <div className="inline-block rounded-xl border border-pink-100 bg-white px-2.5 py-1 shadow-lg transition-transform group-hover/card:scale-105 sm:rounded-2xl sm:px-7 sm:py-3">
                    <div className="text-[9.5px] font-bold tracking-tight text-gray-500 sm:text-sm">
                      {funnel.label}
                    </div>
                    <div className="mt-0.5 text-xs leading-tight font-extrabold text-[#1F1915] sm:text-xl">
                      {funnel.price > 0
                        ? `from ₹${funnel.price}`
                        : "View product"}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 3: Pee and Puke Bags (Right Tilted) */}
              <Link
                href={pukeBags.href}
                aria-label="Shop Looway pee and puke bags"
                className="group/card relative z-10 block w-[32%] shrink-0 rotate-3 transform cursor-pointer transition-all duration-300 ease-out hover:z-40 hover:scale-110 hover:rotate-0 sm:-ml-12 sm:w-56 lg:-ml-16 lg:w-60 lg:rotate-12"
              >
                <div
                  className="relative overflow-hidden rounded-[1.6rem] p-2 shadow-xl transition-all duration-300 sm:rounded-[2.2rem] sm:p-4"
                  style={{ backgroundColor: "#1E5E41" }}
                >
                  {/* Beaded Border Ring */}
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full p-0.5 sm:p-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="calc(100% - 6px)"
                      height="calc(100% - 6px)"
                      rx="22"
                      fill="none"
                      stroke="#F6D353"
                      strokeWidth="5"
                      strokeDasharray="0 14"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                    <Image
                      src={pukeBags.image}
                      alt={pukeBags.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      sizes="(max-width: 768px) 150px, 320px"
                    />
                  </div>
                </div>

                <div className="relative z-30 -mt-3.5 text-center sm:-mt-5">
                  <div className="inline-block rounded-xl border border-gray-100/80 bg-white px-2 py-1 shadow-md transition-transform group-hover/card:scale-105 sm:rounded-2xl sm:px-5 sm:py-2.5">
                    <div className="text-[9px] font-bold tracking-tight text-gray-500 sm:text-xs">
                      {pukeBags.label}
                    </div>
                    <div className="mt-0.5 text-[11px] leading-tight font-extrabold text-[#1F1915] sm:text-base">
                      {pukeBags.price > 0
                        ? `from ₹${pukeBags.price}`
                        : "View product"}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
