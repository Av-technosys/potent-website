/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Shield,
  CheckCircle2,
  RotateCw,
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
  Activity,
  Award,
  AlertCircle,
  X,
  Play,
  FileText,
  Gift,
  Smile,
  Zap,
  BookOpen,
  Info,
  Calendar,
  Layers,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { useWishlistStore } from "@/store/WishlistStore";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
} from "@/store/WishlistActions";
import { getImageUrl } from "@/lib/imageUrl";
import { getPdpSubscriptionDiscount, getPdpSubscriptionPlans } from "@/lib/pdpSubscriptionRules";
import { calculateCycleSyncSchedule, getMinimumCycleSyncPeriodDate } from "@/lib/cycleSync";
import WhatsInside from "./WhatsInside";
import OvyComparison from "./OvyComparison";
import OvyPromos from "./OvyPromos";
import ProductReviews from "./productreview";
import { ovyProductDetailsPage } from "@/const/globalconst";

type Props = {
  product: any;
  reviewWithMedia?: any;
  similarProducts?: any[];
  ovyProductsMap?: Record<string, any>;
  content: any;
};

// Kit Definitions matching ovyTeen data
const KITS_DATA: Record<string, any> = {
  STARTER: {
    key: "STARTER",
    label: "Starter Pack",
    pieces: "25-piece kit",
    flow: "First-period kit",
    name: "Ovy Organic Teen Pads — Starter Pack",
    price: 299,
    mrp: 349,
    badge: "25-piece kit · 10 L + 11 XL + 4 Liners",
    short:
      "Big changes need a gentle start. The Ovy Teen Starter Pack is your first-period kit — 25 essentials curated for unpredictable early cycles, with feather-soft organic pads that will not rash, will not show under a school uniform, and will not make the first time any harder than it needs to be.",
    box: [
      { item: "10 Large (L) Pads", mm: "240mm", for: "Light to medium flow, end of cycle", tag: "L", bg: "bg-[#E8C8DF]" },
      { item: "11 Extra Large (XL) Pads", mm: "280mm", for: "Heavy flow days, overnight protection", tag: "XL", bg: "bg-[#9A5B90]" },
      { item: "4 Soft Panty Liners", mm: "190mm", for: "Spotting, discharge, non-period freshness", tag: "LINER", bg: "bg-[#F3E6F0]" },
      { item: "25 Biodegradable Disposal Bags", mm: "Pads & liners", for: "Easy, private clean-up anywhere", tag: "BAG", bg: "bg-[#E4F1F1]" },
    ],
    total: "25 pieces — a complete monthly supply for one full cycle",
  },
  PRO: {
    key: "PRO",
    label: "Pro-Active Pack",
    pieces: "25-piece kit",
    flow: "Sports & travel kit",
    name: "Ovy Organic Teen Pads — Pro-Active Sports Pack",
    price: 349,
    mrp: 399,
    badge: "25-piece kit · 7 L + 7 XL + 7 XL+ + 4 Liners",
    short:
      "Don’t let your period bench you. Bleed. Conquer. Slay. The Ovy Teen Pro-Active Pack is engineered for the girl who refuses to hit pause — sprinting on the field, dancing on stage, travelling for tournaments. Three pad sizes. Maximum movement. Zero leaks.",
    box: [
      { item: "7 Large (L) Pads", mm: "240mm", for: "Practice sessions, lighter flow days", tag: "L", bg: "bg-[#E8C8DF]" },
      { item: "7 Extra Large (XL) Pads", mm: "280mm", for: "Long school days, moderate activity", tag: "XL", bg: "bg-[#9A5B90]" },
      { item: "7 Extra Large+ (XL+) Pads", mm: "320mm", for: "Heavy flow days, intense matches, overnight", tag: "XL+", bg: "bg-[#7E4D77]" },
      { item: "4 Soft Panty Liners", mm: "190mm", for: "Daily freshness, 'just in case' protection", tag: "LINER", bg: "bg-[#F3E6F0]" },
      { item: "25 Biodegradable Disposal Bags", mm: "Pads & liners", for: "Clean-up in any washroom", tag: "BAG", bg: "bg-[#E4F1F1]" },
    ],
    total: "25 pieces — a complete active sports cycle kit",
  },
  FIRST: {
    key: "FIRST",
    label: "First Period Box",
    pieces: "50-piece milestone kit",
    flow: "Complete First Period Gift Box",
    name: "Ovy Organic Teen Pads — First Period Box",
    price: 899,
    mrp: 999,
    badge: "50-piece kit · 14 L + 14 XL + 14 XL+ + Extras",
    short:
      "The ultimate first-period milestone gift box. Packed with 50 premium organic pads across three sizes, panty liners, period panty, toilet seat covers, wipes, pain relief patches, and a friendly step-by-step guidebook.",
    box: [
      { item: "14 Large (L) Pads", mm: "240mm", for: "Lighter flow & school days", tag: "L", bg: "bg-[#E8C8DF]" },
      { item: "14 Extra Large (XL) Pads", mm: "280mm", for: "Regular flow & full days", tag: "XL", bg: "bg-[#9A5B90]" },
      { item: "14 Extra Large+ (XL+) Pads", mm: "320mm", for: "Heavy flow & peaceful night sleep", tag: "XL+", bg: "bg-[#7E4D77]" },
      { item: "8 Soft Panty Liners", mm: "190mm", for: "Daily freshness & spotting", tag: "LINER", bg: "bg-[#F3E6F0]" },
      { item: "50 Biodegradable Disposal Bags", mm: "Pads & liners", for: "Hassle-free private disposal", tag: "BAG", bg: "bg-[#E4F1F1]" },
      { item: "1 Period Panty & Extras", mm: "Complete Kit", for: "Seat covers, wipes, pain patches & guide", tag: "GIFT", bg: "bg-[#FBF1DA]" },
    ],
    total: "50 pieces + Complete Period Readiness Kit",
  },
};

