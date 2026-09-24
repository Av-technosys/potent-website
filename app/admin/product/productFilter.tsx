"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PRODUCT_FILTER } from "@/const/filters";

type FilterItem = {
  slug: string;
  name: string;
};

type FilterCardProps = {
  title: string;
  data: FilterItem[];
  state: FilterItem[];
  setState: (items: FilterItem[]) => void;
  single?: boolean;
};

type ProductFiltersProps = {
  productType: FilterItem[];
  setProductType: (items: FilterItem[]) => void;
  size: FilterItem[];
  setSize: (items: FilterItem[]) => void;
  flowType: FilterItem[];
  setFlowType: (items: FilterItem[]) => void;
  material: FilterItem[];
  setMaterial: (items: FilterItem[]) => void;
  cramps: FilterItem[];
  setCramps: (items: FilterItem[]) => void;
  sensitive: FilterItem[];
  setSensitive: (items: FilterItem[]) => void;
};

function handleChange(
  item: FilterItem,
  checked: boolean,
  state: FilterItem[] = [],
  setState: (items: FilterItem[]) => void,
) {
  if (checked) {
    setState([...state, item]);
  } else {
    setState(state.filter((i) => i.slug !== item.slug));
  }
}

function isChecked(item: FilterItem, state: FilterItem[]) {
  return Array.isArray(state) && state.some((i) => i.slug === item.slug);
}

function FilterCard({ title, data, state, setState, single = false }: FilterCardProps) {
  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {data.map((item) => (
          <label
            key={item.slug}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <Checkbox
              checked={isChecked(item, state)}
              onCheckedChange={(checked: boolean) =>
                single
                  ? setState(checked ? [item] : [])
                  : handleChange(item, checked, state, setState)
              }
            />
            {item.name}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ProductFilters({
  productType,
  setProductType,
  size,
  setSize,
  flowType,
  setFlowType,
  material,
  setMaterial,
  cramps,
  setCramps,
  sensitive,
  setSensitive,
}: ProductFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <FilterCard
        title="Product Type"
        data={PRODUCT_FILTER.product_type}
        state={productType}
        setState={setProductType}
        single
      />

      <FilterCard
        title="Size"
        data={PRODUCT_FILTER.size}
        state={size}
        setState={setSize}
      />

      <FilterCard
        title="Flow / Usage"
        data={PRODUCT_FILTER.flow_or_usage_type}
        state={flowType}
        setState={setFlowType}
      />

      {/* <FilterCard
        title="Material"
        data={PRODUCT_FILTER.material}
        state={material}
        setState={setMaterial}
      />

      <FilterCard
        title="Cramps & Discomfort"
        data={PRODUCT_FILTER.cramps_or_discomfort}
        state={cramps}
        setState={setCramps}
      />

      <FilterCard
        title="Allergies & Sensitivities"
        data={PRODUCT_FILTER.allergies_or_sensitivities}
        state={sensitive}
        setState={setSensitive}
      /> */}
    </div>
  );
}
