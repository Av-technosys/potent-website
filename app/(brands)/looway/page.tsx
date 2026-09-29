import { InstagramFeed } from "@/app/components/common/homepage/InstaFeed";
import { Newsletter } from "@/app/components/common/homepage/NewsLetter";
import { LoowayHero } from "@/app/components/common/homepage/brands/LoowayHero";
import { LoowayShopSection } from "@/app/components/common/homepage/brands/LoowayShopSection";
import { LoowayShopByTrip } from "@/app/components/common/homepage/brands/LoowayShopByTrip";
import { LoowayHowItWorks } from "@/app/components/common/homepage/brands/LoowayHowItWorks";
import { LoowayComparisonSection } from "@/app/components/common/homepage/brands/LoowayComparisonSection";
import { LoowayFunnelGuideSection } from "@/app/components/common/homepage/brands/LoowayFunnelGuideSection";
import { LoowayGiftGroupSection } from "@/app/components/common/homepage/brands/LoowayGiftGroupSection";
import { LoowayYatraKitSection } from "@/app/components/common/homepage/brands/LoowayYatraKitSection";
import { LoowayFaqSection } from "@/app/components/common/homepage/brands/LoowayFaqSection";
import { BrandStats } from "@/app/components/common/homepage/brands/BrandStats";
import { brandDataMap } from "@/const/globalconst";
import { getFullProductDetails } from "@/helper/product/action";

export const dynamic = "force-dynamic";

export default async function LowayPage() {
  const data = brandDataMap.loway;
  const productSlugs = [
    "looway-toilet-seat-covers",
    "looway-pee-funnel",
    "looway-pee-puke",
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
  const stats = data.sections[5] as unknown as {
    props: Parameters<typeof BrandStats>[0];
  };
  const instagram = data.sections[7] as unknown as {
    props: Parameters<typeof InstagramFeed>[0];
  };
  const newsletter = data.sections[10] as unknown as {
    props: Parameters<typeof Newsletter>[0];
  };

  return (
    <main style={{ backgroundColor: data["bg-color"] }}>
      <LoowayHero productsBySlug={productsBySlug} />
      <LoowayShopSection productsBySlug={productsBySlug} />
      <LoowayShopByTrip productsBySlug={productsBySlug} />
      <LoowayHowItWorks productsBySlug={productsBySlug} />
      <LoowayYatraKitSection />
      <LoowayComparisonSection />
      <LoowayFunnelGuideSection productsBySlug={productsBySlug} />
      <LoowayGiftGroupSection />
      <LoowayFaqSection />

      <BrandStats {...stats.props} />

      <InstagramFeed theme="teal" {...instagram.props} />

      <Newsletter {...newsletter.props} />
    </main>
  );
}
