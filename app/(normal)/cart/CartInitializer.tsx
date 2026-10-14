/* eslint-disable @typescript-eslint/no-explicit-any */
// app/cart/CartInitializer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';

interface CartInitializerProps {
  initialItems: any[];
}

export function CartInitializer({ initialItems }: CartInitializerProps) {
  const setCart = useCartStore((state) => state.setCart);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!initialItems || initialItems.length === 0) {
      initialized.current = true;
      return;
    }

    const formattedItems = initialItems.map((item: any, idx: number) => ({
      ...item,
      productId: item.productId,
      productVariantId: item.productVariantId,
      sku: item.sku || '',
      slug: item.slug || '',
      title: item.title || 'Product',
      variantName: item.variantName || '',
      image: item.image || '/product.png',
      price: item.price || 0,
      originalPrice: item.originalPrice,
      quantity: item.quantity ?? 0,
      mixBoxRecipe: item.mixBoxRecipe,
      totalPads: item.totalPads,
      boxCount: item.boxCount,
      freeLiners: item.freeLiners,
      isQuantityChangable: !item.mixBoxRecipe && !item.yatraKit,
      yatraKit: item.yatraKit,
      cartSizes: item.cartSizes,
      uuid: item.uuid || item.cartItemId || item.id || `cart-item-${idx}`,
      addedAt: item.addedAt || Date.now(),
    }));

    setCart(formattedItems);
    initialized.current = true;
  }, [initialItems, setCart]);

  return null;
}
