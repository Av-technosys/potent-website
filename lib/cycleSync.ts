export type CycleSyncInput = {
  lastPeriodDate?: Date | string | null;
  nextPeriodDate?: Date | string | null;
  cycleLength: number | string | null | undefined;
  periodLength?: number | string | null | undefined;
  consentAccepted?: boolean;
  today?: Date;
};

export type CycleSyncFieldErrors = {
  lastPeriodDate: string | null;
  cycleLength: string | null;
  periodLength: string | null;
  consent: string | null;
};

export type CycleSyncDelivery = {
  boxNumber: number;
  periodDate: Date;
  deliveryDate: Date;
  chargeDate: Date;
};

export type CycleSyncSchedule = {
  valid: true;
  tooSoonForCycleSync: false;
  daysUntilNextPeriod: number;
  cycleLength: number;
  periodLength: number;
  lastPeriod: Date | null;
  nextPeriod: Date;
  nextPeriodDateString: string;
  arrivalDate: Date;
  chargeDate: Date;
  upcomingDeliveries: CycleSyncDelivery[];
  fieldErrors: CycleSyncFieldErrors;
  warning: string | null;
  message: string | null;
};

export type CycleSyncError = {
  valid: false;
  tooSoonForCycleSync: boolean;
  daysUntilNextPeriod: number | null;
  nextPeriod: Date | null;
  fieldErrors: CycleSyncFieldErrors;
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

export function formatCycleSyncDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateInputValue(today = new Date()) {
  return formatCycleSyncDateInput(startOfDay(today));
}

function parseLocalDate(value: Date | string) {
  if (value instanceof Date) return value;

  const [year, month, day] = String(value).split("-").map(Number);
  if (year && month && day) return new Date(year, month - 1, day);

  return new Date(value);
}

export function clampCycleLength(cycleLength: number | string) {
  return Math.min(45, Math.max(21, Math.trunc(Number(cycleLength) || 28)));
}

export function getMinimumCycleSyncPeriodDate(today = new Date()) {
  return addDays(startOfDay(today), 7);
}

function getDeliveryDate(periodDate: Date) {
  return addDays(periodDate, -5);
}

function getChargeDate(periodDate: Date, today: Date, index: number) {
  if (index === 0) return today;
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
}): CycleSyncDelivery[] {
  return Array.from({ length: count }, (_, index) => {
    const periodDate = addDays(firstPeriodDate, cycleLength * index);
    const deliveryDate = getDeliveryDate(periodDate);

    return {
      boxNumber: index + 1,
      periodDate,
      deliveryDate,
      chargeDate: getChargeDate(periodDate, today, index),
    };
  });
}

