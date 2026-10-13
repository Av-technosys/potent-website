/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Info,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  cancelUserSubscription,
  pauseUserSubscription,
  resumeUserSubscription,
} from "@/helper/subscription/action";

const CANCEL_REASONS = [
  "I have enough stock for now",
  "I want to change my plan, size or quantity",
  "My cycle or schedule has changed",
  "Taking a break or travelling",
  "Cost / budget reasons",
  "Other",
];

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function getFutureSchedule(subscription: any): {
  nextDeliveries: Date[];
  nextCharge: Date;
} {
  const now = new Date();
  const stepDays =
    Number(subscription.frequencyInDays) ||
    (subscription.subscriptionType === "every_2_months"
      ? 60
      : subscription.subscriptionType === "cycle_sync"
        ? 28
        : 30);

  let d1 = subscription.nextOrderDate
    ? new Date(subscription.nextOrderDate)
    : subscription.startDate
      ? addDays(new Date(subscription.startDate), stepDays)
      : addDays(now, stepDays);

  if (Number.isNaN(d1.getTime())) {
    d1 = addDays(now, stepDays);
  }

  while (d1 <= now) {
    d1 = addDays(d1, stepDays);
  }

  const d2 = addDays(d1, stepDays);
  const d3 = addDays(d1, stepDays * 2);

  let nextCharge: Date;
  if (subscription.subscriptionType === "cycle_sync") {
    // First box (d1) is already paid today; Next Charge Date must map to Box 2's charge date (5 days before Box 2's delivery date d2).
    const box2ChargeDate = addDays(d2, -5);
    const parsedCharge = subscription.chargeDate
      ? new Date(subscription.chargeDate)
      : null;
    const d1EndOfDay = new Date(
      d1.getFullYear(),
      d1.getMonth(),
      d1.getDate(),
      23,
      59,
      59,
      999,
    );
    if (
      parsedCharge &&
      !Number.isNaN(parsedCharge.getTime()) &&
      parsedCharge > d1EndOfDay
    ) {
      nextCharge = parsedCharge;
    } else {
      nextCharge = box2ChargeDate;
    }
  } else {
    nextCharge = subscription.chargeDate
      ? new Date(subscription.chargeDate)
      : new Date(d1);

    if (Number.isNaN(nextCharge.getTime())) {
      nextCharge = new Date(d1);
    }
  }

  while (nextCharge <= now) {
    nextCharge = addDays(nextCharge, stepDays);
  }

  return {
    nextDeliveries: [d1, d2, d3],
    nextCharge,
  };
}

function formatDate(date?: string | Date | null) {
  if (!date) return "Not scheduled";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Not scheduled";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmountInRupees(amount?: number | null) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "—";
  }
  const num = Number(amount);
  return Number.isInteger(num)
    ? `₹${num.toLocaleString("en-IN")}`
    : `₹${num.toFixed(2)}`;
}

function getPlanScheduleDescription(subscription: any) {
  if (subscription.subscriptionType === "cycle_sync") {
    return "Cycle Sync · arrives about 5 days before your period";
  }
  if (subscription.subscriptionType === "every_2_months") {
    return "Every 2 Months · delivered every 60 days";
  }
  return "Monthly · delivered every 30 days";
}

function getCleanSizeLabel(subscription: any): string | null {
  const productName = String(subscription.productName || "").trim();
  const candidate = String(
    subscription.sizeName ?? subscription.variantName ?? "",
  ).trim();
  if (!candidate) return null;
  if (candidate.toLowerCase() === productName.toLowerCase()) return null;
  if (candidate.toLowerCase() === "product") return null;
  return candidate;
}

