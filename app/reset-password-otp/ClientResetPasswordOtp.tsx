/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { forgotPassword } from "@/helper";

export const ClientResetPasswordOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  // 🔐 redirect if no email
  React.useEffect(() => {
    if (!email) {
      router.push("/reset-password-email");
    }
  }, [email, router]);

  // ⏱ timer logic
  React.useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔥 VERIFY OTP
  const handleVerify = () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP ❌");
      return;
    }

    router.push(`/reset-password-confirm?email=${email}&code=${otp}`);
  };

  // 🔁 RESEND OTP (IMPORTANT: uses forgotPassword API)
  const handleResend = async () => {
    if (!canResend) return;

    try {
      const toastId = toast.loading("Resending OTP...");

      await forgotPassword(email!);

      toast.success("OTP resent successfully 📩", { id: toastId });

      setTimer(30);
      setCanResend(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend ❌");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center lg:justify-end">
      {/* Background */}
      <Image
        src="/mobilelogin.png"
        alt="background mobile"
        fill
        priority
        className="-z-10 object-cover md:hidden"
      />

      <Image
        src="/loginbg.png"
        alt="background desktop"
        fill
        priority
        className="-z-10 hidden object-cover md:block"
      />

      <div className="flex w-full items-center justify-center p-4 md:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg">
          {/* LOGO */}
          <div className="mb-1 flex justify-center">
            <Image src="/logo.png" alt="logo" width={100} height={36} />
          </div>

          <h2 className="text-center text-2xl font-semibold text-[#016271]">
            Reset Password
          </h2>

          <p className="mt-1 mb-3 text-center text-sm text-[#016271]">
            Enter the OTP sent to your email
          </p>

          {/* OTP INPUT */}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border-b border-gray-400 px-1 py-2 text-sm outline-none"
            />
          </div>

          {/* RESEND */}
          <div className="mt-3 flex items-center justify-between text-xs">
            {!canResend ? (
              <span className="font-semibold text-black">
                Resend OTP in 00:{timer.toString().padStart(2, "0")}
              </span>
            ) : (
              <span className="font-semibold text-green-600">
                You can resend OTP
              </span>
            )}

            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`font-medium whitespace-nowrap ${
                canResend ? "text-blue-600" : "cursor-not-allowed text-gray-400"
              }`}
            >
              Resend
            </button>
          </div>

          {/* VERIFY BUTTON */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-cyan-700 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>

          <p className="mt-2 text-center text-xs">
            Back to{" "}
            <Link href="/login">
              <span className="cursor-pointer underline">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
