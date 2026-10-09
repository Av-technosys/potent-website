/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  Check,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  Clock,
  Truck,
  Heart,
  HelpCircle,
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
import { useWishlistStore } from "@/store/WishlistStore";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
} from "@/store/WishlistActions";
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
  {
    id: "xs",
    name: "Teen (XS)",
    cap: "16 ml",
    forWho: "Teens & first-timers under 18",
  },
  {
    id: "m",
    name: "Medium",
    cap: "25 ml",
    forWho: "No vaginal birth yet (any age / C-section)",
  },
  {
    id: "l",
    name: "Large",
    cap: "35 ml",
    forWho: "After vaginal birth or very heavy flow",
  },
];

// Quick Questions Data
const QUICK_QUESTIONS_DATA: Record<
  string,
  {
    title: string;
    shortAnswer: string;
    detailedAnswer: string;
    sectionId: string;
    badge: string;
  }
> = {
  hurt: {
    title: "Will it hurt?",
    badge: "COMFORT & INSERTION",
    shortAnswer: "No — when inserted correctly, you shouldn't feel it at all.",
    detailedAnswer:
      "The 100% medical-grade silicone is feather-soft and moulds to your body's natural contours. The first few times can feel unfamiliar, but relaxation is key: relax your pelvic floor, wet the rim with clean water, and use the punch-down fold for the smallest tip. Once inside and open, a cup creates a gentle seal and completely disappears from sensation.",
    sectionId: "hurt-card",
  },
  virginity: {
    title: "Does it affect virginity?",
    badge: "MYTH BUSTING",
    shortAnswer: "It has nothing to do with virginity.",
    detailedAnswer:
      "Virginity is about a person and their choices — never an object or hygiene product. The hymen is a soft, flexible ring of tissue with a natural opening that sports, dance, and cycles already stretch. A cup gently stretches it too, but cannot 'take' anything. Unmarried girls and teens can safely use a cup from their very first cycle.",
    sectionId: "virginity-section",
  },
  size: {
    title: "Which size am I?",
    badge: "SIZING GUIDE",
    shortAnswer: "Chosen by cervix height, age, flow, and birth history.",
    detailedAnswer:
      "Teen (XS, 16ml) is tailored for teens and under-18s; Medium (25ml) is the go-to size for anyone who has not had a vaginal birth (at any age, including C-section moms); Large (35ml) is designed for after a vaginal birth or very heavy flow. Try our 30-second Find My Size quiz or the 20-second cervix check below!",
    sectionId: "size-finder",
  },
  hostel: {
    title: "How do I clean it in a hostel?",
    badge: "HOSTELS, PGS & TRAVEL",
    shortAnswer: "Super easy — you only need a full wash twice a day.",
    detailedAnswer:
      "Because the Ovy Cup gives up to 12 hours of protection, you can insert in the morning before class and empty at night in privacy. In shared washrooms without a private basin, empty into the toilet, wipe with clean tissue or rinse with a small water bottle you carry in, and reinsert. Between cycles, use a travel steam steriliser or sterilising tablets without needing a shared stove.",
    sectionId: "hostel-card",
  },
  teens: {
    title: "Is it safe for teens?",
    badge: "TEENS & FIRST-TIMERS",
    shortAnswer: "100% safe, healthy, and gynaecologist-approved.",
    detailedAnswer:
      "Teens can use menstrual cups as soon as their period starts. Starting with our softest Teen (XS) size and the punch-down fold at home on a lighter day gives zero pressure. It's rash-free, leak-free during sports and swimming, and saves thousands of throwaway pads.",
    sectionId: "teen-section",
  },
};

