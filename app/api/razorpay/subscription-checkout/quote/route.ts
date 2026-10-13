// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {
  getSubscriptionCheckoutQuote,
  normalizeSubscriptionCheckoutItem,
} from "@/lib/subscriptionCheckout";
import { requireUserWithRefresh } from "@/helper/user/action";

export async function POST(req: Request) {
  try {
    await requireUserWithRefresh();
    const body = await req.json();
    const item = normalizeSubscriptionCheckoutItem(body);
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
          slug: quote.product.slug,
          title: quote.product.name,
          variantName: quote.variantLabel || quote.variant.name,
          sku: quote.variant.sku,
          image: quote.variant.bannerImage ?? quote.product.bannerImage,
          price: Math.round(
            quote.discountedSubtotal / Math.max(1, Number(quote.quantity || 1)),
          ),
          originalPrice: Math.round(
            quote.subtotal / Math.max(1, Number(quote.quantity || 1)),
          ),
          quantity: quote.quantity,
          subscriptionType: quote.subscriptionType,
          firstDeliveryDate: quote.firstDeliveryDate,
          nextOrderDate: quote.nextOrderDate,
          nextChargeDate: quote.nextChargeDate,
          mixBoxRecipe: quote.mixBoxRecipe,
          totalPads: quote.totalPads,
          boxCount: quote.boxCount,
          freeLiners: quote.freeLiners,
        },
      ],
      subtotal: quote.subtotal,
      discountedSubtotal: quote.discountedSubtotal,
      discount: quote.discount,
      discountAmount: quote.discount,
      discountPercentage: quote.discountPercentage,
      final: quote.final,
      shipping: quote.shipping,
      label: quote.label,
      variantLabel: quote.variantLabel,
      firstDeliveryDate: quote.firstDeliveryDate,
      nextOrderDate: quote.nextOrderDate,
      nextChargeDate: quote.nextChargeDate,
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
