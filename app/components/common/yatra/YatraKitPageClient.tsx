/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { InstagramFeed } from "@/app/components/common/homepage/InstaFeed";
import {
  Activity,
  Baby,
  Briefcase,
  Bus,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Lightbulb,
  MapPin,
  Minus,
  Music,
  Plane,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart as addToCartAction } from "@/store/cartActions";
import {
  getYatraKitDistinctItemCount,
  getYatraKitTotal,
  normalizeYatraKitRecipe,
  type YatraKitItemKey,
  type YatraKitRecipe,
  type YatraMappedProduct,
} from "@/lib/yatraKit";

const IconMap: Record<string, React.ComponentType<any>> = {
  plane: Plane,
  car: Car,
  drive: Car,
  heart: Heart,
  girls: Users,
  boys: Users,
  temple: MapPin,
  preg: Baby,
  baby: Baby,
  access: Briefcase,
  mountain: Compass,
  cross: Activity,
};

const StopIconMap: Record<string, React.ComponentType<any>> = {
  plane: Plane,
  car: Car,
  drive: Car,
  bus: Bus,
  loo: ShieldCheck,
  temple: MapPin,
  mountain: Compass,
  music: Music,
  cross: Activity,
  baby: Baby,
  preg: Baby,
  heart: Heart,
  bed: Sparkles,
  girls: Users,
  boys: Users,
  access: Briefcase,
};

type Props = {
  content: any;
  mappedProducts: Partial<Record<YatraKitItemKey, YatraMappedProduct>>;
};

const REVIEW_FILTERS = [
  { id: "all", label: "All reviews" },
  { id: "5star", label: "5★" },
  { id: "4star", label: "4★" },
  { id: "pilgrimage", label: "Pilgrimage" },
  { id: "roadtrips", label: "Road trips" },
  { id: "flights", label: "Flights" },
  { id: "families", label: "Families" },
  { id: "periods", label: "Periods" },
  { id: "pregnancy", label: "Pregnancy" },
  { id: "seniors", label: "Seniors" },
  { id: "treks", label: "Treks" },
  { id: "hygiene", label: "Hygiene-cautious" },
];

function useColumnsCount() {
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setCols(2);
      } else if (w < 1024) {
        setCols(3);
      } else {
        setCols(4);
      }
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  return cols;
}

