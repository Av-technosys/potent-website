import { BlogSection } from "@/app/components/common/homepage/Blogs";
import { InstagramFeed } from "@/app/components/common/homepage/InstaFeed";
import { Newsletter } from "@/app/components/common/homepage/NewsLetter";
import { OurStory } from "@/app/components/common/homepage/OurStory";
import { ProductCategories } from "@/app/components/common/homepage/ProductCategories";
import { Testimonials } from "@/app/components/common/homepage/Reviews";
import StoryTruth from "@/app/components/common/homepage/StoryTruth";
import { BrandHero } from "@/app/components/common/homepage/brands/BrandsHero";
import { BrandProductsSection } from "@/app/components/common/homepage/brands/BrandProductsSection";
import { BrandStats } from "@/app/components/common/homepage/brands/BrandStats";
import { BrandWhyChoose } from "@/app/components/common/homepage/brands/BrandWhyChoose";
import { YatraKitPromo } from "@/app/components/common/homepage/YatraKitPromo";
import { brandDataMap } from "@/const/globalconst";
import BestsellingProducts from "@/app/components/common/homepage/BestSellingProduct";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function LowayPage() {
  const data = brandDataMap.loway;
  const [
    shopProducts,
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
      <BrandHero {...data.hero} />

      <YatraKitPromo />
      <BestsellingProducts
        description="Discover the latest additions to our premium hygiene collection, thoughtfully designed for everyday comfort, care, and confidence."
        title="Best Selling Products"
        brand={"loway"}
        buttonColor="#016271"
      />

      <div className="mb-12 w-full bg-[#F8F6F1] py-12">
        <div className="mx-auto h-auto w-full max-w-6xl px-4">
          <Image
            src={
              "https://dw0n4qiceose7.cloudfront.net/website-images/peefunnerlooway.png"
            }
            height={800}
            width={1200}
            className="h-auto w-full object-contain"
            alt="looway banner"
          />
        </div>
      </div>

      <StoryTruth {...story.props} />
      <OurStory {...ourStory.props} />

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
