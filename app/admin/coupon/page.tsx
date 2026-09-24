import { pageSize } from "@/const/globalconst";
import { getCouponsPagination } from "@/helper";
import CouponClient from "./couponClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    page_size?: string;
    search?: string;
  }>;
}

const PAGE_SIZE = pageSize;

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const result = await getCouponsPagination({
    page: Number(params.page ?? "1"),
    pageSize: Number(params.page_size ?? PAGE_SIZE),
    search: params.search ?? "",
  });

  return (
    <CouponClient
      coupons={result.items}
      total={result.totalPages}
      currentPage={result.page}
    />
  );
};

export default Page;