export default function YatraKitPageClient({ content, mappedProducts }: Props) {
  const [selectedKitId, setSelectedKitId] = useState<string>("complete");
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [activeReviewFilter, setActiveReviewFilter] = useState("all");
  const [activeNavId, setActiveNavId] = useState("choose-kit");

  const stepperRef = React.useRef<HTMLDivElement>(null);
  const reviewsRef = React.useRef<HTMLDivElement>(null);

  const [showNudge, setShowNudge] = useState(false);

  // Point 1: Always scroll to top on initial page mount unless hash present
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Point 3: Timed nudge toast popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNudge(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Stepper node active scroll inside horizontal track only (prevents full window scroll)
  useEffect(() => {
    if (stepperRef.current) {
      const activeNode = stepperRef.current.children[
        activeStopIndex
      ] as HTMLElement;
      if (activeNode) {
        const container = stepperRef.current;
        const nodeLeft = activeNode.offsetLeft;
        const nodeWidth = activeNode.offsetWidth;
        const containerWidth = container.offsetWidth;
        container.scrollTo({
          left: nodeLeft - containerWidth / 2 + nodeWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeStopIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "choose-kit",
        "every-toilet",
        "where-to-use",
        "reviews",
      ];
      const scrollPos = window.scrollY + 250;
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNavId(sec);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredReviews = useMemo(() => {
    if (!content.REVIEWS) return [];
    if (activeReviewFilter === "all") return content.REVIEWS;
    if (activeReviewFilter === "5star")
      return content.REVIEWS.filter((r: any) => r.stars === 5);
    if (activeReviewFilter === "4star")
      return content.REVIEWS.filter((r: any) => r.stars === 4);
    if (activeReviewFilter === "pilgrimage")
      return content.REVIEWS.filter(
        (r: any) =>
          r.group === "pilgrims" ||
          (r.quote && r.quote.toLowerCase().includes("yatra")) ||
          (r.quote && r.quote.toLowerCase().includes("pilgrim")) ||
          (r.stage && r.stage.toLowerCase().includes("yatra")),
      );
    if (activeReviewFilter === "roadtrips")
      return content.REVIEWS.filter(
        (r: any) =>
          r.group === "travellers" ||
          (r.quote && r.quote.toLowerCase().includes("road")) ||
          (r.quote && r.quote.toLowerCase().includes("drive")) ||
          (r.stage && r.stage.toLowerCase().includes("tripper")),
      );
    if (activeReviewFilter === "flights")
      return content.REVIEWS.filter(
        (r: any) =>
          (r.quote && r.quote.toLowerCase().includes("flight")) ||
          (r.quote && r.quote.toLowerCase().includes("airport")),
      );
    if (activeReviewFilter === "pregnancy")
      return content.REVIEWS.filter(
        (r: any) =>
          r.group === "expecting" ||
          (r.quote && r.quote.toLowerCase().includes("pregnant")) ||
          (r.stage && r.stage.toLowerCase().includes("mum")),
      );
    if (activeReviewFilter === "seniors")
      return content.REVIEWS.filter(
        (r: any) =>
          r.group === "seniors" ||
          r.group === "jointpain" ||
          (r.quote && r.quote.toLowerCase().includes("knee")),
      );
    if (activeReviewFilter === "hygiene")
      return content.REVIEWS.filter(
        (r: any) =>
          r.group === "hygiene" ||
          (r.quote && r.quote.toLowerCase().includes("uti")) ||
          (r.stage && r.stage.toLowerCase().includes("uti")),
      );
    return content.REVIEWS;
  }, [content.REVIEWS, activeReviewFilter]);

  const [quantities, setQuantities] = useState<Record<string, YatraKitRecipe>>(
    () => {
      const initial: Record<string, YatraKitRecipe> = {};
      content.TIERS.forEach((tier: any) => {
        initial[tier.id] = normalizeYatraKitRecipe(tier.base);
      });
      return initial;
    },
  );
  const [adding, setAdding] = useState(false);

  const cols = useColumnsCount();

  const selectedIndex = useMemo(() => {
    return content.TIERS.findIndex((tier: any) => tier.id === selectedKitId);
  }, [content.TIERS, selectedKitId]);

  const rowEndIndex = useMemo(() => {
    if (selectedIndex === -1) return -1;
    const total = content.TIERS.length;
    const rowEnd = (Math.floor(selectedIndex / cols) + 1) * cols - 1;
    return Math.min(rowEnd, total - 1);
  }, [selectedIndex, cols, content.TIERS.length]);

  const activeKit = content.TIERS.find(
    (tier: any) => tier.id === selectedKitId,
  );
  const activeRecipe = quantities[selectedKitId] || {};
  const activeTotal = getYatraKitTotal(activeRecipe, mappedProducts);
  const activeContents = Object.entries(activeRecipe)
    .filter(([, qty]) => Number(qty) > 0)
    .map(([key, qty]) => ({
      key: key as YatraKitItemKey,
      qty: Number(qty),
      product: mappedProducts[key as YatraKitItemKey],
    }));
  const missingItems = activeContents.filter((item) => !item.product);

  const extras = useMemo(() => {
    return content.CATALOG.filter((item: any) => {
      if (item.free) return false;
      if (item.id === "pads") {
        return (
          !activeRecipe["pads:l"] &&
          !activeRecipe["pads:xl"] &&
          !activeRecipe["pads:xlp"]
        );
      }
      if (item.id === "panty") {
        return !activeRecipe["panty:lxl"] && !activeRecipe["panty:xxl3xl"];
      }
      return !activeRecipe[item.id as YatraKitItemKey];
    });
  }, [activeRecipe, content.CATALOG]);

  const updateQty = (kitId: string, key: YatraKitItemKey, delta: number) => {
    setQuantities((prev) => {
      const current = prev[kitId] || {};
      const nextQty = Math.max(0, Number(current[key] || 0) + delta);
      return {
        ...prev,
        [kitId]: normalizeYatraKitRecipe({
          ...current,
          [key]: nextQty,
        }),
      };
    });
  };

  const resetKit = () => {
    if (!activeKit) return;
    setQuantities((prev) => ({
      ...prev,
      [activeKit.id]: normalizeYatraKitRecipe(activeKit.base),
    }));
    toast.success("Kit reset");
  };

  const addExtra = (item: any) => {
    const key =
      item.id === "pads"
        ? "pads:l"
        : item.id === "panty"
          ? "panty:lxl"
          : item.id;
    updateQty(selectedKitId, key as YatraKitItemKey, 1);
  };

  const addKitToCart = async () => {
    if (!activeKit) return;
    const recipe = normalizeYatraKitRecipe(activeRecipe);

    if (getYatraKitDistinctItemCount(recipe) < 2) {
      toast.error("Pick at least 2 different products for a kit.");
      return;
    }

    if (missingItems.length > 0) {
      toast.error("Some kit products are not mapped to DB variants yet.");
      return;
    }

    setAdding(true);
    try {
      for (const [key, qty] of Object.entries(recipe)) {
        const product = mappedProducts[key as YatraKitItemKey];
        if (!product || !qty) continue;

        await addToCartAction({
          productId: product.productId,
          productVariantId: product.productVariantId,
          sku: product.sku,
          slug: product.slug,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity: Number(qty),
          isQuantityChangable: true,
          purchaseType: "one_time",
          subscriptionType: null,
          isSubscribed: false,
        });
      }

      toast.success(`${activeKit.name} kit products added to cart`);
    } catch (error) {
      console.error(error);
      toast.error("Could not add this kit to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf7f0] text-[#2a2420]">
      {/* Top Strip */}
      <div className="h-3 w-full bg-[repeating-linear-gradient(90deg,#145C58_0px,#145C58_16px,#E8A33D_16px,#E8A33D_32px)]" />

      {/* Banner Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E7F6F5] via-[#EFF9F8] to-[#E2F3F1] py-10 text-[#145C58] lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Content */}
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-[#145C58] px-4 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase">
                LOOWAY · TRAVEL HYGIENE
              </span>

              <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-[#145C58] sm:text-5xl md:text-6xl">
                Looway Yatra Kit
              </h1>

              <p className="mt-3 text-base leading-snug font-bold text-[#145C58] sm:text-lg md:text-xl">
                One kit for every toilet you'll face on a trip — and everything
                for the mess in between.
              </p>

              {/* Reviews & Star Rating (Point 2: Scroll to #reviews) */}
              <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm">
                <div className="flex text-[#E8A33D]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#E8A33D] text-[#E8A33D]"
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    document
                      .getElementById("reviews")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="cursor-pointer text-left font-semibold text-[#145C58] hover:underline"
                >
                  <span className="underline decoration-dotted underline-offset-4">
                    4.8 out of 5
                  </span>{" "}
                  ·{" "}
                  <span className="underline decoration-dotted underline-offset-4">
                    96 verified reviews
                  </span>
                </button>
              </div>

              {/* Description Paragraph */}
              <p className="mt-4 text-xs leading-relaxed text-gray-700 sm:text-sm">
                Dirty Western seats, squat toilets you can't use, or no toilet
                at all — one kit handles every situation, and Ovy period care is
                there when you need it. Pick one of 11 ready-made kits, open it,
                and change exactly what's inside.{" "}
                <strong className="font-bold text-gray-900">
                  Every kit includes free intimate wipes.
                </strong>{" "}
                Buy once, for everyone.
              </p>

              {/* Bullet Highlights */}
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#145C58] sm:text-sm">
                <span>Buy once · no subscription</span>
                <span>11 ready-made kits</span>
                <span>Free intimate wipes</span>
              </div>

              {/* Action Button (Point 2: Scroll to #choose-kit) */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("choose-kit")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex transform cursor-pointer items-center gap-2 rounded-xl bg-[#145C58] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#0E4542]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Choose your kit
                </button>
              </div>

              {/* Dashed Sub-banner (Point 2: Scroll to #every-toilet) */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-[#145C58]/30 bg-[#D9F0EE] px-4 py-2.5 text-xs font-semibold text-[#145C58] sm:text-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#145C58] text-[11px] font-bold">
                  ?
                </div>
                <span>
                  Three toilets, one kit —{" "}
                  <button
                    onClick={() =>
                      document
                        .getElementById("every-toilet")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="cursor-pointer underline hover:text-[#0E4542]"
                  >
                    see how →
                  </button>
                </span>
              </div>
            </div>

            {/* Right Side Card Container */}
            <div className="flex flex-col items-center lg:items-end">
              <div className="w-full max-w-md rounded-[28px] border border-white/80 bg-white p-6 shadow-xl sm:p-7">
                <h2 className="mb-4 text-lg font-extrabold text-[#145C58] sm:text-xl">
                  Every toilet situation, covered
                </h2>

                {/* Scene Cards list */}
                <div className="space-y-3">
                  {content.SCENES.map((scene: any) => (
                    <div
                      key={scene.t}
                      className="flex items-start gap-3.5 rounded-2xl border border-[#F0ECE1] bg-[#F8F6F0] p-3.5 sm:p-4"
                    >
                      {/* Custom Icon based on art */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE8DC] text-[#145C58]">
                        {scene.art === "seat" ? (
                          <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <ellipse cx="12" cy="12" rx="7" ry="9" />
                            <ellipse cx="12" cy="12" rx="3.5" ry="5" />
                          </svg>
                        ) : scene.art === "funnel" ? (
                          <svg
                            className="h-6 w-6 fill-[#145C58]"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 4h18l-7 9v7l-4 2v-9L3 4z" />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6 3h12v3H6zM5 8h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
                          </svg>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-[#145C58] sm:text-sm">
                          {scene.t}
                        </h3>
                        <p className="mt-0.5 text-xs leading-snug text-gray-600">
                          {scene.s}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom text inside card */}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#145C58] sm:text-sm">
                  <svg
                    className="h-4 w-4 text-[#145C58]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>One box in your bag handles all three.</span>
                </div>
              </div>

              {/* Badges below card */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 px-2 text-xs font-semibold text-[#145C58]/80 lg:justify-start">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-[#145C58]" />
                  Woman-founded · Made for India
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4 text-[#145C58]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Free shipping over ₹599
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Strip */}
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-2xl bg-[#116B66] p-6 text-white shadow-md">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              {
                label: "11 ready kits",
                sub: "For any trip or body",
                icon: Sparkles,
              },
              {
                label: "Free intimate wipes",
                sub: "Included with every kit",
                icon: ShieldCheck,
              },
              {
                label: "DB product pricing",
                sub: "Pay for what you pack",
                icon: ShoppingBag,
              },
              {
                label: "One-time purchase",
                sub: "No auto-renewals",
                icon: Heart,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#E8A33D]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-white/80">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kit Selector & Customizer Section */}
      <section id="choose-kit" className="container mx-auto px-4 pt-4 pb-16">
        <div className="mb-8 max-w-3xl text-center md:text-left">
          <span className="inline-block text-xs font-bold tracking-widest text-[#168A82] uppercase">
            Choose and adjust
          </span>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-[#0A3B39] sm:text-4xl">
            Open a kit, change what is inside
          </h2>
          <p className="mt-2 max-w-2xl text-xs text-gray-600 sm:text-sm">
            Select any ready-made kit below to view contents. Adjust item
            quantities or add extra products. Your total updates automatically.
          </p>
        </div>

        {/* Dynamic Responsive Grid for Kits & Inline Row Panel Insertion */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {content.TIERS.map((tier: any, index: number) => {
            const Icon = IconMap[tier.ic] || Plane;
            const selected = selectedKitId === tier.id;

            return (
              <Fragment key={tier.id}>
                <button
                  onClick={() => setSelectedKitId(tier.id)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 sm:p-4 ${
                    selected
                      ? "border-[#116B66] bg-white shadow-md ring-2 ring-[#116B66]/20"
                      : "border-[#E5DAC9] bg-white/80 hover:border-[#116B66]/60 hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors sm:h-10 sm:w-10 ${
                          selected
                            ? "bg-[#116B66] text-white"
                            : "bg-[#EAF6F4] text-[#116B66] group-hover:bg-[#116B66] group-hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      {tier.best && (
                        <span className="rounded-full bg-[#E8A33D] px-2 py-0.5 text-[9px] font-bold text-[#3A2708] uppercase sm:text-[10px]">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="line-clamp-1 text-xs leading-tight font-bold text-[#0A3B39] sm:text-base">
                      {tier.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-[#168A82] uppercase sm:text-xs">
                      {tier.tag}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
                    <span
                      className={`text-[11px] font-bold sm:text-xs ${
                        selected ? "text-[#116B66]" : "text-gray-500"
                      }`}
                    >
                      {selected ? "Selected ✓" : "Customize →"}
                    </span>
                  </div>
                </button>

                {/* Inline Panel Insertion after active row */}
                {index === rowEndIndex && activeKit && (
                  <div
                    id="active-kit-panel"
                    className="animate-in fade-in slide-in-from-top-2 col-span-full my-3 rounded-2xl border-2 border-[#116B66] bg-[#FBF7F0] p-4 shadow-xl duration-300 sm:my-5 sm:p-7"
                  >
                    <div className="flex flex-col gap-4 border-b border-[#E5DAC9] pb-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="text-[11px] font-bold tracking-widest text-[#168A82] uppercase">
                          Customizing Kit
                        </span>
                        <h3 className="mt-0.5 font-serif text-2xl font-bold text-[#0A3B39] sm:text-3xl">
                          {activeKit.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-600">
                          {activeKit.tag} — Modify quantities below to fit your
                          exact journey.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#E5DAC9] bg-white px-5 py-3 text-left shadow-sm md:text-right">
                        <p className="text-[11px] font-bold tracking-wider text-[#168A82] uppercase">
                          Total DB Price
                        </p>
                        <p className="text-2xl font-extrabold text-[#0A3B39] sm:text-3xl">
                          ₹{activeTotal}
                        </p>
                      </div>
                    </div>

                    {/* Free Shipping Progress Indicator */}
                    <div className="mt-4 rounded-xl border border-[#E5DAC9] bg-white p-3">
                      <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-[#0A3B39]">
                        <span>Free shipping progress</span>
                        <span>
                          {activeTotal >= 599
                            ? "Unlocked! 🎉"
                            : `₹${Math.max(0, 599 - activeTotal)} away from free delivery`}
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E5DAC9]">
                        <div
                          className="h-full bg-gradient-to-r from-[#1A8A82] to-[#E8A33D] transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (activeTotal / 599) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Product Items List */}
                    <div className="mt-5 space-y-3">
                      {activeContents.map(({ key, qty, product }) => (
                        <div
                          key={key}
                          className="flex flex-col justify-between gap-3 rounded-xl border border-[#E5DAC9] bg-white p-3.5 shadow-sm sm:flex-row sm:items-center sm:p-4"
                        >
                          <div>
                            <p className="text-sm font-bold text-[#0A3B39] sm:text-base">
                              {product?.title || key}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product
                                ? `${product.variantName} · ₹${product.price} each`
                                : "Pending DB mapping"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <span className="text-sm font-extrabold text-[#0A3B39] sm:text-base">
                              ₹{Number(product?.price || 0) * qty}
                            </span>
                            <div className="flex items-center overflow-hidden rounded-lg border border-[#116B66]/30 bg-[#F4FAF9]">
                              <button
                                className="cursor-pointer px-3 py-1.5 text-sm font-bold text-[#116B66] transition-colors hover:bg-[#116B66] hover:text-white"
                                onClick={() =>
                                  updateQty(selectedKitId, key, -1)
                                }
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-[#0A3B39]">
                                {qty}
                              </span>
                              <button
                                className="cursor-pointer px-3 py-1.5 text-sm font-bold text-[#116B66] transition-colors hover:bg-[#116B66] hover:text-white"
                                onClick={() => updateQty(selectedKitId, key, 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Free Intimate Wipes Item Line */}
                      <div className="flex items-center justify-between rounded-xl border border-[#BFE3CA] bg-[#E6F4EA] p-3.5 sm:p-4">
                        <div>
                          <p className="text-sm font-bold text-[#15803D]">
                            Intimate Wipes
                          </p>
                          <p className="text-xs text-[#15803D]/80">
                            10 pH-balanced individually wrapped wipes
                          </p>
                        </div>
                        <span className="rounded-full border border-[#BFE3CA] bg-white px-3 py-1 text-xs font-bold text-[#15803D]">
                          Complimentary
                        </span>
                      </div>
                    </div>

                    {/* Add Extras Section */}
                    {extras.length > 0 && (
                      <div className="mt-6 border-t border-[#E5DAC9] pt-5">
                        <h4 className="mb-3 text-sm font-bold text-[#0A3B39]">
                          Add extra items to your kit
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {extras.map((item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-[#E5DAC9] bg-white p-3 sm:p-3.5"
                            >
                              <div>
                                <p className="text-xs font-bold text-[#0A3B39] sm:text-sm">
                                  {item.name}
                                </p>
                                <p className="line-clamp-1 text-[11px] text-gray-500">
                                  {item.blurb}
                                </p>
                              </div>
                              <button
                                onClick={() => addExtra(item)}
                                className="shrink-0 cursor-pointer rounded-lg bg-[#EAF6F4] px-3 py-1.5 text-xs font-bold text-[#116B66] transition-colors hover:bg-[#116B66] hover:text-white"
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Drawer Bottom Actions */}
                    <div className="mt-6 flex flex-col gap-3 border-t border-[#E5DAC9] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        onClick={resetKit}
                        className="cursor-pointer rounded-xl border border-[#E5DAC9] bg-white px-5 py-3 text-xs font-bold text-[#0A3B39] transition-colors hover:bg-gray-50 sm:text-sm"
                      >
                        Reset kit
                      </button>
                      <button
                        onClick={addKitToCart}
                        disabled={adding || missingItems.length > 0}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#116B66] px-7 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#0E4E4A] disabled:opacity-50 sm:text-sm"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {adding
                          ? "Adding to Cart..."
                          : "Add Kit Products to Cart"}
                      </button>
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </section>

      {/* Three Toilets Section (One kit, every toilet) */}
      <section
        id="every-toilet"
        className="bg-gradient-to-b from-[#EEF7F5] via-[#F4FAF8] to-[#FAF7F2] py-14 text-[#0A3B39] sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="mb-10 max-w-4xl sm:mb-12">
            <span className="mb-3 block text-xs font-bold tracking-widest text-[#116B66] uppercase">
              ONE KIT, EVERY TOILET
            </span>
            <h2 className="font-serif text-3xl leading-[1.15] font-extrabold tracking-tight text-[#0A3B39] sm:text-4xl lg:text-5xl">
              Three toilets you'll meet on a trip.{" "}
              <span className="text-[#116B66]">One kit for all of them.</span>
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Travel throws three kinds of toilet at you — and most people are
              only ready for one. A filthy Western seat you don't want to touch.
              A squat pan you can't or won't use. And the long stretches —
              highways, traffic, treks — with no toilet at all. The Yatra Kit
              packs a fix for each, plus intimate wipes to freshen up in
              between.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E5DAC9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7EFEA] text-[#116B66]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#0A3B39] sm:text-lg">
                  Dirty Western seat
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Lay a{" "}
                  <strong className="font-bold text-[#0A3B39]">
                    disposable cover
                  </strong>{" "}
                  and sit — your skin never touches a wet, shared seat. No
                  hovering, no dread.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E5DAC9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7EFEA] text-[#116B66]">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#0A3B39] sm:text-lg">
                  Squat toilet you can't use
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  The{" "}
                  <strong className="font-bold text-[#0A3B39]">
                    stand-to-pee funnel
                  </strong>{" "}
                  lets you go standing, without touching anything — a lifesaver
                  where there's no seat at all.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E5DAC9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7EFEA] text-[#116B66]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#0A3B39] sm:text-lg">
                  No toilet at all
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  <strong className="font-bold text-[#0A3B39]">
                    Pee & puke bags
                  </strong>{" "}
                  handle the long drives, the traffic jams and the treks where
                  there's simply nowhere to stop.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E5DAC9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7EFEA] text-[#116B66]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#0A3B39] sm:text-lg">
                  The mess in between
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  <strong className="font-bold text-[#0A3B39]">
                    Intimate wipes — free with every kit.
                  </strong>{" "}
                  Ten individually-wrapped, pH-balanced wipes to freshen up
                  between stops.
                </p>
              </div>
            </div>
          </div>

          {/* Wide Bottom Card */}
          <div className="rounded-2xl border border-[#E5DAC9] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D7EFEA] text-[#116B66]">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A3B39] sm:text-lg">
                  And if your cycle falls on the trip...
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Open any kit and add{" "}
                  <strong className="font-bold text-[#0A3B39]">
                    Ovy pads, liners, a period panty or a menstrual cup
                  </strong>{" "}
                  — so a period on the road is never a crisis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where you'll be glad you packed it Section (Matching User Design) */}
      <section
        id="where-to-use"
        className="bg-[#FAF7F2] py-14 text-[#0A3B39] sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="mb-8 max-w-3xl sm:mb-12">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#116B66] uppercase">
              EVERY TRIP, SORTED
            </span>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-[#0A3B39] sm:text-4xl lg:text-5xl">
              Where you'll be glad you packed it
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Tap a place to see how the Yatra Kit earns its spot in your bag.
            </p>
          </div>

          {/* Stepper Timeline & Navigation Arrows */}
          <div className="relative mb-8 sm:mb-10">
            {/* Stepper Row with Scroll */}
            <div className="relative overflow-hidden py-4">
              {/* Connecting Dashed Line */}
              <div className="pointer-events-none absolute top-[30px] right-8 left-8 z-0 h-[2px] border-t-2 border-dashed border-[#A0D2CE]" />

              {/* Scrollable Nodes Track */}
              <div
                ref={stepperRef}
                className="no-scrollbar relative z-10 flex snap-x items-start gap-8 overflow-x-auto scroll-smooth px-4 pt-1 pb-4 sm:gap-12"
              >
                {content.STOPS.map((stop: any[], idx: number) => {
                  const isActive = idx === activeStopIndex;
                  return (
                    <div
                      key={stop[1]}
                      onClick={() => setActiveStopIndex(idx)}
                      className="group flex w-28 shrink-0 cursor-pointer snap-center flex-col items-center text-center sm:w-32"
                    >
                      {/* Node Circle */}
                      <div
                        className={`z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
                          isActive
                            ? "scale-110 border-2 border-[#0A3B39] bg-[#0A3B39] shadow-md ring-4 ring-[#116B66]/25"
                            : "border-2 border-[#168A82] bg-white group-hover:scale-105 group-hover:border-[#0A3B39]"
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full transition-colors ${
                            isActive
                              ? "bg-white"
                              : "bg-[#168A82] group-hover:bg-[#0A3B39]"
                          }`}
                        />
                      </div>

                      {/* Node Title */}
                      <span
                        className={`mt-3 line-clamp-2 text-xs leading-tight font-bold transition-colors ${
                          isActive
                            ? "font-extrabold text-[#0A3B39]"
                            : "text-[#168A82] group-hover:text-[#0A3B39]"
                        }`}
                      >
                        {stop[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Previous / Next Arrow Controls */}
            <div className="mt-2 flex items-center justify-end gap-2 pr-2">
              <button
                onClick={() => {
                  setActiveStopIndex((prev) =>
                    prev > 0 ? prev - 1 : content.STOPS.length - 1,
                  );
                }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-100"
                aria-label="Previous location"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setActiveStopIndex((prev) =>
                    prev < content.STOPS.length - 1 ? prev + 1 : 0,
                  );
                }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-100"
                aria-label="Next location"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Detail Showcase Card */}
          {content.STOPS[activeStopIndex] && (
            <div className="rounded-3xl border border-[#E5DAC9] bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
              <div className="flex flex-col items-start gap-5 sm:gap-6 md:flex-row">
                {/* Left Icon Box */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E8A33D] text-white shadow-sm sm:h-16 sm:w-16">
                  {React.createElement(
                    StopIconMap[content.STOPS[activeStopIndex][0]] || MapPin,
                    { className: "h-7 w-7 sm:h-8 sm:w-8" },
                  )}
                </div>

                {/* Content Box */}
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[#0A3B39] sm:text-3xl">
                    {content.STOPS[activeStopIndex][1]}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
                    {content.STOPS[activeStopIndex][2]}
                  </p>

                  {/* Recommendation Pill */}
                  {content.STOPS[activeStopIndex][3] && (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#BDE5E2] bg-[#E7F6F5] px-4 py-1.5 text-xs font-semibold text-[#0A3B39] sm:text-sm">
                      <Check className="h-4 w-4 text-[#116B66]" />
                      <span>
                        Keep your kit in{" "}
                        <strong className="font-bold text-[#0A3B39]">
                          {content.STOPS[activeStopIndex][3]}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <InstagramFeed
        title="Join Our Community"
        username="@potenthygiene"
        gradientFrom="#016271"
        gradientTo="#AFE7F1"
        textColor="#FFFFFF"
        buttonColor="#1A8D91"
      />

      {/* Real Travel Stories / Reviews Section (Matching Attached Design) */}
      <section
        id="reviews"
        className="bg-[#FAF7F2] py-14 text-[#0A3B39] sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="mb-6 max-w-3xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#116B66] uppercase">
              WHAT PEOPLE SAY
            </span>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-[#0A3B39] sm:text-4xl lg:text-5xl">
              Loved on every trip out
            </h2>
          </div>

          {/* Rating Breakdown Summary Box */}
          <div className="mb-8 rounded-3xl border border-[#EBE3D7] bg-[#F9F3EA] p-6 sm:p-8">
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
              {/* Left Side: Overall Score */}
              <div className="flex flex-col justify-center border-b border-[#E5DAC9] pb-6 md:col-span-5 md:border-r md:border-b-0 md:pr-6 md:pb-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-extrabold text-[#0A3B39] sm:text-6xl">
                    4.8
                  </span>
                  <span className="text-xl font-bold text-gray-500">/ 5</span>
                </div>
                <div className="my-2 flex text-[#E8A33D]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#E8A33D] text-[#E8A33D]"
                    />
                  ))}
                </div>
                <p className="text-sm font-bold text-[#0A3B39]">
                  96 verified reviews
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                  <ShieldCheck className="h-4 w-4" /> Every review from a
                  verified purchase
                </p>
              </div>

              {/* Right Side: Rating Breakdown Bars */}
              <div className="flex flex-col gap-2.5 md:col-span-7">
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Rating breakdown</span>
                  <span>tap a row to filter</span>
                </div>

                {[
                  { stars: 5, count: 80, percent: "83%" },
                  { stars: 4, count: 11, percent: "12%" },
                  { stars: 3, count: 3, percent: "3%" },
                  { stars: 2, count: 1, percent: "1%" },
                  { stars: 1, count: 1, percent: "1%" },
                ].map((row) => (
                  <button
                    key={row.stars}
                    onClick={() => setActiveReviewFilter(`${row.stars}star`)}
                    className="group flex w-full cursor-pointer items-center gap-3 text-left transition-opacity hover:opacity-80"
                  >
                    <span className="w-6 shrink-0 text-xs font-bold text-[#0A3B39]">
                      {row.stars} ★
                    </span>
                    <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#E3EFEF]">
                      <div
                        className="h-full rounded-full bg-[#E8A33D] transition-all duration-500"
                        style={{ width: row.percent }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-xs font-semibold text-gray-600">
                      {row.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Pills Bar */}
          <div className="no-scrollbar mb-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-nowrap">
              {REVIEW_FILTERS.map((f) => {
                const isActive = activeReviewFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveReviewFilter(f.id)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "border-[#116B66] bg-[#116B66] text-white shadow-sm"
                        : "border-[#E5DAC9] bg-white text-[#0A3B39] hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mb-6 text-xs text-gray-500">
            Showing a selection of our most helpful reviews.
          </p>

          {/* Review Cards Slider Track with Arrow Controls */}
          <div className="group relative">
            {/* Scrollable Track */}
            <div
              ref={reviewsRef}
              className="no-scrollbar flex snap-x items-stretch gap-4 overflow-x-auto scroll-smooth pb-6 sm:gap-6"
            >
              {filteredReviews.map((review: any, idx: number) => {
                const initial = review.name ? review.name.charAt(0) : "V";
                return (
                  <div
                    key={review.name + idx}
                    className="flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-3xl border border-[#E5DAC9] bg-white p-6 shadow-sm sm:w-[350px]"
                  >
                    <div>
                      {/* Stars */}
                      <div className="mb-3 flex text-[#E8A33D]">
                        {[...Array(review.stars || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-[#E8A33D] text-[#E8A33D]"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-xs leading-relaxed font-normal text-gray-700 sm:text-sm">
                        "{review.quote}"
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="mt-5 flex items-start gap-3 border-t border-gray-100 pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D7EFEA] text-sm font-bold text-[#116B66]">
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#0A3B39]">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.city || "Verified Buyer"}
                        </p>
                        {review.stage && (
                          <span className="mt-1.5 inline-block rounded-full border border-[#BDE5E2] bg-[#E7F6F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#116B66]">
                            {review.stage}
                          </span>
                        )}
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#15803D]">
                          <Check className="h-3 w-3 text-[#15803D]" /> Verified
                          purchase
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Arrow Buttons */}
            <button
              onClick={() => {
                if (reviewsRef.current) {
                  reviewsRef.current.scrollBy({
                    left: -340,
                    behavior: "smooth",
                  });
                }
              }}
              className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition-all hover:bg-white"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                if (reviewsRef.current) {
                  reviewsRef.current.scrollBy({
                    left: 340,
                    behavior: "smooth",
                  });
                }
              }}
              className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition-all hover:bg-white"
              aria-label="Next reviews"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Section Quick-Nav Strap (Image 2 Design) */}
      <div className="no-scrollbar fixed bottom-6 left-1/2 z-40 flex max-w-[94vw] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-full border border-[#E5DAC9] bg-[#FAF7F2]/95 px-3 py-2 shadow-xl backdrop-blur-md">
        {[
          { id: "choose-kit", label: "Choose your kit" },
          { id: "every-toilet", label: "Every toilet" },
          { id: "where-to-use", label: "Where to use" },
          { id: "reviews", label: "Reviews" },
        ].map((item) => {
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNavId(item.id);
                const el = document.getElementById(item.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-nowrap transition-all sm:text-sm ${
                isActive
                  ? "bg-[#116B66] text-white shadow-sm"
                  : "border border-[#E5DAC9] bg-[#F7F4EE] text-[#0A3B39] hover:bg-[#EAE3D5]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {/* Bottom Left Timed Nudge Card (Point 3: Image Design) */}
      {showNudge && (
        <div className="animate-in fade-in slide-in-from-bottom-5 fixed bottom-20 left-4 z-50 flex max-w-[340px] items-center gap-3 rounded-2xl border border-[#E5DAC9] bg-white p-3.5 shadow-2xl transition-all duration-300 sm:bottom-6 sm:left-6 sm:max-w-md sm:p-4">
          {/* Dismiss button */}
          <button
            onClick={() => setShowNudge(false)}
            className="absolute top-2 right-2 cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Lightbulb Icon Box */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D7EFEA] text-[#116B66]">
            <Lightbulb className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 pr-3">
            <h4 className="text-xs font-bold text-[#0A3B39] sm:text-sm">
              One kit, every toilet?
            </h4>
            <p className="mt-0.5 text-[11px] leading-tight text-gray-500 sm:text-xs">
              See how covers, funnel and bags work together.
            </p>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => {
              setShowNudge(false);
              document
                .getElementById("every-toilet")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="shrink-0 cursor-pointer rounded-full bg-[#116B66] px-3.5 py-1.5 text-xs font-bold text-nowrap text-white shadow-sm transition-all hover:bg-[#0E4E4A]"
          >
            See how
          </button>
        </div>
      )}
    </main>
  );
}
