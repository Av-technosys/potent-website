"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeFeaturedCategory } from "@/helper/adminListing/action";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUrl";

export type FeaturedCategoryRow = {
  id: string;
  categoryId: string | null;
  createdAt: Date;
  categoryName: string | null;
  categorySlug: string | null;
  bannerImage: string | null;
  description: string | null;
};

interface Props {
  categories: FeaturedCategoryRow[];
  page: number;
  pageSize: number;
}

const FeaturedCategoriesTable = ({ categories, page, pageSize }: Props) => {
  const startIndex = (page - 1) * pageSize;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove(id: string) {
    startTransition(async () => {
      const response = await removeFeaturedCategory(id);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    });
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 min-w-[220px]">
                    {item.bannerImage ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                        <Image
                          src={getImageUrl(item.bannerImage)}
                          alt={item.categoryName ?? "Category"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md border bg-muted" />
                    )}
                    <span className="font-medium">{item.categoryName ?? "-"}</span>
                  </div>
                </TableCell>
                <TableCell>{item.categorySlug ?? "-"}</TableCell>
                <TableCell>
                  <p className="max-w-[520px] line-clamp-2 text-sm text-muted-foreground">
                    {item.description ?? "-"}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    disabled={isPending}
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-gray-600">
                No featured categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeaturedCategoriesTable;
