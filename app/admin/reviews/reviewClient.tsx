/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { Search, User } from "lucide-react";



import { useEffect, useState } from "react";
import { useUpdateQuery } from "@/components/filter";
import { useDebounce } from "@/components/debouceSearch";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { getReviewStats } from "@/helper/index";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import ReviewTable from "./ReviewTable";
import ProductPagination from "@/components/pagination";

interface Props {
  reviews: any[];
  total: number;
  currentPage: number;
}

const ReviewClient = ({ reviews, total, currentPage }: Props) => {
  const updateQuery = useUpdateQuery();
  const [isPending, startTransition] = useTransition();

  const [searchText, setSearchText] = useState("");

  const debouncedSearch = useDebounce(searchText, 800);
  const [stats, setStats] = useState<{ total: number; pending: number } | null>(
    null,
  );

  useEffect(() => {
    async function loadStats() {
      const res: any = await getReviewStats();
      if (res?.success) setStats(res?.data);
    }
    loadStats();
  }, []);

  useEffect(() => {
    startTransition(() => updateQuery("search", debouncedSearch));
  }, [debouncedSearch]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }
  return (
    <div className="w-full ">
      <Card className="border-none shadow-none rounded-none">
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>
            Monitor and moderate customer feedback accross all products. Approve
            valid reviews to publish them to the website
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {/* Total Reviews */}
            <Card className="shadow-sm rounded-2xl">
              <CardContent className="py-3 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Reviews
                  </p>

                  <p className="text-4xl font-bold tracking-tight">
                    {stats?.total ?? "..."}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    All submitted reviews
                  </p>
                </div>

                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                  <MessageSquare size={28} />
                </div>
              </CardContent>
            </Card>

            {/* Pending Approval */}
            <Card className="shadow-sm rounded-2xl">
              <CardContent className="py-3 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Approval
                  </p>

                  <p className="text-4xl font-bold text-orange-600 tracking-tight">
                    {stats?.pending ?? "..."}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Waiting for admin action
                  </p>
                </div>

                <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                  <Clock size={28} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-3">
            <div className="w-full max-w-xl">
              <InputGroup className="flex items-center  bg-white rounded-full   py-2 shadow-none">
                <InputGroupAddon>
                  <Search className="text-gray-500" />
                </InputGroupAddon>

                <InputGroupInput
                  onChange={handleInputChange}
                  value={searchText}
                  type="text"
                  placeholder="Search By Customer Name"
                  className="bg-transparent  focus:outline-none w-32 focus:w-56 transition-all duration-200"
                />
              </InputGroup>
            </div>
          </div>

          {/* URL-driven pagination */}
          <div className="relative mt-6">
            {isPending && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="animate-spin w-6 h-6 text-primary" />
              </div>
            )}

            <ReviewTable page={currentPage} reviews={reviews} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewClient;
