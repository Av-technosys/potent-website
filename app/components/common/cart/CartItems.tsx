"use client";

import Image from "next/image";
import { Minus, Plus, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { getImageUrl } from "@/lib/imageUrl";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";
import {
  getCleanProductTitle,
  getCartItemVariantBadge,
} from "@/lib/cartItemDisplay";

import { toast } from "sonner";
import { getProductMaxQuantity, getMaxQuantityMessage } from "@/lib/productQuantityLimits";
import { updateCartQuantity, removeFromCart } from "@/store/cartActions";
import { NEXT_PUBLIC_S3_URL } from "@/env";

export function CartItems() {
  const router = useRouter();

  // ✅ reactive Zustand state
  const items = useCartStore((state) => state.items);

  // Count total packs/units instead of just distinct product rows
  const totalPacks = items.reduce(
    (acc: number, item: any) => acc + Number(item.quantity || 1),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#333333]">Your Bag</h2>
        <p className="text-sm text-[#666666]">
          {totalPacks} {totalPacks === 1 ? "pack" : "packs"} in your bag
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">Your bag is empty</p>
          <button
            onClick={() => router.push("/shop")}
            className="mx-auto flex items-center gap-2 text-sm font-bold text-[#016271]"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Vertical list of items: compact rows on mobile with small thumbnail beside name */}
          <div className="space-y-3 sm:space-y-4">
            {items.map((item: any) => {
              const badge = getCartItemVariantBadge(item);
              const maxQty = getProductMaxQuantity(item);
              const lineTotal = item.price * (item.quantity || 1);

              return (
                <div
                  key={`${item.productId}-${item.productVariantId || item.sku || "default"}-${item.uuid || item.totalPads || "line"}`}
                  className="flex items-start gap-3 sm:gap-4 rounded-xl border border-gray-200/90 bg-white p-3 sm:p-4 shadow-2xs transition-shadow hover:shadow-xs"
                >
                  {/* Small Product Thumbnail beside the name */}
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 aspect-square rounded-lg bg-[#FAF8F3]/80 p-1 border border-gray-100/90 overflow-hidden flex items-center justify-center">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Product Details & Controls */}
                  <div className="flex flex-1 min-w-0 flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-semibold text-[#333333] text-xs sm:text-base line-clamp-2 leading-snug">
                          {getCleanProductTitle(item)}
                        </h3>

                        {badge && !item.mixBoxRecipe && (
                          <div>
                            <span className="inline-flex items-center rounded-md bg-[#F4EFF3] px-2 py-0.5 text-[10.5px] sm:text-xs font-semibold text-[#7E4D77] border border-[#E9DFE7]">
                              {badge}
                            </span>
                          </div>
                        )}

                        {item.mixBoxRecipe && (
                          <p className="text-[10.5px] sm:text-xs text-gray-500 line-clamp-2 leading-snug">
                            Mix: {formatMixBoxRecipe(item.mixBoxRecipe)}
                            <br />
                            {item.totalPads} pads, {item.boxCount} box
                            {item.boxCount === 1 ? "" : "es"},{" "}
                            {item.freeLiners} free liners
                          </p>
                        )}
                      </div>

                      {/* Total per line (Requirement: a total per line) */}
                      <div className="flex items-baseline gap-1.5 sm:text-right shrink-0">
                        <span className="text-sm sm:text-base font-bold text-[#016271]">
                          ₹{lineTotal}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                            (₹{item.price} each)
                          </span>
                        )}
                      </div>
                    </div>

                    {item?.cartSizes && item?.cartSizes.length > 0 ? (
                      <div className="flex w-full flex-1 flex-col gap-2 sm:gap-3">
                        {/* Sizes List */}
                        <div className="space-y-1.5">
                          {item.cartSizes.map((size: any) => (
                            <div
                              key={size.id}
                              className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs sm:text-sm"
                            >
                              <span className="text-gray-600 truncate">
                                {size.name}
                              </span>

                              <span className="rounded-md bg-white px-1.5 py-0.5 text-[11px] sm:text-sm font-semibold text-gray-800 shadow-2xs shrink-0">
                                Qty: {size.qty}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Remove Button */}
                        <div className="flex justify-end pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex h-7 items-center gap-1.5 text-xs text-red-500 transition-all hover:bg-red-50 hover:text-red-600 px-2 cursor-pointer"
                            onClick={() =>
                              removeFromCart(
                                item.productId,
                                item.sku,
                                item?.uuid,
                                item?.cartSizes,
                                item.productVariantId,
                              )
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="font-medium">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Quantity Controls & Remove */
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100 sm:border-0 sm:pt-0">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-lg bg-gray-50 p-0.5 sm:p-1 border border-gray-200/60">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7 rounded-md hover:bg-gray-100 shrink-0 cursor-pointer"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.sku,
                                  item.productVariantId,
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="min-w-6 text-center text-xs sm:text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7 rounded-md hover:bg-gray-100 shrink-0 cursor-pointer"
                              onClick={() => {
                                if (item.quantity >= maxQty) {
                                  toast.info(getMaxQuantityMessage(maxQty));
                                  return;
                                }
                                updateCartQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.sku,
                                  item.productVariantId,
                                );
                              }}
                              disabled={item.quantity >= maxQty}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
                            Max {maxQty}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 px-2 justify-center cursor-pointer"
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.sku,
                              item?.uuid,
                              undefined,
                              item.productVariantId,
                            )
                          }
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={() => router.push("/shop")}
            className="mt-3 flex items-center gap-2 text-sm font-bold text-[#016271] transition-colors hover:text-[#0f6b7a] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}
