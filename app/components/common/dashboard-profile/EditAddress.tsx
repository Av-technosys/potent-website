// app/components/common/dashboard-profile/EditAddress.tsx
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  fullName: string;
  phone: string;
  email: string;
}

interface FormProps {
  isEditing: boolean;
  isSaving: boolean;
  user: User;
  onChange: (field: keyof User, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const EditAddressForm = ({
  isEditing,
  isSaving,
  user,
  onChange,
  onSubmit,
  onCancel,
}: FormProps) => (
  <Card className="p-8 border-none shadow-sm bg-white rounded-[20px]">
    <h3 className="text-[14px] font-bold text-[#2D3748] mb-8 uppercase tracking-[0.1em]">
      Edit Address
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
      <div className="space-y-3">
        <Label className="text-[12px] font-bold text-gray-400 uppercase ml-1">
          Full Name
        </Label>
        <Input
          disabled={!isEditing || isSaving}
          value={user.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          className="border-gray-200 rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#1B8392] disabled:opacity-100 disabled:cursor-default"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-[12px] font-bold text-gray-400 uppercase ml-1">
          Phone no.
        </Label>
        <Input
          disabled={!isEditing || isSaving}
          value={user.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="border-gray-200 rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-[#1B8392] disabled:opacity-100 disabled:cursor-default"
        />
      </div>
      <div className="md:col-span-2 space-y-3">
        <Label className="text-[12px] font-bold text-gray-400 uppercase ml-1">
          Email Address
        </Label>
        <Input
          disabled
          value={user.email}
          className="border-gray-200 rounded-xl h-12 px-4 bg-gray-50 focus-visible:ring-0 disabled:opacity-100 disabled:cursor-default"
        />
      </div>
    </div>

    {isEditing && (
      <div className="space-y-6">
        {/* <div className="flex items-center space-x-2 ml-1">
          <Checkbox id="default-address" className="border-gray-300 data-[state=checked]:bg-[#1B8392]" />
          <label htmlFor="default-address" className="text-[13px] text-gray-500 font-medium cursor-pointer">
            Set as default shipping address
          </label>
        </div> */}

        <div className="flex flex-col md:flex-row gap-4">
          <Button
            className="flex-1 bg-[#1B8392] hover:bg-[#166d7a] text-white rounded-xl h-14 font-bold text-[16px]"
            onClick={onSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Update Information"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 border-[#1B8392] text-[#1B8392] hover:bg-cyan-50 rounded-xl h-14 font-bold text-[16px]"
          >
            Cancel
          </Button>
        </div>
      </div>
    )}
  </Card>
);