/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X, Plus, Check } from "lucide-react";
import BestsellingCard, {
  formatProductPrice,
  getProductNumericPrice,
} from "./BestSellingCard";
import { useCatalogStore } from "@/store/catalogStore";
import { addToCart } from "@/store/cartActions";
import { getImageUrl } from "@/lib/imageUrl";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  brand?: "ovy" | "loway" | string | null;
  buttonColor?: string;
  description?: string;
};

const OVY_PRESET_METADATA: Record<
  string,
  {
    badge: string;
    infoText: string;
    shortDesc?: string;
    overrideName?: string;
    overrideImage?: string;
  }
> = {
  "ovy-organic-sanitary-pads": {
    badge: "Bestseller",
    overrideName: "Ovy Organic Sanitary Pads",
    shortDesc: "Rash-free, organic, sized to your actual flow",
    infoText: "L, XL and XL+. 21 pads and 4 liners. · 3 sizes",
    overrideImage: "/products/pads.jpg",
  },
  "ovy-teen-starter-pack": {
    badge: "For first periods",
    overrideName: "Ovy Teen Kits",
    shortDesc: "Makes a first period calm instead of frightening",
    infoText: "Starter and Pro-Active packs · 2 kits",
    overrideImage: "/products/teen.jpg",
  },
  "menstrual-cup": {
    badge: "Reusable",
    overrideName: "Ovy Reusable Menstrual Cup",
    shortDesc: "One cup, years of periods, up to 12 hours at a time",
    infoText: "Teen XS, Medium and Large · 3 sizes, 4 options",
    overrideImage: "/products/cup.jpg",
  },
  "ovy-daily-panty-liners": {
    badge: "Daily Care",
    overrideName: "Ovy Daily Liners",
    shortDesc: "Keeps you fresh between periods. Not for period flow.",
    infoText: "Packs of 40, 60 and 80 · 3 packs",
    overrideImage: "/products/liners.jpg",
  },
};

const DEFAULT_OVY_PRODUCTS = [
  {
    id: "ovy-pads-def",
    name: "Ovy Organic Sanitary Pads",
    slug: "ovy-organic-sanitary-pads",
    description: "Rash-free, organic, sized to your actual flow",
    infoText: "L, XL and XL+. 21 pads and 4 liners. · 3 sizes",
    startingPrice: 378,
    badge: "Bestseller",
    image: "/products/pads.jpg",
    brand: "ovy",
  },
  {
    id: "ovy-teen-def",
    name: "Ovy Teen Kits",
    slug: "ovy-teen-starter-pack",
    description: "Makes a first period calm instead of frightening",
    infoText: "Starter and Pro-Active packs · 2 kits",
    startingPrice: 378,
    badge: "For first periods",
    image: "/products/teen.jpg",
    brand: "ovy",
  },
  {
    id: "ovy-cup-def",
    name: "Ovy Reusable Menstrual Cup",
    slug: "menstrual-cup",
    description: "One cup, years of periods, up to 12 hours at a time",
    infoText: "Teen XS, Medium and Large · 3 sizes, 4 options",
    startingPrice: 459,
    badge: "Reusable",
    image: "/products/cup.jpg",
    brand: "ovy",
  },
  {
    id: "ovy-liners-def",
    name: "Ovy Daily Liners",
    slug: "ovy-daily-panty-liners",
    description: "Keeps you fresh between periods. Not for period flow.",
    infoText: "Packs of 40, 60 and 80 · 3 packs",
    startingPrice: 269,
    badge: "Daily Care",
    image: "/products/liners.jpg",
    brand: "ovy",
  },
];

