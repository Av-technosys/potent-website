/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from "../../../components/common/Product-detail/product";
import TrustBadges from "../../../components/common/Product-detail/trustbadges";
import AboutProduct from "../../../components/common/Product-detail/aboutproduct";
import ProductReviews from "../../../components/common/Product-detail/productreview";
import { getProductReviews } from "@/helper";
import { getFullProductDetails, getProductSimilarProducts } from "@/helper/product/action";
import {
  lowayProductDetailsPage,
  ovyProductDetailsPage,
} from "@/const/globalconst";
import SeatCoversPageClient from "@/app/components/common/Product-detail/SeatCoversPageClient";
import MenstrualCupPageClient from "@/app/components/common/Product-detail/MenstrualCupPageClient";
import OvyTeenPageClient from "@/app/components/common/Product-detail/OvyTeenPageClient";
import PeePukeBagsPageClient from "@/app/components/common/Product-detail/PeePukeBagsPageClient";
import PeeFunnelPageClient from "@/app/components/common/Product-detail/PeeFunnelPageClient";
import ProductFaqSection from "@/app/components/common/Product-detail/ProductFaqSection";
import {
  loowayPeePuke,
  loowayPeeFunnel,
  loowayToiletSeatCovers,
  ovyCup,
  ovyTeen,
  PRODUCTS_STATIC_CONTENT,
} from "@/const/productsContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveCanonicalSlug(s: string): string {
  const lower = (s || "").toLowerCase();
  if (
    lower === "looway-pee-funnel" ||
    lower === "pee-funnel" ||
    lower === "looway-funnel" ||
    lower === "looway-reusable-female-pee-funnel"
  ) {
    return "looway-pee-funnel";
  }
  if (
    lower === "looway-pee-puke" ||
    lower === "looway-pee-puke-bags" ||
    lower === "pee-puke-bags" ||
    lower === "looway-pee-and-puke-bags" ||
    lower === "pee-puke"
  ) {
    return "looway-pee-puke";
  }
  if (lower === "looway-toilet-seat-covers" || lower === "toilet-seat-covers") {
    return "looway-toilet-seat-covers";
  }
  if (
    lower === "ovy-cup" ||
    lower === "menstrual-cup" ||
    lower === "ovy-reusable-menstrual-cup"
  ) {
    return "ovy-cup";
  }
  if (
    lower === "ovy-teen" ||
    lower === "ovy-teen-pads" ||
    lower === "ovy-teen-starter-pack" ||
    lower === "ovy-organic-teen-sanitary-pads"
  ) {
    return "ovy-teen";
  }
  if (lower === "ovy-pads" || lower === "sanitary-pads") {
    return "ovy-pads";
  }
  if (lower === "ovy-liners" || lower === "panty-liners") {
    return "ovy-liners";
  }
  if (lower === "ovy-panty" || lower === "period-panty") {
    return "ovy-panty";
  }
  return s;
}

export default async function Page({ params }: any) {
  const { slug } = await params;
  const canonicalSlug = resolveCanonicalSlug(slug);

  const product = await getFullProductDetails(canonicalSlug);
  const reviewWithMedia = await getProductReviews(canonicalSlug);
  const similarProducts = await getProductSimilarProducts(canonicalSlug);

  if (canonicalSlug === "looway-pee-funnel") {
    return (
      <PeeFunnelPageClient
        product={
          product || {
            slug: "looway-pee-funnel",
            name: "Looway Reusable Female Pee Funnel",
          }
        }
        reviewWithMedia={reviewWithMedia}
        content={loowayPeeFunnel}
      />
    );
  }

  if (canonicalSlug === "looway-pee-puke") {
    return (
      <PeePukeBagsPageClient
        product={
          product || {
            slug: "looway-pee-puke",
            name: "Looway Pee & Puke Bags — Disposable Urine & Vomit Bags",
          }
        }
        reviewWithMedia={reviewWithMedia}
        content={loowayPeePuke}
      />
    );
  }

  if (canonicalSlug === "looway-toilet-seat-covers") {
    return (
      <SeatCoversPageClient
        product={product || { slug: "looway-toilet-seat-covers", name: "Looway Disposable Toilet Seat Covers" }}
        reviewWithMedia={reviewWithMedia}
        content={loowayToiletSeatCovers}
      />
    );
  }

  if (canonicalSlug === "ovy-cup") {
    return (
      <MenstrualCupPageClient
        product={product || { slug: "ovy-cup", name: "Ovy Reusable Menstrual Cup" }}
        reviewWithMedia={reviewWithMedia}
        content={ovyCup}
      />
    );
  }

  if (canonicalSlug === "ovy-teen") {
    const routineSlugs = ["ovy-cup", "ovy-pads", "ovy-liners", "looway-toilet-seat-covers"];
    const routineEntries = await Promise.all(
      routineSlugs.map(async (rSlug) => {
        try {
          return [rSlug, await getFullProductDetails(rSlug)] as const;
        } catch {
          return [rSlug, null] as const;
        }
      })
    );
    const ovyProductsMap = Object.fromEntries(routineEntries);

    return (
      <OvyTeenPageClient
        product={product || { slug: "ovy-teen", name: "Ovy Organic Soft Sanitary Pads — Teen" }}
        reviewWithMedia={reviewWithMedia}
        similarProducts={similarProducts || []}
        ovyProductsMap={ovyProductsMap}
        content={ovyTeen}
      />
    );
  }

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }

  const themeColor =
    product.brand == "loway" ? lowayProductDetailsPage : ovyProductDetailsPage;

  const productContent =
    PRODUCTS_STATIC_CONTENT[slug] ||
    PRODUCTS_STATIC_CONTENT[product.slug] ||
    null;
  const faqTheme = product.brand === "loway" ? "looway" : "ovy";

  return (
    <div className="container">
      <div className="">
        <Product
          // categoryName={catetoryName}
          // variants={product}
          productInfo={product}
          themeColor={themeColor}
        />
        <TrustBadges themeColor={themeColor} />
        <AboutProduct variant={product} themeColor={themeColor} />
        <ProductReviews
          reviews={reviewWithMedia}
          product={product}
          themeColor={themeColor}
        />
        <ProductFaqSection
          theme={faqTheme}
          faqs={product.productFaqRes}
          content={productContent}
        />
      </div>
    </div>
  );
}
