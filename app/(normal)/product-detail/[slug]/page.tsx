/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from "../../../components/common/Product-detail/product";
import TrustBadges from "../../../components/common/Product-detail/trustbadges";
import AboutProduct from "../../../components/common/Product-detail/aboutproduct";
import ProductReviews from "../../../components/common/Product-detail/productreview";
import { getProductReviews } from "@/helper";
import { getFullProductDetails } from "@/helper/product/action";
import {
  lowayProductDetailsPage,
  ovyProductDetailsPage,
} from "@/const/globalconst";
import SeatCoversPageClient from "@/app/components/common/Product-detail/SeatCoversPageClient";
import MenstrualCupPageClient from "@/app/components/common/Product-detail/MenstrualCupPageClient";
import { loowayToiletSeatCovers, ovyCup } from "@/const/productsContent";

export default async function Page({ params }: any) {
  const { slug } = await params;

  const product = await getFullProductDetails(slug);
  const reviewWithMedia = await getProductReviews(slug);
  // const catetoryName = similarProducts[0]?.category;

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
