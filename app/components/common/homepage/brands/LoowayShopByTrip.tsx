"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
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

interface TripIncludedItem {
  title: string;
  subtitle: string;
  price: number;
  image: string;
  bgClass: string;
}

interface TripTabContent {
  tabKey: string;
  tabLabel: string;
  kicker: string;
  title: string;
  desc: string;
  image: string;
  items: TripIncludedItem[];
  totalPrice: number;
  builderLinkText: string;
}

const TRIP_DATA: TripTabContent[] = [
  {
    tabKey: "teerth",
    tabLabel: "Teerth Yatra",
    kicker: "TEERTH YATRA",
    title: "Let faith lead the way.",
    desc: "Covers for the dharamshala seat, a funnel for her at the squat pans on the route, and bags for the long bus ride. They tuck in beside the prasad and the water bottle.",
    image: "/yatra_mom_daughter.jpg",
    items: [
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Teerth Yatra kit in the builder →",
  },
  {
    tabKey: "roadtrip",
    tabLabel: "Road trip",
    kicker: "ROAD TRIP",
    title: "Stop at any dhaba. Skip the regret.",
    desc: "Dhaba toilets don't care about your hygiene. Keep seat covers in the glovebox and a funnel in her sling bag for highway stops.",
    image: "/looway/scen-seat.jpg",
    items: [
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Road Trip kit in the builder →",
  },
  {
    tabKey: "train",
    tabLabel: "Train or bus",
    kicker: "TRAIN OR BUS",
    title: "Long journeys, zero hesitation.",
    desc: "Swaying train toilets and cramped bus stops are no match for stand-to-pee funnels and disposable seat covers.",
    image: "/looway/scen-funnel.jpg",
    items: [
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Train & Bus kit in the builder →",
  },
  {
    tabKey: "trek",
    tabLabel: "Trek or camp",
    kicker: "TREK OR CAMP",
    title: "Wild trails, clean habits.",
    desc: "No restroom for miles? Pee & puke bags instantly gel liquid waste so you leave no trace on nature trails.",
    image: "/looway/scen-bags-pee.jpg",
    items: [
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Trek & Camp kit in the builder →",
  },
  {
    tabKey: "pregnancy",
    tabLabel: "Pregnancy",
    kicker: "PREGNANCY",
    title: "Comfort for two, wherever you go.",
    desc: "Squatting or hovering with a baby bump is painful on knees. Stand comfortably with a funnel and sit safely with seat covers.",
    image: "/looway/scen-bags-preg.jpg",
    items: [
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Pregnancy Care kit in the builder →",
  },
  {
    tabKey: "kids",
    tabLabel: "With little ones",
    kicker: "WITH LITTLE ONES",
    title: "No more public restroom panic.",
    desc: "Kids touch everything in public toilets. Protect them from germs with instant paper seat covers and gel bags.",
    image: "/looway/lw-kid.jpg",
    items: [
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Kids & Family kit in the builder →",
  },
  {
    tabKey: "parents",
    tabLabel: "Travelling with parents",
    kicker: "TRAVELLING WITH PARENTS",
    title: "Ease for aging knees and joints.",
    desc: "Help elders avoid painful squat toilets and unsafe public seats during family pilgrimages and travel.",
    image: "/looway/lw-elder.jpg",
    items: [
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Parents Travel kit in the builder →",
  },
  {
    tabKey: "daily",
    tabLabel: "School, college, office",
    kicker: "SCHOOL, COLLEGE, OFFICE",
    title: "Daily handbag essential.",
    desc: "Clean protection for daily shared toilets at work, campus, or coaching centers. Slip a pack right into your tote.",
    image: "/looway/lw-school.jpg",
    items: [
      {
        title: "Disposable Toilet Seat Covers",
        subtitle: "2-pack, 50 covers",
        price: 549,
        image: "/products/seatcovers.jpg",
        bgClass: "bg-[#E8F5FD]",
      },
      {
        title: "Pee Funnel",
        subtitle: "Pack of 1",
        price: 299,
        image: "/products/funnel.jpg",
        bgClass: "bg-[#FDEBF3]",
      },
      {
        title: "Pee and Puke Bags",
        subtitle: "Pack of 10",
        price: 549,
        image: "/products/pukebags.jpg",
        bgClass: "bg-[#EAF3EE]",
      },
    ],
    totalPrice: 1397,
    builderLinkText: "Or start from the Daily Essential kit in the builder →",
  },
];

export function LoowayShopByTrip({
  productsBySlug,
}: {
  productsBySlug: Record<string, ProductDetails | null>;
}) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const currentTrip = TRIP_DATA[activeTabIdx];
  const currentItems = currentTrip.items.map((item) => {
    const slug = item.title.includes("Seat")
      ? "looway-toilet-seat-covers"
      : item.title.includes("Funnel")
        ? "looway-pee-funnel"
        : "looway-pee-puke";
    const product = productsBySlug[slug];
    const variant = getOvyVariants(product)[0];
    const variantId = getOvyVariantId(variant);
    const media = product?.productMediaRes?.find(
      (entry) => entry?.productVariantId === variantId,
    );

    return {
      ...item,
      slug,
      productId: getOvyProductId(product),
      productVariantId: variantId,
      sku: variant?.sku,
      title: product?.name || item.title,
      subtitle: getOvyVariantLabel(variant),
      price: getOvyVariantPrice(variant),
      image: getImageUrl(
        variant?.bannerImage ||
          variant?.image ||
          media?.mediaURL ||
          product?.bannerImage ||
          item.image,
      ),
    };
  });
  const currentTotal = currentItems.reduce(
    (total, item) => total + item.price,
    0,
  );

  const handleAddSet = async () => {
    if (
      currentItems.some(
        (item) => !item.productId || !item.productVariantId || item.price <= 0,
      )
    ) {
      toast.error("One or more trip products are unavailable right now.");
      return;
    }

    setAdding(true);
    try {
      for (const item of currentItems) {
        const result = await addToCart({
          productId: item.productId,
          productVariantId: item.productVariantId,
          sku: item.sku,
          slug: item.slug,
          title: `${item.title} - ${item.subtitle}`,
          image: item.image,
          price: item.price,
          quantity: 1,
          isQuantityChangable: true,
        });

        if (result === false) return;
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed adding Looway trip set to cart:", error);
      toast.error("Unable to add this trip set. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="w-full overflow-hidden bg-[#FAF5E8] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <span className="mb-2 block text-[11px] font-bold tracking-widest text-[#0B6E7D] uppercase">
            WHERE ARE YOU GOING?
          </span>
          <h2 className="font-serif text-[27px] leading-[29.16px] font-semibold text-[#1A150F] sm:text-[46px] sm:leading-[49.68px]">
            Tell us the trip. We’ll pack the toilets.
          </h2>
          <p className="mt-3 text-xs leading-relaxed font-normal text-[#5C7275] sm:text-sm">
            Pick where you are headed and add the whole set in one tap, or open
            the matching Yatra Kit and change what is inside.
          </p>
        </div>

        {/* 8 Horizontal Trip Pills Bar */}
        <div className="scrollbar-none mx-auto mb-8 flex max-w-5xl items-center justify-start gap-2 overflow-x-auto px-1 py-2 sm:justify-center">
          {TRIP_DATA.map((tab, idx) => {
            const isActive = activeTabIdx === idx;
            return (
              <button
                key={tab.tabKey}
                onClick={() => setActiveTabIdx(idx)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-[#0B6E7D] text-white shadow-xs"
                    : "border border-teal-200/80 bg-white text-[#0B6E7D] hover:bg-teal-50"
                }`}
              >
                {tab.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Main Trip Card Display Container */}
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200/80 bg-white p-5 shadow-md transition-all sm:p-8">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Trip Image */}
            <div className="flex justify-center lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-teal-50 shadow-sm sm:aspect-square sm:rounded-3xl">
                <Image
                  src={currentTrip.image}
                  alt={currentTrip.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Details, 3 Included Item Rows, Price & Button */}
            <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
              {/* Trip Kicker, Title & Desc */}
              <div>
                <span className="mb-1 block text-[10px] font-bold tracking-widest text-[#0B6E7D] uppercase">
                  {currentTrip.kicker}
                </span>
                <h3 className="font-serif text-2xl leading-snug font-bold text-[#1F1915] sm:text-3xl">
                  {currentTrip.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed font-normal text-[#5C7275] sm:text-sm">
                  {currentTrip.desc}
                </p>
              </div>

              {/* 3 Included Items Rows */}
              <div className="space-y-2 pt-1">
                {currentItems.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className={`${item.bgClass} flex items-center justify-between rounded-2xl p-3 transition-transform`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-xl border border-gray-100 bg-white p-1 shadow-2xs">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs leading-tight font-bold text-[#1F1915] sm:text-sm">
                          {item.title}
                        </h4>
                        <div className="text-[10px] font-medium text-gray-500">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2 text-xs font-bold text-[#1F1915] sm:text-sm">
                      {item.price > 0 ? `₹${item.price}` : "Unavailable"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Price, Action Button & Link */}
              <div className="flex flex-col justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center">
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    SET TOTAL
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-bold text-[#1F1915]">
                      {currentTotal > 0 ? `₹${currentTotal}` : "Unavailable"}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Free delivery
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1.5 sm:items-end">
                  <button
                    onClick={handleAddSet}
                    disabled={
                      adding ||
                      currentItems.some(
                        (item) =>
                          !item.productId ||
                          !item.productVariantId ||
                          item.price <= 0,
                      )
                    }
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#0B6E7D] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#085561] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>
                      {adding ? "Adding..." : added ? "Added" : "Add this set"}
                    </span>
                  </button>

                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B6E7D] hover:underline"
                  >
                    <span>{currentTrip.builderLinkText}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
