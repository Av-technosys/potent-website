"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PRODUCT_FILTER } from "@/const/filters";
import { getCategories } from "@/helper";
import { useCatalogStore } from "@/store/catalogStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import debounce from 'debounce';

export default function FiltersSidebar({ allCategories }: any) {
  const storeCategories = useCatalogStore((state) => state.categories);
  const categories = allCategories ?? storeCategories;

  const filterBarData = {
    category: categories,
    productType: PRODUCT_FILTER.product_type,
    flow: PRODUCT_FILTER.flow_or_usage_type,
    size: PRODUCT_FILTER.size
  }

  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const paramsString = params.toString();


  const [optimisticFilter, setOptimisticFilter] = useState({
    category: params.getAll("category"),
    productType: params.getAll("productType"),
    flow: params.getAll("flow"),
    size: params.getAll("size"),
  });

  // sync only when url actually changes
  useEffect(() => {
    setOptimisticFilter({
      category: params.getAll("category"),
      productType: params.getAll("productType"),
      flow: params.getAll("flow"),
      size: params.getAll("size"),
    });
  }, [paramsString]);

  const clearAll = () => {
    setOptimisticFilter({
      category: [],
      productType: [],
      flow: [],
      size: [],
    });

    router.replace(pathname, { scroll: false });
  };

  // stable debounce
  const debouncedPush = useMemo(
    () =>
      debounce((query: string) => {
        router.replace(query ? `${pathname}${query}` : pathname, {
          scroll: false,
        });
      }, 500),
    [router, pathname]
  );

  const handleFilterChange = (type: string, value: string) => {
    setOptimisticFilter((prev) => {
      const key = type as keyof typeof prev;

      const existingValues = prev[key] || [];

      const updatedValues = existingValues.includes(value)
        ? existingValues.filter((v: string) => v !== value)
        : [...existingValues, value];

      // create query from updated state
      const current = new URLSearchParams(params.toString());

      current.delete(type);

      updatedValues.forEach((v) => {
        current.append(type, v);
      });

      const query = current.toString();

      debouncedPush(query ? `?${query}` : "");

      return {
        ...prev,
        [key]: updatedValues,
      };
    });
  };




  return (
    <Card className="hidden md:block w-72 rounded-2xl shadow-md bg-white h-fit sticky top-4 max-h-[96vh] overflow-y-auto no-scrollbar">
      <CardContent className="p-5 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button onClick={clearAll} className="text-sm text-[#1A8D91]">
            Clear All
          </button>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          {filterBarData?.category?.map((item: any) => (
            <div key={item.name} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={optimisticFilter.category.includes(item.id)}
                onCheckedChange={() =>
                  handleFilterChange("category", item.id)
                }
              />
              <label>{item.name}</label>
            </div>
          ))}
        </div>

        {/* Product Type */}
        <div>
          <h3 className="font-medium mb-3">Product Type</h3>
          {filterBarData?.productType?.map((item: any) => (
            <div key={item.name} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={optimisticFilter.productType.includes(item.slug)}
                onCheckedChange={() =>
                  handleFilterChange("productType", item.slug)
                }
              />
              <label>{item.name}</label>
            </div>
          ))}
        </div>

        {/* Flow */}
        <div>
          <h3 className="font-medium mb-3">Flow Type</h3>
          {filterBarData?.flow?.map((item: any) => (
            <div key={item.name} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={optimisticFilter.flow.includes(item.slug)}
                onCheckedChange={() =>
                  handleFilterChange("flow", item.slug)
                }
              />
              <label>{item.name}</label>
            </div>
          ))}
        </div>

        {/* Size */}
        <div>
          <h3 className="font-medium mb-3">Size</h3>
          {filterBarData?.size?.map((item: any) => (
            <div key={item.name} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={optimisticFilter.size.includes(item.slug)}
                onCheckedChange={() =>
                  handleFilterChange("size", item.slug)
                }
              />
              <label>{item.name}</label>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}

// {/* Material */}
// <div>
//   <h3 className="font-medium mb-3">Material</h3>
//   {filterBarData?.material?.map((item: any) => (
//     <div key={item.name} className="flex items-center gap-2 mb-2">
//       <Checkbox
//         checked={filters.material === item.slug}
//         onCheckedChange={() =>
//           toggleFilter("material", item.slug)
//         }
//       />
//       <label>{item.name}</label>
//     </div>
//   ))}
// </div>

// {/* Price */}
// <div>
//   <h3 className="font-medium mb-3">Price Range</h3>
//   <div className="flex gap-2">
//     <Input
//       placeholder="₹0"
//       value={filters.min}
//       onChange={(e) =>
//         setFilters((prev: any) => ({
//           ...prev,
//           min: e.target.value,
//         }))
//       }
//     />
//     <Input
//       placeholder="₹1000"
//       value={filters.max}
//       onChange={(e) =>
//         setFilters((prev: any) => ({
//           ...prev,
//           max: e.target.value,
//         }))
//       }
//     />
//   </div>
// </div>

// {/* Stock */}
// <div className="flex items-center gap-2">
//   <Checkbox
//     checked={filters.stock === "true"}
//     onCheckedChange={() =>
//       toggleFilter("stock", "true")
//     }
//   />
//   <label>In Stock Only</label>
// </div>
