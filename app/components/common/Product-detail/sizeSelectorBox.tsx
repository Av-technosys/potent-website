"use client";

import { useEffect, useMemo } from "react";
import { Minus, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  MIX_BOX_DEFAULT_RECIPE,
  MIX_BOX_PAD_UNIT,
  MIX_BOX_SHORTCUTS,
  type MixBoxRecipe,
  type PadSize,
  getMixBoxAdjustmentMessage,
  normalizePadSize,
} from "@/lib/mixYourBox";

const STORAGE_KEY = "ovy_mix_your_box_recipe";

const DEFAULT_PAD_ITEMS = [
  { name: "Ovy Soft Sanitary Pads - L (240mm)", size: "L (240mm)", price: 349 },
  { name: "Ovy Soft Sanitary Pads - XL (280mm)", size: "XL (280mm)", price: 349 },
  { name: "Ovy Soft Sanitary Pads - XL+ (320mm)", size: "XL+ (320mm)", price: 349 },
];

interface SizeSelectorBoxProps {
  items: any[];
  cartSizes: any[];
  setCartSizes: (sizes: any[]) => void;
  total: number;
  setTotal: (total: number) => void;
  boxQuantity?: number;
  setBoxQuantity?: (qty: number) => void;
  subscriptionType?: string | null;
  themeColor?: {
    darkColor?: string;
    lightColor?: string;
    textColor?: string;
  };
}

