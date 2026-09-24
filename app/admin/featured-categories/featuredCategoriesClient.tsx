"use client";

import ProductPagination from "@/components/pagination";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addFeaturedCategory } from "@/helper/adminListing/action";
import { Loader2, Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import FeaturedCategoriesTable, { FeaturedCategoryRow } from "./featuredCategoriesTable";

type FeaturedOption = {
  value: string;
  label: string;
  slug: string;
};

interface Props {
  categories: FeaturedCategoryRow[];
  categoryOptions: FeaturedOption[];
  total: number;
  currentPage: number;
  pageSize: number;
}

const FeaturedCategoriesClient = ({
  categories,
  categoryOptions,
  total,
  currentPage,
  pageSize,
}: Props) => {
  const updateQuery = useUpdateQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchText, setSearchText] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(searchText, 800);

  useEffect(() => {
    if (debouncedSearch === (searchParams.get("search") ?? "")) return;

    startTransition(() => {
      updateQuery("search", debouncedSearch);
    });
  }, [debouncedSearch, searchParams, updateQuery]);

  function handleAddFeaturedCategory() {
    if (!selectedCategoryId) {
      toast.error("Select a category first");
      return;
    }

    startTransition(async () => {
      const response = await addFeaturedCategory(selectedCategoryId);

      if (response.success) {
        toast.success(response.message);
        setSelectedCategoryId("");
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
          <CardTitle>Featured Categories</CardTitle>
          <CardDescription>Add categories to the featured section and manage current featured categories.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6 flex flex-col gap-3 rounded-md border bg-muted/20 p-4 sm:flex-row sm:items-center">
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="w-full sm:max-w-md">
                <SelectValue placeholder="Select category to feature" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.length > 0 ? (
                  categoryOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Button
              type="button"
              onClick={handleAddFeaturedCategory}
              disabled={isPending || !selectedCategoryId}
              className="sm:w-auto"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Plus />}
              Add Featured Category
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
                placeholder="Search by category name or slug"
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

            <FeaturedCategoriesTable categories={categories} page={currentPage} pageSize={pageSize} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} pageSize={pageSize} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedCategoriesClient;
