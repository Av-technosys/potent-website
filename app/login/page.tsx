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
      <Image
        src="/loginbg.png"
        alt="background"
        fill
        priority
        className="-z-10 object-cover"
      />

      <div className="flex w-full items-center justify-center p-4 md:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg md:max-w-lg lg:max-w-md">
          <div className="mt-5 mb-4 flex justify-center">
            <Image
              src="/logo.svg"
              alt="Potent logo"
              width={90}
              height={50}
              className="object-contain"
            />
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

          <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-full border border-cyan-700 bg-white py-2 text-sm font-medium text-cyan-700">
            <Image src="/google.svg" alt="google" width={15} height={15} />

            <span>Sign up with Google</span>
          </button>

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
