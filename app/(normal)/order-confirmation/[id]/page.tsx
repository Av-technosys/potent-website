/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import { getOrderConfirmationById } from "@/helper/order/action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";

export const dynamic = "force-dynamic";

function formatMoney(amount?: number | null) {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
}

function formatDate(date?: string | Date | null) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function OrderConfirmationPage({ params }: any) {
  const { id } = await params;
  let order;

  try {
    order = await getOrderConfirmationById(id);
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      redirect(
        `/login?redirect=${encodeURIComponent(`/order-confirmation/${id}`)}`,
      );
    }

    throw error;
  }

  if (!order) notFound();

  const isConfirmed = order.status === "paid";
  const gatewayPayment: any = order.gatewayConfirmation?.gatewayPayment;
  const gatewayStatus =
    gatewayPayment?.status ?? order.payment?.paymentStatus ?? "pending";

  return (
    <main className="min-h-screen bg-[#FDFCF9] px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
              isConfirmed ? "bg-green-100" : "bg-amber-100"
            }`}
          >
            {isConfirmed ? (
              <CheckCircle2 className="h-8 w-8 text-green-700" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-700" />
            )}
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-950">
            {isConfirmed ? "Order Confirmed" : "Payment Status Pending"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {order.gatewayConfirmation?.message ??
              "We are checking the payment status with Razorpay."}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Badge className="bg-[#016271] text-white">
              Order #{String(order.id).slice(0, 8)}
            </Badge>
            <Badge variant="outline">Payment: {gatewayStatus}</Badge>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-[#016271]" />
              <h2 className="text-lg font-bold text-gray-950">Items</h2>
            </div>

            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-950">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.productSKU ? `SKU: ${item.productSKU}` : ""}
                      {item.quantity ? ` | Qty: ${item.quantity}` : ""}
                    </p>
                    {item.mixBoxRecipe && (
                      <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                        <p>Mix: {formatMixBoxRecipe(item.mixBoxRecipe)}</p>
                        <p>
                          {item.totalPads ?? 0} pads, {item.boxCount ?? 0} box
                          {Number(item.boxCount ?? 0) === 1 ? "" : "es"},{" "}
                          {item.freeLiners ?? Number(item.boxCount ?? 0) * 4}{" "}
                          free liners
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gray-950">
                    {formatMoney(
                      Number(item.productPrice || 0) *
                        Number(item.quantity || 1),
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#016271]" />
              <h2 className="text-lg font-bold text-gray-950">Summary</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Order Date</span>
                <span className="font-medium text-gray-950">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment ID</span>
                <span className="max-w-40 truncate font-medium text-gray-950">
                  {order.payment?.gatewayPaymentId ?? "Not available"}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t pt-3">
                <span className="font-semibold text-gray-950">Total</span>
                <span className="font-bold text-gray-950">
                  {formatMoney(order.totalAmount)}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p className="font-semibold text-gray-950">Shipping Address</p>
              <p className="mt-2 leading-6 text-gray-600">
                {[order.addressLine1, order.addressLine2]
                  .filter(Boolean)
                  .join(", ")}
                <br />
                {[order.city, order.state, order.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </aside>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 flex-1 rounded-xl bg-[#016271]">
            <Link href="/dashboard/orders">View My Orders</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 flex-1 rounded-xl">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
