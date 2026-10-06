/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Check,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Truck,
  Heart,
  HelpCircle,
  ArrowRight,
  MapPin,
  Plane,
  Car,
  Bus,
  Briefcase,
  Baby,
  Activity,
  Plus,
  AlertCircle,
  X,
  FileText,
  AlertTriangle,
  Info,
  Timer,
  Shield,
  Users,
  Package,
  Droplets,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import { subscriptionPlans } from "@/const/globalconst";
import {
  calculateCycleSyncSchedule,
  getMinimumCycleSyncPeriodDate,
} from "@/lib/cycleSync";
import NoToiletLoowaySection from "./NoToiletLoowaySection";
import HowItWorksSection from "./HowItWorksSection";
import LoowayGuideSection from "./LoowayGuideSection";
import WhereToUseSection from "./WhereToUseSection";
import WhoItsForSection from "./WhoItsForSection";
import PackAndSpecsSection from "./PackAndSpecsSection";
import UseItSafelySection from "./UseItSafelySection";
import MarketComparisonSection from "./MarketComparisonSection";
import LoowayReviewsSection from "./LoowayReviewsSection";
import LoowayFaqSection from "./LoowayFaqSection";




type Props = {
  product: any;
  reviewWithMedia?: any;
  content: any;
};

const StopIconMap: Record<string, React.ComponentType<any>> = {
  plane: Plane,
  car: Car,
  drive: Car,
  bus: Bus,
  boat: ShipIcon,
  loo: ShieldCheck,
  temple: MapPin,
  mountain: MapPin,
  music: Sparkles,
  cross: Activity,
  baby: Baby,
  preg: Baby,
  heart: Heart,
  bed: BedIcon,
};

function ShipIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7" />
      <path d="M12 10V4" />
      <path d="M12 4l5 3-5 1" />
    </svg>
  );
}

function BedIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

const REVIEW_FILTERS = [
  { id: "all", label: "All reviews" },
  { id: "5star", label: "5★" },
  { id: "4star", label: "4★" },
  { id: "travel", label: "Road Trips & Flights" },
  { id: "sickness", label: "Motion & Morning Sickness" },
  { id: "kids", label: "Kids & Family" },
  { id: "seniors", label: "Seniors & Caregiving" },
];

