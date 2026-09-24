/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from "../../../../components/common/Product-detail/product";
import TrustBadges from "../../../../components/common/Product-detail/trustbadges";
import AboutProduct from "../../../../components/common/Product-detail/aboutproduct";
import ProductReviews from "../../../../components/common/Product-detail/productreview";

import { getFullProduct, getProductReviews } from "@/helper";
import { BrandProductColors } from "@/const/globalconst";

export default async function Page({ params }: any) {
  const { productName, slug } = await params;
  const themeColor =
    BrandProductColors[slug as keyof typeof BrandProductColors] || "#000";
  const product = await getFullProduct(productName);
  const reviewWithMedia = await getProductReviews(productName);

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }
  return (
    <>
      {/* constrained content */}
      <div className="mx-auto max-w-7xl">
        <div className="px-4 md:px-10">
          <Product
            // categoryName={catetoryName}
            // variants={product}
            productInfo={product}
            themeColor={themeColor}
          />
          <TrustBadges themeColor={themeColor} />
          <AboutProduct variant={product} themeColor={themeColor} />
          <ProductReviews reviews={reviewWithMedia} />
        </div>
      </div>
    </>
  );
}
