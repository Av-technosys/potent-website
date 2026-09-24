/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { useTransition, useState } from "react";




import { pageSize } from "@/const/globalconst";

import {
  Mail,
  Star,
  Trash2,
  Check,
  Loader2,
  Undo2,
} from "lucide-react";

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

import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteReview, rejectReview, toggleApproveReview } from "@/helper";
import { useRouter } from "next/navigation";

interface ReviewTableProps {
  page: number;
  reviews: any;
}

const PAGE_SIZE = pageSize;

const ReviewTable = ({ page, reviews }: ReviewTableProps) => {
  const startIndex = (page - 1) * PAGE_SIZE;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [deleteId, setDeleteId] = useState<string | null>(null);


async function handleApprove(id: string) {
  startTransition(async () => {
    const res = await toggleApproveReview(id);

    if (res?.success) {
      toast.success("Review approved");
      router.refresh();
    } else {
      toast.error(res?.message ?? "Failed to approve review");
    }
  });
}

async function handleReject(id: string) {
  startTransition(async () => {
    const res = await rejectReview(id);

    if (res?.success) {
      toast.success("Review rejected");
      router.refresh();
    } else {
      toast.error(res?.message ?? "Failed to reject review");
    }
  });
}



async function handleDelete() {
  if (!deleteId) return;

  startTransition(async () => {
    const res = await deleteReview(deleteId);

    if (res?.success) {
      toast.success("Review deleted");
      router.refresh();
    } else {
      toast.error(res?.message ?? "Failed to delete review");
    }

    setDeleteId(null);
  });
}



  return (
    <div className="mt-8 bg-background rounded-2xl p-4 relative">

      {/* GLOBAL PENDING OVERLAY */}
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <Loader2 className="animate-spin w-6 h-6 text-primary" />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead className="w-[70px] ">S.No</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="w-[160px]">Rating</TableHead>
            <TableHead className="w-[40%]">Message</TableHead>
            <TableHead className="text-right pr-4 w-[150px]">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reviews?.map((review: any, index: number) => {
            const rowNumber = startIndex + index + 1;

            return (
              <TableRow key={rowNumber} className="hover:bg-muted/30 transition-colors">
                {/* Serial */}
                <TableCell className="pl-4 py-5 font-medium text-muted-foreground">
                  {rowNumber}
                </TableCell>

                {/* User */}
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                
                    <span className="font-medium">{review.name}</span>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="py-5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={14} />
                    <span className="text-sm">{review.email}</span>
                  </div>
                </TableCell>

                {/* Rating */}
                <TableCell className="py-5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < (review?.rating ?? 0) ? (
                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <Star key={i} size={16} className="text-foreground/30" />
                      )
                    )}
                  </div>
                </TableCell>

                {/* Message */}
                <TableCell className="py-5">
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[520px] line-clamp-3">
                    {review.message}
                  </p>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-4 py-5">
                  <div className="flex justify-end gap-2">

                    {/* APPROVE */}
                <TooltipProvider delayDuration={150}>
  <Tooltip>
    <TooltipTrigger asChild>
      <span>
        <Button
  size="icon"
  variant="secondary"
  disabled={isPending || review.isAdminApproved}
  onClick={() => handleApprove(review.id)}
  className={
    review.isAdminApproved
      ? "bg-blue-100 text-blue-700 cursor-not-allowed"
      : "bg-green-100 text-green-700 hover:bg-green-200"
  }
>
  {review.isAdminApproved ? (
    <Check size={18} strokeWidth={2.5} />
  ) : (
    <Check size={18} strokeWidth={2.5} />
  )}
</Button>

      </span>
    </TooltipTrigger>

    {review.isAdminApproved && (
      <TooltipContent>
        Already approved
      </TooltipContent>
    )}
  </Tooltip>
</TooltipProvider>


                    {/* DELETE CONFIRM */}
                    {!review.isAdminApproved && (
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                              disabled={isPending}
                              onClick={() => handleReject(review.id)}
                            >
                              <Undo2 size={18} strokeWidth={2.5} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reject review</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {/* DELETE CONFIRM */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-red-100 text-red-700 hover:bg-red-200"
                          disabled={isPending}
                          onClick={() => setDeleteId(review.id)}
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The review will be permanently removed from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Delete
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

export default ReviewTable;
