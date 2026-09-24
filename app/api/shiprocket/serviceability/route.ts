import { NextResponse } from "next/server";
import {
  SHIPROCKET_DEFAULT_WEIGHT_KG,
  SHIPROCKET_EMAIL,
  SHIPROCKET_PASSWORD,
  SHIPROCKET_PICKUP_PINCODE,
} from "@/env";

export const dynamic = "force-dynamic";

const SHIPROCKET_AUTH_URL =
  "https://apiv2.shiprocket.in/v1/external/auth/login";
const SHIPROCKET_SERVICEABILITY_URL =
  "https://apiv2.shiprocket.in/v1/external/courier/serviceability/";
const TOKEN_TTL_MS = 23 * 60 * 60 * 1000;

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

type ShiprocketCourier = {
  courier_company_id?: number;
  courier_name?: string;
  estimated_delivery_days?: string | number;
  etd?: string;
  edd?: string;
  etd_hours?: number;
  freight_charge?: number;
  rate?: number;
  cod?: number;
};

function isSixDigitPincode(value: unknown) {
  return typeof value === "string" && /^\d{6}$/.test(value.trim());
}

function parseDate(value?: string) {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildFallbackDate(days?: string | number) {
  const estimatedDays = Number(days);
  if (!Number.isFinite(estimatedDays) || estimatedDays <= 0) return null;

  const date = new Date();
  date.setDate(date.getDate() + estimatedDays);
  return date;
}

function getCourierEtaDate(courier: ShiprocketCourier) {
  return (
    parseDate(courier.etd) ||
    parseDate(courier.edd) ||
    buildFallbackDate(courier.estimated_delivery_days)
  );
}

function getEarliestCourier(couriers: ShiprocketCourier[]) {
  return [...couriers].sort((first, second) => {
    const firstDate = getCourierEtaDate(first)?.getTime() ?? Infinity;
    const secondDate = getCourierEtaDate(second)?.getTime() ?? Infinity;

    if (firstDate !== secondDate) return firstDate - secondDate;

    const firstHours = Number(first.etd_hours ?? Infinity);
    const secondHours = Number(second.etd_hours ?? Infinity);

    if (firstHours !== secondHours) return firstHours - secondHours;

    return (
      Number(first.estimated_delivery_days ?? Infinity) -
      Number(second.estimated_delivery_days ?? Infinity)
    );
  })[0];
}

async function getShiprocketToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) {
    return cachedToken;
  }

  if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
    throw new Error("Shiprocket credentials are not configured.");
  }

  const response = await fetch(SHIPROCKET_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.token) {
    throw new Error(
      payload?.message || "Unable to authenticate with Shiprocket.",
    );
  }

  cachedToken = payload.token;
  cachedTokenExpiresAt = Date.now() + TOKEN_TTL_MS;

  return cachedToken;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const deliveryPincode = String(body?.deliveryPincode || "").trim();
    const pickupPincode = String(
      body?.pickupPincode || SHIPROCKET_PICKUP_PINCODE || "",
    ).trim();
    const weight = Number(body?.weight || SHIPROCKET_DEFAULT_WEIGHT_KG || 0.5);
    const cod = body?.cod ? 1 : 0;

    if (!isSixDigitPincode(deliveryPincode)) {
      return NextResponse.json(
        { message: "Enter a valid 6-digit delivery PIN code." },
        { status: 400 },
      );
    }

    if (!isSixDigitPincode(pickupPincode)) {
      return NextResponse.json(
        { message: "Shiprocket pickup PIN code is not configured." },
        { status: 500 },
      );
    }

    if (!Number.isFinite(weight) || weight <= 0) {
      return NextResponse.json(
        { message: "Product weight must be greater than 0 kg." },
        { status: 400 },
      );
    }

    const token = await getShiprocketToken();
    const url = new URL(SHIPROCKET_SERVICEABILITY_URL);
    url.searchParams.set("pickup_postcode", pickupPincode);
    url.searchParams.set("delivery_postcode", deliveryPincode);
    url.searchParams.set("cod", String(cod));
    url.searchParams.set("weight", String(weight));

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ||
            "Unable to check delivery availability right now.",
        },
        { status: response.status },
      );
    }

    const couriers = Array.isArray(payload?.data?.available_courier_companies)
      ? payload.data.available_courier_companies
      : [];
    const earliestCourier = getEarliestCourier(couriers);
    const etaDate = earliestCourier ? getCourierEtaDate(earliestCourier) : null;

    if (!earliestCourier) {
      return NextResponse.json({
        serviceable: false,
        message: "Delivery is currently unavailable at this PIN code.",
      });
    }

    return NextResponse.json({
      serviceable: true,
      pickupPincode,
      deliveryPincode,
      courier: {
        id: earliestCourier.courier_company_id,
        name: earliestCourier.courier_name,
        estimatedDeliveryDays: earliestCourier.estimated_delivery_days,
        etd: earliestCourier.etd,
        edd: earliestCourier.edd,
        etaDate: etaDate?.toISOString() || null,
        freightCharge: earliestCourier.freight_charge ?? earliestCourier.rate,
        codAvailable: earliestCourier.cod === 1,
      },
      courierCount: couriers.length,
    });
  } catch (error) {
    console.error("Shiprocket serviceability failed:", error);

    return NextResponse.json(
      { message: "Unable to check delivery availability right now." },
      { status: 500 },
    );
  }
}
