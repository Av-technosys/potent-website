/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  Clock,
  Truck,
  Heart,
  HelpCircle,
  ArrowRight,
  MapPin,
  Plane,
  Car,
  Bus,
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
  Baby,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";

// Import 10 Funnel section components
import FunnelNoToiletSection from "./FunnelNoToiletSection";
import FunnelHowItWorksSection from "./FunnelHowItWorksSection";
import FunnelGuideSection from "./FunnelGuideSection";
import FunnelWhereToUseSection from "./FunnelWhereToUseSection";
import FunnelWhoItsForSection from "./FunnelWhoItsForSection";
import FunnelPackAndSpecsSection from "./FunnelPackAndSpecsSection";
import FunnelUseItSafelySection from "./FunnelUseItSafelySection";
import FunnelMarketComparisonSection from "./FunnelMarketComparisonSection";
import FunnelReviewsSection from "./FunnelReviewsSection";
import FunnelFaqSection from "./FunnelFaqSection";
import WhileYoureHereSection from "./WhileYoureHereSection";

type Props = {
  product: any;
  reviewWithMedia?: any;
  content: any;
};

export default function PeeFunnelPageClient({ product, content }: Props) {
  const router = useRouter();
  const [selectedModeId, setSelectedModeId] = useState<string>("once");
  const [quantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState<string>("");
  const [pincodeResult, setPincodeResult] = useState<{
    msg: string;
    err?: boolean;
  } | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [headerHeight, setHeaderHeight] = useState<number>(100);
  const [activeNavId, setActiveNavId] = useState<string>("guide");

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

  // Scroll Spy for section nav strap
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "guide",
        "where-to-use",
        "who-its-for",
        "specs",
        "safety",
        "no-toilet",
      ];

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
        const name = v.name || v.title || `Pack of ${index === 0 ? 1 : 2}`;
        const price = Number(v.price || v.discountPrice || 0);
        const mrp = Number(
          v.discountPrice &&
            v.price &&
            Number(v.price) > Number(v.discountPrice)
            ? v.price
            : v.mrp || Math.round(price * 1.25),
        );
        const funnels = name.includes("2") ? 2 : 1;
        const flag =
          name.includes("2") || index === 1 ? "Best value" : undefined;
        const sub =
          funnels === 2
            ? "2 funnels + 2 pouches — save ₹99"
            : "1 funnel + cotton pouch";

        map[id] = {
          id,
          variantId: v.id,
          name,
          funnels,
          mrp,
          price,
          sub,
          flag,
          sku: v.sku || "LOOWAY-FUNNEL-01",
          image: v.bannerImage || product?.bannerImage || "",
        };
      });
      return map;
    }

    // Fallback if DB variants list is empty
    return (
      content?.PACKS || {
        p1: {
          id: "p1",
          name: "Pack of 1",
          funnels: 1,
          mrp: 399,
          price: 299,
          sub: "1 funnel + cotton pouch",
        },
        p2: {
          id: "p2",
          name: "Pack of 2",
          funnels: 2,
          mrp: 699,
          price: 499,
          sub: "2 funnels + 2 pouches — save ₹99",
          flag: "Best value",
        },
      }
    );
  }, [variantsList, product, content]);

  const packKeys = Object.keys(packs);
  const [selectedPackId, setSelectedPackId] = useState<string>(
    () => packKeys[1] || packKeys[0] || "p2",
  );

  useEffect(() => {
    if (!packs[selectedPackId] && packKeys.length > 0) {
      setSelectedPackId(packKeys[0]);
    }
  }, [packs, selectedPackId, packKeys]);

  const selectedPack =
    packs[selectedPackId] ||
    Object.values(packs)[0] || {
      id: "p1",
      name: "Pack of 1",
      funnels: 1,
      mrp: 399,
      price: 299,
      sub: "1 funnel + cotton pouch",
    };

  const packBasePrice = selectedPack?.price || Number(product?.price) || 299;
  const mrpPrice =
    selectedPack?.mrp || Number(product?.mrp) || Math.round(packBasePrice * 1.25);
  const unitPrice = packBasePrice;
  const totalPrice = unitPrice * quantity;
  const totalMrp = mrpPrice * quantity;
  const totalSavings = totalMrp - totalPrice;

  // Labeled Media Thumbnails
  const mediaItems = useMemo(() => {
    const defaultLabels = ["Funnel", "Standing", "Soft", "In"];
    const rawList: { url: string; label: string }[] = [];

    if (product?.bannerImage) {
      rawList.push({ url: getImageUrl(product.bannerImage), label: "Funnel" });
    }
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

    const uniqueList: { url: string; label: string }[] = [];
    const seenUrls = new Set<string>();

    for (const item of rawList) {
      if (item.url && !seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        uniqueList.push(item);
      }
    }

    const fallbackUrls = [
      "/looway-funnel-demo.jpg",
      "/looway-funnel-demo.jpg",
      "/looway-funnel-demo.jpg",
      "/looway-funnel-demo.jpg",
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
    return result;
  }, [product]);

  const mediaList = useMemo(() => mediaItems.map((item) => item.url), [mediaItems]);

  const handlePincodeCheck = () => {
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeResult({ msg: "Please enter a valid 6-digit PIN code", err: true });
      return;
    }
    setPincodeResult({
      msg: `Delivery available for ${pincode}! Ships within 24 hours.`,
      err: false,
    });
  };

  const handleAddToCart = async (isBuyNow = false) => {
    try {
      setAdding(true);
      const targetVariantId = selectedPack.variantId || product?.productVariants?.[0]?.id;
      const success = await addToCartAction({
        productId: product?.id || product?._id || "looway-pee-funnel",
        productVariantId: targetVariantId,
        sku: selectedPack?.sku || product?.productVariants?.[0]?.sku || "LOOWAY-FUNNEL-01",
        slug: product?.slug || "looway-pee-funnel",
        title: `${product?.title || product?.name || "Looway Reusable Stand-to-Pee Funnel"} (${selectedPack?.name || "Pack"})`,
        image: mediaList[0] || "/looway-funnel-demo.jpg",
        price: unitPrice,
        quantity: quantity,
        isQuantityChangable: true,
        purchaseType: "one_time",
        subscriptionType: null,
        isSubscribed: false,
      });

      if (success !== false) {
        toast.success(`Added ${quantity}x ${selectedPack?.name || "Pack"} to your bag!`, {
          action: {
            label: "View Bag",
            onClick: () => router.push("/cart"),
          },
        });
        if (isBuyNow) {
          router.push("/cart");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8f3] text-[#5A0E30] font-sans antialiased selection:bg-[#C21E63] selection:text-white">
      {/* Top Checkerboard Pattern Strap */}
      <div
        className="mb-8 h-3 w-full border-b border-[#5A0E30]/10"
        style={{
          background:
            "repeating-linear-gradient(90deg, #C21E63 0 12px, #F4C430 12px 24px)",
        }}
      />

      {/* Hero Section */}
      <section id="pdp-hero" className="w-full pt-4 pb-12 sm:pt-8 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-[#5A0E30]/60">
            <Link href="/" className="hover:text-[#C21E63] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/looway" className="hover:text-[#C21E63] transition-colors">
              Looway
            </Link>
            <span>/</span>
            <span className="text-[#C21E63] font-bold">Pee Funnel</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            {/* LEFT COLUMN: STICKY GALLERY */}
            <div className="lg:col-span-6 lg:sticky lg:top-24">
              {/* Main Image Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border-2 border-dashed border-[#C21E63]/20 bg-[#FDEEF4]/40 shadow-xs transition-all">
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4C430] px-3 py-1 text-[11px] font-extrabold text-[#5A0E30] shadow-2xs">
                    <Droplets className="h-3.5 w-3.5 fill-[#5A0E30]" />
                    <span>Soft silicone</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C21E63] px-3 py-1 text-[11px] font-extrabold text-white shadow-2xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#F4C430]" />
                    <span>Leak-free seal</span>
                  </span>
                </div>

                {/* Wishlist Heart Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-pressed={isWishlisted}
                  className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition-all hover:scale-105 ${
                    isWishlisted ? "text-red-500 bg-white" : "text-[#5A0E30]/60 hover:text-[#C21E63]"
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                  />
                </button>

                {/* Image */}
                <div className="relative h-full w-full">
                  <Image
                    src={mediaList[selectedImageIndex] || "/looway-funnel-demo.jpg"}
                    alt={product?.title || "Looway Pee Funnel"}
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
                      className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#C21E63] shadow-md hover:bg-[#FDEEF4] transition-all"
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
                      className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#C21E63] shadow-md hover:bg-[#FDEEF4] transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                    </button>
                  </>
                )}
              </div>

              {/* 4 Labeled Thumbnail Cards */}
              <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3">
                {mediaItems.map((item, idx) => {
                  const isActive = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`group relative flex flex-col items-center justify-between rounded-2xl p-2 sm:p-3 text-center transition-all cursor-pointer ${
                        isActive
                          ? "border-2 border-[#C21E63] bg-[#FDEEF4] shadow-xs"
                          : "border-2 border-dashed border-[#C21E63]/30 bg-[#FDEEF4]/30 hover:border-[#C21E63] hover:bg-white"
                      }`}
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/80">
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
                          isActive ? "text-[#C21E63]" : "text-[#5A0E30]/70"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: DETAILS & BUY BOX */}
            <div className="flex flex-col lg:col-span-6">
              {/* Brand Tag / Kicker */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#C21E63] px-4 py-1.5 text-[11px] font-extrabold tracking-widest text-white uppercase shadow-2xs">
                  LOOWAY · TRAVEL HYGIENE
                </span>
              </div>

              {/* Product Title */}
              <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-[#5A0E30] sm:text-4xl lg:text-[46px] leading-tight">
                Pee Funnel
              </h1>

              {/* Subtitle */}
              <p className="mt-1 font-sans text-base font-semibold text-[#5A0E30]/75 sm:text-lg">
                Reusable Stand-to-Pee Funnel for Women
              </p>

              {/* Under-title Chips Row 1 */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FDEEF4] px-3.5 py-1 text-xs font-bold text-[#C21E63]">
                  Soft silicone
                </span>
                <span className="rounded-full bg-[#F7E9C4] px-3.5 py-1 text-xs font-bold text-[#5E4100]">
                  Leak-free seal
                </span>
                <span className="rounded-full bg-[#E1EFF6] px-3.5 py-1 text-xs font-bold text-[#22617f]">
                  1 funnel + pouch
                </span>
              </div>

              {/* Rating Row (Clickable smooth-scroll to #reviews) */}
              <a
                href="#reviews"
                className="mt-3.5 flex items-center gap-2 text-xs font-semibold text-[#5A0E30]/80 group cursor-pointer w-fit"
              >
                <div className="flex items-center text-[#F4C430]">
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                  <Star className="h-4 w-4 fill-[#F4C430]" />
                </div>
                <span className="font-extrabold text-[#5A0E30] group-hover:text-[#C21E63]">
                  4.8 out of 5
                </span>
                <span className="text-[#5A0E30]/40">•</span>
                <span className="underline decoration-dotted underline-offset-4 group-hover:text-[#C21E63] font-bold">
                  121 verified reviews
                </span>
              </a>

              {/* Feature Chips Row 2 */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDEEF4]/80 border border-[#C21E63]/20 px-3 py-1 text-[11.5px] font-bold text-[#C21E63]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  Pee standing up
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDEEF4]/80 border border-[#C21E63]/20 px-3 py-1 text-[11.5px] font-bold text-[#C21E63]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  Leak-free seal
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDEEF4]/80 border border-[#C21E63]/20 px-3 py-1 text-[11.5px] font-bold text-[#C21E63]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  For women &amp; girls
                </span>
              </div>

              {/* Lede Paragraph */}
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#5A0E30]/75 font-normal max-w-xl">
                Stand up. Stay clean. Go anywhere. The Looway Pee Funnel lets you pee standing up — no squatting over a filthy public toilet, no undressing on a road trip, no skin ever touching a dirty seat. Soft silicone, an ergonomic leak-free seal, slips into its own cotton pouch. Your hygiene, your rules.
              </p>

              {/* Reassurance Banner Box */}
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#C21E63]/20 bg-[#FDEEF4]/60 p-3.5 text-xs text-[#5A0E30]">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C21E63] mt-0.5" />
                <span>
                  <strong>One size, shaped to fit most bodies.</strong> Nervous it&apos;s tricky? One practice run at home and almost every woman nails it — a little spill while practising is completely normal.
                </span>
              </div>

              {/* CHOOSE YOUR PACK SELECTOR */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold tracking-wider text-[#5A0E30] uppercase">
                    CHOOSE YOUR PACK
                  </span>
                  <span className="text-xs font-bold text-[#C21E63]">
                    Pack of 2 saves ₹99
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {Object.values(packs).map((pk: any) => {
                    const isSelected = selectedPackId === pk.id;
                    const perPrice = (pk.price / (pk.funnels || 1)).toFixed(0);
                    return (
                      <button
                        key={pk.id}
                        onClick={() => setSelectedPackId(pk.id)}
                        className={`relative flex flex-col justify-between rounded-2xl border-2 p-3.5 sm:p-4 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#C21E63] bg-[#FDEEF4] shadow-sm"
                            : "border-[#EAD6DC] bg-white hover:border-[#C21E63]"
                        }`}
                      >
                        {pk.flag && (
                          <span className="absolute -top-2.5 right-3 rounded-full bg-[#F4C430] px-2.5 py-0.5 text-[9.5px] font-extrabold text-[#5A0E30] uppercase shadow-2xs">
                            {pk.flag}
                          </span>
                        )}

                        <div>
                          <div className="font-serif text-base font-bold text-[#5A0E30]">
                            {pk.name}
                          </div>
                          <div className="mt-0.5 text-[11px] leading-tight text-[#5A0E30]/70">
                            {pk.sub}
                          </div>
                        </div>

                        <div className="mt-3 border-t border-[#EAD6DC]/60 pt-2 flex items-baseline justify-between">
                          <div className="font-serif text-lg font-extrabold text-[#C21E63]">
                            ₹{pk.price}
                          </div>
                          <div className="text-[10px] font-bold text-[#5A0E30]/50">
                            ₹{perPrice}/funnel
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quiz Banner Bar */}
              <a
                href="#guide"
                className="mt-4 flex items-center justify-between rounded-2xl border-2 border-dashed border-[#C21E63]/40 bg-white p-3 px-4 text-xs font-bold text-[#C21E63] hover:bg-[#FDEEF4]/50 transition-colors"
              >
                <span>❓ Not sure how many? Take the 30-second quiz</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              {/* MAIN BUY BOX */}
              <div className="mt-6 rounded-2xl border border-[#EAD6DC] bg-white p-5 shadow-md">
                {/* Price Header */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-extrabold text-[#5A0E30]">
                      ₹{totalPrice}
                    </span>
                    {totalMrp > totalPrice && (
                      <span className="text-sm font-normal text-[#5A0E30]/40 line-through">
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

                <div className="mt-1 text-xs text-[#5A0E30]/60">
                  ≈ ₹{(totalPrice / (selectedPack?.funnels * quantity || 1)).toFixed(0)} per funnel
                </div>

                {/* Quantity Stepper & Chips */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs font-bold text-[#5A0E30] uppercase">
                    HOW MANY?
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex gap-1">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          onClick={() => setQuantity(num)}
                          className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            quantity === num
                              ? "bg-[#C21E63] text-white"
                              : "border border-[#EAD6DC] bg-white text-[#5A0E30] hover:border-[#C21E63]"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center rounded-xl border border-[#EAD6DC] bg-[#fcf8f3] p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-[#C21E63] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      >
                        -
                      </button>
                      <span className="min-w-[32px] text-center text-sm font-extrabold text-[#5A0E30]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-[#C21E63] hover:bg-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3 Reassurance Row */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-[11.5px] font-bold text-[#5A0E30]/75">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C21E63]" /> Leak-free seal
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-[#C21E63]" /> Soft silicone
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#C21E63]" /> Reusable for years
                  </span>
                </div>

                {/* Delivery Expectation Line */}
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#5A0E30]/80">
                  <Truck className="h-4 w-4 text-[#C21E63] shrink-0" />
                  <span>
                    <strong>Ships in 24 hrs</strong> · get it by <strong>Mon, 12 Oct – Wed, 14 Oct</strong>
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleAddToCart(false)}
                    disabled={adding}
                    className="w-full flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C21E63] py-3.5 px-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[#a81a57] active:scale-[0.98] disabled:opacity-60"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{adding ? "Adding..." : `Add to Cart — ₹${totalPrice}`}</span>
                  </button>

                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={adding}
                    className="w-full flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#450A25] py-3.5 px-4 text-sm font-bold text-white transition-all hover:bg-[#32061A] active:scale-[0.98]"
                  >
                    <Truck className="h-4 w-4 text-[#F4C430]" />
                    <span>Buy now</span>
                  </button>

                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    aria-pressed={isWishlisted}
                    className={`w-full flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#EAD6DC] bg-white py-2.5 text-xs font-semibold transition-all hover:border-[#C21E63] ${
                      isWishlisted ? "text-red-500 border-red-300" : "text-[#5A0E30]"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#5A0E30]"}`}
                    />
                    <span>{isWishlisted ? "Saved to wishlist" : "Save to wishlist"}</span>
                  </button>
                </div>

                {/* Shipping Micro-copy */}
                <p className="mt-3 text-center text-[11px] leading-relaxed text-[#5A0E30]/60">
                  Free shipping over ₹599 · ships in 24 hrs · secure checkout. If it&apos;s not right, <strong>we&apos;ll make it right</strong>. Questions? Email <a href="mailto:care@potenhygiene.com" className="text-[#C21E63] underline">care@potenhygiene.com</a>
                  <span className="block mt-1 font-bold text-[#C21E63]">📈 Add ₹300 for free shipping</span>
                </p>

                {/* Potent Rewards Banner */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FDEEF4] p-3 text-xs text-[#5A0E30]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⭐</span>
                    <span>
                      In the <strong>Potent Rewards Club</strong>? Your credits apply at checkout. Not yet a member? <strong>Join free</strong> — earn across Ovy &amp; Looway.
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#C21E63]" />
                </div>

                {/* SHOP WITH CONFIDENCE */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="text-[11px] font-extrabold tracking-wider text-[#5A0E30] uppercase block mb-2.5">
                    SHOP WITH CONFIDENCE
                  </span>

                  <div className="space-y-1.5 text-xs font-semibold text-[#5A0E30]/80">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#C21E63]" /> Body-safe soft silicone
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#C21E63]" /> Woman-founded · Made for India
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C21E63]" /> Free shipping over ₹599
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-[#EAD6DC] bg-[#fcf8f3] p-3 space-y-1.5 text-[11.5px] text-[#5A0E30]/75">
                    <div className="flex items-center gap-2 font-bold text-[#5A0E30]">
                      <Truck className="h-4 w-4 text-[#C21E63]" /> Get it by Mon, 12 Oct – Wed, 14 Oct · ships in 24 hrs, tracked
                    </div>
                    <div className="flex items-start gap-2 text-[11px] leading-snug text-[#5A0E30]/65">
                      <Info className="h-3.5 w-3.5 shrink-0 text-[#C21E63] mt-0.5" />
                      For hygiene &amp; safety, this personal-care product can&apos;t be returned or exchanged once shipped - damaged or wrong items are replaced free
                    </div>
                  </div>
                </div>

                {/* PIN CODE CHECKER */}
                <div className="mt-5 rounded-xl border border-[#EAD6DC] bg-[#FDEEF4]/40 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A0E30] mb-2">
                    <MapPin className="h-4 w-4 text-[#C21E63]" />
                    <span>Check delivery time</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 rounded-lg border border-[#EAD6DC] bg-white px-3 py-2 text-xs outline-none focus:border-[#C21E63]"
                    />
                    <button
                      type="button"
                      onClick={handlePincodeCheck}
                      className="rounded-lg bg-[#C21E63] px-4 py-2 text-xs font-bold text-white hover:bg-[#a81a57] transition-all cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeResult && (
                    <p
                      className={`mt-2 text-[11px] font-semibold ${
                        pincodeResult.err ? "text-red-600" : "text-emerald-700"
                      }`}
                    >
                      {pincodeResult.msg}
                    </p>
                  )}
                </div>

                {/* SECURE CHECKOUT FOOTER */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-[11px] text-[#5A0E30]/60">
                  <span className="flex items-center gap-1 font-semibold text-[#5A0E30]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure checkout
                  </span>
                  <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5">UPI</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5">Razorpay</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5">Visa</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5">Mastercard</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5">RuPay</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5">Net banking</span>
                  </div>
                </div>
              </div>

              {/* WHAT'S IN THE BOX SECTION */}
              <div id="specs" className="mt-6 rounded-2xl border border-[#EAD6DC] bg-white p-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                  <span className="text-xs font-extrabold tracking-wider text-[#5A0E30] uppercase">
                    WHAT&apos;S IN THE BOX
                  </span>
                  <span className="text-xs text-[#5A0E30]/60 font-medium">
                    1 funnel + cotton pouch
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="font-bold text-[#5A0E30]">1 Pee Funnel</span>
                  <span className="font-semibold text-[#C21E63]">silicone</span>
                  <span className="text-[#5A0E30]/70">Soft, flexible silicone</span>
                </div>
              </div>

              {/* QUICK SPECS GRID */}
              <div className="mt-4 rounded-2xl border border-[#EAD6DC] bg-white p-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                  <span className="text-xs font-extrabold tracking-wider text-[#5A0E30] uppercase">
                    QUICK SPECS
                  </span>
                  <a href="#specs" className="text-xs font-bold text-[#C21E63] underline">
                    Show all
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10.5px] text-[#5A0E30]/60 block">Material</span>
                    <span className="font-bold text-[#5A0E30]">Soft silicone</span>
                  </div>
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10.5px] text-[#5A0E30]/60 block">Reusable</span>
                    <span className="font-bold text-[#5A0E30]">Yes — lasts years</span>
                  </div>
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10.5px] text-[#5A0E30]/60 block">Seal</span>
                    <span className="font-bold text-[#5A0E30]">Ergonomic, leak-free</span>
                  </div>
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10.5px] text-[#5A0E30]/60 block">Pouch</span>
                    <span className="font-bold text-[#5A0E30]">Cotton (included)</span>
                  </div>
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10.5px] text-[#5A0E30]/60 block">Size</span>
                    <span className="font-bold text-[#5A0E30]">Compact — pocket-size</span>
                  </div>
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10.5px] text-[#5A0E30]/60 block">Use type</span>
                    <span className="font-bold text-[#5A0E30]">External only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH SPEC STRIP */}
      <section className="w-full bg-[#C21E63] text-white py-6 my-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6 items-center">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Droplets className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0" />
              <div>
                <div className="font-serif font-bold text-sm sm:text-lg text-white leading-tight">Silicone</div>
                <div className="text-[11px] sm:text-xs text-white/85">Soft &amp; body-safe</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0" />
              <div>
                <div className="font-serif font-bold text-sm sm:text-lg text-white leading-tight">Leak-free</div>
                <div className="text-[11px] sm:text-xs text-white/85">Ergonomic seal</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0" />
              <div>
                <div className="font-serif font-bold text-sm sm:text-lg text-white leading-tight">Reusable</div>
                <div className="text-[11px] sm:text-xs text-white/85">Lasts for years</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Package className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0" />
              <div>
                <div className="font-serif font-bold text-sm sm:text-lg text-white leading-tight">Compact</div>
                <div className="text-[11px] sm:text-xs text-white/85">Slips into any bag</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 col-span-2 sm:col-span-1">
              <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-[#F4C430] shrink-0" />
              <div>
                <div className="font-serif font-bold text-sm sm:text-lg text-white leading-tight">1 funnel</div>
                <div className="text-[11px] sm:text-xs text-white/85">Per pack + pouch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY STICKY NAV STRAP (Sticky underneath website header) */}
      <nav
        style={{ top: `${headerHeight}px` }}
        className="sticky z-40 w-full border-y border-[#EAD6DC] bg-[#fcf8f3]/95 backdrop-blur-md shadow-2xs transition-[top] duration-150 py-2.5"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-start sm:justify-center gap-2 sm:gap-3 px-4 overflow-x-auto no-scrollbar [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { id: "guide", label: "Guide" },
            { id: "where-to-use", label: "Where to use" },
            { id: "who-its-for", label: "Find your fit" },
            { id: "specs", label: "Specs" },
            { id: "safety", label: "Safety" },
            { id: "no-toilet", label: "Why Looway" },
          ].map((nav) => (
            <a
              key={nav.id}
              href={`#${nav.id}`}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeNavId === nav.id
                  ? "bg-[#C21E63] text-white shadow-2xs"
                  : "bg-white text-[#5A0E30]/80 border border-[#EAD6DC] hover:border-[#C21E63]"
              }`}
            >
              {nav.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 10 Section Components in sequence */}
      <FunnelNoToiletSection />
      <FunnelHowItWorksSection />
      <FunnelGuideSection />
      <FunnelWhereToUseSection />
      <FunnelWhoItsForSection />
      <FunnelPackAndSpecsSection />
      <FunnelUseItSafelySection />
      <FunnelMarketComparisonSection />
      <FunnelReviewsSection />
      <FunnelFaqSection />
      <WhileYoureHereSection brandTheme="looway" />
    </div>
  );
}
