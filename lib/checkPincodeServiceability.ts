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
  if (!/^\d{6}$/.test(pin)) {
    return {
      serviceable: false,
      message: "Please enter a valid 6-digit Indian PIN code.",
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
      return {
        serviceable: false,
        message:
          payload?.message ||
          `Delivery is currently unavailable for PIN code ${pin}.`,
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