export function SubscriptionsClient({
  initialSubscriptions,
}: {
  initialSubscriptions: any[];
}) {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "pause" | "resume" | "cancel" | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const [showPastSubscriptions, setShowPastSubscriptions] = useState(false);

  // 3-step cancel flow state
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelStep, setCancelStep] = useState<1 | 2 | 3>(1);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const openCancelFlow = (subscription: any) => {
    setCancelTarget(subscription);
    setCancelStep(1);
    setSelectedReason("");
    setCustomReason("");
  };

  const closeCancelFlow = () => {
    if (isPending) return;
    setCancelTarget(null);
    setCancelStep(1);
    setSelectedReason("");
    setCustomReason("");
  };

  const handlePause = (subscriptionId: number, fromCancelModal = false) => {
    setPendingId(subscriptionId);
    setPendingAction("pause");

    startTransition(async () => {
      const result = await pauseUserSubscription(subscriptionId);

      if (!result.success) {
        toast.error(result.message ?? "Failed to pause subscription");
        setPendingId(null);
        setPendingAction(null);
        return;
      }

      setSubscriptions((current) =>
        current.map((item) =>
          item.id === subscriptionId
            ? {
                ...item,
                isPaused: true,
                pausedAt: result.pausedAt ?? new Date().toISOString(),
              }
            : item,
        ),
      );
      toast.success("Subscription paused");
      setPendingId(null);
      setPendingAction(null);
      if (fromCancelModal) {
        setCancelTarget(null);
      }
      router.refresh();
    });
  };

  const handleResume = (subscriptionId: number) => {
    setPendingId(subscriptionId);
    setPendingAction("resume");

    startTransition(async () => {
      const result = await resumeUserSubscription(subscriptionId);

      if (!result.success) {
        toast.error(result.message ?? "Failed to resume subscription");
        setPendingId(null);
        setPendingAction(null);
        return;
      }

      setSubscriptions((current) =>
        current.map((item) =>
          item.id === subscriptionId
            ? {
                ...item,
                isPaused: false,
                pausedAt: null,
                nextOrderDate: result.nextOrderDate ?? item.nextOrderDate,
                chargeDate: result.chargeDate ?? item.chargeDate,
              }
            : item,
        ),
      );
      toast.success("Subscription resumed");
      setPendingId(null);
      setPendingAction(null);
      router.refresh();
    });
  };

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    const subscriptionId = cancelTarget.id;
    const finalReason =
      selectedReason === "Other"
        ? customReason.trim() || "Other"
        : selectedReason;

    setPendingId(subscriptionId);
    setPendingAction("cancel");

    startTransition(async () => {
      const result = await cancelUserSubscription(subscriptionId, finalReason);

      if (!result.success) {
        toast.error(result.message ?? "Failed to cancel subscription");
        setPendingId(null);
        setPendingAction(null);
        return;
      }

      setSubscriptions((current) =>
        current.map((item) =>
          item.id === subscriptionId
            ? {
                ...item,
                isActive: false,
                isPaused: false,
                endDate: new Date().toISOString(),
                cancelReason: finalReason || null,
              }
            : item,
        ),
      );
      toast.success(result.message ?? "Subscription cancelled");
      setPendingId(null);
      setPendingAction(null);
      setCancelTarget(null);
      router.refresh();
    });
  };

  // Partition into active/paused vs cancelled
  const activeAndPaused = subscriptions
    .filter((s) => Boolean(s.isActive))
    .sort((a, b) => {
      if (Boolean(a.isPaused) !== Boolean(b.isPaused)) {
        return a.isPaused ? 1 : -1;
      }
      return b.id - a.id;
    });

  const pastSubscriptions = subscriptions
    .filter((s) => !s.isActive)
    .sort((a, b) => b.id - a.id);

  if (subscriptions.length === 0) {
    return (
      <Card className="border-none bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-950">Subscriptions</h1>
        <p className="mt-2 text-sm text-gray-500">
          You do not have any subscriptions yet.
        </p>
        <div className="mt-5">
          <Button
            asChild
            className="rounded-xl bg-[#016271] text-white hover:bg-[#014d59]"
          >
            <Link href="/shop">Explore Products</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-none bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-950">Subscriptions</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pause or cancel in two clicks. Manage your recurring deliveries and
              Cycle Sync plans.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#016271]/15 bg-[#F2F9FA] px-4 py-3 text-xs text-[#004851]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#016271]" />
          <p>
            Need to change your plan, size or quantity? Simply cancel your
            current subscription and start a new one on the product page.
          </p>
        </div>
      </Card>

      {/* Active & Paused Subscriptions First */}
      <div className="space-y-4">
        {activeAndPaused.length === 0 ? (
          <Card className="border border-dashed border-gray-200 bg-white p-6 text-center shadow-xs">
            <p className="text-sm font-medium text-gray-700">
              You have no active or paused subscriptions right now.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Subscribe on any product page for up to 15% off on autopilot.
            </p>
          </Card>
        ) : (
          activeAndPaused.map((subscription) => {
            const isPaused = Boolean(subscription.isPaused);
            const isBusy = isPending && pendingId === subscription.id;
            const sizeLabel = getCleanSizeLabel(subscription);
            const { nextDeliveries, nextCharge } =
              getFutureSchedule(subscription);

            return (
              <Card
                key={subscription.id}
                className={`overflow-hidden border bg-white shadow-sm transition-all ${
                  isPaused
                    ? "border-amber-200/80 bg-amber-50/10"
                    : "border-gray-100"
                }`}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      {/* Title + Size Once + Status Badge */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-lg font-bold text-gray-950">
                          {subscription.productName}
                          {sizeLabel ? (
                            <span className="ml-2 inline-flex items-center rounded-md bg-[#E2F4F7] px-2.5 py-0.5 text-xs font-bold text-[#016271]">
                              Size: {sizeLabel}
                            </span>
                          ) : null}
                        </h2>

                        {isPaused ? (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Paused
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Active
                          </Badge>
                        )}
                      </div>

                      {/* Plan Rhythm Line */}
                      <div className="flex items-center gap-2 text-sm font-medium text-[#016271]">
                        {subscription.subscriptionType === "cycle_sync" ? (
                          <Sparkles className="h-4 w-4 shrink-0 text-[#016271]" />
                        ) : (
                          <CalendarClock className="h-4 w-4 shrink-0 text-[#016271]" />
                        )}
                        <span>{getPlanScheduleDescription(subscription)}</span>
                      </div>

                      {/* Next 3 Delivery Dates + Next Charge + Amount in ₹ */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        {/* Next 3 delivery dates */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 sm:col-span-1">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Truck className="h-3.5 w-3.5 text-[#016271]" />
                            <span>Next 3 Deliveries</span>
                          </div>
                          {isPaused ? (
                            <p className="mt-1.5 text-xs font-semibold text-amber-700">
                              Deliveries on hold while paused
                            </p>
                          ) : (
                            <ul className="mt-1.5 space-y-1 text-xs font-semibold text-gray-900">
                              {nextDeliveries.map((d, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-1.5"
                                >
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#016271]" />
                                  <span>{formatDate(d)}</span>
                                  {idx === 0 && (
                                    <span className="rounded bg-[#016271]/10 px-1.5 py-0.2 text-[10px] font-bold text-[#016271]">
                                      Next
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Next Charge Date */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                          <p className="text-xs font-medium text-gray-500">
                            Next Charge Date
                          </p>
                          <p className="mt-1.5 text-sm font-bold text-gray-950">
                            {isPaused
                              ? "Paused (No charge)"
                              : formatDate(nextCharge)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            Auto-billed via Razorpay
                          </p>
                        </div>

                        {/* Amount in ₹ */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
                          <p className="text-xs font-medium text-gray-500">
                            Amount per Delivery
                          </p>
                          <p className="mt-1.5 text-base font-bold text-gray-950">
                            {formatAmountInRupees(subscription.amount)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            Subscriber savings included
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Pause / Resume next to Cancel */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2.5 lg:flex-col lg:items-end">
                      <div className="flex items-center gap-2">
                        {isPaused ? (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isBusy}
                            onClick={() => handleResume(subscription.id)}
                            className="border-[#016271] bg-[#016271] text-white hover:bg-[#014d59] hover:text-white"
                          >
                            <PlayCircle className="mr-1.5 h-4 w-4" />
                            {isBusy && pendingAction === "resume"
                              ? "Resuming..."
                              : "Resume"}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isBusy}
                            onClick={() => handlePause(subscription.id)}
                            className="border-amber-300 text-amber-800 hover:bg-amber-50"
                          >
                            <PauseCircle className="mr-1.5 h-4 w-4" />
                            {isBusy && pendingAction === "pause"
                              ? "Pausing..."
                              : "Pause"}
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => openCancelFlow(subscription)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="mr-1.5 h-4 w-4" />
                          {isBusy && pendingAction === "cancel"
                            ? "Cancelling..."
                            : "Cancel"}
                        </Button>
                      </div>

                      {subscription.orderId && (
                        <Button
                          asChild
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-[#016271] hover:bg-[#016271]/5"
                        >
                          <Link
                            href={`/order-confirmation/${subscription.orderId}`}
                          >
                            View Latest Order →
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Cancelled Ones Folded Under "Past subscriptions" */}
      {pastSubscriptions.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowPastSubscriptions((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 text-left shadow-xs transition hover:bg-gray-50"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-gray-800">
                Past subscriptions
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {pastSubscriptions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <span>{showPastSubscriptions ? "Hide" : "Show"}</span>
              {showPastSubscriptions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {showPastSubscriptions && (
            <div className="mt-3 space-y-3">
              {pastSubscriptions.map((subscription) => {
                const sizeLabel = getCleanSizeLabel(subscription);

                return (
                  <Card
                    key={subscription.id}
                    className="border border-gray-100 bg-gray-50/60 shadow-none"
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-gray-700">
                              {subscription.productName}
                              {sizeLabel ? (
                                <span className="ml-2 inline-flex items-center rounded-md bg-gray-200/80 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                  Size: {sizeLabel}
                                </span>
                              ) : null}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-gray-300 text-gray-500"
                            >
                              Cancelled
                            </Badge>
                          </div>

                          <p className="text-xs text-gray-500">
                            {getPlanScheduleDescription(subscription)} ·{" "}
                            <span className="font-semibold text-gray-700">
                              {formatAmountInRupees(subscription.amount)}
                            </span>
                            {subscription.endDate
                              ? ` · Ended ${formatDate(subscription.endDate)}`
                              : ""}
                          </p>
                        </div>

                        {subscription.orderId && (
                          <Button
                            asChild
                            type="button"
                            variant="outline"
                            size="sm"
                            className="self-start border-gray-300 text-xs text-gray-600 sm:self-center"
                          >
                            <Link
                              href={`/order-confirmation/${subscription.orderId}`}
                            >
                              View Past Order
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3-Step Cancel Modal */}
      <AlertDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) closeCancelFlow();
        }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl">
          {cancelTarget && cancelStep === 1 && (
            <>
              <AlertDialogHeader>
                <div className="mb-1 text-xs font-bold tracking-wider text-[#016271] uppercase">
                  Step 1 of 3 · Optional Reason
                </div>
                <AlertDialogTitle className="text-lg font-bold text-gray-950">
                  Why would you like to cancel?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-gray-500">
                  Sharing a quick reason is optional and helps us improve. Note:
                  to change your plan, size or quantity, cancel this subscription
                  and start a new one.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="my-2 space-y-2">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-xs font-medium transition ${
                      selectedReason === reason
                        ? "border-[#016271] bg-[#F2F9FA] text-[#004851]"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-[#016271]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}

                {selectedReason === "Other" && (
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Tell us a little more (optional)"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-[#016271] focus:outline-none"
                  />
                )}
              </div>

              <AlertDialogFooter className="flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeCancelFlow}
                  className="text-xs"
                >
                  Keep Subscription
                </Button>
                <Button
                  type="button"
                  onClick={() => setCancelStep(2)}
                  className="bg-[#016271] text-xs text-white hover:bg-[#014d59]"
                >
                  Continue →
                </Button>
              </AlertDialogFooter>
            </>
          )}

          {cancelTarget && cancelStep === 2 && (
            <>
              <AlertDialogHeader>
                <div className="mb-1 text-xs font-bold tracking-wider text-amber-700 uppercase">
                  Step 2 of 3 · Pause Instead?
                </div>
                <AlertDialogTitle className="text-lg font-bold text-gray-950">
                  Would you prefer to pause instead?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs leading-relaxed text-gray-600">
                  If you just need a break or already have enough packs on hand,
                  you can <strong>pause</strong> your subscription now. You won’t
                  be charged while paused, and you can resume in one click
                  whenever you’re ready.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="my-3 flex flex-col gap-2.5">
                {!cancelTarget.isPaused && (
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={() => handlePause(cancelTarget.id, true)}
                    className="w-full rounded-xl bg-[#016271] py-5 text-sm font-bold text-white hover:bg-[#014d59]"
                  >
                    <PauseCircle className="mr-2 h-4 w-4" />
                    {isPending && pendingAction === "pause"
                      ? "Pausing Subscription..."
                      : "Pause Subscription Instead"}
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setCancelStep(3)}
                  className="w-full rounded-xl border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  No thanks, continue to cancel →
                </Button>
              </div>

              <AlertDialogFooter className="flex-row justify-between sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setCancelStep(1)}
                  className="text-xs text-gray-500"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={closeCancelFlow}
                  className="text-xs text-gray-700"
                >
                  Keep Subscription
                </Button>
              </AlertDialogFooter>
            </>
          )}

          {cancelTarget && cancelStep === 3 && (
            <>
              <AlertDialogHeader>
                <div className="mb-1 text-xs font-bold tracking-wider text-red-600 uppercase">
                  Step 3 of 3 · Confirm Cancellation
                </div>
                <AlertDialogTitle className="text-lg font-bold text-gray-950">
                  Confirm subscription cancellation
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs leading-relaxed text-gray-600">
                  Are you sure you want to cancel{" "}
                  <strong>
                    {cancelTarget.productName}
                    {getCleanSizeLabel(cancelTarget)
                      ? ` (${getCleanSizeLabel(cancelTarget)})`
                      : ""}
                  </strong>
                  ? Future deliveries and charges will stop immediately. To
                  change your plan, size or quantity, you can start a new
                  subscription anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-4 flex-row justify-between gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setCancelStep(2)}
                  className="text-xs text-gray-500"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={closeCancelFlow}
                  className="text-xs"
                >
                  Keep Subscription
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={handleConfirmCancel}
                  className="bg-red-600 text-xs font-bold text-white hover:bg-red-700"
                >
                  {isPending && pendingAction === "cancel"
                    ? "Cancelling..."
                    : "Confirm Cancel"}
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
