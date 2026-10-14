export function getCleanProductTitle(item: any): string {
  let title = item?.title || "Product";

  // Normalize known DB titles that look internal or generic
  if (
    title === "Ovy Teen Packs/Boxes" ||
    item?.slug === "ovy-teen" ||
    item?.slug === "ovy-teen-starter-pack" ||
    item?.slug === "ovy-teen-pads"
  ) {
    return "Ovy Organic Soft Sanitary Pads — Teen";
  }

  // Remove trailing parentheses if they contain variant details that will be rendered in the badge
  // e.g. "Looway Disposable Toilet Seat Covers (2-Pack (50 covers))" -> "Looway Disposable Toilet Seat Covers"
  // e.g. "Ovy Organic Soft Sanitary Pads — Teen (Starter Pack)" -> "Ovy Organic Soft Sanitary Pads — Teen"
  title = title.replace(/\s*\([^)]+(\([^)]*\))*[^)]*\)$/, "").trim();
  title = title.replace(/\s*\([^)]+\)$/, "").trim();

  return title;
}

export function getCartItemVariantBadge(item: any): string | null {
  if (item?.mixBoxRecipe) {
    return null; // Mix box renders custom pad breakdown recipe
  }

  const vName = (item?.variantName || "").trim();
  const slug = (item?.slug || "").toLowerCase();
  const sku = (item?.sku || "").toUpperCase();

  // If title has parentheses, e.g. "(Starter Pack)" or "(2-Pack)"
  let extractedFromName = vName;
  if (!extractedFromName && typeof item?.title === "string") {
    const match =
      item.title.match(/\(([^)]+(\([^)]*\))*[^)]*)\)$/) ||
      item.title.match(/\(([^)]+)\)$/);
    if (match && match[1]) {
      extractedFromName = match[1].trim();
    }
  }

  // 1. Ovy Pads
  if (slug === "ovy-pads" || sku.includes("OVY-PAD")) {
    const raw = (extractedFromName || sku).toUpperCase();
    if (
      raw.includes("XL+") ||
      raw.includes("XLPLUS") ||
      raw.includes("XLP") ||
      raw.includes("320")
    ) {
      return "Size: XL+ (320mm)";
    }
    if (raw.includes("XL") || raw.includes("280")) {
      return "Size: XL (280mm)";
    }
    if (raw.includes("L") || raw.includes("240")) {
      return "Size: L (240mm)";
    }
    if (extractedFromName) return `Size: ${extractedFromName}`;
  }

  // 2. Ovy Teen
  if (slug.includes("teen") || sku.includes("TEEN")) {
    const raw = (extractedFromName || sku).toUpperCase();
    if (raw.includes("PRO")) {
      return "Pro-Active Pack (25-piece kit)";
    }
    if (raw.includes("START")) {
      return "Starter Pack (25-piece kit)";
    }
    if (raw.includes("FIRST") || raw.includes("FPB")) {
      return "First Period Box (50-piece milestone kit)";
    }
    if (extractedFromName) return extractedFromName;
  }

  // 3. Looway Toilet Seat Covers
  if (slug.includes("seat") || sku.includes("SEAT")) {
    const raw = (extractedFromName || sku).toUpperCase();
    if (raw.includes("4") || raw.includes("100")) {
      return "4-Pack (100 covers)";
    }
    if (raw.includes("2") || raw.includes("50")) {
      return "2-Pack (50 covers)";
    }
    if (extractedFromName) return extractedFromName;
  }

  // 4. Looway Pee Funnel
  if (slug.includes("funnel") || sku.includes("FUN")) {
    const raw = (extractedFromName || sku).toUpperCase();
    if (raw.includes("2") || raw.includes("P2")) {
      return "Pack of 2";
    }
    if (raw.includes("1") || raw.includes("P1")) {
      return "Pack of 1";
    }
    if (extractedFromName) return extractedFromName;
  }

  // 5. Looway Pee & Puke Bags
  if (slug.includes("puke") || sku.includes("PUKE") || sku.includes("BAG-P")) {
    const raw = (extractedFromName || sku).toUpperCase();
    if (raw.includes("20") || raw.includes("P20")) {
      return "Pack of 20";
    }
    if (raw.includes("10") || raw.includes("P10")) {
      return "Pack of 10";
    }
    if (extractedFromName) return extractedFromName;
  }

  // 6. Ovy Liners
  if (slug.includes("liner") || sku.includes("LIN")) {
    const raw = (extractedFromName || sku).toUpperCase();
    if (raw.includes("80")) {
      return "Pack of 80";
    }
    if (raw.includes("60")) {
      return "Pack of 60";
    }
    if (raw.includes("40")) {
      return "Pack of 40";
    }
    if (extractedFromName) return extractedFromName;
  }

  // 7. Ovy Menstrual Cup
  if (slug.includes("cup") || sku.includes("CUP")) {
    if (extractedFromName) {
      return extractedFromName;
    }
    const raw = sku.toUpperCase();
    if (raw.includes("MED") || raw.includes("-M")) {
      return "Size: Medium";
    }
    if (raw.includes("SML") || raw.includes("-S")) {
      return "Size: Small";
    }
  }

  // 8. Ovy Period Panty
  if (slug.includes("panty") || sku.includes("PNT")) {
    const raw = (extractedFromName || sku).toUpperCase();
    if (raw.includes("XXL") || raw.includes("3XL")) {
      return "Size: XXL-XXXL (Waist 44–56 in)";
    }
    if (raw.includes("M-XL") || raw.includes("MXL") || raw.includes("LXL")) {
      return "Size: M-XL (Waist 28–44 in)";
    }
    if (extractedFromName) return `Size: ${extractedFromName}`;
  }

  if (extractedFromName && extractedFromName !== item?.title) {
    return extractedFromName;
  }

  return null;
}

export function isOvyPadItem(item: any): boolean {
  if (!item) return false;
  const slug = (item.slug || "").toLowerCase();
  const sku = (item.sku || "").toUpperCase();
  const title = (item.title || item.name || item.productName || "").toLowerCase();

  // Yatra kit items are not pad boxes
  if (item.yatraKit || (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit")) {
    return false;
  }
  // Mix box pad recipe
  if (item.mixBoxRecipe && (item.mixBoxRecipe as any).type !== "yatraKit") {
    return true;
  }
  // Explicit pad items
  if (slug === "ovy-pads" || sku.includes("OVY-PAD")) return true;
  if (typeof item.freeLiners === "number" && item.freeLiners > 0) return true;
  if (title.includes("sanitary pad") && !slug.includes("teen") && !title.includes("teen")) {
    return true;
  }

  return false;
}

export function getFreeLinersCount(item: any): number {
  if (!item) return 0;
  if (item.yatraKit || (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit")) {
    return 0;
  }
  if (typeof item.freeLiners === "number" && item.freeLiners > 0) {
    return item.freeLiners;
  }
  if (isOvyPadItem(item)) {
    const qty = Number(item.boxCount || item.quantity || 1);
    return Math.max(0, qty * 4);
  }
  return 0;
}

export function getTotalPadsCount(item: any): number {
  if (!item) return 0;
  if (typeof item.totalPads === "number" && item.totalPads > 0) {
    return item.totalPads;
  }
  if (isOvyPadItem(item)) {
    const qty = Number(item.boxCount || item.quantity || 1);
    return Math.max(0, qty * 21);
  }
  return 0;
}
