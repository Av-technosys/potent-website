import React, { Suspense } from "react";
import FilterBar from "../../components/common/category/filterTopBar";
import FiltersSidebar from "../../components/common/category/filterSideBar";
import CategoryProducts from "../../components/common/category/categoryProducts";

const Page = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Loading Shop...</div>}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <FilterBar />
          <div className="mt-6 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            <FiltersSidebar />
            <CategoryProducts />
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
