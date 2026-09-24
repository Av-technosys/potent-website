/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  ChevronDown,
  Clock,
  Truck,
  Heart,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  MapPin,
  X,
  Info,
  BookOpen,
  Leaf,
  Droplets,
  Zap,
  Shield,
  CreditCard,
  Lock,
  Cloud,
  Home,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart as addToCartAction } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import ProductReviews from "./productreview";
import { ovyProductDetailsPage } from "@/const/globalconst";

type Props = {
  product: any;
  reviewWithMedia?: any;
  content?: any;
};

// Size Quiz Static Reference
const QUIZ_SIZES = [
  { id: "xs", name: "Teen (XS)", cap: "16 ml", forWho: "Teens & first-timers under 18" },
  { id: "m", name: "Medium", cap: "25 ml", forWho: "No vaginal birth yet (any age / C-section)" },
  { id: "l", name: "Large", cap: "35 ml", forWho: "After vaginal birth or very heavy flow" },
];

export default function MenstrualCupPageClient({ product, reviewWithMedia }: Props) {
  const router = useRouter();
  const productInfo = product;
  const themeColor = product?.brand === "loway" ? { darkColor: "#168BA0", lightColor: "#E8F7FA", textColor: "#168BA0" } : ovyProductDetailsPage;

  // Extract Live DB Variants or fallback to 4 Cup Variants
  const variantsList = useMemo(() => {
    let dbVariants: any[] = [];
    if (Array.isArray(productInfo?.productVariants) && productInfo.productVariants.length > 0) {
      dbVariants = productInfo.productVariants;
    } else if (Array.isArray(productInfo?.prodcutVarientBoxRes) && productInfo.prodcutVarientBoxRes.length > 0) {
      dbVariants = productInfo.prodcutVarientBoxRes;
    }

    if (dbVariants.length > 0) {
      return dbVariants;
    }

    return [
      {
        id: "variant-xs-pink",
        _id: "variant-xs-pink",
        sku: "OVY-CUP-XS-PNK",
        name: "Teen (XS) · Pink",
        size: "Teen (XS)",
        color: "Pink",
        price: Number(productInfo?.price || 459),
        strikethroughPrice: Number(productInfo?.strikethroughPrice || productInfo?.mrp || 599),
      },
      {
        id: "variant-m-purple",
        _id: "variant-m-purple",
        sku: "OVY-CUP-M-PUR",
        name: "Medium · Purple",
        size: "Medium",
        color: "Purple",
        price: Number(productInfo?.price || 459),
        strikethroughPrice: Number(productInfo?.strikethroughPrice || productInfo?.mrp || 599),
      },
      {
        id: "variant-m-rainbow",
        _id: "variant-m-rainbow",
        sku: "OVY-CUP-M-RNB",
        name: "Medium · Rainbow",
        size: "Medium",
        color: "Rainbow",
        price: Number(productInfo?.price || 459),
        strikethroughPrice: Number(productInfo?.strikethroughPrice || productInfo?.mrp || 599),
      },
      {
        id: "variant-l-white",
        _id: "variant-l-white",
        sku: "OVY-CUP-L-WHT",
        name: "Large · White",
        size: "Large",
        color: "White",
        price: Number(productInfo?.price || 459),
        strikethroughPrice: Number(productInfo?.strikethroughPrice || productInfo?.mrp || 599),
      },
    ];
  }, [productInfo]);

  // Selected Variant Index state (Default to 1st variant)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const activeVariant = variantsList[selectedVariantIndex] || variantsList[0];

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Extract Real Database Product Images
  const productImages = useMemo(() => {
    const list: string[] = [];
    if (activeVariant?.bannerImage) list.push(getImageUrl(activeVariant.bannerImage));
    if (activeVariant?.image) list.push(getImageUrl(activeVariant.image));
    if (productInfo?.bannerImage) list.push(getImageUrl(productInfo.bannerImage));
    if (Array.isArray(productInfo?.productMediaRes)) {
      productInfo.productMediaRes.forEach((item: any) => {
        if (item?.mediaURL) list.push(getImageUrl(item.mediaURL));
      });
    }
    const unique = Array.from(new Set(list.filter(Boolean)));
    return unique.length > 0 ? unique : ["/placeholder.jpg"];
  }, [productInfo, activeVariant]);

  const [activeImage, setActiveImage] = useState<string>("");
  const currentDisplayImage = activeImage || productImages[0] || "/placeholder.jpg";

  // Real Database Pricing & Rates
  const price = Number(activeVariant?.price ?? productInfo?.price ?? 459);
  const strikethroughPrice = Number(
    activeVariant?.strikethroughPrice ?? activeVariant?.mrp ?? productInfo?.strikethroughPrice ?? productInfo?.mrp ?? 599
  );
  const discountPercent =
    strikethroughPrice > price ? Math.round(((strikethroughPrice - price) / strikethroughPrice) * 100) : 0;

  // Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ age: "", birth: "", flow: "", cervix: "" });
  const [quizResult, setQuizResult] = useState<"xs" | "m" | "l" | null>(null);

  // Savings Calculator State (Screenshot 2)
  const [monthlySpend, setMonthlySpend] = useState(250);
  const [timeframeYears, setTimeframeYears] = useState<5 | 10>(5);

  // Savings Calculator Formula
  const calculatedSavings = useMemo(() => {
    const totalDisposables = monthlySpend * 12 * timeframeYears;
    const cupCost = 599;
    const savings = Math.max(0, totalDisposables - cupCost);
    const padsSaved = timeframeYears === 5 ? 1200 : 2400;
    return { savings, padsSaved };
  }, [monthlySpend, timeframeYears]);

  // Pincode State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; message: string }>({
    checked: false,
    valid: false,
    message: "",
  });

  // Section Refs for smooth scrolling
  const topSectionRef = useRef<HTMLDivElement>(null);
  const periodSchoolRef = useRef<HTMLDivElement>(null);
  const sizeSectionRef = useRef<HTMLDivElement>(null);
  const virginitySectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to Size Finder section if URL has #size-finder or ?scroll=size-finder
  useEffect(() => {
    const checkAndScroll = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash;
        const search = window.location.search;
        if (
          hash === "#size-finder" ||
          hash === "#sizes" ||
          hash.includes("size") ||
          search.includes("size-finder") ||
          search.includes("size")
        ) {
          setTimeout(() => {
            sizeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 350);
        }
      }
    };

    checkAndScroll();
    window.addEventListener("hashchange", checkAndScroll);
    return () => window.removeEventListener("hashchange", checkAndScroll);
  }, []);

  // Handle Add to Cart & Buy Now
  const handleAddToCart = async (isBuyNow = false) => {
    setIsAdding(true);
    try {
      const pId = productInfo?._id || productInfo?.id || "ovy-cup";
      const vId = activeVariant?._id || activeVariant?.id;
      const variantLabel = activeVariant?.name || activeVariant?.size || "";
      const itemTitle = productInfo?.name
        ? (variantLabel ? `${productInfo.name} (${variantLabel})` : productInfo.name)
        : (variantLabel || "Ovy Reusable Menstrual Cup");

      const success = await addToCartAction({
        productId: pId,
        productVariantId: vId,
        sku: activeVariant?.sku || `OVY-CUP-${activeVariant?.size || 'STD'}`,
        slug: productInfo?.slug || "menstrual-cup",
        title: itemTitle,
        price: price,
        originalPrice: strikethroughPrice,
        image: currentDisplayImage,
        isQuantityChangable: true,
        quantity: quantity,
      });

      if (success !== false) {
        if (isBuyNow) {
          router.push("/cart");
        }
      }
    } catch (err) {
      console.error("Cart Add Error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  // Pincode Check
  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        checked: true,
        valid: true,
        message: "Delivery available! Usually delivered in 2–4 business days with discreet packaging.",
      });
    } else {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: "Please enter a valid 6-digit Indian pincode.",
      });
    }
  };

  // Size Quiz Logic
  const handleQuizAnswer = (key: string, val: string) => {
    const nextAnswers = { ...quizAnswers, [key]: val };
    setQuizAnswers(nextAnswers);

    if (quizStep < 3) {
      setQuizStep(quizStep + 1);
    } else {
      let rec: "xs" | "m" | "l" = "m";
      if (nextAnswers.age === "under18" || nextAnswers.flow === "light") {
        rec = "xs";
      } else if (nextAnswers.birth === "vaginal" || nextAnswers.flow === "heavy") {
        rec = "l";
      } else {
        rec = "m";
      }
      setQuizResult(rec);
      setQuizStep(4);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({ age: "", birth: "", flow: "", cervix: "" });
    setQuizResult(null);
  };

  const applyQuizResult = () => {
    if (quizResult) {
      const matchIdx = variantsList.findIndex((v: any) =>
        (v?.size || v?.name || "").toLowerCase().includes(quizResult.toLowerCase())
      );
      if (matchIdx !== -1) {
        setSelectedVariantIndex(matchIdx);
      }
      setIsQuizOpen(false);
      toast.success(`Selected size: ${QUIZ_SIZES.find((s) => s.id === quizResult)?.name}`);
    }
  };

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#1A150F] font-sans antialiased pb-20">
      
      {/* SECTION 1: HERO BUY SECTION WITH SINGLE-SELECT VARIANT CARDS */}
      <div ref={topSectionRef} className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Top Breadcrumb */}
        <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#7E4D77]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#7E4D77]">Shop</Link>
          <span>/</span>
          <span className="text-[#1A150F] font-semibold">{productInfo?.name || "Ovy Reusable Menstrual Cup"}</span>
        </nav>

        {/* HERO PDP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Gallery Column */}
          <div className="lg:col-span-6 static lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-gray-200/80 shadow-xs flex items-center justify-center p-4">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#7E4D77] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#7E4D77]" />
                100% Medical-Grade Silicone
              </div>

              {/* Main Product Image */}
              <div className="relative w-full h-full">
                <Image
                  src={currentDisplayImage}
                  alt={productInfo?.name || "Ovy Menstrual Cup"}
                  fill
                  className="object-contain p-4 transition-all duration-300"
                  priority
                />
              </div>
            </div>

            {/* Thumbnail Row */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-16 h-16 rounded-2xl border-2 overflow-hidden bg-white shrink-0 transition-all ${
                      currentDisplayImage === imgUrl ? "border-[#7E4D77] scale-105 shadow-2xs" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-2xs">
                <Clock className="w-5 h-5 text-[#7E4D77] mx-auto mb-1" />
                <p className="text-xs font-bold text-gray-900">Up to 12 Hrs</p>
                <p className="text-[10px] text-gray-500">Leak-free wear</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-2xs">
                <Leaf className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-gray-900">Reusable 10 Yrs</p>
                <p className="text-[10px] text-gray-500">Zero pad waste</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-gray-900">100% Medical</p>
                <p className="text-[10px] text-gray-500">BPA & latex free</p>
              </div>
            </div>
          </div>

          {/* Right Product Purchase Column */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Kicker */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
                {productInfo?.brand?.toUpperCase() || "OVY BY POTENT HYGIENE"}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="font-serif italic text-[#1A8D91] text-sm">Made for real life in India</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A150F] leading-tight mb-2">
              {productInfo?.name || "Reusable Menstrual Cup"}
            </h1>

            {/* RATING STRIP & PILL BADGES */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                <div className="flex text-purple-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B076A8] stroke-[#B076A8]" />
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.8</span>
                <span className="text-gray-500">out of 5 · 183 verified reviews</span>
              </div>

              {/* Pill Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#7E4D77] bg-[#F3E6F0]/80">
                  <Shield className="w-3.5 h-3.5" />
                  Medical-grade silicone
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#7E4D77] bg-[#F3E6F0]/80">
                  <Leaf className="w-3.5 h-3.5" />
                  BPA & latex-free
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#7E4D77] bg-[#F3E6F0]/80">
                  <Heart className="w-3.5 h-3.5" />
                  Cruelty-free & vegan
                </span>
              </div>
            </div>

            {/* DESCRIPTION KEY POINTS */}
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
              The softest cup you'll ever use — and a <b>kinder swap for your body and the planet</b>. 100% medical-grade silicone gives you up to 12 hours of leak-proof protection that works <i>with</i> your body. No toxins, no waste — just freedom.
            </p>

            {/* INTERACTIVE VARIANT SELECTOR CARDS */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Select Size & Color Option
                </span>
                <button
                  onClick={() => {
                    resetQuiz();
                    setIsQuizOpen(true);
                  }}
                  className="text-xs font-semibold text-[#7E4D77] hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  30-Sec Size Quiz
                </button>
              </div>

              {/* Grid of Variant Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {variantsList.map((v: any, idx: number) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={v._id || v.id || idx}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        if (v?.bannerImage || v?.image) {
                          setActiveImage(getImageUrl(v.bannerImage || v.image));
                        }
                      }}
                      className={`relative text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#7E4D77] bg-[#F3E6F0]/50 shadow-xs"
                          : "border-gray-200/90 bg-white hover:border-pink-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-serif font-bold text-sm text-gray-900">
                          {v?.name || v?.size || `Option ${idx + 1}`}
                        </span>
                        
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#7E4D77] text-white flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[#7E4D77] mt-1.5">₹{v?.price || price}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICING & RATES */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-3xl font-bold text-gray-900">₹{price}</span>
                {strikethroughPrice > price && (
                  <span className="text-base text-gray-400 line-through">₹{strikethroughPrice}</span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-4">Includes breathable organic cotton storage pouch & size guide.</p>

              {/* Quantity + Buttons */}
              <div className="grid grid-cols-12 gap-3 mb-6">
                {/* Quantity Stepper */}
                <div className="col-span-4 sm:col-span-3 flex items-center justify-between border border-gray-300 rounded-xl px-3 py-2 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-lg font-bold text-gray-600 hover:text-black px-1"
                  >
                    -
                  </button>
                  <span className="font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-lg font-bold text-gray-600 hover:text-black px-1"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isAdding}
                  className="col-span-8 sm:col-span-5 bg-[#7E4D77] hover:bg-[#683c62] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                {/* Buy Now */}
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={isAdding}
                  className="col-span-12 sm:col-span-4 bg-[#141413] hover:bg-black text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  Buy Now
                </button>
              </div>

              {/* WHAT'S IN THE BOX BOX */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-2xs">
                <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>WHAT'S IN THE BOX</span>
                  <span className="text-gray-400">3 ITEMS · READY TO START</span>
                </div>
                <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-bold text-gray-900">1 Ovy menstrual cup</span>
                    <span className="font-semibold text-[#7E4D77]">{activeVariant?.size || activeVariant?.name || "Medium"}</span>
                    <span className="text-gray-500 text-xs">Collects your flow, leak-free up to 12 hrs</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Breathable cotton pouch</span>
                    <span className="font-semibold text-[#7E4D77]">included</span>
                    <span className="text-gray-500 text-xs">Store it dry and fresh between cycles</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Illustrated how-to guide</span>
                    <span className="font-semibold text-[#7E4D77]">first use</span>
                    <span className="text-gray-500 text-xs">Fold, insert, seal and remove with ease</span>
                  </div>
                </div>
                <div className="p-3 bg-[#FAF7F2] border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>TOTAL</span>
                  <span className="text-gray-500 font-normal">Everything to start — one cup, reusable for years</span>
                </div>
                <div className="h-1.5 w-full bg-gradient-to-r from-[#8E5FA8] via-[#5FBF7E] to-[#FAF7F2]" />
              </div>

              {/* REPLACEMENT GUARANTEE & SHOP WITH CONFIDENCE */}
              <div className="space-y-4 mb-6">
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-500">Ships in 24 hrs · secure checkout</p>
                  <p>
                    Arrives damaged or the wrong size? <b>We'll replace it</b> — just email a photo within 12 hrs. Questions?{" "}
                    <a href="mailto:care@potenthygiene.com" className="text-[#7E4D77] font-semibold underline">
                      care@potenthygiene.com
                    </a>
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-teal-700 pt-1">
                    <Truck className="w-4 h-4" /> Ships in 24 hrs, tracked
                  </p>
                </div>

                {/* SHOP WITH CONFIDENCE CARD */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    SHOP WITH CONFIDENCE
                  </span>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-[#7E4D77]" /> Medical-grade silicone
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Soft & body-safe
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-purple-600" /> Easy returns on damage
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1.5">
                    <p className="flex items-center gap-1.5 font-bold text-gray-800">
                      <Truck className="w-4 h-4 text-teal-600" /> Usually delivered in 2–6 days · ships in 24 hrs, tracked
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      ✓ A cup is a hygiene product, so it can't be returned — but if it arrives <b>damaged or the wrong size</b>, send us a photo within <b>12 hours</b> of delivery and we'll replace it.
                    </p>
                  </div>
                </div>

                {/* SECURE CHECKOUT PAYMENTS */}
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-2">
                    <Lock className="w-3.5 h-3.5" /> Secure checkout
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
                    {["UPI", "Razorpay", "Visa", "Mastercard", "RuPay", "Net banking"].map((p) => (
                      <span key={p} className="px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-2xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200">
                <form onSubmit={checkPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#7E4D77]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white font-semibold text-xs rounded-xl hover:bg-black transition-all"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus.checked && (
                  <p
                    className={`text-xs mt-2 font-medium ${
                      pincodeStatus.valid ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {pincodeStatus.message}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5 EXISTING ATTACHED HTML SECTIONS */}
      {/* ============================================================ */}

      {/* SECTION 1: OVY PERIOD SCHOOL HUB BANNER */}
      <div ref={periodSchoolRef} className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-16">
        <div className="relative rounded-3xl p-8 sm:p-14 text-center border border-[#7E4D77]/15 shadow-sm overflow-hidden bg-gradient-to-br from-[#FBF1FB] via-[#F4F1E8]/50 to-[#E4F1F1]/40">
          <div className="inline-flex items-center gap-1.5 bg-[#B076A8] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xs mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            OVY PERIOD SCHOOL
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1A150F] max-w-2xl mx-auto leading-tight mb-4">
            You've seen the cup. Now get to know your body.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed mb-8">
            A cup comes with a lot of questions — and not nearly enough straight answers. This is where we change that: no jargon, no shame, just what's really going on and what actually helps.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto mb-10">
            {[
              "Will it hurt?",
              "Does it affect virginity?",
              "Which size am I?",
              "How do I clean it in a hostel?",
              "Is it safe for teens?",
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (q.includes("virginity")) scrollToRef(virginitySectionRef);
                  else if (q.includes("size")) scrollToRef(sizeSectionRef);
                  else scrollToRef(virginitySectionRef);
                }}
                className="bg-white/80 backdrop-blur-xs border border-pink-200/80 text-[#7E4D77] hover:bg-[#7E4D77] hover:text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <button
              onClick={() => scrollToRef(topSectionRef)}
              className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#7E4D77] text-left flex items-center gap-3 transition-all shadow-2xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-[#F3E6F0] group-hover:text-[#7E4D77] flex items-center justify-center shrink-0 transition-colors">
                <ArrowUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">I'm all set — shop my cup</p>
                <p className="text-xs text-gray-500">Back to sizes, colours & checkout</p>
              </div>
            </button>

            <button
              onClick={() => scrollToRef(virginitySectionRef)}
              className="bg-white p-4 rounded-2xl border-2 border-[#7E4D77] text-left flex items-center gap-3 transition-all shadow-2xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F3E6F0] text-[#7E4D77] flex items-center justify-center shrink-0">
                <ArrowDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Take me into the Period School</p>
                <p className="text-xs text-gray-500">15 quick topics — sizing, care, safety, savings & more</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: VIRGINITY & HYMEN MYTH BUSTING */}
      <div ref={virginitySectionRef} className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-20">
        <div className="mb-8">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            LET'S TALK ABOUT IT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight">
            Will a cup affect your virginity? <span className="italic font-serif font-normal text-[#7E4D77]">No — and here's why.</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
            It's the question we hear most, especially from teens and first-timers. So here's the honest, gynaecologist-checked truth — gently, and without the myths.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-6">
          <div className="md:col-span-7">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-3 leading-snug">
              A cup can't “take” your virginity. There's no wall down there waiting to break.
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Virginity is a personal idea — not a medical state an object can change. What's actually near the opening is a soft, stretchy ring of tissue called the <b>hymen</b>, with a natural gap your period already flows through. So let's bust the myths, one by one.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#FAF9F5] rounded-2xl border border-gray-100 text-center">
            <div className="relative w-40 h-40 flex items-center justify-center my-2">
              <div className="w-32 h-32 rounded-full border-8 border-[#7E4D77]/30 bg-[#F3E6F0] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-[#7E4D77] flex items-center justify-center text-[10px] text-gray-500 font-bold">
                  natural<br/>opening
                </div>
              </div>
            </div>
            <p className="text-xs font-bold text-[#7E4D77] mt-1">The hymen</p>
            <p className="text-[11px] text-gray-500">a soft, elastic ring of tissue</p>
            <p className="text-[10px] text-gray-400 mt-2 italic">It stretches to let things through — it doesn't "break".</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs">
            <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">MYTH</span>
              <span className="text-xs text-gray-400 italic font-serif">“A cup will tear or break my hymen.”</span>
            </div>
            <div className="p-4 flex items-start gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md shrink-0 mt-0.5">TRUTH</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">It's soft, elastic tissue with a <b>natural opening</b>. It stretches to let things past — it doesn't snap.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs">
            <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">MYTH</span>
              <span className="text-xs text-gray-400 italic font-serif">“People can tell if you've used one.”</span>
            </div>
            <div className="p-4 flex items-start gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md shrink-0 mt-0.5">TRUTH</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">The hymen can't show whether someone's had sex. It comes in <b>every shape</b> — some are born with barely any.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs">
            <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">MYTH</span>
              <span className="text-xs text-gray-400 italic font-serif">“Only a cup stretches it.”</span>
            </div>
            <div className="p-4 flex items-start gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md shrink-0 mt-0.5">TRUTH</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">Cycling, sport, dance and tampons stretch it over the years too. <b>Stretching isn't tearing.</b></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs">
            <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">MYTH</span>
              <span className="text-xs text-gray-400 italic font-serif">“Unmarried girls and teens shouldn't.”</span>
            </div>
            <div className="p-4 flex items-start gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md shrink-0 mt-0.5">TRUTH</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">Anyone who menstruates can. Start with our softest <b>Teen</b> size, breathe out, wet the rim — no rush.</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F3E6F0]/60 border border-[#7E4D77]/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#7E4D77] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <b>A gentle note:</b> if insertion ever feels truly impossible or sharply painful even when you're relaxed, it's worth a quick chat with a doctor — very rarely a hymen has an unusually small opening, which is simple to check and has nothing to do with the cup.
          </p>
        </div>
      </div>

      {/* SECTION 3: THREE SIZES & CERVIX CHECK */}
      <div ref={sizeSectionRef} id="size-finder" className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-20">
        <div className="mb-6">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            FIND YOUR SIZE
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Three sizes, four colours
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
            One cup, sized to you. What matters most is <b>how high your cervix sits</b> — along with your flow and whether you've had a <b>vaginal</b> birth. It's not about your body shape, your weight or even your age (plenty of people over 30 sit happily on Medium), and a <b>C-section doesn't change your size:</b> your birth canal isn't stretched, so most C-section mums stay with Medium. Read the table, do the 20-second cervix check below, or let the <u>30-second quiz</u> choose for you.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => {
              resetQuiz();
              setIsQuizOpen(true);
            }}
            className="bg-[#7E4D77] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#683c62] transition-all shadow-2xs"
          >
            Take the 30-second quiz →
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("cervix-check-box");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full text-xs font-bold hover:border-[#7E4D77] hover:text-[#7E4D77] transition-all"
          >
            Do the cervix check →
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-2xs mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#B076A8] text-white uppercase text-[11px] tracking-wider">
                  <th className="p-4 font-bold">SIZE</th>
                  <th className="p-4 font-bold">CAPACITY</th>
                  <th className="p-4 font-bold">COLOURS</th>
                  <th className="p-4 font-bold">BEST FOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-pink-50/20">
                  <td className="p-4 font-serif font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-pink-300 inline-block shrink-0 shadow-2xs" />
                    Teen (XS)
                  </td>
                  <td className="p-4 font-serif font-bold text-[#7E4D77] text-base">16 ml</td>
                  <td className="p-4 text-gray-600">Pink</td>
                  <td className="p-4 text-gray-600 leading-relaxed">First periods & first-timers • light to average flow • before any birth • a low-to-average cervix or tighter muscles</td>
                </tr>

                <tr className="hover:bg-purple-50/20">
                  <td className="p-4 font-serif font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-400 inline-block shrink-0 shadow-2xs" />
                    Medium (M)
                  </td>
                  <td className="p-4 font-serif font-bold text-[#7E4D77] text-base">25 ml</td>
                  <td className="p-4 text-gray-600">Purple • Rainbow</td>
                  <td className="p-4 text-gray-600 leading-relaxed">The everyday all-rounder • average flow & cervix • no <b>vaginal</b> birth yet — C-section mums and many over-30s included</td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-serif font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 border border-gray-300 inline-block shrink-0 shadow-2xs" />
                    Large (L)
                  </td>
                  <td className="p-4 font-serif font-bold text-[#7E4D77] text-base">35 ml</td>
                  <td className="p-4 text-gray-600">White</td>
                  <td className="p-4 text-gray-600 leading-relaxed">After a <b>vaginal</b> birth • heavier or longer days • a higher cervix or a more relaxed pelvic floor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="cervix-check-box" className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs">
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">The 20-second cervix check</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
            Cervix height decides how a cup sits more than anything else — and it's easy to find. <b>During your period,</b> wash your hands and slide one finger into your vagina until you feel your cervix (it's firm and rounded, a bit like the tip of your nose). Note how far your finger went:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-gray-200/60">
              <span className="text-xs font-serif font-bold text-[#7E4D77]">1st knuckle</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mt-1 mb-2">LOW CERVIX</h4>
              <p className="text-xs text-gray-600 leading-relaxed">A shorter cup sits more comfortably. You may want to trim or remove the stem. Teen (XS) or Medium suit most.</p>
            </div>

            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-gray-200/60">
              <span className="text-xs font-serif font-bold text-[#7E4D77]">2nd knuckle</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mt-1 mb-2">AVERAGE CERVIX</h4>
              <p className="text-xs text-gray-600 leading-relaxed">The most common — almost any size works. Pick by age, flow and birth history using the table above.</p>
            </div>

            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-gray-200/60">
              <span className="text-xs font-serif font-bold text-[#7E4D77]">3rd knuckle / can't reach</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mt-1 mb-2">HIGH CERVIX</h4>
              <p className="text-xs text-gray-600 leading-relaxed">You have plenty of room — keep the full stem to help you reach the base. Medium or Large work well.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F3E6F0]/50 border border-[#7E4D77]/20 text-xs text-gray-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#7E4D77] shrink-0" />
            <span>Cervix height can shift a little across your cycle, so check on a period day. Still unsure? Our <u>30-second quiz</u> factors all of this in for you.</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: TEEN DO'S & DON'TS, COMPARISON TABLE & BENEFIT CARDS */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-20">
        
        {/* SUB-SECTION A: TEEN DO'S & DON'TS */}
        <div className="mb-16">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            FOR TEENS & FIRST-TIMERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            A cup, the teen way — do's & don'ts
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-2xl">
            Trying a cup as a teen is completely safe and normal. Keep these simple do's and don'ts in mind and you'll be a pro within a couple of cycles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs">
              <h3 className="text-base font-bold text-emerald-700 flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-emerald-600" /> Do
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">✓</span><span>Start at home on a lighter day, with plenty of time and zero pressure.</span></li>
                <li className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">✓</span><span>Wash your hands, then wet the rim with clean water so it slides in easily.</span></li>
                <li className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">✓</span><span>Use the <b>Teen (XS)</b> size and the <b>punch-down fold</b> — the easiest combo for beginners.</span></li>
                <li className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">✓</span><span>Empty it at least every 12 hours, and sterilise by boiling before the first use and between periods.</span></li>
                <li className="flex items-start gap-3"><span className="text-emerald-600 font-bold shrink-0">✓</span><span>Ask a parent, older sister or the school nurse if you're unsure — it's completely normal to.</span></li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs">
              <h3 className="text-base font-bold text-rose-700 flex items-center gap-2 mb-4">
                <X className="w-5 h-5 text-rose-600" /> Don't
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-3"><span className="text-rose-600 font-bold shrink-0">✕</span><span>Don't panic if it takes two or three tries — that's normal, not failure. Relax and breathe out.</span></li>
                <li className="flex items-start gap-3"><span className="text-rose-600 font-bold shrink-0">✕</span><span>Don't pull it out by the stem alone — pinch the base first to release the seal.</span></li>
                <li className="flex items-start gap-3"><span className="text-rose-600 font-bold shrink-0">✕</span><span>Don't share your cup with anyone, and don't leave it in longer than 12 hours.</span></li>
                <li className="flex items-start gap-3"><span className="text-rose-600 font-bold shrink-0">✕</span><span>Don't worry about virginity — a cup has nothing to do with it.</span></li>
                <li className="flex items-start gap-3"><span className="text-rose-600 font-bold shrink-0">✕</span><span>Don't use a cup if you have a vaginal infection — check with a doctor first.</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* SUB-SECTION B: AN HONEST COMPARISON */}
        <div className="mb-16">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            AN HONEST COMPARISON
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            Cup vs pads vs tampons
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-2xl">
            Same job, three very different experiences. Here's how a cup actually stacks up — no exaggeration.
          </p>

          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-400 w-1/4"></th>
                    <th className="p-4 font-bold bg-[#B076A8] text-white uppercase text-xs tracking-wider w-1/4">OVY CUP</th>
                    <th className="p-4 font-semibold text-gray-500 uppercase text-xs tracking-wider w-1/4">PADS</th>
                    <th className="p-4 font-semibold text-gray-500 uppercase text-xs tracking-wider w-1/4">TAMPONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-4 font-bold text-gray-900">Wear time</td><td className="p-4 font-bold text-[#7E4D77] bg-pink-50/30">Up to 12 hours</td><td className="p-4 text-gray-600">4–6 hours</td><td className="p-4 text-gray-600">4–8 hours</td></tr>
                  <tr><td className="p-4 font-bold text-gray-900">Capacity</td><td className="p-4 font-bold text-[#7E4D77] bg-pink-50/30">Up to 3x a tampon</td><td className="p-4 text-gray-600">Surface only</td><td className="p-4 text-gray-600">~10 ml</td></tr>
                  <tr><td className="p-4 font-bold text-gray-900">Reusable</td><td className="p-4 font-bold text-emerald-700 bg-pink-50/30">Yes — years</td><td className="p-4 text-gray-600">No</td><td className="p-4 text-gray-600">No</td></tr>
                  <tr><td className="p-4 font-bold text-gray-900">Cost per year</td><td className="p-4 font-bold text-[#7E4D77] bg-pink-50/30">~₹50–60*</td><td className="p-4 text-gray-600">₹2,000–3,000</td><td className="p-4 text-gray-600">₹2,500–3,500</td></tr>
                  <tr><td className="p-4 font-bold text-gray-900">Waste per year</td><td className="p-4 font-bold text-[#7E4D77] bg-pink-50/30">Almost none</td><td className="p-4 text-gray-600">~120 pads</td><td className="p-4 text-gray-600">~120 + applicators</td></tr>
                  <tr><td className="p-4 font-bold text-gray-900">Dryness & odour</td><td className="p-4 font-bold text-[#7E4D77] bg-pink-50/30">Collects — neither</td><td className="p-4 text-gray-600">Can feel damp</td><td className="p-4 text-gray-600">Can dry you out</td></tr>
                  <tr><td className="p-4 font-bold text-gray-900">Swim • sleep • sport</td><td className="p-4 font-bold text-emerald-700 bg-pink-50/30">All three</td><td className="p-4 text-gray-600">Limited</td><td className="p-4 text-gray-600">Yes</td></tr>
                  <tr><td className="p-4 font-bold text-gray-900">Anything showing?</td><td className="p-4 font-bold text-[#7E4D77] bg-pink-50/30">Nothing — no string</td><td className="p-4 text-gray-600">Can be bulky</td><td className="p-4 text-gray-600">Visible string</td></tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-400">
              *Cup price spread across its years of use. Disposable figures assume ~₹200–250 a month.
            </div>
          </div>
        </div>

        {/* SUB-SECTION C: WHAT YOU GAIN THE DAY YOU SWITCH */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-6">
            What you gain the day you switch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-sm text-gray-900">12 hours, uninterrupted</h4><p className="text-xs text-gray-600 mt-1 leading-relaxed">Sleep through the night, swim, run and travel without a single change.</p></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-sm text-gray-900">3–5x more capacity</h4><p className="text-xs text-gray-600 mt-1 leading-relaxed">Holds far more than a pad or tampon — fewer bathroom trips on heavy days.</p></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0"><Droplets className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-sm text-gray-900">No dryness, zero odour</h4><p className="text-xs text-gray-600 mt-1 leading-relaxed">Silicone collects rather than absorbs, so moisture stays balanced and flow never meets air.</p></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><Zap className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-sm text-gray-900">Saves ₹3,000–5,000/year</h4><p className="text-xs text-gray-600 mt-1 leading-relaxed">Versus disposables — and one cup replaces years of throwaways.</p></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0"><Leaf className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-sm text-gray-900">Thousands of pads diverted</h4><p className="text-xs text-gray-600 mt-1 leading-relaxed">Kept out of landfill over years of cup use, versus single-use.</p></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center shrink-0"><Heart className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-sm text-gray-900">Hypoallergenic, lower TSS risk</h4><p className="text-xs text-gray-600 mt-1 leading-relaxed">Latex-free silicone collects rather than absorbs — TSS risk is lower than tampons, though not zero. Empty within 12 hrs.</p></div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NEW SECTIONS ADDED RIGHT BELOW "WHAT YOU GAIN THE DAY YOU SWITCH" */}
        {/* ============================================================ */}

        {/* NEW SECTION 1: "MADE FOR REAL LIFE IN INDIA - The honest answers, woman to woman" (ATTACHED SCREENSHOT 1) */}
        <div className="mb-20">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            MADE FOR REAL LIFE IN INDIA
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            The honest answers, woman to woman
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-2xl leading-relaxed">
            The questions everyone whispers about cups — answered without judgement, by people who get the Indian reality of shared bathrooms, hostels and family kitchens.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#7E4D77] flex items-center justify-center mb-3">
                <Heart className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#7E4D77] italic font-serif mb-1">“Will it affect my virginity?”</p>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">It has nothing to do with virginity</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Virginity is about a person and their choices — never a product. The hymen is a soft, stretchy rim of tissue that everyday things like cycling, sport and yoga already stretch. A cup may gently stretch it too, but it can't "take" anything. <b>Unmarried girls and teens can use a cup safely</b> — start with our smallest size on a light day.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Cloud className="w-4 h-4" />
              </div>
              <p className="text-xs text-purple-700 italic font-serif mb-1">“There's no sink inside the toilet...”</p>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">No private basin? Still easy</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                You only need to <b>fully wash the cup about twice a day</b>, so a quick midday change rarely needs a sink at all. Empty into the toilet, wipe with clean tissue or rinse from a small water bottle you carry in, and reinsert. Wash properly when you're home. One rule: never rinse with toilet water.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Home className="w-4 h-4" />
              </div>
              <p className="text-xs text-purple-700 italic font-serif mb-1">“I live in a hostel / travel a lot.”</p>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">Built for hostels, PGs & trains</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Up to 12 hours of wear means you can insert in private before college and empty at night — no mid-day stall drama. One tiny cup replaces a whole month of pads in your bag. For shared kitchens, a fold-away travel steriliser or sterilising tablets mean you never need someone else's stove.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-purple-700 italic font-serif mb-1">“Is it clean to reuse?”</p>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">Your own cup is very hygienic</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Medical-grade silicone is non-porous, so nothing soaks in. Sterilise by boiling before your first use and between periods; during your period a rinse with mild, unscented soap is enough. The only caveat: a cup is <b>personal</b> — never share it with anyone else.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#7E4D77] flex items-center justify-center mb-3">
                <CoffeeIcon className="w-4 h-4 text-[#7E4D77]" />
              </div>
              <p className="text-xs text-[#7E4D77] italic font-serif mb-1">“Do I boil it every time?”</p>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">Boiling is start & end only</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                You sterilise by boiling just before a period begins and once after it ends — <b>not</b> at every change. Five to seven minutes in any clean pot does it (keep it from touching the base so it doesn't scorch). No private stove? A small steam steriliser or sterilising tablet works just as well.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#7E4D77] flex items-center justify-center mb-3">
                <Heart className="w-4 h-4 text-[#7E4D77]" />
              </div>
              <p className="text-xs text-[#7E4D77] italic font-serif mb-1">“Is period blood impure?”</p>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">Your period is not impure</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Menstrual blood is clean, healthy and completely normal — there's nothing shameful about it. A cup simply lets you handle your period with less waste, less cost and more comfort, entirely on your own terms. That's not breaking a rule; that's looking after yourself.
              </p>
            </div>
          </div>
        </div>

        {/* NEW SECTION 2: "THE 10-YEAR MATH - One cup. Years of savings." (ATTACHED SCREENSHOT 2) */}
        <div className="mb-20">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            THE 10-YEAR MATH
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            One cup. Years of savings.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-2xl leading-relaxed">
            Disposables are a small bill every single month, for decades. A cup is a tiny fraction of that. Move the slider to see what switching could save <i>you</i>.
          </p>

          {/* Interactive Calculator Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-2xs mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Controls */}
              <div className="md:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                    WHAT YOU SPEND ON PADS/TAMPONS A MONTH
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#7E4D77]">₹{monthlySpend}</div>
                </div>

                {/* Range Slider */}
                <div>
                  <input
                    type="range"
                    min={80}
                    max={600}
                    step={10}
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7E4D77]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1 font-semibold">
                    <span>₹80</span>
                    <span>₹600</span>
                  </div>
                </div>

                {/* Timeframe Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setTimeframeYears(5)}
                    className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      timeframeYears === 5
                        ? "bg-[#B076A8] text-white shadow-2xs"
                        : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Over 5 years
                  </button>
                  <button
                    onClick={() => setTimeframeYears(10)}
                    className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      timeframeYears === 10
                        ? "bg-[#B076A8] text-white shadow-2xs"
                        : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Over 10 years
                  </button>
                </div>
              </div>

              {/* Right Calculated Output Box */}
              <div className="md:col-span-6 bg-gradient-to-br from-[#FBF1FB] via-white to-[#F3E6F0]/60 p-8 rounded-2xl border border-pink-200/60 text-center">
                <div className="font-serif text-4xl sm:text-5xl font-bold text-[#7E4D77] mb-1">
                  ₹{calculatedSavings.savings.toLocaleString()}
                </div>
                <p className="text-xs font-semibold text-gray-600 mb-4">saved versus disposables</p>
                <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                  That's after buying the Ovy cup — and about <b>{calculatedSavings.padsSaved.toLocaleString()}</b> pads/tampons kept out of landfill.
                </p>
              </div>

            </div>
          </div>

          {/* 3 Stat Cards Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs text-center">
              <div className="font-serif text-3xl font-bold text-[#7E4D77] mb-1">2,400+</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                disposable pads & tampons you'll skip over years of cup use
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs text-center">
              <div className="font-serif text-3xl font-bold text-[#7E4D77] mb-1">~₹20/mo</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                effective cost, replacing your cup every 2–3 years for hygiene
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs text-center">
              <div className="font-serif text-3xl font-bold text-[#7E4D77] mb-1">1</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                small thing in your bag instead of a monthly pharmacy run
              </p>
            </div>
          </div>
        </div>

        {/* NEW SECTION 3: "FULL TRANSPARENCY - One material. Nothing hidden." (ATTACHED SCREENSHOT 3) */}
        <div className="mb-20">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            FULL TRANSPARENCY
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            One material. Nothing hidden.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-2xl leading-relaxed">
            A cup is the simplest period product there is — one moulded piece, no adhesives, no fibres, no fragrance. Here's exactly what it is, and what it never contains.
          </p>

          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-2xs grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">MADE OF</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  <b>100% medical-grade silicone</b> (Class VI biocompatible — the grade used in implants & baby products)
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">FIRMNESS</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  <b>Soft–medium</b> — gentle on the bladder, yet firm enough to pop open and seal reliably
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">PACKAGING</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  <b>Recycled card, 100% plastic-free</b>, plain & discreet on the outside
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">NO ANIMAL PRODUCTS</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  <b>Made without any animal-derived materials, ever</b>
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">NEVER CONTAINS</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  BPA, latex, phthalates, PVC, dyes, fragrance, bleach, heavy metals or animal products
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">POUCH</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  <b>Breathable organic-cotton storage pouch</b> — included with every cup
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">GENTLE ON YOU</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  A smooth, non-porous surface that's kind to sensitive skin and easy to keep fresh
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">LIFESPAN</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  Cared for well it can last years; for best hygiene we suggest replacing every 2–3 years
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NEW SECTION 4: "GOOD TO KNOW - Safety, do's & don'ts" (ATTACHED SCREENSHOT 4) */}
        <div className="mb-20">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            GOOD TO KNOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            Safety, do's & don'ts
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-2xl leading-relaxed">
            A cup is very safe when used as directed. Please read this before your first use.
          </p>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold shrink-0 text-sm">✓</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <b>Do</b> empty the cup at least every 12 hours, and sterilise by boiling 5–7 minutes between cycles.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold shrink-0 text-sm">✓</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <b>Do</b> release the seal by pinching the base before removal — never pull by the stem alone.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold shrink-0 text-sm">✓</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <b>Do</b> store it in the <b>breathable cotton pouch</b> — never an airtight container.
              </p>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <span className="text-rose-600 font-bold shrink-0 text-sm">✕</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <b>Don't</b> use it when you're not menstruating, or as a contraceptive — it does not prevent pregnancy or STIs.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-rose-600 font-bold shrink-0 text-sm">✕</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <b>Don't</b> use during a vaginal infection — speak to a doctor first. With an IUD you can usually still use a cup: pinch the base to release the suction before removing, and keep your threads trimmed.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-rose-600 font-bold shrink-0 text-sm">✕</span>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <b>Don't</b> keep using a cup with tears, cracks, flaking, a sticky film or a lasting odour — replace it.
              </p>
            </div>
            <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
              <Info className="w-4 h-4 text-[#7E4D77] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">
                Remove the cup and seek medical help if you ever feel sudden fever, faintness, vomiting, rash or unusual pain.
              </p>
            </div>
          </div>
        </div>

        {/* NEW SECTION 5: "KEEP IT SPOTLESS - Cleaning & care, the simple way" (ATTACHED SCREENSHOT 5) */}
        <div className="mb-20">
          <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase block mb-2">
            KEEP IT SPOTLESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            Cleaning & care, the simple way
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 max-w-2xl leading-relaxed">
            Caring for a cup is easier than people fear. There are really just three moments — during the day, between periods, and storage.
          </p>

          {/* 3 Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Cloud className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">During your period</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Empty into the toilet, rinse with water and a <b>mild, unscented, oil-free</b> soap, and flush the little air holes clear (fill the cup, cover the top, squeeze). Reinsert. Empty at least every 12 hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#7E4D77] flex items-center justify-center mb-3">
                <CoffeeIcon className="w-4 h-4 text-[#7E4D77]" />
              </div>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">Between periods</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Sterilise by boiling in clean water for <b>5–7 minutes</b> (keep it from touching the hot base so it can't scorch). No private stove? A steam steriliser or a sterilising tablet works just as well.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">Storing it</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Let it dry fully, then keep it in the <b>breathable cotton pouch</b> it came with — never a plastic bag or airtight box, which traps moisture. Some discolouration over time is normal and harmless.
              </p>
            </div>
          </div>

          {/* 2 Bottom Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <h4 className="font-serif font-bold text-sm text-gray-900 mb-3">Please don't use...</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2"><span className="text-rose-600 font-bold">✕</span> Oil-based, fragranced or antibacterial soaps</li>
                <li className="flex items-center gap-2"><span className="text-rose-600 font-bold">✕</span> Vinegar, bleach, rubbing alcohol or harsh chemicals</li>
                <li className="flex items-center gap-2"><span className="text-rose-600 font-bold">✕</span> The dishwasher — and never share your cup</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
              <h4 className="font-serif font-bold text-sm text-gray-900 mb-3">Replace it when...</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> You see tears, cracks or torn air holes</li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> A sticky film or smell won't wash out</li>
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" /> For best hygiene, every 2–3 years regardless</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PRODUCT REVIEWS SECTION AT THE BOTTOM */}
        <div className="pt-10 border-t border-gray-200">
          <ProductReviews reviews={reviewWithMedia || []} product={product} themeColor={themeColor} />
        </div>

      </div>

      {/* SIZE FINDER QUIZ MODAL */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl transition-all">
            <button
              onClick={() => setIsQuizOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 0: Age */}
            {quizStep === 0 && (
              <div>
                <span className="text-xs font-bold text-[#7E4D77] uppercase tracking-wider">Step 1 of 4</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-1 mb-4">What is your age?</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("age", "under18")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Under 18 years old (Teen)
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("age", "18to30")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    18 – 30 years old
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("age", "above30")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Over 30 years old
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Birth */}
            {quizStep === 1 && (
              <div>
                <span className="text-xs font-bold text-[#7E4D77] uppercase tracking-wider">Step 2 of 4</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-1 mb-4">Have you given birth vaginally?</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("birth", "none")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    No / C-section delivery
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("birth", "vaginal")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Yes, given birth vaginally
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Flow */}
            {quizStep === 2 && (
              <div>
                <span className="text-xs font-bold text-[#7E4D77] uppercase tracking-wider">Step 3 of 4</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-1 mb-4">How heavy is your period flow?</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("flow", "light")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Light to Normal flow
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("flow", "heavy")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Heavy flow (Change pads frequently)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Cervix */}
            {quizStep === 3 && (
              <div>
                <span className="text-xs font-bold text-[#7E4D77] uppercase tracking-wider">Step 4 of 4</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-1 mb-4">What is your cervix height?</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("cervix", "medium")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Average or High Cervix
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("cervix", "low")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Low Cervix
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("cervix", "unsure")}
                    className="w-full p-3.5 text-left border border-gray-200 rounded-xl hover:border-[#7E4D77] hover:bg-pink-50/50 text-sm font-medium transition-all"
                  >
                    Unsure / First-time user
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {quizStep === 4 && quizResult && (
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-[#F3E6F0] text-[#7E4D77] flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">PERFECT MATCH FOUND</span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                  We recommend: {QUIZ_SIZES.find((s) => s.id === quizResult)?.name}
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Based on your answers, the {quizResult.toUpperCase()} cup size ({QUIZ_SIZES.find((s) => s.id === quizResult)?.cap}) provides optimal seal, comfort, and leak protection.
                </p>

                <button
                  onClick={applyQuizResult}
                  className="w-full mt-6 bg-[#7E4D77] text-white font-bold py-3 rounded-xl hover:bg-[#683c62] transition-all"
                >
                  Select Size
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CoffeeIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}
