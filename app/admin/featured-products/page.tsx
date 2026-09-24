import { pageSize as defaultPageSize } from "@/const/globalconst";
import {
  fetchAdminFeaturedProducts,
  fetchFeaturedProductOptions,
} from "@/helper/adminListing/action";
import FeaturedProductsClient from "./featuredProductsClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    page_size?: string;
    search?: string;
  }>;
}

function toInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = toInt(params.page, 1);
  const pageSize = toInt(params.page_size, defaultPageSize);
  const search = params.search ?? "";

  const [result, productOptions] = await Promise.all([
    fetchAdminFeaturedProducts({ page, pageSize, search }),
    fetchFeaturedProductOptions(),
  ]);

  return (
    <FeaturedProductsClient
      products={result.data}
      productOptions={productOptions}
      total={result.meta.totalPages}
      currentPage={result.meta.page}
      pageSize={result.meta.pageSize}
    />
  );
};

export default Page;
