/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Info,
  Leaf,
  Loader2,
  Lock,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import { addToCart as addToCartAction } from "@/store/cartActions";
import SizeSelectorBox from "./sizeSelectorBox";
import WhatsInside from "./WhatsInside";
import OvyComparison from "./OvyComparison";
import OvyPromos from "./OvyPromos";
import { toast } from "sonner";
import { subscriptionPlans } from "@/const/globalconst";
import { getImageUrl } from "@/lib/imageUrl";
import {
  calculateMixBoxPricing,
  normalizeMixBoxRecipe,
  normalizePadSize,
  type MixBoxSelection,
} from "@/lib/mixYourBox";
import {
  calculateCycleSyncSchedule,
  getMinimumCycleSyncPeriodDate,
} from "@/lib/cycleSync";
import {
  applyDiscounts,
  getFreeShippingThreshold,
  getMaxBoxes,
  getModeDiscount,
  getProductStaticContent,
  getStaticBullets,
  getStaticShortText,
  getStaticSpecs,
  getStaticVariantInfo,
  getVolumeDiscount,
  resolveStaticSizeKey,
} from "@/lib/productStaticContent";

const BUY_ONCE_PLAN = {
  id: "buy_once",
  label: "Buy Once (One-time order)",
  discountPercentage: 0,
  period: 0,
  subscriptionType: "buy_once",
};

type DeliveryStatus =
  | {
      type: "idle";
      message?: string;
      courier?: never;
    }
  | {
      type: "available";
      message: string;
      courier?: {
        name?: string;
        estimatedDeliveryDays?: string | number;
        freightCharge?: number;
      };
    }
  | {
      type: "unavailable" | "error";
      message: string;
      courier?: never;
    };

const getProductPlanDiscount = (productInfo: any, planType?: string | null) => {
  const discountByPlan: Record<string, number> = {
    monthly: Number(productInfo?.subscribeMonthlyDiscount || 0),
    every_2_months: Number(productInfo?.subscribeBiMontlyDiscount || 0),
    cycle_sync: Number(productInfo?.cycleSyncDiscount || 0),
  };
  const discount = discountByPlan[planType || ""] || 0;

  return discount > 0 ? discount / 100 : 0;
};

