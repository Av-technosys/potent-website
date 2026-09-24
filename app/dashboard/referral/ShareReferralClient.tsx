"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function ShareReferralClient({ userDetail }: any) {
  return [
    <div key={1} className="space-y-2">
      <p className="text-sm font-medium">Your Referral Code</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={userDetail.id}
          readOnly
          className="flex-1 border border-[#016271] font-semibold text-[#016271]"
        />
        <Button
          onClick={() => {
            toast.success("Referral code copied to clipboard");
            navigator.clipboard.writeText(userDetail.id);
          }}
          className="flex items-center gap-2 bg-[#016271] hover:bg-[#016271]/80"
        >
          <Copy size={16} />
          Copy Code
        </Button>
      </div>
    </div>,
    <div key={2} className="space-y-2">
      <p className="text-sm font-medium">Your Referral Link</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={`https://potenthygiene.com/signup?ref=${userDetail.id}`}
          readOnly
          className="flex-1 border border-[#016271] font-semibold text-[#016271]"
        />
        <Button
          onClick={() => {
            toast.success("Referral Link copied to clipboard");
            navigator.clipboard.writeText(
              `https://potenthygiene.com/signup?ref=${userDetail.id}`,
            );
          }}
          className="flex items-center gap-2 bg-[#016271] hover:bg-[#016271]/80"
        >
          <Copy size={16} />
          Copy Link
        </Button>
      </div>
    </div>,
  ];
}
