import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react"; // Image mein pencil jaisa icon hai

interface HeaderProps {
  isEditing: boolean;
  onEdit: () => void;
}

export const ProfileHeader = ({ isEditing, onEdit }: HeaderProps) => (
  <Card className="mb-6 flex flex-row items-center justify-between rounded-[15px] border-none bg-white p-6 shadow-sm">
    <div className="space-y-1">
      <h2 className="text-[18px] font-semibold text-[#2D3748]">
        Personal Information
      </h2>
      <p className="text-[13px] font-medium text-gray-500">
        Manage your personal details
      </p>
    </div>

    {!isEditing && (
      <Button
        onClick={onEdit}
        /* rounded-full se wo exact pill shape aayegi jo image mein hai */
        className="flex h-10 items-center gap-2 rounded-lg bg-[#016271] px-5 py-2 text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-[#016271]"
      >
        <IconPencil size={18} stroke={2.5} />
        <span className="hidden md:block"> Edit Profile</span>
      </Button>
    )}
  </Card>
);
