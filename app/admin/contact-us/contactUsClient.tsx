"use client";

import ProductPagination from "@/components/pagination";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Loader2, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import ContactUsTable, { ContactMessageRow } from "./contactUsTable";

interface Props {
  messages: ContactMessageRow[];
  total: number;
  currentPage: number;
  pageSize: number;
}

const ContactUsClient = ({ messages, total, currentPage, pageSize }: Props) => {
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(searchText, 800);

  useEffect(() => {
    if (debouncedSearch === (searchParams.get("search") ?? "")) return;

    startTransition(() => {
      updateQuery("search", debouncedSearch);
    });
  }, [debouncedSearch, searchParams, updateQuery]);

  return (
    <div className="w-full p-1">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us Messages</CardTitle>
          <CardDescription>Read customer contact and newsletter submissions.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-full max-w-xl">
            <InputGroup className="flex items-center bg-white rounded-full py-2 shadow-none">
              <InputGroupAddon>
                <Search className="text-gray-500" />
              </InputGroupAddon>

              <InputGroupInput
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                type="text"
                placeholder="Search by name, email, phone, or message"
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

            <ContactUsTable messages={messages} page={currentPage} pageSize={pageSize} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} pageSize={pageSize} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUsClient;
