"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateCancelRequestStatus } from "@/helper/order/action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type CancelRequestRow = {
  id: string;
  orderId: string;
  userId: string;
  userReason: string | null;
  adminReason: string | null;
  status: "pending" | "approved" | "rejected" | "refunded" | null;
  createdAt: Date;
  orderStatus: string | null;
  totalAmount: number | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
};

interface Props {
  requests: CancelRequestRow[];
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

function statusClass(status: CancelRequestRow["status"]) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "refunded") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
}

const CancelRequestsTable = ({ requests, page, pageSize }: Props) => {
  const startIndex = (page - 1) * pageSize;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeRequest, setActiveRequest] = useState<CancelRequestRow | null>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [adminReason, setAdminReason] = useState("");

  const openActionDialog = (request: CancelRequestRow, status: "approved" | "rejected") => {
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
      const result = await updateCancelRequestStatus(activeRequest.id, actionType, adminReason);
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
            <TableHead className="w-[16%]">Order ID</TableHead>
            <TableHead className="w-[18%]">Customer</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[11%]">Order Status</TableHead>
            <TableHead className="w-[9%]">Amount</TableHead>
            <TableHead className="w-[9%]">User Reason</TableHead>
            <TableHead className="w-[9%]">Admin Reason</TableHead>
            <TableHead className="w-[13%] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <TableRow key={request.id} className="align-top">
                <TableCell className="align-top">{startIndex + index + 1}</TableCell>
                <TableCell className="align-top font-medium">
                  <p className="truncate" title={request.orderId}>{request.orderId}</p>
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
                <TableCell className="align-top capitalize">{request.orderStatus ?? "-"}</TableCell>
                <TableCell className="align-top">{formatAmount(request.totalAmount)}</TableCell>
                <TableCell className="align-top">
                  <ReasonDialog title="User Reason" reason={request.userReason} />
                </TableCell>
                <TableCell className="align-top">
                  <ReasonDialog title="Admin Reason" reason={request.adminReason} />
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
                No cancel requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={Boolean(activeRequest)} onOpenChange={(open) => !open && closeActionDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approved" ? "Approve Cancel Request" : "Reject Cancel Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approved"
                ? "Confirm that the customer refund is done before approving this request."
                : "Add the reason that will be saved with this rejected request."}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">Order</p>
            <p className="break-all text-muted-foreground">{activeRequest?.orderId}</p>
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

export default CancelRequestsTable;
