"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function ShareReferralClient({ userDetail }: any) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const referralCode = userDetail?.referralCode || userDetail?.id || "";
  const referralLink = `${origin || "https://potenthygiene.com"}/signup?ref=${referralCode}`;

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard");
  };

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard");
  };

  const handleWhatsAppShare = () => {
    const shareMessage = `Hey! Use my referral code ${referralCode} to get ₹100 OFF on your first Potent order.`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* 1. Referral Code */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Your Referral Code</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={referralCode}
            readOnly
            className="flex-1 border border-[#016271] font-semibold text-[#016271]"
          />
          <Button
            onClick={handleCopyCode}
            type="button"
            className="flex items-center gap-2 bg-[#016271] hover:bg-[#016271]/80 cursor-pointer"
          >
            <Copy size={16} />
            Copy Code
          </Button>
        </div>
      </div>

      {/* 2. Referral Link */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Your Referral Link</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={referralLink}
            readOnly
            className="flex-1 border border-[#016271] font-semibold text-[#016271]"
          />
          <Button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center gap-2 bg-[#016271] hover:bg-[#016271]/80 cursor-pointer"
          >
            <Copy size={16} />
            Copy Link
          </Button>
        </div>
      </div>

      {/* 3. Share Via WhatsApp */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Share Via</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            onClick={handleWhatsAppShare}
            type="button"
            className="flex h-10 items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.42 0 .05 5.37.05 12c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62A11.9 11.9 0 0 0 12.05 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.53-8.52zM12.05 22c-1.9 0-3.75-.5-5.36-1.44l-.38-.22-3.68.96.98-3.6-.24-.37A9.9 9.9 0 0 1 2.05 12c0-5.52 4.48-10 10-10 2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0 1 22.05 12c0 5.52-4.48 10-10 10zm5.5-7.5c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.5-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52s1.07 2.93 1.22 3.13c.15.2 2.1 3.2 5.1 4.48.71.3 1.27.48 1.7.61.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
            </svg>
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