export default function MenstrualCupPageClient({
  product,
  reviewWithMedia,
}: Props) {
  const router = useRouter();
  const productInfo = product;
  const themeColor =
    product?.brand === "loway"
      ? { darkColor: "#168BA0", lightColor: "#E8F7FA", textColor: "#168BA0" }
      : ovyProductDetailsPage;

  // Extract Live DB Variants or fallback to 4 Cup Variants
  const variantsList = useMemo(() => {
    let dbVariants: any[] = [];
    if (
      Array.isArray(productInfo?.productVariants) &&
      productInfo.productVariants.length > 0
    ) {
      dbVariants = productInfo.productVariants;
    } else if (
      Array.isArray(productInfo?.prodcutVarientBoxRes) &&
      productInfo.prodcutVarientBoxRes.length > 0
    ) {
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
        strikethroughPrice: Number(
          productInfo?.strikethroughPrice || productInfo?.mrp || 399,
        ),
      },
      {
        id: "variant-m-purple",
        _id: "variant-m-purple",
        sku: "OVY-CUP-M-PUR",
        name: "Medium · Purple",
        size: "Medium",
        color: "Purple",
        price: Number(productInfo?.price || 459),
        strikethroughPrice: Number(
          productInfo?.strikethroughPrice || productInfo?.mrp || 399,
        ),
      },
      {
        id: "variant-m-rainbow",
        _id: "variant-m-rainbow",
        sku: "OVY-CUP-M-RNB",
        name: "Medium · Rainbow",
        size: "Medium",
        color: "Rainbow",
        price: Number(productInfo?.price || 459),
        strikethroughPrice: Number(
          productInfo?.strikethroughPrice || productInfo?.mrp || 399,
        ),
      },
      {
        id: "variant-l-white",
        _id: "variant-l-white",
        sku: "OVY-CUP-L-WHT",
        name: "Large · White",
        size: "Large",
        color: "White",
        price: Number(productInfo?.price || 459),
        strikethroughPrice: Number(
          productInfo?.strikethroughPrice || productInfo?.mrp || 399,
        ),
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
    if (activeVariant?.bannerImage)
      list.push(getImageUrl(activeVariant.bannerImage));
    if (activeVariant?.image) list.push(getImageUrl(activeVariant.image));
    if (productInfo?.bannerImage)
      list.push(getImageUrl(productInfo.bannerImage));
    if (Array.isArray(productInfo?.productMediaRes)) {
      productInfo.productMediaRes.forEach((item: any) => {
        if (item?.mediaURL) list.push(getImageUrl(item.mediaURL));
      });
    }
    const unique = Array.from(new Set(list.filter(Boolean)));
    return unique.length > 0 ? unique : ["/placeholder.jpg"];
  }, [productInfo, activeVariant]);

  const [activeImage, setActiveImage] = useState<string>("");
  const currentDisplayImage =
    activeImage || productImages[0] || "/placeholder.jpg";

  // Real Database Pricing & Rates
  const price = Number(activeVariant?.price ?? productInfo?.price ?? 459);
  const strikethroughPrice = Number(
    activeVariant?.strikethroughPrice ??
      activeVariant?.mrp ??
      productInfo?.strikethroughPrice ??
      productInfo?.mrp ??
      399,
  );
  const discountPercent =
    strikethroughPrice > price
      ? Math.round(((strikethroughPrice - price) / strikethroughPrice) * 100)
      : 0;

  const isOutOfStock = Boolean(
    activeVariant
      ? activeVariant.isInStock === false || activeVariant.is_in_stock === false
      : variantsList.length > 0
        ? variantsList.every(
            (v: any) => v.isInStock === false || v.is_in_stock === false,
          )
        : productInfo?.isInStock === false || productInfo?.is_in_stock === false,
  );

  // The reusable menstrual cup is buy-once only per the PDP matrix.

  // Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    age: "",
    birth: "",
    flow: "",
    cervix: "",
  });
  const [quizResult, setQuizResult] = useState<"xs" | "m" | "l" | null>(null);

  // Savings Calculator State (Screenshot 2)
  const [monthlySpend, setMonthlySpend] = useState(250);
  const [timeframeYears, setTimeframeYears] = useState<5 | 10>(5);

  // Savings Calculator Formula
  const calculatedSavings = useMemo(() => {
    const totalDisposables = monthlySpend * 12 * timeframeYears;
    const cupCost = 399;
    const savings = Math.max(0, totalDisposables - cupCost);
    const padsSaved = timeframeYears === 5 ? 1200 : 2400;
    return { savings, padsSaved };
  }, [monthlySpend, timeframeYears]);

  // Pincode State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
  }>({
    checked: false,
    valid: false,
    message: "",
  });

  // Quick Question Modal State
  const [activeQuickQuestionKey, setActiveQuickQuestionKey] = useState<string | null>(null);

  // Section Refs for smooth scrolling
  const topSectionRef = useRef<HTMLDivElement>(null);
  const periodSchoolRef = useRef<HTMLDivElement>(null);
  const sizeSectionRef = useRef<HTMLDivElement>(null);
  const virginitySectionRef = useRef<HTMLDivElement>(null);
  const hurtSectionRef = useRef<HTMLDivElement>(null);
  const hostelSectionRef = useRef<HTMLDivElement>(null);
  const teenSectionRef = useRef<HTMLDivElement>(null);

  // Wishlist State & Action
  const wishlistItems = useWishlistStore((state) => state.items);
  const [isWishlistUpdating, setIsWishlistUpdating] = useState(false);
  const isWishlisted = useMemo(() => {
    const targetId = productInfo?.id || productInfo?._id || "ovy-cup";
    const targetSlug = productInfo?.slug || "ovy-cup";
    return wishlistItems.some(
      (i: any) =>
        i.productId === targetId ||
        i.productId === targetSlug ||
        i.slug === targetSlug
    );
  }, [wishlistItems, productInfo]);

  const handleToggleWishlist = async () => {
    const targetId = productInfo?.id || productInfo?._id || "ovy-cup";
    const targetSlug = productInfo?.slug || "ovy-cup";
    if (isWishlistUpdating) return;
    setIsWishlistUpdating(true);
    try {
      if (isWishlisted) {
        await removeFromWishlistAction(targetId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistAction({
          ...productInfo,
          productId: targetId,
          name: productInfo?.name || "Ovy Reusable Menstrual Cup",
          selectedVariant: activeVariant,
          price: price,
          image: currentDisplayImage || "/products/cup.jpg",
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
            sizeSectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
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
    if (isOutOfStock) {
      toast.error("This item is currently out of stock.");
      return;
    }
    setIsAdding(true);
    try {
      const pId = productInfo?._id || productInfo?.id || "ovy-cup";
      const vId = activeVariant?._id || activeVariant?.id;
      const variantLabel = activeVariant?.name || activeVariant?.size || "";
      const itemTitle = productInfo?.name
        ? variantLabel
          ? `${productInfo.name} (${variantLabel})`
          : productInfo.name
        : variantLabel || "Ovy Reusable Menstrual Cup";

      const success = await addToCartAction({
        productId: pId,
        productVariantId: vId,
        sku: activeVariant?.sku || `OVY-CUP-${activeVariant?.size || "STD"}`,
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
          router.push("/checkout");
        } else {
          toast.success("Added to cart!");
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
        message:
          "Delivery available! Usually delivered in 2–4 business days with discreet packaging.",
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

      if (nextAnswers.age === "under18") {
        // Under 18 / Teen: Teen (XS) is specifically engineered for teens and young first-timers
        rec = "xs";
      } else if (nextAnswers.birth === "vaginal") {
        // After vaginal childbirth:
        if (nextAnswers.cervix === "low" && nextAnswers.flow === "light") {
          // Low cervix + light flow: Medium avoids protrusion while holding adequate capacity
          rec = "m";
        } else {
          // Standard recommendation after vaginal birth is Large
          rec = "l";
        }
      } else {
        // Adult (18+) without vaginal childbirth (includes C-section moms):
        if (
          nextAnswers.age === "above30" &&
          nextAnswers.flow === "heavy" &&
          nextAnswers.cervix !== "low"
        ) {
          // 30+ with very heavy flow and average/high cervix can use Large
          rec = "l";
        } else {
          // Default recommended standard size for all adults without vaginal birth is Medium
          rec = "m";
        }
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
        (v?.size || v?.name || "")
          .toLowerCase()
          .includes(quizResult.toLowerCase()),
      );
      if (matchIdx !== -1) {
        setSelectedVariantIndex(matchIdx);
      }
      setIsQuizOpen(false);
      toast.success(
        `Selected size: ${QUIZ_SIZES.find((s) => s.id === quizResult)?.name}`,
      );
    }
  };

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-20 font-sans text-[#1A150F] antialiased">
      {/* SECTION 1: HERO BUY SECTION WITH SINGLE-SELECT VARIANT CARDS */}
      <div
        ref={topSectionRef}
        className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6 sm:pt-10"
      >
        {/* Top Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs text-gray-500 sm:mb-6 sm:text-sm">
          <Link href="/" className="hover:text-[#7E4D77]">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#7E4D77]">
            Shop
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#1A150F]">
            {productInfo?.name || "Ovy Reusable Menstrual Cup"}
          </span>
        </nav>

        {/* HERO PDP GRID */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery Column */}
          <div className="static lg:sticky lg:top-24 lg:col-span-6">
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-4 shadow-xs">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#7E4D77] shadow-2xs backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#7E4D77]" />
                100% Medical-Grade Silicone
              </div>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={isWishlistUpdating}
                aria-label="Wishlist"
                className={`absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition-all hover:scale-105 ${
                  isWishlisted ? "text-rose-600 bg-white" : "text-gray-400 hover:text-rose-500"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-rose-600 stroke-rose-600" : ""
                  }`}
                />
              </button>

              {/* Main Product Image */}
              <div className="relative h-full w-full">
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
              <div className="scrollbar-none mt-4 flex items-center gap-3 overflow-x-auto pb-2">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all ${
                      currentDisplayImage === imgUrl
                        ? "scale-105 border-[#7E4D77] shadow-2xs"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Feature Badges */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-2xs">
                <Clock className="mx-auto mb-1 h-5 w-5 text-[#7E4D77]" />
                <p className="text-xs font-bold text-gray-900">Up to 12 Hrs</p>
                <p className="text-[10px] text-gray-500">Leak-free wear</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-2xs">
                <Leaf className="mx-auto mb-1 h-5 w-5 text-emerald-600" />
                <p className="text-xs font-bold text-gray-900">
                  Reusable 10 Yrs
                </p>
                <p className="text-[10px] text-gray-500">Zero pad waste</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-2xs">
                <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-teal-600" />
                <p className="text-xs font-bold text-gray-900">100% Medical</p>
                <p className="text-[10px] text-gray-500">BPA & latex free</p>
              </div>
            </div>
          </div>

          {/* Right Product Purchase Column */}
          <div className="flex flex-col lg:col-span-6">
            {/* Kicker */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
                {productInfo?.brand?.toUpperCase() || "OVY BY POTENT HYGIENE"}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="font-serif text-sm text-[#1A8D91] italic">
                Made for real life in India
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-2 font-serif text-3xl leading-tight font-bold text-[#1A150F] sm:text-4xl">
              {productInfo?.name || "Reusable Menstrual Cup"}
            </h1>

            {/* RATING STRIP & PILL BADGES */}
            <div className="mb-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
                <div className="flex text-purple-600">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#B076A8] stroke-[#B076A8]"
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.8</span>
                <span className="text-gray-500">
                  out of 5 · 183 verified reviews
                </span>
              </div>

              {/* Pill Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E6F0]/80 px-3 py-1 text-xs font-medium text-[#7E4D77]">
                  <Shield className="h-3.5 w-3.5" />
                  Medical-grade silicone
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E6F0]/80 px-3 py-1 text-xs font-medium text-[#7E4D77]">
                  <Leaf className="h-3.5 w-3.5" />
                  BPA & latex-free
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E6F0]/80 px-3 py-1 text-xs font-medium text-[#7E4D77]">
                  <Heart className="h-3.5 w-3.5" />
                  Cruelty-free & vegan
                </span>
              </div>
            </div>

            {/* DESCRIPTION KEY POINTS */}
            <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base">
              The softest cup you'll ever use — and a{" "}
              <b>kinder swap for your body and the planet</b>. 100%
              medical-grade silicone gives you up to 12 hours of leak-proof
              protection that works <i>with</i> your body. No toxins, no waste —
              just freedom.
            </p>

            {/* INTERACTIVE VARIANT SELECTOR CARDS */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-gray-900 uppercase">
                  Select Size & Color Option
                </span>
                <button
                  onClick={() => {
                    resetQuiz();
                    setIsQuizOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#7E4D77] hover:underline"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  30-Sec Size Quiz
                </button>
              </div>

              {/* Grid of Variant Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                      className={`relative cursor-pointer rounded-2xl border-2 p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-[#7E4D77] bg-[#F3E6F0]/50 shadow-xs"
                          : "border-gray-200/90 bg-white hover:border-pink-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="font-serif text-sm font-bold text-gray-900">
                            {v?.name || v?.size || `Option ${idx + 1}`}
                          </span>
                          {(v?.isInStock === false || v?.is_in_stock === false) && (
                            <span className="mt-0.5 w-fit rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-500">
                              Out of stock
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7E4D77] text-xs text-white shadow-2xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs font-bold text-[#7E4D77]">
                        ₹{v?.price || price}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICING & RATES */}
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-2 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-gray-900">
                  ₹{price}
                </span>
                {strikethroughPrice > price && (
                  <span className="text-base text-gray-400 line-through">
                    ₹{strikethroughPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>
              <p className="mb-4 text-xs text-gray-500">
                Includes breathable organic cotton storage pouch & size guide.
              </p>

              {/* Quantity + Buttons */}
              <div className="mb-6 grid grid-cols-12 gap-3">
                {/* Quantity Stepper */}
                <div className="col-span-4 flex items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 sm:col-span-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-1 text-lg font-bold text-gray-600 hover:text-black"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-1 text-lg font-bold text-gray-600 hover:text-black"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart or Out of Stock */}
                {isOutOfStock ? (
                  <button
                    type="button"
                    disabled
                    className="col-span-12 flex items-center justify-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-bold text-gray-500 shadow-none cursor-not-allowed"
                  >
                    Out of stock
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAddToCart(false)}
                      disabled={isAdding}
                      className="col-span-8 flex items-center justify-center gap-2 rounded-xl bg-[#7E4D77] px-6 py-3 font-bold text-white shadow-2xs transition-all hover:bg-[#683c62] active:scale-[0.98] sm:col-span-5"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {isAdding ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                      onClick={() => handleAddToCart(true)}
                      disabled={isAdding}
                      className="col-span-12 flex items-center justify-center gap-2 rounded-xl bg-[#141413] px-6 py-3 font-bold text-white transition-all hover:bg-black active:scale-[0.98] sm:col-span-4"
                    >
                      Buy Now
                    </button>
                  </>
                )}

                {/* Save to Wishlist Button */}
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  disabled={isWishlistUpdating}
                  className={`col-span-12 flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all ${
                    isWishlisted
                      ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#7E4D77] hover:text-[#7E4D77]"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isWishlisted ? "fill-rose-600 stroke-rose-600" : ""
                    }`}
                  />
                  <span>
                    {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                  </span>
                </button>
              </div>

              {/* WHAT'S IN THE BOX BOX */}
              <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-3 text-xs font-bold text-gray-600">
                  <span>WHAT'S IN THE BOX</span>
                  <span className="text-gray-400">
                    3 ITEMS · READY TO START
                  </span>
                </div>
                <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-3.5">
                    <span className="font-bold text-gray-900">
                      1 Ovy menstrual cup
                    </span>
                    <span className="font-semibold text-[#7E4D77]">
                      {activeVariant?.size || activeVariant?.name || "Medium"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Collects your flow, leak-free up to 12 hrs
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5">
                    <span className="font-bold text-gray-900">
                      Breathable cotton pouch
                    </span>
                    <span className="font-semibold text-[#7E4D77]">
                      included
                    </span>
                    <span className="text-xs text-gray-500">
                      Store it dry and fresh between cycles
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5">
                    <span className="font-bold text-gray-900">
                      Illustrated how-to guide
                    </span>
                    <span className="font-semibold text-[#7E4D77]">
                      first use
                    </span>
                    <span className="text-xs text-gray-500">
                      Fold, insert, seal and remove with ease
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 bg-[#FAF7F2] p-3 text-xs font-bold text-gray-700">
                  <span>TOTAL</span>
                  <span className="font-normal text-gray-500">
                    Everything to start — one cup, reusable for years
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gradient-to-r from-[#8E5FA8] via-[#5FBF7E] to-[#FAF7F2]" />
              </div>

              {/* REPLACEMENT GUARANTEE & SHOP WITH CONFIDENCE */}
              <div className="mb-6 space-y-4">
                <div className="space-y-1 text-xs text-gray-600">
                  <p className="font-semibold text-gray-500">
                    Ships in 24 hrs · secure checkout
                  </p>
                  <p>
                    Arrives damaged or the wrong size? <b>We'll replace it</b> —
                    just email a photo within 12 hrs. Questions?{" "}
                    <a
                      href="mailto:care@potenthygiene.com"
                      className="font-semibold text-[#7E4D77] underline"
                    >
                      care@potenthygiene.com
                    </a>
                  </p>
                  <p className="flex items-center gap-1.5 pt-1 font-semibold text-teal-700">
                    <Truck className="h-4 w-4" /> Ships in 24 hrs, tracked
                  </p>
                </div>

                {/* SHOP WITH CONFIDENCE CARD */}
                <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
                  <span className="block text-xs font-extrabold tracking-wider text-gray-900 uppercase">
                    SHOP WITH CONFIDENCE
                  </span>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-gray-700">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-[#7E4D77]" />{" "}
                      Medical-grade silicone
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Soft &
                      body-safe
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5 text-purple-600" />{" "}
                      Easy returns on damage
                    </span>
                  </div>

                  <div className="space-y-1.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 text-xs text-gray-600">
                    <p className="flex items-center gap-1.5 font-bold text-gray-800">
                      <Truck className="h-4 w-4 text-teal-600" /> Usually
                      delivered in 2–6 days · ships in 24 hrs, tracked
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      ✓ A cup is a hygiene product, so it can't be returned —
                      but if it arrives <b>damaged or the wrong size</b>, send
                      us a photo within <b>12 hours</b> of delivery and we'll
                      replace it.
                    </p>
                  </div>
                </div>

                {/* SECURE CHECKOUT PAYMENTS */}
                <div className="pt-2">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <Lock className="h-3.5 w-3.5" /> Secure checkout
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
                    {[
                      "UPI",
                      "Razorpay",
                      "Visa",
                      "Mastercard",
                      "RuPay",
                      "Net banking",
                    ].map((p) => (
                      <span
                        key={p}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1 shadow-2xs"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <form onSubmit={checkPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full rounded-xl border border-gray-200 py-2 pr-3 pl-9 text-xs focus:border-[#7E4D77] focus:outline-none sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-black"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus.checked && (
                  <p
                    className={`mt-2 text-xs font-medium ${
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
      <div
        ref={periodSchoolRef}
        className="mx-auto max-w-[1180px] px-4 pt-16 sm:px-6"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[#7E4D77]/15 bg-gradient-to-br from-[#FBF1FB] via-[#F4F1E8]/50 to-[#E4F1F1]/40 p-8 text-center shadow-sm sm:p-14">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#B076A8] px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase shadow-2xs">
            <BookOpen className="h-3.5 w-3.5" />
            OVY PERIOD SCHOOL
          </div>
          <h2 className="mx-auto mb-4 max-w-2xl font-serif text-3xl leading-tight font-bold text-[#1A150F] sm:text-5xl">
            You've seen the cup. Now get to know your body.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            A cup comes with a lot of questions — and not nearly enough straight
            answers. This is where we change that: no jargon, no shame, just
            what's really going on and what actually helps.
          </p>

          <div className="mx-auto mb-10 flex max-w-2xl flex-wrap justify-center gap-2.5">
            {[
              { key: "hurt", label: "Will it hurt?" },
              { key: "virginity", label: "Does it affect virginity?" },
              { key: "size", label: "Which size am I?" },
              { key: "hostel", label: "How do I clean it in a hostel?" },
              { key: "teens", label: "Is it safe for teens?" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveQuickQuestionKey(key)}
                className="cursor-pointer rounded-full border border-pink-200/80 bg-white/80 px-4 py-2 text-xs font-medium text-[#7E4D77] shadow-2xs backdrop-blur-xs transition-all hover:bg-[#7E4D77] hover:text-white sm:text-sm"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mx-auto grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => scrollToRef(topSectionRef)}
              className="group flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 text-left shadow-2xs transition-all hover:border-[#7E4D77]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-[#F3E6F0] group-hover:text-[#7E4D77]">
                <ArrowUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  I'm all set — shop my cup
                </p>
                <p className="text-xs text-gray-500">
                  Back to sizes, colours & checkout
                </p>
              </div>
            </button>

            <button
              onClick={() => scrollToRef(virginitySectionRef)}
              className="group flex items-center gap-3 rounded-2xl border-2 border-[#7E4D77] bg-white p-4 text-left shadow-2xs transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E6F0] text-[#7E4D77]">
                <ArrowDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Take me into the Period School
                </p>
                <p className="text-xs text-gray-500">
                  15 quick topics — sizing, care, safety, savings & more
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: VIRGINITY & HYMEN MYTH BUSTING */}
      <div
        ref={virginitySectionRef}
        id="virginity-section"
        className="scroll-mt-24 mx-auto max-w-[1180px] px-4 pt-20 sm:px-6"
      >
        <div className="mb-8">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            LET'S TALK ABOUT IT
          </span>
          <h2 className="font-serif text-3xl leading-tight font-bold text-gray-900 sm:text-4xl">
            Will a cup affect your virginity?{" "}
            <span className="font-serif font-normal text-[#7E4D77] italic">
              No — and here's why.
            </span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
            It's the question we hear most, especially from teens and
            first-timers. So here's the honest, gynaecologist-checked truth —
            gently, and without the myths.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 items-center gap-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs sm:p-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h3 className="mb-3 font-serif text-xl leading-snug font-bold text-gray-900 sm:text-2xl">
              A cup can't “take” your virginity. There's no wall down there
              waiting to break.
            </h3>
            <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
              Virginity is a personal idea — not a medical state an object can
              change. What's actually near the opening is a soft, stretchy ring
              of tissue called the <b>hymen</b>, with a natural gap your period
              already flows through. So let's bust the myths, one by one.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-[#FAF9F5] p-6 text-center md:col-span-5">
            <div className="relative my-2 flex h-40 w-40 items-center justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-[#7E4D77]/30 bg-[#F3E6F0]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#7E4D77] bg-white text-[10px] font-bold text-gray-500">
                  natural
                  <br />
                  opening
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs font-bold text-[#7E4D77]">The hymen</p>
            <p className="text-[11px] text-gray-500">
              a soft, elastic ring of tissue
            </p>
            <p className="mt-2 text-[10px] text-gray-400 italic">
              It stretches to let things through — it doesn't "break".
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-rose-600 uppercase">
                MYTH
              </span>
              <span className="font-serif text-xs text-gray-400 italic">
                “A cup will tear or break my hymen.”
              </span>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 shrink-0 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-purple-700 uppercase">
                TRUTH
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                It's soft, elastic tissue with a <b>natural opening</b>. It
                stretches to let things past — it doesn't snap.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-rose-600 uppercase">
                MYTH
              </span>
              <span className="font-serif text-xs text-gray-400 italic">
                “People can tell if you've used one.”
              </span>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 shrink-0 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-purple-700 uppercase">
                TRUTH
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                The hymen can't show whether someone's had sex. It comes in{" "}
                <b>every shape</b> — some are born with barely any.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-rose-600 uppercase">
                MYTH
              </span>
              <span className="font-serif text-xs text-gray-400 italic">
                “Only a cup stretches it.”
              </span>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 shrink-0 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-purple-700 uppercase">
                TRUTH
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                Cycling, sport, dance and tampons stretch it over the years too.{" "}
                <b>Stretching isn't tearing.</b>
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-rose-600 uppercase">
                MYTH
              </span>
              <span className="font-serif text-xs text-gray-400 italic">
                “Unmarried girls and teens shouldn't.”
              </span>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 shrink-0 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-purple-700 uppercase">
                TRUTH
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                Anyone who menstruates can. Start with our softest <b>Teen</b>{" "}
                size, breathe out, wet the rim — no rush.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-[#7E4D77]/20 bg-[#F3E6F0]/60 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#7E4D77]" />
          <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
            <b>A gentle note:</b> if insertion ever feels truly impossible or
            sharply painful even when you're relaxed, it's worth a quick chat
            with a doctor — very rarely a hymen has an unusually small opening,
            which is simple to check and has nothing to do with the cup.
          </p>
        </div>
      </div>

      {/* SECTION 3: THREE SIZES & CERVIX CHECK */}
      <div
        ref={sizeSectionRef}
        id="size-finder"
        className="mx-auto max-w-[1180px] px-4 pt-20 sm:px-6"
      >
        <div className="mb-6">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            FIND YOUR SIZE
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            Three sizes, four colours
          </h2>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-gray-600 sm:text-sm">
            One cup, sized to you. What matters most is{" "}
            <b>how high your cervix sits</b> — along with your flow and whether
            you've had a <b>vaginal</b> birth. It's not about your body shape,
            your weight or even your age (plenty of people over 30 sit happily
            on Medium), and a <b>C-section doesn't change your size:</b> your
            birth canal isn't stretched, so most C-section mums stay with
            Medium. Read the table, do the 20-second cervix check below, or let
            the <u>30-second quiz</u> choose for you.
          </p>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => {
              resetQuiz();
              setIsQuizOpen(true);
            }}
            className="rounded-full bg-[#7E4D77] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition-all hover:bg-[#683c62]"
          >
            Take the 30-second quiz →
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("cervix-check-box");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition-all hover:border-[#7E4D77] hover:text-[#7E4D77]"
          >
            Do the cervix check →
          </button>
        </div>

        <div className="mb-10 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#B076A8] text-[11px] tracking-wider text-white uppercase">
                  <th className="p-4 font-bold">SIZE</th>
                  <th className="p-4 font-bold">CAPACITY</th>
                  <th className="p-4 font-bold">COLOURS</th>
                  <th className="p-4 font-bold">BEST FOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-pink-50/20">
                  <td className="flex items-center gap-3 p-4 font-serif font-bold text-gray-900">
                    <span className="inline-block h-6 w-6 shrink-0 rounded-full bg-pink-300 shadow-2xs" />
                    Teen (XS)
                  </td>
                  <td className="p-4 font-serif text-base font-bold text-[#7E4D77]">
                    16 ml
                  </td>
                  <td className="p-4 text-gray-600">Pink</td>
                  <td className="p-4 leading-relaxed text-gray-600">
                    First periods & first-timers • light to average flow •
                    before any birth • a low-to-average cervix or tighter
                    muscles
                  </td>
                </tr>

                <tr className="hover:bg-purple-50/20">
                  <td className="flex items-center gap-3 p-4 font-serif font-bold text-gray-900">
                    <span className="inline-block h-6 w-6 shrink-0 rounded-full bg-purple-400 shadow-2xs" />
                    Medium (M)
                  </td>
                  <td className="p-4 font-serif text-base font-bold text-[#7E4D77]">
                    25 ml
                  </td>
                  <td className="p-4 text-gray-600">Purple • Rainbow</td>
                  <td className="p-4 leading-relaxed text-gray-600">
                    The everyday all-rounder • average flow & cervix • no{" "}
                    <b>vaginal</b> birth yet — C-section mums and many over-30s
                    included
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="flex items-center gap-3 p-4 font-serif font-bold text-gray-900">
                    <span className="inline-block h-6 w-6 shrink-0 rounded-full border border-gray-300 bg-amber-100 shadow-2xs" />
                    Large (L)
                  </td>
                  <td className="p-4 font-serif text-base font-bold text-[#7E4D77]">
                    35 ml
                  </td>
                  <td className="p-4 text-gray-600">White</td>
                  <td className="p-4 leading-relaxed text-gray-600">
                    After a <b>vaginal</b> birth • heavier or longer days • a
                    higher cervix or a more relaxed pelvic floor
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          id="cervix-check-box"
          className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs sm:p-8"
        >
          <h3 className="mb-2 font-serif text-xl font-bold text-gray-900">
            The 20-second cervix check
          </h3>
          <p className="mb-6 text-xs leading-relaxed text-gray-600 sm:text-sm">
            Cervix height decides how a cup sits more than anything else — and
            it's easy to find. <b>During your period,</b> wash your hands and
            slide one finger into your vagina until you feel your cervix (it's
            firm and rounded, a bit like the tip of your nose). Note how far
            your finger went:
          </p>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200/60 bg-[#FAF9F5] p-5">
              <span className="font-serif text-xs font-bold text-[#7E4D77]">
                1st knuckle
              </span>
              <h4 className="mt-1 mb-2 text-xs font-bold tracking-wider text-gray-900 uppercase">
                LOW CERVIX
              </h4>
              <p className="text-xs leading-relaxed text-gray-600">
                A shorter cup sits more comfortably. You may want to trim or
                remove the stem. Teen (XS) or Medium suit most.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/60 bg-[#FAF9F5] p-5">
              <span className="font-serif text-xs font-bold text-[#7E4D77]">
                2nd knuckle
              </span>
              <h4 className="mt-1 mb-2 text-xs font-bold tracking-wider text-gray-900 uppercase">
                AVERAGE CERVIX
              </h4>
              <p className="text-xs leading-relaxed text-gray-600">
                The most common — almost any size works. Pick by age, flow and
                birth history using the table above.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/60 bg-[#FAF9F5] p-5">
              <span className="font-serif text-xs font-bold text-[#7E4D77]">
                3rd knuckle / can't reach
              </span>
              <h4 className="mt-1 mb-2 text-xs font-bold tracking-wider text-gray-900 uppercase">
                HIGH CERVIX
              </h4>
              <p className="text-xs leading-relaxed text-gray-600">
                You have plenty of room — keep the full stem to help you reach
                the base. Medium or Large work well.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#7E4D77]/20 bg-[#F3E6F0]/50 p-3.5 text-xs text-gray-700">
            <Info className="h-4 w-4 shrink-0 text-[#7E4D77]" />
            <span>
              Cervix height can shift a little across your cycle, so check on a
              period day. Still unsure? Our <u>30-second quiz</u> factors all of
              this in for you.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: TEEN DO'S & DON'TS, COMPARISON TABLE & BENEFIT CARDS */}
      <div
        ref={teenSectionRef}
        id="teen-section"
        className="scroll-mt-24 mx-auto max-w-[1180px] px-4 pt-20 sm:px-6"
      >
        {/* SUB-SECTION A: TEEN DO'S & DON'TS */}
        <div className="mb-16">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            FOR TEENS & FIRST-TIMERS
          </span>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            A cup, the teen way — do's & don'ts
          </h2>
          <p className="mb-8 max-w-2xl text-xs text-gray-600 sm:text-sm">
            Trying a cup as a teen is completely safe and normal. Keep these
            simple do's and don'ts in mind and you'll be a pro within a couple
            of cycles.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs sm:p-8">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-emerald-700">
                <Check className="h-5 w-5 text-emerald-600" /> Do
              </h3>
              <ul className="space-y-3.5 text-xs text-gray-700 sm:text-sm">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-emerald-600">✓</span>
                  <span>
                    Start at home on a lighter day, with plenty of time and zero
                    pressure.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-emerald-600">✓</span>
                  <span>
                    Wash your hands, then wet the rim with clean water so it
                    slides in easily.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-emerald-600">✓</span>
                  <span>
                    Use the <b>Teen (XS)</b> size and the <b>punch-down fold</b>{" "}
                    — the easiest combo for beginners.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-emerald-600">✓</span>
                  <span>
                    Empty it at least every 12 hours, and sterilise by boiling
                    before the first use and between periods.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-emerald-600">✓</span>
                  <span>
                    Ask a parent, older sister or the school nurse if you're
                    unsure — it's completely normal to.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs sm:p-8">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-rose-700">
                <X className="h-5 w-5 text-rose-600" /> Don't
              </h3>
              <ul className="space-y-3.5 text-xs text-gray-700 sm:text-sm">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-rose-600">✕</span>
                  <span>
                    Don't panic if it takes two or three tries — that's normal,
                    not failure. Relax and breathe out.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-rose-600">✕</span>
                  <span>
                    Don't pull it out by the stem alone — pinch the base first
                    to release the seal.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-rose-600">✕</span>
                  <span>
                    Don't share your cup with anyone, and don't leave it in
                    longer than 12 hours.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-rose-600">✕</span>
                  <span>
                    Don't worry about virginity — a cup has nothing to do with
                    it.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 font-bold text-rose-600">✕</span>
                  <span>
                    Don't use a cup if you have a vaginal infection — check with
                    a doctor first.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SUB-SECTION B: AN HONEST COMPARISON */}
        <div className="mb-16">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            AN HONEST COMPARISON
          </span>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            Cup vs pads vs tampons
          </h2>
          <p className="mb-8 max-w-2xl text-xs text-gray-600 sm:text-sm">
            Same job, three very different experiences. Here's how a cup
            actually stacks up — no exaggeration.
          </p>

          <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="w-1/4 p-4 font-semibold text-gray-400"></th>
                    <th className="w-1/4 bg-[#B076A8] p-4 text-xs font-bold tracking-wider text-white uppercase">
                      OVY CUP
                    </th>
                    <th className="w-1/4 p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      PADS
                    </th>
                    <th className="w-1/4 p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      TAMPONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-4 font-bold text-gray-900">Wear time</td>
                    <td className="bg-pink-50/30 p-4 font-bold text-[#7E4D77]">
                      Up to 12 hours
                    </td>
                    <td className="p-4 text-gray-600">4–6 hours</td>
                    <td className="p-4 text-gray-600">4–8 hours</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900">Capacity</td>
                    <td className="bg-pink-50/30 p-4 font-bold text-[#7E4D77]">
                      Up to 3x a tampon
                    </td>
                    <td className="p-4 text-gray-600">Surface only</td>
                    <td className="p-4 text-gray-600">~10 ml</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900">Reusable</td>
                    <td className="bg-pink-50/30 p-4 font-bold text-emerald-700">
                      Yes — years
                    </td>
                    <td className="p-4 text-gray-600">No</td>
                    <td className="p-4 text-gray-600">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900">
                      Cost per year
                    </td>
                    <td className="bg-pink-50/30 p-4 font-bold text-[#7E4D77]">
                      ~₹50–60*
                    </td>
                    <td className="p-4 text-gray-600">₹2,000–3,000</td>
                    <td className="p-4 text-gray-600">₹2,500–3,500</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900">
                      Waste per year
                    </td>
                    <td className="bg-pink-50/30 p-4 font-bold text-[#7E4D77]">
                      Almost none
                    </td>
                    <td className="p-4 text-gray-600">~120 pads</td>
                    <td className="p-4 text-gray-600">~120 + applicators</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900">
                      Dryness & odour
                    </td>
                    <td className="bg-pink-50/30 p-4 font-bold text-[#7E4D77]">
                      Collects — neither
                    </td>
                    <td className="p-4 text-gray-600">Can feel damp</td>
                    <td className="p-4 text-gray-600">Can dry you out</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900">
                      Swim • sleep • sport
                    </td>
                    <td className="bg-pink-50/30 p-4 font-bold text-emerald-700">
                      All three
                    </td>
                    <td className="p-4 text-gray-600">Limited</td>
                    <td className="p-4 text-gray-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-gray-900">
                      Anything showing?
                    </td>
                    <td className="bg-pink-50/30 p-4 font-bold text-[#7E4D77]">
                      Nothing — no string
                    </td>
                    <td className="p-4 text-gray-600">Can be bulky</td>
                    <td className="p-4 text-gray-600">Visible string</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 p-3 text-[11px] text-gray-400">
              *Cup price spread across its years of use. Disposable figures
              assume ~₹200–250 a month.
            </div>
          </div>
        </div>

        {/* SUB-SECTION C: WHAT YOU GAIN THE DAY YOU SWITCH */}
        <div className="mb-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
            What you gain the day you switch
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  12 hours, uninterrupted
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  Sleep through the night, swim, run and travel without a single
                  change.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  3–5x more capacity
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  Holds far more than a pad or tampon — fewer bathroom trips on
                  heavy days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  No dryness, zero odour
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  Silicone collects rather than absorbs, so moisture stays
                  balanced and flow never meets air.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Saves ₹3,000–5,000/year
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  Versus disposables — and one cup replaces years of throwaways.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Thousands of pads diverted
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  Kept out of landfill over years of cup use, versus single-use.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-700">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Hypoallergenic, lower TSS risk
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  Latex-free silicone collects rather than absorbs — TSS risk is
                  lower than tampons, though not zero. Empty within 12 hrs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NEW SECTIONS ADDED RIGHT BELOW "WHAT YOU GAIN THE DAY YOU SWITCH" */}
        {/* ============================================================ */}

        {/* NEW SECTION 1: "MADE FOR REAL LIFE IN INDIA - The honest answers, woman to woman" (ATTACHED SCREENSHOT 1) */}
        <div className="mb-20">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            MADE FOR REAL LIFE IN INDIA
          </span>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            The honest answers, woman to woman
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-gray-600 sm:text-sm">
            The questions everyone whispers about cups — answered without
            judgement, by people who get the Indian reality of shared bathrooms,
            hostels and family kitchens.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card: Will it hurt? */}
            <div
              ref={hurtSectionRef}
              id="hurt-card"
              className="scroll-mt-24 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-[#7E4D77]">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="mb-1 font-serif text-xs text-[#7E4D77] italic">
                “Will it hurt to insert or wear?”
              </p>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                Hurt-free when you relax & fold
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                No — when positioned correctly, you shouldn't feel it at all.
                Medical-grade silicone is velvety-soft and moulds to your body.
                Relax your pelvic floor, wet the rim with clean water, and use
                the punch-down fold. If it ever feels uncomfortable, it's simply
                sitting too low — push it up gently. Most women feel completely
                confident within 1–2 cycles.
              </p>
            </div>

            {/* Card 1 */}
            <div
              id="virginity-card"
              className="scroll-mt-24 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-[#7E4D77]">
                <Heart className="h-4 w-4" />
              </div>
              <p className="mb-1 font-serif text-xs text-[#7E4D77] italic">
                “Will it affect my virginity?”
              </p>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                It has nothing to do with virginity
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Virginity is about a person and their choices — never a product.
                The hymen is a soft, stretchy rim of tissue that everyday things
                like cycling, sport and yoga already stretch. A cup may gently
                stretch it too, but it can't "take" anything.{" "}
                <b>Unmarried girls and teens can use a cup safely</b> — start
                with our smallest size on a light day.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Cloud className="h-4 w-4" />
              </div>
              <p className="mb-1 font-serif text-xs text-purple-700 italic">
                “There's no sink inside the toilet...”
              </p>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                No private basin? Still easy
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                You only need to <b>fully wash the cup about twice a day</b>, so
                a quick midday change rarely needs a sink at all. Empty into the
                toilet, wipe with clean tissue or rinse from a small water
                bottle you carry in, and reinsert. Wash properly when you're
                home. One rule: never rinse with toilet water.
              </p>
            </div>

            {/* Card 3 */}
            <div
              ref={hostelSectionRef}
              id="hostel-card"
              className="scroll-mt-24 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Home className="h-4 w-4" />
              </div>
              <p className="mb-1 font-serif text-xs text-purple-700 italic">
                “I live in a hostel / travel a lot.”
              </p>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                Built for hostels, PGs & trains
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Up to 12 hours of wear means you can insert in private before
                college and empty at night — no mid-day stall drama. One tiny
                cup replaces a whole month of pads in your bag. For shared
                kitchens, a fold-away travel steriliser or sterilising tablets
                mean you never need someone else's stove.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="mb-1 font-serif text-xs text-purple-700 italic">
                “Is it clean to reuse?”
              </p>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                Your own cup is very hygienic
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Medical-grade silicone is non-porous, so nothing soaks in.
                Sterilise by boiling before your first use and between periods;
                during your period a rinse with mild, unscented soap is enough.
                The only caveat: a cup is <b>personal</b> — never share it with
                anyone else.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-[#7E4D77]">
                <CoffeeIcon className="h-4 w-4 text-[#7E4D77]" />
              </div>
              <p className="mb-1 font-serif text-xs text-[#7E4D77] italic">
                “Do I boil it every time?”
              </p>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                Boiling is start & end only
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                You sterilise by boiling just before a period begins and once
                after it ends — <b>not</b> at every change. Five to seven
                minutes in any clean pot does it (keep it from touching the base
                so it doesn't scorch). No private stove? A small steam
                steriliser or sterilising tablet works just as well.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-[#7E4D77]">
                <Heart className="h-4 w-4 text-[#7E4D77]" />
              </div>
              <p className="mb-1 font-serif text-xs text-[#7E4D77] italic">
                “Is period blood impure?”
              </p>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                Your period is not impure
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Menstrual blood is clean, healthy and completely normal —
                there's nothing shameful about it. A cup simply lets you handle
                your period with less waste, less cost and more comfort,
                entirely on your own terms. That's not breaking a rule; that's
                looking after yourself.
              </p>
            </div>
          </div>
        </div>

        {/* NEW SECTION 2: "THE 10-YEAR MATH - One cup. Years of savings." (ATTACHED SCREENSHOT 2) */}
        <div className="mb-20">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            THE 10-YEAR MATH
          </span>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            One cup. Years of savings.
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-gray-600 sm:text-sm">
            Disposables are a small bill every single month, for decades. A cup
            is a tiny fraction of that. Move the slider to see what switching
            could save <i>you</i>.
          </p>

          {/* Interactive Calculator Box */}
          <div className="mb-6 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs sm:p-10">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
              {/* Left Controls */}
              <div className="space-y-6 md:col-span-6">
                <div>
                  <span className="mb-2 block text-xs font-bold tracking-wider text-gray-500 uppercase">
                    WHAT YOU SPEND ON PADS/TAMPONS A MONTH
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#7E4D77]">
                    ₹{monthlySpend}
                  </div>
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
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#7E4D77]"
                  />
                  <div className="mt-1 flex justify-between text-xs font-semibold text-gray-400">
                    <span>₹80</span>
                    <span>₹600</span>
                  </div>
                </div>

                {/* Timeframe Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setTimeframeYears(5)}
                    className={`cursor-pointer rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                      timeframeYears === 5
                        ? "bg-[#B076A8] text-white shadow-2xs"
                        : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Over 5 years
                  </button>
                  <button
                    onClick={() => setTimeframeYears(10)}
                    className={`cursor-pointer rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                      timeframeYears === 10
                        ? "bg-[#B076A8] text-white shadow-2xs"
                        : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Over 10 years
                  </button>
                </div>
              </div>

              {/* Right Calculated Output Box */}
              <div className="rounded-2xl border border-pink-200/60 bg-gradient-to-br from-[#FBF1FB] via-white to-[#F3E6F0]/60 p-8 text-center md:col-span-6">
                <div className="mb-1 font-serif text-4xl font-bold text-[#7E4D77] sm:text-5xl">
                  ₹{calculatedSavings.savings.toLocaleString()}
                </div>
                <p className="mb-4 text-xs font-semibold text-gray-600">
                  saved versus disposables
                </p>
                <p className="mx-auto max-w-xs text-[11px] leading-relaxed text-gray-500">
                  That's after buying the Ovy cup — and about{" "}
                  <b>{calculatedSavings.padsSaved.toLocaleString()}</b>{" "}
                  pads/tampons kept out of landfill.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Stat Cards Below */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 text-center shadow-2xs">
              <div className="mb-1 font-serif text-3xl font-bold text-[#7E4D77]">
                2,400+
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                disposable pads & tampons you'll skip over years of cup use
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 text-center shadow-2xs">
              <div className="mb-1 font-serif text-3xl font-bold text-[#7E4D77]">
                ~₹20/mo
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                effective cost, replacing your cup every 2–3 years for hygiene
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 text-center shadow-2xs">
              <div className="mb-1 font-serif text-3xl font-bold text-[#7E4D77]">
                1
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                small thing in your bag instead of a monthly pharmacy run
              </p>
            </div>
          </div>
        </div>

        {/* NEW SECTION 3: "FULL TRANSPARENCY - One material. Nothing hidden." (ATTACHED SCREENSHOT 3) */}
        <div className="mb-20">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            FULL TRANSPARENCY
          </span>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            One material. Nothing hidden.
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-gray-600 sm:text-sm">
            A cup is the simplest period product there is — one moulded piece,
            no adhesives, no fibres, no fragrance. Here's exactly what it is,
            and what it never contains.
          </p>

          <div className="grid grid-cols-1 divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-2xs md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="space-y-6 p-6">
              <div>
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  MADE OF
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  <b>100% medical-grade silicone</b> (Class VI biocompatible —
                  the grade used in implants & baby products)
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  FIRMNESS
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  <b>Soft–medium</b> — gentle on the bladder, yet firm enough to
                  pop open and seal reliably
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  PACKAGING
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  <b>Recycled card, 100% plastic-free</b>, plain & discreet on
                  the outside
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  NO ANIMAL PRODUCTS
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  <b>Made without any animal-derived materials, ever</b>
                </p>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  NEVER CONTAINS
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  BPA, latex, phthalates, PVC, dyes, fragrance, bleach, heavy
                  metals or animal products
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  POUCH
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  <b>Breathable organic-cotton storage pouch</b> — included with
                  every cup
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  GENTLE ON YOU
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  A smooth, non-porous surface that's kind to sensitive skin and
                  easy to keep fresh
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                  LIFESPAN
                </span>
                <p className="text-xs leading-relaxed text-gray-800 sm:text-sm">
                  Cared for well it can last years; for best hygiene we suggest
                  replacing every 2–3 years
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NEW SECTION 4: "GOOD TO KNOW - Safety, do's & don'ts" (ATTACHED SCREENSHOT 4) */}
        <div className="mb-20">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            GOOD TO KNOW
          </span>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            Safety, do's & don'ts
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-gray-600 sm:text-sm">
            A cup is very safe when used as directed. Please read this before
            your first use.
          </p>

          <div className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs sm:p-8">
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-sm font-bold text-emerald-600">
                ✓
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                <b>Do</b> empty the cup at least every 12 hours, and sterilise
                by boiling 5–7 minutes between cycles.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-sm font-bold text-emerald-600">
                ✓
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                <b>Do</b> release the seal by pinching the base before removal —
                never pull by the stem alone.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-sm font-bold text-emerald-600">
                ✓
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                <b>Do</b> store it in the <b>breathable cotton pouch</b> — never
                an airtight container.
              </p>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <span className="shrink-0 text-sm font-bold text-rose-600">
                ✕
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                <b>Don't</b> use it when you're not menstruating, or as a
                contraceptive — it does not prevent pregnancy or STIs.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-sm font-bold text-rose-600">
                ✕
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                <b>Don't</b> use during a vaginal infection — speak to a doctor
                first. With an IUD you can usually still use a cup: pinch the
                base to release the suction before removing, and keep your
                threads trimmed.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 text-sm font-bold text-rose-600">
                ✕
              </span>
              <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                <b>Don't</b> keep using a cup with tears, cracks, flaking, a
                sticky film or a lasting odour — replace it.
              </p>
            </div>
            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#7E4D77]" />
              <p className="text-xs leading-relaxed text-gray-600">
                Remove the cup and seek medical help if you ever feel sudden
                fever, faintness, vomiting, rash or unusual pain.
              </p>
            </div>
          </div>
        </div>

        {/* NEW SECTION 5: "KEEP IT SPOTLESS - Cleaning & care, the simple way" (ATTACHED SCREENSHOT 5) */}
        <div className="mb-20">
          <span className="mb-2 block text-xs font-extrabold tracking-widest text-[#7E4D77] uppercase">
            KEEP IT SPOTLESS
          </span>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            Cleaning & care, the simple way
          </h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-gray-600 sm:text-sm">
            Caring for a cup is easier than people fear. There are really just
            three moments — during the day, between periods, and storage.
          </p>

          {/* 3 Top Cards Grid */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Cloud className="h-4 w-4" />
              </div>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                During your period
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Empty into the toilet, rinse with water and a{" "}
                <b>mild, unscented, oil-free</b> soap, and flush the little air
                holes clear (fill the cup, cover the top, squeeze). Reinsert.
                Empty at least every 12 hours.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-[#7E4D77]">
                <CoffeeIcon className="h-4 w-4 text-[#7E4D77]" />
              </div>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                Between periods
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Sterilise by boiling in clean water for <b>5–7 minutes</b> (keep
                it from touching the hot base so it can't scorch). No private
                stove? A steam steriliser or a sterilising tablet works just as
                well.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="mb-2 font-serif text-base font-bold text-gray-900">
                Storing it
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                Let it dry fully, then keep it in the{" "}
                <b>breathable cotton pouch</b> it came with — never a plastic
                bag or airtight box, which traps moisture. Some discolouration
                over time is normal and harmless.
              </p>
            </div>
          </div>

          {/* 2 Bottom Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <h4 className="mb-3 font-serif text-sm font-bold text-gray-900">
                Please don't use...
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="font-bold text-rose-600">✕</span> Oil-based,
                  fragranced or antibacterial soaps
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-rose-600">✕</span> Vinegar,
                  bleach, rubbing alcohol or harsh chemicals
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-rose-600">✕</span> The
                  dishwasher — and never share your cup
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs">
              <h4 className="mb-3 font-serif text-sm font-bold text-gray-900">
                Replace it when...
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />{" "}
                  You see tears, cracks or torn air holes
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />{" "}
                  A sticky film or smell won't wash out
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-teal-600" /> For
                  best hygiene, every 2–3 years regardless
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PRODUCT REVIEWS SECTION AT THE BOTTOM */}
        <div className="border-t border-gray-200 pt-10">
          <ProductReviews
            reviews={reviewWithMedia || []}
            product={product}
            themeColor={themeColor}
          />
        </div>
      </div>

      {/* SIZE FINDER QUIZ MODAL */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8">
            <button
              onClick={() => setIsQuizOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Step 0: Age */}
            {quizStep === 0 && (
              <div>
                <span className="text-xs font-bold tracking-wider text-[#7E4D77] uppercase">
                  Step 1 of 4
                </span>
                <h3 className="mt-1 mb-4 font-serif text-xl font-bold text-gray-900">
                  What is your age?
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("age", "under18")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Under 18 years old (Teen)
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("age", "18to30")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    18 – 30 years old
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("age", "above30")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Over 30 years old
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Birth */}
            {quizStep === 1 && (
              <div>
                <span className="text-xs font-bold tracking-wider text-[#7E4D77] uppercase">
                  Step 2 of 4
                </span>
                <h3 className="mt-1 mb-4 font-serif text-xl font-bold text-gray-900">
                  Have you given birth vaginally?
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("birth", "none")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    No / C-section delivery
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("birth", "vaginal")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Yes, given birth vaginally
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Flow */}
            {quizStep === 2 && (
              <div>
                <span className="text-xs font-bold tracking-wider text-[#7E4D77] uppercase">
                  Step 3 of 4
                </span>
                <h3 className="mt-1 mb-4 font-serif text-xl font-bold text-gray-900">
                  How heavy is your period flow?
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("flow", "light")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Light to Normal flow
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("flow", "heavy")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Heavy flow (Change pads frequently)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Cervix */}
            {quizStep === 3 && (
              <div>
                <span className="text-xs font-bold tracking-wider text-[#7E4D77] uppercase">
                  Step 4 of 4
                </span>
                <h3 className="mt-1 mb-4 font-serif text-xl font-bold text-gray-900">
                  What is your cervix height?
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleQuizAnswer("cervix", "medium")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Average or High Cervix
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("cervix", "low")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Low Cervix
                  </button>
                  <button
                    onClick={() => handleQuizAnswer("cervix", "unsure")}
                    className="w-full rounded-xl border border-gray-200 p-3.5 text-left text-sm font-medium transition-all hover:border-[#7E4D77] hover:bg-pink-50/50"
                  >
                    Unsure / First-time user
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Result */}
            {quizStep === 4 && quizResult && (
              <div className="py-2 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E6F0] text-[#7E4D77]">
                  <Sparkles className="h-8 w-8" />
                </div>
                <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">
                  PERFECT MATCH FOUND
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-gray-900">
                  We recommend:{" "}
                  {QUIZ_SIZES.find((s) => s.id === quizResult)?.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Based on your answers, the {quizResult.toUpperCase()} cup size
                  ({QUIZ_SIZES.find((s) => s.id === quizResult)?.cap}) provides
                  optimal seal, comfort, and leak protection.
                </p>

                <button
                  onClick={applyQuizResult}
                  className="mt-6 w-full rounded-xl bg-[#7E4D77] py-3 font-bold text-white transition-all hover:bg-[#683c62]"
                >
                  Select Size
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK QUESTION ANSWER MODAL */}
      {activeQuickQuestionKey && QUICK_QUESTIONS_DATA[activeQuickQuestionKey] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveQuickQuestionKey(null)}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="inline-block rounded-full bg-[#F3E6F0] px-3 py-1 text-[11px] font-bold tracking-wider text-[#7E4D77] uppercase">
              {QUICK_QUESTIONS_DATA[activeQuickQuestionKey].badge}
            </span>
            <h3 className="mt-2 font-serif text-2xl font-bold text-gray-900">
              {QUICK_QUESTIONS_DATA[activeQuickQuestionKey].title}
            </h3>
            <div className="mt-3 rounded-2xl bg-[#FAF9F5] border border-gray-100 p-4">
              <p className="font-serif text-sm font-semibold text-[#7E4D77]">
                {QUICK_QUESTIONS_DATA[activeQuickQuestionKey].shortAnswer}
              </p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-700 sm:text-sm">
              {QUICK_QUESTIONS_DATA[activeQuickQuestionKey].detailedAnswer}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const targetId = QUICK_QUESTIONS_DATA[activeQuickQuestionKey].sectionId;
                  setActiveQuickQuestionKey(null);
                  setTimeout(() => {
                    const el = document.getElementById(targetId);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex-1 cursor-pointer rounded-full bg-[#7E4D77] py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#683c62]"
              >
                Read Full Topic on Page ↓
              </button>
              <button
                onClick={() => setActiveQuickQuestionKey(null)}
                className="cursor-pointer rounded-full border border-gray-200 px-6 py-3 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Add Bar */}
      <div className="fixed right-0 bottom-[56px] left-0 z-40 flex items-center justify-between gap-3 border-t border-[#1A150F]/10 bg-white/95 p-3 shadow-lg backdrop-blur-md lg:hidden">
        <div>
          <span className="block text-[10px] font-bold text-[#7E4D77] uppercase">
            {activeVariant?.size || activeVariant?.name || "Ovy Cup"}
          </span>
          <b className="font-serif text-lg font-bold text-[#1A150F]">
            ₹{price * quantity}
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
                onClick={() => handleAddToCart(false)}
                disabled={isAdding}
                className="cursor-pointer rounded-full bg-[#7E4D77] px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#683c62] disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                disabled={isAdding}
                className="cursor-pointer rounded-full bg-[#141413] px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-black disabled:opacity-50"
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CoffeeIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}