export default function SizeSelectorBox({
  items,
  cartSizes,
  setCartSizes,
  total,
  setTotal,
  boxQuantity = 1,
  setBoxQuantity,
  subscriptionType = null,
}: SizeSelectorBoxProps) {
  // Max boxes per order based on subscription rules
  // Monthly & Cycle Sync: 1 box per delivery. Every 2 months: up to 2 boxes. One-time: up to 3 boxes.
  const maxBoxesAllowed =
    subscriptionType === "monthly" || subscriptionType === "cycle_sync"
      ? 1
      : subscriptionType === "every_2_months"
        ? 2
        : 3;

  const baseItems = Array.isArray(items) && items.length > 0 ? items : DEFAULT_PAD_ITEMS;

  // Map item list to safe sizes with target values: 6 L, 9 XL, 6 XL+
  const getMappedInitialSizes = (recipe: MixBoxRecipe) => {
    return baseItems.map((item: any) => {
      const padSize = normalizePadSize(`${item.size ?? ""} ${item.name ?? ""}`);
      const qty = padSize ? recipe[padSize] ?? 0 : 0;
      return {
        ...item,
        name: item.name,
        size: item.size || item.name,
        quantity: qty,
        price: Number(item.price || 0),
      };
    });
  };

  const safeCartSizes = useMemo(() => {
    if (
      Array.isArray(cartSizes) &&
      cartSizes.length >= 3 &&
      cartSizes.every((item) => normalizePadSize(`${item.size ?? ""} ${item.name ?? ""}`) !== null)
    ) {
      return cartSizes;
    }
    return getMappedInitialSizes(MIX_BOX_DEFAULT_RECIPE);
  }, [items, cartSizes]);

  const calculatedTotal = safeCartSizes.reduce(
    (acc: number, item: any) => acc + (Number(item.quantity) || 0),
    0,
  );

  // Sync total to parent state if different
  useEffect(() => {
    if (total !== calculatedTotal) {
      setTotal(calculatedTotal);
    }
  }, [calculatedTotal, total, setTotal]);

  // Sync / initialize from localStorage or default recipe
  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreSavedMix = () => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        let targetRecipe = MIX_BOX_DEFAULT_RECIPE;
        if (saved) {
          const parsed = JSON.parse(saved);
          const l = Number(parsed?.L) || 0;
          const xl = Number(parsed?.XL) || 0;
          const xlPlus = Number(parsed?.["XL+"]) || 0;
          if (l + xl + xlPlus === MIX_BOX_PAD_UNIT) {
            targetRecipe = { L: l, XL: xl, "XL+": xlPlus };
          }
        }

        // If cartSizes does not match items length or total is 0, initialize
        if (!Array.isArray(cartSizes) || cartSizes.length < 3 || calculatedTotal === 0) {
          const initialList = getMappedInitialSizes(targetRecipe);
          setCartSizes(initialList);
          const initialTotal = initialList.reduce((acc, i) => acc + (i.quantity || 0), 0);
          setTotal(initialTotal);
        }
      } catch {
        // Fallback to default
      }
    };

    restoreSavedMix();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        restoreSavedMix();
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [items]);

  // Ensure boxQuantity never exceeds maxBoxesAllowed when subscription changes
  useEffect(() => {
    if (setBoxQuantity && boxQuantity > maxBoxesAllowed) {
      setBoxQuantity(maxBoxesAllowed);
    }
  }, [subscriptionType, maxBoxesAllowed, boxQuantity, setBoxQuantity]);

  const saveRecipeToStorage = (sizes: any[]) => {
    if (typeof window === "undefined") return;
    const recipe: MixBoxRecipe = { L: 0, XL: 0, "XL+": 0 };
    sizes.forEach((item) => {
      const size = normalizePadSize(`${item.size ?? ""} ${item.name ?? ""}`);
      if (size) {
        recipe[size] = Number(item.quantity) || 0;
      }
    });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipe));
    } catch {
      // Storage unavailable
    }
  };

  const updateQty = (identifier: string, type: "inc" | "dec") => {
    if (type === "inc" && calculatedTotal >= MIX_BOX_PAD_UNIT) {
      // Counters stop at 21
      return;
    }

    const newSizes = safeCartSizes.map((item: any) => {
      const matches =
        item.name === identifier ||
        item.id === identifier ||
        normalizePadSize(`${item.size ?? ""} ${item.name ?? ""}`) === identifier;

      if (!matches) return item;

      if (type === "inc") {
        return { ...item, quantity: (Number(item.quantity) || 0) + 1 };
      }
      return { ...item, quantity: Math.max(0, (Number(item.quantity) || 0) - 1) };
    });

    const newTotal = newSizes.reduce((acc: number, item: any) => acc + item.quantity, 0);
    setCartSizes(newSizes);
    setTotal(newTotal);
    saveRecipeToStorage(newSizes);
  };

  const applyShortcut = (presetRecipe: MixBoxRecipe) => {
    const sourceList = baseItems.length > 0 ? baseItems : safeCartSizes;
    const newSizes = sourceList.map((item: any) => {
      const size = normalizePadSize(`${item.size ?? ""} ${item.name ?? ""}`);
      const qty = size ? presetRecipe[size] ?? 0 : 0;
      return {
        ...item,
        name: item.name,
        size: item.size || item.name,
        quantity: qty,
        price: Number(item.price || 0),
      };
    });

    const newTotal = newSizes.reduce((acc: number, item: any) => acc + item.quantity, 0);
    setCartSizes(newSizes);
    setTotal(newTotal);
    saveRecipeToStorage(newSizes);
  };

  const isBoxComplete = calculatedTotal === MIX_BOX_PAD_UNIT;
  const adjustmentMsg = getMixBoxAdjustmentMessage(calculatedTotal);

  return (
    <div className="space-y-4 rounded-3xl border border-[#F3E6F0] bg-[#FAF9F5] p-5 shadow-sm sm:p-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A150F]">
            Mix Your Box (21 Pads)
          </h2>
          <span className="rounded-full bg-[#F3E6F0] px-3 py-1 text-xs font-bold text-[#7E4D77]">
            4 Free Liners Included
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-gray-600">
          Default mix: 6 L + 9 XL + 6 XL+ pads. Adjust quantities to fit your flow.
        </p>
      </div>

      {/* Preset / Shortcut Buttons */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
            Flow Shortcuts:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {MIX_BOX_SHORTCUTS.map((sc) => {
            const isSelected = (["L", "XL", "XL+"] as PadSize[]).every((sizeKey) => {
              const item = safeCartSizes.find(
                (i: any) => normalizePadSize(`${i.size ?? ""} ${i.name ?? ""}`) === sizeKey,
              );
              return (item?.quantity ?? 0) === sc.recipe[sizeKey];
            });

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => applyShortcut(sc.recipe)}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? "border-[#9A5B90] bg-[#F3E6F0] text-[#7E4D77] font-bold shadow-xs"
                    : "border-gray-300/80 bg-white text-gray-700 hover:border-[#9A5B90] hover:bg-[#F3E6F0] hover:text-[#7E4D77]"
                }`}
              >
                {sc.name === "Recommended" && (
                  <Sparkles className="mr-1 inline-block h-3 w-3 text-[#9A5B90]" />
                )}
                {sc.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pad Size Steppers */}
      <div className="space-y-2.5">
        {safeCartSizes.map((item: any, index: number) => {
          const isAtLimit = calculatedTotal >= MIX_BOX_PAD_UNIT;
          const padSizeKey = normalizePadSize(`${item.size ?? ""} ${item.name ?? ""}`);
          const displayDetails =
            padSizeKey === "L"
              ? "240mm · Light to Medium flow"
              : padSizeKey === "XL"
                ? "280mm · Regular to Heavy flow"
                : "320mm · Heavy flow & Night coverage";

          return (
            <div
              key={item.id || item.name || index}
              className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-2xs transition-all hover:border-gray-300"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base sm:text-lg font-bold text-[#1A150F]">
                      {item.name}
                    </span>
                    {padSizeKey && (
                      <span className="rounded bg-[#F3E6F0] px-1.5 py-0.5 text-[10px] font-bold text-[#7E4D77]">
                        {padSizeKey}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                    {displayDetails}
                  </p>
                </div>

                {/* Counter Stepper with 21 limit */}
                <div className="flex shrink-0 items-center gap-2.5">
                  <button
                    type="button"
                    disabled={item.quantity <= 0}
                    onClick={() => updateQty(item.name, "dec")}
                    className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-gray-50 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    aria-label={`Decrease ${item.name}`}
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-7 text-center font-bold text-[#1A150F] text-base">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    disabled={isAtLimit}
                    onClick={() => updateQty(item.name, "inc")}
                    className={`grid h-8 w-8 place-items-center rounded-full border transition cursor-pointer ${
                      isAtLimit
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        : "border-[#9A5B90] bg-[#F3E6F0] text-[#7E4D77] hover:bg-[#9A5B90] hover:text-white"
                    }`}
                    aria-label={`Increase ${item.name}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Box Completion Status Card */}
      <div
        className={`rounded-2xl p-4 transition-all ${
          isBoxComplete
            ? "border border-emerald-300 bg-emerald-50 text-emerald-900"
            : calculatedTotal < MIX_BOX_PAD_UNIT
              ? "border border-amber-300 bg-amber-50 text-amber-900"
              : "border border-rose-300 bg-rose-50 text-rose-900"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isBoxComplete ? (
              <CheckCircle2 className="h-5 w-5 flex-none text-emerald-600" />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[11px] font-bold text-white">
                !
              </span>
            )}
            <span className="font-semibold text-xs sm:text-sm">
              {adjustmentMsg}
            </span>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
              isBoxComplete
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {calculatedTotal} / {MIX_BOX_PAD_UNIT} pads
          </span>
        </div>
      </div>

      {/* Box Quantity Selection (Up to 3 boxes per order) */}
      {setBoxQuantity && (
        <div className="pt-2 border-t border-gray-200/80">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              BOXES IN THIS ORDER
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              Up to {maxBoxesAllowed} {maxBoxesAllowed === 1 ? "box" : "boxes"} per order
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {[1, 2, 3].map((num) => {
              const isDisabled = num > maxBoxesAllowed;
              const isSelected = boxQuantity === num;
              return (
                <button
                  key={num}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) {
                      toast.info("Need more? Write to care@potenthygiene.com");
                      return;
                    }
                    setBoxQuantity(num);
                  }}
                  className={`h-10 px-4 cursor-pointer rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${
                    isDisabled
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                      : isSelected
                        ? "border-[#9A5B90] bg-[#9A5B90] text-white shadow-xs"
                        : "border-gray-200/80 bg-white text-[#1A150F] hover:border-[#9A5B90]"
                  }`}
                >
                  {num} {num === 1 ? "Box" : "Boxes"} ({num * 21} pads + {num * 4} liners)
                </button>
              );
            })}
          </div>

          {/* Need more note */}
          <div className="mt-2.5 text-xs text-gray-500">
            Need more? Write to{" "}
            <a
              href="mailto:care@potenthygiene.com"
              className="font-medium text-[#7E4D77] underline hover:text-[#9A5B90]"
            >
              care@potenthygiene.com
            </a>
          </div>

          <div className="mt-3 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-xs leading-relaxed text-gray-600">
            <span className="font-bold text-[#1A150F]">Subscriptions:</span>{" "}
            Monthly and Cycle Sync: 1 box per delivery. Every 2 months: up to 2 boxes. The split stays fixed; to change it she cancels and starts again.
          </div>
        </div>
      )}
    </div>
  );
}