export default function PeePukeBagsPageClient({ product, content }: Props) {
  const router = useRouter();
  const [selectedModeId, setSelectedModeId] = useState<string>("once");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<any>(
    subscriptionPlans[0],
  );
  const [cycleSync, setCycleSync] = useState({
    nextPeriodDate: "",
    cycleLength: 28,
  });
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [activeReviewFilter, setActiveReviewFilter] = useState<string>("all");
  const [activeNavId, setActiveNavId] = useState<string>("pdp-hero");
  const [openWhoIndex, setOpenWhoIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [pincode, setPincode] = useState<string>("");
  const [pincodeResult, setPincodeResult] = useState<{
    msg: string;
    err?: boolean;
  } | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [headerHeight, setHeaderHeight] = useState<number>(100);
  const [htuTab, setHtuTab] = useState<"pee" | "puke">("pee");

  const stepperRef = useRef<HTMLDivElement>(null);

  // Measure main website sticky header height dynamically for zero overlap
  useEffect(() => {
    const measureHeader = () => {
      const headerEl = document.querySelector("header");
      if (headerEl) {
        setHeaderHeight(headerEl.offsetHeight);
      }
    };
    measureHeader();
    window.addEventListener("resize", measureHeader);
    window.addEventListener("scroll", measureHeader);

    let observer: ResizeObserver | null = null;
    const headerEl = document.querySelector("header");
    if (headerEl && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measureHeader);
      observer.observe(headerEl);
    }

    return () => {
      window.removeEventListener("resize", measureHeader);
      window.removeEventListener("scroll", measureHeader);
      if (observer) observer.disconnect();
    };
  }, []);

  // Dynamic Variants from DB product object
  const variantsList = useMemo(() => {
    if (
      Array.isArray(product?.productVariants) &&
      product.productVariants.length > 0
    ) {
      return product.productVariants;
    }
    if (
      Array.isArray(product?.prodcutVarientBoxRes) &&
      product.prodcutVarientBoxRes.length > 0
    ) {
      return product.prodcutVarientBoxRes;
    }
    return [];
  }, [product]);

  // Dynamic Packs mapped directly from backend DB product variants
  const packs = useMemo(() => {
    if (variantsList.length > 0) {
      const map: Record<string, any> = {};
      variantsList.forEach((v: any, index: number) => {
        const id = v.id || `pack_${index}`;
        const name = v.name || v.title || `Pack of ${index === 0 ? 10 : 20}`;
        const price = Number(v.price || v.discountPrice || 0);
        const mrp = Number(
          v.discountPrice &&
            v.price &&
            Number(v.price) > Number(v.discountPrice)
            ? v.price
            : v.mrp || Math.round(price * 1.25),
        );
        const bags = name.includes("20") ? 20 : 10;
        const flag =
          name.includes("20") || index === 1 ? "Best value" : undefined;
        const sub =
          bags === 20
            ? "20 bags — save ₹99 vs two 10-packs"
            : "10 bags — one complete travel supply";

        map[id] = {
          id,
          variantId: v.id,
          name,
          bags,
          mrp,
          price,
          sub,
          flag,
          sku: v.sku || "LOOWAY-PUKE-01",
          image: v.bannerImage || product?.bannerImage || "",
        };
      });
      return map;
    }

    // Fallback if DB variants list is empty
    return (
      content?.PACKS || {
        p10: {
          id: "p10",
          name: "Pack of 10",
          bags: 10,
          mrp: 599,
          price: 499,
          sub: "10 bags — one complete travel supply",
        },
        p20: {
          id: "p20",
          name: "Pack of 20",
          bags: 20,
          mrp: 1198,
          price: 899,
          sub: "20 bags — save ₹99 vs two 10-packs",
          flag: "Best value",
        },
      }
    );
  }, [variantsList, product, content]);

  const packKeys = Object.keys(packs);
  const [selectedPackId, setSelectedPackId] = useState<string>(
    () => packKeys[1] || packKeys[0] || "p20",
  );

  useEffect(() => {
    if (!packs[selectedPackId] && packKeys.length > 0) {
      setSelectedPackId(packKeys[0]);
    }
  }, [packs, selectedPackId, packKeys]);

  const selectedPack =
    packs[selectedPackId] ||
    Object.values(packs)[0] || {
      id: "p10",
      name: "Pack of 10",
      bags: 10,
      mrp: 599,
      price: 499,
      sub: "10 bags — one complete travel supply",
    };

  const modes = content?.MODES || {
    once: { id: "once", name: "Buy once", off: 0 },
    sub1: { id: "sub1", name: "Subscribe monthly", off: 0.1 },
    sub2: { id: "sub2", name: "Subscribe every 2 months", off: 0.05 },
  };

  const packBasePrice = selectedPack?.price || Number(product?.price) || 499;
  const mrpPrice =
    selectedPack?.mrp || Number(product?.mrp) || Math.round(packBasePrice * 1.25);
  const unitPrice = packBasePrice;
  const totalPrice = unitPrice * quantity;
  const totalMrp = mrpPrice * quantity;
  const totalSavings = totalMrp - totalPrice;
  const perBagPrice = (unitPrice / (selectedPack?.bags || 10)).toFixed(1);

  const availableSubscriptionPlans = useMemo(
    () =>
      subscriptionPlans.filter((plan) => {
        if (plan.subscriptionType === "cycle_sync") {
          return Boolean(product?.allowCycleSync ?? true);
        }
        return Boolean(product?.allowSubscription ?? true);
      }),
    [product],
  );

  const getSubscriptionDiscount = (plan: any) => {
    const discountByPlan: Record<string, number> = {
      monthly: Number(product?.subscribeMonthlyDiscount || 15),
      every_2_months: Number(product?.subscribeBiMontlyDiscount || 10),
      cycle_sync: Number(product?.cycleSyncDiscount || 15),
    };

    return discountByPlan[plan.subscriptionType] || plan.discountPercentage || 0;
  };

  const minimumCycleSyncDate = useMemo(() => {
    const date = getMinimumCycleSyncPeriodDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const handleSubscribeNow = () => {
    const selectedPlan = selectedSubscriptionPlan || subscriptionPlans[0];
    const subscriptionType = selectedPlan?.subscriptionType;

    if (!subscriptionType || subscriptionType === "buy_once") {
      toast.error("Please select a subscription plan");
      return;
    }

    if (subscriptionType === "cycle_sync") {
      const schedule = calculateCycleSyncSchedule(cycleSync);
      if (!schedule.valid) {
        toast.error(schedule.message || "Enter valid Cycle Sync details.");
        return;
      }
    }

    const pId = product?._id || product?.id || "looway-pee-puke";
    const vId = selectedPack?.variantId || product?.productVariants?.[0]?.id;

    window.sessionStorage.setItem(
      "potent-subscription-checkout",
      JSON.stringify({
        productId: pId,
        productVariantId: vId,
        quantity,
        subscriptionType,
        selectedPlan,
        cycleSync: subscriptionType === "cycle_sync" ? cycleSync : undefined,
      }),
    );

    router.push("/checkout?mode=subscription");
  };

  // Dynamic Media Items with Labels matching screenshot design
  const mediaItems = useMemo(() => {
    const defaultLabels = ["Packaging", "Bag", "Liquid", "Locked"];
    const rawList: { url: string; label: string }[] = [];

    // 1. Primary Product Banner
    if (product?.bannerImage) {
      rawList.push({ url: getImageUrl(product.bannerImage), label: "Packaging" });
    }

    // 2. Product Media from DB (productMediaRes / productImages / images)
    if (Array.isArray(product?.productMediaRes)) {
      product.productMediaRes.forEach((item: any, idx: number) => {
        const url = item?.mediaURL || item?.image || item?.url || item?.bannerImage;
        if (url) {
          rawList.push({
            url: getImageUrl(url),
            label: item?.title || item?.name || defaultLabels[rawList.length % 4],
          });
        }
      });
    }

    if (Array.isArray(product?.productImages)) {
      product.productImages.forEach((img: any) => {
        const url = typeof img === "string" ? img : img?.image || img?.url || img?.bannerImage;
        if (url) {
          rawList.push({
            url: getImageUrl(url),
            label: defaultLabels[rawList.length % 4],
          });
        }
      });
    }

    // 3. Variant Images
    if (Array.isArray(product?.productVariants)) {
      product.productVariants.forEach((v: any) => {
        if (v.bannerImage) {
          rawList.push({
            url: getImageUrl(v.bannerImage),
            label: v.name || defaultLabels[rawList.length % 4],
          });
        }
        if (v.image) {
          rawList.push({
            url: getImageUrl(v.image),
            label: v.name || defaultLabels[rawList.length % 4],
          });
        }
      });
    }

    // Filter unique URLs
    const uniqueList: { url: string; label: string }[] = [];
    const seenUrls = new Set<string>();

    for (const item of rawList) {
      if (item.url && !seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        uniqueList.push(item);
      }
    }

    // Default Fallback Images & Cards
    const fallbackUrls = [
      "/products/pukebags.jpg",
      "/products/pukebags.jpg",
      "/products/pukebags.jpg",
      "/products/pukebags.jpg",
    ];

    const result: { url: string; label: string }[] = [];
    for (let i = 0; i < 4; i++) {
      if (uniqueList[i]) {
        result.push({
          url: uniqueList[i].url,
          label: defaultLabels[i] || uniqueList[i].label,
        });
      } else {
        result.push({
          url: uniqueList[0]?.url || fallbackUrls[i],
          label: defaultLabels[i],
        });
      }
    }

    // Append any extra DB images beyond 4
    if (uniqueList.length > 4) {
      for (let i = 4; i < uniqueList.length; i++) {
        result.push(uniqueList[i]);
      }
    }

    return result;
  }, [product, content]);

  const mediaList = useMemo(() => mediaItems.map((item) => item.url), [mediaItems]);

  const handleSelectPack = (packId: string) => {
    setSelectedPackId(packId);
    const targetPack = packs[packId];
    if (targetPack?.image) {
      const formattedUrl = getImageUrl(targetPack.image);
      const imgIdx = mediaList.indexOf(formattedUrl);
      if (imgIdx !== -1) {
        setSelectedImageIndex(imgIdx);
      }
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Stepper node active scroll
  useEffect(() => {
    if (stepperRef.current && stepperRef.current.children[activeStopIndex]) {
      const activeNode = stepperRef.current.children[
        activeStopIndex
      ] as HTMLElement;
      const container = stepperRef.current;
      const nodeLeft = activeNode.offsetLeft;
      const nodeWidth = activeNode.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: nodeLeft - containerWidth / 2 + nodeWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeStopIndex]);

  // Scroll Spy for section nav strap
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["pdp-hero", "how-it-works", "where-to-use", "why-looway", "reviews", "faq"];

      const scrollPos = window.scrollY + headerHeight + 60;
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
  }, [headerHeight]);

  // Cart action integration
  const handleAddToCart = async (isBuyNow = false) => {
    const variantId =
      selectedPack?.variantId ||
      product?.productVariants?.find(
        (v: any) =>
          v.name?.toLowerCase().includes(selectedPack?.name?.toLowerCase() || "") ||
          v.name?.includes(String(selectedPack?.bags || "")),
      )?.id ||
      product?.productVariants?.[0]?.id;

    setAdding(true);
    try {
      const success = await addToCartAction({
        productId: product?.id || product?._id || "looway-pee-puke",
        productVariantId: variantId,
        sku:
          selectedPack?.sku ||
          product?.productVariants?.[0]?.sku ||
          "LOOWAY-PUKE-01",
        slug: product?.slug || "looway-pee-puke-bags",
        title: `${product?.name || "Looway Pee & Puke Bags"} (${selectedPack?.name || "Pack"})`,
        image: mediaList[0] || "/products/pukebags.jpg",
        price: unitPrice,
        quantity: quantity,
        isQuantityChangable: true,
        purchaseType: "one_time",
        subscriptionType: null,
        isSubscribed: false,
      });

      if (success !== false) {
        toast.success(
          `Added ${quantity}x ${selectedPack?.name || "Pack"} to your bag!`,
          {
            action: {
              label: "View Bag",
              onClick: () => router.push("/cart"),
            },
          },
        );
        if (isBuyNow) {
          router.push("/cart");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleCheckPincode = () => {
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeResult({ msg: "Please enter a valid 6-digit Pincode", err: true });
      return;
    }
    setPincodeResult({
      msg: `Delivery available for ${pincode}! Ships within 24 hours.`,
      err: false,
    });
  };

  const stops = content?.STOPS || [];
  const currentStop = stops[activeStopIndex] || stops[0] || [
    "car",
    "Cars & road trips",
    "Highways can run for hours with no clean toilet in sight. Keep the drive moving — discreet relief right from your seat.",
    "the glovebox",
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-[#17271E] font-sans antialiased selection:bg-[#0E5C3A] selection:text-white">
      {/* ========================================================================= */}
      {/* TOP CHECKERBOARD PATTERN PATTI / STRAP                                    */}
      {/* ========================================================================= */}
        <div
        className="mb-10 h-3 w-full border-b border-teal-900/10"
        style={{
          background:
            "repeating-linear-gradient(90deg, #004851 0 12px, #F6D353 12px 24px)",
        }}
      />
      {/* ========================================================================= */}
      {/* 1. PDP HERO SECTION                                                       */}
      {/* ========================================================================= */}
      <section id="pdp-hero" className="w-full pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-[#17271E]/60">
            <Link href="/" className="hover:text-[#0E5C3A] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/looway" className="hover:text-[#0E5C3A] transition-colors">
              Looway
            </Link>
            <span>/</span>
            <span className="text-[#0E5C3A] font-bold">Pee & Puke Bags</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            {/* ===================================================================== */}
            {/* LEFT COLUMN: STICKY PRODUCT GALLERY                                 */}
            {/* ===================================================================== */}
            <div className="lg:col-span-6 lg:sticky lg:top-24">
              {/* Main Image Box */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border-2 border-dashed border-[#0E5C3A]/20 bg-[#F1F7F3] shadow-sm transition-all">
                {/* Floating Badges (Top-Left) */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4C430] px-3 py-1 text-[11px] font-extrabold text-[#0A4A2E] shadow-2xs">
                    <Droplets className="h-3.5 w-3.5 fill-[#0A4A2E]" />
                    <span>700 ml capacity</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E5C3A] px-3 py-1 text-[11px] font-extrabold text-white shadow-2xs">
                    <Timer className="h-3.5 w-3.5 text-[#F4C430]" />
                    <span>Solidifies in ~60 sec</span>
                  </span>
                </div>

                {/* Wishlist Heart Button (Top-Right) */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-pressed={isWishlisted}
                  className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition-all hover:scale-105 ${
                    isWishlisted ? "text-red-500 bg-white" : "text-[#17271E]/60 hover:text-[#0E5C3A]"
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                  />
                </button>

                {/* Main Product Image */}
                <div className="relative h-full w-full">
                  <Image
                    src={mediaList[selectedImageIndex] || "/products/pukebags.jpg"}
                    alt={product?.name || "Looway Pee & Puke Bags"}
                    fill
                    className="object-contain p-6 transition-transform duration-500 hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 550px"
                  />
                </div>

                {/* Slider Nav Arrows */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? mediaList.length - 1 : prev - 1,
                        )
                      }
                      className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E5C3A] shadow-md hover:bg-[#E4F0E8] transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === mediaList.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E5C3A] shadow-md hover:bg-[#E4F0E8] transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </button>
                  </>
                )}
              </div>

              {/* 4 Labeled Thumbnail Cards Grid (Packaging, Bag, Liquid, Locked) */}
              <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
                {mediaItems.map((item, idx) => {
                  const isActive = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`group relative flex flex-col items-center justify-between rounded-2xl p-2 sm:p-3 text-center transition-all cursor-pointer ${
                        isActive
                          ? "border-2 border-[#0E5C3A] bg-[#E4F0E8] shadow-xs"
                          : "border-2 border-dashed border-[#0E5C3A]/30 bg-[#F1F7F3]/60 hover:border-[#0E5C3A] hover:bg-white"
                      }`}
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/60">
                        <Image
                          src={item.url}
                          alt={item.label}
                          fill
                          className="object-contain p-1.5 transition-transform group-hover:scale-105"
                          sizes="100px"
                        />
                      </div>
                      <span
                        className={`mt-1.5 text-[10.5px] sm:text-xs font-bold leading-tight ${
                          isActive ? "text-[#0E5C3A]" : "text-[#17271E]/70"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===================================================================== */}
            {/* RIGHT COLUMN: PRODUCT DETAILS & BUY BOX                             */}
            {/* ===================================================================== */}
            <div className="flex flex-col lg:col-span-6">
              {/* Brand Tag / Kicker */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0E5C3A] px-4 py-1.5 text-[11px] font-extrabold tracking-widest text-white uppercase shadow-2xs">
                  LOOWAY • TRAVEL HYGIENE
                </span>
              </div>

              {/* Product Title */}
              <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-[#0A4A2E] sm:text-4xl lg:text-[46px] leading-tight">
                Pee & Puke Bags
              </h1>

              {/* Subtitle */}
              <p className="mt-1 font-sans text-base font-semibold text-[#17271E]/75 sm:text-lg">
                Disposable Urine & Vomit Bags
              </p>

              {/* Highlight Chips Row 1 */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E4F0E8] px-3.5 py-1 text-xs font-bold text-[#0E5C3A]">
                  700 ml capacity
                </span>
                <span className="rounded-full bg-[#F7E9C4] px-3.5 py-1 text-xs font-bold text-[#5E4100]">
                  Solidifies in ~60 sec
                </span>
                <span className="rounded-full bg-[#E1EFF6] px-3.5 py-1 text-xs font-bold text-[#22617f]">
                  {selectedPack?.bags || 10} bags
                </span>
              </div>

              {/* Rating Row (Clickable smooth-scroll to #reviews) */}
              <a
                href="#reviews"
                className="mt-3.5 flex items-center gap-2 text-xs font-semibold text-[#17271E]/80 group cursor-pointer w-fit"
              >
                <div className="flex items-center text-[#F4C430]">
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                </div>
                <span className="font-extrabold text-[#0A4A2E] group-hover:text-[#0E5C3A]">
                  4.8 out of 5
                </span>
                <span className="text-[#17271E]/40">•</span>
                <span className="underline decoration-dotted underline-offset-4 group-hover:text-[#0E5C3A] font-bold">
                  108 verified reviews
                </span>
              </a>


              {/* Highlight Chips Row 2 */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0E8]/80 border border-[#0E5C3A]/20 px-3 py-1 text-[11.5px] font-bold text-[#0E5C3A]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  Leak-proof & sealable
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0E8]/80 border border-[#0E5C3A]/20 px-3 py-1 text-[11.5px] font-bold text-[#0E5C3A]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  Odour-controlling
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F0E8]/80 border border-[#0E5C3A]/20 px-3 py-1 text-[11.5px] font-bold text-[#0E5C3A]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Unisex - all ages
                </span>
              </div>

              {/* Description Paragraph */}
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#17271E]/75 font-normal max-w-xl">
                The mess stops here. Compact, sealable urine & vomit bags for every moment a clean toilet isn&apos;t an option. Pop one open, use it, seal it — the super-absorbent strip solidifies liquid in seconds. No spills, no smell, no stress.
              </p>

              {/* Banner Callout Box */}
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#E4F0E8] bg-[#F1F7F3] p-3.5 text-xs text-[#0A4A2E]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0E5C3A] mt-0.5" />
                <span>
                  <strong>Works for men, women & kids of every age.</strong> One bag handles either pee or vomit, and a simple picture guide makes the very first use easy.
                </span>
              </div>

              {/* ======================================================================= */}
              {/* PACK SELECTOR GRID ("SELECT YOUR PACK")                                 */}
              {/* ======================================================================= */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold tracking-wider text-[#0A4A2E] uppercase">
                    SELECT YOUR PACK
                  </span>
                  <span className="text-xs font-medium text-[#17271E]/60">
                   Pack of 20 saves more
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {Object.values(packs).map((pk: any) => {
                    const isSelected = selectedPackId === pk.id;
                    const perPrice = (pk.price / (pk.bags || 10)).toFixed(1);
                    return (
                      <button
                        key={pk.id}
                        onClick={() => handleSelectPack(pk.id)}
                        className={`relative flex flex-col justify-between rounded-2xl border-2 p-3.5 sm:p-4 text-left transition-all ${
                          isSelected
                            ? "border-[#0E5C3A] bg-[#F1F7F3] shadow-sm"
                            : "border-[#E4DED0] bg-[#FBF8F1] hover:border-gray-300"
                        }`}
                      >
                        {/* Gold Badge if Best Value */}
                        {pk.flag && (
                          <span className="absolute -top-2.5 right-3 rounded-full bg-[#F4C430] px-2.5 py-0.5 text-[9.5px] font-extrabold text-[#0A4A2E] uppercase shadow-2xs">
                            {pk.flag}
                          </span>
                        )}

                        <div>
                          <div className="font-serif text-base font-bold text-[#0A4A2E]">
                            {pk.name}
                          </div>
                          <div className="mt-0.5 text-[11px] leading-tight text-[#17271E]/70">
                            {pk.sub}
                          </div>
                        </div>

                        <div className="mt-3 border-t border-[#E4DED0]/60 pt-2 flex items-baseline justify-between">
                          <div className="font-serif text-lg font-extrabold text-[#0E5C3A]">
                            ₹{pk.price}
                          </div>
                          <div className="text-[10px] font-bold text-[#17271E]/50">
                            ₹{perPrice}/bag
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ======================================================================= */}
              {/* BUY BOX: PRICE, QUANTITY & ADD TO BAG CTA                              */}
              {/* ======================================================================= */}
              <div className="mt-6 rounded-2xl border border-[#E4DED0] bg-white p-5 shadow-md">
                {/* Price Display */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-extrabold text-[#0A4A2E]">
                      ₹{totalPrice}
                    </span>
                    {totalMrp > totalPrice && (
                      <span className="text-sm font-normal text-[#17271E]/40 line-through">
                        ₹{totalMrp}
                      </span>
                    )}
                  </div>
                  {totalSavings > 0 && (
                    <span className="rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-bold text-[#15803D]">
                      Save ₹{totalSavings}
                    </span>
                  )}
                </div>

                <div className="mt-1 text-xs text-[#17271E]/60">
                  Total price for {quantity}x {selectedPack?.name || "Pack"} (₹{perBagPrice} per bag)
                </div>

                {/* Quantity Stepper & Quick Chips */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs font-bold text-[#0A4A2E] uppercase">
                    Quantity
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-[#E4DED0] bg-[#FBF8F1] p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-[#0E5C3A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        -
                      </button>
                      <span className="min-w-[32px] text-center text-sm font-extrabold text-[#0A4A2E]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-[#0E5C3A] hover:bg-white"
                      >
                        +
                      </button>
                    </div>

                    <div className="hidden sm:flex gap-1">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => setQuantity(num)}
                          className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                            quantity === num
                              ? "bg-[#0E5C3A] text-white"
                              : "border border-[#E4DED0] bg-white text-[#17271E] hover:border-[#0E5C3A]"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add to Cart & Buy Now Buttons for One-Time Purchase */}
                <div className="mt-4 grid grid-cols-12 gap-2.5">
                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={adding}
                    className="col-span-7 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0E5C3A] py-3.5 px-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0B4D31] active:scale-[0.98] disabled:opacity-60"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{adding ? "Adding..." : `Add to Bag — ₹${totalPrice}`}</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={adding}
                    className="col-span-5 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#114E36] py-3.5 px-4 text-sm font-bold text-white transition-all hover:bg-[#0C3B29] active:scale-[0.98]"
                  >
                    <Truck className="h-4 w-4 text-[#F4C430]" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* ======================================================================= */}
                {/* SUBSCRIBE & SAVE SECTION (Matching Menstrual Cup PDP structure)         */}
                {/* ======================================================================= */}
                {availableSubscriptionPlans.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-[#0E5C3A]/20 bg-[#F1F7F3] p-4 shadow-2xs sm:p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#0E5C3A]">
                          Subscribe &amp; save
                        </p>
                        <h4 className="mt-1 text-base font-serif font-bold text-[#0A4A2E]">
                          Never run out of travel essentials
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#17271E]/70">
                          Choose a delivery rhythm. Billing and auto-delivery occur per your schedule. Pause or cancel anytime in 2 clicks.
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#F4C430] px-2.5 py-1 text-[10px] font-bold text-[#0A4A2E]">
                        UP TO 15% OFF
                      </span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {availableSubscriptionPlans.map((plan: any) => {
                        const isSelected = selectedSubscriptionPlan?.id === plan.id;
                        const discount = getSubscriptionDiscount(plan);
                        const subscriptionPrice = Math.round(packBasePrice * (1 - discount / 100));
                        const billingLabel =
                          plan.subscriptionType === "cycle_sync"
                            ? "Based on your cycle"
                            : plan.subscriptionType === "every_2_months"
                              ? "Every 60 days"
                              : "Every 30 days";

                        return (
                          <button
                            key={plan.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelectedSubscriptionPlan(plan)}
                            className={`rounded-xl border-2 p-3 text-left transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#0E5C3A] bg-white shadow-sm"
                                : "border-[#E4DED0] bg-white/70 hover:border-[#0E5C3A]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-[#0A4A2E]">{plan.label}</span>
                              {isSelected && (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0E5C3A]" />
                              )}
                            </div>
                            <p className="mt-2 text-base font-bold text-[#0E5C3A]">
                              ₹{subscriptionPrice}
                              <span className="ml-1 text-[10px] font-normal text-gray-500">/ pack</span>
                            </p>
                            <p className="mt-1 text-[11px] text-gray-500">{billingLabel} · Save {discount}%</p>
                          </button>
                        );
                      })}
                    </div>

                    {selectedSubscriptionPlan?.subscriptionType === "cycle_sync" && (
                      <div className="mt-4 grid gap-3 rounded-xl border border-[#0E5C3A]/15 bg-white p-3.5 sm:grid-cols-2">
                        <label className="text-xs font-semibold text-gray-700">
                          Next period date
                          <input
                            type="date"
                            min={minimumCycleSyncDate}
                            value={cycleSync.nextPeriodDate}
                            onChange={(event) =>
                              setCycleSync((current) => ({
                                ...current,
                                nextPeriodDate: event.target.value,
                              }))
                            }
                            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 outline-none focus:border-[#0E5C3A]"
                          />
                        </label>
                        <label className="text-xs font-semibold text-gray-700">
                          Cycle length (days)
                          <input
                            type="number"
                            min={21}
                            max={45}
                            value={cycleSync.cycleLength}
                            onChange={(event) =>
                              setCycleSync((current) => ({
                                ...current,
                                cycleLength: Number(event.target.value),
                              }))
                            }
                            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 outline-none focus:border-[#0E5C3A]"
                          />
                        </label>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSubscribeNow}
                      className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0E5C3A] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#0A4A2E] active:scale-[0.99]"
                    >
                      <span>Subscribe with {selectedSubscriptionPlan?.label || "selected plan"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="mt-2 text-center text-[11px] text-gray-500">
                      Pause or cancel from your account anytime · Secure recurring payments
                    </p>
                  </div>
                )}

                {/* Save to Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-pressed={isWishlisted}
                  className={`mt-2.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E4DED0] bg-white py-3 text-sm font-semibold transition-all hover:border-[#0E5C3A] ${
                    isWishlisted ? "text-red-500 border-red-300" : "text-[#17271E]"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#17271E]"}`}
                  />
                  <span>{isWishlisted ? "Saved to wishlist" : "Save to wishlist"}</span>
                </button>

                {/* Microcopy & Support Email */}
                <div className="mt-4 text-center text-xs text-[#17271E]/70 space-y-1">
                  <p>Free shipping over ₹599 • ships in 24 hrs • secure checkout</p>
                  <p>
                    If something&apos;s wrong with your order,{" "}
                    <strong className="text-[#0A4A2E]">we&apos;ll make it right.</strong> Questions? Email{" "}
                    <a
                      href="mailto:care@potenthygiene.com"
                      className="font-bold text-[#0E5C3A] underline underline-offset-2"
                    >
                      care@potenthygiene.com
                    </a>
                  </p>
                </div>

                {/* Dynamic Free Shipping Indicator */}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#17271E]/80">
                  <Truck className="h-4 w-4 text-[#0E5C3A]" />
                  {totalPrice >= 599 ? (
                    <span className="text-emerald-700 font-bold">🎉 Free shipping unlocked!</span>
                  ) : (
                    <span>
                      Add <strong className="text-[#0E5C3A] font-extrabold">₹{599 - totalPrice}</strong> for free shipping
                    </span>
                  )}
                </div>

                {/* Potent Rewards Club Banner Card */}
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#F7CE46]/40 bg-[#FFF9E5] p-3.5 sm:p-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4C430] text-[#0A4A2E]">
                      <Star className="h-5 w-5 fill-[#0A4A2E]" />
                    </div>
                    <div className="text-[#17271E]/80 leading-snug">
                      In the <strong className="text-[#0A4A2E] font-bold">Potent Rewards Club</strong>? Your credits apply at checkout. Not yet a member?{" "}
                      <a
                        href="/login"
                        className="font-bold text-[#0E5C3A] underline underline-offset-2"
                      >
                        Join free
                      </a>{" "}
                      — earn across Ovy & Looway.
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#0E5C3A]" />
                </div>

                {/* SHOP WITH CONFIDENCE */}
                <div className="mt-6">
                  <div className="text-[11px] font-extrabold tracking-wider text-[#17271E]/60 uppercase mb-2">
                    SHOP WITH CONFIDENCE
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#17271E]/80">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#0E5C3A]" />
                      Leak-proof & hygienic
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#0E5C3A]" />
                      Woman-founded • Made for India
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 stroke-[3] text-[#0E5C3A]" />
                      Free shipping over ₹599
                    </span>
                  </div>
                </div>

                {/* Delivery & Safety Assurances Box */}
                <div className="mt-4 space-y-2.5 rounded-2xl border border-[#E4DED0] bg-[#F6F1E7] p-4 text-xs text-[#17271E]/80">
                  <div className="flex items-start gap-2.5">
                    <Truck className="h-4 w-4 shrink-0 text-[#0E5C3A] mt-0.5" />
                    <span>
                      Get it by <strong className="text-[#0A4A2E] font-bold">Mon, 12 Oct</strong> • ships in 24 hrs, tracked
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Info className="h-4 w-4 shrink-0 text-[#0E5C3A] mt-0.5" />
                    <span>
                      For hygiene & safety, this personal-care product can&apos;t be returned or exchanged once shipped • damaged or wrong items are replaced free
                    </span>
                  </div>
                </div>

                {/* Check Delivery Time Pincode Box */}
                <div className="mt-4 rounded-2xl border border-[#E4DED0] bg-[#F6F1E7] p-4">
                  <div className="text-xs font-bold text-[#0A4A2E] flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#0E5C3A]" />
                    Check delivery time
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 rounded-xl border border-[#E4DED0] bg-white px-4 py-2.5 text-xs font-semibold text-[#17271E] focus:border-[#0E5C3A] focus:outline-none"
                    />
                    <button
                      onClick={handleCheckPincode}
                      className="rounded-xl bg-[#0E5C3A] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#0B4D31]"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeResult && (
                    <div
                      className={`mt-2 text-xs font-semibold ${
                        pincodeResult.err ? "text-red-600" : "text-emerald-700"
                      }`}
                    >
                      {pincodeResult.msg}
                    </div>
                  )}
                </div>

                {/* Secure Checkout & Payment Badges */}
                <div className="mt-4 border-t border-[#E4DED0]/60 pt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17271E]/80 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["UPI", "Razorpay", "Visa", "Mastercard", "RuPay", "Net banking"].map((pay, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-[#E4DED0] bg-[#F6F1E7] px-2.5 py-1 text-[11px] font-bold text-[#17271E]/70"
                      >
                        {pay}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* WHAT'S IN THE BOX (OUTSIDE & BELOW BUY BOX CARD)                        */}
              {/* ======================================================================= */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-extrabold tracking-wider text-[#0A4A2E] uppercase">
                    WHAT&apos;S IN THE BOX
                  </h3>
                  <span className="text-xs text-[#17271E]/60 font-medium">
                    {selectedPack?.bags || 10} bags · one travel supply
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E4DED0] bg-white shadow-2xs">
                  {/* Row 1 */}
                  <div className="flex items-center justify-between p-3.5 sm:p-4 text-xs">
                    <span className="font-bold text-[#0A4A2E]">
                      {selectedPack?.bags || 10} Urine &amp; Vomit Bags
                    </span>
                    <span className="font-bold text-[#0E5C3A]">
                      sealabled
                    </span>
                    <span className="text-[#17271E]/60 font-normal hidden sm:inline">
                      One complete travel supply
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center justify-between border-t border-[#E4DED0]/60 p-3.5 sm:p-4 text-xs">
                    <span className="font-bold text-[#0A4A2E]">
                      Super-absorbent strip
                    </span>
                    <span className="font-bold text-[#0E5C3A]">
                      700 ml
                    </span>
                    <span className="text-[#17271E]/60 font-normal hidden sm:inline">
                      Solidifies liquid in ~60 seconds
                    </span>
                  </div>

                  {/* Row 3 (Footer highlight row) */}
                  <div className="flex items-center justify-between border-t border-[#E4DED0]/60 bg-[#F1F7F3] p-3.5 sm:p-4 text-xs">
                    <span className="font-extrabold text-[#0E5C3A] uppercase tracking-wide">
                      IN THE PACK
                    </span>
                    <span className="font-semibold text-[#17271E]/75">
                      {selectedPack?.bags || 10} bags · ready for the road
                    </span>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* QUICK SPECS (OUTSIDE & BELOW BUY BOX CARD)                              */}
              {/* ======================================================================= */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-extrabold tracking-wider text-[#0A4A2E] uppercase">
                    QUICK SPECS
                  </h3>
                  <a
                    href="#how-it-works"
                    className="text-xs font-semibold text-[#0E5C3A] underline decoration-dotted underline-offset-4 hover:text-[#0A4A2E]"
                  >
                    Show all
                  </a>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E4DED0] bg-white shadow-2xs divide-y divide-[#E4DED0]">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 divide-x divide-[#E4DED0]">
                    <div className="p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-[#17271E]/50">
                        Capacity
                      </div>
                      <div className="mt-1 font-serif text-sm sm:text-base font-extrabold text-[#0A4A2E]">
                        700 ml per bag
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-[#17271E]/50">
                        Uses per bag
                      </div>
                      <div className="mt-1 font-serif text-sm sm:text-base font-extrabold text-[#0A4A2E]">
                        2–3 until full
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 divide-x divide-[#E4DED0]">
                    <div className="p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-[#17271E]/50">
                        Solidifies
                      </div>
                      <div className="mt-1 font-serif text-sm sm:text-base font-extrabold text-[#0A4A2E]">
                        ~60 seconds
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-[#17271E]/50">
                        Closure
                      </div>
                      <div className="mt-1 font-serif text-sm sm:text-base font-extrabold text-[#0A4A2E]">
                        Sealable lock
                      </div>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2 divide-x divide-[#E4DED0]">
                    <div className="p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-[#17271E]/50">
                        Pack size
                      </div>
                      <div className="mt-1 font-serif text-sm sm:text-base font-extrabold text-[#0A4A2E]">
                        10 or 20 bags
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-[#17271E]/50">
                        Use type
                      </div>
                      <div className="mt-1 font-serif text-sm sm:text-base font-extrabold text-[#0A4A2E]">
                        External only
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION NAV STRAP (Sticky underneath header)                              */}
      {/* ========================================================================= */}
      <nav
        style={{ top: `${headerHeight}px` }}
        className="sticky z-40 w-full border-y border-[#E4DED0] bg-[#FAF6F0] shadow-sm backdrop-blur-md transition-[top] duration-150"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-start sm:justify-center gap-2 overflow-x-auto px-4 py-2.5 text-xs font-bold no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { id: "pdp-hero", label: "Overview" },
            { id: "how-it-works", label: "How It Works" },
            { id: "where-to-use", label: "Where To Use" },
            { id: "why-looway", label: "Why Looway" },
            { id: "reviews", label: "Reviews (108)" },
            { id: "faq", label: "FAQs" },
          ].map((nav) => (
            <a
              key={nav.id}
              href={`#${nav.id}`}
              className={`rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
                activeNavId === nav.id
                  ? "bg-[#0E5C3A] text-white shadow-2xs"
                  : "bg-white text-[#17271E]/80 border border-[#E4DED0] hover:border-[#0E5C3A]"
              }`}
            >
              {nav.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. SPECIFICATION STRIP                                                     */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#0E5C3A] text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6 items-center">
            {/* Point 1: 700 ml */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Droplets className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0 stroke-[2]" />
              <div>
                <div className="font-sans text-sm sm:text-lg font-bold leading-tight">700 ml</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium">Liquid capacity</div>
              </div>
            </div>

            {/* Point 2: ~60 sec */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Timer className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0 stroke-[2]" />
              <div>
                <div className="font-sans text-sm sm:text-lg font-bold leading-tight">~60 sec</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium">Solidifies liquid</div>
              </div>
            </div>

            {/* Point 3: Leak-proof */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0 stroke-[2]" />
              <div>
                <div className="font-sans text-sm sm:text-lg font-bold leading-tight">Leak-proof</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium">Sealable closure</div>
              </div>
            </div>

            {/* Point 4: Unisex */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0 stroke-[2]" />
              <div>
                <div className="font-sans text-sm sm:text-lg font-bold leading-tight">Unisex</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium">All ages, all genders</div>
              </div>
            </div>

            {/* Point 5: 10 bags / 20 bags */}
            <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
              <Package className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0 stroke-[2]" />
              <div>
                <div className="font-sans text-sm sm:text-lg font-bold leading-tight">
                  {selectedPack?.bags || 10} bags
                </div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium">Per pack · portable</div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      {/* ========================================================================= */}
      {/* 2. NO TOILET THERE'S LOOWAY SECTION (NEW COMPONENT)                       */}
      {/* ========================================================================= */}
      <NoToiletLoowaySection />

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS SECTION (NEW COMPONENT)                                  */}
      {/* ========================================================================= */}
      <HowItWorksSection />

      {/* ========================================================================= */}
      {/* 4. STEP INSIDE THE LOOWAY GUIDE (NEW COMPONENT)                           */}
      {/* ========================================================================= */}
      <LoowayGuideSection />

      {/* ========================================================================= */}
      {/* 5. WHERE YOU'LL BE GLAD YOU PACKED ONE (NEW COMPONENT)                   */}
      {/* ========================================================================= */}
      <WhereToUseSection />

      {/* ========================================================================= */}
      {/* 6. WHO IT'S FOR (NEW COMPONENT)                                          */}
      {/* ========================================================================= */}
      <WhoItsForSection />

      {/* ========================================================================= */}
      {/* 7. WHAT'S IN THE PACK & SPECS (NEW COMPONENT)                            */}
      {/* ========================================================================= */}
      <PackAndSpecsSection />

      {/* ========================================================================= */}
      {/* 8. USE IT SAFELY (NEW COMPONENT)                                         */}
      {/* ========================================================================= */}
      <UseItSafelySection />

      {/* ========================================================================= */}
      {/* 9. MARKET COMPARISON SECTION (NEW COMPONENT)                            */}
      {/* ========================================================================= */}
      <MarketComparisonSection />


      {/* ========================================================================= */}
      {/* 10. LOOWAY REVIEWS SECTION (NEW COMPONENT)                               */}
      {/* ========================================================================= */}
      <LoowayReviewsSection />

      {/* ========================================================================= */}
      {/* 11. FAQS SECTION (NEW COMPONENT)                                          */}
      {/* ========================================================================= */}
      <LoowayFaqSection />
    </div>

  );
}