export default function OvyTeenPageClient({
  product,
  reviewWithMedia,
  similarProducts = [],
  ovyProductsMap = {},
  content,
}: Props) {
  const [selectedKitKey, setSelectedKitKey] = useState<string>("STARTER");
  const [selectedModeId, setSelectedModeId] = useState<string>("once");
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Selected Variant Map for Routine Products Cards
  const [selectedRoutineVariantMap, setSelectedRoutineVariantMap] = useState<Record<string, number>>({});

  const routineCardConfigs = [
    {
      slug: "ovy-cup",
      fallbackTitle: "Ovy Menstrual Cup",
      fallbackDesc: "Organic & rash-free menstrual hygiene care.",
      fallbackPrice: 459,
      fallbackImg: "/products/cup-rbw.jpg",
      bg: "bg-[#F3E6F0]",
      tag: "OVY",
    },
    {
      slug: "ovy-pads",
      fallbackTitle: "Ovy Organic Sanitary Pads",
      fallbackDesc: "Organic & rash-free menstrual hygiene care.",
      fallbackPrice: 378,
      fallbackImg: "/products/pads-l.jpg",
      bg: "bg-[#E4F1F1]",
      tag: "OVY",
    },
    {
      slug: "ovy-liners",
      fallbackTitle: "Ovy Daily Liners",
      fallbackDesc: "Organic & rash-free menstrual hygiene care.",
      fallbackPrice: 269,
      fallbackImg: "/products/liners.jpg",
      bg: "bg-[#FBF1FB]",
      tag: "OVY",
    },
    {
      slug: "looway-toilet-seat-covers",
      fallbackTitle: "Ovy Super Slim Period Panties",
      fallbackDesc: "Organic & rash-free menstrual hygiene care.",
      fallbackPrice: 479,
      fallbackImg: "/products/teen.jpg",
      bg: "bg-[#F4F1E8]",
      tag: "OVY",
    },
  ];

  // Dynamic Routine Products from DB / Fallback
  const routineProducts = useMemo(() => {
    if (Array.isArray(similarProducts) && similarProducts.length > 0) {
      const bgTints = ["bg-[#F3E6F0]", "bg-[#E4F1F1]", "bg-[#FBF1FB]", "bg-[#F4F1E8]"];
      return similarProducts.slice(0, 4).map((prod: any, idx: number) => {
        const price = prod.basePrice
          ? Number(prod.basePrice)
          : prod.startingPrice
          ? Number(prod.startingPrice)
          : 199;
        const banner = prod.bannerImage ? getImageUrl(prod.bannerImage) : null;

        return {
          id: prod.id || prod.slug,
          name: prod.name,
          desc: prod.description || "Organic & rash-free menstrual hygiene care.",
          price,
          tag: prod.brand ? String(prod.brand).toUpperCase() : "ORGANIC",
          bg: bgTints[idx % bgTints.length],
          image: banner,
          slug: prod.slug ? `/product-detail/${prod.slug}` : "#",
        };
      });
    }

    return [
      {
        id: "liners",
        name: "Ovy Organic Panty Liners",
        desc: "Everyday freshness & light spotting care.",
        price: 149,
        tag: "ORGANIC",
        bg: "bg-[#F3E6F0]",
        image: null,
        slug: "/product-detail/ovy-liners",
      },
      {
        id: "cup",
        name: "Ovy Menstrual Cup — XS",
        desc: "XS size for teens, up to 12h protection.",
        price: 399,
        tag: "REUSABLE",
        bg: "bg-[#E4F1F1]",
        image: null,
        slug: "/product-detail/ovy-cup",
      },
      {
        id: "panty",
        name: "Disposable Period Panty",
        desc: "360° leak protection for heavy nights.",
        price: 249,
        tag: "HEAVY FLOW",
        bg: "bg-[#FBF1FB]",
        image: null,
        slug: "/product-detail/ovy-panty",
      },
      {
        id: "seat",
        name: "Looway Toilet Seat Covers",
        desc: "Hygienic protection in school washrooms.",
        price: 199,
        tag: "HYGIENE",
        bg: "bg-[#F4F1E8]",
        image: null,
        slug: "/product-detail/looway-toilet-seat-covers",
      },
    ];
  }, [similarProducts]);

  // Cycle Sync States
  const [cycleDate, setCycleDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<number>(28);

  // Wishlist State & Action
  const wishlistItems = useWishlistStore((state) => state.items);
  const [isWishlistUpdating, setIsWishlistUpdating] = useState(false);
  const isWishlisted = useMemo(() => {
    const targetId = product?.id || "ovy-teen";
    return wishlistItems.some(
      (i: any) => i.productId === targetId
    );
  }, [wishlistItems, product]);

  const handleToggleWishlist = async () => {
    const targetId = product?.id || "ovy-teen";
    const targetSlug = product?.slug || "ovy-teen";
    if (isWishlistUpdating) return;
    setIsWishlistUpdating(true);
    try {
      if (isWishlisted) {
        await removeFromWishlistAction(targetId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistAction({
          ...product,
          productId: targetId,
          name: product?.name || activeKit.name,
          selectedVariant: currentVariant,
          price: basePrice,
          image: mediaList[0] || "/product.png",
          hasVarientBox: true,
          slug: targetSlug,
        });
        toast.success("Saved to wishlist");
      }
    } catch (error) {
      console.error("PDP wishlist toggle failed:", error);
      toast.error("Unable to update wishlist. Please try again.");
    } finally {
      setIsWishlistUpdating(false);
    }
  };

  // Interactive Cycle Tracker States
  const [trackerLastDate, setTrackerLastDate] = useState<string>("");
  const [trackerCycleLength, setTrackerCycleLength] = useState<number>(28);
  const [trackerPeriodDuration, setTrackerPeriodDuration] = useState<number>(5);

  // Cycle Tracker Calculation Engine
  const calculatedCycleWindows = useMemo(() => {
    if (!trackerLastDate) return null;

    const parts = trackerLastDate.split("-");
    let startDate: Date;
    if (parts.length === 3) {
      startDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      startDate = new Date(trackerLastDate);
    }
    if (isNaN(startDate.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const windows = [];
    for (let i = 1; i <= 3; i++) {
      const winStart = new Date(startDate);
      winStart.setDate(winStart.getDate() + i * trackerCycleLength);

      const winEnd = new Date(winStart);
      winEnd.setDate(winEnd.getDate() + trackerPeriodDuration - 1);

      const ovulationDate = new Date(winStart);
      ovulationDate.setDate(ovulationDate.getDate() - 14);

      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(fertileStart.getDate() - 4);

      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(fertileEnd.getDate() + 1);

      windows.push({
        windowNumber: i,
        start: winStart,
        end: winEnd,
        ovulation: ovulationDate,
        fertileStart,
        fertileEnd,
      });
    }

    const firstWindowStart = windows[0].start;
    const diffTime = firstWindowStart.getTime() - today.getTime();
    const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      windows,
      daysUntilNext,
      firstWindowStart,
    };
  }, [trackerLastDate, trackerCycleLength, trackerPeriodDuration]);

  // Gifting Option State
  const [isGiftChecked, setIsGiftChecked] = useState<boolean>(false);
  const [giftNote, setGiftNote] = useState<string>("");

  // Quiz Modal State
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResultKit, setQuizResultKit] = useState<string | null>(null);

  // Pincode Checker State
  const [pincode, setPincode] = useState<string>("");
  const [pincodeResult, setPincodeResult] = useState<{ msg: string; err?: boolean } | null>(null);

  // Learn / Period School Dropdown State
  const [learnDropdownOpen, setLearnDropdownOpen] = useState<boolean>(false);
  const [activeTopicModal, setActiveTopicModal] = useState<string | null>(null);

  // Accordion open FAQs state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Extract Variants from Database
  const variantsList = useMemo(() => {
    if (Array.isArray(product?.productVariants) && product.productVariants.length > 0) {
      return product.productVariants;
    }
    if (Array.isArray(product?.prodcutVarientBoxRes) && product.prodcutVarientBoxRes.length > 0) {
      return product.prodcutVarientBoxRes;
    }
    return [];
  }, [product]);

  // Match selected kit with DB variant
  const currentVariant = useMemo(() => {
    if (variantsList.length === 0) return null;
    const kitData = KITS_DATA[selectedKitKey];
    const targetName = kitData?.label?.toLowerCase() || selectedKitKey.toLowerCase();
    
    return (
      variantsList.find((v: any) => v.name?.toLowerCase().includes(targetName) || v.sku?.toLowerCase().includes(selectedKitKey.toLowerCase())) ||
      variantsList[0]
    );
  }, [variantsList, selectedKitKey]);

  // Current active Kit configuration
  const activeKit = KITS_DATA[selectedKitKey] || KITS_DATA.STARTER;

  // Base and discounted prices
  const basePrice = currentVariant?.price ? Number(currentVariant.price) : activeKit.price;
  const mrpPrice = currentVariant?.strikethroughPrice ? Number(currentVariant.strikethroughPrice) : activeKit.mrp;

  const modeDiscountPercentage = useMemo(() => {
    const subscriptionType =
      selectedModeId === "cyclesync"
        ? "cycle_sync"
        : selectedModeId === "sub1"
          ? "monthly"
          : selectedModeId === "sub2"
            ? "every_2_months"
            : null;
    return getPdpSubscriptionDiscount(subscriptionType) / 100;
  }, [selectedModeId]);

  const unitPrice = Math.round(basePrice * (1 - modeDiscountPercentage));
  const totalPrice = unitPrice * quantity;
  const totalMrp = mrpPrice * quantity;
  const totalSavings = totalMrp - totalPrice;

  // Dynamic Image Media List
  const mediaList = useMemo(() => {
    const images: string[] = [];
    if (currentVariant?.bannerImage) images.push(getImageUrl(currentVariant.bannerImage));
    if (product?.bannerImage) images.push(getImageUrl(product.bannerImage));
    if (variantsList.length > 0) {
      variantsList.forEach((v: any) => {
        if (v.bannerImage) images.push(getImageUrl(v.bannerImage));
      });
    }
    if (images.length === 0) images.push("/product.png");
    return Array.from(new Set(images));
  }, [product, variantsList, currentVariant]);

  // Minimum cycle sync date
  const minCycleDateString = useMemo(() => {
    const minDate = getMinimumCycleSyncPeriodDate();
    return minDate.toISOString().split("T")[0];
  }, []);

  // Calculate Cycle Sync schedule preview
  const cycleSchedule = useMemo(() => {
    if (selectedModeId !== "cyclesync" || !cycleDate) return null;
    return calculateCycleSyncSchedule({ nextPeriodDate: cycleDate, cycleLength });
  }, [selectedModeId, cycleDate, cycleLength]);

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Handle Pincode Check
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      setPincodeResult({ msg: "Please enter a valid 6-digit PIN code", err: true });
      return;
    }
    setPincodeResult({
      msg: `Express Delivery Available to ${pincode}! Delivered in 3-5 business days. Free shipping on orders over ₹599.`,
      err: false,
    });
  };

  // Add To Cart logic preserving exact backend signature
  const handleAddToCart = async () => {
    const variantId = currentVariant?.id || product?.productVariants?.[0]?.id;
    const variantSku = currentVariant?.sku || `OVY-TEEN-${selectedKitKey}`;

    setAdding(true);
    try {
      const success = await addToCartAction({
        productId: product?.id || "ovy-teen",
        productVariantId: variantId,
        sku: variantSku,
        slug: product?.slug || "ovy-teen",
        title: `${product?.name || "Ovy Organic Soft Sanitary Pads — Teen"} (${activeKit.label})`,
        image: mediaList[0] || "/product.png",
        price: unitPrice,
        quantity: quantity,
        isQuantityChangable: true,
        purchaseType: selectedModeId === "once" ? "one_time" : "subscription",
        subscriptionType:
          selectedModeId === "cyclesync"
            ? "cycle_sync"
            : selectedModeId === "sub1"
            ? "monthly"
            : selectedModeId === "sub2"
            ? "every_2_months"
            : null,
        cycleSync:
          selectedModeId === "cyclesync" && cycleDate
            ? { nextPeriodDate: cycleDate, cycleLength: Number(cycleLength) }
            : undefined,
      });

      if (success !== false) {
        toast.success(`Added ${activeKit.label} to cart!`);
      }
    } catch (err: any) {
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  // Direct Buy Now
  const handleBuyNow = async () => {
    if (selectedModeId === "once") {
      await handleAddToCart();
      window.location.href = "/cart";
      return;
    }

    if (selectedModeId === "cyclesync") {
      const schedule = cycleSchedule;
      if (!schedule || !schedule.valid) {
        toast.error("Select valid Cycle Sync details before continuing.");
        return;
      }
    }

    const subscriptionType =
      selectedModeId === "cyclesync"
        ? "cycle_sync"
        : selectedModeId === "sub1"
          ? "monthly"
          : "every_2_months";
    const selectedPlan = getPdpSubscriptionPlans(product).find(
      (plan) => plan.subscriptionType === subscriptionType,
    );

    if (!selectedPlan) {
      toast.error("This subscription plan is not available.");
      return;
    }

    window.sessionStorage.setItem(
      "potent-subscription-checkout",
      JSON.stringify({
        productId: product?.id || product?._id,
        productVariantId: currentVariant?.id,
        quantity,
        subscriptionType,
        selectedPlan,
        plan: selectedPlan,
        cycleSync:
          subscriptionType === "cycle_sync"
            ? { nextPeriodDate: cycleDate, cycleLength: Number(cycleLength) }
            : undefined,
      }),
    );
    window.location.href = "/checkout?mode=subscription";
  };

  // Handle Quiz flow
  const handleQuizAnswer = (questionIdx: number, val: string) => {
    const nextAnswers = { ...quizAnswers, [questionIdx]: val };
    setQuizAnswers(nextAnswers);

    if (questionIdx < 3) {
      setQuizStep(questionIdx + 1);
    } else {
      // Calculate recommended kit
      let recommended = "STARTER";
      if (nextAnswers[1] === "active" || nextAnswers[3] === "sports") {
        recommended = "PRO";
      } else if (nextAnswers[1] === "first" || nextAnswers[3] === "gift") {
        recommended = "FIRST";
      }
      setQuizResultKit(recommended);
      setQuizStep(4);
    }
  };

  const handleSelectQuizResult = () => {
    if (quizResultKit) {
      setSelectedKitKey(quizResultKit);
      setQuizOpen(false);
      toast.success(`Selected ${KITS_DATA[quizResultKit].label}!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A150F] font-sans antialiased pb-20">
      {/* Sticky Period School Navigation Header */}
      <nav className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#1A150F]/10 shadow-xs">
        <div className="max-w-[1180px] mx-auto px-4 md:px-6 h-[54px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-[#7E4D77]">OVY TEEN</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3E6F0] text-[#7E4D77] px-2 py-0.5 rounded-full hidden sm:inline-block">
              Organic First-Period Care
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Period School Dropdown button */}
            <div className="relative">
              <button
                onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#7E4D77] bg-[#F3E6F0] border-1.5 border-[#9A5B90] hover:bg-[#9A5B90] hover:text-white transition-all cursor-pointer"
                aria-expanded={learnDropdownOpen}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Period School</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${learnDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {learnDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[480px] bg-white border border-[#1A150F]/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7E4D77] mb-2">First Period Basics</h4>
                      <button
                        onClick={() => { setActiveTopicModal("101"); setLearnDropdownOpen(false); }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#F3E6F0] flex items-center gap-2 text-xs font-medium text-[#1A150F] transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-[#9A5B90]" />
                        <div>
                          <b className="block">First-Period 101</b>
                          <span className="text-[11px] text-[#1A150F]/60">What nobody explains</span>
                        </div>
                      </button>
                      <button
                        onClick={() => { setActiveTopicModal("use"); setLearnDropdownOpen(false); }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#F3E6F0] flex items-center gap-2 text-xs font-medium text-[#1A150F] transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 text-[#9A5B90]" />
                        <div>
                          <b className="block">How to use a pad</b>
                          <span className="text-[11px] text-[#1A150F]/60">6 easy steps</span>
                        </div>
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7E4D77] mb-2">Track & Care</h4>
                      <button
                        onClick={() => { setActiveTopicModal("tracker"); setLearnDropdownOpen(false); }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#F3E6F0] flex items-center gap-2 text-xs font-medium text-[#1A150F] transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#1A8D91]" />
                        <div>
                          <b className="block">Cycle & Energy Guide</b>
                          <span className="text-[11px] text-[#1A150F]/60">Week by week changes</span>
                        </div>
                      </button>
                      <button
                        onClick={() => { setQuizOpen(true); setLearnDropdownOpen(false); }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[#F3E6F0] flex items-center gap-2 text-xs font-medium text-[#1A150F] transition-colors"
                      >
                        <Zap className="w-4 h-4 text-[#9A5B90]" />
                        <div>
                          <b className="block">Find My Fit Quiz</b>
                          <span className="text-[11px] text-[#1A150F]/60">2-minute recommendation</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedKitKey("FIRST")}
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#9A5B90] hover:bg-[#7E4D77] transition-all cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>First Period Box</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1180px] mx-auto px-4 md:px-6 pt-6">
        {/* Kit Selector Toggle (Starter Pack | Pro-Active Pack | First Period Box) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-1.5 p-1.5 bg-white border border-[#1A150F]/10 rounded-full shadow-xs flex-wrap justify-center">
            {Object.keys(KITS_DATA).map((key) => {
              const kit = KITS_DATA[key];
              const isSelected = selectedKitKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKitKey(key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#9A5B90] text-white shadow-sm"
                      : "text-[#1A150F]/70 hover:bg-[#F3E6F0] hover:text-[#7E4D77]"
                  }`}
                  aria-selected={isSelected}
                >
                  <span>{kit.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#F3E6F0] text-[#7E4D77]"
                    }`}
                  >
                    {key === "FIRST" ? "50 pcs" : "25 pcs"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 lg:sticky lg:top-20">
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-[#FBF1FB] border border-[#1A150F]/10 shadow-sm flex items-center justify-center">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#7E4D77] text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9A5B90]" />
                <span>{activeKit.badge}</span>
              </div>

              {/* Main Image Display */}
              {mediaList[selectedImageIndex] ? (
                <Image
                  src={mediaList[selectedImageIndex]}
                  alt={activeKit.name}
                  fill
                  className="object-contain p-6 transition-all duration-300"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="w-32 h-32 rounded-3xl bg-[#F3E6F0] flex items-center justify-center text-[#7E4D77] mb-4">
                    <Heart className="w-16 h-16 fill-[#9A5B90]/20" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-[#7E4D77]">{activeKit.label}</span>
                  <span className="text-xs text-[#1A150F]/60 mt-1">{activeKit.flow}</span>
                </div>
              )}

              {/* Prev / Next controls */}
              {mediaList.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-sm grid place-items-center text-[#1A150F] hover:bg-white hover:scale-105 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-sm grid place-items-center text-[#1A150F] hover:bg-white hover:scale-105 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {mediaList.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {mediaList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-white transition-all ${
                      selectedImageIndex === idx ? "border-[#9A5B90] ring-2 ring-[#F3E6F0]" : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buying & Detail Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-2 bg-[#9A5B90] text-white text-[11px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full">
                OVY TEEN ORGANIC PADS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A150F] mt-3 leading-tight">
                {activeKit.name}
              </h1>

              {/* Save to Wishlist Button */}
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={isWishlistUpdating}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isWishlisted
                      ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-xs"
                      : "border-gray-300/80 bg-white text-gray-700 hover:border-[#9A5B90] hover:text-[#7E4D77] shadow-xs"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-transform active:scale-125 ${
                      isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-600"
                    }`}
                  />
                  <span>{isWishlisted ? "Saved to wishlist" : "Save to wishlist"}</span>
                </button>
              </div>

              {/* Meta Flow Chips */}
              <div className="flex items-center gap-2 flex-wrap mt-3 text-xs font-semibold">
                <span className="bg-[#F3E6F0] text-[#7E4D77] px-3 py-1 rounded-full">{activeKit.pieces}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A150F]/20" />
                <span className="bg-[#E4F1F1] text-[#1A8D91] px-3 py-1 rounded-full">{activeKit.flow}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 text-xs text-[#1A150F]/70">
                <div className="flex text-[#9A5B90]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#1A150F]">5.0</span>
                <span>(304 teen & mom reviews)</span>
              </div>

              <p className="text-sm sm:text-base text-[#1A150F]/80 leading-relaxed mt-4">
                {activeKit.short}
              </p>

              {/* Kit Variant Cards Grid */}
              <div className="my-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A150F]/70">
                    Select Kit Option
                  </span>
                  <span className="text-xs text-[#7E4D77] font-semibold italic">
                    Designed for different flow & activity
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {Object.keys(KITS_DATA).map((key) => {
                    const kit = KITS_DATA[key];
                    const isSelected = selectedKitKey === key;
                    const displayPrice =
                      currentVariant && selectedKitKey === key
                        ? Number(currentVariant.price)
                        : kit.price;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedKitKey(key)}
                        className={`relative text-left p-2.5 sm:p-3.5 rounded-2xl border-1.5 transition-all cursor-pointer ${
                          key === "FIRST" ? "col-span-2 sm:col-span-1" : "col-span-1"
                        } ${
                          isSelected
                            ? "border-[#9A5B90] bg-[#F3E6F0] shadow-sm ring-2 ring-[#9A5B90]/20"
                            : "border-[#1A150F]/15 bg-white hover:border-[#9A5B90]/50 hover:bg-[#F3E6F0]/20"
                        }`}
                        aria-selected={isSelected}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#9A5B90] text-white grid place-items-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="font-serif text-xs sm:text-sm font-bold text-[#1A150F] pr-4 leading-tight">
                          {kit.label}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-[#1A150F]/60 mt-0.5 font-medium">
                          {kit.pieces}
                        </div>
                        <div className="text-[9px] sm:text-[10px] font-bold text-[#7E4D77] mt-1.5 sm:mt-2 bg-[#F3E6F0]/80 inline-block px-1.5 py-0.5 rounded">
                          {kit.flow}
                        </div>
                        <div className="mt-1.5 sm:mt-2 font-serif text-xs sm:text-sm font-bold text-[#1A150F]">
                          ₹{displayPrice}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* What's in the Box Breakdown Container */}
            <div className="border-1.5 border-[#F3E6F0] rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="bg-[#F3E6F0] px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E4D77]">What's in the Box</span>
                <span className="text-xs font-semibold text-[#7E4D77]">{activeKit.pieces}</span>
              </div>
              <div className="divide-y divide-[#1A150F]/5">
                {activeKit.box.map((row: any, i: number) => (
                  <div key={i} className="p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold text-white ${row.bg}`}>
                        {row.tag}
                      </span>
                      <div>
                        <b className="block text-[#1A150F] font-semibold">{row.item}</b>
                        <span className="text-xs text-[#1A150F]/60">{row.for}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#7E4D77] bg-[#F3E6F0]/50 px-2 py-1 rounded">
                      {row.mm}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-[#F4F1E8] p-3 text-xs font-medium text-[#1A150F]/80 text-center border-t border-[#1A150F]/5">
                {activeKit.total}
              </div>
            </div>

            {/* Period Quiz Banner Entry */}
            <button
              onClick={() => setQuizOpen(true)}
              className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-[#F3E6F0] to-[#E4F1F1] border-1.5 border-[#9A5B90] shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-4 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white grid place-items-center text-[#7E4D77] shadow-xs group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <b className="block text-sm font-bold text-[#1A150F]">Not sure which kit is right?</b>
                <span className="text-xs text-[#1A150F]/70">Take our 30-second fit quiz to find her perfect match</span>
              </div>
              <ArrowRight className="w-5 h-5 text-[#7E4D77] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Buying Options Container */}
            <div className="bg-white border border-[#1A150F]/10 rounded-3xl p-5 sm:p-6 shadow-md">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#1A150F]/60 mb-3">
                Select Purchase Mode
              </span>

              {/* Purchase Options Grid */}
              <div className="space-y-3">
                {/* Buy Once Option */}
                <button
                  onClick={() => setSelectedModeId("once")}
                  className={`w-full p-4 rounded-2xl border-1.5 text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedModeId === "once"
                      ? "border-[#9A5B90] bg-[#F3E6F0]/40 shadow-xs"
                      : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 grid place-items-center ${selectedModeId === "once" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}>
                      {selectedModeId === "once" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <b className="block text-sm font-bold text-[#1A150F]">One-Time Order</b>
                      <span className="text-xs text-[#1A150F]/60">Standard single delivery</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <b className="font-serif text-lg font-bold text-[#1A150F]">₹{basePrice}</b>
                    {mrpPrice > basePrice && (
                      <s className="block text-xs text-[#1A150F]/40">₹{mrpPrice}</s>
                    )}
                  </div>
                </button>

                {/* Cycle Sync Option (15% OFF) */}
                <div
                  className={`p-4 rounded-2xl border-1.5 text-left transition-all ${
                    selectedModeId === "cyclesync"
                      ? "border-[#9A5B90] bg-gradient-to-r from-[#FBF1FB] to-[#EAF1F1] shadow-xs"
                      : "border-[#9A5B90]/40 bg-gradient-to-r from-[#FBF1FB]/50 to-[#EAF1F1]/50 hover:border-[#9A5B90]"
                  }`}
                >
                  <button
                    onClick={() => setSelectedModeId("cyclesync")}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 grid place-items-center ${selectedModeId === "cyclesync" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}>
                        {selectedModeId === "cyclesync" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <b className="text-sm font-bold text-[#1A150F]">Cycle Sync Delivery</b>
                          <span className="bg-[#9A5B90] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Save 15%
                          </span>
                        </div>
                        <span className="text-xs text-[#1A150F]/70">Arrives 5 days before her period</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <b className="font-serif text-lg font-bold text-[#7E4D77]">₹{Math.round(basePrice * 0.85)}</b>
                      <s className="block text-xs text-[#1A150F]/40">₹{basePrice}</s>
                    </div>
                  </button>

                  {/* Cycle Sync Date & Length Inputs */}
                  {selectedModeId === "cyclesync" && (
                    <div className="mt-4 pt-3 border-t border-[#9A5B90]/20 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7E4D77] mb-1">
                            Next Period Date
                          </label>
                          <input
                            type="date"
                            min={minCycleDateString}
                            value={cycleDate}
                            onChange={(e) => setCycleDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#1A150F]/20 rounded-xl text-xs focus:outline-none focus:border-[#9A5B90]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7E4D77] mb-1">
                            Cycle Length (Days)
                          </label>
                          <input
                            type="number"
                            min={21}
                            max={45}
                            value={cycleLength}
                            onChange={(e) => setCycleLength(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-[#1A150F]/20 rounded-xl text-xs focus:outline-none focus:border-[#9A5B90]"
                          />
                        </div>
                      </div>

                      {/* Schedule Result Banner */}
                      {cycleSchedule && "valid" in cycleSchedule && cycleSchedule.valid ? (
                        <div className="p-3 bg-white/80 rounded-xl border border-[#9A5B90]/20 text-xs space-y-1">
                          <span className="font-bold text-[#7E4D77]">Delivery Schedule:</span>
                          <p className="text-[#1A150F]/80">
                            Pads arrive around <b>{cycleSchedule.arrivalDate.toDateString()}</b> (5 days prior to period).
                          </p>
                        </div>
                      ) : (
                        <span className="block text-[11px] text-[#1A150F]/60">
                          Please select her next period date (at least 6 days in advance).
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Subscribe & Save Option */}
                <button
                  onClick={() => setSelectedModeId("sub1")}
                  className={`w-full p-4 rounded-2xl border-1.5 text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedModeId === "sub1"
                      ? "border-[#9A5B90] bg-[#F3E6F0]/40 shadow-xs"
                      : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 grid place-items-center ${selectedModeId === "sub1" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}>
                      {selectedModeId === "sub1" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <b className="text-sm font-bold text-[#1A150F]">Subscribe Monthly</b>
                        <span className="bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Save 15%
                        </span>
                      </div>
                      <span className="text-xs text-[#1A150F]/60">Auto-restock every 30 days · Cancel anytime</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <b className="font-serif text-lg font-bold text-[#1A150F]">₹{Math.round(basePrice * 0.85)}</b>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedModeId("sub2")}
                  className={`w-full rounded-2xl border-1.5 p-4 text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedModeId === "sub2"
                      ? "border-[#9A5B90] bg-[#F3E6F0]/40 shadow-xs"
                      : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 grid place-items-center ${selectedModeId === "sub2" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}>
                      {selectedModeId === "sub2" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <b className="text-sm font-bold text-[#1A150F]">Subscribe Every 2 Months</b>
                        <span className="bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Save 12%
                        </span>
                      </div>
                      <span className="text-xs text-[#1A150F]/60">Auto-restock every 60 days · Cancel anytime</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <b className="font-serif text-lg font-bold text-[#1A150F]">₹{Math.round(basePrice * 0.88)}</b>
                  </div>
                </button>
              </div>

              {/* Gifting Box Option (Enabled for First Period Box) */}
              {selectedKitKey === "FIRST" && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#F7E8F0] to-[#EAF1F2] border border-[#9A5B90]/30">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-[#7E4D77]">
                    <input
                      type="checkbox"
                      checked={isGiftChecked}
                      onChange={(e) => setIsGiftChecked(e.target.checked)}
                      className="w-4 h-4 accent-[#9A5B90]"
                    />
                    <Gift className="w-4 h-4 text-[#9A5B90]" />
                    <span>Include Free Gift Packaging & Personalized Note</span>
                  </label>

                  {isGiftChecked && (
                    <div className="mt-3">
                      <textarea
                        maxLength={200}
                        rows={2}
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Write a sweet encouragement message for her first period..."
                        className="w-full p-2.5 bg-white border border-[#1A150F]/20 rounded-xl text-xs focus:outline-none focus:border-[#9A5B90]"
                      />
                      <span className="block text-[10px] text-[#1A150F]/50 text-right mt-1">
                        {giftNote.length}/200 characters
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector & Pricing Total */}
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[#1A150F]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A150F]/60">Quantity</span>
                <div className="flex items-center gap-3 bg-[#FAF9F5] border border-[#1A150F]/10 rounded-full px-3 py-1">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-6 h-6 rounded-full text-base font-bold text-[#1A150F]/70 hover:text-[#9A5B90] grid place-items-center"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => Math.min(6, prev + 1))}
                    className="w-6 h-6 rounded-full text-base font-bold text-[#1A150F]/70 hover:text-[#9A5B90] grid place-items-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full py-3.5 px-6 rounded-full bg-[#9A5B90] text-white font-bold text-sm hover:bg-[#7E4D77] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{adding ? "Adding..." : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={adding}
                  className="w-full py-3.5 px-6 rounded-full bg-[#141413] text-white font-bold text-sm hover:bg-black active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 flex-wrap mt-5 pt-4 border-t border-[#1A150F]/5 text-[11px] font-medium text-[#1A150F]/70">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#9A5B90]" />
                  Rash-Free Organic Top Sheet
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#1A8D91]" />
                  Free Shipping over ₹599
                </span>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="bg-white border border-[#1A150F]/10 rounded-2xl p-4 shadow-xs">
              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#9A5B90] shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit delivery PIN code"
                  className="flex-1 bg-transparent text-xs sm:text-sm text-[#1A150F] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#9A5B90] text-white font-bold text-xs rounded-xl hover:bg-[#7E4D77] transition-all"
                >
                  Check
                </button>
              </form>

              {pincodeResult && (
                <div
                  className={`mt-3 p-2.5 rounded-xl text-xs font-medium ${
                    pincodeResult.err ? "bg-[#FBF1DA] text-[#7A5A2E]" : "bg-[#E6F0EC] text-[#1F7D78]"
                  }`}
                >
                  {pincodeResult.msg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CYCLE TRACKER SECTION */}
        <section id="cycle-tracker-section" className="mt-16 scroll-mt-24">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F3E6F0] text-[#7E4D77] text-[11px] font-bold uppercase tracking-wider mb-3">
              CYCLE TRACKER
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A150F]">
              When is my next period?
            </h2>
            <p className="text-xs sm:text-sm text-[#1A150F]/70 mt-3 max-w-2xl leading-relaxed">
              Early cycles are often irregular, and that is completely normal. Pop in your last period and we will estimate a window — not an exact day — so you can stay one step ahead.
            </p>

            <div className="mt-8 bg-white border border-[#1A150F]/10 rounded-[28px] p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Form Column */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1A150F]/70 uppercase tracking-wider mb-2">
                      My last period started
                    </label>
                    <div className="relative flex items-center bg-[#F9F7F4] border border-[#1A150F]/15 rounded-2xl px-4 py-3.5 focus-within:border-[#9A5B90] focus-within:ring-2 focus-within:ring-[#9A5B90]/20 transition-all">
                      <input
                        type="date"
                        value={trackerLastDate}
                        onChange={(e) => setTrackerLastDate(e.target.value)}
                        className="w-full bg-transparent text-sm sm:text-base text-[#1A150F] font-semibold focus:outline-none cursor-pointer"
                      />
                      <Calendar className="w-5 h-5 text-[#9A5B90] pointer-events-none absolute right-4 shrink-0" />
                    </div>
                  </div>

                  {/* Cycle Length Slider */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="text-xs font-bold text-[#1A150F]/70 uppercase tracking-wider">
                        My cycle is usually
                      </label>
                      <span className="font-serif text-2xl font-bold text-[#7E4D77]">
                        {trackerCycleLength} days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={21}
                      max={45}
                      value={trackerCycleLength}
                      onChange={(e) => setTrackerCycleLength(Number(e.target.value))}
                      className="w-full accent-[#9A5B90] cursor-pointer h-2 bg-[#EBE5DF] rounded-lg appearance-none"
                    />
                    <p className="text-xs text-[#1A150F]/60 mt-1.5 leading-normal">
                      Not sure? Leave it at 28. You can update it as you learn your pattern.
                    </p>
                  </div>

                  {/* Period Duration Slider */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="text-xs font-bold text-[#1A150F]/70 uppercase tracking-wider">
                        My period usually lasts
                      </label>
                      <span className="font-serif text-2xl font-bold text-[#7E4D77]">
                        {trackerPeriodDuration} days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={10}
                      value={trackerPeriodDuration}
                      onChange={(e) => setTrackerPeriodDuration(Number(e.target.value))}
                      className="w-full accent-[#9A5B90] cursor-pointer h-2 bg-[#EBE5DF] rounded-lg appearance-none"
                    />
                  </div>
                </div>

                {/* Right Results Column */}
                <div className="lg:col-span-6">
                  {!calculatedCycleWindows ? (
                    <div className="h-full min-h-[220px] flex items-center justify-center p-8 text-center rounded-2xl bg-[#FAF8F5] border border-dashed border-[#1A150F]/15">
                      <p className="text-xs sm:text-sm text-[#1A150F]/50 font-medium max-w-xs leading-relaxed">
                        Add your last period date to see your next three estimated windows.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Countdown Card */}
                      <div className="bg-gradient-to-r from-[#F3E6F0] to-[#E4F1F1] rounded-2xl p-4 border border-[#9A5B90]/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white grid place-items-center text-[#7E4D77] shadow-xs shrink-0">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-[#1A150F] text-base sm:text-lg">
                              {calculatedCycleWindows.daysUntilNext > 0
                                ? `Next period in ~${calculatedCycleWindows.daysUntilNext} days`
                                : calculatedCycleWindows.daysUntilNext === 0
                                ? "Period expected today"
                                : "Cycle window in progress"}
                            </h4>
                            <p className="text-xs text-[#1A150F]/70">
                              Estimated Window 1:{" "}
                              {calculatedCycleWindows.windows[0].start.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              –{" "}
                              {calculatedCycleWindows.windows[0].end.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="hidden sm:inline-block px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-[#7E4D77] shadow-xs shrink-0">
                          Window 1
                        </span>
                      </div>

                      {/* 3 Windows Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        {calculatedCycleWindows.windows.map((win, idx) => (
                          <div
                            key={idx}
                            className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
                              idx === 2 ? "col-span-2 sm:col-span-1" : "col-span-1"
                            } ${
                              idx === 0
                                ? "bg-[#FAF1F7] border-[#9A5B90]/40 shadow-xs"
                                : "bg-[#F9F7F4] border-[#1A150F]/10"
                            }`}
                          >
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#7E4D77] bg-white px-2 py-0.5 rounded-md">
                              Window {win.windowNumber}
                            </span>
                            <h5 className="font-serif font-bold text-xs sm:text-sm text-[#1A150F] mt-1.5 sm:mt-2">
                              {win.start.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              –{" "}
                              {win.end.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </h5>
                            <p className="text-[10px] sm:text-[11px] text-[#1A150F]/60 mt-0.5">
                              {win.start.getFullYear()}
                            </p>
                            <div className="mt-2 text-[9px] sm:text-[10px] text-[#7E4D77] font-medium border-t border-[#9A5B90]/15 pt-1.5">
                              Fertile:{" "}
                              {win.fertileStart.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              –{" "}
                              {win.fertileEnd.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Button to sync with Cycle Sync delivery */}
                      <button
                        onClick={() => {
                          setCycleDate(trackerLastDate);
                          setCycleLength(trackerCycleLength);
                          toast.success("Synced date & cycle length to your Cycle Sync delivery!");
                          const elem = document.getElementById("cycle-sync-purchase-option");
                          if (elem) {
                            elem.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="w-full py-3 px-4 rounded-2xl bg-[#9A5B90] hover:bg-[#7E4D77] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                      >
                        <RotateCw className="w-4 h-4" />
                        Sync with Cycle Sync Subscription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section & Referral Card */}
        <section className="mt-16 space-y-6">
          <div className="bg-white border border-[#1A150F]/10 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-5 relative aspect-video md:aspect-auto md:h-full bg-[#F3E6F0]">
              <Image
                src="/homepage/ovy-pads-impact.webp"
                alt="Impact for girls"
                fill
                className="object-cover"
              />
            </div>
            <div className="md:col-span-7 p-6 sm:p-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E4D77] bg-[#F3E6F0] px-3 py-1 rounded-full">
                OUR PROMISE
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A150F] mt-3">
                Every box funds organic period care for schoolgirls across India
              </h3>
              <p className="text-xs sm:text-sm text-[#1A150F]/70 mt-2 leading-relaxed">
                Period dignity starts early. We partner with school health programs to ensure young girls get access to safe, toxin-free, rash-free organic sanitary pads without shame or discomfort.
              </p>
              <div className="flex gap-6 mt-4">
                <div>
                  <b className="font-serif text-2xl font-bold text-[#7E4D77]">100%</b>
                  <span className="block text-[11px] text-[#1A150F]/60">Organic Cotton Top</span>
                </div>
                <div>
                  <b className="font-serif text-2xl font-bold text-[#7E4D77]">50k+</b>
                  <span className="block text-[11px] text-[#1A150F]/60">Teen Girls Supported</span>
                </div>
                <div>
                  <b className="font-serif text-2xl font-bold text-[#7E4D77]">0%</b>
                  <span className="block text-[11px] text-[#1A150F]/60">Toxins & Harsh Chemicals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F7E8F0] to-[#EAF1F2] border-1.5 border-dashed border-[#9A5B90]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white grid place-items-center text-[#7E4D77] shadow-xs shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1A150F]">Gift ₹100 Off to a Friend</h4>
                <p className="text-xs text-[#1A150F]/70">Use promo code TEENFIRST10 for 10% off your first Teen Kit order</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#9A5B90] rounded-xl px-3 py-1.5">
              <span className="font-mono text-sm font-bold text-[#7E4D77]">TEENFIRST10</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("TEENFIRST10");
                  toast.success("Promo code copied!");
                }}
                className="px-3 py-1 bg-[#9A5B90] text-white text-xs font-bold rounded-lg hover:bg-[#7E4D77] transition-all cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </section>

        {/* NEW TO ALL THIS? YOU HAVE GOT THIS */}
        <section className="mt-16">
          <div className="relative bg-gradient-to-r from-[#FAF1F7] via-[#FAF9F5] to-[#EBF6F6] rounded-[28px] p-6 sm:p-10 border border-[#9A5B90]/15 shadow-xs overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-xl text-left z-10">
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A150F] tracking-tight leading-tight">
                New to all this? You have got this.
              </h3>
              <p className="text-xs sm:text-sm text-[#1A150F]/70 mt-3 mb-6 leading-relaxed max-w-lg">
                Periods are normal, and figuring them out should not be scary. Here is everything a first-timer actually wants to know — plus a kit that has your back at school, at practice, and everywhere in between.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTopicModal("101")}
                  className="px-6 py-3 rounded-full bg-[#9A5B90] hover:bg-[#7E4D77] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Start with the basics
                </button>

                <button
                  onClick={() => {
                    const elem = document.getElementById("cycle-tracker-section");
                    if (elem) elem.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 rounded-full border-1.5 border-[#9A5B90] text-[#7E4D77] hover:bg-[#F3E6F0] font-bold text-xs sm:text-sm transition-all cursor-pointer bg-white/80"
                >
                  Track my cycle
                </button>
              </div>
            </div>

            {/* Right Floating Tilted Badges */}
            <div className="relative w-full md:w-[320px] h-[180px] sm:h-[220px] shrink-0 pointer-events-none">
              {/* Badge 1: Rash-free */}
              <div className="absolute top-2 right-4 sm:right-6 bg-[#B05B98] text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-lg transform rotate-6 border border-white/20">
                Rash-free
              </div>

              {/* Badge 2: fits under uniform */}
              <div className="absolute top-14 right-16 sm:right-20 bg-[#2A9D8F] text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-lg transform -rotate-6 border border-white/20">
                fits under uniform
              </div>

              {/* Badge 3: made for first periods */}
              <div className="absolute bottom-12 right-12 sm:right-16 bg-[#E76F51] text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-lg transform rotate-3 border border-white/20">
                made for first periods
              </div>

              {/* Badge 4: silent wrapper */}
              <div className="absolute bottom-2 right-2 sm:right-4 bg-[#E9C46A] text-[#1A150F] text-xs font-bold px-4 py-2 rounded-2xl shadow-lg transform -rotate-6 border border-white/20">
                silent wrapper
              </div>
            </div>
          </div>
        </section>

        {/* FOR PARENTS — Helping her feel ready */}
        <section className="mt-16">
          <div className="bg-[#493945] text-white rounded-[28px] p-6 sm:p-10 shadow-lg border border-[#9A5B90]/20">
            <span className="inline-block bg-white/15 text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3">
              FOR PARENTS
            </span>
            
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Helping her feel ready
            </h3>
            
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed mb-8">
              You do not need the perfect words — just an open, calm one. Here is a simple way in, and what makes a good first kit.
            </p>

            {/* 3 Sub-Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 mb-8">
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
                <h4 className="font-serif text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2">
                  Start the conversation
                </h4>
                <p className="text-[11px] sm:text-xs text-white/75 leading-relaxed">
                  Keep it normal and matter-of-fact. Tell her it happens to everyone, there is no rush to have it all figured out, and she can always come to you with questions.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
                <h4 className="font-serif text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2">
                  What to buy first
                </h4>
                <p className="text-[11px] sm:text-xs text-white/75 leading-relaxed">
                  A mix of sizes beats guessing. The Starter Pack covers light, heavy and overnight in one box, so she is ready whatever her first cycle does.
                </p>
              </div>

              <div className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all">
                <h4 className="font-serif text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2">
                  Reassure her
                </h4>
                <p className="text-[11px] sm:text-xs text-white/75 leading-relaxed">
                  Remind her that irregular early cycles, cramps and changing flow are all normal. Pack a spare in her bag and let her know leaks happen to everyone.
                </p>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <button
              onClick={() => {
                setSelectedKitKey("STARTER");
                window.scrollTo({ top: 100, behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-full bg-[#9A5B90] hover:bg-[#7E4D77] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              Shop the Starter Pack
            </button>
          </div>
        </section>

        {/* Engineered in Layers Section */}
        <WhatsInside />

        {/* Honest Comparison Table Section */}
        <OvyComparison />

        {/* FAQs Section */}
        {/* <section className="mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A150F] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: "What is the difference between the three kits?",
                a: "All are organic pad kits for teens. The Starter Pack (25 pcs) is a two-size start for first or early periods. The Pro-Active Pack (25 pcs) adds the XL+ size and sport wings for active or travelling teens. The First Period Box (50 pcs) is the complete milestone gift box — pads in all sizes, period panty, seat covers, wipes, pain patch and guidebook.",
              },
              {
                q: "Is this a good first-period kit?",
                a: "Yes! The Starter Pack and the First Period Box are made specifically for first periods — a balanced mix of sizes so she is covered whatever the flow, ultra-soft organic top layer, and silent wrappers for school.",
              },
              {
                q: "What are the pads made of?",
                a: "100% organic rash-free soft top sheet with gel-lock core and breathable backsheet. Free from chlorine, parabens, added fragrances, dyes and synthetic plastic top layers.",
              },
              {
                q: "What is Cycle Sync delivery?",
                a: "Cycle Sync times each delivery to arrive about 5 days before her period, based on the cycle dates you specify. You save 15% off and can pause or cancel anytime.",
              },
            ].map((faq, i) => (
              <div key={i} className="border border-[#1A150F]/10 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full p-4 text-left font-bold text-sm text-[#1A150F] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F3E6F0]/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#7E4D77] transition-transform ${openFaqIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openFaqIndex === i && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-[#1A150F]/70 leading-relaxed border-t border-[#1A150F]/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section> */}

        {/* COMPLETE YOUR ROUTINE / YOU MAY ALSO LIKE */}
        <section className="mt-16 border-t border-[#1A150F]/10 pt-12">
          <div className="mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#7E4D77]">
              COMPLETE YOUR ROUTINE
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1A150F] sm:text-4xl mt-1">
              You may also like
            </h2>
          </div>

          {/* Routine Products Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {routineCardConfigs.map((config) => {
              const fullProd = ovyProductsMap[config.slug];
              const variants = Array.isArray(fullProd?.productVariants) && fullProd.productVariants.length > 0
                ? fullProd.productVariants
                : Array.isArray(fullProd?.prodcutVarientBoxRes) && fullProd.prodcutVarientBoxRes.length > 0
                ? fullProd.prodcutVarientBoxRes
                : [];

              const selectedIdx = Math.min(
                selectedRoutineVariantMap[config.slug] || 0,
                Math.max(variants.length - 1, 0)
              );
              const activeVariant = variants[selectedIdx] || variants[0];
              const price = activeVariant?.price
                ? Number(activeVariant.price)
                : fullProd?.startingPrice
                ? Number(fullProd.startingPrice)
                : config.fallbackPrice;
              const title = fullProd?.name || config.fallbackTitle;
              const rawDesc = fullProd?.description ? String(fullProd.description).replace(/<[^>]*>/g, " ").trim() : config.fallbackDesc;
              const desc = rawDesc.split(".")[0] || rawDesc;
              const image = getImageUrl(
                activeVariant?.bannerImage || fullProd?.bannerImage || config.fallbackImg
              );
              const prodId = fullProd?.id || config.slug;
              const variantId = activeVariant?.id;
              const sku = activeVariant?.sku || `${config.slug}-01`;

              return (
                <div
                  key={config.slug}
                  className="bg-white border border-[#1A150F]/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div>
                    <Link href={`/product-detail/${config.slug}`} className="block group">
                      <div className={`relative w-full aspect-4/3 rounded-2xl ${config.bg} flex items-center justify-center p-3 mb-4 overflow-hidden border border-black/5`}>
                        <Image
                          src={image}
                          alt={title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E4D77] bg-[#F3E6F0] px-2.5 py-0.5 rounded-full">
                      {config.tag}
                    </span>

                    <Link href={`/product-detail/${config.slug}`}>
                      <h3 className="font-serif text-base font-bold text-[#1A150F] mt-2 leading-tight hover:text-[#7E4D77] transition-colors">
                        {title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#1A150F]/60 mt-1 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    {/* Variant Selector Dropdown */}
                    {variants.length > 1 && (
                      <div className="mt-3">
                        <select
                          value={selectedIdx}
                          onChange={(e) =>
                            setSelectedRoutineVariantMap((prev) => ({
                              ...prev,
                              [config.slug]: Number(e.target.value),
                            }))
                          }
                          className="w-full px-2.5 py-1.5 bg-[#FAF9F5] border border-[#1A150F]/15 rounded-xl text-xs font-semibold text-[#1A150F] focus:outline-none focus:border-[#9A5B90] cursor-pointer"
                        >
                          {variants.map((v: any, vIdx: number) => (
                            <option key={v.id || vIdx} value={vIdx}>
                              {v.name || `Variant ${vIdx + 1}`} — ₹{v.price}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1A150F]/5">
                    <button
                      onClick={async () => {
                        const added = await addToCartAction({
                          productId: prodId,
                          productVariantId: variantId,
                          sku: sku,
                          slug: config.slug,
                          title: activeVariant?.name ? `${title} (${activeVariant.name})` : title,
                          image: image,
                          price: price,
                          quantity: 1,
                        });
                        if (added !== false) {
                          toast.success(`Added ${title} to cart!`);
                        }
                      }}
                      className="w-full py-2.5 rounded-full bg-[#9A5B90] text-white text-xs font-bold hover:bg-[#7E4D77] transition-all cursor-pointer shadow-xs text-center"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RESTOCK & NEW-DROP ALERTS BANNER */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-[#F7E8F0] via-[#F4EFF8] to-[#E4F1F1] rounded-[28px] p-8 sm:p-10 border border-[#9A5B90]/15 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7E4D77]">
                NEVER MISS OUT
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A150F] tracking-tight">
                Restock &amp; new-drop alerts
              </h3>
              <p className="text-xs sm:text-sm text-[#1A150F]/70 leading-relaxed pt-1">
                Be first to know when a kit restocks or a new Ovy Teen drop lands. No spam — just the useful stuff.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("You're on the list! We'll notify you of restocks & drops.");
              }}
              className="flex items-center gap-3 w-full md:w-auto min-w-[280px] sm:min-w-[420px]"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 bg-white rounded-2xl text-xs sm:text-sm border border-[#1A150F]/15 focus:outline-none focus:border-[#9A5B90] text-[#1A150F] shadow-2xs placeholder:text-[#1A150F]/40"
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-[#9D5B8F] text-white font-bold text-xs sm:text-sm hover:bg-[#7E4D77] transition-all cursor-pointer shrink-0 shadow-md"
              >
                Notify me
              </button>
            </form>
          </div>
        </section>

        {/* Good to Know / Promos Section at the bottom */}
        <OvyPromos onOpenQuiz={() => setQuizOpen(true)} />

        {/* Product Reviews Section */}
        {reviewWithMedia && (
          <section className="mt-16 border-t border-[#1A150F]/10 pt-12">
            <ProductReviews
              reviews={reviewWithMedia}
              product={product}
              themeColor={ovyProductDetailsPage}
            />
          </section>
        )}
      </main>

      {/* Quiz Modal */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setQuizOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setQuizOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF9F5] text-[#1A150F]/60 grid place-items-center hover:text-[#1A150F]"
            >
              <X className="w-4 h-4" />
            </button>

            {quizStep <= 3 ? (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E4D77]">
                  Question {quizStep} of 3
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1A150F] mt-1 mb-4">
                  {quizStep === 1
                    ? "Is this for a first period, or an active teen?"
                    : quizStep === 2
                    ? "What is her daily activity level?"
                    : "What type of kit support would she love?"}
                </h3>

                <div className="space-y-2.5">
                  {quizStep === 1 && (
                    <>
                      <button
                        onClick={() => handleQuizAnswer(1, "first")}
                        className="w-full p-3.5 rounded-2xl border border-[#1A150F]/10 hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 text-left font-semibold text-xs sm:text-sm transition-all"
                      >
                        First period / First time user
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(1, "regular")}
                        className="w-full p-3.5 rounded-2xl border border-[#1A150F]/10 hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 text-left font-semibold text-xs sm:text-sm transition-all"
                      >
                        Regular monthly period care
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(1, "active")}
                        className="w-full p-3.5 rounded-2xl border border-[#1A150F]/10 hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 text-left font-semibold text-xs sm:text-sm transition-all"
                      >
                        Sports player / Tournament traveler
                      </button>
                    </>
                  )}

                  {quizStep === 2 && (
                    <>
                      <button
                        onClick={() => handleQuizAnswer(2, "school")}
                        className="w-full p-3.5 rounded-2xl border border-[#1A150F]/10 hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 text-left font-semibold text-xs sm:text-sm transition-all"
                      >
                        School days & light study routines
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(2, "sports")}
                        className="w-full p-3.5 rounded-2xl border border-[#1A150F]/10 hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 text-left font-semibold text-xs sm:text-sm transition-all"
                      >
                        Active sports, dance & outdoor activities
                      </button>
                    </>
                  )}

                  {quizStep === 3 && (
                    <>
                      <button
                        onClick={() => handleQuizAnswer(3, "basic")}
                        className="w-full p-3.5 rounded-2xl border border-[#1A150F]/10 hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 text-left font-semibold text-xs sm:text-sm transition-all"
                      >
                        Essential pad pack
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(3, "gift")}
                        className="w-full p-3.5 rounded-2xl border border-[#1A150F]/10 hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 text-left font-semibold text-xs sm:text-sm transition-all"
                      >
                        Complete milestone gift box with extras
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="inline-block p-3 rounded-full bg-[#F3E6F0] text-[#7E4D77] mb-3">
                  <Sparkles className="w-6 h-6" />
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A150F]">We recommend:</h3>
                <b className="block font-serif text-3xl font-bold text-[#7E4D77] my-2">
                  {quizResultKit ? KITS_DATA[quizResultKit].label : "Starter Pack"}
                </b>
                <p className="text-xs text-[#1A150F]/70 max-w-xs mx-auto mb-6">
                  {quizResultKit ? KITS_DATA[quizResultKit].short : ""}
                </p>

                <button
                  onClick={handleSelectQuizResult}
                  className="w-full py-3.5 rounded-full bg-[#9A5B90] text-white font-bold text-sm hover:bg-[#7E4D77] transition-all shadow-md cursor-pointer"
                >
                  Select this Kit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Topic Modals for Period School */}
      {activeTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setActiveTopicModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10">
            <button
              onClick={() => setActiveTopicModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF9F5] text-[#1A150F]/60 grid place-items-center hover:text-[#1A150F]"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-xl font-bold text-[#7E4D77] mb-3">
              {activeTopicModal === "101" ? "First-Period 101" : activeTopicModal === "use" ? "How to Use a Pad" : "Cycle & Energy Guide"}
            </h3>
            <p className="text-xs sm:text-sm text-[#1A150F]/80 leading-relaxed">
              {activeTopicModal === "101"
                ? "First periods usually start between ages 10 and 15. Flow can be light or irregular at first — that is 100% normal. Having a starter pack in your school bag ensures you are always prepared!"
                : activeTopicModal === "use"
                ? "1. Peel off the paper back. 2. Press pad firmly onto panty center. 3. Wrap wings around panty edges. 4. Change every 4-6 hours. 5. Roll used pad in disposal bag and trash."
                : "Your cycle has 4 main phases. Energy fluctuates week by week. Eating iron-rich foods, staying hydrated, and keeping gentle stretches active helps relieve cramps."}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Sticky Buy Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1A150F]/10 p-3 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-bold text-[#7E4D77] uppercase">{activeKit.label}</span>
          <b className="font-serif text-lg font-bold text-[#1A150F]">₹{totalPrice}</b>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="px-6 py-2.5 rounded-full bg-[#9A5B90] text-white font-bold text-xs hover:bg-[#7E4D77] transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
