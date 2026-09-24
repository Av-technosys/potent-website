import SeatCoversPageClient from "@/app/components/common/Product-detail/SeatCoversPageClient";
import { loowayToiletSeatCovers } from "@/const/productsContent";
import { getProductReviews } from "@/helper";
import { getFullProductDetails } from "@/helper/product/action";

export const dynamic = "force-dynamic";

export default async function LoowayToiletSeatCoversPage() {
  const slug = "looway-toilet-seat-covers";
  const product = await getFullProductDetails(slug);
  const reviewWithMedia = await getProductReviews(slug);

  return (
    <SeatCoversPageClient
      product={product || { id: "seat-covers-db-id", slug: "looway-toilet-seat-covers", name: "Looway Disposable Toilet Seat Covers" }}
      reviewWithMedia={reviewWithMedia}
      content={loowayToiletSeatCovers}
    />
  );
}
