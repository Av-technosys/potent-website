/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, Loader2 } from "lucide-react";
import { Select } from "@/components/select";
import ProductPagination from "@/components/pagination";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import { getCategories } from "@/helper";
import ProductTable from "./productTable";

interface Props {
  products: any[];
  total: number;
  currentPage: number;
}

const ProductClient = ({ products, total, currentPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();

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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function load() {
      const data = await getCategories();

      setCategories(
        data.map((c: any) => ({
          value: c.slug,
          label: c.name,
        }))
      );
    }
    load();
  }, []);

  const selectedCategory = searchParams.get("category") ?? undefined;
  const selectedStockStatus = searchParams.get("stock") ?? undefined;
  const selectedVisibility = searchParams.get("visibility") ?? undefined;


  return (
    <div className="w-full p-1">
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your products here</CardDescription>
        </CardHeader>

        <CardContent>
          {/* ADD BUTTON */}
          <div className="flex cursor-pointer justify-end mb-4">
            <Button onClick={() => router.push("/admin/product/add")}>
              <Plus />
              Add Product
            </Button>
          </div>

          {/* FILTER BAR */}
          <div className="flex gap-3 mb-6">
            {/* SEARCH */}
            <div className="w-full max-w-xl">
              <InputGroup className="flex items-center bg-white rounded-full py-2 shadow-none">
                <InputGroupAddon>
                  <Search className="text-gray-500" />
                </InputGroupAddon>

                <InputGroupInput
                  onChange={handleInputChange}
                  value={searchText}
                  type="text"
                  placeholder="Search By Product Name"
                  className="bg-transparent focus:outline-none w-32 focus:w-56 transition-all duration-200"
                />

              </InputGroup>
            </div>

            {/* CATEGORY */}
            <Select
              placeholder="Select Category"
              label="Category"
              selectItems={categories}
              value={selectedCategory}
              onValueChange={(val) =>
                startTransition(() => updateQuery("category", val))
              }
            />

            {/* STOCK */}
            <Select
              placeholder="Select Stock Status"
              label="Stock Status"
              selectItems={[
                { value: "in_stock", label: "In Stock" },
                { value: "out_of_stock", label: "Out of Stock" },
              ]}
              value={selectedStockStatus}
              onValueChange={(val) =>
                startTransition(() => updateQuery("stock", val))
              }
            />

            {/* VISIBILITY */}
            <Select
              placeholder="Select Visibility"
              label="Visibility"
              selectItems={[
                { value: "visible", label: "Visible" },
                { value: "hidden", label: "Hidden" },
              ]}
              value={selectedVisibility}
              onValueChange={(val) =>
                startTransition(() => updateQuery("visibility", val))
              }
            />
          </div>

          {/* TABLE CONTAINER */}
          <div className="relative">
            <ProductTable
              products={products}
              total={total}
              currentPage={currentPage}
            />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductClient;
