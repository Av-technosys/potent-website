/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { resendOtp, verifyOtp } from "@/helper";

export const EmailVerificationClient = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  React.useEffect(() => {
    if (!email) {
      router.push("/sign-up");
    }
  }, [email, router]);

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

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP ❌");
      return;
    }

    if (loading) return;

    setLoading(true);

    const toastId = toast.loading("Verifying OTP...");

    try {
      await verifyOtp({
        email: email!,
        code: otp,
      });

      toast.success("Email verified successfully 🎉", {
        id: toastId,
      });

      setIsVerified(true);
    } catch (error: any) {
      console.error("OTP verification error:", error);

      toast.error(error.message || "Verification failed ❌", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    if (!canResend || loading) return;
    setLoading(true);

    const toastId = toast.loading("Resending OTP...");

    try {
      await resendOtp(email!);

      toast.success("OTP resent successfully 📩", {
        id: toastId,
      });

      setTimer(30);
      setCanResend(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP ❌", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center lg:justify-end">
      <Image
        src="/loginbg.png"
        alt="background"
        fill
        priority
        className="-z-10 object-cover"
      />

      <div className="flex w-full items-center justify-center p-4 md:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg md:max-w-lg lg:max-w-sm">
          <div className="mb-2 flex justify-center">
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
          </div>

          {/* LOGO */}
          <div className="mb-4 flex justify-center">
            <Image
              src="/logo.svg"
              alt="Potent logo"
              width={90}
              height={50}
              className="object-contain"
            />
          </div>
          <h2 className="text-center text-2xl font-semibold text-[#3399ac]">
            Email Verification
          </h2>

          <p className="mt-2 text-center text-sm text-[#016271]">
            OTP sent to your mail id {email}
          </p>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none focus:border-gray-600"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="mt-6 w-full rounded-full bg-[#016271] py-2 text-sm font-medium text-white"
            >
              {loading ? "Verifying..." : "Confirm"}
            </button>
            {/* {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )} */}
          </div>

          <div className="mt-4 flex w-full items-center justify-between text-xs">
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
              className={`font-medium ${
                canResend ? "text-blue-600" : "cursor-not-allowed text-gray-400"
              }`}
            >
              Resend
            </button>
          </div>

          <Dialog open={isVerified} onOpenChange={setIsVerified}>
            <DialogContent className="min-h-80 max-w-xs rounded-2xl border-none p-0 shadow-xl">
              <div className="flex h-full flex-col justify-center rounded-2xl bg-white p-6 text-center">
                <DialogTitle className="sr-only">
                  Email Verification Success
                </DialogTitle>

                <div className="mb-4 flex justify-center">
                  <Image
                    src="/tick.svg"
                    alt="verified"
                    width={90}
                    height={90}
                  />
                </div>

                <h3 className="text-xl font-semibold text-[#016271]">
                  Email Verified Successfully
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Your email verification is successfully completed.
                </p>

                <Link href="/login">
                  <button className="mt-6 w-full rounded-full bg-[#016271] py-2 font-medium text-white">
                    Login
                  </button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>

          <p className="mt-4 text-center text-xs">
            Already have an account?{" "}
            <Link href="/login">
              <span className="cursor-pointer underline">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
