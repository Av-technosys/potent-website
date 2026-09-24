// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSubscriptionCheckoutQuote } from "@/lib/subscriptionCheckout";
import { requireUserWithRefresh } from "@/helper/user/action";

export async function POST(req: Request) {
  try {
    await requireUserWithRefresh();
    const { item } = await req.json();
    const quote = await getSubscriptionCheckoutQuote(item);

    if (!quote.success) {
      return NextResponse.json(quote, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      items: [
        {
          productId: quote.product.id,
          productVariantId: quote.variant.id,
          title: quote.product.name,
          variantName: quote.variant.name,
          sku: quote.variant.sku,
          image: quote.variant.bannerImage ?? quote.product.bannerImage,
          price: quote.final,
          quantity: quote.quantity,
          subscriptionType: quote.subscriptionType,
          mixBoxRecipe: quote.mixBoxRecipe,
          totalPads: quote.totalPads,
          boxCount: quote.boxCount,
          freeLiners: quote.freeLiners,
        },
      ],
      subtotal: quote.subtotal,
      discount: quote.discount,
      final: quote.final,
      label: quote.label,
      billing: quote.billing,
    });
  } catch (error) {
    console.error("Subscription quote failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate subscription total" },
      { status: 500 },
    );
  }
}
