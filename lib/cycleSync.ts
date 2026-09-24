export type CycleSyncInput = {
  nextPeriodDate: Date | string;
  cycleLength: number;
  today?: Date;
};

export type CycleSyncDelivery = {
  periodDate: Date;
  deliveryDate: Date;
  chargeDate: Date;
};

export type CycleSyncSchedule = {
  valid: true;
  cycleLength: number;
  nextPeriod: Date;
  arrivalDate: Date;
  chargeDate: Date;
  upcomingDeliveries: CycleSyncDelivery[];
  warning: string | null;
  message: string | null;
};

export type CycleSyncError = {
  valid: false;
  message: string;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parseLocalDate(value: Date | string) {
  if (value instanceof Date) return value;

  const [year, month, day] = value.split("-").map(Number);
  if (year && month && day) return new Date(year, month - 1, day);

  return new Date(value);
}

export function clampCycleLength(cycleLength: number) {
  return Math.min(45, Math.max(21, Math.trunc(Number(cycleLength) || 28)));
}

export function getMinimumCycleSyncPeriodDate(today = new Date()) {
  return addDays(startOfDay(today), 6);
}

function getDeliveryDate(periodDate: Date) {
  return addDays(periodDate, -5);
}

function getChargeDate(periodDate: Date, today: Date) {
  const preferredChargeDate = addDays(periodDate, -10);

  return preferredChargeDate < today ? today : preferredChargeDate;
}

function buildUpcomingDeliveries({
  firstPeriodDate,
  cycleLength,
  today,
  count = 5,
}: {
  firstPeriodDate: Date;
  cycleLength: number;
  today: Date;
  count?: number;
}) {
  return Array.from({ length: count }, (_, index) => {
    const periodDate = addDays(firstPeriodDate, cycleLength * index);
    const deliveryDate = getDeliveryDate(periodDate);

    return {
      periodDate,
      deliveryDate,
      chargeDate: getChargeDate(periodDate, today),
    };
  });
}

export function calculateCycleSyncSchedule({
  nextPeriodDate,
  cycleLength,
  today = new Date(),
}: CycleSyncInput): CycleSyncSchedule | CycleSyncError {
  const safeToday = startOfDay(today);
  const parsedNextPeriodDate = parseLocalDate(nextPeriodDate);

  if (Number.isNaN(parsedNextPeriodDate.getTime())) {
    return { valid: false, message: "Enter a valid next period date." };
  }

  const safeNextPeriodDate = startOfDay(parsedNextPeriodDate);
  const safeCycleLength = clampCycleLength(cycleLength);
  const minimumPeriodDate = getMinimumCycleSyncPeriodDate(safeToday);

  if (safeNextPeriodDate < minimumPeriodDate) {
    return {
      valid: false,
      message: "Select a period date after the next 5 days.",
    };
  }

  const upcomingDeliveries = buildUpcomingDeliveries({
    firstPeriodDate: safeNextPeriodDate,
    cycleLength: safeCycleLength,
    today: safeToday,
  });

  return {
    valid: true,
    cycleLength: safeCycleLength,
    nextPeriod: safeNextPeriodDate,
    arrivalDate: upcomingDeliveries[0].deliveryDate,
    chargeDate: upcomingDeliveries[0].chargeDate,
    upcomingDeliveries,
    warning: safeCycleLength > 35 ? "Cycle length is longer than usual." : null,
    message: null,
  };
}
