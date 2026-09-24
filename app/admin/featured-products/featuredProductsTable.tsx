"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeFeaturedProduct } from "@/helper/adminListing/action";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUrl";

export type FeaturedProductRow = {
  id: string;
  productId: string;
  createdAt: Date;
  productName: string | null;
  productSku: string | null;
  productSlug: string | null;
  bannerImage: string | null;
  basePrice: number | null;
  isInStock: boolean | null;
};

interface Props {
  products: FeaturedProductRow[];
  page: number;
  pageSize: number;
}

function formatAmount(amount: number | null) {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const FeaturedProductsTable = ({ products, page, pageSize }: Props) => {
  const startIndex = (page - 1) * pageSize;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove(id: string) {
    startTransition(async () => {
      const response = await removeFeaturedProduct(id);

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
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length > 0 ? (
            products.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 min-w-[220px]">
                    {item.bannerImage ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                        <Image
                          src={getImageUrl(item.bannerImage)}
                          alt={item.productName ?? "Product"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md border bg-muted" />
                    )}
                    <span className="font-medium">{item.productName ?? "-"}</span>
                  </div>
                </TableCell>
                <TableCell>{item.productSku ?? "-"}</TableCell>
                <TableCell>{item.productSlug ?? "-"}</TableCell>
                <TableCell>{formatAmount(item.basePrice)}</TableCell>
                <TableCell>
                  <Badge variant={item.isInStock ? "secondary" : "outline"}>
                    {item.isInStock ? "In stock" : "Out of stock"}
                  </Badge>
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
              <TableCell colSpan={7} className="h-24 text-center text-gray-600">
                No featured products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeaturedProductsTable;
