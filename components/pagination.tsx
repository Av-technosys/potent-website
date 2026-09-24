// "use client";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { useRouter } from "next/navigation";

// interface Props {
//   currentPage: number;
//   totalPages: number;
// }

// const ProductPagination = ({ currentPage, totalPages }: Props) => {
//   const router = useRouter();

//   const pageSize = 3;

//   if (totalPages <= 1) return null;

//   return (
//     <Pagination className="mt-8">
//       <PaginationContent>
//         <PaginationItem className="border border-gray-200 rounded-md">
//           <PaginationPrevious
//             className={`cursor-pointer ${
//               currentPage == 1 && "pointer-events-none opacity-50"
//             }`}
//             onClick={() =>
//               router.push(`?page=${currentPage - 1}&page_size=${pageSize}`)
//             }
//           />
//         </PaginationItem>
//         {Array.from({ length: totalPages }).map((_, index: any) => {
//           return (
//             <PaginationItem
//               onClick={() =>
//                 router.push(`?page=${index + 1}&page_size=${pageSize}`)
//               }
//               className={`border border-gray-200 rounded-md ${
//                 currentPage == index + 1 && "text-orange-500"
//               }`}
//             >
//               <PaginationLink href="#">{index + 1}</PaginationLink>
//             </PaginationItem>
//           );
//         })}
//         <PaginationItem className="border border-gray-200 rounded-md">
//           <PaginationNext
//             className={`cursor-pointer  ${
//               currentPage == totalPages && "pointer-events-none opacity-50"
//             }`}
//             onClick={() =>
//               router.push(`?page=${currentPage + 1}&page_size=${pageSize}`)
//             }
//           />
//         </PaginationItem>
//       </PaginationContent>
//     </Pagination>
//   );
// };

// export default ProductPagination;

"use client";

import { pageSize as defaultPageSize } from "@/const/globalconst";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
}

const ProductPagination = ({
  currentPage,
  totalPages,
  pageSize = defaultPageSize,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem className="border border-gray-200 rounded-md">
          <PaginationPrevious
            className={`cursor-pointer ${
              currentPage === 1 && "pointer-events-none opacity-50"
            }`}
            onClick={() => pushPage(currentPage - 1)}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          return (
            <PaginationItem
              key={page}
              className={`border border-gray-200 rounded-md ${
                currentPage === page && "text-orange-500"
              }`}
            >
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => pushPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem className="border border-gray-200 rounded-md">
          <PaginationNext
            className={`cursor-pointer ${
              currentPage === totalPages && "pointer-events-none opacity-50"
            }`}
            onClick={() => pushPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductPagination;
