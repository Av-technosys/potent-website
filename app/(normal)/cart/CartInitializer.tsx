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

    const formattedItems = initialItems.map((item: any) => ({
      productId: item.productId,
      sku: item.sku || '',
      slug: item.slug || '',
      title: item.title || 'Product',
      image: item.image || '/product.png',
      price: item.price || 0,
      originalPrice: item.originalPrice,
      quantity: item.quantity ?? 0,
      addedAt: Date.now(),
    }));

    setCart(formattedItems);
    initialized.current = true;
  }, [initialItems, setCart]);

  return null;
}
