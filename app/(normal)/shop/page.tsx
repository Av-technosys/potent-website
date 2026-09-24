import React from "react";
import FilterBar from "../../components/common/category/filterTopBar";
import CategoryProducts from "../../components/common/category/categoryProducts";

const Page = () => {
  return (
    <div className="container mx-auto px-3 sm:px-6">
      <FilterBar />
      <div className="py-4 sm:py-8 flex gap-6">
        {/* <FiltersSidebar allCategories={allCategories} /> */}
        <CategoryProducts />
      </div>
    </div>
  );
};

export default Page;
