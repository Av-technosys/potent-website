export function formatOrderStage(status?: string | null, isUnpaid?: boolean): string {
  const s = String(status || "").toLowerCase().trim();

  switch (s) {
    case "pending":
    case "paid":
      return "Order placed";
    case "processing":
    case "packed":
      return "Packed";
    case "shipped":
      return "Shipped";
    case "delivered":
    case "completed":
      return "Delivered";
    case "canceled":
    case "cancelled":
    case "failed":
      return "Cancelled";
    case "returned":
      return "Returned";
    default:
      return "Order placed";
  }
}

export function getOrderStageBadgeClasses(stageOrStatus: string, isUnpaid?: boolean): string {
  if (isUnpaid) {
    return "border border-amber-300 bg-amber-100 text-amber-800";
  }

  const stage = formatOrderStage(stageOrStatus, false);

  switch (stage) {
    case "Delivered":
      return "bg-[#DCFCE7] text-[#15824D]";
    case "Shipped":
      return "bg-purple-100 text-purple-800";
    case "Packed":
      return "bg-amber-100 text-amber-800";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    case "Order placed":
    default:
      return "bg-[#DCF7FC] text-[#016271]";
  }
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function formatOrderDate(date?: string | Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()] || d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

export function getDeliveryHeader(isDelivered: boolean): string {
  return isDelivered ? "Delivered to" : "Delivering to";
}

export function canTrackOrder(order: any): boolean {
  if (!order) return false;
  const status = String(order.status || "").toLowerCase().trim();
  const isCanceled =
    status === "canceled" ||
    status === "cancelled" ||
    status === "failed" ||
    order.cancelRequest?.status === "approved" ||
    order.cancelRequest?.status === "refunded" ||
    Boolean(order.isCanceled);

  const isDelivered = status === "delivered" || status === "completed" || Boolean(order.isDelivered);
  const isSubscriptionOnly = Boolean(order.isSubscriptionOnly);
  const isUnpaid = Boolean(order.isUnpaid);

  return !isSubscriptionOnly && !isCanceled && !isDelivered && !isUnpaid;
}

export function formatPrice(amount?: number | null): string {
  const num = Number(amount || 0);
  return `₹${num.toFixed(2)}`;
}

export function formatPaymentMethod(method?: string | null, meta?: any): string {
  const raw = String(method || "").toLowerCase().trim();
  const gatewayMethod = String(
    meta?.gatewayPayment?.method || meta?.method || ""
  ).toLowerCase().trim();

  const target = gatewayMethod || raw;

  if (target.includes("subscrip")) return "Subscription";
  if (target === "upi") return "UPI";
  if (target === "card" || target.includes("card") || target.includes("credit") || target.includes("debit")) return "Card";
  if (target === "netbanking" || target.includes("bank")) return "Net Banking";
  if (target === "wallet") return "Wallet";
  if (target === "emi") return "EMI";
  if (target === "cod" || target.includes("cash")) return "Cash on Delivery";
  if (raw === "razorpay" || raw.includes("razorpay")) return "Online Payment (Razorpay)";
  if (!target) return "Online Payment";

  return target.charAt(0).toUpperCase() + target.slice(1);
}

const SIZE_CODES = new Set(["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XL+"]);

export function isSizeOnlyString(val?: string | null): boolean {
  if (!val) return false;
  return SIZE_CODES.has(String(val).trim().toUpperCase());
}

export function getItemDisplayDetails(item: any) {
  if (!item) {
    return {
      productName: "Ovy Organic Cotton Sanitary Pads",
      size: null,
      productImage: "/product.png",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
  }

  const rawVarName = (item.productVarientName || item.productName || item.variant?.name || "").trim();
  const rawSku = String(item.productSKU || item.productVarientSKU || item.variant?.sku || "").toUpperCase();
  const isSize = isSizeOnlyString(rawVarName);

  const isYatraKit = Boolean(
    item.yatraKit ||
    (item.mixBoxRecipe && (item.mixBoxRecipe as any).type === "yatraKit") ||
    rawSku.includes("YATRA") ||
    rawVarName.toLowerCase().includes("yatra")
  );

  const isMixBox = Boolean(
    (item.mixBoxRecipe && (item.mixBoxRecipe as any).type !== "yatraKit") ||
    rawSku.includes("MIX") ||
    rawVarName.toLowerCase().includes("mix")
  );

  let productName = item.product?.name || item.productName;

  if (isYatraKit) {
    productName = "Looway Yatra Kit";
  } else if (isMixBox) {
    productName = "Mix Your Box";
  } else if (!productName || isSizeOnlyString(productName) || productName.toLowerCase() === "product") {
    if (rawSku.includes("SEAT") || rawVarName.toLowerCase().includes("seat")) {
      productName = "Looway Disposable Toilet Seat Covers";
    } else if (rawSku.includes("FUNNEL") || rawVarName.toLowerCase().includes("funnel") || rawVarName.toLowerCase().includes("stand-to-pee")) {
      productName = "Looway Stand-to-Pee Funnel";
    } else if (rawSku.includes("PUKE") || rawSku.includes("BAG") || rawVarName.toLowerCase().includes("puke")) {
      productName = "Looway Pee & Puke Bags";
    } else if (rawSku.includes("CUP") || rawVarName.toLowerCase().includes("cup")) {
      productName = "Ovy Reusable Menstrual Cup";
    } else if (rawSku.includes("TEEN") || rawVarName.toLowerCase().includes("teen")) {
      productName = "Ovy Organic Cotton Teen Pads";
    } else if (rawSku.includes("LINER") || rawVarName.toLowerCase().includes("liner")) {
      productName = "Ovy Organic Panty Liners";
    } else if (isSize) {
      productName = "Ovy Organic Cotton Sanitary Pads";
    } else if (rawVarName && rawVarName.toLowerCase() !== "product") {
      productName = rawVarName;
    } else {
      productName = "Ovy Organic Cotton Sanitary Pads";
    }
  }

  let size: string | null = null;
  if (isSize) {
    size = rawVarName.toUpperCase();
  } else if (item.variant?.name && item.variant.name !== productName) {
    size = item.variant.name;
  } else if (rawVarName && rawVarName !== productName && !rawVarName.toLowerCase().includes("box") && !rawVarName.toLowerCase().includes("yatra")) {
    size = rawVarName;
  }

  let productImage =
    item.productImage ||
    item.productVarientImage ||
    item.variant?.bannerImage ||
    item.product?.bannerImage ||
    null;

  if (!productImage || productImage === "/product.png" || productImage === "/placeholder.jpg") {
    if (isYatraKit) {
      productImage = "/looway/yatra-kit-thumb-v2.png";
    } else if (rawSku.includes("CUP") || productName.toLowerCase().includes("cup")) {
      productImage = "/cup.jpg";
    } else if (rawSku.includes("SEAT") || productName.toLowerCase().includes("seat")) {
      productImage = "/looway/scen-seat.jpg";
    } else if (rawSku.includes("FUNNEL") || productName.toLowerCase().includes("funnel")) {
      productImage = "/looway/scen-funnel.jpg";
    } else if (rawSku.includes("PUKE") || productName.toLowerCase().includes("puke")) {
      productImage = "/looway/scen-bags-sick.jpg";
    } else if (rawSku.includes("TEEN") || productName.toLowerCase().includes("teen")) {
      productImage = "/ovy/hero-pads.jpg";
    } else if (productName.toLowerCase().includes("liner")) {
      productImage = "/ovy/panty-box.jpg";
    } else {
      productImage = "/product.png";
    }
  }

  const quantity = Number(item.quantity || 1);
  const unitPrice = Number(item.productPrice || item.productVarientPrice || item.price || 0);
  const totalPrice = unitPrice * quantity;

  return {
    productName,
    size,
    productImage,
    quantity,
    unitPrice,
    totalPrice,
  };
}

export function getOrderRefundInfo(order: any) {
  const status = String(order?.status || "").toLowerCase().trim();
  const isCancelled = status === "canceled" || status === "cancelled";
  const cancelStatus = String(order?.cancelRequest?.status || "").toLowerCase().trim();
  const paymentStatus = String(order?.payment?.paymentStatus || "").toLowerCase().trim();

  let refundStatus = "Not Applicable";
  let refundDescription = "";

  if (isCancelled) {
    if (cancelStatus === "refunded" || paymentStatus === "refunded") {
      refundStatus = "Refunded";
      refundDescription = `Refund of ${formatPrice(order?.totalAmount)} has been processed to your original payment method.`;
    } else if (cancelStatus === "approved") {
      refundStatus = "Refund Approved";
      refundDescription = "Refund approved. It will be credited to your original payment method in 3–5 business days.";
    } else if (cancelStatus === "pending") {
      refundStatus = "Cancellation Under Review";
      refundDescription = "Your cancellation request is currently being reviewed by our support team.";
    } else {
      refundStatus = "Refund in Process";
      refundDescription = "This order was cancelled. Any applicable refund will be credited back to your original payment method.";
    }
  }

  return {
    isCancelled,
    refundStatus,
    refundDescription,
  };
}

