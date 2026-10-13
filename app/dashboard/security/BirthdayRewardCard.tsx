"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cake, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveUserBirthday } from "@/helper/user/action";
import { toast } from "sonner";

function formatRewardDate(dateInput?: Date | string | null): string {
  if (!dateInput) return "";
  const parsed = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BirthdayRewardCard({
  initialBirthday,
}: {
  initialBirthday?: string | null;
}) {
  const [birthday, setBirthday] = useState(initialBirthday || "");
  const [savedBirthday, setSavedBirthday] = useState(initialBirthday || "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const isLocked = Boolean(savedBirthday);

  const handleSave = async () => {
    if (isLocked) {
      toast.info("Your date of birth is already saved and locked.");
      return;
    }

    if (!birthday.trim()) {
      toast.error("Please select your date of birth");
      return;
    }

    try {
      setSaving(true);
      const res = await saveUserBirthday(birthday.trim());
      setSavedBirthday(res.birthday || birthday.trim());
      if (res.alreadyLocked) {
        toast.info("Your date of birth can only be set once.");
      } else if (res.bonusAdded) {
        toast.success(
          "Birthday saved! ₹100 Birthday Bonus has been added to your Reward Balance.",
        );
      } else {
        toast.success("Birthday saved!");
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
      <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
            <Cake className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                Birthday Cash Credit (+₹100)
              </h3>
              {isLocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  ₹100 Credited (1x/year)
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
              {isLocked
                ? `Date of birth saved (${formatRewardDate(savedBirthday) || savedBirthday}). Birthday can only be set once per account.`
                : "Add your date of birth once to receive your annual ₹100 birthday cash credit."}
            </p>
          </div>
        </div>

        {isLocked ? (
          <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-600 sm:shrink-0">
            <Lock className="h-3.5 w-3.5 text-gray-500" />
            <span>DOB: {formatRewardDate(savedBirthday) || savedBirthday}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 sm:shrink-0">
            <Input
              type="date"
              value={birthday}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setBirthday(e.target.value)}
              className="h-10 w-44 rounded-xl border-gray-200 bg-white text-sm"
            />
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || !birthday}
              className="h-10 cursor-pointer rounded-xl bg-[#016271] px-4 text-sm font-semibold text-white hover:bg-[#166d7a]"
            >
              {saving ? "Saving..." : "Save & Claim ₹100"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

