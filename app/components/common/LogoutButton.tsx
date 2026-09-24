"use client";

import React from "react";
import { logout } from "@/helper/auth/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const LogoutButton: React.FC = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    toast.success("Logout SuccessFully");
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      className="w-full flex bg-[#FFB7B7] hover:bg-[#FFB7B7]/70 items-center justify-center gap-2 px-4 py-5 rounded-lg text-red-500  transition-all"
    >
      Logout
    </Button>
  );
};
