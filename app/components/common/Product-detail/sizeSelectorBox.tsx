"use client";

import { Minus, Plus } from "lucide-react";
import {
  MIX_BOX_MAX_PADS,
  MIX_BOX_PAD_UNIT,
  getMixBoxAdjustmentMessage,
  normalizeMixBoxRecipe,
  normalizePadSize,
  validateMixBoxRecipe,
} from "@/lib/mixYourBox";

export default function SizeSelectorBox({
  items,
  cartSizes,
  setCartSizes,
  total,
  setTotal,
  themeColor,
}: any) {
  const MAX = MIX_BOX_MAX_PADS;

  const updateQty = (name: string, type: string) => {
    const newSizes = cartSizes.map((item: any) => {
      if (item.name !== name) return item;

      if (type === "inc") return { ...item, quantity: item.quantity + 1 };
      return { ...item, quantity: Math.max(0, item.quantity - 1) };
    });

    setCartSizes(newSizes);
    setTotal(
      newSizes.reduce((acc: number, item: any) => acc + item.quantity, 0),
    );
  };

  const validation = validateMixBoxRecipe(
    normalizeMixBoxRecipe(
      cartSizes
        .map((item: any) => {
          const size = normalizePadSize(
            `${item.size ?? ""} ${item.name ?? ""}`,
          );
          return size ? { size, quantity: item.quantity } : null;
        })
        .filter(Boolean),
    ),
  );
  const selectedBoxCount = validation.valid ? total / MIX_BOX_PAD_UNIT : 0;
  const maxMultiplier = validation.valid ? Math.floor(MAX / total) : 0;
  const multiplierOptions = Array.from(
    { length: Math.max(maxMultiplier - 1, 0) },
    (_, index) => index + 2,
  );

  const multiplyCurrentMix = (multiplier: number) => {
    const newSizes = cartSizes.map((item: any) => ({
      ...item,
      quantity: item.quantity * multiplier,
    }));

    setCartSizes(newSizes);
    setTotal(
      newSizes.reduce((acc: number, item: any) => acc + item.quantity, 0),
    );
  };

  return (
    <div
      style={{ borderColor: themeColor.darkColor }}
      className="space-y-4 rounded-3xl border bg-white p-4 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-950">
          Customize your box
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Default monthly mix: 6 L + 6 XL + 9 XL+ pads.
        </p>
      </div>

      <div className="space-y-3">
        {cartSizes?.map((item: any, index: number) => (
          <div
            key={item.id || index}
            className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-gray-950 sm:text-base">
                  {item.name}
                </span>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  disabled={item.quantity <= 0}
                  onClick={() => updateQty(item.name, "dec")}
                  className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>

                <span className="min-w-6 text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  disabled={total >= MAX}
                  onClick={() => updateQty(item.name, "inc")}
                  className={`grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white ${
                    total >= MAX ? "text-gray-300" : "text-teal-600"
                  }`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex justify-between rounded-2xl px-4 py-3 text-sm"
        style={{
          backgroundColor: themeColor.lightColor,
          color: themeColor.textColor,
        }}
      >
        <span>Your box contains</span>
        <span className="font-semibold">{total} pads</span>
      </div>

      {multiplierOptions.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-700">
              Multiply current mix
            </span>
            <div className="flex flex-wrap gap-2">
              {multiplierOptions.map((multiplier) => (
                <button
                  key={multiplier}
                  type="button"
                  onClick={() => multiplyCurrentMix(multiplier)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-300"
                >
                  {multiplier}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p
        className={`text-sm ${
          validation.valid ? "text-green-700" : "text-red-600"
        }`}
      >
        {validation.valid
          ? `${selectedBoxCount} box${
              total === MIX_BOX_PAD_UNIT ? "" : "es"
            } selected.`
          : getMixBoxAdjustmentMessage(total)}
      </p>
    </div>
  );
}