function ComingSoonCard() {
  return (
    <div className="group border-gray-150 relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Top Media Container (Lavender diagonal stripe background with Coming soon text) */}
      <div
        className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#F5EEF6]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 10px, transparent 10px, transparent 20px)`,
        }}
      >
        <span className="font-caveat -rotate-6 transform text-2xl tracking-wide text-[#905D89] sm:text-4xl">
          Coming soon
        </span>
      </div>

      {/* Details & Info Section */}
      <div className="flex grow flex-col justify-between space-y-2 bg-white p-2.5 sm:space-y-3 sm:p-4">
        <div className="space-y-1 sm:space-y-1.5">
          <h3 className="line-clamp-2 font-serif text-xs leading-snug font-bold text-gray-900 sm:text-base md:text-lg">
            Ovy Super Slim Period Panties
          </h3>

          <p className="line-clamp-2 text-[10px] leading-snug font-normal text-gray-600 sm:text-xs md:text-sm">
            360° protection for 10 to 12 hours, worn like underwear
          </p>

          <p className="pt-0.5 text-[10px] font-normal text-gray-500 sm:text-xs">
            M-XL and XXL-XXXL. Disposable.
          </p>
        </div>

        {/* Footer Action / Status Row */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2">
          <span className="text-[10px] font-normal text-gray-500 sm:text-xs">
            Launching soon
          </span>

          <span className="rounded-full bg-[#EFEAEF] px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-2xs sm:px-4 sm:py-1.5 sm:text-xs">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BestsellingProducts({
  title = "The ones everyone comes back for.",
  description = "Across both ranges. Between them they cover most of what a month and a journey can throw at you.",
  brand = null,
  buttonColor = "#016271",
}: Props) {
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [quickViewVariants, setQuickViewVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);
  const [modalAdding, setModalAdding] = useState(false);
  const [modalAdded, setModalAdded] = useState(false);

  const rawProducts = useCatalogStore((state) =>
    state.categories ? state.products : [],
  );

  const isOvySection =
    brand === "ovy" || title === "Your whole cycle, covered.";

  // Section details
  const sectionBadge = isOvySection ? "OVY" : "START HERE";
  const sectionTitle = isOvySection ? "Your whole cycle, covered." : title;
  const sectionDesc = isOvySection
    ? "Organic, certified toxin-free, and sized to a real cycle rather than an average one."
    : description;
  const buttonText = isOvySection ? "All Ovy products" : "Shop all";
  const buttonHref = isOvySection ? "/ovy" : "/shop";

  // Prepare products array
  let displayProducts: any[] = [];

  if (isOvySection) {
    const ovyCatalog = rawProducts.filter((p) => p.brand === "ovy");
    const mergedMap = new Map<string, any>();

    ovyCatalog.forEach((p) => {
      const slugKey = String(p.slug || "").toLowerCase();
      const meta = OVY_PRESET_METADATA[slugKey];
      mergedMap.set(slugKey, {
        ...p,
        name: meta?.overrideName || p.name,
        description: meta?.shortDesc || p.description,
        badge: meta?.badge || (p as any).badge || "Ovy Care",
        infoText: meta?.infoText,
        image:
          meta?.overrideImage ||
          p.image ||
          p.bannerImage ||
          "/products/pads.jpg",
      });
    });

    // Fill from fallback if any items missing
    DEFAULT_OVY_PRODUCTS.forEach((def) => {
      const slugKey = def.slug.toLowerCase();
      if (!mergedMap.has(slugKey)) {
        mergedMap.set(slugKey, def);
      }
    });

    displayProducts = Array.from(mergedMap.values()).slice(0, 4);
  } else if (brand) {
    displayProducts = rawProducts.filter((p) => p.brand === brand).slice(0, 5);
  } else {
    displayProducts = rawProducts.slice(0, 5);
  }

  const getProductDetails = async (product: any) => {
    if (product.productVariants?.length || product.variants?.length) {
      return product;
    }

    const response = await fetch(
      `/api/catalog/products/${encodeURIComponent(product.slug)}`,
    );
    if (!response.ok) throw new Error("Unable to load product variants");

    const payload = await response.json();
    return payload.product;
  };

  const handleAddToCart = async (product: any) => {
    const detailedProduct = await getProductDetails(product);
    const variant =
      product.selectedVariant ||
      detailedProduct.productVariants?.[0] ||
      detailedProduct.prodcutVarientBoxRes?.[0] ||
      detailedProduct.variants?.[0];

    const variants =
      detailedProduct.productVariants ||
      detailedProduct.prodcutVarientBoxRes ||
      detailedProduct.variants ||
      [];

    if (variants.length > 1) {
      setQuickViewProduct(detailedProduct);
      setQuickViewVariants(variants);
      setSelectedVariant(variant);
      return false;
    }

    return addProductVariantToCart(detailedProduct, variant);
  };

  const addProductVariantToCart = async (product: any, variant: any) => {
    const priceNum = Number(variant?.price ?? product.price ?? product.basePrice);

    return addToCart({
      productId: product.id,
      productVariantId: variant?.id,
      sku: variant?.sku,
      slug: product.slug || "",
      title: variant?.name || product.name || "Product",
      image: getImageUrl(
        product.image || product.bannerImage || "/product.png",
      ),
      price: Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0,
      quantity: 1,
      isQuantityChangable: true,
    });
  };

  const handleModalAdd = async () => {
    if (!quickViewProduct || modalAdding) return;
    setModalAdding(true);
    await addProductVariantToCart(
      quickViewProduct,
      selectedVariant || quickViewVariants[0],
    );
    setModalAdding(false);
    setModalAdded(true);
    setTimeout(() => setModalAdded(false), 2000);
  };

  const openQuickView = async (product: any) => {
    setLoadingProductDetails(true);
    try {
      const detailedProduct = await getProductDetails(product);
      const variants =
        detailedProduct.productVariants ||
        detailedProduct.prodcutVarientBoxRes ||
        detailedProduct.variants ||
        [];
      setQuickViewProduct(detailedProduct);
      setQuickViewVariants(variants);
      setSelectedVariant(variants[0]);
    } catch (error) {
      console.error("Unable to load product details:", error);
      setQuickViewProduct(product);
      setQuickViewVariants([]);
      setSelectedVariant(null);
    } finally {
      setLoadingProductDetails(false);
    }
  };

  const getProductHighlights = (prod: any) => {
    if (prod?.highlights && Array.isArray(prod.highlights)) {
      return prod.highlights;
    }
    const s = String(prod?.slug || "").toLowerCase();
    if (s.includes("funnel")) {
      return [
        "Stand, go, touch nothing — clothes just moved aside",
        "Reusable with its own cotton carry pouch",
        "Safe through pregnancy: no squatting, no dirty seat",
      ];
    }
    if (s.includes("cup")) {
      return [
        "100% medical-grade silicone, latex & BPA free",
        "Up to 12 hours protection between changes",
        "Reusable for years replacing thousands of disposables",
      ];
    }
    if (s.includes("puke") || s.includes("bag")) {
      return [
        "Turns urine or vomit to gel in 60 seconds",
        "Holds up to 700ml, odour locked and leak-proof",
        "For motion sickness, pregnancy nausea & travel",
      ];
    }
    if (s.includes("seat")) {
      return [
        "Biodegradable paper seat covers for Western loos",
        "Ideal for school, office, train, airport & travel",
        "Slips easily into any handbag or pocket",
      ];
    }
    return [
      "Organic top sheet, certified toxin-free",
      "pH-balanced & dermatologically tested",
      "Ships within 24 hours in plain packaging",
    ];
  };

  return (
    <section className="w-full border-b border-gray-100 bg-[#FAF8F5] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-2 text-left sm:space-y-3">
            <span className="text-[11px] font-bold tracking-widest text-[#016271] uppercase sm:text-xs">
              {sectionBadge}
            </span>
            <h2 className="font-serif text-2xl leading-tight font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              {sectionTitle}
            </h2>
            <p className="text-xs leading-relaxed font-normal text-gray-600 sm:text-base md:text-lg">
              {sectionDesc}
            </p>
          </div>

          {/* Top Right Shop Button */}
          <div className="shrink-0">
            <Link href={buttonHref}>
              <Button
                variant="outline"
                className="flex cursor-pointer items-center gap-2 rounded-full border-[#016271] px-4 py-2 text-xs font-semibold text-[#016271] shadow-xs transition-all duration-300 hover:bg-[#016271] hover:text-white sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {buttonText}
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 5 Cards Grid: 2 columns on Mobile, 3 on Tablet, 5 on Desktop */}
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {displayProducts.map((product: any, idx: number) => (
            <BestsellingCard
              key={product.id || idx}
              product={product}
              index={idx}
              isFifthMobileCard={idx === 4}
              buttonColor={buttonColor}
              onQuickView={openQuickView}
              onAddToCart={(p) => handleAddToCart(p)}
            />
          ))}

          {/* 5th Slot: Coming Soon Card for Ovy range */}
          {isOvySection && <ComingSoonCard />}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setQuickViewProduct(null)}
          />

          <div className="relative z-10 grid w-full max-w-2xl grid-cols-1 items-center gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:grid-cols-12 sm:p-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F5EEF0] sm:col-span-5">
              <Image
                unoptimized
                src={getImageUrl(
                  quickViewProduct.image ||
                    quickViewProduct.bannerImage ||
                    "/product.png",
                )}
                alt={quickViewProduct.name}
                fill
                className="h-full w-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="flex flex-col space-y-3.5 text-left sm:col-span-7">
              <span className="w-fit rounded-full bg-[#016271]/10 px-3 py-1 text-xs font-bold text-[#016271]">
                {quickViewProduct.badge || "Bestseller"}
              </span>

              <h3 className="font-serif text-2xl font-bold text-gray-900">
                {quickViewProduct.name}
              </h3>

              <p className="text-sm leading-relaxed font-normal text-gray-600">
                {quickViewProduct.description ||
                  "Safe, organic and dermatologically tested feminine hygiene care."}
              </p>

              {/* Highlights */}
              <ul className="space-y-1.5 border-y border-gray-100 py-2.5">
                {getProductHighlights(quickViewProduct).map(
                  (item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs font-medium text-gray-700 sm:text-sm"
                    >
                      <Check className="h-4 w-4 shrink-0 text-[#016271]" />
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>

              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-xs font-normal text-gray-500">from</span>
                <span className="text-2xl font-bold text-gray-900">
                  {selectedVariant
                    ? `₹${Number(selectedVariant.price || 0)}`
                    : formatProductPrice(quickViewProduct)}
                </span>
              </div>

              {quickViewVariants.length > 1 && (
                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
                  Choose variant
                  <select
                    value={selectedVariant?.id || ""}
                    onChange={(event) =>
                      setSelectedVariant(
                        quickViewVariants.find(
                          (variant) => variant.id === event.target.value,
                        ),
                      )
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#016271]"
                  >
                    {quickViewVariants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name || variant.size || "Variant"} - ₹
                        {Number(variant.price || 0)}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleModalAdd}
                  disabled={modalAdding}
                  className={`flex w-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md transition-all sm:w-auto ${
                    modalAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#016271] text-white hover:scale-[1.02] hover:bg-[#014d59]"
                  }`}
                >
                  {modalAdded ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>
                        {loadingProductDetails ? "Loading..." : "Add to cart"}
                      </span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product-detail/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full py-2 text-center text-xs font-semibold text-[#016271] hover:underline sm:w-auto sm:text-sm"
                >
                  View full details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
