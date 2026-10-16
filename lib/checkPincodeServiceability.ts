export type DeliveryCheckResult = {
  serviceable: boolean;
  message: string;
  courier?: {
    id?: number;
    name?: string;
    estimatedDeliveryDays?: string | number;
    etd?: string;
    edd?: string;
    etaDate?: string | null;
    freightCharge?: number;
    codAvailable?: boolean;
  };
};

export function formatDeliveryDate(dateValue?: string | null): string | null {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export async function checkPincodeServiceability({
  pincode,
  pickupPincode,
  weight,
}: {
  pincode: string;
  pickupPincode?: string;
  weight?: number;
}): Promise<DeliveryCheckResult> {
  const pin = String(pincode || "").trim();
  if (!/^[1-9]\d{5}$/.test(pin)) {
    return {
      serviceable: false,
      message: "This PIN code doesn't exist. Please enter a valid 6-digit PIN code.",
    };
  }

  try {
    const response = await fetch("/api/shiprocket/serviceability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deliveryPincode: pin,
        pickupPincode,
        weight: weight || 0.3,
        cod: false,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.serviceable) {
      let msg =
        payload?.message || "Delivery is currently unavailable for this PIN code.";
      if (
        /invalid/i.test(msg) ||
        /doesn'?t exist/i.test(msg) ||
        /not exist/i.test(msg) ||
        payload?.status === 400
      ) {
        msg = "This PIN code doesn't exist. Please check and try again.";
      }
      return {
        serviceable: false,
        message: msg,
      };
    }

    const formattedDate = formatDeliveryDate(payload?.courier?.etaDate);
    const fallbackDays = payload?.courier?.estimatedDeliveryDays;
    const deliveryMessage = formattedDate
      ? `Delivery available! Expected delivery by ${formattedDate}.`
      : fallbackDays
        ? `Delivery available! Expected delivery in ${fallbackDays} business days.`
        : `Delivery is available for ${pin}!`;

    return {
      serviceable: true,
      message: deliveryMessage,
      courier: payload.courier,
    };
  } catch (error) {
    console.error("Pincode serviceability check failed:", error);
    return {
      serviceable: false,
      message: "Unable to check delivery availability right now. Please try again.",
    };
  }
}

