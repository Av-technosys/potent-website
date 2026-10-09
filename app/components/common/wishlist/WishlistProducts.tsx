"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/imageUrl";
import { useWishlistStore, type WishlistItem, type WishlistVariant } from "@/store/WishlistStore";
import { removeFromWishlist } from "@/store/WishlistActions";
import { addToCart } from "@/store/cartActions";

const getVariant = (item: WishlistItem, variantId?: string): WishlistVariant =>
  item.variants.find((variant) => variant.productVariantId === variantId) ||
  item.variants[0] || {
    productVariantId: item.productVariantId,
    sku: item.sku,
    name: item.title,
    price: item.price || item.basePrice,
    image: item.image,
  };

export default function WishlistProducts() {
  const products = useWishlistStore((state) => state.items);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [busyProductId, setBusyProductId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedVariants((current) => {
      const next = { ...current };
      products.forEach((product) => {
        if (!next[product.productId] || !product.variants.some((variant) => variant.productVariantId === next[product.productId])) {
          next[product.productId] = product.productVariantId || product.variants[0]?.productVariantId;
        }
      });
      return next;
    });
  }, [products]);

  const selectedByProduct = useMemo(() => {
    const result = new Map<string, WishlistVariant>();
    products.forEach((product) => {
      result.set(product.productId, getVariant(product, selectedVariants[product.productId]));
    });
    return result;
  }, [products, selectedVariants]);

  const addToCartHandler = async (product: WishlistItem) => {
    if (busyProductId) return;
    const variant = selectedByProduct.get(product.productId) || getVariant(product);
    let targetVariantId = variant.productVariantId;
    let targetSku = variant.sku;

    // Fallback: If variant ID is a synthetic fallback ID, fetch catalog product to get real variantId
    if ((!targetVariantId || targetVariantId.includes("-default-")) && product.slug) {
      try {
        const res = await fetch(`/api/catalog/products/${encodeURIComponent(product.slug)}`);
        if (res.ok) {
          const payload = await res.json();
          const catalogVars =
            payload.product?.productVariants ||
            payload.product?.prodcutVarientBoxRes ||
            payload.product?.variants ||
            [];
          if (catalogVars.length > 0) {
            targetVariantId = String(catalogVars[0].id || catalogVars[0]._id || catalogVars[0].variantId || targetVariantId);
            targetSku = String(catalogVars[0].sku || targetSku);
          }
        }
      } catch (err) {
        console.error("Failed to resolve real catalog variant for wishlist item:", err);
      }
    }

    const price = Number(variant.price || product.basePrice || product.price);
    setBusyProductId(product.productId);

    try {
      const added = await addToCart({
        productId: product.productId,
        productVariantId: targetVariantId,
        sku: targetSku,
        slug: product.slug || "",
        title: product.title || product.name,
        image: variant.image || product.image || "/product.png",
        price,
        quantity: 1,
        isQuantityChangable: true,
        originalPrice: variant.originalPrice || product.originalPrice,
      });

      if (added) {
        await removeFromWishlist(product.productId);
      }
    } catch (error) {
      console.error("Wishlist add-to-cart failed:", error);
      toast.error("Unable to add this item to cart. Please try again.");
    } finally {
      setBusyProductId(null);
    }
  };

  if (!products.length) {
    return <div className="py-20 text-center text-gray-500">Your wishlist is empty</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const selectedVariant = selectedByProduct.get(product.productId) || getVariant(product);
        const isBusy = busyProductId === product.productId;
        const displayPrice = Number(selectedVariant.price || product.basePrice || product.price);

        return (
          <Card key={product.productId} className="overflow-hidden rounded-3xl border-[#E4DED0] p-0 shadow-sm">
            <CardContent className="p-4">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-[#FAF8F3]">
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.productId)}
                  disabled={isBusy}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute top-3 left-3 z-10 rounded-full bg-white p-2 shadow-sm transition hover:scale-105 disabled:opacity-50"
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </button>
                <Image
                  alt={product.name || product.title}
                  src={getImageUrl(selectedVariant.image || product.image)}
                  width={360}
                  height={360}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="line-clamp-2 font-semibold text-gray-800">{product.name || product.title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-bold text-[#004851]">₹{displayPrice}</span>
                    {selectedVariant.originalPrice && selectedVariant.originalPrice > displayPrice ? (
                      <span className="text-xs text-gray-400 line-through">₹{selectedVariant.originalPrice}</span>
                    ) : null}
                  </div>
                </div>

                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600" htmlFor={`wishlist-variant-${product.productId}`}>
                  Choose variant
                </label>
                <select
                  id={`wishlist-variant-${product.productId}`}
                  value={selectedVariant.productVariantId}
                  onChange={(event) =>
                    setSelectedVariants((current) => ({
                      ...current,
                      [product.productId]: event.target.value,
                    }))
                  }
                  disabled={isBusy}
                  className="w-full rounded-xl border border-[#0B6873] bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none transition focus:ring-2 focus:ring-[#1A8D91]/30 disabled:opacity-60"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.productVariantId} value={variant.productVariantId}>
                      {variant.name}{variant.size && variant.size !== variant.name ? ` (${variant.size})` : ""} - ₹{variant.price}
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  onClick={() => addToCartHandler(product)}
                  disabled={Boolean(busyProductId)}
                  className="w-full rounded-xl bg-[#1A8D91] text-white hover:bg-[#0E7277] disabled:opacity-60"
                >
                  {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingBag className="mr-2 h-4 w-4" />}
                  {isBusy ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
