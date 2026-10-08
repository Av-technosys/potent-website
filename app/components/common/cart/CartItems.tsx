"use client";

import Image from "next/image";
import { Minus, Plus, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { getImageUrl } from "@/lib/imageUrl";
import { formatMixBoxRecipe } from "@/lib/mixYourBox";

import { updateCartQuantity, removeFromCart } from "@/store/cartActions";
import { NEXT_PUBLIC_S3_URL } from "@/env";

export function CartItems() {
  const router = useRouter();

  // ✅ reactive Zustand state
  const items = useCartStore((state) => state.items);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#333333]">Your Cart</h2>
        <p className="text-sm text-[#666666]">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">Your cart is empty</p>
          <button
            onClick={() => router.push("/shop")}
            className="mx-auto flex items-center gap-2 text-sm font-bold text-[#016271]"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
            {items.map((item: any) => (
              <div
                key={`${item.productId}-${item.sku || "default"}-${item.uuid || item.totalPads || "line"}`}
                className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200/90 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:gap-4 sm:p-4"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square flex-shrink-0 sm:w-[100px] sm:h-[100px] bg-[#FAF8F3]/60 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[#333333] text-xs sm:text-base line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    {item.mixBoxRecipe && (
                      <p className="text-[10.5px] sm:text-xs text-gray-500 line-clamp-2 leading-snug">
                        Mix: {formatMixBoxRecipe(item.mixBoxRecipe)}
                        <br />
                        {item.totalPads} pads, {item.boxCount} box
                        {item.boxCount === 1 ? "" : "es"}, {item.freeLiners} free
                        liners
                      </p>
                    )}
                    <p className="text-sm sm:text-lg font-bold text-[#016271]">
                      ₹{item.price}
                    </p>
                  </div>

                  {item?.cartSizes && item?.cartSizes.length > 0 ? (
                    <div className="flex w-full flex-1 flex-col gap-2 sm:w-auto sm:gap-3">
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

                      {/* Divider */}
                      <div className="border-t border-gray-200"></div>

                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex h-7 items-center gap-1.5 text-xs text-red-500 transition-all hover:bg-red-50 hover:text-red-600 px-2"
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
                    <>
                      {/* Quantity Controls & Remove */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 rounded-lg bg-gray-50 p-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-md hover:bg-gray-100 shrink-0 cursor-pointer"
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.sku,
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="min-w-6 text-center text-xs sm:text-sm font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-md hover:bg-gray-100 shrink-0 cursor-pointer"
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.sku,
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* 🗑 Remove Button */}
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
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={() => router.push("/shop")}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-[#016271] transition-colors hover:text-[#0f6b7a] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}
