/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/helper";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validate = () => {
    let valid = true;

    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);

    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login successful 🎉");
      router.push(searchParams.get("redirect") || "/dashboard");
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Login failed ❌");
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Login failed",
      }));
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
        <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg md:max-w-lg lg:max-w-md">
          {/* CLICKABLE LOGO */}
          <div className="mt-4 mb-4 flex justify-center">
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
          <div className="mb-1 flex justify-center">
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

          <h2 className="mb-2 text-center text-2xl font-semibold text-[#016271]">
            Login
          </h2>

          <p className="mt-1 mb-3 text-center text-sm font-semibold text-[#016271]">
            Enter your details below
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none focus:border-gray-600"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none focus:border-gray-600"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <p className="mt-1 text-xs text-red-500">{errors.general}</p>
            )}

            <div className="mt-2 text-right text-xs">
              <Link href="/reset-password-email">
                <button type="button" className="mb-5 font-semibold text-black">
                  Forgot Password?
                </button>
              </Link>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full ${loading ? "cursor-not-allowed opacity-50" : ""} mt-2 mb-2 rounded-lg bg-cyan-700 py-2 text-sm font-medium text-white`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 mb-6 text-center text-xs">
            Don’t have an account?{" "}
            <Link href="/signup" className="cursor-pointer underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
