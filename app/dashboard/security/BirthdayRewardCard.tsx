"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cake, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveUserBirthday } from "@/helper/user/action";
import { toast } from "sonner";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function parseInitialBirthday(initial?: string | null): {
  day: string;
  month: string;
  display: string;
} {
  if (!initial) return { day: "", month: "", display: "" };
  const raw = String(initial).trim();

  // If in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const parts = raw.split("-");
    const mIndex = parseInt(parts[1], 10) - 1;
    const dVal = parseInt(parts[2], 10);
    const mName = MONTHS[mIndex] || "";
    return {
      day: String(dVal),
      month: mName,
      display: `${dVal} ${mName}`,
    };
  }

  // If in "Day Month" format (e.g. "15 October")
  const words = raw.split(/\s+/);
  if (words.length >= 2) {
    const d = words[0];
    const m = words.slice(1).join(" ");
    return { day: d, month: m, display: `${d} ${m}` };
  }

  return { day: "", month: "", display: raw };
}

export default function BirthdayRewardCard({
  initialBirthday,
}: {
  initialBirthday?: string | null;
}) {
  const parsed = parseInitialBirthday(initialBirthday);
  const [day, setDay] = useState(parsed.day);
  const [month, setMonth] = useState(parsed.month);
  const [savedDisplay, setSavedDisplay] = useState(parsed.display);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const isLocked = Boolean(savedDisplay);

  const handleSave = async () => {
    if (isLocked) {
      toast.info("Your birthday is already set and locked. Contact support to change it.");
      return;
    }

    if (!day || !month) {
      toast.error("Please select both your birthday day and month");
      return;
    }

    const formattedBirthday = `${day} ${month}`;

    try {
      setSaving(true);
      const res = await saveUserBirthday(formattedBirthday);
      const newDisplay = res.birthday || formattedBirthday;
      setSavedDisplay(newDisplay);

      if (res.alreadyLocked) {
        toast.info("Birthday is already set. Changes go through support.");
      } else if (res.bonusAdded) {
        toast.success(
          "Birthday saved! ₹50 Birthday Cash Credit added (valid for 3 months).",
        );
      } else {
        toast.success("Birthday saved successfully!");
      }
      router.refresh();
    } catch (err) {
      console.error("Failed to save birthday:", err);
      toast.error("Could not save birthday. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-pink-100 bg-linear-to-r from-pink-50/70 via-white to-teal-50/50 shadow-sm">
      <CardContent className="flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
            <Cake className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                Birthday Cash Credit (+₹50)
              </h3>
              {isLocked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  ₹50 Birthday Credit
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-700">
                  Valid for 3 months
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
              {isLocked
                ? `Birthday saved (${savedDisplay}). Set once; changes go through support. Valid for 3 months.`
                : "Add your day and month to receive ₹50 on your birthday (valid for 3 months). Can be set once; changes go through support."}
            </p>
          </div>
        </div>

        {isLocked ? (
          <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-600 sm:shrink-0">
            <Lock className="h-3.5 w-3.5 text-gray-500" />
            <span>Birthday: {savedDisplay} (Locked)</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
            {/* Day Dropdown */}
            <select
              aria-label="Birthday Day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 focus:border-[#016271] focus:outline-none"
            >
              <option value="">Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Month Dropdown */}
            <select
              aria-label="Birthday Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 focus:border-[#016271] focus:outline-none"
            >
              <option value="">Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || !day || !month}
              className="h-10 cursor-pointer rounded-xl bg-[#016271] px-4 text-sm font-semibold text-white hover:bg-[#166d7a] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save & Claim ₹50"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
