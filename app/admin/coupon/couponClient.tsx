"use client";

import ProductPagination from "@/components/pagination";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import CouponTable from "./couponTable";

interface Props {
  coupons: Record<string, unknown>[];
  total: number;
  currentPage: number;
}

const CouponClient = ({ coupons, total, currentPage }: Props) => {
  const pathname = usePathname();
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const initialSearch = searchParams.get("search") ?? "";
  const [searchText, setSearchText] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchText, 500);

  useEffect(() => {
    const currentParam = searchParams.get("search") ?? "";
    if (debouncedSearch.trim() === currentParam) return;

    startTransition(() => {
      updateQuery("search", debouncedSearch.trim() || undefined);
    });
  }, [debouncedSearch, searchParams, updateQuery]);

  return (
    <div className="w-full min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Coupon Management</CardTitle>
          <CardDescription>Add, edit and manage store coupons</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href={`${pathname}/add`}>
                <Plus />
                Add Coupon
              </Link>
            </Button>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="w-full max-w-xl">
              <InputGroup className="flex items-center bg-white rounded-full py-2 shadow-none">
                <InputGroupAddon>
                  <Search className="text-gray-500" />
                </InputGroupAddon>

                <InputGroupInput
                  onChange={(event) => setSearchText(event.target.value)}
                  value={searchText}
                  type="text"
                  placeholder="Search by coupon name or code"
                  className="bg-transparent focus:outline-none w-48 focus:w-64 transition-all duration-200"
                />
              </InputGroup>
            </div>
          </div>

          <div className="relative">
            <CouponTable page={currentPage} coupons={coupons} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponClient;
