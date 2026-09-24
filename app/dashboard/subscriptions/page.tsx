/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getUserSubscriptions } from "@/helper/subscription/action";
import { SubscriptionsClient } from "./SubscriptionsClient";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const result = await getUserSubscriptions();

  if (!result.success && result.message === "UNAUTHORIZED") {
    redirect("/login");
  }

  return (
    <SubscriptionsClient initialSubscriptions={result.subscriptions ?? []} />
  );
}
