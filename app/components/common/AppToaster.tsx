"use client";

import { useEffect } from "react";
import { Toaster, toast } from "sonner";

export function AppToaster() {
  useEffect(() => {
    // If user hovers over a standard toast, dismiss it so it never stays stuck/fixed.
    // Keep toasts with interactive action buttons (like Undo) clickable.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const toastEl = target?.closest?.("[data-sonner-toast]");
      if (toastEl && !toastEl.querySelector("[data-button]")) {
        toast.dismiss();
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <Toaster
      position="top-right"
      richColors
      duration={2400}
      offset={{ right: 20, top: 14 }}
      toastOptions={{
        className: "compact-cart-toast",
      }}
    />
  );
}

