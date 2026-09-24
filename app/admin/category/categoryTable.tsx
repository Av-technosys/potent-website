/* eslint-disable @typescript-eslint/no-explicit-any */


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/helper";


interface CategoryTableProps {
  page: number;
  categories: any;
}

const PAGE_SIZE = 3;

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

const CategoryTable = ({ page, categories }: CategoryTableProps) => {
  const startIndex = (page - 1) * PAGE_SIZE;
const [isPending, startTransition] = useTransition();


const handleDelete = (id: string) => {

  startTransition(async () => {
    const res = await deleteCategory(id);

    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  });
};
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Slug Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories?.map((category: any, index: number) => {
            const rowNumber = startIndex + index + 1;

            return (
              <TableRow key={rowNumber}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <p>{rowNumber}</p>
                  </div>
                </TableCell>

                <TableCell>{category.name}</TableCell>

                <TableCell>{category.slug}</TableCell>

                <TableCell>{category.description}</TableCell>

                <TableCell>
                  {formatDate(category.updatedAt)}
                </TableCell>
<TableCell className="text-right">
  <div className="flex justify-end gap-2">

    {/* EDIT */}
    <Button
      variant="outline"
      onClick={() => router.push(`${pathname}/${category.id}`)}
    >
      <Pencil size={16} />
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
            Delete category permanently?
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
            onClick={() => handleDelete(category.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  </div>
</TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
