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
import { OvySizedToFlow } from "@/app/components/common/homepage/brands/OvySizedToFlow";
import { OvySixProofPoints } from "@/app/components/common/homepage/brands/OvySixProofPoints";
import { OvySideBySideComparison } from "@/app/components/common/homepage/brands/OvySideBySideComparison";
import { OvyUpCloseSection } from "@/app/components/common/homepage/brands/OvyUpCloseSection";
import AboutStory from "@/app/components/common/homepage/AboutStory";
import { CycleSync } from "@/app/components/common/homepage/CycleSync";
import { PadSharedImpact } from "@/app/components/common/homepage/PadSharedImpact";
import { OvyFAQ } from "@/app/components/common/homepage/brands/OvyFAQ";
import { OvyPeriodSchool } from "@/app/components/common/homepage/brands/OvyPeriodSchool";
import { OvyComingNext } from "@/app/components/common/homepage/brands/OvyComingNext";
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
    "ovy-pads",
    "ovy-teen",
    "ovy-cup",
    "ovy-liners",
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
  const fetchedProducts = Object.fromEntries(productEntries);
  const productsBySlug = {
    ...fetchedProducts,
    "ovy-organic-sanitary-pads": fetchedProducts["ovy-pads"],
    "ovy-teen-starter-pack": fetchedProducts["ovy-teen"],
    "menstrual-cup": fetchedProducts["ovy-cup"],
    "ovy-daily-panty-liners": fetchedProducts["ovy-liners"],
  };
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
      <OvySizedToFlow />
      <OvySixProofPoints />
      <OvySideBySideComparison />
      <OvyUpCloseSection productsBySlug={productsBySlug} />
<StoryTruth {...story.props} />

      {/* 1. Build Your Box Section (AboutStory) */}
      <AboutStory
        bgColor="#FAF5E8"
        kickerColor="#602E55"
        accentColor="#602E55"
        buttonColor="#602E55"
        imageSrc="/products/pads-l.jpg"
        hideOnMobile={true}
      />

      {/* 2. Cycle-Sync Section (CycleSync) */}
     

      {/* 3. Give Back Impact Section (PadSharedImpact) */}
     


         
     
       <CycleSync
        bgColor="#F4EBFA"
        badgeColor="#602E55"
        accentColor="#602E55"
        buttonBgColor="#602E55"
      />
      <OvyComingNext />
      {/* 4. Ovy Period School Section */}
      <OvyPeriodSchool />
      <OvyFAQ />
      <PadSharedImpact
        bgColor="#602E55"
        badgeColor="#F4EBFA"
        buttonTextColor="#602E55"
      />
      <InstagramFeed theme="pink" {...instagram.props} />
     
     
    

      <Newsletter
        cardBgColor="#602E55"
        outerBgColor="#FFFFFF"
        badgeText="NEWSLETTER"
        badgeColor="#F4EBFA"
        inputBgColor="rgba(255, 255, 255, 0.15)"
        inputBorderColor="rgba(255, 255, 255, 0.25)"
      />
    
    </main>
  );
}
