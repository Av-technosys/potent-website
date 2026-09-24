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
