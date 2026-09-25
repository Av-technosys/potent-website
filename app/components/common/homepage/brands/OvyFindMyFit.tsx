"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, RefreshCw, Check } from "lucide-react";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import {
  findOvyVariant,
  getOvyProductId,
  getOvyVariantId,
  getOvyVariantPrice,
} from "./ovyProductPricing";

interface QuizOption {
  id: string;
  title: string;
  subtitle: string;
  nextStep?: number;
  resultProduct?: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

const STEP_1_OPTIONS: QuizOption[] = [
  {
    id: "my-period",
    title: "My period",
    subtitle: "Pads or a cup",
    nextStep: 2,
  },
  {
    id: "days-between",
    title: "The days in between",
    subtitle: "Discharge, spotting, light leaks",
    resultProduct: {
      id: "ovy-liners-fit",
      slug: "ovy-daily-panty-liners",
      name: "Ovy Daily Panty Liners",
      description: "Ultra-thin 1mm daily liners to stay fresh between periods.",
      price: 269,
      image: "/products/liners.jpg",
    },
  },
  {
    id: "first-period",
    title: "A first period",
    subtitle: "Buying for a teen",
    resultProduct: {
      id: "ovy-teen-fit",
      slug: "ovy-teen-starter-pack",
      name: "Ovy Teen Starter Kit",
      description: "Two pad sizes, 4 liners, and a disposal bag for her first period.",
      price: 378,
      image: "/products/teen.jpg",
    },
  },
];

const STEP_2_OPTIONS: QuizOption[] = [
  {
    id: "regular-flow",
    title: "Light to Regular Flow",
    subtitle: "Everyday pads for work, school & commute",
    resultProduct: {
      id: "ovy-pads-regular",
      slug: "ovy-organic-sanitary-pads",
      name: "Ovy Organic Sanitary Pads (L & XL)",
      description: "Rash-free organic cotton pads sized to your actual flow.",
      price: 378,
      image: "/products/pads-l.jpg",
    },
  },
  {
    id: "heavy-flow",
    title: "Heavy Flow & Nights",
    subtitle: "Extra coverage for heavy days & overnight sleeping",
    resultProduct: {
      id: "ovy-pads-heavy",
      slug: "ovy-organic-sanitary-pads",
      name: "Ovy XL+ Night Heavy Pads",
      description: "320mm XL+ extra wide back coverage for zero night leaks.",
      price: 398,
      image: "/products/pads-xlplus.jpg",
    },
  },
  {
    id: "reusable-cup",
    title: "Prefer Reusable Cup",
    subtitle: "12-hour freedom for sport, swim & long days",
    resultProduct: {
      id: "ovy-cup-fit",
      slug: "menstrual-cup",
      name: "Ovy Reusable Menstrual Cup",
      description: "100% medical-grade silicone cup that lasts for years.",
      price: 459,
      image: "/products/cup-rbw.jpg",
    },
  },
];

export function OvyFindMyFit({ productsBySlug }: { productsBySlug: Record<string, any> }) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedProductResult, setSelectedProductResult] = useState<QuizOption["resultProduct"] | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleSelectOption = (option: QuizOption) => {
    if (option.nextStep) {
      setCurrentStep(option.nextStep);
    } else if (option.resultProduct) {
      setSelectedProductResult(option.resultProduct);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedProductResult(null);
  };

  const handleAddToCart = async () => {
    if (!selectedProductResult) return;

    const fullProduct = productsBySlug[selectedProductResult.slug];
    if (!fullProduct) throw new Error("Product details are unavailable");

    setIsAdding(true);

    try {
      const variant = findOvyVariant(fullProduct, selectedProductResult.name);
      const price = getOvyVariantPrice(variant) || Number(selectedProductResult.price);

      const added = await addToCart({
        productId: getOvyProductId(fullProduct) || selectedProductResult.id,
        productVariantId: getOvyVariantId(variant),
        sku: variant?.sku,
        slug: selectedProductResult.slug,
        title: selectedProductResult.name,
        image: getImageUrl(selectedProductResult.image),
        price,
        quantity: 1,
        isQuantityChangable: true,
      });

      if (added === false) return;
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="w-full bg-[#F3EBF9] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Text */}
          <div className="md:col-span-5 text-left">
            <span className="text-xs font-bold tracking-widest text-[#C42B5B] uppercase block mb-2">
              FIND MY FIT
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1915] leading-tight">
              Three taps. The right pack.
            </h2>
            <p className="text-xs sm:text-base text-[#5C524D] mt-3 leading-relaxed">
              Answer for yourself, or for someone you are buying for.
            </p>
          </div>

          {/* Right Column: Quiz White Card Box */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-purple-100/80 w-full transition-all duration-300">
              
              {!selectedProductResult ? (
                <>
                  {/* Step Header */}
                  <div className="text-[11px] font-bold tracking-widest text-[#C42B5B] uppercase mb-1">
                    {currentStep === 1 ? "QUESTION 1 OF 2" : "QUESTION 2 OF 2"}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#1F1915] mb-5">
                    {currentStep === 1 ? "What is it for?" : "What flow do you usually have?"}
                  </h3>

                  {/* Step 1 Options */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {STEP_1_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(opt)}
                          className="text-left rounded-2xl bg-[#F6EFF8] hover:bg-[#EFE3F3] p-4 transition-all duration-200 border border-transparent hover:border-[#602E55] cursor-pointer group"
                        >
                          <div className="font-bold text-sm text-[#1F1915] group-hover:text-[#602E55]">
                            {opt.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {opt.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 2 Options */}
                  {currentStep === 2 && (
                    <div className="flex flex-col space-y-3">
                      {STEP_2_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(opt)}
                          className="text-left rounded-2xl bg-[#F6EFF8] hover:bg-[#EFE3F3] p-4 transition-all duration-200 border border-transparent hover:border-[#602E55] cursor-pointer group"
                        >
                          <div className="font-bold text-sm text-[#1F1915] group-hover:text-[#602E55]">
                            {opt.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {opt.subtitle}
                          </div>
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-semibold text-gray-500 hover:text-[#602E55] mt-2 inline-flex items-center gap-1 self-start cursor-pointer"
                      >
                        ← Back to Question 1
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Result View */
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      ✓ YOUR PERFECT MATCH
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-xs text-gray-500 hover:text-[#602E55] flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Start over
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mt-4">
                    <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-purple-50 border border-gray-100">
                      <Image
                        src={selectedProductResult.image}
                        alt={selectedProductResult.name}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>

                    <div className="grow">
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1F1915]">
                        {selectedProductResult.name}
                      </h4>
                      <p className="text-xs text-[#5C524D] mt-1 leading-relaxed">
                        {selectedProductResult.description}
                      </p>
                      <div className="font-serif text-xl font-bold text-[#1F1915] mt-2">
                        ₹{selectedProductResult.price}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500 font-medium">
                      Ships within 24 hours
                    </span>

                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#602E55] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-[#4E2445] disabled:opacity-50"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>
                        {isAdding ? "Adding..." : isAdded ? "Added! ✓" : "+ Add to bag"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
