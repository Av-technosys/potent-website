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
          {items.map((item: any) => (
            <div
              key={`${item.productId}-${item.sku || "default"}-${item.uuid || item.totalPads || "line"}`}
              className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm sm:flex-row"
            >
              {/* Product Image */}
              <div className="w-full flex-shrink-0 sm:w-[100px]">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="h-auto w-full rounded-md object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col gap-8 sm:flex-row sm:justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#333333]">{item.title}</h3>
                  {item.mixBoxRecipe && (
                    <p className="text-xs text-gray-500">
                      Mix: {formatMixBoxRecipe(item.mixBoxRecipe)}
                      <br />
                      {item.totalPads} pads, {item.boxCount} box
                      {item.boxCount === 1 ? "" : "es"}, {item.freeLiners} free
                      liners
                    </p>
                  )}
                  <p className="text-lg font-bold text-[#016271]">
                    ₹{item.price}
                  </p>
                </div>

                {item?.cartSizes && item?.cartSizes.length > 0 ? (
                  <div className="flex w-full flex-1 flex-col gap-3 sm:w-auto">
                    {/* Sizes List */}
                    <div className="space-y-2">
                      {item.cartSizes.map((size: any) => (
                        <div
                          key={size.id}
                          className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                        >
                          <span className="text-sm text-gray-600">
                            {size.name}
                          </span>

                          <span className="rounded-md bg-white px-2 py-0.5 text-sm font-semibold text-gray-800 shadow-sm">
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
                        className="flex items-center gap-2 text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
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
                        <Trash2 className="h-4 w-4" />
                        <span className="font-medium">Remove</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-md hover:bg-gray-100"
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

                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-md hover:bg-gray-100"
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

                      {/* 🗑 Remove Button - Light colored */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
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
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Continue Shopping Button */}
          <button
            onClick={() => router.push("/shop")}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-[#016271] transition-colors hover:text-[#0f6b7a]"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}
