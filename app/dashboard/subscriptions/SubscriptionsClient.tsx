/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { cancelUserSubscription } from "@/helper/subscription/action";

function formatDate(date?: string | Date | null) {
  if (!date) return "Not scheduled";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getSubscriptionLabel(subscriptionType?: string | null) {
  if (subscriptionType === "every_2_months") return "Every 2 Months";
  if (subscriptionType === "cycle_sync") return "Cycle Sync";
  return "Monthly";
}

export function SubscriptionsClient({
  initialSubscriptions,
}: {
  initialSubscriptions: any[];
}) {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const cancelSubscription = (subscriptionId: number) => {
    setPendingId(subscriptionId);

    startTransition(async () => {
      const result = await cancelUserSubscription(subscriptionId);

      if (!result.success) {
        toast.error(result.message ?? "Failed to cancel subscription");
        setPendingId(null);
        return;
      }

      setSubscriptions((current) =>
        current.map((item) =>
          item.id === subscriptionId
            ? { ...item, isActive: false, endDate: new Date() }
            : item,
        ),
      );
      toast.success(result.message ?? "Subscription cancelled");
      setPendingId(null);
      router.refresh();
    });
  };

  if (subscriptions.length === 0) {
    return (
      <Card className="border-none bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-950">Subscriptions</h1>
        <p className="mt-2 text-sm text-gray-500">
          You do not have any subscriptions yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-950">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your recurring deliveries and Cycle Sync orders.
        </p>
      </Card>

      <div className="space-y-4">
        {subscriptions.map((subscription) => {
          const isCancelling = isPending && pendingId === subscription.id;

          return (
            <Card
              key={subscription.id}
              className="overflow-hidden border-none bg-white shadow-sm"
            >
              <CardContent className="p-0">
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-950">
                        {subscription.productName}
                      </h2>
                      <Badge
                        variant={subscription.isActive ? "default" : "outline"}
                        className={
                          subscription.isActive
                            ? "bg-green-100 text-green-700"
                            : "text-gray-500"
                        }
                      >
                        {subscription.isActive ? "Active" : "Cancelled"}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <PackageCheck className="h-4 w-4 text-[#016271]" />
                        <span>
                          {subscription.variantName}
                          {subscription.sku
                            ? ` | SKU: ${subscription.sku}`
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-[#016271]" />
                        <span>
                          {getSubscriptionLabel(subscription.subscriptionType)}
                          {subscription.frequencyInDays
                            ? ` | Every ${subscription.frequencyInDays} days`
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Next Delivery</p>
                        <p className="mt-1 font-semibold text-gray-950">
                          {formatDate(subscription.nextOrderDate)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Next Charge</p>
                        <p className="mt-1 font-semibold text-gray-950">
                          {formatDate(subscription.chargeDate)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="mt-1 font-semibold text-gray-950">
                          {subscription.amount
                            ? `Rs. ${subscription.amount.toFixed(2)}`
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    {subscription.orderId ? (
                      <Button
                        asChild
                        type="button"
                        variant="outline"
                        className="border-[#016271]/30 text-[#016271] hover:bg-[#016271]/5"
                      >
                        <Link
                          href={`/order-confirmation/${subscription.orderId}`}
                        >
                          View Order
                        </Link>
                      </Button>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        Order pending
                      </span>
                    )}

                    {subscription.isActive && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isCancelling}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            {isCancelling ? "Cancelling..." : "Cancel"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel this subscription?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will cancel the Razorpay subscription
                              immediately. A cancelled subscription cannot be
                              reactivated.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isCancelling}>
                              Keep Subscription
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={isCancelling}
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() =>
                                cancelSubscription(subscription.id)
                              }
                            >
                              Cancel Subscription
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
