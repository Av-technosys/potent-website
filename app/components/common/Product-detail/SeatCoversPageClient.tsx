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
  Plane,
  Car,
  Bus,
  Briefcase,
  Baby,
  Activity,
  Award,
  AlertCircle,
  X,
  Play,
  FileText,
  AlertTriangle,
  Trash2,
  ShieldAlert,
  Info,
  BookOpen,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";

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
  loo: ShieldCheck,
  temple: MapPin,
  mountain: MapPin,
  music: Sparkles,
  cross: Activity,
  baby: Baby,
  preg: Baby,
  heart: Heart,
  senior: Heart,
  access: Briefcase,
};

const REVIEW_FILTERS = [
  { id: "all", label: "All reviews" },
  { id: "5star", label: "5★" },
  { id: "4star", label: "4★" },
  { id: "travel", label: "Travel" },
  { id: "school", label: "Schools & Colleges" },
  { id: "pregnancy", label: "Pregnancy" },
  { id: "seniors", label: "Seniors" },
];

export default function SeatCoversPageClient({ product, content }: Props) {
  const [selectedModeId, setSelectedModeId] = useState<string>("once");
  const [quantity, setQuantity] = useState<number>(1);
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

  // Modal Popups State
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [howToUseModalOpen, setHowToUseModalOpen] = useState<boolean>(false);
  const [specsModalOpen, setSpecsModalOpen] = useState<boolean>(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState<boolean>(false);

  const stepperRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

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
        const name = v.name || v.title || `Pack ${index + 1}`;
        const price = Number(v.price || v.discountPrice || 0);
        const mrp = Number(
          v.discountPrice &&
            v.price &&
            Number(v.price) > Number(v.discountPrice)
            ? v.price
            : v.mrp || Math.round(price * 1.25),
        );
        const covers =
          name.includes("100") || name.toLowerCase().includes("4") ? 100 : 50;
        const boxes = covers === 100 ? 4 : 2;
        const flag =
          name.toLowerCase().includes("4") || index === 1
            ? "Best value"
            : undefined;
        const sub = `${boxes} boxes · ${covers} covers`;

        map[id] = {
          id,
          variantId: v.id,
          name,
          covers,
          boxes,
          mrp,
          price,
          sub,
          flag,
          sku: v.sku || "",
          image: v.bannerImage || product?.bannerImage || "",
        };
      });
      return map;
    }

    // Fallback if DB variants list is empty
    return (
      content?.PACKS || {
        p2: {
          id: "p2",
          name: "2-Pack",
          covers: 50,
          boxes: 2,
          mrp: 499,
          price: 399,
          sub: "2 boxes · 50 covers",
        },
        p4: {
          id: "p4",
          name: "4-Pack",
          covers: 100,
          boxes: 4,
          mrp: 899,
          price: 699,
          sub: "4 boxes · 100 covers",
          flag: "Best value",
        },
      }
    );
  }, [variantsList, product, content]);

  const packKeys = Object.keys(packs);
  const [selectedPackId, setSelectedPackId] = useState<string>(
    () => packKeys[1] || packKeys[0] || "p4",
  );

  useEffect(() => {
    if (!packs[selectedPackId] && packKeys.length > 0) {
      setSelectedPackId(packKeys[0]);
    }
  }, [packs, selectedPackId, packKeys]);

  const selectedPack = packs[selectedPackId] ||
    Object.values(packs)[0] || { price: 399, mrp: 499, name: "2-Pack" };

  // Mode discounts from DB product if available
  const subMonthlyDiscount =
    Number(product?.subscribeMonthlyDiscount || 10) / 100;
  const subBiMonthlyDiscount =
    Number(product?.subscribeBiMontlyDiscount || 5) / 100;

  const modeDiscount =
    selectedModeId === "sub1"
      ? subMonthlyDiscount
      : selectedModeId === "sub2"
        ? subBiMonthlyDiscount
        : 0;

  const basePrice = selectedPack.price || Number(product?.price) || 399;
  const mrpPrice =
    selectedPack.mrp || Number(product?.mrp) || Math.round(basePrice * 1.25);
  const unitPrice = Math.round(basePrice * (1 - modeDiscount));
  const totalPrice = unitPrice * quantity;
  const totalMrp = mrpPrice * quantity;
  const totalSavings = totalMrp - totalPrice;

  // Images list
  const mediaList = useMemo(() => {
    const images: string[] = [];
    if (product?.bannerImage) images.push(getImageUrl(product.bannerImage));
    if (product?.productVariants) {
      product.productVariants.forEach((v: any) => {
        if (v.bannerImage) images.push(getImageUrl(v.bannerImage));
      });
    }
    if (images.length === 0) images.push("/product.png");
    return Array.from(new Set(images));
  }, [product]);

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Stepper node active scroll inside track only
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
      const sections = ["pdp-hero", "where-to-use", "who-its-for", "reviews"];
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

  // Filtered reviews logic
  const filteredReviews = useMemo(() => {
    const reviews = content?.REVIEWS || [];
    if (activeReviewFilter === "all") return reviews;
    if (activeReviewFilter === "5star")
      return reviews.filter((r: any) => r.stars === 5);
    if (activeReviewFilter === "4star")
      return reviews.filter((r: any) => r.stars === 4);
    if (activeReviewFilter === "travel")
      return reviews.filter(
        (r: any) =>
          r.group === "travellers" ||
          (r.quote &&
            (r.quote.toLowerCase().includes("flight") ||
              r.quote.toLowerCase().includes("road"))),
      );
    if (activeReviewFilter === "school")
      return reviews.filter(
        (r: any) =>
          r.quote &&
          (r.quote.toLowerCase().includes("school") ||
            r.quote.toLowerCase().includes("college")),
      );
    if (activeReviewFilter === "pregnancy")
      return reviews.filter(
        (r: any) =>
          r.group === "expecting" ||
          (r.quote && r.quote.toLowerCase().includes("pregnant")),
      );
    if (activeReviewFilter === "seniors")
      return reviews.filter(
        (r: any) =>
          r.group === "seniors" ||
          r.group === "jointpain" ||
          (r.quote && r.quote.toLowerCase().includes("knee")),
      );
    return reviews;
  }, [content?.REVIEWS, activeReviewFilter]);

  // Cart action integration with dynamic DB variant resolution
  const handleAddToCart = async () => {
    const variantId =
      selectedPack?.variantId ||
      product?.productVariants?.find(
        (v: any) =>
          v.name?.toLowerCase().includes(selectedPack.name.toLowerCase()) ||
          v.name?.includes(String(selectedPack.covers)),
      )?.id ||
      product?.productVariants?.[0]?.id;

    setAdding(true);
    try {
      await addToCartAction({
        productId: product?.id,
        productVariantId: variantId,
        sku:
          selectedPack.sku ||
          product?.productVariants?.[0]?.sku ||
          "LOOWAY-SEAT-01",
        slug: product?.slug || "looway-toilet-seat-covers",
        title: `${product?.name || "Looway Disposable Toilet Seat Covers"} (${selectedPack.name})`,
        image: mediaList[0] || "/product.png",
        price: unitPrice,
        quantity: quantity,
        isQuantityChangable: true,
        purchaseType: selectedModeId === "once" ? "one_time" : "subscription",
        subscriptionType:
          selectedModeId === "once" ? null : (selectedModeId as any),
        isSubscribed: selectedModeId !== "once",
      });

      toast.success(`${selectedPack.name} added to cart!`);
    } catch (error) {
      console.error(error);
      toast.error("Could not add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  // Pincode validation
  const checkPincode = () => {
    if (!pincode || pincode.trim().length !== 6 || isNaN(Number(pincode))) {
      setPincodeResult({
        msg: "Please enter a valid 6-digit Indian PIN code",
        err: true,
      });
      return;
    }
    setPincodeResult({
      msg: `Delivery available for ${pincode}! Expected delivery in 3-5 business days with Free Shipping over ₹599.`,
      err: false,
    });
  };

  return (
    <main className="min-h-screen bg-[#F5FAFD] text-[#14232E]">
      {/* Top Brand Checker Banner */}
      <div className="h-2.5 w-full bg-[repeating-linear-gradient(90deg,#0F6DA6_0px,#0F6DA6_16px,#C6E82E_16px,#C6E82E_32px)]" />

      {/* Hero PDP Buy Section */}
      <section
        id="pdp-hero"
        className="bg-gradient-to-b from-[#EAF6FD] via-[#F5FAFD] to-[#FFFFFF] py-8 sm:py-12"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Image Gallery */}
            <div className="static lg:sticky lg:top-24 lg:col-span-6">
              <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-[#D3E4EF] bg-white shadow-md">
                <Image
                  src={mediaList[selectedImageIndex] || mediaList[0]}
                  alt="Looway Toilet Seat Covers"
                  fill
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                  priority
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F6DA6] px-3 py-1 text-xs font-bold text-white shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5" /> 100% Plastic-Free
                    Paper
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C6E82E] px-3 py-1 text-xs font-bold text-[#083B5C] shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" /> Best Seller
                  </span>
                </div>

                {/* Gallery Nav Arrows */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev > 0 ? prev - 1 : mediaList.length - 1,
                        )
                      }
                      className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 text-[#0F6DA6] shadow-md transition-all hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev < mediaList.length - 1 ? prev + 1 : 0,
                        )
                      }
                      className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 text-[#0F6DA6] shadow-md transition-all hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {mediaList.length > 1 && (
                <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
                  {mediaList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 bg-white transition-all ${
                        selectedImageIndex === idx
                          ? "border-[#0F6DA6] ring-2 ring-[#0F6DA6]/20"
                          : "border-[#D3E4EF] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="Thumbnail"
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Buy Options */}
            <div className="flex flex-col gap-5 lg:col-span-6">
              <div>
                <span className="inline-block rounded-full bg-[#0F6DA6] px-3.5 py-1 text-xs font-extrabold tracking-wider text-white uppercase">
                  LOOWAY · TRAVEL HYGIENE
                </span>
                <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-[#083B5C] sm:text-4xl lg:text-5xl">
                  Looway Disposable Toilet Seat Covers
                </h1>
                <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
                  Biodegradable, water-resistant seat protection for dirty
                  public toilets.
                </p>

                {/* Rating & Reviews */}
                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm">
                  <div className="flex text-[#F4C430]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#F4C430] text-[#F4C430]"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      document
                        .getElementById("reviews")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="cursor-pointer font-semibold text-[#0F6DA6] hover:underline"
                  >
                    4.8 out of 5 ·{" "}
                    <span className="underline decoration-dotted">
                      96 verified reviews
                    </span>
                  </button>
                </div>
              </div>

              {/* Key Bullet Highlights */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#083B5C]">
                <span className="rounded-full border border-[#D3EDFA] bg-[#EAF6FD] px-3 py-1">
                  ✓ Unfolds in seconds
                </span>
                <span className="rounded-full border border-[#D3EDFA] bg-[#EAF6FD] px-3 py-1">
                  ✓ Plastic-free paper
                </span>
                <span className="rounded-full border border-[#D3EDFA] bg-[#EAF6FD] px-3 py-1">
                  ✓ Fold & bin after use
                </span>
              </div>

              {/* Pack Selector */}
              <div className="space-y-3 border-t border-b border-[#D3E4EF] py-5">
                <div className="flex items-center justify-between text-xs font-bold tracking-wider text-[#083B5C] uppercase">
                  <span>1. Select Pack Size</span>
                  <span className="font-semibold text-[#0F6DA6] normal-case">
                    Free shipping over ₹599
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {Object.values(packs).map((pack: any) => {
                    const isSelected = selectedPackId === pack.id;
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                          isSelected
                            ? "border-[#0F6DA6] bg-[#EAF6FD] shadow-md"
                            : "border-[#D3E4EF] bg-white hover:border-[#0F6DA6]/50"
                        }`}
                      >
                        {pack.flag && (
                          <span className="absolute -top-3 right-3 rounded-full bg-[#C6E82E] px-2.5 py-0.5 text-[10px] font-extrabold text-[#083B5C] uppercase shadow-xs">
                            {pack.flag}
                          </span>
                        )}
                        <div>
                          <p className="font-serif text-lg font-bold text-[#083B5C]">
                            {pack.name}
                          </p>
                          <p className="mt-0.5 text-xs leading-tight text-gray-500">
                            {pack.sub}
                          </p>
                        </div>
                        <div className="mt-3 flex items-baseline justify-between border-t border-[#D3E4EF]/60 pt-2">
                          <span className="text-base font-extrabold text-[#0F6DA6]">
                            ₹{pack.price}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{pack.mrp}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Purchase Mode */}
              <div className="space-y-3">
                <span className="block text-xs font-bold tracking-wider text-[#083B5C] uppercase">
                  2. Purchase Mode
                </span>
                <div className="space-y-2">
                  {[
                    {
                      id: "once",
                      label: "Buy once",
                      desc: "One-time purchase",
                      badge: null,
                    },
                    {
                      id: "sub1",
                      label: "Subscribe monthly",
                      desc: "Delivered every month",
                      badge: "Save 10%",
                    },
                    {
                      id: "sub2",
                      label: "Subscribe every 2 months",
                      desc: "Delivered bimonthly",
                      badge: "Save 5%",
                    },
                  ].map((mode) => {
                    const isSelected = selectedModeId === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedModeId(mode.id)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 text-left transition-all ${
                          isSelected
                            ? "border-[#0F6DA6] bg-[#EAF6FD]"
                            : "border-[#D3E4EF] bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                              isSelected
                                ? "border-[#0F6DA6] bg-[#0F6DA6]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#083B5C]">
                              {mode.label}
                            </p>
                            <p className="text-xs text-gray-500">{mode.desc}</p>
                          </div>
                        </div>

                        {mode.badge && (
                          <span className="rounded-full bg-[#0F6DA6] px-2.5 py-0.5 text-[11px] font-bold text-white">
                            {mode.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Quantity & Add To Cart */}
              <div className="space-y-4 rounded-3xl border border-[#D3E4EF] bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-3xl font-extrabold text-[#083B5C]">
                      ₹{totalPrice}
                    </span>
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      ₹{totalMrp}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <span className="rounded-full border border-[#BFE3CA] bg-[#E6F4EA] px-3 py-1 text-xs font-bold text-[#15803D]">
                      Save ₹{totalSavings}
                    </span>
                  )}
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-[#083B5C] uppercase">
                    Quantity
                  </span>
                  <div className="flex items-center overflow-hidden rounded-xl border border-[#0F6DA6]/30 bg-[#F5FAFD]">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="cursor-pointer px-3.5 py-1.5 text-sm font-bold text-[#0F6DA6] transition-colors hover:bg-[#0F6DA6] hover:text-white"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-[#083B5C]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="cursor-pointer px-3.5 py-1.5 text-sm font-bold text-[#0F6DA6] transition-colors hover:bg-[#0F6DA6] hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0F6DA6] py-4 text-base font-bold text-white shadow-md transition-all hover:bg-[#0B4E78] disabled:opacity-50"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {adding ? "Adding to Cart..." : "Add to Cart"}
                </button>
              </div>

              {/* Trust Badges & Guarantee Content (Attached 3 Images) */}
              <div className="my-2 space-y-4">
                {/* Image 1: Water-resistant, Biodegradable, Fresh cover every use */}
                <div className="border-t border-b border-[#D3E4EF]/80 pt-3 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700 sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4.5 w-4.5 stroke-[1.75] text-[#0F6DA6]" />
                      <span>Water-resistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 stroke-[1.75] text-[#0F6DA6]" />
                      <span>Biodegradable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCw className="h-4.5 w-4.5 stroke-[1.75] text-[#0F6DA6]" />
                      <span>Fresh cover every use</span>
                    </div>
                  </div>
                </div>

                {/* Image 2: Support & Guarantee Banner */}
                <div className="py-1 text-xs text-slate-600 sm:text-sm">
                  <span>
                    If it's not right,{" "}
                    <strong className="font-bold text-[#083B5C]">
                      we'll make it right.
                    </strong>{" "}
                    Questions? Email{" "}
                    <a
                      href="mailto:care@potenthygiene.com"
                      className="font-bold text-[#0F6DA6] underline hover:text-[#083B5C]"
                    >
                      care@potenthygiene.com
                    </a>
                  </span>
                </div>

                {/* Image 3: Shop With Confidence */}
                <div className="space-y-3 border-t border-[#D3E4EF]/80 pt-4">
                  <h4 className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
                    SHOP WITH CONFIDENCE
                  </h4>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 text-xs font-medium text-slate-700 sm:grid-cols-2 sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4.5 w-4.5 shrink-0 stroke-[1.75] text-[#0F6DA6]" />
                      <span>Biodegradable, plastic-free paper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4.5 w-4.5 shrink-0 stroke-[1.75] text-[#0F6DA6]" />
                      <span>Woman-founded · Made for India</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Check className="h-4.5 w-4.5 shrink-0 stroke-[2.25] text-[#0F6DA6]" />
                      <span>Free shipping over ₹599</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pincode Availability Checker */}
              <div className="space-y-2 rounded-2xl border border-[#D3E4EF] bg-[#EAF6FD] p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#083B5C]">
                  <Truck className="h-4 w-4 text-[#0F6DA6]" />
                  <span>Check Delivery & Pincode Availability</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit PIN code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 rounded-xl border border-[#D3E4EF] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#0F6DA6] focus:outline-none"
                    maxLength={6}
                  />
                  <button
                    onClick={checkPincode}
                    className="cursor-pointer rounded-xl bg-[#083B5C] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0F6DA6]"
                  >
                    Check
                  </button>
                </div>
                {pincodeResult && (
                  <p
                    className={`mt-1 text-xs font-semibold ${pincodeResult.err ? "text-red-600" : "text-[#15803D]"}`}
                  >
                    {pincodeResult.msg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specification Strip */}
      <section className="bg-[#0F6DA6] py-6 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-[#C6E82E]" />
              <div>
                <p className="font-serif text-lg font-bold">
                  100% Plastic-Free
                </p>
                <p className="text-xs text-white/80">Biodegradable paper</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 shrink-0 text-[#C6E82E]" />
              <div>
                <p className="font-serif text-lg font-bold">
                  No-Contact Barrier
                </p>
                <p className="text-xs text-white/80">Protects from wet seats</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 shrink-0 text-[#C6E82E]" />
              <div>
                <p className="font-serif text-lg font-bold">Fits All Seats</p>
                <p className="text-xs text-white/80">
                  Standard Western toilets
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 shrink-0 text-[#C6E82E]" />
              <div>
                <p className="font-serif text-lg font-bold">Fold & Bin</p>
                <p className="text-xs text-white/80">Never flush after use</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. A clean seat, everywhere (Matches Screenshot 1) */}
      <section
        id="clean-seat"
        className="border-b border-[#D3E4EF] bg-[#EAF6FD] py-12 sm:py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-8 max-w-4xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#1E9BD7] uppercase">
              A CLEAN SEAT, EVERYWHERE
            </span>
            <h2 className="font-serif text-3xl leading-tight font-extrabold text-[#083B5C] sm:text-4xl lg:text-5xl">
              When the seat's filthy,{" "}
              <span className="text-[#0F6DA6]">just cover & sit.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              The airport boarding lounge. The mall bathroom on level three. The
              restroom at the highway food court. The waiting room at the
              railway station. Every one comes with the same silent negotiation:
              hover painfully, lay bits of tissue haphazardly, or just sit and
              hope. Looway Disposable Toilet Seat Covers end that negotiation —
              one unfolds in seconds, covers the seat completely, and you sit
              down properly. No bare skin, no hovering, no dread.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col justify-between rounded-3xl border border-[#D3E4EF] bg-white p-6 shadow-xs">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF6FD] text-[#0F6DA6]">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-base font-bold text-[#083B5C]">
                  Dirty public seats
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Unfold a cover and sit — your skin never touches the seat. No
                  hovering, no crouching, no dread.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-[#D3E4EF] bg-white p-6 shadow-xs">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF6FD] text-[#0F6DA6]">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-base font-bold text-[#083B5C]">
                  School & period days
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  School and college toilets are often the grimmest of all — and
                  worst on a period day. Your daughter lays a cover and sits,
                  clean and confident.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-[#D3E4EF] bg-white p-6 shadow-xs">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF6FD] text-[#0F6DA6]">
                  <Baby className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-base font-bold text-[#083B5C]">
                  Out with babies & toddlers
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Travelling with little ones who touch everything? Place a
                  cover so a restaurant, mall or highway seat is a clean place
                  for them to sit.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-[#D3E4EF] bg-white p-6 shadow-xs">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF6FD] text-[#0F6DA6]">
                  <Car className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-base font-bold text-[#083B5C]">
                  Travel, highways & offices
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Airports, trains, the dhaba loo, the office at peak hours — a
                  slim box in your bag means every Western seat is sorted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why it works · How it works (Matches Screenshot 2) */}
      <section
        id="why-how-it-works"
        className="border-b border-[#D3E4EF] bg-[#EAF6FD] py-12 sm:py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-8 max-w-4xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#1E9BD7] uppercase">
              WHY IT WORKS
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#083B5C] sm:text-4xl lg:text-5xl">
              How it works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              It couldn't be simpler. Unfold the cover, push out the centre
              panel, lay it flat over the seat, and sit. The water-resistant
              paper covers every inch your skin would touch and keeps the seat's
              moisture where it belongs — on the seat, not on you.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Step 1 Card */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-[#D3E4EF] bg-white p-6 shadow-xs">
              <span className="pointer-events-none absolute top-3 right-6 font-serif text-6xl font-extrabold text-[#D8EBF7]">
                1
              </span>
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F6DA6] text-white">
                  <ShieldAlert className="h-6 w-6 text-[#C6E82E]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#083B5C]">
                  Unfold & drop the panel
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Open the cover fully, then push out the{" "}
                  <strong className="font-bold text-[#083B5C]">
                    perforated centre panel
                  </strong>{" "}
                  so it hangs down into the bowl. That flap anchors the cover in
                  place and stops it slipping in.
                </p>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-[#D3E4EF] bg-white p-6 shadow-xs">
              <span className="pointer-events-none absolute top-3 right-6 font-serif text-6xl font-extrabold text-[#D8EBF7]">
                2
              </span>
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F6DA6] text-white">
                  <ShieldCheck className="h-6 w-6 text-[#C6E82E]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#083B5C]">
                  Lay it edge to edge
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Spread the cover over the seat so it lies flat —{" "}
                  <strong className="font-bold text-[#083B5C]">
                    front, sides and back all covered
                  </strong>
                  , no gaps. The water-resistant side faces up, ready for you to
                  sit.
                </p>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-[#D3E4EF] bg-white p-6 shadow-xs">
              <span className="pointer-events-none absolute top-3 right-6 font-serif text-6xl font-extrabold text-[#D8EBF7]">
                3
              </span>
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F6DA6] text-white">
                  <CheckCircle2 className="h-6 w-6 text-[#C6E82E]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#083B5C]">
                  Sit, then fold & bin
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Sit down normally on a clean, dry surface. When you're done,
                  lift the cover, fold it and drop it in the bin —{" "}
                  <strong className="font-bold text-[#083B5C]">
                    never flush it
                  </strong>
                  . Close the box to keep the rest flat and dry.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Blue Notice Strip */}
          <div className="rounded-r-2xl border-l-4 border-[#0F6DA6] bg-[#E2F1FB] p-4 text-xs text-slate-700 sm:text-sm">
            <strong className="font-bold text-[#083B5C]">
              No technique, no learning curve.
            </strong>{" "}
            If you can unfold a tissue, you can use a Looway cover — most people
            get it right on the very first try. See the full step-by-step below.
          </div>
        </div>
      </section>

      {/* 3. Watch, don't read (Matches Screenshot 3) */}
      <section
        id="watch-dont-read"
        className="border-b border-[#D3E4EF] bg-[#EAF6FD] py-12 sm:py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-6 max-w-4xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#1E9BD7] uppercase">
              WATCH, DON'T READ
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#083B5C] sm:text-4xl lg:text-5xl">
              Step inside the Looway guide
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Quick, tappable stories — how to open and place a cover, why we
              say bin it (never flush), the honest truth about germs and seats,
              and every place one saves your day. Tap a circle to enter, then
              tap or swipe through.
            </p>
          </div>

          {/* Got a question box */}
          <div className="mb-5 rounded-3xl border border-[#D3E4EF] bg-white/90 p-5 shadow-xs">
            <p className="mb-3 text-xs font-semibold text-gray-600 sm:text-sm">
              Got a question before you buy? Tap a common one — or dive into the
              full guide below.
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {[
                { label: "Will it fall in?", storyId: "seal" },
                { label: "How do I use it?", storyId: "use" },
                { label: "Do I flush or bin it?", storyId: "practice" },
                { label: "Which seats does it fit?", storyId: "toilets" },
                { label: "Do these really stop germs?", storyId: "yatra" },
              ].map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => {
                    const st =
                      (content?.STORIES || []).find(
                        (s: any) => s.id === pill.storyId,
                      ) || content?.STORIES?.[0];
                    setActiveStory(st);
                    setActiveSlideIndex(0);
                  }}
                  className="cursor-pointer rounded-full border border-[#D3EDFA] bg-[#EAF6FD] px-3.5 py-1.5 text-xs font-bold text-[#083B5C] transition-colors hover:bg-[#0F6DA6] hover:text-white"
                >
                  {pill.label}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("pdp-hero")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex cursor-pointer items-center gap-1 text-xs font-bold text-[#0F6DA6] hover:underline"
            >
              ↑ I'm all set — take me to the packs
            </button>
          </div>

          {/* Enter the Looway guide banner */}
          <div
            onClick={() => {
              setActiveStory(content?.STORIES?.[0]);
              setActiveSlideIndex(0);
            }}
            className="group mb-6 flex cursor-pointer items-center justify-between rounded-3xl bg-gradient-to-r from-[#0F6DA6] via-[#0B4E78] to-[#083B5C] p-5 text-white shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                <Play className="ml-0.5 h-5 w-5 fill-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white sm:text-xl">
                  Enter the Looway guide
                </h3>
                <p className="text-xs text-white/80">
                  Tap to step in — quick stories, swipe through in a minute
                </p>
              </div>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C6E82E] text-[#083B5C] transition-transform group-hover:scale-110">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* Circular Story Bubbles Row */}
          <div className="no-scrollbar mb-8 flex gap-4 overflow-x-auto pb-4">
            {[
              { id: "seal", name: "Will it fall in?" },
              { id: "practice", name: "Flush or bin?" },
              { id: "toilets", name: "Which seats?" },
              { id: "yatra", name: "Who needs it" },
              { id: "outdoors", name: "Events & trips" },
              { id: "pregnancy", name: "Pregnancy" },
              { id: "yatra", name: "Sore knees" },
              { id: "use", name: "Why Looway" },
              { id: "yatra", name: "Germs, honestly" },
              { id: "use", name: "Quick & easy" },
            ].map((bubble, idx) => (
              <button
                key={bubble.name + idx}
                onClick={() => {
                  const st =
                    (content?.STORIES || []).find(
                      (s: any) => s.id === bubble.id,
                    ) || content?.STORIES?.[0];
                  setActiveStory(st);
                  setActiveSlideIndex(0);
                }}
                className="group flex w-20 shrink-0 cursor-pointer flex-col items-center text-center"
              >
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#0F6DA6] bg-white p-1 shadow-xs transition-transform group-hover:scale-105">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#EAF6FD] text-[#0F6DA6]">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F6DA6] text-white">
                    <Play className="ml-0.5 h-2.5 w-2.5 fill-white" />
                  </div>
                </div>
                <span className="mt-2 line-clamp-2 text-[11px] leading-tight font-bold text-[#083B5C]">
                  {bubble.name}
                </span>
              </button>
            ))}
          </div>

          {/* Grouped Numbered Sections (01, 02, 03, 04) */}
          <div className="space-y-6">
            {/* 01 START HERE */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F6DA6] text-xs font-bold text-white">
                  01
                </span>
                <span className="text-xs font-extrabold tracking-wider text-[#0F6DA6] uppercase">
                  START HERE ·{" "}
                </span>
                <span className="text-xs font-bold text-[#083B5C]">
                  Master it
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "How to use a cover",
                    sub: "Open, place & sit in ten seconds",
                    id: "use",
                  },
                  {
                    title: "Will it fall in?",
                    sub: "The centre panel keeps it put",
                    id: "seal",
                  },
                  {
                    title: "Bin it, never flush",
                    sub: "Why we don't say 'flushable'",
                    id: "practice",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      const st =
                        (content?.STORIES || []).find(
                          (s: any) => s.id === item.id,
                        ) || content?.STORIES?.[0];
                      setActiveStory(st);
                      setActiveSlideIndex(0);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#D3E4EF] bg-white p-4 text-left shadow-xs transition-all hover:border-[#0F6DA6]"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#083B5C]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{item.sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#0F6DA6]" />
                  </button>
                ))}
              </div>
            </div>

            {/* 02 WHERE IT WORKS */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F6DA6] text-xs font-bold text-white">
                  02
                </span>
                <span className="text-xs font-extrabold tracking-wider text-[#0F6DA6] uppercase">
                  WHERE IT WORKS ·{" "}
                </span>
                <span className="text-xs font-bold text-[#083B5C]">
                  Any Western seat
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "Which seats it fits",
                    sub: "Standard seats · not squat pans",
                    id: "toilets",
                  },
                  {
                    title: "Who it helps most",
                    sub: "Sore knees, pregnancy, UTI-cautious",
                    id: "yatra",
                  },
                  {
                    title: "Events, festivals & trips",
                    sub: "A clean seat, wherever you are",
                    id: "outdoors",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      const st =
                        (content?.STORIES || []).find(
                          (s: any) => s.id === item.id,
                        ) || content?.STORIES?.[0];
                      setActiveStory(st);
                      setActiveSlideIndex(0);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#D3E4EF] bg-white p-4 text-left shadow-xs transition-all hover:border-[#0F6DA6]"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#083B5C]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{item.sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#0F6DA6]" />
                  </button>
                ))}
              </div>
            </div>

            {/* 03 MADE FOR YOU */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F6DA6] text-xs font-bold text-white">
                  03
                </span>
                <span className="text-xs font-extrabold tracking-wider text-[#0F6DA6] uppercase">
                  MADE FOR YOU ·{" "}
                </span>
                <span className="text-xs font-bold text-[#083B5C]">
                  For everyone who sits
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "Pregnancy",
                    sub: "Just sit down, no hovering",
                    id: "pregnancy",
                  },
                  {
                    title: "Seniors & sore knees",
                    sub: "Independence, restored",
                    id: "yatra",
                  },
                  {
                    title: "Why a seat cover?",
                    sub: "What makes it worth it",
                    id: "use",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      const st =
                        (content?.STORIES || []).find(
                          (s: any) => s.id === item.id,
                        ) || content?.STORIES?.[0];
                      setActiveStory(st);
                      setActiveSlideIndex(0);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#D3E4EF] bg-white p-4 text-left shadow-xs transition-all hover:border-[#0F6DA6]"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#083B5C]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{item.sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#0F6DA6]" />
                  </button>
                ))}
              </div>
            </div>

            {/* 04 GOOD TO KNOW */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F6DA6] text-xs font-bold text-white">
                  04
                </span>
                <span className="text-xs font-extrabold tracking-wider text-[#0F6DA6] uppercase">
                  GOOD TO KNOW ·{" "}
                </span>
                <span className="text-xs font-bold text-[#083B5C]">
                  The honest bit
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Germs & seats, honestly",
                    sub: "What a cover really does",
                    id: "yatra",
                  },
                  {
                    title: "Quick, one-handed & easy",
                    sub: "Easier than you think",
                    id: "use",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      const st =
                        (content?.STORIES || []).find(
                          (s: any) => s.id === item.id,
                        ) || content?.STORIES?.[0];
                      setActiveStory(st);
                      setActiveSlideIndex(0);
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#D3E4EF] bg-white p-4 text-left shadow-xs transition-all hover:border-[#0F6DA6]"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#083B5C]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{item.sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#0F6DA6]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The details · What's in the pack & specs (Matches Screenshot 4) */}
      <section
        id="pack-specs"
        className="border-b border-[#D3E4EF] bg-[#EAF6FD] py-12 sm:py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-8 max-w-4xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#1E9BD7] uppercase">
              THE DETAILS
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#083B5C] sm:text-4xl lg:text-5xl">
              What's in the pack & specs
            </h2>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left Column: What's in the box */}
            <div className="rounded-3xl bg-[#0F6DA6] p-6 text-white shadow-md sm:p-8 lg:col-span-5">
              <h3 className="mb-6 font-serif text-2xl font-bold text-white">
                What's in the box
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#C6E82E]">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      100 disposable covers
                    </h4>
                    <p className="mt-0.5 text-xs text-white/80">
                      Biodegradable, water-resistant paper
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-white/20 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#C6E82E]">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      2 resealable boxes
                    </h4>
                    <p className="mt-0.5 text-xs text-white/80">
                      Slim boxes keep covers flat, dry & pocket-ready
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Specs Table */}
            <div className="overflow-hidden rounded-3xl border border-[#D3E4EF] bg-white shadow-xs lg:col-span-7">
              <div className="divide-y divide-[#D3E4EF] text-xs sm:text-sm">
                {[
                  ["Covers per box", "25 covers"],
                  ["Pack options", "2-Pack (50 covers) or 4-Pack (100 covers)"],
                  [
                    "Material",
                    "Biodegradable, water-resistant paper — zero plastic",
                  ],
                  [
                    "Water-resistant",
                    "Yes — moisture from the seat doesn't pass through",
                  ],
                  ["Reusable", "No — single use, one cover per sitting"],
                  ["Toilet type", "Western (sit-down) seats only"],
                  ["Fit", "Fits all standard Western toilet seats"],
                  ["Packaging", "Slim, resealable box"],
                  ["Disposal", "Fold and bin — never flush"],
                  [
                    "Best for",
                    "Airports, railways, highways, malls, offices, hotels, hospitals, pilgrimages & events",
                  ],
                  [
                    "Suitable for",
                    "Everyone — women, men, children, pregnant women, seniors, frequent travellers",
                  ],
                  ["Made", "For India"],
                ].map(([key, val]) => (
                  <div
                    key={key}
                    className="flex p-3.5 transition-colors hover:bg-[#F5FAFD] sm:p-4"
                  >
                    <span className="w-1/3 shrink-0 font-bold text-[#083B5C]">
                      {key}
                    </span>
                    <span className="w-2/3 leading-relaxed text-gray-700">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Use it safely (Matches Screenshot 5) */}
      <section
        id="use-it-safely"
        className="border-b border-[#D3E4EF] bg-[#EAF6FD] py-12 sm:py-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="rounded-3xl border-2 border-[#9FCB1E] bg-[#EAF6FD] p-6 shadow-xs sm:p-8">
            <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-[#083B5C]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6E82E] text-lg font-extrabold text-[#083B5C] shadow-xs">
                !
              </div>
              Use it safely
            </h3>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <p>
                    <strong className="font-bold text-[#083B5C]">
                      Single use only.
                    </strong>{" "}
                    One cover per sitting — don't reuse a cover once you've sat
                    on it. Take a fresh one each time.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0F6DA6]" />
                  <p>
                    For Western (sit-down) toilet seats only — not for squat or
                    floor-level pans. For squat toilets, the Looway Pee Funnel
                    is the right hygiene tool.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0F6DA6]" />
                  <p>
                    Keep out of reach of young children, who may put paper in
                    their mouths.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <p>
                    <strong className="font-bold text-[#083B5C]">
                      Do not flush.
                    </strong>{" "}
                    Always fold the used cover and drop it in a waste bin.
                    Biodegradable does not mean drain-safe — flushing can block
                    pipes and septic tanks.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0F6DA6]" />
                  <p>
                    Keep covers dry before use. Store them in the closed box,
                    away from moisture and humidity, so they open flat every
                    time.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#0F6DA6]" />
                  <p>
                    <strong className="font-bold text-[#083B5C]">
                      Pregnancy:
                    </strong>{" "}
                    safe to use throughout pregnancy.{" "}
                    <strong className="font-bold text-[#083B5C]">
                      Elderly & limited-mobility users:
                    </strong>{" "}
                    sit directly with full confidence — no need to hover or
                    brace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Where to use" Location Explorer Section */}
      <section
        id="where-to-use"
        className="bg-[#FAF7F2] py-14 text-[#083B5C] sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-8 max-w-3xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#0F6DA6] uppercase">
              WHERE IT EARNS ITS SPOT
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#083B5C] sm:text-4xl lg:text-5xl">
              Every place you'll be glad you packed it
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Select a location to see how a slim box of covers in your bag
              saves the day.
            </p>
          </div>

          {/* Stepper Node Line Track */}
          <div className="relative mb-8">
            <div className="relative overflow-hidden py-4">
              <div className="pointer-events-none absolute top-[30px] right-8 left-8 z-0 h-[2px] border-t-2 border-dashed border-[#A0D2CE]" />

              <div
                ref={stepperRef}
                className="no-scrollbar relative z-10 flex snap-x items-start gap-8 overflow-x-auto scroll-smooth px-4 pt-1 pb-4 sm:gap-12"
              >
                {(content?.STOPS || []).map((stop: any[], idx: number) => {
                  const isActive = idx === activeStopIndex;
                  return (
                    <div
                      key={stop[1]}
                      onClick={() => setActiveStopIndex(idx)}
                      className="group flex w-28 shrink-0 cursor-pointer snap-center flex-col items-center text-center sm:w-32"
                    >
                      <div
                        className={`z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
                          isActive
                            ? "scale-110 border-2 border-[#083B5C] bg-[#083B5C] shadow-md ring-4 ring-[#0F6DA6]/25"
                            : "border-2 border-[#0F6DA6] bg-white group-hover:scale-105 group-hover:border-[#083B5C]"
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full transition-colors ${
                            isActive
                              ? "bg-white"
                              : "bg-[#0F6DA6] group-hover:bg-[#083B5C]"
                          }`}
                        />
                      </div>
                      <span
                        className={`mt-3 line-clamp-2 text-xs leading-tight font-bold transition-colors ${
                          isActive
                            ? "font-extrabold text-[#083B5C]"
                            : "text-[#0F6DA6] group-hover:text-[#083B5C]"
                        }`}
                      >
                        {stop[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nav Arrows */}
            <div className="mt-2 flex items-center justify-end gap-2 pr-2">
              <button
                onClick={() =>
                  setActiveStopIndex((prev) =>
                    prev > 0 ? prev - 1 : content.STOPS.length - 1,
                  )
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setActiveStopIndex((prev) =>
                    prev < content.STOPS.length - 1 ? prev + 1 : 0,
                  )
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Detail Showcase Card */}
          {content?.STOPS?.[activeStopIndex] && (
            <div className="rounded-3xl border border-[#E5DAC9] bg-white p-6 shadow-sm transition-all sm:p-8">
              <div className="flex flex-col items-start gap-5 sm:gap-6 md:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C6E82E] text-[#083B5C] shadow-sm sm:h-16 sm:w-16">
                  {React.createElement(
                    StopIconMap[content.STOPS[activeStopIndex][0]] || MapPin,
                    { className: "h-7 w-7 sm:h-8 sm:w-8" },
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-[#083B5C] sm:text-3xl">
                    {content.STOPS[activeStopIndex][1]}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
                    {content.STOPS[activeStopIndex][2]}
                  </p>

                  {content.STOPS[activeStopIndex][3] && (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D3EDFA] bg-[#EAF6FD] px-4 py-1.5 text-xs font-semibold text-[#083B5C] sm:text-sm">
                      <Check className="h-4 w-4 text-[#0F6DA6]" />
                      <span>
                        Pack in{" "}
                        <strong className="font-bold text-[#083B5C]">
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

      {/* "Who it's for" Section */}
      <section
        id="who-its-for"
        className="border-t border-b border-[#D3E4EF] bg-white py-14 sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-10 max-w-3xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#0F6DA6] uppercase">
              IDEAL FOR EVERYONE
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#083B5C] sm:text-4xl">
              Who uses Looway seat covers?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                title: "Students & College Girls",
                desc: "School and college toilets are often the dirtiest a girl uses all day — especially on period days. A slim box in her bag gives her a clean, dry sit every time.",
                icon: Heart,
              },
              {
                title: "Travellers & Commuters",
                desc: "Boarding lounges, train washrooms, highway dhabas and metro stations. Keep a box in your carry-on or work bag to make any public toilet comfortable.",
                icon: Plane,
              },
              {
                title: "Mums Travelling with Kids",
                desc: "Toddlers touch everything and can't balance over a filthy seat. Place a cover so restaurant or mall toilets are clean for them to sit down safely.",
                icon: Baby,
              },
              {
                title: "Seniors & Sore Knees",
                desc: "When squatting hurts and low, dirty seats feel unsafe, paper seat covers restore independence so older women can sit comfortably without touching dirty porcelain.",
                icon: ShieldCheck,
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#D3E4EF] bg-[#F5FAFD] p-5 transition-all hover:border-[#0F6DA6] sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F6DA6] text-[#C6E82E]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-lg font-bold text-[#083B5C]">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Section ("Looway vs Alternatives") */}
      <section className="bg-[#F5FAFD] py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-10 max-w-3xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#0F6DA6] uppercase">
              WHY LOOWAY COVERS?
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#083B5C] sm:text-4xl">
              Looway paper covers vs other methods
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#D3E4EF] bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0F6DA6] text-white">
                <tr>
                  <th className="p-4 font-serif text-sm font-bold">Feature</th>
                  <th className="bg-[#083B5C] p-4 font-serif text-sm font-bold">
                    Looway Paper Cover
                  </th>
                  <th className="p-4 font-serif text-sm font-bold">
                    Hovering / Squatting
                  </th>
                  <th className="p-4 font-serif text-sm font-bold">
                    Toilet Paper Layering
                  </th>
                  <th className="p-4 font-serif text-sm font-bold">
                    Disinfectant Sprays
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3E4EF]">
                <tr>
                  <td className="p-4 font-bold text-[#083B5C]">
                    100% No-contact skin barrier
                  </td>
                  <td className="bg-[#EAF6FD] p-4 font-extrabold text-[#15803D]">
                    ✓ Yes — complete coverage
                  </td>
                  <td className="p-4 text-gray-500">
                    ✕ No — one slip means contact
                  </td>
                  <td className="p-4 text-gray-500">
                    ✕ Paper shifts & soaks through
                  </td>
                  <td className="p-4 text-gray-500">
                    ✕ Leaves seat wet to sit on
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#083B5C]">
                    No knee, back or squat strain
                  </td>
                  <td className="bg-[#EAF6FD] p-4 font-extrabold text-[#15803D]">
                    ✓ Yes — sit comfortably
                  </td>
                  <td className="p-4 text-gray-500">
                    ✕ Painful on knees & back
                  </td>
                  <td className="p-4 font-semibold text-gray-700">
                    ✓ Sit down
                  </td>
                  <td className="p-4 font-semibold text-gray-700">
                    ✓ Sit down
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#083B5C]">
                    Stays in place while sitting
                  </td>
                  <td className="bg-[#EAF6FD] p-4 font-extrabold text-[#15803D]">
                    ✓ Yes — bowl flap anchors it
                  </td>
                  <td className="p-4 text-gray-500">N/A</td>
                  <td className="p-4 text-gray-500">✕ Slides around easily</td>
                  <td className="p-4 font-semibold text-gray-700">N/A</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#083B5C]">
                    Plastic-free & eco-disposal
                  </td>
                  <td className="bg-[#EAF6FD] p-4 font-extrabold text-[#15803D]">
                    ✓ Plain paper — fold & bin
                  </td>
                  <td className="p-4 text-gray-500">N/A</td>
                  <td className="p-4 text-gray-500">
                    Wastes rolls of toilet paper
                  </td>
                  <td className="p-4 text-gray-500">
                    Aerosol / plastic bottle packaging
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* "Loved on every trip out" Reviews Section */}
      <section
        id="reviews"
        className="bg-[#FAF7F2] py-14 text-[#083B5C] sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-6 max-w-3xl">
            <span className="mb-2 block text-xs font-bold tracking-widest text-[#0F6DA6] uppercase">
              WHAT BUYERS SAY
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#083B5C] sm:text-4xl lg:text-5xl">
              Loved on every trip out
            </h2>
          </div>

          {/* Rating Breakdown Card */}
          <div className="mb-8 rounded-3xl border border-[#EBE3D7] bg-[#F9F3EA] p-6 sm:p-8">
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
              <div className="flex flex-col justify-center border-b border-[#E5DAC9] pb-6 md:col-span-5 md:border-r md:border-b-0 md:pr-6 md:pb-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-extrabold text-[#083B5C] sm:text-6xl">
                    4.8
                  </span>
                  <span className="text-xl font-bold text-gray-500">/ 5</span>
                </div>
                <div className="my-2 flex text-[#F4C430]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#F4C430] text-[#F4C430]"
                    />
                  ))}
                </div>
                <p className="text-sm font-bold text-[#083B5C]">
                  96 verified reviews
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                  <ShieldCheck className="h-4 w-4" /> Every review from a
                  verified purchase
                </p>
              </div>

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
                    <span className="w-6 shrink-0 text-xs font-bold text-[#083B5C]">
                      {row.stars} ★
                    </span>
                    <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#E3EFEF]">
                      <div
                        className="h-full rounded-full bg-[#F4C430] transition-all duration-500"
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

          {/* Filter Pills */}
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
                        ? "border-[#0F6DA6] bg-[#0F6DA6] text-white shadow-sm"
                        : "border-[#E5DAC9] bg-white text-[#083B5C] hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Carousel */}
          <div className="group relative mt-6">
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
                      <div className="mb-3 flex text-[#F4C430]">
                        {[...Array(review.stars || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-[#F4C430] text-[#F4C430]"
                          />
                        ))}
                      </div>
                      <p className="text-xs leading-relaxed font-normal text-gray-700 sm:text-sm">
                        "{review.quote}"
                      </p>
                    </div>

                    <div className="mt-5 flex items-start gap-3 border-t border-gray-100 pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF6FD] text-sm font-bold text-[#0F6DA6]">
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#083B5C]">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.city || "Verified Buyer"}
                        </p>
                        {review.stage && (
                          <span className="mt-1.5 inline-block rounded-full border border-[#D3EDFA] bg-[#EAF6FD] px-2.5 py-0.5 text-[11px] font-semibold text-[#0F6DA6]">
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

            <button
              onClick={() => {
                if (reviewsRef.current)
                  reviewsRef.current.scrollBy({
                    left: -340,
                    behavior: "smooth",
                  });
              }}
              className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition-all hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                if (reviewsRef.current)
                  reviewsRef.current.scrollBy({
                    left: 340,
                    behavior: "smooth",
                  });
              }}
              className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-md transition-all hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Story Viewer Modal Popup */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative flex min-h-[480px] w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl bg-[#083B5C] p-6 text-white shadow-2xl">
            <div>
              <div className="mb-4 flex gap-1.5">
                {activeStory.slides?.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                  >
                    <div
                      className={`h-full bg-[#C6E82E] transition-all duration-300 ${
                        idx === activeSlideIndex
                          ? "w-full"
                          : idx < activeSlideIndex
                            ? "w-full opacity-60"
                            : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[#0F6DA6] px-3 py-1 text-xs font-bold text-white">
                  {activeStory.t}
                </span>
                <button
                  onClick={() => setActiveStory(null)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="my-6">
                <h3 className="mb-3 font-serif text-2xl font-bold text-[#C6E82E]">
                  {activeStory.slides?.[activeSlideIndex]?.h}
                </h3>
                <p className="text-sm leading-relaxed text-gray-200">
                  {activeStory.slides?.[activeSlideIndex]?.b}
                </p>
                {activeStory.slides?.[activeSlideIndex]?.tip && (
                  <div className="mt-4 rounded-2xl border border-white/20 bg-[#0F6DA6]/60 p-3 text-xs text-white">
                    💡 <strong>Pro Tip:</strong>{" "}
                    {activeStory.slides[activeSlideIndex].tip}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() =>
                  setActiveSlideIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={activeSlideIndex === 0}
                className="cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20 disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-xs text-gray-400">
                {activeSlideIndex + 1} of {activeStory.slides?.length || 1}
              </span>
              {activeSlideIndex < (activeStory.slides?.length || 1) - 1 ? (
                <button
                  onClick={() => setActiveSlideIndex((prev) => prev + 1)}
                  className="cursor-pointer rounded-xl bg-[#C6E82E] px-4 py-2 text-xs font-bold text-[#083B5C] transition-colors hover:bg-white"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setActiveStory(null)}
                  className="cursor-pointer rounded-xl bg-[#0F6DA6] px-4 py-2 text-xs font-bold text-white"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How To Use Step-by-Step Modal Popup */}
      {howToUseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-2xl space-y-6 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0F6DA6] uppercase">
                  STEP-BY-STEP GUIDE
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#083B5C]">
                  How to use Looway Seat Covers
                </h3>
              </div>
              <button
                onClick={() => setHowToUseModalOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-700 sm:text-sm">
              <div className="space-y-1 rounded-2xl border border-[#D3E4EF] bg-[#F5FAFD] p-4">
                <span className="block font-bold text-[#0F6DA6]">
                  Step 1: Open & Take One
                </span>
                <p>
                  Slide the slim box open and pull out a single paper cover
                  folded flat.
                </p>
              </div>
              <div className="space-y-1 rounded-2xl border border-[#D3E4EF] bg-[#F5FAFD] p-4">
                <span className="block font-bold text-[#0F6DA6]">
                  Step 2: Drop Centre Flap
                </span>
                <p>
                  Unfold fully and pop out the perforated middle oval flap into
                  the bowl to anchor the cover so it won't slip.
                </p>
              </div>
              <div className="space-y-1 rounded-2xl border border-[#D3E4EF] bg-[#F5FAFD] p-4">
                <span className="block font-bold text-[#0F6DA6]">
                  Step 3: Lay Flat Across Seat
                </span>
                <p>
                  Spread smooth edge to edge, water-resistant side up, covering
                  the front and sides of the toilet seat.
                </p>
              </div>
              <div className="space-y-1 rounded-2xl border border-[#D3E4EF] bg-[#F5FAFD] p-4">
                <span className="block font-bold text-[#0F6DA6]">
                  Step 4: Sit, Fold & Bin
                </span>
                <p>
                  Sit down normally. When done, fold the used cover and drop it
                  straight into the waste bin (never flush).
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => setHowToUseModalOpen(false)}
                className="cursor-pointer rounded-xl bg-[#083B5C] px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0F6DA6]"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Specs Modal Popup */}
      {specsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl space-y-6 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0F6DA6] uppercase">
                  PRODUCT SPECIFICATIONS
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#083B5C]">
                  Full Technical Specs
                </h3>
              </div>
              <button
                onClick={() => setSpecsModalOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs sm:text-sm">
              {(content?.QSPECS || []).map((spec: string[]) => (
                <div
                  key={spec[0]}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="font-medium text-gray-500">{spec[0]}</span>
                  <span className="font-bold text-[#083B5C]">{spec[1]}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => setSpecsModalOpen(false)}
                className="cursor-pointer rounded-xl bg-[#083B5C] px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0F6DA6]"
              >
                Close Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety & Hygiene Modal Popup */}
      {safetyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl space-y-6 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0F6DA6] uppercase">
                  HYGIENE & SAFETY
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#083B5C]">
                  Safety & Disposal Information
                </h3>
              </div>
              <button
                onClick={() => setSafetyModalOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-gray-700 sm:text-sm">
              <div className="space-y-1 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <strong className="flex items-center gap-1.5 font-bold">
                  <Trash2 className="h-4 w-4 text-amber-700" /> Bin Only — Never
                  Flush
                </strong>
                <p>
                  Always drop used covers into the waste bin. Paper seat covers
                  must not be flushed as they cause drain and plumbing
                  blockages.
                </p>
              </div>

              <div className="space-y-1 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
                <strong className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4 text-blue-700" /> Child
                  Safety Precautions
                </strong>
                <p>
                  Keep unused boxes out of reach of infants and small children.
                  Ensure paper is not placed in the mouth.
                </p>
              </div>

              <div className="space-y-1 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <strong className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" /> Hygiene &
                  Medical Note
                </strong>
                <p>
                  Looway paper seat covers are an external hygiene & comfort
                  barrier for sit-down toilets. They are not a medical device
                  and do not claim to treat or cure infections.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => setSafetyModalOpen(false)}
                className="cursor-pointer rounded-xl bg-[#083B5C] px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0F6DA6]"
              >
                Close Safety Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Section Quick-Nav Strap */}
      <div className="no-scrollbar fixed bottom-6 left-1/2 z-40 flex max-w-[94vw] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-full border border-[#E5DAC9] bg-[#FAF7F2]/95 px-3 py-2 shadow-xl backdrop-blur-md">
        {[
          { id: "pdp-hero", label: "Packs & Buy" },
          { id: "clean-seat", label: "Clean seat" },
          { id: "why-how-it-works", label: "Why & How" },
          { id: "watch-dont-read", label: "Watch" },
          { id: "pack-specs", label: "Specs" },
          { id: "use-it-safely", label: "Safety" },
          { id: "reviews", label: "Reviews" },
        ].map((item) => {
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNavId(item.id);
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-nowrap transition-all sm:text-sm ${
                isActive
                  ? "bg-[#0F6DA6] text-white shadow-sm"
                  : "border border-[#E5DAC9] bg-[#F7F4EE] text-[#083B5C] hover:bg-[#EAE3D5]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </main>
  );
}
