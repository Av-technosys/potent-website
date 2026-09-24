/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { getCategories } from "@/helper";
import { Loader2 } from "lucide-react";
import MultipleSelector from "./ui/multi-select";
export const MultiCategorySelect = ({
  selectedCategories,
  onCategoriesChange,
}: {
  selectedCategories: string[];
  onCategoriesChange: (ids: string[]) => void;
}) => {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getCategories();
      setCategories(
        data.map((category: any) => ({
          label: category.name,
          value: category.id,
        }))
      );

      setLoading(false);
    }

    load();
  }, []);

  const selectedObjects = categories.filter((cat) =>
    selectedCategories.includes(cat.value)
  );


  return (
    <div className="space-y-2 pl-1">
      <Label>Category</Label>

      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <MultipleSelector
        key={categories.length}
          value={selectedObjects}
          defaultOptions={categories}
          onChange={(values: any[]) => {
            const ids = values.map((v) => v.value);
            onCategoriesChange(ids);
          }}
          placeholder="Select categories"
          className="w-full"
        />
      )}
    </div>
  );
};