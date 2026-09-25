import Image from "next/image";
import { BlogSection } from "@/app/components/common/homepage/Blogs";
import { InstagramFeed } from "@/app/components/common/homepage/InstaFeed";
import { Newsletter } from "@/app/components/common/homepage/NewsLetter";
import { OurStory } from "@/app/components/common/homepage/OurStory";
import { ProductCategories } from "@/app/components/common/homepage/ProductCategories";
import { Testimonials } from "@/app/components/common/homepage/Reviews";
import StoryTruth from "@/app/components/common/homepage/StoryTruth";
import { OvyHero } from "@/app/components/common/homepage/brands/OvyHero";
import { OvyShopSection } from "@/app/components/common/homepage/brands/OvyShopSection";
import { OvyShopByMoment } from "@/app/components/common/homepage/brands/OvyShopByMoment";
import { OvyFindMyFit } from "@/app/components/common/homepage/brands/OvyFindMyFit";
import { BrandProductsSection } from "@/app/components/common/homepage/brands/BrandProductsSection";
import { BrandStats } from "@/app/components/common/homepage/brands/BrandStats";
import { BrandWhyChoose } from "@/app/components/common/homepage/brands/BrandWhyChoose";
import { brandDataMap } from "@/const/globalconst";
import BestsellingProducts from "@/app/components/common/homepage/BestSellingProduct";
import { getFullProductDetails } from "@/helper/product/action";

export const dynamic = "force-dynamic";

export default async function OvyPage() {
  const data = brandDataMap.ovy;
  const productSlugs = [
    "ovy-organic-sanitary-pads",
    "ovy-teen-starter-pack",
    "menstrual-cup",
    "ovy-daily-panty-liners",
  ];
  const productEntries = await Promise.all(
    productSlugs.map(async (slug) => {
      try {
        return [slug, await getFullProductDetails(slug)] as const;
      } catch {
        return [slug, null] as const;
      }
    }),
  );
  const productsBySlug = Object.fromEntries(productEntries);
  const [
    shopProducts,
    bannerImage,
    story,
    bestSelling,
    ourStory,
    newArrivals,
    stats,
    brandWhy,
    instagram,
    testimonials,
    ,
    newsletter,
  ] = data.sections as any[];

  return (
    <main style={{ backgroundColor: data["bg-color"] }}>
      <OvyHero />
      <OvyShopSection productsBySlug={productsBySlug} />
      <OvyShopByMoment productsBySlug={productsBySlug} />
      <OvyFindMyFit productsBySlug={productsBySlug} />

      <div className="w-full bg-[#FFF4F9] py-12 mb-12">
        <div className="w-full h-auto max-w-6xl px-4 mx-auto">
          <Image
            src={bannerImage.props.image}
            height={800}
            width={1200}
            className="w-full h-auto object-contain"
            alt="Ovy banner"
          />
        </div>
      </div>

      <StoryTruth {...story.props} />
      <BestsellingProducts
        description="Designed for growing teens, our menstrual hygiene range offers gentle protection, breathable comfort, and reliable leak security. Feel confident, fresh, and supported through every stage of your cycle."
        title="Teen Hygiene Products"
        brand={"ovy"}
        buttonColor="#AF71A7"
      />
      {/* <BrandProductsSection
        {...bestSelling.props}
        productBrand="ovy"
        buttonColor="#AF71A7"
      /> */}
      <OurStory {...ourStory.props} />
      {/* <BrandProductsSection
        {...newArrivals.props}
        productBrand="ovy"
        buttonColor="#AF71A7"
      /> */}
      <BrandStats {...stats.props} />
      <BrandWhyChoose {...brandWhy.props} />
      <InstagramFeed {...instagram.props} />
      <Testimonials {...testimonials.props} />
      <ProductCategories />
      <Newsletter {...newsletter.props} />
      <BlogSection />
    </main>
  );
}
