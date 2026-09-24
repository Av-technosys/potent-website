import { pageSize } from "@/const/globalconst";
import { getCategoriesPagination } from "@/helper";
import CategoryClient from "./categoryClient";

interface PageProps {
  searchParams: {
    page?: string;
    page_size?: string;
    search?: string;
    category?:string;
  };
}

const PAGE_SIZE = pageSize

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;


  const result = await getCategoriesPagination({
    page: Number(params.page ?? "1"),
    pageSize: PAGE_SIZE,
    search: params.search ?? "",
    category: params.category ?? undefined,


  });

  return (
    <CategoryClient
      categories={result.items}
      total={result.totalPages}
      currentPage={result.page}
    />
  );
};

export default Page;
