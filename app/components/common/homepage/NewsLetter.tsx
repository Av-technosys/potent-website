/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { subscribeEmail } from "@/helper";
import { toast } from "sonner";
import { Check } from "lucide-react";

type Props = {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  features?: string[];
  placeholder?: string;
  checkboxLabel?: string;
  disclaimerText?: string;
  cardBgColor?: string;
  bgImageDesktop?: string;
  bgImageMobile?: string;
  overlayColor?: string;
  buttonColor?: string;
};

export function Newsletter({
  badgeText = "NEWSLETTER",
  title = "Subscribe to our newsletter.",
  subtitle = "Straight to your inbox: cycle tips you will actually use, travel hygiene hacks, and the first look at everything new.",
  features = [
    "First look at new launches and drops",
    "Cycle and travel tips you will actually use",
    "Subscriber perks and Rewards Club news",
  ],
  placeholder = "you@example.com",
  checkboxLabel = "I agree to receive emails from Potent Hygiene. I can unsubscribe any time.",
  disclaimerText = "No spam, ever. One click to unsubscribe.",
  cardBgColor = "#016271",
  bgImageDesktop,
  bgImageMobile,
  overlayColor,
  buttonColor,
}: Props) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine background color for the newsletter card
  const actualCardBg = cardBgColor || buttonColor || "#016271";

  const handleSubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const res = await subscribeEmail(email);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setEmail("");
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#F8F6F1] py-8 sm:py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-8 shadow-xl sm:px-10 sm:py-12 md:rounded-3xl lg:px-14 lg:py-14"
          style={{ backgroundColor: actualCardBg }}
        >
          {/* OPTIONAL BACKGROUND IMAGES IF PROVIDED */}
          {(bgImageDesktop || bgImageMobile) && (
            <div className="pointer-events-none absolute inset-0">
              {bgImageMobile && (
                <div
                  className="absolute inset-0 bg-cover bg-center sm:hidden"
                  style={{ backgroundImage: `url(${bgImageMobile})` }}
                />
              )}
              {bgImageDesktop && (
                <div
                  className="hidden h-full w-full bg-cover bg-center sm:block"
                  style={{ backgroundImage: `url(${bgImageDesktop})` }}
                />
              )}
              {overlayColor && (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: overlayColor }}
                />
              )}
            </div>
          )}

          {/* MAIN CONTENT GRID */}
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* LEFT COLUMN */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-7">
              {/* BADGE */}
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[#76D2DC] uppercase sm:text-sm">
                  {badgeText}
                </span>
              </div>

              {/* TITLE */}
              <h2 className="font-serif text-3xl leading-[1.15] font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h2>

              {/* SUBTITLE */}
              <p className="max-w-xl text-sm leading-relaxed font-normal text-white/80 sm:text-base">
                {subtitle}
              </p>

              {/* FEATURES LIST */}
              {features && features.length > 0 && (
                <ul className="space-y-3 pt-2">
                  {features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-medium text-white/90 sm:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col justify-center space-y-4 lg:col-span-5 lg:pl-2">
              <form onSubmit={handleSubscribe} className="w-full space-y-4">
                {/* INPUT & BUTTON ROW */}
                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder={placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white transition-all placeholder:text-white/60 focus:ring-2 focus:ring-white/40 focus:outline-none sm:h-14 sm:border-[#398D97] sm:bg-[#126B76]/70 sm:text-base"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ color: actualCardBg }}
                    className="flex h-12 w-full shrink-0 cursor-pointer items-center justify-center rounded-full bg-white px-8 text-sm font-semibold whitespace-nowrap shadow-md transition-all hover:bg-white/90 active:scale-[0.98] sm:h-14 sm:w-auto sm:text-base"
                  >
                    {loading ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>

                {/* CHECKBOX */}
                <label className="group flex cursor-pointer items-start gap-3 pt-1 sm:items-center">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-xs transition-all sm:mt-0 ${
                      agreed
                        ? "bg-white text-[#075965]"
                        : "border border-white/40 bg-white/20 group-hover:border-white"
                    }`}
                  >
                    {agreed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-snug text-white/85 sm:text-sm">
                    {checkboxLabel}
                  </span>
                </label>
              </form>

              {/* DISCLAIMER */}
              <p className="pt-1 text-xs font-normal text-white/70 sm:text-sm">
                {disclaimerText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
