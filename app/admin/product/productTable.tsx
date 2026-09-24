/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Edit, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

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
import { deleteProduct } from "@/helper/product/action";

const ProductTable = ({ products, total, currentPage }: any) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
 
  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteProduct(id);

        if (!res?.success) {
          toast.error(res?.message ?? "Failed to delete product");
          return;
        }

        toast.success(res.message ?? "Product deleted");

        // ✅ IMPORTANT FIX
        router.refresh();

      } catch {
        toast.error("Server crashed while deleting");
      }
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Strikethrough Price</TableHead>
            <TableHead>IsCancelable</TableHead>
            <TableHead>isReturnable</TableHead>
            <TableHead>isDeleted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length > 0 ? (
            products.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>₹{item.basePrice}</TableCell>
                <TableCell>₹{item.strikethroughPrice}</TableCell>
                <TableCell>{item.isCancelable ? "Yes" : "No"}</TableCell>
                <TableCell>{item.isReturnable ? "Yes" : "No"}</TableCell>
                <TableCell>{item.isDeleted ? "Yes" : "No"}</TableCell>

                <TableCell className="flex gap-2">

                  {/* EDIT */}
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/product/${item.id}`)}
                  >
                    <Edit size={16} />
                  </Button>

                  {/* DELETE */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={isPending}>
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete product permanently?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone. The product and all its
                          data will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                          Cancel
                        </AlertDialogCancel>

                      <AlertDialogAction
  disabled={isPending}
  onClick={() => handleDelete(item.productId)} // ✅ yaha change
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

                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-gray-600 font-semibold"
              >
                No product found..
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductTable;