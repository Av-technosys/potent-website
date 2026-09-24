"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AdminPaymentRow = {
  id: string;
  orderId: string | null;
  paymentId: string | null;
  paymentStatus: string | null;
  paymentMethod: string | null;
  paymentAmount: number | null;
  paymentOrderId: string | null;
  createdAt: Date | null;
  orderStatus: string | null;
  customerName: string | null;
  customerEmail: string | null;
};

interface PaymentTableProps {
  payments: AdminPaymentRow[];
  page: number;
  pageSize: number;
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatAmount(amount: number | null) {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const PaymentTable = ({ payments, page, pageSize }: PaymentTableProps) => {
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="mt-8 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Gateway Order ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <TableRow key={payment.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell className="font-medium">{payment.paymentId ?? "-"}</TableCell>
                <TableCell>{payment.paymentOrderId ?? "-"}</TableCell>
                <TableCell>{payment.orderId ?? "-"}</TableCell>
                <TableCell>
                  <div className="min-w-[180px]">
                    <p className="font-medium">{payment.customerName ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{payment.customerEmail ?? "-"}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{payment.paymentStatus ?? "-"}</span>
                </TableCell>
                <TableCell>{payment.paymentMethod ?? "-"}</TableCell>
                <TableCell>{formatAmount(payment.paymentAmount)}</TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-gray-600">
                No payments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentTable;
