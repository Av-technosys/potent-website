/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Select } from "@/components/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import ProductPagination from "@/components/pagination";
import OrderTable from "./orderTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import { useSearchParams } from "next/navigation";
import { ORDER_STATUS_ITEMS } from "@/const/globalconst";

interface Props {
  order: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  status: any;
}

const filterStatusItems = [
  { value: "all", label: "All Statuses" },
  ...ORDER_STATUS_ITEMS,
];

const OrderClient = ({ order, total, currentPage, pageSize, status }: Props) => {
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();
  const [, startTransition] = useTransition();

  const initialSearch = searchParams.get("search") ?? "";
  const [searchText, setSearchText] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchText, 500);

  const currentStatus = (searchParams.get("status") || status) || "all";

  // Trigger search update ONLY when debounced search actually changes from URL
  useEffect(() => {
    const currentParam = searchParams.get("search") ?? "";
    if (debouncedSearch === currentParam) return;

    startTransition(() => {
      updateQuery("search", debouncedSearch.trim() ? debouncedSearch.trim() : undefined);
    });
  }, [debouncedSearch, searchParams, updateQuery]);

  const handleStatusChange = (newStatus?: string) => {
    const targetStatus = !newStatus || newStatus === "all" ? undefined : newStatus;
    const currentParam = searchParams.get("status") ?? undefined;
    if (targetStatus === currentParam) return;

    startTransition(() => {
      updateQuery("status", targetStatus);
    });
  };

  return (
    <div className="w-full p-1">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Manage your orders here</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="w-full max-w-md">
              <InputGroup className="flex items-center bg-white rounded-full py-2 shadow-none border border-slate-200">
                <InputGroupAddon>
                  <Search className="text-gray-500 w-4 h-4 ml-1" />
                </InputGroupAddon>

                <InputGroupInput
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  type="text"
                  placeholder="Search by Order ID, customer, email..."
                  className="bg-transparent focus:outline-none w-full text-sm"
                />
              </InputGroup>
            </div>

            <div className="min-w-[170px]">
              <Select
                placeholder="Filter by Status"
                label="Order Status"
                selectItems={filterStatusItems}
                value={currentStatus}
                onValueChange={handleStatusChange}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="relative">
            <OrderTable page={currentPage} orders={order} pageSize={pageSize} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderClient;
