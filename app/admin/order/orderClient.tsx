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
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ProductPagination from "@/components/pagination";
import OrderTable from "./orderTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ORDER_STATUS_ITEMS } from "@/const/globalconst";
interface Props {
  order: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  status: any

}

const OrderClient = ({ order, total, currentPage, pageSize, status }: Props) => {


  const [isPending, startTransition] = useTransition();

  const updateQuery = useUpdateQuery();
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string | undefined>();

  const [searchText, setSearchText] = useState("");

  const debouncedSearch = useDebounce(searchText, 800);





  useEffect(() => {
    startTransition(() => {
      updateQuery("status", selectedOrderStatus);
    });
  }, [selectedOrderStatus]);

  useEffect(() => {
    startTransition(() => {
      updateQuery("search", debouncedSearch);
    });
  }, [debouncedSearch]);


  useEffect(() => {
    setSelectedOrderStatus(status)
  }, [status])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  return (
    <div className="w-full p-1">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Manage your orders here</CardDescription>
        </CardHeader>

        <CardContent>


          <div className="flex gap-3">
            <div className="w-full max-w-xl">
              <InputGroup className="flex items-center  bg-white rounded-full   py-2 shadow-none">
                <InputGroupAddon>
                  <Search className="text-gray-500" />
                </InputGroupAddon>

                <InputGroupInput
                  onChange={handleInputChange}
                  value={searchText}
                  type="text"
                  placeholder="Search By Order Id"
                  className="bg-transparent  focus:outline-none w-32 focus:w-56 transition-all duration-200"
                />
              </InputGroup>
            </div>

            <Select
              placeholder="Order Status"
              label="Order Status"
              selectItems={ORDER_STATUS_ITEMS}
              value={selectedOrderStatus}
              onValueChange={setSelectedOrderStatus}
            />
          </div>

          {/* URL-driven pagination */}
          <div className="relative">
            {isPending && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="animate-spin w-6 h-6 text-primary" />
              </div>
            )}

            <OrderTable page={currentPage} orders={order} pageSize={pageSize} />
          </div>
          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderClient;
