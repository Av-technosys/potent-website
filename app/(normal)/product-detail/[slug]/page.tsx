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
import { loowayPeePuke, loowayPeeFunnel, loowayToiletSeatCovers, ovyCup, ovyTeen } from "@/const/productsContent";

export default async function Page({ params }: any) {
  const { slug } = await params;

  

  const product = await getFullProductDetails(slug);
  const reviewWithMedia = await getProductReviews(slug);
  const similarProducts = await getProductSimilarProducts(slug);
  

  if (
    slug === "looway-pee-funnel" ||
    slug === "pee-funnel" ||
    slug === "looway-funnel" ||
    slug === "looway-reusable-female-pee-funnel"
  ) {
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

  if (
    slug === "looway-pee-puke" ||
    slug === "looway-pee-puke-bags" ||
    slug === "pee-puke-bags" ||
    slug === "looway-pee-and-puke-bags" ||
    slug === "pee-puke"
  ) {
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

  if (slug === "looway-toilet-seat-covers" || slug === "toilet-seat-covers") {
    return (
      <SeatCoversPageClient
        product={product || { slug: "looway-toilet-seat-covers", name: "Looway Disposable Toilet Seat Covers" }}
        reviewWithMedia={reviewWithMedia}
        content={loowayToiletSeatCovers}
      />
    );
  }

  if (slug === "ovy-cup" || slug === "menstrual-cup" || slug === "ovy-reusable-menstrual-cup") {
    return (
      <MenstrualCupPageClient
        product={product || { slug: "ovy-cup", name: "Ovy Reusable Menstrual Cup" }}
        reviewWithMedia={reviewWithMedia}
        content={ovyCup}
      />
    );
  }

  if (
    slug === "ovy-teen" ||
    slug === "ovy-teen-pads" ||
    slug === "ovy-teen-starter-pack" ||
    slug === "ovy-organic-teen-sanitary-pads"
  ) {
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
      </div>
    </div>
  );
}
