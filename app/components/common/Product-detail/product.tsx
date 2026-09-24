/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { addToCart as addToCartAction } from "@/store/cartActions"; // Rename import
import SizeSelectorBox from "./sizeSelectorBox";
import { toast } from "sonner";
import { subscriptionPlans } from "@/const/globalconst";
import { getImageUrl } from "@/lib/imageUrl";
import {
  calculateMixBoxPricing,
  normalizeMixBoxRecipe,
  normalizePadSize,
  type MixBoxSelection,
  type SubscriptionType,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BUY_ONCE_PLAN = {
  id: "buy_once",
  label: "Buy Once",
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
  // categoryName,
  // variants,
  productInfo,
  themeColor,
}: any) {
  const router = useRouter();
  const pageTheme =
    typeof themeColor === "string"
      ? {
          darkColor: themeColor,
          lightColor: "#F3F4F6",
          textColor: themeColor,
        }
      : themeColor || {
          darkColor: "#016271",
          lightColor: "#E8F7FA",
          textColor: "#016271",
        };

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

  const defaultSize = defaultVariant.size || "Medium (280mm)";
  const defaultFlow = defaultVariant.flowType || "Regular Flow";

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

  // Size and Flow extraction logic from variantsList
  const sizes = Array.from(
    new Set(variantsList.map((v: any) => v.size).filter(Boolean)),
  ) as string[];
  const flows = Array.from(
    new Set(variantsList.map((v: any) => v.flowType).filter(Boolean)),
  ) as string[];
  const hasMultipleVariants = variantsList.length > 1;

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
  const productImages = [
    activeVariant?.bannerImage,
    productInfo?.bannerImage,
    ...(productInfo?.productMediaRes || []).map((item: any) => item?.mediaURL),
  ].filter(Boolean);
  const displayDescription =
    getStaticShortText(staticVariantInfo, staticContent) ||
    activeVariant?.description ||
    productInfo?.description;
  const displayHighlights =
    getStaticBullets(staticVariantInfo).length > 0
      ? getStaticBullets(staticVariantInfo)
      : activeVariant?.highlights || productInfo?.highlights || [];
  const staticSpecs = getStaticSpecs(staticContent, staticSizeKey);
  const variantTags = [
    staticVariantInfo?.label || activeVariant?.size,
    staticVariantInfo?.flow || activeVariant?.flowType,
    activeVariant?.boxQuantity ? `${activeVariant.boxQuantity} pcs` : null,
  ].filter(Boolean);
  const quickSpecs = staticSpecs.slice(0, 4);
  const maxBoxes = getMaxBoxes(
    staticContent,
    productInfo?.maxQuantityPurchase || 6,
  );
  const freeShippingThreshold = getFreeShippingThreshold(
    staticContent,
    productInfo?.freeShippingOver,
  );
  const availableSubscriptionPlans = subscriptionPlans.filter((plan) => {
    if (plan.subscriptionType === "cycle_sync") {
      return Boolean(productInfo?.allowCycleSync);
    }

    return Boolean(productInfo?.allowSubscription);
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
        setPrice: activeVariant?.price || 0,
        purchaseType: "one_time",
        subscriptionType: null,
      })
    : null;
  const subscriptionDiscount = effectiveSubscriptionType
    ? getProductPlanDiscount(productInfo, effectiveSubscriptionType) ||
      getModeDiscount(staticContent, effectiveSubscriptionType)
    : 0;
  const volumeDiscount = isMixBoxCheckout
    ? 0
    : getVolumeDiscount(staticContent, quantity);
  const baseVariantPrice = Number(activeVariant?.price || 0);
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
  const shippingRemaining =
    freeShippingThreshold && currentOrderValue < freeShippingThreshold
      ? freeShippingThreshold - currentOrderValue
      : 0;
  const totalDiscount = Math.round(
    (subscriptionDiscount + volumeDiscount) * 100,
  );
  const discount =
    activeVariant?.strikethroughPrice && baseVariantPrice
      ? Math.round(
          ((activeVariant.strikethroughPrice - baseVariantPrice) /
            activeVariant.strikethroughPrice) *
            100,
        )
      : 0;

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

    return addToCartAction({
      productId: productInfo.id,
      productVariantId: activeVariant?.id,
      sku: activeVariant?.sku || `${selectedSize}-${selectedFlow}`,
      slug: productInfo?.slug || "",
      title: activeVariant?.name || productInfo?.name,
      price: effectiveUnitPrice,
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
  };

  const subscribeToCart = (plan: any) => {
    const nextPlan = plan || BUY_ONCE_PLAN;
    setSelectedPlan(nextPlan);
    setIsSubscribed(nextPlan.subscriptionType !== "buy_once");
    // Do not redirect to /cart. Wait for user to click Add to Cart.
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

  const getProductWeight = () => {
    const weight =
      activeVariant?.weightKg ||
      activeVariant?.weight ||
      productInfo?.weightKg ||
      productInfo?.weight;

    return Number(weight || 0) || undefined;
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliveryPincode: pincode,
          pickupPincode:
            activeVariant?.pickupPincode || productInfo?.pickupPincode,
          weight: getProductWeight(),
          cod: false,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setDeliveryStatus({
          type: "error",
          message:
            payload?.message ||
            "Unable to check delivery availability right now.",
        });
        return;
      }

      if (!payload?.serviceable) {
        setDeliveryStatus({
          type: "unavailable",
          message:
            payload?.message ||
            "Delivery is currently unavailable at this PIN code.",
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

    if (variant.size) {
      setSelectedSize(variant.size);
    }

    if (variant.flowType) {
      setSelectedFlow(variant.flowType);
    }

    if (variant.bannerImage || variant.image) {
      setActiveImage(variant.bannerImage || variant.image);
    }

    syncHash(
      resolveStaticSizeKey(
        variant.size || variant.name,
        variant,
        staticContent,
      ),
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const match = variantsList.find(
      (v: any) =>
        v.size === size && (selectedFlow ? v.flowType === selectedFlow : true),
    );
    if (match) {
      setActiveVariant(match);
      if (match.bannerImage || match.image) {
        setActiveImage(match.bannerImage || match.image);
      }
      syncHash(resolveStaticSizeKey(size, match, staticContent));
    }
  };

  const handleFlowChange = (flow: string) => {
    setSelectedFlow(flow);
    const match = variantsList.find(
      (v: any) =>
        (selectedSize ? v.size === selectedSize : true) && v.flowType === flow,
    );
    if (match) {
      setActiveVariant(match);
      if (match.bannerImage || match.image) {
        setActiveImage(match.bannerImage || match.image);
      }
      syncHash(resolveStaticSizeKey(match.size, match, staticContent));
    }
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

  return (
    <div id="starter" className="min-h-screen py-8 md:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_520px]">
        {/* LEFT SIDE */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="order-1 md:order-2">
              {activeImage ? (
                <div className="rounded-3xl">
                  <Image
                    src={getImageUrl(activeImage)}
                    alt={
                      activeVariant?.name ||
                      productInfo?.name ||
                      "Product image"
                    }
                    height={800}
                    width={800}
                    priority
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="grid aspect-[4/3] place-items-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Product image pending
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload product and variant images from admin.
                    </p>
                  </div>
                </div>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pt-2 pb-4">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-gray-50 ${
                      activeImage === image ? "shadow-md" : ""
                    }`}
                    style={{
                      borderColor:
                        activeImage === image ? pageTheme.darkColor : "#e5e7eb",
                    }}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${activeVariant?.name || productInfo?.name} thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {quickSpecs.length > 0 && (
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickSpecs.map((spec: any, index: number) => {
                const label = Array.isArray(spec)
                  ? spec[0]
                  : spec?.label || spec?.name;
                const value = Array.isArray(spec) ? spec[1] : spec?.value;

                return (
                  <div
                    key={`${label}-${index}`}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {value}
                    </p>
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5 lg:sticky lg:top-4 lg:h-fit">
          <section
            className="rounded-3xl border p-6 shadow-sm md:p-8"
            style={{
              backgroundColor: pageTheme.lightColor,
              borderColor: pageTheme.darkColor,
            }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: pageTheme.darkColor,
                  color:
                    productInfo.brand == "loway"
                      ? pageTheme.textColor
                      : "white",
                }}
              >
                {productInfo.brand == "loway" ? "Looway" : "Ovy"}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-gray-700">
                {activeVariant?.isInStock === false
                  ? "Out of stock"
                  : "Ready to ship"}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-gray-700">
                SKU: {activeVariant?.sku || "Not set"}
              </span>
            </div>

            <h1 className="mt-6 mb-4 max-w-3xl text-2xl leading-8 font-semibold text-gray-900 md:text-3xl">
              {productInfo.name}
            </h1>
            {displayHighlights.length > 0 && (
              <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {displayHighlights
                  .slice(0, 6)
                  .map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-full text-xs text-gray-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: pageTheme.darkColor }}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
              </section>
            )}

            <div className="mt-4 mb-4 flex items-center justify-between">
              <div>
                {/* <Label>Ratings</Label> */}
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{activeVariant?.rating || "4.8"}</span>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${activeVariant?.isInStock === false ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
              >
                {activeVariant?.isInStock === false
                  ? "Out of stock"
                  : "In stock"}
              </span>
            </div>
            {totalAmount && (
              <div className="mt-4 mb-4 flex flex-wrap items-center gap-3 text-2xl font-semibold">
                Rs. {totalAmount}
              </div>
            )}

            <Label className="mb-1 text-sm">How would you like to buy</Label>

            <div className="mb-4 rounded-2xl border bg-white p-1">
              <RadioGroup
                value={selectedPlanType}
                onValueChange={(value) => {
                  let selectedVarientInfo = [];

                  if (value === "mixYourBox") {
                    if (!canCustomizeBox) return;

                    const variants = productInfo.prodcutVarientBoxRes || [];
                    const baseQuantity = Math.floor(21 / variants.length);
                    let remaining = 21;
                    selectedVarientInfo = productInfo.prodcutVarientBoxRes.map(
                      (item: any, index: number) => {
                        const quantity =
                          index === variants.length - 1
                            ? remaining
                            : baseQuantity;
                        remaining -= quantity;
                        return {
                          name: item.name,
                          quantity,
                          price: Number(item.price || 0),
                        };
                      },
                    );

                    setCartSizes(selectedVarientInfo);
                    setTotal(
                      selectedVarientInfo.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0,
                      ),
                    );
                  } else {
                    const firstVarientInfo =
                      productInfo.prodcutVarientBoxRes[0];
                    selectedVarientInfo =
                      getPickedVariantSelection(firstVarientInfo);
                    handleVariantChange(firstVarientInfo);
                  }
                  setSelectedVarient(selectedVarientInfo);

                  setSelectedPlanType(value);
                }}
                className={`grid w-full gap-2 ${canCustomizeBox ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
              >
                <FieldLabel
                  htmlFor="pickSize"
                  className="has-[>[data-slot=field]]:rounded-2xl"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Pick a size</FieldTitle>
                      <FieldDescription>
                        One size, ready to go.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      className="opacity-0"
                      value="pickSize"
                      id="pickSize"
                    />
                  </Field>
                </FieldLabel>
                {canCustomizeBox && (
                  <FieldLabel
                    htmlFor="mixYourBox"
                    className="has-[>[data-slot=field]]:rounded-2xl"
                  >
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Mix your box</FieldTitle>
                        <FieldDescription>Build your own 21.</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        className="opacity-0"
                        value="mixYourBox"
                        id="mixYourBox"
                      />
                    </Field>
                  </FieldLabel>
                )}
              </RadioGroup>
            </div>
            {selectedPlanType === "pickSize" && (
              <div>
                <Label className="mb-2">Select size</Label>
                {productInfo?.prodcutVarientBoxRes.length > 0 && (
                  <RadioGroup
                    value={selectedVarient?.[0]?.name || ""}
                    onValueChange={(value) => {
                      const variant = productInfo?.prodcutVarientBoxRes.find(
                        (v: any) => v.name === value,
                      );
                      if (variant) {
                        setSelectedVarient(getPickedVariantSelection(variant));
                        handleVariantChange(variant);
                      }
                    }}
                    className="grid grid-cols-1 gap-1.5 sm:grid-cols-3"
                  >
                    {productInfo?.prodcutVarientBoxRes.map(
                      (
                        { name, price }: { name: string; price: string },
                        index: number,
                      ) => (
                        <FieldLabel
                          key={`${name}-${index}`}
                          htmlFor={`variant-${index}`}
                          className="cursor-pointer bg-white has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:bg-white"
                        >
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldDescription className="text-[11px] tracking-wide text-gray-500 uppercase">
                                Rs. {price}
                              </FieldDescription>
                              <FieldTitle className="mt-1 text-sm font-semibold text-gray-900">
                                {name}
                              </FieldTitle>
                            </FieldContent>
                            <RadioGroupItem
                              className="opacity-0"
                              value={name}
                              id={`variant-${index}`}
                            />
                          </Field>
                        </FieldLabel>
                      ),
                    )}
                  </RadioGroup>
                )}
              </div>
            )}
            {isMixBoxCheckout && (
              <div>
                <SizeSelectorBox
                  items={productInfo.prodcutVarientBoxRes}
                  cartSizes={selectedVarient}
                  setCartSizes={setSelectedVarient}
                  total={total}
                  setTotal={setTotal}
                  themeColor={pageTheme}
                />
              </div>
            )}
          </section>
          {/* {!isMixBoxCheckout && quantity > 1 && (
            <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
              Total: Rs. {currentOrderValue}
              {totalDiscount > 0 ? ` after ${totalDiscount}% discount` : ""}
            </p>
          )} */}

          {availableSubscriptionPlans.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  Choose your order type
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Delivered and billed on your chosen rhythm
                </p>
              </div>

              <RadioGroup
                value={selectedPlan?.id || ""}
                onValueChange={(value) => {
                  const plan = shownSubscriptionPlans.find(
                    (p) => p.id === value,
                  );
                  if (plan) {
                    subscribeToCart(plan);
                  }
                }}
                className="grid gap-3"
              >
                {shownSubscriptionPlans.map((plan: any) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const schemaDiscount = getProductPlanDiscount(
                    productInfo,
                    plan.subscriptionType,
                  );
                  const discountPercentage = schemaDiscount
                    ? Math.round(schemaDiscount * 100)
                    : plan.discountPercentage;
                  const discountedPrice =
                    baseOrderValueForPlan -
                    baseOrderValueForPlan * (discountPercentage / 100);

                  return (
                    <FieldLabel
                      key={plan.id}
                      htmlFor={plan.id}
                      onClick={(e) => {
                        e.preventDefault();
                        subscribeToCart(isSelected ? null : plan);
                      }}
                      className="relative cursor-pointer bg-white transition has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:bg-white"
                      style={{
                        borderColor: isSelected
                          ? pageTheme.darkColor
                          : undefined,
                        backgroundColor: isSelected
                          ? pageTheme.lightColor
                          : undefined,
                      }}
                    >
                      {plan.isRecomended && (
                        <div className="absolute top-0 right-0 z-50 rounded-tr-xl rounded-bl-lg bg-[#AF71A7] px-3 py-0.5 text-[10px] text-white">
                          Recomended
                        </div>
                      )}
                      <Field
                        orientation="horizontal"
                        className="flex flex-col justify-between md:flex-row md:items-center"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            checked={isSelected}
                            className={`pointer-events-none ${
                              isSelected
                                ? "text-current [&_svg]:fill-current"
                                : ""
                            }`}
                            style={{
                              borderColor: isSelected
                                ? pageTheme.darkColor
                                : undefined,
                              color: isSelected
                                ? pageTheme.darkColor
                                : undefined,
                            }}
                          />

                          <span className="text-sm font-normal text-gray-900">
                            {plan.label}
                          </span>
                        </div>

                        <span className="text-sm font-medium text-gray-900">
                          {!!discountPercentage &&
                            `${discountPercentage}% off - `}
                          {!!discountedPrice &&
                            `Rs. ${Number(discountedPrice.toFixed(2))}`}
                        </span>
                      </Field>
                    </FieldLabel>
                  );
                })}
              </RadioGroup>

              {subscriptionType === "cycle_sync" && (
                <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4">
                  <Field>
                    <Label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Next Period Date
                    </Label>
                    <Input
                      type="date"
                      min={minimumCycleSyncPeriodDate}
                      value={cycleSync.nextPeriodDate}
                      onChange={(event) =>
                        setCycleSync((current) => ({
                          ...current,
                          nextPeriodDate: event.target.value,
                        }))
                      }
                      className="bg-white"
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-3">
                    <Field>
                      <Label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Cycle Length
                      </Label>
                      <Input
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
                        className="bg-white"
                        aria-label="Cycle length"
                      />
                    </Field>
                  </div>
                  {cycleSyncSchedule?.valid && (
                    <p className="text-sm text-gray-600">
                      {cycleSyncSchedule.message ??
                        `Expected delivery: ${formatCycleDate(cycleSyncSchedule.arrivalDate)}`}
                    </p>
                  )}
                  {cycleSyncSchedule?.valid && (
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        Upcoming deliveries
                      </p>
                      <div className="mt-2 grid gap-2">
                        {cycleSyncSchedule.upcomingDeliveries.map(
                          (delivery, index) => (
                            <div
                              key={`${delivery.deliveryDate.toISOString()}-${index}`}
                              className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-gray-700"
                            >
                              <span>Delivery {index + 1}</span>
                              <span className="font-medium text-gray-950">
                                {formatCycleDate(delivery.deliveryDate)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {cycleSyncSchedule?.valid && cycleSyncSchedule.warning && (
                    <p className="text-sm text-amber-700">
                      {cycleSyncSchedule.warning}
                    </p>
                  )}
                  {cycleSyncSchedule && !cycleSyncSchedule.valid && (
                    <p className="text-sm text-red-600">
                      {cycleSyncSchedule.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4"></div>
            </div>
          )}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: pageTheme.lightColor }}
              >
                <Truck
                  className="h-5 w-5"
                  style={{ color: pageTheme.darkColor }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-gray-950">
                  Check delivery date
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your PIN code for estimated delivery availability.
                </p>
              </div>
            </div>

            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                checkDeliveryEstimate();
              }}
            >
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={deliveryPincode}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, "");
                    setDeliveryPincode(value);
                    if (deliveryStatus.type !== "idle") {
                      setDeliveryStatus({ type: "idle" });
                    }
                  }}
                  placeholder="Enter 6-digit PIN code"
                  className="h-11 bg-white pl-9"
                  aria-label="Delivery PIN code"
                />
              </div>
              <button
                type="submit"
                disabled={isCheckingDelivery}
                className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundColor: pageTheme.darkColor,
                  color:
                    productInfo.brand == "loway"
                      ? pageTheme.textColor
                      : "white",
                }}
              >
                {isCheckingDelivery ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking
                  </>
                ) : (
                  "Check"
                )}
              </button>
            </form>

            {deliveryStatus.type !== "idle" && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                  deliveryStatus.type === "available"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : deliveryStatus.type === "unavailable"
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <div className="flex items-start gap-2">
                  {deliveryStatus.type === "available" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{deliveryStatus.message}</p>
                    {/* {deliveryStatus.type === "available" &&
                      deliveryStatus.courier?.name && (
                        <p className="mt-1 text-xs opacity-80">
                          Fastest courier: {deliveryStatus.courier.name}
                        </p>
                      )} */}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Buttons */}
          <div className="flex gap-4">
            {subscriptionType === "buy_once" && (
              <button
                onClick={addToCart}
                disabled={Boolean(isMixBoxCheckout && !mixBoxPricing?.valid)}
                style={{
                  backgroundColor: pageTheme.darkColor,
                  color:
                    productInfo.brand == "loway"
                      ? pageTheme.textColor
                      : "white",
                }}
                className="flex-1 rounded-xl py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                // style={{
                //   backgroundColor: pageTheme.darkColor || "#016271",
                // }}
              >
                Add to Cart
              </button>
            )}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={Boolean(isMixBoxCheckout && !mixBoxPricing?.valid)}
              className="flex-1 rounded-xl bg-black py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {effectivePurchaseType === "subscription"
                ? "Checkout Subscription"
                : "Buy Now"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
              <ShieldCheck
                className="h-4 w-4"
                style={{ color: pageTheme.darkColor }}
              />
              Skin-friendly
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
              <PackageCheck
                className="h-4 w-4"
                style={{ color: pageTheme.darkColor }}
              />
              Sealed packs
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
              <RotateCcw
                className="h-4 w-4"
                style={{ color: pageTheme.darkColor }}
              />
              Easy reorder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
