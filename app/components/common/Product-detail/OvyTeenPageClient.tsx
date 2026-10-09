/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  getPdpSubscriptionDiscount,
  getPdpSubscriptionPlans,
} from "@/lib/pdpSubscriptionRules";
import {
  calculateCycleSyncSchedule,
  getMinimumCycleSyncPeriodDate,
} from "@/lib/cycleSync";
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
    badge: "25-piece kit · 10 L + 11 XL + 4 Liners",
    image: "/products/teen.jpg",
    short:
      "Big changes need a gentle start. The Ovy Teen Starter Pack is your first-period kit — 25 essentials curated for unpredictable early cycles, with feather-soft organic pads that will not rash, will not show under a school uniform, and will not make the first time any harder than it needs to be.",
    box: [
      {
        item: "10 Large (L) Pads",
        mm: "240mm",
        for: "Light to medium flow, end of cycle",
        tag: "L",
        bg: "bg-[#E8C8DF]",
      },
      {
        item: "11 Extra Large (XL) Pads",
        mm: "280mm",
        for: "Heavy flow days, overnight protection",
        tag: "XL",
        bg: "bg-[#9A5B90]",
      },
      {
        item: "4 Soft Panty Liners",
        mm: "190mm",
        for: "Spotting, discharge, non-period freshness",
        tag: "LINER",
        bg: "bg-[#F3E6F0]",
      },
      {
        item: "25 Biodegradable Disposal Bags",
        mm: "Pads & liners",
        for: "Easy, private clean-up anywhere",
        tag: "BAG",
        bg: "bg-[#E4F1F1]",
      },
    ],
    total: "25 pieces — a complete monthly supply for one full cycle",
  },
  PRO: {
    key: "PRO",
    label: "Pro-Active Pack",
    pieces: "25-piece kit",
    flow: "Sports & travel kit",
    name: "Ovy Organic Teen Pads — Pro-Active Sports Pack",
    badge: "25-piece kit · 7 L + 7 XL + 7 XL+ + 4 Liners",
    image: "/products/teen-pro.jpg",
    short:
      "Don’t let your period bench you. Bleed. Conquer. Slay. The Ovy Teen Pro-Active Pack is engineered for the girl who refuses to hit pause — sprinting on the field, dancing on stage, travelling for tournaments. Three pad sizes. Maximum movement. Zero leaks.",
    box: [
      {
        item: "7 Large (L) Pads",
        mm: "240mm",
        for: "Practice sessions, lighter flow days",
        tag: "L",
        bg: "bg-[#E8C8DF]",
      },
      {
        item: "7 Extra Large (XL) Pads",
        mm: "280mm",
        for: "Long school days, moderate activity",
        tag: "XL",
        bg: "bg-[#9A5B90]",
      },
      {
        item: "7 Extra Large+ (XL+) Pads",
        mm: "320mm",
        for: "Heavy flow days, intense matches, overnight",
        tag: "XL+",
        bg: "bg-[#7E4D77]",
      },
      {
        item: "4 Soft Panty Liners",
        mm: "190mm",
        for: "Daily freshness, 'just in case' protection",
        tag: "LINER",
        bg: "bg-[#F3E6F0]",
      },
      {
        item: "25 Biodegradable Disposal Bags",
        mm: "Pads & liners",
        for: "Clean-up in any washroom",
        tag: "BAG",
        bg: "bg-[#E4F1F1]",
      },
    ],
    total: "25 pieces — a complete active sports cycle kit",
  },
  FIRST: {
    key: "FIRST",
    label: "First Period Box",
    pieces: "50-piece milestone kit",
    flow: "Complete First Period Gift Box",
    name: "Ovy Organic Teen Pads — First Period Box",
    isComingSoon: true,
    badge: "Coming Soon · 50-piece milestone kit",
    image: "/products/teen_model.jpg",
    short:
      "The ultimate first-period milestone gift box. Packed with 50 premium organic pads across three sizes, panty liners, period panty, toilet seat covers, wipes, pain relief patches, and a friendly step-by-step guidebook.",
    box: [
      {
        item: "14 Large (L) Pads",
        mm: "240mm",
        for: "Lighter flow & school days",
        tag: "L",
        bg: "bg-[#E8C8DF]",
      },
      {
        item: "14 Extra Large (XL) Pads",
        mm: "280mm",
        for: "Regular flow & full days",
        tag: "XL",
        bg: "bg-[#9A5B90]",
      },
      {
        item: "14 Extra Large+ (XL+) Pads",
        mm: "320mm",
        for: "Heavy flow & peaceful night sleep",
        tag: "XL+",
        bg: "bg-[#7E4D77]",
      },
      {
        item: "8 Soft Panty Liners",
        mm: "190mm",
        for: "Daily freshness & spotting",
        tag: "LINER",
        bg: "bg-[#F3E6F0]",
      },
      {
        item: "50 Biodegradable Disposal Bags",
        mm: "Pads & liners",
        for: "Hassle-free private disposal",
        tag: "BAG",
        bg: "bg-[#E4F1F1]",
      },
      {
        item: "1 Period Panty & Extras",
        mm: "Complete Kit",
        for: "Seat covers, wipes, pain patches & guide",
        tag: "GIFT",
        bg: "bg-[#FBF1DA]",
      },
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
  const router = useRouter();
  const [selectedKitKey, setSelectedKitKey] = useState<string>("STARTER");
  const [selectedModeId, setSelectedModeId] = useState<string>("once");
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Reset gallery to the main photo when changing kits
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedKitKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const kitParam = searchParams.get("kit")?.toUpperCase();
    const hash = window.location.hash.toLowerCase();

    if (kitParam === "PRO" || hash.includes("pro")) {
      setSelectedKitKey("PRO");
    } else if (kitParam === "FIRST" || hash.includes("first")) {
      setSelectedKitKey("FIRST");
    } else if (kitParam === "STARTER" || hash.includes("starter")) {
      setSelectedKitKey("STARTER");
    }
  }, []);

  // Selected Variant Map for Routine Products Cards
  const [selectedRoutineVariantMap, setSelectedRoutineVariantMap] = useState<
    Record<string, number>
  >({});

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
      const bgTints = [
        "bg-[#F3E6F0]",
        "bg-[#E4F1F1]",
        "bg-[#FBF1FB]",
        "bg-[#F4F1E8]",
      ];
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
          desc:
            prod.description || "Organic & rash-free menstrual hygiene care.",
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
    return wishlistItems.some((i: any) => i.productId === targetId);
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

  const todayString = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  // Cycle Tracker Calculation Engine
  const calculatedCycleWindows = useMemo(() => {
    if (!trackerLastDate || trackerLastDate > todayString) return null;

    const parts = trackerLastDate.split("-");
    let startDate: Date;
    if (parts.length === 3) {
      startDate = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10),
      );
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
  }, [trackerLastDate, trackerCycleLength, trackerPeriodDuration, todayString]);

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
  const [pincodeResult, setPincodeResult] = useState<{
    msg: string;
    err?: boolean;
  } | null>(null);

  // Learn / Period School Dropdown State
  const [learnDropdownOpen, setLearnDropdownOpen] = useState<boolean>(false);
  const [activeTopicModal, setActiveTopicModal] = useState<string | null>(null);

  // Accordion open FAQs state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Extract Variants from Database
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

  // Helper to match kit key with DB variant
  const getVariantForKitKey = useCallback(
    (key: string) => {
      if (!variantsList || variantsList.length === 0) return null;
      const kitData = KITS_DATA[key];
      const targetName = kitData?.label?.toLowerCase() || key.toLowerCase();

      // Match by label or SKU
      const matched = variantsList.find(
        (v: any) =>
          v.name?.toLowerCase().includes(targetName) ||
          v.sku?.toLowerCase().includes(key.toLowerCase()) ||
          (key === "STARTER" &&
            (v.name?.toLowerCase().includes("starter") ||
              v.sku?.toLowerCase().includes("starter"))) ||
          (key === "PRO" &&
            (v.name?.toLowerCase().includes("pro") ||
              v.sku?.toLowerCase().includes("pro"))) ||
          (key === "FIRST" &&
            (v.name?.toLowerCase().includes("first") ||
              v.sku?.toLowerCase().includes("first"))),
      );
      if (matched) return matched;

      // Fallback by kit index if DB has variants array ordered by kit options
      const kitKeys = Object.keys(KITS_DATA);
      const index = kitKeys.indexOf(key);
      if (index >= 0 && index < variantsList.length) {
        return variantsList[index];
      }

      return variantsList[0];
    },
    [variantsList],
  );

  // Dynamic DB price getter per kit key
  const getDbPriceForKitKey = useCallback(
    (key: string) => {
      const variant = getVariantForKitKey(key);
      if (variant && variant.price !== undefined && variant.price !== null) {
        const parsed = Number(variant.price);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      if (
        product?.basePrice &&
        !isNaN(Number(product.basePrice)) &&
        Number(product.basePrice) > 0
      ) {
        return Number(product.basePrice);
      }
      if (
        product?.startingPrice &&
        !isNaN(Number(product.startingPrice)) &&
        Number(product.startingPrice) > 0
      ) {
        return Number(product.startingPrice);
      }
      if (
        product?.price &&
        !isNaN(Number(product.price)) &&
        Number(product.price) > 0
      ) {
        return Number(product.price);
      }
      return 378;
    },
    [getVariantForKitKey, product],
  );

  // Dynamic DB MRP getter per kit key
  const getDbMrpForKitKey = useCallback(
    (key: string) => {
      const variant = getVariantForKitKey(key);
      if (variant) {
        const strikethrough = Number(variant.strikethroughPrice || variant.mrp);
        if (!isNaN(strikethrough) && strikethrough > 0) return strikethrough;
      }
      if (
        product?.strikethroughPrice &&
        !isNaN(Number(product.strikethroughPrice)) &&
        Number(product.strikethroughPrice) > 0
      ) {
        return Number(product.strikethroughPrice);
      }
      if (
        product?.mrp &&
        !isNaN(Number(product.mrp)) &&
        Number(product.mrp) > 0
      ) {
        return Number(product.mrp);
      }
      const price = getDbPriceForKitKey(key);
      return Math.round(price * 1.18);
    },
    [getVariantForKitKey, getDbPriceForKitKey, product],
  );

  // Match selected kit with DB variant
  const currentVariant = useMemo(() => {
    return getVariantForKitKey(selectedKitKey);
  }, [getVariantForKitKey, selectedKitKey]);

  // Current active Kit configuration
  const activeKit = KITS_DATA[selectedKitKey] || KITS_DATA.STARTER;

  // Base and discounted prices strictly from DB
  const basePrice = useMemo(() => {
    return getDbPriceForKitKey(selectedKitKey);
  }, [getDbPriceForKitKey, selectedKitKey]);

  const mrpPrice = useMemo(() => {
    return getDbMrpForKitKey(selectedKitKey);
  }, [getDbMrpForKitKey, selectedKitKey]);

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

  const isOutOfStock = Boolean(
    currentVariant
      ? currentVariant.isInStock === false || currentVariant.is_in_stock === false
      : variantsList.length > 0
        ? variantsList.every((v: any) => v.isInStock === false || v.is_in_stock === false)
        : product?.isInStock === false || product?.is_in_stock === false,
  );

  // Dynamic Image Media List
  const mediaList = useMemo(() => {
    const images: string[] = [];
    const activeKitImage = KITS_DATA[selectedKitKey]?.image;
    if (activeKitImage) {
      images.push(activeKitImage);
    }
    if (currentVariant?.bannerImage) {
      const vImg = getImageUrl(currentVariant.bannerImage);
      if (vImg) images.push(vImg);
    }
    if (product?.bannerImage) {
      const pImg = getImageUrl(product.bannerImage);
      if (pImg) images.push(pImg);
    }
    Object.values(KITS_DATA).forEach((kit: any) => {
      if (kit.image && kit.image !== activeKitImage) {
        images.push(kit.image);
      }
    });
    if (variantsList.length > 0) {
      variantsList.forEach((v: any) => {
        if (v.bannerImage) {
          const vImg = getImageUrl(v.bannerImage);
          if (vImg) images.push(vImg);
        }
      });
    }
    if (images.length === 0) images.push("/products/teen.jpg");
    return Array.from(new Set(images));
  }, [product, variantsList, currentVariant, selectedKitKey]);

  // Minimum cycle sync date
  const minCycleDateString = useMemo(() => {
    const minDate = getMinimumCycleSyncPeriodDate();
    return minDate.toISOString().split("T")[0];
  }, []);

  // Calculate Cycle Sync schedule preview
  const cycleSchedule = useMemo(() => {
    if (selectedModeId !== "cyclesync" || !cycleDate) return null;
    return calculateCycleSyncSchedule({
      nextPeriodDate: cycleDate,
      cycleLength,
    });
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
      setPincodeResult({
        msg: "Please enter a valid 6-digit PIN code",
        err: true,
      });
      return;
    }
    setPincodeResult({
      msg: `Express Delivery Available to ${pincode}! Delivered in 3-5 business days. Free shipping on orders over ₹399.`,
      err: false,
    });
  };

  // Add To Cart logic preserving exact backend signature
  const handleAddToCart = async (): Promise<boolean> => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock.");
      return false;
    }
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
        image: mediaList[0] || "/products/teen.jpg",
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
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error("Failed to add product to cart. Please try again.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  // Direct Buy Now
  const handleBuyNow = async () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock.");
      return;
    }
    if (selectedModeId === "once") {
      const added = await handleAddToCart();
      if (added) {
        router.push("/checkout");
      }
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
    router.push("/checkout?mode=subscription");
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
    <div className="min-h-screen bg-[#FAF9F5] pb-20 font-sans text-[#1A150F] antialiased">
      {/* Sticky Period School Navigation Header */}
      <nav className="sticky top-0 z-40 border-b border-[#1A150F]/10 bg-[#FAF9F5]/95 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex h-[54px] max-w-[1180px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-[#7E4D77]">
              OVY TEEN
            </span>
            <span className="hidden rounded-full bg-[#F3E6F0] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#7E4D77] uppercase sm:inline-block">
              Organic First-Period Care
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Period School Dropdown button */}
            <div className="relative">
              <button
                onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                className="border-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[#9A5B90] bg-[#F3E6F0] px-3.5 py-1.5 text-xs font-bold text-[#7E4D77] transition-all hover:bg-[#9A5B90] hover:text-white"
                aria-expanded={learnDropdownOpen}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Period School</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${learnDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {learnDropdownOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 absolute top-full right-0 z-50 mt-2 w-[320px] rounded-2xl border border-[#1A150F]/10 bg-white p-4 shadow-2xl duration-200 sm:w-[480px]">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
                        First Period Basics
                      </h4>
                      <button
                        onClick={() => {
                          setActiveTopicModal("101");
                          setLearnDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-left text-xs font-medium text-[#1A150F] transition-colors hover:bg-[#F3E6F0]"
                      >
                        <BookOpen className="h-4 w-4 text-[#9A5B90]" />
                        <div>
                          <b className="block">First-Period 101</b>
                          <span className="text-[11px] text-[#1A150F]/60">
                            What nobody explains
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTopicModal("use");
                          setLearnDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-left text-xs font-medium text-[#1A150F] transition-colors hover:bg-[#F3E6F0]"
                      >
                        <CheckCircle className="h-4 w-4 text-[#9A5B90]" />
                        <div>
                          <b className="block">How to use a pad</b>
                          <span className="text-[11px] text-[#1A150F]/60">
                            6 easy steps
                          </span>
                        </div>
                      </button>
                    </div>

                    <div>
                      <h4 className="mb-2 text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
                        Track & Care
                      </h4>
                      <button
                        onClick={() => {
                          setActiveTopicModal("tracker");
                          setLearnDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-left text-xs font-medium text-[#1A150F] transition-colors hover:bg-[#F3E6F0]"
                      >
                        <Calendar className="h-4 w-4 text-[#1A8D91]" />
                        <div>
                          <b className="block">Cycle & Energy Guide</b>
                          <span className="text-[11px] text-[#1A150F]/60">
                            Week by week changes
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setQuizOpen(true);
                          setLearnDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-left text-xs font-medium text-[#1A150F] transition-colors hover:bg-[#F3E6F0]"
                      >
                        <Zap className="h-4 w-4 text-[#9A5B90]" />
                        <div>
                          <b className="block">Find My Fit Quiz</b>
                          <span className="text-[11px] text-[#1A150F]/60">
                            2-minute recommendation
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedKitKey("FIRST")}
              className="hidden cursor-pointer items-center gap-1 rounded-full bg-[#9A5B90] px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#7E4D77] sm:inline-flex"
            >
              <Gift className="h-3.5 w-3.5" />
              <span>First Period Box</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1180px] px-4 pt-6 md:px-6">
        {/* Kit Selector Toggle (Starter Pack | Pro-Active Pack | First Period Box) */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-full border border-[#1A150F]/10 bg-white p-1.5 shadow-xs">
            {Object.keys(KITS_DATA).map((key) => {
              const kit = KITS_DATA[key];
              const isSelected = selectedKitKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKitKey(key)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    isSelected
                      ? "bg-[#9A5B90] text-white shadow-sm"
                      : "text-[#1A150F]/70 hover:bg-[#F3E6F0] hover:text-[#7E4D77]"
                  }`}
                  aria-selected={isSelected}
                >
                  <span>{kit.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#F3E6F0] text-[#7E4D77]"
                    }`}
                  >
                    {key === "FIRST" ? "Coming soon" : "25 pcs"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery Column */}
          <div className="lg:sticky lg:top-20 lg:col-span-6">
            <div className="relative flex aspect-4/5 items-center justify-center overflow-hidden rounded-3xl border border-[#1A150F]/10 bg-[#FBF1FB] shadow-sm">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#7E4D77] shadow-xs backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#9A5B90]" />
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
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-3xl bg-[#F3E6F0] text-[#7E4D77]">
                    <Heart className="h-16 w-16 fill-[#9A5B90]/20" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-[#7E4D77]">
                    {activeKit.label}
                  </span>
                  <span className="mt-1 text-xs text-[#1A150F]/60">
                    {activeKit.flow}
                  </span>
                </div>
              )}

              {/* Prev / Next controls */}
              {mediaList.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev > 0 ? prev - 1 : mediaList.length - 1,
                      )
                    }
                    className="absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1A150F] shadow-sm transition-all hover:scale-105 hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev < mediaList.length - 1 ? prev + 1 : 0,
                      )
                    }
                    className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1A150F] shadow-sm transition-all hover:scale-105 hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {mediaList.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {mediaList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#9A5B90] ring-2 ring-[#F3E6F0]"
                        : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${idx}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buying & Detail Column */}
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#9A5B90] px-3.5 py-1 text-[11px] font-bold tracking-widest text-white uppercase">
                OVY TEEN ORGANIC PADS
              </span>
              <h1 className="mt-3 font-serif text-3xl leading-tight font-bold text-[#1A150F] sm:text-4xl">
                {activeKit.name}
              </h1>

              {/* Save to Wishlist Button */}
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={isWishlistUpdating}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                    isWishlisted
                      ? "border-rose-300 bg-rose-50 text-rose-600 shadow-xs hover:bg-rose-100"
                      : "border-gray-300/80 bg-white text-gray-700 shadow-xs hover:border-[#9A5B90] hover:text-[#7E4D77]"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-transform active:scale-125 ${
                      isWishlisted
                        ? "fill-rose-500 text-rose-500"
                        : "text-gray-600"
                    }`}
                  />
                  <span>
                    {isWishlisted ? "Saved to wishlist" : "Save to wishlist"}
                  </span>
                </button>
              </div>

              {/* Meta Flow Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-[#F3E6F0] px-3 py-1 text-[#7E4D77]">
                  {activeKit.pieces}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#1A150F]/20" />
                <span className="rounded-full bg-[#E4F1F1] px-3 py-1 text-[#1A8D91]">
                  {activeKit.flow}
                </span>
              </div>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2 text-xs text-[#1A150F]/70">
                <div className="flex text-[#9A5B90]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#1A150F]">5.0</span>
                <span>(304 teen & mom reviews)</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#1A150F]/80 sm:text-base">
                {activeKit.short}
              </p>

              {/* Kit Variant Cards Grid */}
              <div className="my-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-[#1A150F]/70 uppercase">
                    Select Kit Option
                  </span>
                  <span className="text-xs font-semibold text-[#7E4D77] italic">
                    Designed for different flow & activity
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                  {Object.keys(KITS_DATA).map((key) => {
                    const kit = KITS_DATA[key];
                    const isSelected = selectedKitKey === key;
                    const displayPrice = getDbPriceForKitKey(key);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedKitKey(key)}
                        className={`border-1.5 relative cursor-pointer rounded-2xl p-2.5 text-left transition-all sm:p-3.5 ${
                          key === "FIRST"
                            ? "col-span-2 sm:col-span-1"
                            : "col-span-1"
                        } ${
                          isSelected
                            ? "border-[#9A5B90] bg-[#F3E6F0] shadow-sm ring-2 ring-[#9A5B90]/20"
                            : "border-[#1A150F]/15 bg-white hover:border-[#9A5B90]/50 hover:bg-[#F3E6F0]/20"
                        }`}
                        aria-selected={isSelected}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 grid h-4 w-4 place-items-center rounded-full bg-[#9A5B90] text-white">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="pr-4 font-serif text-xs leading-tight font-bold text-[#1A150F] sm:text-sm">
                          {kit.label}
                        </div>
                        <div className="mt-0.5 text-[10px] font-medium text-[#1A150F]/60 sm:text-[11px]">
                          {kit.pieces}
                        </div>
                        <div className="mt-1.5 inline-block rounded bg-[#F3E6F0]/80 px-1.5 py-0.5 text-[9px] font-bold text-[#7E4D77] sm:mt-2 sm:text-[10px]">
                          {key === "FIRST" ? "Coming Soon" : kit.flow}
                        </div>
                        <div className="mt-1.5 font-serif text-xs font-bold text-[#1A150F] sm:mt-2 sm:text-sm">
                          {key === "FIRST" ? "Coming soon" : `₹${displayPrice}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* What's in the Box Breakdown Container */}
            <div className="border-1.5 overflow-hidden rounded-2xl border-[#F3E6F0] bg-white shadow-xs">
              <div className="flex items-center justify-between bg-[#F3E6F0] px-4 py-2.5">
                <span className="text-xs font-bold tracking-wider text-[#7E4D77] uppercase">
                  What's in the Box
                </span>
                <span className="text-xs font-semibold text-[#7E4D77]">
                  {activeKit.pieces}
                </span>
              </div>
              <div className="divide-y divide-[#1A150F]/5">
                {activeKit.box.map((row: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-3.5 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold text-white ${row.bg}`}
                      >
                        {row.tag}
                      </span>
                      <div>
                        <b className="block font-semibold text-[#1A150F]">
                          {row.item}
                        </b>
                        <span className="text-xs text-[#1A150F]/60">
                          {row.for}
                        </span>
                      </div>
                    </div>
                    <span className="rounded bg-[#F3E6F0]/50 px-2 py-1 font-mono text-xs font-semibold text-[#7E4D77]">
                      {row.mm}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#1A150F]/5 bg-[#F4F1E8] p-3 text-center text-xs font-medium text-[#1A150F]/80">
                {activeKit.total}
              </div>
            </div>

            {/* Period Quiz Banner Entry */}
            <button
              onClick={() => setQuizOpen(true)}
              className="border-1.5 group flex w-full cursor-pointer items-center gap-4 rounded-2xl border-[#9A5B90] bg-gradient-to-r from-[#F3E6F0] to-[#E4F1F1] p-4 text-left shadow-sm transition-all hover:-translate-y-0.5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#7E4D77] shadow-xs transition-transform group-hover:scale-105">
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <b className="block text-sm font-bold text-[#1A150F]">
                  Not sure which kit is right?
                </b>
                <span className="text-xs text-[#1A150F]/70">
                  Take our 30-second fit quiz to find her perfect match
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-[#7E4D77] transition-transform group-hover:translate-x-1" />
            </button>

            {/* Buying Options Container */}
            <div className="rounded-3xl border border-[#1A150F]/10 bg-white p-5 shadow-md sm:p-6">
              {activeKit.isComingSoon ? (
                <div className="space-y-3 rounded-2xl border-2 border-dashed border-[#9A5B90]/40 bg-[#FBF1FB]/60 p-6 text-center sm:p-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E6F0] text-[#9A5B90]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1A150F] sm:text-2xl">
                    First Period Box — Coming Soon
                  </h3>
                  <p className="mx-auto max-w-sm text-xs leading-relaxed text-[#1A150F]/70 sm:text-sm">
                    Our 50-piece milestone gift box is currently being prepared
                    and will be launching soon. Nothing is available to buy yet.
                  </p>
                  <div className="pt-2">
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-full bg-gray-200 px-6 py-3.5 text-sm font-bold text-gray-600"
                    >
                      Coming Soon — Not available to buy yet
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="mb-3 block text-xs font-bold tracking-wider text-[#1A150F]/60 uppercase">
                    Select Purchase Mode
                  </span>

                  {/* Purchase Options Grid */}
                  <div className="space-y-3">
                    {/* Buy Once Option */}
                    <button
                      onClick={() => setSelectedModeId("once")}
                      className={`border-1.5 flex w-full cursor-pointer items-center justify-between rounded-2xl p-4 text-left transition-all ${
                        selectedModeId === "once"
                          ? "border-[#9A5B90] bg-[#F3E6F0]/40 shadow-xs"
                          : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selectedModeId === "once" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}
                        >
                          {selectedModeId === "once" && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <b className="block text-sm font-bold text-[#1A150F]">
                            One-Time Order
                          </b>
                          <span className="text-xs text-[#1A150F]/60">
                            Standard single delivery
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <b className="font-serif text-lg font-bold text-[#1A150F]">
                          ₹{basePrice}
                        </b>
                        {mrpPrice > basePrice && (
                          <s className="block text-xs text-[#1A150F]/40">
                            ₹{mrpPrice}
                          </s>
                        )}
                      </div>
                    </button>

                    {/* Cycle Sync Option (15% OFF) */}
                    <div
                      className={`border-1.5 rounded-2xl p-4 text-left transition-all ${
                        selectedModeId === "cyclesync"
                          ? "border-[#9A5B90] bg-gradient-to-r from-[#FBF1FB] to-[#EAF1F1] shadow-xs"
                          : "border-[#9A5B90]/40 bg-gradient-to-r from-[#FBF1FB]/50 to-[#EAF1F1]/50 hover:border-[#9A5B90]"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedModeId("cyclesync")}
                        className="flex w-full cursor-pointer items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selectedModeId === "cyclesync" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}
                          >
                            {selectedModeId === "cyclesync" && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <b className="text-sm font-bold text-[#1A150F]">
                                Cycle Sync Delivery
                              </b>
                              <span className="rounded-full bg-[#9A5B90] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                                Save 15%
                              </span>
                            </div>
                            <span className="text-xs text-[#1A150F]/70">
                              Arrives 5 days before her period
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <b className="font-serif text-lg font-bold text-[#7E4D77]">
                            ₹{Math.round(basePrice * 0.85)}
                          </b>
                          <s className="block text-xs text-[#1A150F]/40">
                            ₹{basePrice}
                          </s>
                        </div>
                      </button>

                      {/* Cycle Sync Date & Length Inputs */}
                      {selectedModeId === "cyclesync" && (
                        <div className="mt-4 space-y-3 border-t border-[#9A5B90]/20 pt-3">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
                                Next Period Date
                              </label>
                              <input
                                type="date"
                                min={minCycleDateString}
                                value={cycleDate}
                                onChange={(e) => setCycleDate(e.target.value)}
                                className="w-full rounded-xl border border-[#1A150F]/20 bg-white px-3 py-2 text-xs focus:border-[#9A5B90] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
                                Cycle Length (Days)
                              </label>
                              <input
                                type="number"
                                min={21}
                                max={45}
                                value={cycleLength}
                                onChange={(e) =>
                                  setCycleLength(Number(e.target.value))
                                }
                                className="w-full rounded-xl border border-[#1A150F]/20 bg-white px-3 py-2 text-xs focus:border-[#9A5B90] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Schedule Result Banner */}
                          {cycleSchedule &&
                          "valid" in cycleSchedule &&
                          cycleSchedule.valid ? (
                            <div className="space-y-1 rounded-xl border border-[#9A5B90]/20 bg-white/80 p-3 text-xs">
                              <span className="font-bold text-[#7E4D77]">
                                Delivery Schedule:
                              </span>
                              <p className="text-[#1A150F]/80">
                                Pads arrive around{" "}
                                <b>
                                  {cycleSchedule.arrivalDate.toDateString()}
                                </b>{" "}
                                (5 days prior to period).
                              </p>
                            </div>
                          ) : (
                            <span className="block text-[11px] text-[#1A150F]/60">
                              Please select her next period date (at least 6
                              days in advance).
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Subscribe & Save Option */}
                    <button
                      onClick={() => setSelectedModeId("sub1")}
                      className={`border-1.5 flex w-full cursor-pointer items-center justify-between rounded-2xl p-4 text-left transition-all ${
                        selectedModeId === "sub1"
                          ? "border-[#9A5B90] bg-[#F3E6F0]/40 shadow-xs"
                          : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selectedModeId === "sub1" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}
                        >
                          {selectedModeId === "sub1" && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-sm font-bold text-[#1A150F]">
                              Subscribe Monthly
                            </b>
                            <span className="rounded-full bg-[#15803D] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                              Save 15%
                            </span>
                          </div>
                          <span className="text-xs text-[#1A150F]/60">
                            Auto-restock every 30 days · Cancel anytime
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <b className="font-serif text-lg font-bold text-[#1A150F]">
                          ₹{Math.round(basePrice * 0.85)}
                        </b>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedModeId("sub2")}
                      className={`border-1.5 flex w-full cursor-pointer items-center justify-between rounded-2xl p-4 text-left transition-all ${
                        selectedModeId === "sub2"
                          ? "border-[#9A5B90] bg-[#F3E6F0]/40 shadow-xs"
                          : "border-[#1A150F]/10 hover:border-[#9A5B90]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selectedModeId === "sub2" ? "border-[#9A5B90] bg-[#9A5B90]" : "border-[#1A150F]/30"}`}
                        >
                          {selectedModeId === "sub2" && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-sm font-bold text-[#1A150F]">
                              Subscribe Every 2 Months
                            </b>
                            <span className="rounded-full bg-[#15803D] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                              Save 12%
                            </span>
                          </div>
                          <span className="text-xs text-[#1A150F]/60">
                            Auto-restock every 60 days · Cancel anytime
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <b className="font-serif text-lg font-bold text-[#1A150F]">
                          ₹{Math.round(basePrice * 0.88)}
                        </b>
                      </div>
                    </button>
                  </div>

                  {/* Gifting Box Option (Enabled for First Period Box) */}
                  {selectedKitKey === "FIRST" && (
                    <div className="mt-4 rounded-2xl border border-[#9A5B90]/30 bg-gradient-to-r from-[#F7E8F0] to-[#EAF1F2] p-4">
                      <label className="flex cursor-pointer items-center gap-3 text-xs font-bold text-[#7E4D77]">
                        <input
                          type="checkbox"
                          checked={isGiftChecked}
                          onChange={(e) => setIsGiftChecked(e.target.checked)}
                          className="h-4 w-4 accent-[#9A5B90]"
                        />
                        <Gift className="h-4 w-4 text-[#9A5B90]" />
                        <span>
                          Include Free Gift Packaging & Personalized Note
                        </span>
                      </label>

                      {isGiftChecked && (
                        <div className="mt-3">
                          <textarea
                            maxLength={200}
                            rows={2}
                            value={giftNote}
                            onChange={(e) => setGiftNote(e.target.value)}
                            placeholder="Write a sweet encouragement message for her first period..."
                            className="w-full rounded-xl border border-[#1A150F]/20 bg-white p-2.5 text-xs focus:border-[#9A5B90] focus:outline-none"
                          />
                          <span className="mt-1 block text-right text-[10px] text-[#1A150F]/50">
                            {giftNote.length}/200 characters
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Selector & Pricing Total */}
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#1A150F]/10 pt-4">
                    <span className="text-xs font-bold tracking-wider text-[#1A150F]/60 uppercase">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 rounded-full border border-[#1A150F]/10 bg-[#FAF9F5] px-3 py-1">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="grid h-6 w-6 place-items-center rounded-full text-base font-bold text-[#1A150F]/70 hover:text-[#9A5B90]"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-bold">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.min(6, prev + 1))
                        }
                        className="grid h-6 w-6 place-items-center rounded-full text-base font-bold text-[#1A150F]/70 hover:text-[#9A5B90]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6">
                    {isOutOfStock ? (
                      <button
                        type="button"
                        disabled
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-200 px-6 py-3.5 text-sm font-bold text-gray-500 shadow-none cursor-not-allowed"
                      >
                        Out of stock
                      </button>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                          onClick={handleAddToCart}
                          disabled={adding}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9A5B90] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#7E4D77] active:scale-[0.98] disabled:opacity-50"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>{adding ? "Adding..." : "Add to Cart"}</span>
                        </button>

                        <button
                          onClick={handleBuyNow}
                          disabled={adding}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#141413] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                        >
                          <span>Buy Now</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Trust Badges */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 border-t border-[#1A150F]/5 pt-4 text-[11px] font-medium text-[#1A150F]/70">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#9A5B90]" />
                  Rash-Free Organic Top Sheet
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-[#1A8D91]" />
                  Free Shipping over ₹399
                </span>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="rounded-2xl border border-[#1A150F]/10 bg-white p-4 shadow-xs">
              <form
                onSubmit={handleCheckPincode}
                className="flex items-center gap-2"
              >
                <MapPin className="h-5 w-5 shrink-0 text-[#9A5B90]" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit delivery PIN code"
                  className="flex-1 bg-transparent text-xs text-[#1A150F] focus:outline-none sm:text-sm"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#9A5B90] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#7E4D77]"
                >
                  Check
                </button>
              </form>

              {pincodeResult && (
                <div
                  className={`mt-3 rounded-xl p-2.5 text-xs font-medium ${
                    pincodeResult.err
                      ? "bg-[#FBF1DA] text-[#7A5A2E]"
                      : "bg-[#E6F0EC] text-[#1F7D78]"
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
            <span className="mb-3 inline-block rounded-full bg-[#F3E6F0] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
              CYCLE TRACKER
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1A150F] sm:text-4xl lg:text-5xl">
              When is my next period?
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[#1A150F]/70 sm:text-sm">
              Early cycles are often irregular, and that is completely normal.
              Pop in your last period and we will estimate a window — not an
              exact day — so you can stay one step ahead.
            </p>

            <div className="mt-8 rounded-[28px] border border-[#1A150F]/10 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                {/* Left Form Column */}
                <div className="space-y-6 lg:col-span-6">
                  {/* Date Input */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-[#1A150F]/70 uppercase">
                      My last period started
                    </label>
                    <div className="relative flex items-center rounded-2xl border border-[#1A150F]/15 bg-[#F9F7F4] px-4 py-3.5 transition-all focus-within:border-[#9A5B90] focus-within:ring-2 focus-within:ring-[#9A5B90]/20">
                      <input
                        type="date"
                        max={todayString}
                        value={trackerLastDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && val > todayString) {
                            toast.error("Last period date cannot be in the future. Please select today or a past date.");
                            return;
                          }
                          setTrackerLastDate(val);
                        }}
                        className="w-full cursor-pointer bg-transparent text-sm font-semibold text-[#1A150F] focus:outline-none sm:text-base"
                      />
                      <Calendar className="pointer-events-none absolute right-4 h-5 w-5 shrink-0 text-[#9A5B90]" />
                    </div>
                  </div>

                  {/* Cycle Length Slider */}
                  <div>
                    <div className="mb-2 flex items-baseline justify-between">
                      <label className="text-xs font-bold tracking-wider text-[#1A150F]/70 uppercase">
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
                      onChange={(e) =>
                        setTrackerCycleLength(Number(e.target.value))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#EBE5DF] accent-[#9A5B90]"
                    />
                    <p className="mt-1.5 text-xs leading-normal text-[#1A150F]/60">
                      Not sure? Leave it at 28. You can update it as you learn
                      your pattern.
                    </p>
                  </div>

                  {/* Period Duration Slider */}
                  <div>
                    <div className="mb-2 flex items-baseline justify-between">
                      <label className="text-xs font-bold tracking-wider text-[#1A150F]/70 uppercase">
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
                      onChange={(e) =>
                        setTrackerPeriodDuration(Number(e.target.value))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#EBE5DF] accent-[#9A5B90]"
                    />
                  </div>
                </div>

                {/* Right Results Column */}
                <div className="lg:col-span-6">
                  {!calculatedCycleWindows ? (
                    <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#1A150F]/15 bg-[#FAF8F5] p-8 text-center">
                      <p className="max-w-xs text-xs leading-relaxed font-medium text-[#1A150F]/50 sm:text-sm">
                        Add your last period date to see your next three
                        estimated windows.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Countdown Card */}
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#9A5B90]/20 bg-gradient-to-r from-[#F3E6F0] to-[#E4F1F1] p-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#7E4D77] shadow-xs">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-serif text-base font-bold text-[#1A150F] sm:text-lg">
                              {calculatedCycleWindows.daysUntilNext > 0
                                ? `Next period in ~${calculatedCycleWindows.daysUntilNext} days`
                                : calculatedCycleWindows.daysUntilNext === 0
                                  ? "Period expected today"
                                  : "Cycle window in progress"}
                            </h4>
                            <p className="text-xs text-[#1A150F]/70">
                              Estimated Window 1:{" "}
                              {calculatedCycleWindows.windows[0].start.toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}{" "}
                              –{" "}
                              {calculatedCycleWindows.windows[0].end.toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <span className="hidden shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#7E4D77] shadow-xs sm:inline-block">
                          Window 1
                        </span>
                      </div>

                      {/* 3 Windows Cards */}
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                        {calculatedCycleWindows.windows.map((win, idx) => (
                          <div
                            key={idx}
                            className={`rounded-2xl border p-3 transition-all sm:p-3.5 ${
                              idx === 2
                                ? "col-span-2 sm:col-span-1"
                                : "col-span-1"
                            } ${
                              idx === 0
                                ? "border-[#9A5B90]/40 bg-[#FAF1F7] shadow-xs"
                                : "border-[#1A150F]/10 bg-[#F9F7F4]"
                            }`}
                          >
                            <span className="rounded-md bg-white px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#7E4D77] uppercase sm:text-[10px]">
                              Window {win.windowNumber}
                            </span>
                            <h5 className="mt-1.5 font-serif text-xs font-bold text-[#1A150F] sm:mt-2 sm:text-sm">
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
                            <p className="mt-0.5 text-[10px] text-[#1A150F]/60 sm:text-[11px]">
                              {win.start.getFullYear()}
                            </p>
                            <div className="mt-2 border-t border-[#9A5B90]/15 pt-1.5 text-[9px] font-medium text-[#7E4D77] sm:text-[10px]">
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
                          if (!trackerLastDate || trackerLastDate > todayString) {
                            toast.error("Please enter a valid past period date first.");
                            return;
                          }
                          const nextPredicted = calculatedCycleWindows?.firstWindowStart
                            ? calculatedCycleWindows.firstWindowStart
                                .toISOString()
                                .split("T")[0]
                            : trackerLastDate;
                          setCycleDate(nextPredicted);
                          setCycleLength(trackerCycleLength);
                          toast.success(
                            "Synced predicted next period date & cycle length to your Cycle Sync delivery!",
                          );
                          const elem = document.getElementById(
                            "cycle-sync-purchase-option",
                          );
                          if (elem) {
                            elem.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#9A5B90] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#7E4D77] sm:text-sm"
                      >
                        <RotateCw className="h-4 w-4" />
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
          <div className="grid grid-cols-1 items-center overflow-hidden rounded-3xl border border-[#1A150F]/10 bg-white shadow-sm md:grid-cols-12">
            <div className="relative aspect-video bg-[#F3E6F0] md:col-span-5 md:aspect-auto md:h-full">
              <Image
                src="/ovy/m2-school.jpg"
                alt="Impact for girls"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 md:col-span-7">
              <span className="rounded-full bg-[#F3E6F0] px-3 py-1 text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
                OUR PROMISE
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-[#1A150F]">
                Every box funds organic period care for schoolgirls across India
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#1A150F]/70 sm:text-sm">
                Period dignity starts early. We partner with school health
                programs to ensure young girls get access to safe, toxin-free,
                rash-free organic sanitary pads without shame or discomfort.
              </p>
              <div className="mt-4 flex gap-6">
                <div>
                  <b className="font-serif text-2xl font-bold text-[#7E4D77]">
                    100%
                  </b>
                  <span className="block text-[11px] text-[#1A150F]/60">
                    Organic Cotton Top
                  </span>
                </div>
                <div>
                  <b className="font-serif text-2xl font-bold text-[#7E4D77]">
                    50k+
                  </b>
                  <span className="block text-[11px] text-[#1A150F]/60">
                    Teen Girls Supported
                  </span>
                </div>
                <div>
                  <b className="font-serif text-2xl font-bold text-[#7E4D77]">
                    0%
                  </b>
                  <span className="block text-[11px] text-[#1A150F]/60">
                    Toxins & Harsh Chemicals
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Card */}
          <div className="border-1.5 flex flex-col items-center justify-between gap-4 rounded-3xl border-dashed border-[#9A5B90]/40 bg-gradient-to-r from-[#F7E8F0] to-[#EAF1F2] p-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#7E4D77] shadow-xs">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1A150F]">
                  Gift ₹100 Off to a Friend
                </h4>
                <p className="text-xs text-[#1A150F]/70">
                  Use promo code TEENFIRST10 for 10% off your first Teen Kit
                  order
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#9A5B90] bg-white px-3 py-1.5">
              <span className="font-mono text-sm font-bold text-[#7E4D77]">
                TEENFIRST10
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("TEENFIRST10");
                  toast.success("Promo code copied!");
                }}
                className="cursor-pointer rounded-lg bg-[#9A5B90] px-3 py-1 text-xs font-bold text-white transition-all hover:bg-[#7E4D77]"
              >
                Copy
              </button>
            </div>
          </div>
        </section>

        {/* NEW TO ALL THIS? YOU HAVE GOT THIS */}
        <section className="mt-16">
          <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[28px] border border-[#9A5B90]/15 bg-gradient-to-r from-[#FAF1F7] via-[#FAF9F5] to-[#EBF6F6] p-6 shadow-xs sm:p-10 md:flex-row">
            {/* Left Content */}
            <div className="z-10 max-w-xl text-left">
              <h3 className="font-serif text-3xl leading-tight font-bold tracking-tight text-[#1A150F] sm:text-4xl lg:text-5xl">
                New to all this? You have got this.
              </h3>
              <p className="mt-3 mb-6 max-w-lg text-xs leading-relaxed text-[#1A150F]/70 sm:text-sm">
                Periods are normal, and figuring them out should not be scary.
                Here is everything a first-timer actually wants to know — plus a
                kit that has your back at school, at practice, and everywhere in
                between.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTopicModal("101")}
                  className="cursor-pointer rounded-full bg-[#9A5B90] px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#7E4D77] sm:text-sm"
                >
                  Start with the basics
                </button>

                <button
                  onClick={() => {
                    const elem = document.getElementById(
                      "cycle-tracker-section",
                    );
                    if (elem) elem.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border-1.5 cursor-pointer rounded-full border-[#9A5B90] bg-white/80 px-6 py-3 text-xs font-bold text-[#7E4D77] transition-all hover:bg-[#F3E6F0] sm:text-sm"
                >
                  Track my cycle
                </button>
              </div>
            </div>

            {/* Right Floating Tilted Badges */}
            <div className="pointer-events-none relative h-[180px] w-full shrink-0 sm:h-[220px] md:w-[320px]">
              {/* Badge 1: Rash-free */}
              <div className="absolute top-2 right-4 rotate-6 transform rounded-2xl border border-white/20 bg-[#B05B98] px-4 py-2 text-xs font-bold text-white shadow-lg sm:right-6">
                Rash-free
              </div>

              {/* Badge 2: fits under uniform */}
              <div className="absolute top-14 right-16 -rotate-6 transform rounded-2xl border border-white/20 bg-[#2A9D8F] px-4 py-2 text-xs font-bold text-white shadow-lg sm:right-20">
                fits under uniform
              </div>

              {/* Badge 3: made for first periods */}
              <div className="absolute right-12 bottom-12 rotate-3 transform rounded-2xl border border-white/20 bg-[#E76F51] px-4 py-2 text-xs font-bold text-white shadow-lg sm:right-16">
                made for first periods
              </div>

              {/* Badge 4: silent wrapper */}
              <div className="absolute right-2 bottom-2 -rotate-6 transform rounded-2xl border border-white/20 bg-[#E9C46A] px-4 py-2 text-xs font-bold text-[#1A150F] shadow-lg sm:right-4">
                silent wrapper
              </div>
            </div>
          </div>
        </section>

        {/* FOR PARENTS — Helping her feel ready */}
        <section className="mt-16">
          <div className="rounded-[28px] border border-[#9A5B90]/20 bg-[#493945] p-6 text-white shadow-lg sm:p-10">
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-bold tracking-widest text-white uppercase">
              FOR PARENTS
            </span>

            <h3 className="mb-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Helping her feel ready
            </h3>

            <p className="mb-8 max-w-2xl text-xs leading-relaxed text-white/80 sm:text-sm">
              You do not need the perfect words — just an open, calm one. Here
              is a simple way in, and what makes a good first kit.
            </p>

            {/* 3 Sub-Cards Grid */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xs transition-all hover:bg-white/15 sm:p-5">
                <h4 className="mb-1.5 font-serif text-sm font-bold text-white sm:mb-2 sm:text-base">
                  Start the conversation
                </h4>
                <p className="text-[11px] leading-relaxed text-white/75 sm:text-xs">
                  Keep it normal and matter-of-fact. Tell her it happens to
                  everyone, there is no rush to have it all figured out, and she
                  can always come to you with questions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xs transition-all hover:bg-white/15 sm:p-5">
                <h4 className="mb-1.5 font-serif text-sm font-bold text-white sm:mb-2 sm:text-base">
                  What to buy first
                </h4>
                <p className="text-[11px] leading-relaxed text-white/75 sm:text-xs">
                  A mix of sizes beats guessing. The Starter Pack covers light,
                  heavy and overnight in one box, so she is ready whatever her
                  first cycle does.
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xs transition-all hover:bg-white/15 sm:p-5 md:col-span-1">
                <h4 className="mb-1.5 font-serif text-sm font-bold text-white sm:mb-2 sm:text-base">
                  Reassure her
                </h4>
                <p className="text-[11px] leading-relaxed text-white/75 sm:text-xs">
                  Remind her that irregular early cycles, cramps and changing
                  flow are all normal. Pack a spare in her bag and let her know
                  leaks happen to everyone.
                </p>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <button
              onClick={() => {
                setSelectedKitKey("STARTER");
                window.scrollTo({ top: 100, behavior: "smooth" });
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#9A5B90] px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-[#7E4D77] sm:text-sm"
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
            <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
              COMPLETE YOUR ROUTINE
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-[#1A150F] sm:text-4xl">
              You may also like
            </h2>
          </div>

          {/* Routine Products Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {routineCardConfigs.map((config) => {
              const fullProd = ovyProductsMap[config.slug];
              const variants =
                Array.isArray(fullProd?.productVariants) &&
                fullProd.productVariants.length > 0
                  ? fullProd.productVariants
                  : Array.isArray(fullProd?.prodcutVarientBoxRes) &&
                      fullProd.prodcutVarientBoxRes.length > 0
                    ? fullProd.prodcutVarientBoxRes
                    : [];

              const selectedIdx = Math.min(
                selectedRoutineVariantMap[config.slug] || 0,
                Math.max(variants.length - 1, 0),
              );
              const activeVariant = variants[selectedIdx] || variants[0];
              const price = activeVariant?.price
                ? Number(activeVariant.price)
                : fullProd?.startingPrice
                  ? Number(fullProd.startingPrice)
                  : config.fallbackPrice;
              const title = fullProd?.name || config.fallbackTitle;
              const rawDesc = fullProd?.description
                ? String(fullProd.description)
                    .replace(/<[^>]*>/g, " ")
                    .trim()
                : config.fallbackDesc;
              const desc = rawDesc.split(".")[0] || rawDesc;
              const image = getImageUrl(
                activeVariant?.bannerImage ||
                  fullProd?.bannerImage ||
                  config.fallbackImg,
              );
              const prodId = fullProd?.id || config.slug;
              const variantId = activeVariant?.id;
              const sku = activeVariant?.sku || `${config.slug}-01`;

              return (
                <div
                  key={config.slug}
                  className="flex flex-col justify-between rounded-2xl border border-[#1A150F]/10 bg-white p-3 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-5"
                >
                  <div>
                    <Link
                      href={`/product-detail/${config.slug}`}
                      className="group block"
                    >
                      <div
                        className={`relative aspect-4/3 w-full rounded-2xl ${config.bg} mb-4 flex items-center justify-center overflow-hidden border border-black/5 p-3`}
                      >
                        <Image
                          src={image}
                          alt={title}
                          fill
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <span className="rounded-full bg-[#F3E6F0] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#7E4D77] uppercase">
                      {config.tag}
                    </span>

                    <Link href={`/product-detail/${config.slug}`}>
                      <h3 className="mt-2 font-serif text-base leading-tight font-bold text-[#1A150F] transition-colors hover:text-[#7E4D77]">
                        {title}
                      </h3>
                    </Link>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#1A150F]/60">
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
                          className="w-full cursor-pointer rounded-xl border border-[#1A150F]/15 bg-[#FAF9F5] px-2.5 py-1.5 text-xs font-semibold text-[#1A150F] focus:border-[#9A5B90] focus:outline-none"
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

                  <div className="mt-4 border-t border-[#1A150F]/5 pt-3">
                    {config.slug?.includes("ovy-panty") || activeVariant?.isInStock === false ? (
                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-full bg-gray-200 py-2.5 text-center text-xs font-bold text-gray-500 shadow-none"
                      >
                        Out of stock
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const added = await addToCartAction({
                            productId: prodId,
                            productVariantId: variantId,
                            sku: sku,
                            slug: config.slug,
                            title: activeVariant?.name
                              ? `${title} (${activeVariant.name})`
                              : title,
                            image: image,
                            price: price,
                            quantity: 1,
                          });
                          if (added !== false) {
                            toast.success(`Added ${title} to cart!`);
                          }
                        }}
                        className="w-full cursor-pointer rounded-full bg-[#9A5B90] py-2.5 text-center text-xs font-bold text-white shadow-xs transition-all hover:bg-[#7E4D77]"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RESTOCK & NEW-DROP ALERTS BANNER */}
        <section className="mt-16">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[28px] border border-[#9A5B90]/15 bg-gradient-to-r from-[#F7E8F0] via-[#F4EFF8] to-[#E4F1F1] p-8 shadow-xs sm:p-10 md:flex-row">
            <div className="max-w-xl space-y-1.5 text-center md:text-left">
              <span className="text-[11px] font-extrabold tracking-widest text-[#7E4D77] uppercase">
                NEVER MISS OUT
              </span>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-[#1A150F] sm:text-4xl">
                Restock &amp; new-drop alerts
              </h3>
              <p className="pt-1 text-xs leading-relaxed text-[#1A150F]/70 sm:text-sm">
                Be first to know when a kit restocks or a new Ovy Teen drop
                lands. No spam — just the useful stuff.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(
                  "You're on the list! We'll notify you of restocks & drops.",
                );
              }}
              className="flex w-full min-w-[280px] items-center gap-3 sm:min-w-[420px] md:w-auto"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#1A150F]/15 bg-white px-5 py-3.5 text-xs text-[#1A150F] shadow-2xs placeholder:text-[#1A150F]/40 focus:border-[#9A5B90] focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                className="shrink-0 cursor-pointer rounded-full bg-[#9D5B8F] px-7 py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#7E4D77] sm:text-sm"
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
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setQuizOpen(false)}
          />
          <div className="animate-in zoom-in-95 relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl duration-200">
            <button
              onClick={() => setQuizOpen(false)}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-[#FAF9F5] text-[#1A150F]/60 hover:text-[#1A150F]"
            >
              <X className="h-4 w-4" />
            </button>

            {quizStep <= 3 ? (
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
                  Question {quizStep} of 3
                </span>
                <h3 className="mt-1 mb-4 font-serif text-xl font-bold text-[#1A150F]">
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
                        className="w-full rounded-2xl border border-[#1A150F]/10 p-3.5 text-left text-xs font-semibold transition-all hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 sm:text-sm"
                      >
                        First period / First time user
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(1, "regular")}
                        className="w-full rounded-2xl border border-[#1A150F]/10 p-3.5 text-left text-xs font-semibold transition-all hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 sm:text-sm"
                      >
                        Regular monthly period care
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(1, "active")}
                        className="w-full rounded-2xl border border-[#1A150F]/10 p-3.5 text-left text-xs font-semibold transition-all hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 sm:text-sm"
                      >
                        Sports player / Tournament traveler
                      </button>
                    </>
                  )}

                  {quizStep === 2 && (
                    <>
                      <button
                        onClick={() => handleQuizAnswer(2, "school")}
                        className="w-full rounded-2xl border border-[#1A150F]/10 p-3.5 text-left text-xs font-semibold transition-all hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 sm:text-sm"
                      >
                        School days & light study routines
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(2, "sports")}
                        className="w-full rounded-2xl border border-[#1A150F]/10 p-3.5 text-left text-xs font-semibold transition-all hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 sm:text-sm"
                      >
                        Active sports, dance & outdoor activities
                      </button>
                    </>
                  )}

                  {quizStep === 3 && (
                    <>
                      <button
                        onClick={() => handleQuizAnswer(3, "basic")}
                        className="w-full rounded-2xl border border-[#1A150F]/10 p-3.5 text-left text-xs font-semibold transition-all hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 sm:text-sm"
                      >
                        Essential pad pack
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(3, "gift")}
                        className="w-full rounded-2xl border border-[#1A150F]/10 p-3.5 text-left text-xs font-semibold transition-all hover:border-[#9A5B90] hover:bg-[#F3E6F0]/50 sm:text-sm"
                      >
                        Complete milestone gift box with extras
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <span className="mb-3 inline-block rounded-full bg-[#F3E6F0] p-3 text-[#7E4D77]">
                  <Sparkles className="h-6 w-6" />
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A150F]">
                  We recommend:
                </h3>
                <b className="my-2 block font-serif text-3xl font-bold text-[#7E4D77]">
                  {quizResultKit
                    ? KITS_DATA[quizResultKit].label
                    : "Starter Pack"}
                </b>
                <p className="mx-auto mb-6 max-w-xs text-xs text-[#1A150F]/70">
                  {quizResultKit ? KITS_DATA[quizResultKit].short : ""}
                </p>

                <button
                  onClick={handleSelectQuizResult}
                  className="w-full cursor-pointer rounded-full bg-[#9A5B90] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#7E4D77]"
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
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setActiveTopicModal(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setActiveTopicModal(null)}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-[#FAF9F5] text-[#1A150F]/60 hover:text-[#1A150F]"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-3 font-serif text-xl font-bold text-[#7E4D77]">
              {activeTopicModal === "101"
                ? "First-Period 101"
                : activeTopicModal === "use"
                  ? "How to Use a Pad"
                  : "Cycle & Energy Guide"}
            </h3>
            <p className="text-xs leading-relaxed text-[#1A150F]/80 sm:text-sm">
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
      <div className="fixed right-0 bottom-[56px] left-0 z-40 flex items-center justify-between gap-3 border-t border-[#1A150F]/10 bg-white/95 p-3 shadow-lg backdrop-blur-md lg:hidden">
        {activeKit.isComingSoon ? (
          <div className="flex w-full items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-[#7E4D77] uppercase">
                {activeKit.label}
              </span>
              <b className="font-serif text-sm font-bold text-[#1A150F]">
                Coming Soon
              </b>
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-full bg-gray-200 px-5 py-2 text-xs font-bold text-gray-600"
            >
              Coming Soon
            </button>
          </div>
        ) : (
          <>
            <div>
              <span className="block text-[10px] font-bold text-[#7E4D77] uppercase">
                {activeKit.label}
              </span>
              <b className="font-serif text-lg font-bold text-[#1A150F]">
                ₹{totalPrice}
              </b>
            </div>
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <button
                  disabled
                  className="cursor-not-allowed rounded-full bg-gray-200 px-4 py-2 text-xs font-bold text-gray-500 shadow-none"
                >
                  Out of stock
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="cursor-pointer rounded-full bg-[#9A5B90] px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#7E4D77] disabled:opacity-50"
                  >
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={adding}
                    className="cursor-pointer rounded-full bg-[#141413] px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-black disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
