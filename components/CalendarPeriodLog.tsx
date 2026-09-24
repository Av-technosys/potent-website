"use client";

import {
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  getDay,
} from "date-fns";

export function getNextDate(selectedDate: Date, daysToAdd: number) {
  const date = new Date(selectedDate);
  date.setDate(date.getDate() + daysToAdd);
  return date;
}


export function getNextXDays(startDate: Date, numberOfDays: number) {
  const dates = [];
  const date = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + i);
    dates.push(newDate);
  }

  return dates;
}

function getDatesBetween(start: Date, end: Date) {
  const dates: Date[] = [];
  let current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }

  return dates;
}

function isSameDay(d1: Date, d2: Date) {
  return d1.toDateString() === d2.toDateString();
}



function calculateData(
  startDate: Date,
  cycle: number,
  periodLength: number
) {
  const periodDates: Date[] = [];
  const fertileDates: Date[] = [];

  const fnStartDate = new Date(startDate);
  fnStartDate.setDate(fnStartDate.getDate() + 1);

  const currentMonthDays = getNextXDays(fnStartDate, periodLength);
  periodDates.push(...currentMonthDays);

  const nextMonthFertilityDay = getNextDate(startDate, cycle - 5);
  const nextMonthFertileDays = getNextXDays(nextMonthFertilityDay, 5);
  fertileDates.push(...nextMonthFertileDays);

  const nextMonthDay = getNextDate(fnStartDate, cycle);
  const nextMonthPeriodStart = getNextXDays(nextMonthDay, periodLength);
  periodDates.push(...nextMonthPeriodStart);

  const thirdMonthDay = getNextDate(fnStartDate, cycle * 2);
  const thirdMonthPeriodStart = getNextXDays(thirdMonthDay, periodLength);
  periodDates.push(...thirdMonthPeriodStart);

  const thridMonthFertilityDay = getNextDate(startDate, cycle * 2 - 5);
  const thirdMonthFertileDays = getNextXDays(thridMonthFertilityDay, 5);
  fertileDates.push(...thirdMonthFertileDays);


  return { periodDates, fertileDates };
}

// UI components
function Day({ date, periodDates, fertileDates }: any) {

  const isPeriod = periodDates.some((d: Date) => isSameDay(d, date));
  const isFertile =
    !isPeriod && fertileDates.some((d: Date) => isSameDay(d, date));

  return (
    <div
      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm
        ${isPeriod ? "bg-[#E57373] text-white" : ""}
        ${isFertile ? "bg-[#B39DDB] text-white" : ""}
      `}
    >
      {date.getDate()}
    </div>
  );
}

function Month({ month, periodDates, fertileDates }: any) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);

  const days = getDatesBetween(start, end);
  const blanks = Array(getDay(start)).fill(null);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-center font-semibold mb-4">
        {month.toLocaleString("default", { month: "long" })}{" "}
        {month.getFullYear()}
      </h3>

      <div className="grid grid-cols-7 text-xs text-gray-400 mb-2 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 justify-items-center">
        {blanks.map((_, i) => (
          <div key={i} className="w-9 h-9" />
        ))}
        {days.map((date) => (
          <Day
            key={date.toISOString()}
            date={date}
            periodDates={periodDates}
            fertileDates={fertileDates}
          />
        ))}
      </div>
    </div>
  );
}

// MAIN
export function CalendarPeriodLog({
  startDate,
  cycle,
  periodTime,
}: any) {
  const { periodDates, fertileDates } = calculateData(
    startDate,
    cycle,
    periodTime
  );

  const baseMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <Month
          key={i}
          month={addMonths(baseMonth, i)}
          periodDates={periodDates}
          fertileDates={fertileDates}
        />
      ))}
    </div>
  );
}