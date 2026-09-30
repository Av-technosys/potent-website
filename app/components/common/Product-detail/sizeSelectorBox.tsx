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
    <div className="space-y-4 rounded-3xl border border-[#F3E6F0] bg-[#FAF9F5] p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="font-serif text-lg font-semibold text-[#1A150F]">
          Customize Your Box (21 Pads)
        </h2>
        <p className="mt-1 text-xs font-medium text-gray-600">
          Default monthly mix: 6 L + 6 XL + 9 XL+ pads. Adjust quantities to fit your flow.
        </p>
      </div>

      <div className="space-y-3">
        {cartSizes?.map((item: any, index: number) => (
          <div
            key={item.id || index}
            className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-xs"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="font-serif text-base font-semibold text-[#1A150F]">
                  {item.name}
                </span>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  disabled={item.quantity <= 0}
                  onClick={() => updateQty(item.name, "dec")}
                  className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-gray-50 text-gray-700 transition hover:bg-gray-100 disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>

                <span className="min-w-6 text-center font-bold text-[#1A150F]">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  disabled={total >= MAX}
                  onClick={() => updateQty(item.name, "inc")}
                  className={`grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-[#F3E6F0] text-[#7E4D77] transition hover:bg-[#9A5B90] hover:text-white ${
                    total >= MAX ? "opacity-30 pointer-events-none" : ""
                  }`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-[#F3E6F0] px-4 py-3 text-sm font-semibold text-[#7E4D77]">
        <span>Your Box Contains</span>
        <span className="rounded-full bg-[#9A5B90] px-3 py-1 text-xs text-white">
          {total} / 21 pads
        </span>
      </div>

      {multiplierOptions.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Multiply current mix
            </span>
            <div className="flex flex-wrap gap-2">
              {multiplierOptions.map((multiplier) => (
                <button
                  key={multiplier}
                  type="button"
                  onClick={() => multiplyCurrentMix(multiplier)}
                  className="rounded-full border border-[#9A5B90] bg-[#F3E6F0] px-3.5 py-1.5 text-xs font-bold text-[#7E4D77] transition hover:bg-[#9A5B90] hover:text-white"
                >
                  {multiplier}x Boxes
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p
        className={`text-xs font-bold ${
          validation.valid ? "text-emerald-700" : "text-rose-600"
        }`}
      >
        {validation.valid
          ? `✓ ${selectedBoxCount} box${
              total === MIX_BOX_PAD_UNIT ? "" : "es"
            } ready for checkout!`
          : getMixBoxAdjustmentMessage(total)}
      </p>
    </div>
  );
}
