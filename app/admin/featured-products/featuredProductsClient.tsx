"use client";

import ProductPagination from "@/components/pagination";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { addFeaturedProduct } from "@/helper/adminListing/action";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import FeaturedProductsTable, { FeaturedProductRow } from "./featuredProductsTable";

type FeaturedOption = {
  value: string;
  label: string | null;
  sku: string;
};

interface Props {
  products: FeaturedProductRow[];
  productOptions: FeaturedOption[];
  total: number;
  currentPage: number;
  pageSize: number;
}

const FeaturedProductsClient = ({
  products,
  productOptions,
  total,
  currentPage,
  pageSize,
}: Props) => {
  const updateQuery = useUpdateQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductLabel, setSelectedProductLabel] = useState("");
  const [productOptionSearch, setProductOptionSearch] = useState("");
  const [searchText, setSearchText] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(searchText, 800);
  const filteredProductOptions = productOptionSearch.trim()
    ? productOptions
        .filter((product) => {
          const text = `${product.label ?? ""} ${product.sku}`.toLowerCase();
          return text.includes(productOptionSearch.trim().toLowerCase());
        })
        .slice(0, 30)
    : [];

  useEffect(() => {
    if (debouncedSearch === (searchParams.get("search") ?? "")) return;

    startTransition(() => {
      updateQuery("search", debouncedSearch);
    });
  }, [debouncedSearch, searchParams, updateQuery]);

  function handleAddFeaturedProduct() {
    if (!selectedProductId) {
      toast.error("Select a product first");
      return;
    }

    startTransition(async () => {
      const response = await addFeaturedProduct(selectedProductId);

      if (response.success) {
        toast.success(response.message);
        setSelectedProductId("");
        setSelectedProductLabel("");
        setProductOptionSearch("");
        router.refresh();
      } else {
        toast.error(response.message);
      }
    });
  }

  return (
    <div className="w-full p-1">
      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
          <CardDescription>Add products to the featured section and manage current featured products.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6 flex flex-col gap-3 rounded-md border bg-muted/20 p-4 lg:flex-row lg:items-start">
            <div className="relative w-full max-w-xl">
              <InputGroup className="flex items-center bg-white py-2 shadow-none">
                <InputGroupAddon>
                  <Search className="text-gray-500" />
                </InputGroupAddon>

                <InputGroupInput
                  onChange={(event) => {
                    setProductOptionSearch(event.target.value);
                    setSelectedProductId("");
                    setSelectedProductLabel("");
                  }}
                  value={selectedProductLabel || productOptionSearch}
                  type="text"
                  placeholder="Search product by name or SKU"
                  className="bg-transparent focus:outline-none"
                />

                {(selectedProductLabel || productOptionSearch) && (
                  <InputGroupAddon>
                    <button
                      type="button"
                      onClick={() => {
                        setProductOptionSearch("");
                        setSelectedProductId("");
                        setSelectedProductLabel("");
                      }}
                      className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      aria-label="Clear selected product"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </InputGroupAddon>
                )}
              </InputGroup>

              {!selectedProductId && productOptionSearch.trim() && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-md border bg-white shadow-lg">
                  {filteredProductOptions.length > 0 ? (
                    filteredProductOptions.map((product) => (
                      <button
                        key={product.value}
                        type="button"
                        onClick={() => {
                          setSelectedProductId(product.value);
                          setSelectedProductLabel(`${product.label ?? product.sku} (${product.sku})`);
                        }}
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-muted"
                      >
                        <span className="font-medium">{product.label ?? product.sku}</span>
                        <span className="text-xs text-muted-foreground">{product.sku}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-sm text-muted-foreground">
                      No matching products
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddFeaturedProduct}
              disabled={isPending || !selectedProductId}
              className="sm:w-auto"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
              Add Featured Product
            </Button>
          </div>

          <div className="w-full max-w-xl">
            <InputGroup className="flex items-center bg-white rounded-full py-2 shadow-none">
              <InputGroupAddon>
                <Search className="text-gray-500" />
              </InputGroupAddon>

              <InputGroupInput
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                type="text"
                placeholder="Search by product name, SKU, or slug"
                className="bg-transparent focus:outline-none w-56 focus:w-80 transition-all duration-200"
              />
            </InputGroup>
          </div>

          <div className="relative">
            {isPending && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="animate-spin w-6 h-6 text-primary" />
              </div>
            )}

            <FeaturedProductsTable products={products} page={currentPage} pageSize={pageSize} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} pageSize={pageSize} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProductsClient;
