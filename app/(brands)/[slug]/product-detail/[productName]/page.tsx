/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from "../../../../components/common/Product-detail/product";
import TrustBadges from "../../../../components/common/Product-detail/trustbadges";
import AboutProduct from "../../../../components/common/Product-detail/aboutproduct";
import ProductReviews from "../../../../components/common/Product-detail/productreview";
import ProductFaqSection from "@/app/components/common/Product-detail/ProductFaqSection";
import { PRODUCTS_STATIC_CONTENT } from "@/const/productsContent";

import { getFullProduct, getProductReviews } from "@/helper";
import { BrandProductColors } from "@/const/globalconst";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: any) {
  const { productName, slug } = await params;
  const themeColor =
    BrandProductColors[slug as keyof typeof BrandProductColors] || "#000";
  const product = await getFullProduct(productName);
  const reviewWithMedia = await getProductReviews(productName);

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }
  const productContent =
    PRODUCTS_STATIC_CONTENT[productName] ||
    PRODUCTS_STATIC_CONTENT[product.slug] ||
    null;
  const faqTheme = slug === "loway" || product.brand === "loway" ? "looway" : "ovy";

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
    </>
  );
}
