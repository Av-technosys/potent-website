import { pageSize } from "@/const/globalconst";
import { getProducts } from "@/helper/product/action";
import ProductClient from "./productClient";

interface PageProps {
  searchParams: {
    page?: string;
    page_size?: string;
    search?: string;
    category?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const PAGE_SIZE = pageSize
  const result = await getProducts({
    page: Number(params.page ?? "1"),
    pageSize: Number(PAGE_SIZE),
    search: params.search ?? "",
    category: params.category,
  });


  return (
    <ProductClient
      products={result.items}
      total={result.totalPages}
      currentPage={result.page}
    />
  );
};


export default Page;
