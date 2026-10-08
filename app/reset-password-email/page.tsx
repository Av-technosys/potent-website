/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPassword } from "@/helper";

const Page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required ❌");
      return;
    }

    if (loading) return;

    setLoading(true);

    const toastId = toast.loading("Sending OTP...");

    try {
      await forgotPassword(email);

      toast.success("OTP sent to your email 📩", {
        id: toastId,
      });

      router.push(`/reset-password-otp?email=${email}`);
    } catch (err: any) {
      console.error("Error:", err);

      toast.error(err.message || "Something went wrong ❌", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center lg:justify-end">
      {/* Top Header Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between sm:top-6 sm:left-6 sm:right-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-sm transition-all hover:bg-white"
        >
          <div className="bg-[#075965] px-2.5 py-1 rounded-xl">
            <Image
              src="/logo-white.png"
              alt="Potent Hygiene"
              width={110}
              height={32}
              className="h-5 sm:h-6 w-auto object-contain"
            />
          </div>
        </Link>

        <Link
          href="/shop"
          className="flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs sm:text-sm font-semibold text-[#075965] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
        >
          <span>← Back to Shop</span>
        </Link>
      </div>

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

          {/* CLICKABLE LOGO */}
          <div className="mb-4 flex justify-center">
            <Link
              href="/"
              title="Go to Home"
              className="bg-[#075965] px-5 py-2.5 rounded-2xl shadow-sm inline-flex items-center justify-center transition-all hover:bg-[#05434c] hover:scale-105 cursor-pointer"
            >
              <Image
                src="/logo-white.png"
                alt="Potent Hygiene"
                width={160}
                height={55}
                className="h-9 sm:h-11 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <h2 className="text-center text-2xl font-semibold text-[#016271]">
            Reset Password
          </h2>

          <p className="mt-2 mb-5 text-center text-sm text-[#016271]">
            Enter your Email ID
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none focus:border-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-cyan-700 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Confirm"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup">
              {" "}
              <span className="cursor-pointer text-black underline">
                Sign up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
