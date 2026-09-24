/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { deleteCoupon } from "@/helper";
import { pageSize } from "@/const/globalconst";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface CouponTableProps {
  page: number;
  coupons: any[];
}

const formatAmount = (value?: number | null) => {
  if (value === null || value === undefined) return "-";
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const CouponTable = ({ page, coupons }: CouponTableProps) => {
  const startIndex = (page - 1) * pageSize;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteCoupon(id);

      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  return (
    <div className="mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Minimum Order</TableHead>
            <TableHead>Max Discount</TableHead>
            <TableHead>Use Once</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No coupons found
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon: any, index: number) => {
              const rowNumber = startIndex + index + 1;
              const discount = coupon.isDiscountPercentage
                ? `${coupon.discountPercentage}%`
                : formatAmount(coupon.discountFixedAmount);

              return (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{rowNumber}</TableCell>
                  <TableCell>{coupon.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{coupon.code}</Badge>
                  </TableCell>
                  <TableCell>{discount}</TableCell>
                  <TableCell>{formatAmount(coupon.minimumOrderValue)}</TableCell>
                  <TableCell>
                    {formatAmount(coupon.maximumDiscountAmount)}
                  </TableCell>
                  <TableCell>{coupon.useOnce ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`${pathname}/${coupon.id}`)}
                      >
                        <Pencil size={16} />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" disabled={isPending}>
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete coupon permanently?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={isPending}
                              onClick={() => handleDelete(coupon.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isPending ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponTable;