export function calculateCycleSyncSchedule({
  lastPeriodDate,
  nextPeriodDate,
  cycleLength,
  periodLength = 5,
  consentAccepted = true,
  today = new Date(),
}: CycleSyncInput): CycleSyncSchedule | CycleSyncError {
  const safeToday = startOfDay(today);

  const fieldErrors: CycleSyncFieldErrors = {
    lastPeriodDate: null,
    cycleLength: null,
    periodLength: null,
    consent: consentAccepted
      ? null
      : "Please confirm you are 18 or older, or have a parent or guardian's permission.",
  };

  // 1. Validate cycleLength (21 to 45)
  const rawCycleStr =
    cycleLength === null || cycleLength === undefined
      ? ""
      : String(cycleLength).trim();
  const parsedCycle = Number(rawCycleStr);
  if (rawCycleStr === "") {
    fieldErrors.cycleLength = "Please enter her cycle length (21 to 45 days).";
  } else if (
    !Number.isFinite(parsedCycle) ||
    !Number.isInteger(parsedCycle) ||
    parsedCycle < 21 ||
    parsedCycle > 45
  ) {
    fieldErrors.cycleLength = "Cycle length must be between 21 and 45 days.";
  }

  // 2. Validate periodLength (2 to 10 days)
  const rawPeriodStr =
    periodLength === null || periodLength === undefined
      ? ""
      : String(periodLength).trim();
  const parsedPeriod = Number(rawPeriodStr);
  if (rawPeriodStr === "") {
    fieldErrors.periodLength = "Please enter her period length (2 to 10 days).";
  } else if (
    !Number.isFinite(parsedPeriod) ||
    !Number.isInteger(parsedPeriod) ||
    parsedPeriod < 2 ||
    parsedPeriod > 10
  ) {
    fieldErrors.periodLength = "Period length must be between 2 and 10 days.";
  }

  // 3. Validate lastPeriodDate (or fallback to nextPeriodDate if only nextPeriodDate was provided)
  let safeLastPeriod: Date | null = null;
  let safeNextPeriod: Date | null = null;

  const hasLastPeriodInput =
    lastPeriodDate !== undefined &&
    lastPeriodDate !== null &&
    String(lastPeriodDate).trim() !== "";
  const hasNextPeriodFallback =
    !hasLastPeriodInput &&
    nextPeriodDate !== undefined &&
    nextPeriodDate !== null &&
    String(nextPeriodDate).trim() !== "";

  if (hasLastPeriodInput) {
    const parsedLast = parseLocalDate(lastPeriodDate!);
    if (Number.isNaN(parsedLast.getTime())) {
      fieldErrors.lastPeriodDate =
        "Please enter a valid date for when her last period started.";
    } else {
      safeLastPeriod = startOfDay(parsedLast);
      if (safeLastPeriod > safeToday) {
        fieldErrors.lastPeriodDate =
          "Last period start date cannot be in the future.";
      }
    }
  } else if (hasNextPeriodFallback) {
    const parsedNext = parseLocalDate(nextPeriodDate!);
    if (Number.isNaN(parsedNext.getTime())) {
      fieldErrors.lastPeriodDate = "Enter a valid period date.";
    } else {
      safeNextPeriod = startOfDay(parsedNext);
      if (!fieldErrors.cycleLength) {
        safeLastPeriod = addDays(safeNextPeriod, -parsedCycle);
      }
    }
  } else {
    fieldErrors.lastPeriodDate =
      "Please select the date her last period started.";
  }

  // If any of the 3 core inputs have field errors, return early with fieldErrors
  if (
    fieldErrors.lastPeriodDate ||
    fieldErrors.cycleLength ||
    fieldErrors.periodLength
  ) {
    return {
      valid: false,
      tooSoonForCycleSync: false,
      daysUntilNextPeriod: null,
      nextPeriod: null,
      fieldErrors,
      message:
        fieldErrors.lastPeriodDate ||
        fieldErrors.cycleLength ||
        fieldErrors.periodLength ||
        "Enter valid Cycle Sync details.",
    };
  }

  if (!safeNextPeriod && safeLastPeriod) {
    safeNextPeriod = addDays(safeLastPeriod, parsedCycle);
  }

  const daysUntilNextPeriod = Math.round(
    (safeNextPeriod!.getTime() - safeToday.getTime()) / (1000 * 60 * 60 * 24),
  );
  const minimumPeriodDate = getMinimumCycleSyncPeriodDate(safeToday);

  if (safeNextPeriod! < minimumPeriodDate || daysUntilNextPeriod < 7) {
    const tooSoonMsg =
      daysUntilNextPeriod < 0
        ? "Based on this start date and cycle length, her next period date has already passed. Please enter her most recent period start date, or place a one-time order instead."
        : `Her next period is ${
            daysUntilNextPeriod === 0
              ? "today"
              : `in ${daysUntilNextPeriod} day${daysUntilNextPeriod === 1 ? "" : "s"}`
          } (less than 7 days away), so Cycle Sync won't arrive 5 days before it starts. Please place a one-time order for this cycle instead.`;

    return {
      valid: false,
      tooSoonForCycleSync: true,
      daysUntilNextPeriod,
      nextPeriod: safeNextPeriod,
      fieldErrors,
      message: tooSoonMsg,
    };
  }

  const upcomingDeliveries = buildUpcomingDeliveries({
    firstPeriodDate: safeNextPeriod!,
    cycleLength: parsedCycle,
    today: safeToday,
  });

  return {
    valid: true,
    tooSoonForCycleSync: false,
    daysUntilNextPeriod,
    cycleLength: parsedCycle,
    periodLength: parsedPeriod,
    lastPeriod: safeLastPeriod,
    nextPeriod: safeNextPeriod!,
    nextPeriodDateString: formatCycleSyncDateInput(safeNextPeriod!),
    arrivalDate: upcomingDeliveries[0].deliveryDate,
    chargeDate: upcomingDeliveries[0].chargeDate,
    upcomingDeliveries,
    fieldErrors,
    warning: parsedCycle > 35 ? "Cycle length is longer than usual." : null,
    message: null,
  };
}