export default function ProductDetailPage({
  productInfo,
  themeColor,
}: any) {
  const router = useRouter();

  const variantsList = Array.isArray(productInfo?.productVariants)
    ? productInfo.productVariants
    : Array.isArray(productInfo?.prodcutVarientBoxRes)
      ? productInfo.prodcutVarientBoxRes
      : [];
  const defaultVariant = variantsList[0] || productInfo;
  const getPickedVariantSelection = (variant: any) => [
    {
      name: variant?.name || productInfo?.name,
      quantity: 21,
      price: Number(variant?.price || 0),
    },
  ];

  const defaultSize = defaultVariant.size || "XL (280mm)";
  const defaultFlow = defaultVariant.flowType || "Medium to Heavy Flow";

  const [selectedPlanType, setSelectedPlanType] = useState("pickSize");
  const [selectedVarient, setSelectedVarient] = useState<any>(
    getPickedVariantSelection(defaultVariant),
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedFlow, setSelectedFlow] = useState(defaultFlow);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(BUY_ONCE_PLAN);
  const [cycleSync, setCycleSync] = useState({
    nextPeriodDate: "",
    cycleLength: 28,
  });
  const [activeVariant, setActiveVariant] = useState(defaultVariant);
  const initialImage =
    defaultVariant?.bannerImage ||
    defaultVariant?.image ||
    productInfo?.bannerImage ||
    productInfo?.productMediaRes?.[0]?.mediaURL ||
    "";
  const [activeImage, setActiveImage] = useState(initialImage);
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>({
    type: "idle",
  });
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  const [cartSizes, setCartSizes] = useState<any>([]);
  const [total, setTotal] = useState(0);

  // UI state for Quiz & Comparison & Sticky bar
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    flow: "",
    leaks: "",
    duration: "",
  });
  const [showSizeCompare, setShowSizeCompare] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const staticContent = useMemo(
    () => getProductStaticContent(productInfo),
    [productInfo],
  );
  const staticSizeKey = resolveStaticSizeKey(
    selectedSize,
    activeVariant,
    staticContent,
  );
  const canCustomizeBox = Boolean(
    productInfo?.isMixBox || productInfo?.hasVarientBox,
  );
  const isMixBoxCheckout = canCustomizeBox && selectedPlanType === "mixYourBox";
  const isQuantityChangable = !isMixBoxCheckout;
  const staticVariantInfo = getStaticVariantInfo(staticContent, staticSizeKey);

  const productImages = useMemo(() => {
    const list = [
      activeVariant?.bannerImage,
      activeVariant?.image,
      productInfo?.bannerImage,
      ...(productInfo?.productMediaRes || []).map((item: any) => item?.mediaURL),
    ].filter(Boolean);
    return Array.from(new Set(list));
  }, [activeVariant, productInfo]);

  const displayDescription =
    getStaticShortText(staticVariantInfo, staticContent) ||
    activeVariant?.description ||
    productInfo?.description;
  const displayHighlights =
    getStaticBullets(staticVariantInfo).length > 0
      ? getStaticBullets(staticVariantInfo)
      : activeVariant?.highlights || productInfo?.highlights || [
          "100% Organic Top Sheet — Soft, breathable & rash-free",
          "Super Absorbent SAP Gel Core for maximum leak protection",
          "Includes 100% Biodegradable Disposal Bags with every pad",
          "Extra-wide stay-in-place wings for all-day confidence",
          "Dermatologically Tested & pH-Balanced for sensitive skin",
          "Zero Chlorine, Fragrances, Parabens or Synthetic Dyes",
        ];

  const staticSpecs = getStaticSpecs(staticContent, staticSizeKey);
  const quickSpecs = staticSpecs.length > 0 ? staticSpecs.slice(0, 4) : [
    { label: "Top Sheet", value: "100% Organic Cotton" },
    { label: "Absorbency Core", value: "Super-absorbent SAP Gel" },
    { label: "Disposal", value: "100% Biodegradable Bags" },
    { label: "Skin Safety", value: "pH-balanced, Toxin-free" },
  ];

  const maxBoxes = getMaxBoxes(
    staticContent,
    productInfo?.maxQuantityPurchase || 6,
  );
  const freeShippingThreshold = getFreeShippingThreshold(
    staticContent,
    productInfo?.freeShippingOver || 599,
  );

  const availableSubscriptionPlans = subscriptionPlans.filter((plan) => {
    if (plan.subscriptionType === "cycle_sync") {
      return Boolean(productInfo?.allowCycleSync ?? true);
    }
    return Boolean(productInfo?.allowSubscription ?? true);
  });
  const shownSubscriptionPlans = [BUY_ONCE_PLAN, ...availableSubscriptionPlans];
  const subscriptionType = selectedPlan?.subscriptionType ?? "buy_once";
  const purchaseType =
    subscriptionType === "buy_once" ? "one_time" : "subscription";
  const selectedMixBoxItems =
    isMixBoxCheckout && Array.isArray(selectedVarient)
      ? selectedVarient
      : cartSizes;
  const mixBoxRecipe = normalizeMixBoxRecipe(
    selectedMixBoxItems
      .map((item: any): MixBoxSelection | null => {
        const size = normalizePadSize(`${item.size ?? ""} ${item.name ?? ""}`);
        return size ? { size, quantity: item.quantity } : null;
      })
      .filter(Boolean) as MixBoxSelection[],
  );
  const cycleSyncSchedule =
    subscriptionType === "cycle_sync" && cycleSync.nextPeriodDate
      ? calculateCycleSyncSchedule(cycleSync)
      : null;

  const effectivePurchaseType = purchaseType;
  const effectiveSubscriptionType =
    effectivePurchaseType === "subscription" && subscriptionType !== "buy_once"
      ? subscriptionType
      : null;

  const mixBoxPricing = isMixBoxCheckout
    ? calculateMixBoxPricing({
        recipe: mixBoxRecipe,
        setPrice: activeVariant?.price || 349,
        purchaseType: "one_time",
        subscriptionType: null,
      })
    : null;

  const subscriptionDiscount = effectiveSubscriptionType
    ? getProductPlanDiscount(productInfo, effectiveSubscriptionType) ||
      getModeDiscount(staticContent, effectiveSubscriptionType) || 0.15
    : 0;
  const volumeDiscount = isMixBoxCheckout
    ? 0
    : getVolumeDiscount(staticContent, quantity);
  const baseVariantPrice = Number(activeVariant?.price || productInfo?.price || 349);
  const discountedVariantPrice = applyDiscounts(
    baseVariantPrice,
    subscriptionDiscount,
    volumeDiscount,
  );
  const effectiveUnitPrice = isMixBoxCheckout
    ? mixBoxPricing?.valid
      ? applyDiscounts(mixBoxPricing.price, subscriptionDiscount)
      : 0
    : discountedVariantPrice;
  const currentOrderValue = isMixBoxCheckout
    ? effectiveUnitPrice
    : effectiveUnitPrice * quantity;
  const baseOrderValueForPlan = isMixBoxCheckout
    ? mixBoxPricing?.valid
      ? mixBoxPricing.price
      : 0
    : applyDiscounts(baseVariantPrice, volumeDiscount) * quantity;

  const totalAmount = useMemo(() => {
    if (isMixBoxCheckout) {
      return mixBoxPricing?.valid ? currentOrderValue : "NA";
    }
    return currentOrderValue;
  }, [currentOrderValue, isMixBoxCheckout, mixBoxPricing]);

  const totalDiscount = Math.round(
    (subscriptionDiscount + volumeDiscount) * 100,
  );

  const syncHash = (sizeKey: string | null) => {
    if (!sizeKey || typeof window === "undefined") return;
    const hash =
      staticContent?.SIZES?.[sizeKey]?.hash || `#${sizeKey.toLowerCase()}`;
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${hash}`,
    );
    window.dispatchEvent(new Event("hashchange"));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        if (window.scrollY > 450) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const search = window.location.search;
      if (
        hash === "#starter" ||
        hash.includes("starter") ||
        search.includes("starter")
      ) {
        setTimeout(() => {
          document
            .getElementById("starter")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 350);
      }
    }
  }, []);

  useEffect(() => {
    if (!staticContent || typeof window === "undefined") return;
    const hashSizeKey = resolveStaticSizeKey(
      window.location.hash,
      activeVariant,
      staticContent,
    );
    const hashVariant = variantsList.find(
      (variant: any) =>
        resolveStaticSizeKey(variant.size, variant, staticContent) ===
        hashSizeKey,
    );

    if (hashVariant && hashVariant.id !== activeVariant?.id) {
      setSelectedSize(hashVariant.size || selectedSize);
      setSelectedFlow(hashVariant.flowType || selectedFlow);
      setActiveVariant(hashVariant);
      if (hashVariant.bannerImage || hashVariant.image) {
        setActiveImage(hashVariant.bannerImage || hashVariant.image);
      }
    } else {
      syncHash(staticSizeKey);
    }
  }, []);

  useEffect(() => {
    syncHash(staticSizeKey);
  }, [staticSizeKey]);

  useEffect(() => {
    if (!canCustomizeBox && selectedPlanType === "mixYourBox") {
      const firstVarientInfo = productInfo?.prodcutVarientBoxRes?.[0];
      setSelectedPlanType("pickSize");
      if (firstVarientInfo) {
        setSelectedVarient(getPickedVariantSelection(firstVarientInfo));
        handleVariantChange(firstVarientInfo);
      }
    }
  }, [canCustomizeBox, selectedPlanType, productInfo?.prodcutVarientBoxRes]);

  const addToCart = async () => {
    if (isMixBoxCheckout) {
      if (!mixBoxPricing?.valid) {
        toast.error(
          mixBoxPricing?.message ??
            "Complete your box before adding it to cart.",
        );
        return;
      }
    }

    if (subscriptionType === "cycle_sync") {
      if (!cycleSyncSchedule?.valid) {
        toast.error(
          cycleSyncSchedule?.message ?? "Enter valid Cycle Sync details.",
        );
        return;
      }
    }

    const result = await addToCartAction({
      productId: productInfo.id,
      productVariantId: activeVariant?.id,
      sku: activeVariant?.sku || `${selectedSize}-${selectedFlow}`,
      slug: productInfo?.slug || "",
      title: activeVariant?.name || productInfo?.name,
      price: typeof effectiveUnitPrice === "number" ? effectiveUnitPrice : 349,
      selectedPlan: selectedPlan,
      isSubscribed: effectivePurchaseType === "subscription",
      image:
        activeVariant?.bannerImage ||
        activeVariant?.image ||
        productInfo?.bannerImage ||
        "/product.png",
      originalPrice: activeVariant?.strikethroughPrice,
      cartSizes: isQuantityChangable ? [] : selectedMixBoxItems,
      mixBoxRecipe: isMixBoxCheckout ? mixBoxRecipe : undefined,
      totalPads:
        isMixBoxCheckout && mixBoxPricing?.valid
          ? mixBoxPricing.totalPads
          : undefined,
      boxCount:
        isMixBoxCheckout && mixBoxPricing?.valid
          ? mixBoxPricing.boxCount
          : undefined,
      freeLiners:
        isMixBoxCheckout && mixBoxPricing?.valid
          ? mixBoxPricing.freeLiners
          : undefined,
      purchaseType: effectivePurchaseType,
      subscriptionType: effectiveSubscriptionType,
      cycleSync:
        effectiveSubscriptionType === "cycle_sync" ? cycleSync : undefined,
      isQuantityChangable: isQuantityChangable,
      quantity: isMixBoxCheckout ? 1 : quantity,
      ...(isMixBoxCheckout ? { uuid: crypto.randomUUID() } : {}),
    });

    toast.success("Added to cart!");
    return result;
  };

  const subscribeToCart = (plan: any) => {
    const nextPlan = plan || BUY_ONCE_PLAN;
    setSelectedPlan(nextPlan);
    setIsSubscribed(nextPlan.subscriptionType !== "buy_once");
  };

  const handleBuyNow = async () => {
    if (effectivePurchaseType !== "subscription") {
      const added = await addToCart();
      if (added) router.push("/checkout");
      return;
    }

    if (isMixBoxCheckout && !mixBoxPricing?.valid) {
      toast.error(
        mixBoxPricing?.message ?? "Complete your box before checkout.",
      );
      return;
    }

    if (
      effectiveSubscriptionType === "cycle_sync" &&
      !cycleSyncSchedule?.valid
    ) {
      toast.error(
        cycleSyncSchedule?.message ?? "Enter valid Cycle Sync details.",
      );
      return;
    }

    window.sessionStorage.setItem(
      "potent-subscription-checkout",
      JSON.stringify({
        productId: productInfo.id,
        productVariantId: activeVariant?.id,
        quantity: isMixBoxCheckout ? 1 : quantity,
        subscriptionType: effectiveSubscriptionType,
        selectedPlan,
        mixBoxRecipe: isMixBoxCheckout ? mixBoxRecipe : undefined,
        totalPads:
          isMixBoxCheckout && mixBoxPricing?.valid
            ? mixBoxPricing.totalPads
            : undefined,
        boxCount:
          isMixBoxCheckout && mixBoxPricing?.valid
            ? mixBoxPricing.boxCount
            : undefined,
        freeLiners:
          isMixBoxCheckout && mixBoxPricing?.valid
            ? mixBoxPricing.freeLiners
            : undefined,
        cycleSync:
          effectiveSubscriptionType === "cycle_sync" ? cycleSync : undefined,
      }),
    );

    router.push("/checkout?mode=subscription");
  };

  const formatDeliveryDate = (dateValue?: string | null) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const checkDeliveryEstimate = async () => {
    const pincode = deliveryPincode.trim();
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryStatus({
        type: "error",
        message: "Enter a valid 6-digit PIN code.",
      });
      return;
    }

    setIsCheckingDelivery(true);
    setDeliveryStatus({ type: "idle" });

    try {
      const response = await fetch("/api/shiprocket/serviceability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryPincode: pincode,
          pickupPincode: activeVariant?.pickupPincode || productInfo?.pickupPincode,
          weight: activeVariant?.weightKg || productInfo?.weightKg || 0.3,
          cod: false,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.serviceable) {
        setDeliveryStatus({
          type: "unavailable",
          message: payload?.message || "Delivery unavailable at this PIN code.",
        });
        return;
      }

      const formattedDate = formatDeliveryDate(payload?.courier?.etaDate);
      const fallbackDays = payload?.courier?.estimatedDeliveryDays;
      const deliveryMessage = formattedDate
        ? `Expected delivery by ${formattedDate}`
        : fallbackDays
          ? `Expected delivery in ${fallbackDays} days`
          : "Delivery is available for this PIN code.";

      setDeliveryStatus({
        type: "available",
        message: deliveryMessage,
        courier: payload.courier,
      });
    } catch (error) {
      console.error("Delivery check failed:", error);
      setDeliveryStatus({
        type: "error",
        message: "Unable to check delivery availability right now.",
      });
    } finally {
      setIsCheckingDelivery(false);
    }
  };

  const handleVariantChange = (variant: any) => {
    setActiveVariant(variant);
    if (variant.size) setSelectedSize(variant.size);
    if (variant.flowType) setSelectedFlow(variant.flowType);
    if (variant.bannerImage || variant.image) {
      setActiveImage(variant.bannerImage || variant.image);
    }
    syncHash(resolveStaticSizeKey(variant.size || variant.name, variant, staticContent));
  };

  const formatCycleDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const minimumCycleSyncPeriodDate = formatDateInputValue(
    getMinimumCycleSyncPeriodDate(),
  );

  // Gallery Prev / Next navigation
  const currentImageIndex = productImages.indexOf(activeImage);
  const handlePrevImage = () => {
    if (productImages.length <= 1) return;
    const nextIdx = currentImageIndex <= 0 ? productImages.length - 1 : currentImageIndex - 1;
    setActiveImage(productImages[nextIdx]);
  };
  const handleNextImage = () => {
    if (productImages.length <= 1) return;
    const nextIdx = (currentImageIndex + 1) % productImages.length;
    setActiveImage(productImages[nextIdx]);
  };

  // Quiz Recommendation Calculation
  const recommendedQuizResult = useMemo(() => {
    const { flow, leaks, duration } = quizAnswers;
    if (flow === "variable" || duration === "7+" || (flow === "heavy" && duration === "5-7")) {
      return {
        size: "Mix Your Box",
        badge: "RECOMMENDED FOR YOUR CYCLE",
        why: "Your period flow varies across your cycle. Mix Your Box gives you L for light days, XL for regular days, and XL+ for heavy flow & overnight in a single box!",
        type: "mixYourBox",
        variantSize: "Mix Your Box",
        price: Number(activeVariant?.price || 349),
        image: activeVariant?.bannerImage || productInfo?.bannerImage,
      };
    }
    if (flow === "extra_heavy" || leaks === "often") {
      const match = variantsList.find((v: any) => v.size?.includes("320"));
      return {
        size: "XL+ (320mm)",
        badge: "BEST MATCH FOR HEAVY FLOW",
        why: "Maximum length (320mm) with dual leak guards to give you complete protection during heavy flow days and overnight peace of mind.",
        type: "pickSize",
        variantSize: "XL+ (320mm)",
        price: Number(match?.price || 349),
        image: match?.bannerImage || match?.image || activeVariant?.bannerImage || productInfo?.bannerImage,
      };
    }
    if (flow === "light") {
      const match = variantsList.find((v: any) => v.size?.includes("240"));
      return {
        size: "L (240mm)",
        badge: "BEST MATCH FOR LIGHT FLOW",
        why: "Compact 240mm length designed for light flow, spotting, and comfortable everyday wear during your lighter period days.",
        type: "pickSize",
        variantSize: "L (240mm)",
        price: Number(match?.price || 299),
        image: match?.bannerImage || match?.image || activeVariant?.bannerImage || productInfo?.bannerImage,
      };
    }
    const match = variantsList.find((v: any) => v.size?.includes("280"));
    return {
      size: "XL (280mm)",
      badge: "MOST POPULAR CHOICE",
      why: "Versatile 280mm length for regular-to-heavy flow. High absorption core ensures up to 8 hours of rash-free comfort.",
      type: "pickSize",
      variantSize: "XL (280mm)",
      price: Number(match?.price || 349),
      image: match?.bannerImage || match?.image || activeVariant?.bannerImage || productInfo?.bannerImage,
    };
  }, [quizAnswers, activeVariant, productInfo, variantsList]);

  const applyQuizRecommendation = () => {
    if (recommendedQuizResult.type === "mixYourBox") {
      if (canCustomizeBox) {
        setSelectedPlanType("mixYourBox");
        const variants = productInfo.prodcutVarientBoxRes || [];
        const baseQuantity = Math.floor(21 / Math.max(variants.length, 1));
        let remaining = 21;
        const selectedVarientInfo = variants.map((item: any, index: number) => {
          const qty = index === variants.length - 1 ? remaining : baseQuantity;
          remaining -= qty;
          return { name: item.name, quantity: qty, price: Number(item.price || 0) };
        });
        setCartSizes(selectedVarientInfo);
        setSelectedVarient(selectedVarientInfo);
        setTotal(21);
      }
    } else {
      setSelectedPlanType("pickSize");
      const targetSize = recommendedQuizResult.variantSize;
      const match = variantsList.find(
        (v: any) => v.size === targetSize || v.name?.includes(targetSize?.split(" ")[0]),
      );
      if (match) {
        handleVariantChange(match);
      }
    }
    setIsQuizOpen(false);
  };

  const handleDirectQuizAddToCart = async () => {
    applyQuizRecommendation();
    const targetSize = recommendedQuizResult.variantSize;
    const targetVariant = variantsList.find(
      (v: any) => v.size === targetSize || v.name?.includes(targetSize?.split(" ")[0]),
    ) || activeVariant;

    const basePrice = Number(recommendedQuizResult.price || targetVariant?.price || 349);

    await addToCartAction({
      productId: productInfo.id,
      productVariantId: targetVariant?.id,
      sku: targetVariant?.sku || `${recommendedQuizResult.size}`,
      slug: productInfo?.slug || "",
      title: `${targetVariant?.name || productInfo?.name} (${recommendedQuizResult.size})`,
      price: basePrice,
      selectedPlan: BUY_ONCE_PLAN,
      isSubscribed: false,
      image: recommendedQuizResult.image || targetVariant?.bannerImage || "/product.png",
      quantity: 1,
      isQuantityChangable: true,
      purchaseType: "one_time",
      subscriptionType: null,
    });

    toast.success(`${recommendedQuizResult.size} added to cart!`);
    setIsQuizOpen(false);
  };

  return (
    <div id="starter" className="max-w-[1180px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-10 pb-16">
      {/* Top View Toggle: Pick a Size vs Mix Your Box */}
      <div className="mx-auto mb-6 sm:mb-8 flex justify-center">
        <div className="inline-flex gap-1 rounded-full border border-gray-200/80 bg-white p-1 shadow-xs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={selectedPlanType === "pickSize"}
            onClick={() => {
              setSelectedPlanType("pickSize");
              const firstVariant = variantsList[0] || productInfo;
              setSelectedVarient(getPickedVariantSelection(firstVariant));
              handleVariantChange(firstVariant);
            }}
            className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              selectedPlanType === "pickSize"
                ? "bg-[#9A5B90] text-white shadow-xs"
                : "text-[#1A150F]/70 hover:text-[#1A150F]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Pick a Size
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPlanType === "mixYourBox"}
            disabled={!canCustomizeBox}
            onClick={() => {
              if (!canCustomizeBox) return;
              setSelectedPlanType("mixYourBox");
              const variants = productInfo.prodcutVarientBoxRes || [];
              const baseQuantity = Math.floor(21 / Math.max(variants.length, 1));
              let remaining = 21;
              const selectedVarientInfo = variants.map((item: any, index: number) => {
                const qty = index === variants.length - 1 ? remaining : baseQuantity;
                remaining -= qty;
                return { name: item.name, quantity: qty, price: Number(item.price || 0) };
              });
              setCartSizes(selectedVarientInfo);
              setSelectedVarient(selectedVarientInfo);
              setTotal(selectedVarientInfo.reduce((s: number, i: any) => s + i.quantity, 0));
            }}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              !canCustomizeBox
                ? "cursor-not-allowed text-black/40"
                : selectedPlanType === "mixYourBox"
                  ? "bg-[#9A5B90] text-white shadow-xs"
                  : "cursor-pointer text-[#1A150F]/70 hover:text-[#1A150F]"
            }`}
          >
            <PackageCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Mix Your Box
            {!canCustomizeBox && (
              <span className="ml-0.5 rounded-full bg-[#F3E6F0] px-1.5 py-0.5 font-sans text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#7E4D77]">
                Soon
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main PDP Grid (Aligned 12 Column Layout like Looway) */}
      <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
        {/* LEFT COLUMN: Gallery & Product Badges (6 Columns out of 12) */}
        <div className="lg:col-span-6 static lg:sticky lg:top-24 space-y-4 sm:space-y-6">
          <div>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-[#FBF1FB] shadow-xs flex items-center justify-center p-3 sm:p-6">
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#7E4D77] shadow-xs backdrop-blur-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#7E4D77]" /> 100% Organic Cotton • Dermatologically Tested
                </span>
              </div>

              {activeImage ? (
                <div className="relative h-full w-full p-4 sm:p-6">
                  <Image
                    src={getImageUrl(activeImage)}
                    alt={activeVariant?.name || productInfo?.name || "Ovy Organic Pad"}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-2 sm:p-4"
                  />
                </div>
              ) : (
                <div className="grid h-full place-items-center p-6 sm:p-8 text-center text-gray-500">
                  <div>
                    <Sparkles className="mx-auto mb-2 h-7 w-7 sm:h-8 sm:w-8 text-[#9A5B90]" />
                    <p className="font-semibold text-gray-900">Ovy Organic Pad</p>
                  </div>
                </div>
              )}

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute top-1/2 left-2 sm:left-3 z-10 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 text-[#1A150F] shadow-md transition-all hover:scale-105 hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-2 sm:right-3 z-10 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 text-[#1A150F] shadow-md transition-all hover:scale-105 hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}

              <span className="absolute bottom-3 sm:bottom-4 left-1/2 z-10 -translate-x-1/2 font-caveat text-lg sm:text-xl whitespace-nowrap text-[#7E4D77]/90">
                soft, rash-free & super absorbent
              </span>
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="no-scrollbar mt-3 sm:mt-4 flex gap-2.5 sm:gap-3 overflow-x-auto pb-1">
                {productImages.slice(0, 5).map((imgUrl: string, idx: number) => (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    aria-selected={activeImage === imgUrl}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border-2 bg-[#F4F1E8] transition-all ${
                      activeImage === imgUrl ? "border-[#9A5B90] ring-2 ring-[#9A5B90]/20 opacity-100" : "border-gray-200/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={getImageUrl(imgUrl)}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Product Bullet Highlights */}
          <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-2.5">
            {displayHighlights.slice(0, 6).map((highlight: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-base leading-snug text-[#1A150F]/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 sm:h-4.5 sm:w-4.5 flex-none text-[#9A5B90]" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Buying Controls (6 Columns out of 12) */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          {/* Brand Tag Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#9A5B90] px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-white">
            {productInfo?.brand === "loway" ? "LOOWAY HYGIENE" : "OVY ORGANIC MENSTRUATION"}
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-2xl font-bold leading-tight text-[#1A150F] sm:text-4xl lg:text-[40px]">
            {productInfo?.name || "Ovy Organic Soft Sanitary Pads"}
          </h1>

          {/* Size & Meta Summary */}
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-medium text-gray-600">
            <span>{selectedPlanType === "mixYourBox" ? "Custom Box (21 Pads)" : activeVariant?.size || selectedSize}</span>
            <span className="h-1 w-1 rounded-full bg-gray-400" />
            <span>21 Pads + 4 Free Liners</span>
            <span className="h-1 w-1 rounded-full bg-gray-400" />
            <span className="rounded-full bg-[#F3E6F0] px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-[#7E4D77]">
              {selectedPlanType === "mixYourBox" ? "All Flow Types" : activeVariant?.flowType || selectedFlow || "Medium to Heavy Flow"}
            </span>
          </div>

          {/* Rating Row */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="inline-flex gap-0.5 text-[#9A5B90]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-[#9A5B90] text-[#9A5B90]" />
              ))}
            </div>
            <span><b>4.8/5</b> (1,420+ verified reviews)</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-base leading-relaxed text-gray-600">
            <strong className="font-semibold text-[#1A150F]">Rash-free, toxin-free organic sanitary pads</strong> with a super-absorbent SAP gel core & 100% biodegradable disposal bags. Dermatologically tested and pH-balanced for total peace of mind.
          </p>

          {/* Size Selector Grid (for Pick a Size mode) */}
          {selectedPlanType === "pickSize" && (
            <div>
              <div className="mb-2.5 flex items-baseline justify-between">
                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-gray-700">SELECT SIZE</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuizOpen(true);
                    setQuizStep(0);
                  }}
                  className="cursor-pointer font-caveat text-sm sm:text-base font-semibold text-[#7E4D77] underline underline-offset-2 hover:text-[#9A5B90]"
                >
                  Find My Fit (Size Quiz) →
                </button>
              </div>

              {/* Variant Size Cards Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {variantsList.map((variant: any, idx: number) => {
                  const isSelected = activeVariant?.id === variant.id || selectedSize === variant.size;
                  const sizeName = variant.size?.split(" ")[0] || variant.name?.split(" ")[0] || `Size ${idx + 1}`;
                  const mmText = variant.size?.match(/\((.*?)\)/)?.[1] || (idx === 0 ? "240mm" : idx === 1 ? "280mm" : "320mm");
                  const flowDesc = variant.flowType || (idx === 0 ? "Light Flow" : idx === 1 ? "Medium-Heavy" : "Heavy & Overnight");

                  return (
                    <button
                      key={variant.id || idx}
                      type="button"
                      aria-selected={isSelected}
                      onClick={() => handleVariantChange(variant)}
                      className={`relative w-full cursor-pointer rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-4 text-left transition-all ${
                        isSelected
                          ? "border-[#9A5B90] bg-[#F3E6F0] shadow-xs"
                          : "border-gray-200/80 bg-white hover:-translate-y-0.5 hover:border-[#9A5B90]"
                      }`}
                    >
                      <div className="font-serif text-base sm:text-xl font-semibold text-[#1A150F]">{sizeName}</div>
                      <div className="mt-0.5 text-[10px] sm:text-xs font-medium text-gray-600">{mmText} • ₹{variant.price || 349}</div>
                      <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-semibold tracking-tight text-[#7E4D77] line-clamp-1">{flowDesc}</div>
                      <div
                        className={`absolute top-2 right-2 sm:top-3.5 sm:right-3.5 flex h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full bg-[#9A5B90] text-white transition-all ${
                          isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        }`}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Size Comparison Expander / Quick Table */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowSizeCompare(!showSizeCompare)}
                  className="cursor-pointer text-xs font-semibold text-[#7E4D77] underline underline-offset-2 hover:text-[#9A5B90]"
                >
                  {showSizeCompare ? "Hide Size Comparison Table" : "View Size Comparison Table ↓"}
                </button>
                {showSizeCompare && (
                  <div className="mt-4 overflow-hidden rounded-2xl border-2 border-[#F3E6F0] bg-white">
                    <div className="bg-[#F3E6F0] p-3 px-4">
                      <span className="text-xs font-extrabold tracking-wider uppercase text-[#7E4D77]">SIZE COMPARISON CHART</span>
                    </div>
                    <table className="w-full border-collapse text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 font-serif text-sm font-semibold text-[#1A150F]">
                          <th className="p-3" />
                          <th className={`p-3 text-center ${selectedSize.includes("240") ? "bg-[#F3E6F0] text-[#7E4D77]" : ""}`}>L</th>
                          <th className={`p-3 text-center ${selectedSize.includes("280") ? "bg-[#F3E6F0] text-[#7E4D77]" : ""}`}>XL</th>
                          <th className={`p-3 text-center ${selectedSize.includes("320") ? "bg-[#F3E6F0] text-[#7E4D77]" : ""}`}>XL+</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-600">
                        <tr>
                          <th className="p-3 font-semibold text-[#1A150F]">Length</th>
                          <td className="p-3 text-center">240mm</td>
                          <td className="p-3 text-center">280mm</td>
                          <td className="p-3 text-center">320mm</td>
                        </tr>
                        <tr>
                          <th className="p-3 font-semibold text-[#1A150F]">Flow</th>
                          <td className="p-3 text-center">Light</td>
                          <td className="p-3 text-center">Medium/Heavy</td>
                          <td className="p-3 text-center">Heavy/Night</td>
                        </tr>
                        <tr>
                          <th className="p-3 font-semibold text-[#1A150F]">Coverage</th>
                          <td className="p-3 text-center">Standard</td>
                          <td className="p-3 text-center">Extended</td>
                          <td className="p-3 text-center">Maximum</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Size Quiz CTA Highlighted Banner */}
          <button
            type="button"
            onClick={() => {
              setIsQuizOpen(true);
              setQuizStep(0);
            }}
            className="flex w-full cursor-pointer items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border-2 border-[#9A5B90] bg-gradient-to-r from-[#F3E6F0] to-[#E4F1F1] p-3.5 sm:p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 flex-none items-center justify-center rounded-xl sm:rounded-2xl bg-white text-[#7E4D77] shadow-xs">
              <Sparkles className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="block text-xs sm:text-base font-bold tracking-tight text-[#1A150F]">Unsure which size is right for your flow?</b>
              <span className="text-[11px] sm:text-sm text-gray-600">Take our 30-second Period Fit Quiz for a custom recommendation</span>
            </div>
            <div className="flex-none text-[#7E4D77]">
              <ArrowRight className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" />
            </div>
          </button>

          {/* BUY BOX CONTAINER */}
          <div className="space-y-4 sm:space-y-5 rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-7 shadow-sm">
            {/* Plan Selection Header */}
            <div className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-gray-500">SELECT ORDER TYPE & FREQUENCY</div>

            {/* Plan Cards Stack */}
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
              {shownSubscriptionPlans.map((plan: any) => {
                const isSelected = selectedPlan?.id === plan.id;
                const schemaDiscount = getProductPlanDiscount(
                  productInfo,
                  plan.subscriptionType,
                );
                const discountPercentage = schemaDiscount
                  ? Math.round(schemaDiscount * 100)
                  : plan.discountPercentage || (plan.id !== "buy_once" ? 15 : 0);
                const discountedPrice = discountPercentage > 0
                  ? baseOrderValueForPlan - baseOrderValueForPlan * (discountPercentage / 100)
                  : baseOrderValueForPlan;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => subscribeToCart(plan)}
                    className={`relative flex w-full cursor-pointer items-center gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 text-left transition-all ${
                      isSelected
                        ? "border-[#9A5B90] bg-[#F3E6F0] shadow-xs"
                        : "border-gray-200/80 bg-white hover:border-[#9A5B90]"
                    }`}
                  >
                    <div
                      className={`relative h-4.5 w-4.5 flex-none rounded-full border-2 transition-all ${
                        isSelected ? "border-[#9A5B90] bg-[#9A5B90]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-1 rounded-full bg-white" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap text-sm font-semibold text-[#1A150F]">
                        <span>{plan.label}</span>
                        {discountPercentage > 0 && (
                          <span className="rounded-full bg-[#9A5B90] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                            SAVE {discountPercentage}%
                          </span>
                        )}
                        {plan.subscriptionType === "cycle_sync" && (
                          <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                            CYCLE SYNCED
                          </span>
                        )}
                      </div>
                      <span className="mt-0.5 block text-xs text-gray-500">
                        {plan.id === "buy_once"
                          ? "Single box order, no commitment"
                          : plan.subscriptionType === "cycle_sync"
                            ? "Delivered 5 days before every period"
                            : `Delivered & billed automatically every ${plan.subscriptionType === "every_2_months" ? "60" : "30"} days. Pause/cancel anytime.`}
                      </span>
                    </div>

                    <div className="flex-none text-right whitespace-nowrap">
                      <b className="font-serif text-lg font-semibold text-[#1A150F]">₹{Math.round(discountedPrice)}</b>
                      {discountPercentage > 0 && (
                        <s className="mt-0.5 block text-xs text-gray-400">₹{Math.round(baseOrderValueForPlan)}</s>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cycle Sync Inputs when Cycle Sync Plan Selected */}
            {subscriptionType === "cycle_sync" && (
              <div className="my-4 space-y-3 rounded-2xl border border-[#F3E6F0] bg-[#FAF9F5] p-4 sm:p-5">
                <div className="flex items-center gap-3 rounded-xl border border-[#F3E6F0] bg-gradient-to-r from-[#F5E7F1] to-[#E4F1F1] p-3.5">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white text-[#7E4D77]">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-xs sm:text-sm leading-snug text-gray-600">
                    <b className="font-bold text-[#1A150F]">Cycle Sync Rhythm</b>
                    <div>We deliver your box ~5 days before your expected period date.</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Next Period Date
                    </label>
                    <input
                      type="date"
                      min={minimumCycleSyncPeriodDate}
                      value={cycleSync.nextPeriodDate}
                      onChange={(e) =>
                        setCycleSync((cur) => ({
                          ...cur,
                          nextPeriodDate: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Cycle Length (Days)
                    </label>
                    <input
                      type="number"
                      min={21}
                      max={45}
                      value={cycleSync.cycleLength}
                      onChange={(e) =>
                        setCycleSync((cur) => ({
                          ...cur,
                          cycleLength: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm font-medium"
                    />
                  </div>
                </div>

                {cycleSyncSchedule?.valid && (
                  <div className="rounded-xl border border-[#E4F1F1] bg-[#E4F1F1]/50 p-3 text-xs text-[#1A8D91]">
                    <b>Expected Arrival:</b> {formatCycleDate(cycleSyncSchedule.arrivalDate)}
                  </div>
                )}
              </div>
            )}

            {/* Mix Your Box Customizer Component */}
            {isMixBoxCheckout && (
              <div className="my-4">
                <SizeSelectorBox
                  items={productInfo.prodcutVarientBoxRes}
                  cartSizes={selectedVarient}
                  setCartSizes={setSelectedVarient}
                  total={total}
                  setTotal={setTotal}
                  themeColor={{
                    darkColor: "#9A5B90",
                    lightColor: "#F3E6F0",
                    textColor: "#7E4D77",
                  }}
                />
              </div>
            )}

            {/* Quantity Stepper (for Pick a Size mode) */}
            {isQuantityChangable && (
              <div>
                <div className="mb-2.5 text-xs font-bold tracking-wider uppercase text-gray-500">QUANTITY (BOXES)</div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        aria-selected={quantity === num}
                        onClick={() => setQuantity(num)}
                        className={`h-11 w-11 cursor-pointer rounded-xl border-2 text-sm font-semibold transition-all ${
                          quantity === num
                            ? "border-[#9A5B90] bg-[#9A5B90] text-white"
                            : "border-gray-200/80 bg-white text-[#1A150F] hover:border-[#9A5B90]"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <div className="ml-auto flex items-center gap-1 rounded-xl border-2 border-gray-200/80 p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-lg font-bold text-[#7E4D77] transition-all hover:bg-[#F3E6F0] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="min-w-12 text-center text-sm font-semibold text-[#1A150F]">
                      {quantity}
                      <small className="block text-[10px] font-normal text-gray-500">box{quantity > 1 ? "es" : ""}</small>
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= maxBoxes}
                      onClick={() => setQuantity(Math.min(maxBoxes, quantity + 1))}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-lg font-bold text-[#7E4D77] transition-all hover:bg-[#F3E6F0] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Price Breakdown Block */}
            <div className="flex items-end justify-between gap-4 border-y border-gray-100 py-4">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif text-3xl font-bold tracking-tight text-[#1A150F] sm:text-4xl">
                    {typeof totalAmount === "number" ? `₹${totalAmount}` : "Incomplete Box"}
                  </span>
                  {activeVariant?.strikethroughPrice && (
                    <span className="text-base text-gray-400 line-through">₹{activeVariant.strikethroughPrice * quantity}</span>
                  )}
                </div>
                {typeof totalAmount === "number" && (
                  <div className="mt-0.5 text-xs text-gray-600">
                    <b className="font-semibold text-[#1A150F]">₹{(totalAmount / (isMixBoxCheckout ? 21 : 21 * quantity)).toFixed(1)}</b> per pad (incl. all taxes)
                  </div>
                )}
              </div>

              {totalDiscount > 0 && (
                <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  Save {totalDiscount}%
                </div>
              )}
            </div>

            {/* Liner Note */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-[#E4F1F1] text-[#1A8D91]">
                <Leaf className="h-4.5 w-4.5" />
              </div>
              <span>Includes <b className="font-semibold text-[#1A150F]">4 Free Organic Panty Liners</b> in every 21-pad box!</span>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="space-y-3 pt-2">
              {subscriptionType === "buy_once" && (
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={Boolean(isMixBoxCheckout && !mixBoxPricing?.valid)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 border-none rounded-2xl bg-[#9A5B90] p-4 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#7E4D77] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart • ₹{typeof totalAmount === "number" ? totalAmount : ""}
                </button>
              )}

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={Boolean(isMixBoxCheckout && !mixBoxPricing?.valid)}
                className="w-full cursor-pointer border-none rounded-2xl bg-[#141413] p-4 text-base font-semibold text-white transition-all hover:bg-[#2a2a28] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {effectivePurchaseType === "subscription"
                  ? "Checkout Subscription →"
                  : "Buy Now →"}
              </button>
            </div>

            {/* Shipping & PIN Code Checker */}
            <div className="border-t border-gray-100 pt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  checkDeliveryEstimate();
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={deliveryPincode}
                    onChange={(e) => setDeliveryPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit PIN Code"
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCheckingDelivery}
                  className="cursor-pointer rounded-xl bg-[#9A5B90] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#7E4D77] disabled:opacity-60"
                >
                  {isCheckingDelivery ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
                </button>
              </form>

              {deliveryStatus.type !== "idle" && (
                <div
                  className={`mt-3 rounded-xl p-3 text-xs font-medium ${
                    deliveryStatus.type === "available"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-amber-50 text-amber-800"
                  }`}
                >
                  {deliveryStatus.message}
                </div>
              )}

              <div className="mt-3.5 flex items-center justify-center gap-2 text-xs text-gray-600">
                <Truck className="h-4 w-4 text-[#1A8D91]" />
                <span>
                  Free Shipping on orders over ₹599.{" "}
                  {typeof totalAmount === "number" && totalAmount < 599 && (
                    <span className="font-semibold text-[#7E4D77]">Add ₹{599 - totalAmount} more for free delivery!</span>
                  )}
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="pt-2">
              <div className="mb-3 text-xs font-bold tracking-wider uppercase text-gray-500">PRODUCT SPECIFICATIONS</div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-200/80">
                {quickSpecs.map((spec: any, i: number) => {
                  const k = Array.isArray(spec) ? spec[0] : spec?.label || spec?.name;
                  const v = Array.isArray(spec) ? spec[1] : spec?.value;
                  return (
                    <div key={i} className="bg-white p-3.5">
                      <div className="text-xs text-gray-500">{k}</div>
                      <div className="mt-0.5 text-sm font-semibold text-[#1A150F]">{v}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Strap (First Component Bottom Strap) */}
      <div className="mt-8 rounded-2xl sm:rounded-full border border-gray-200/80 bg-white p-3.5 px-4 sm:px-8 shadow-xs">
        <div className="grid grid-cols-2 gap-3.5 sm:flex sm:items-center sm:justify-between text-xs sm:text-sm font-semibold text-[#1A150F]/80">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 flex-none text-[#1A8D91]" />
            <span>Secure transactions</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 flex-none text-[#1A8D91]" />
            <span>Easy, tracked delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 flex-none text-[#1A8D91]" />
            <span>Genuine Ovy product</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-none text-[#1A8D91]" />
            <span>Free shipping over ₹599</span>
          </div>
        </div>
      </div>

      {/* Engineered in Layers — What's Inside Section */}
      <WhatsInside />

      {/* An Honest Comparison — Why Ovy Beats An Ordinary Pad */}
      <OvyComparison />

      {/* Good To Know — Questions, Answered (3 Promo Cards) */}
      <OvyPromos
        onOpenQuiz={() => {
          setIsQuizOpen(true);
          setQuizStep(0);
        }}
      />

      {/* Interactive Size Recommendation Quiz Modal */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-[96] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-[#1A150F]/50 backdrop-blur-xs" onClick={() => setIsQuizOpen(false)} />
          <div className="relative max-h-[90vh] w-full max-w-[540px] overflow-auto rounded-3xl bg-white p-6 sm:p-8 shadow-xl">
            <button
              type="button"
              onClick={() => setIsQuizOpen(false)}
              className="absolute top-4 right-4 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-[#F4F1E8] text-gray-500 transition hover:text-[#1A150F]"
              aria-label="Close quiz"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Progress bar */}
            <div className="mb-5 flex gap-2">
              {[0, 1, 2, 3].map((stepIdx) => (
                <span
                  key={stepIdx}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    quizStep >= stepIdx ? "bg-[#9A5B90]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {quizStep === 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E4D77]">STEP 1 OF 3 • PERIOD FLOW</span>
                <h3 className="mt-1 mb-4 font-serif text-2xl font-semibold leading-tight text-[#1A150F] sm:text-3xl">How heavy is your period flow usually?</h3>
                <div className="grid gap-3">
                  {[
                    { id: "light", label: "Light Flow", sub: "Lighter days, spotting, last days of period" },
                    { id: "medium", label: "Medium / Regular Flow", sub: "Normal steady flow on most period days" },
                    { id: "heavy", label: "Heavy Flow", sub: "Soaking through pads quickly on initial days" },
                    { id: "variable", label: "Changes a lot across days", sub: "Heavy first 2 days, then light/medium" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${
                        quizAnswers.flow === opt.id
                          ? "border-[#9A5B90] bg-[#F3E6F0]"
                          : "border-gray-200/80 bg-white hover:border-[#9A5B90] hover:bg-[#F3E6F0]/40"
                      }`}
                      onClick={() => {
                        setQuizAnswers((prev) => ({ ...prev, flow: opt.id }));
                        setQuizStep(1);
                      }}
                    >
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#F4F1E8] text-[#7E4D77]">
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <b className="block text-sm font-semibold text-[#1A150F]">{opt.label}</b>
                        <small className="block text-xs font-medium text-gray-500">{opt.sub}</small>
                      </div>
                      <div className="ml-auto flex h-5.5 w-5.5 flex-none items-center justify-center rounded-full border border-gray-300 text-xs font-bold text-transparent">✓</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 1 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E4D77]">STEP 2 OF 3 • LEAK PROTECTION</span>
                <h3 className="mt-1 mb-4 font-serif text-2xl font-semibold leading-tight text-[#1A150F] sm:text-3xl">Do you experience leaks at night or during activity?</h3>
                <div className="grid gap-3">
                  {[
                    { id: "rarely", label: "Rarely or Never", sub: "Standard coverage is usually fine" },
                    { id: "sometimes", label: "Sometimes at Night", sub: "Need extra back coverage for sleeping" },
                    { id: "often", label: "Often / High Risk", sub: "Need maximum length & extra wide wings" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${
                        quizAnswers.leaks === opt.id
                          ? "border-[#9A5B90] bg-[#F3E6F0]"
                          : "border-gray-200/80 bg-white hover:border-[#9A5B90] hover:bg-[#F3E6F0]/40"
                      }`}
                      onClick={() => {
                        setQuizAnswers((prev) => ({ ...prev, leaks: opt.id }));
                        setQuizStep(2);
                      }}
                    >
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#F4F1E8] text-[#7E4D77]">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <b className="block text-sm font-semibold text-[#1A150F]">{opt.label}</b>
                        <small className="block text-xs font-medium text-gray-500">{opt.sub}</small>
                      </div>
                      <div className="ml-auto flex h-5.5 w-5.5 flex-none items-center justify-center rounded-full border border-gray-300 text-xs font-bold text-transparent">✓</div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setQuizStep(0)} className="mt-4 cursor-pointer text-xs font-semibold text-gray-500 hover:text-[#1A150F]">
                  ← Back to Step 1
                </button>
              </div>
            )}

            {quizStep === 2 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E4D77]">STEP 3 OF 3 • DURATION</span>
                <h3 className="mt-1 mb-4 font-serif text-2xl font-semibold leading-tight text-[#1A150F] sm:text-3xl">How many days does your period last?</h3>
                <div className="grid gap-3">
                  {[
                    { id: "3-4", label: "3 to 4 Days", sub: "Shorter period duration" },
                    { id: "5-7", label: "5 to 7 Days", sub: "Average period length" },
                    { id: "7+", label: "7+ Days", sub: "Longer cycle duration" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${
                        quizAnswers.duration === opt.id
                          ? "border-[#9A5B90] bg-[#F3E6F0]"
                          : "border-gray-200/80 bg-white hover:border-[#9A5B90] hover:bg-[#F3E6F0]/40"
                      }`}
                      onClick={() => {
                        setQuizAnswers((prev) => ({ ...prev, duration: opt.id }));
                        setQuizStep(3);
                      }}
                    >
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#F4F1E8] text-[#7E4D77]">
                        <RotateCcw className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <b className="block text-sm font-semibold text-[#1A150F]">{opt.label}</b>
                        <small className="block text-xs font-medium text-gray-500">{opt.sub}</small>
                      </div>
                      <div className="ml-auto flex h-5.5 w-5.5 flex-none items-center justify-center rounded-full border border-gray-300 text-xs font-bold text-transparent">✓</div>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setQuizStep(1)} className="mt-4 cursor-pointer text-xs font-semibold text-gray-500 hover:text-[#1A150F]">
                  ← Back to Step 2
                </button>
              </div>
            )}

            {quizStep === 3 && (
              <div className="text-center pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9A5B90] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-xs">
                  {recommendedQuizResult.badge}
                </span>

                {/* Recommended Product Preview Box inside Popup */}
                <div className="mt-4 mb-5 text-left rounded-3xl border-2 border-[#9A5B90] bg-gradient-to-br from-[#FBF1FB] via-white to-[#F3E6F0] p-4.5 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl border border-[#F3E6F0] bg-white p-2 shadow-xs">
                      <Image
                        src={getImageUrl(recommendedQuizResult.image || activeImage)}
                        alt={recommendedQuizResult.size}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-500">21 Pads + 4 Liners</span>
                      </div>
                      <h4 className="mt-1 font-serif text-xl font-bold text-[#1A150F]">
                        Ovy Organic — {recommendedQuizResult.size}
                      </h4>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="font-serif text-lg font-bold text-[#9A5B90]">
                          ₹{recommendedQuizResult.price || 349}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-gray-700 bg-white/70 p-3 rounded-xl border border-gray-100">
                    💡 <strong>Why it fits:</strong> {recommendedQuizResult.why}
                  </p>
                </div>

                {/* Popup Actions */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleDirectQuizAddToCart}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#9A5B90] p-4 text-base font-semibold text-white shadow-md transition hover:bg-[#7E4D77]"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Add {recommendedQuizResult.size} to Cart →
                  </button>
                  <button
                    type="button"
                    onClick={applyQuizRecommendation}
                    className="w-full cursor-pointer rounded-2xl border border-gray-300 bg-white p-3 text-sm font-semibold text-[#1A150F] transition hover:bg-gray-50"
                  >
                    Apply Choice to Page Selection
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizStep(0)}
                    className="cursor-pointer text-xs font-semibold text-gray-500 hover:text-[#1A150F]"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Mobile Buying Bar */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-40 flex items-center gap-4 border-t border-gray-200/80 bg-white/95 p-3.5 px-5 shadow-lg backdrop-blur-md transition-transform duration-300 ${
          showStickyBar ? "translate-y-0 pointer-events-auto" : "translate-y-[115%] pointer-events-none"
        }`}
      >
        <div>
          <div className="font-serif text-xl font-bold text-[#1A150F]">₹{typeof totalAmount === "number" ? totalAmount : 349}</div>
          <div className="text-xs text-gray-500">21 Pads + 4 Free Liners</div>
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={Boolean(isMixBoxCheckout && !mixBoxPricing?.valid)}
          className="flex-1 cursor-pointer rounded-2xl bg-[#9A5B90] p-3.5 text-sm font-semibold text-white transition hover:bg-[#7E4D77] disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
