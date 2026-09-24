"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateReturnRequestStatus } from "@/helper/order/action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/imageUrl";

export type ReturnRequestRow = {
  id: string;
  orderItemId: string;
  userId: string;
  reason: string;
  adminReason: string | null;
  status: "pending" | "approved" | "rejected" | "refunded" | null;
  createdAt: Date;
  productName: string | null;
  productSku: string | null;
  productImage: string | null;
  productPrice: number | null;
  quantity: number | null;
  orderId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  images: { id: string; imageUrl: string }[];
};

interface Props {
  requests: ReturnRequestRow[];
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

function statusClass(status: ReturnRequestRow["status"]) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "refunded") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
}

const ReturnRequestsTable = ({ requests, page, pageSize }: Props) => {
  const startIndex = (page - 1) * pageSize;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeRequest, setActiveRequest] = useState<ReturnRequestRow | null>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [adminReason, setAdminReason] = useState("");

  const openActionDialog = (request: ReturnRequestRow, status: "approved" | "rejected") => {
    setActiveRequest(request);
    setActionType(status);
    setAdminReason(status === "approved" ? "Refund confirmed by admin" : "");
  };

  const closeActionDialog = () => {
    setActiveRequest(null);
    setActionType(null);
    setAdminReason("");
  };

  const submitStatus = () => {
    if (!activeRequest || !actionType) return;
    startTransition(async () => {
      const result = await updateReturnRequestStatus(activeRequest.id, actionType, adminReason);
      if (result.success) {
        toast.success(result.message);
        closeActionDialog();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="mt-8 w-full overflow-hidden">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5%]">S.No</TableHead>
            <TableHead className="w-[20%]">Product</TableHead>
            <TableHead className="w-[14%]">Order ID</TableHead>
            <TableHead className="w-[18%]">Customer</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[9%]">Amount</TableHead>
            <TableHead className="w-[8%]">Reason</TableHead>
            <TableHead className="w-[7%]">Images</TableHead>
            <TableHead className="w-[9%] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <TableRow key={request.id} className="align-top">
                <TableCell className="align-top">{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {request.productImage ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                        <Image
                          src={getImageUrl(request.productImage)}
                          alt={request.productName ?? "Product"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md border bg-muted" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{request.productName ?? "-"}</p>
                      <p className="truncate text-xs text-muted-foreground">{request.productSku ?? "-"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <p className="truncate" title={request.orderId ?? ""}>{request.orderId ?? "-"}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="truncate font-medium">{request.customerName ?? "-"}</p>
                    <p className="truncate text-xs text-muted-foreground">{request.customerEmail ?? "-"}</p>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <Badge className={statusClass(request.status)}>{request.status ?? "pending"}</Badge>
                </TableCell>
                <TableCell className="align-top">{formatAmount(request.productPrice)}</TableCell>
                <TableCell className="align-top">
                  <ReasonDialog title="Return Reason" reason={request.reason} />
                </TableCell>
                <TableCell className="align-top">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={request.images.length === 0}
                        className="gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        {request.images.length}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Return Request Images</DialogTitle>
                        <DialogDescription>
                          Images uploaded for {request.productName ?? "this return request"}.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {request.images.map((image) => (
                          <a
                            key={image.id}
                            href={getImageUrl(image.imageUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="block overflow-hidden rounded-md border bg-muted"
                          >
                            <div className="relative h-48 w-full">
                              <Image
                                src={getImageUrl(image.imageUrl)}
                                alt="Return request attachment"
                                fill
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                className="object-cover"
                              />
                            </div>
                          </a>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="align-top text-right">
                  {request.status === "pending" || !request.status ? (
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() => openActionDialog(request, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => openActionDialog(request, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Done</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-gray-600">
                No return requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={Boolean(activeRequest)} onOpenChange={(open) => !open && closeActionDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approved" ? "Approve Return Request" : "Reject Return Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approved"
                ? "Confirm that the customer refund is done before approving this request."
                : "Add the reason that will be saved with this rejected request."}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">{activeRequest?.productName ?? "Return item"}</p>
            <p className="break-all text-muted-foreground">Order: {activeRequest?.orderId ?? "-"}</p>
          </div>

          <Textarea
            value={adminReason}
            onChange={(event) => setAdminReason(event.target.value)}
            placeholder={actionType === "approved" ? "Refund confirmation note" : "Reject reason"}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeActionDialog}>
              Close
            </Button>
            <Button
              type="button"
              disabled={isPending || !adminReason.trim()}
              onClick={submitStatus}
            >
              {actionType === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function ReasonDialog({ title, reason }: { title: string; reason: string | null }) {
  if (!reason) return <span className="text-sm text-muted-foreground">-</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="max-h-[55vh] overflow-y-auto whitespace-pre-wrap break-words rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
          {reason}
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default ReturnRequestsTable;
