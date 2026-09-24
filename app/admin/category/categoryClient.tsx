"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import CategoryTable from "./categoryTable";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getCategories } from "@/helper";
import { useDebounce } from "@/components/debouceSearch";
import { Select } from "@/components/select";
import { useUpdateQuery } from "@/components/filter";
import ProductPagination from "@/components/pagination";

interface Props {
  categories: any[];
  total: number;
  currentPage: number;
}

const CategoryClient = ({ categories, total, currentPage }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();

  const [isPending, startTransition] = useTransition();


  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 800);

  useEffect(() => {
    startTransition(() => updateQuery("search", debouncedSearch));
  }, [debouncedSearch]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }


  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function load() {
      const data = await getCategories();

      setCategoryOptions(
        data.map((c: any) => ({
          value: c.slug,
          label: c.name,
        }))
      );
    }
    load();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>();

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") ?? undefined);
  }, [searchParams]);


  const [selectedVisibility, setSelectedVisibility] = useState<string>();

  useEffect(() => {
    setSelectedVisibility(searchParams.get("visibility") ?? undefined);
  }, [searchParams]);

  return (
    <div className="w-full min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Manage your categories here</CardDescription>
        </CardHeader>

        <CardContent>

          {/* ADD */}
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href={`${pathname}/add`}>
                <Plus />
                Add Category
              </Link>
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
                  placeholder="Search By Category Name"
                  className="bg-transparent focus:outline-none w-32 focus:w-56 transition-all duration-200"
                />

              </InputGroup>
            </div>

            {/* CATEGORY SELECT */}
            <Select
              placeholder="Select Category"
              label="Category"
              selectItems={categoryOptions}
              value={selectedCategory}
              onValueChange={(val) =>
                startTransition(() => updateQuery("category", val))
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

          {/* TABLE + LOADING OVERLAY */}
          <div className="relative">
            {isPending && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="animate-spin w-6 h-6 text-primary" />
              </div>
            )}

            <CategoryTable page={currentPage} categories={categories} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryClient;
