// app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AccountInfo } from "@/app/components/common/dashboard-profile/AccountInfo";
import { EditAddressForm } from "@/app/components/common/dashboard-profile/EditAddress";
import { ProfileHeader } from "@/app/components/common/dashboard-profile/ProfileHeader";
import { getProfile, updateProfile } from "@/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface User {
  fullName: string;
  phone: string;
  email: string;
  emailVerified?: boolean | null;
  createdAt?: Date | string | null;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          emailVerified: data.emailVerified,
          createdAt: data.createdAt,
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      await updateProfile({
        fullName: user.fullName,
        phone: user.phone,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-none shadow-sm bg-white rounded-[15px] flex flex-row justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-5 w-56 bg-gray-200" />
            <Skeleton className="h-4 w-40 bg-gray-200" />
          </div>

          <Skeleton className="h-10 w-32 rounded-lg bg-gray-300" />
        </Card>

        <Card className="p-8 border-none shadow-sm bg-white rounded-[20px] space-y-6">
          <Skeleton className="h-4 w-40 bg-gray-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Skeleton className="h-3 w-32 bg-gray-300" />
              <Skeleton className="h-12 w-full rounded-xl bg-gray-200" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-14 w-full rounded-xl bg-gray-300" />
            <Skeleton className="h-14 w-full rounded-xl bg-gray-200" />
          </div>
        </Card>

        <Card className="p-6 border-none shadow-sm bg-white rounded-[15px] space-y-3">
          <Skeleton className="h-4 w-40 bg-gray-300" />
          <Skeleton className="h-4 w-64 bg-gray-200" />
          <Skeleton className="h-4 w-52 bg-gray-200" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader isEditing={isEditing} onEdit={() => setIsEditing(true)} />

      <EditAddressForm
        isEditing={isEditing}
        isSaving={isSaving}
        user={user}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => setIsEditing(false)}
      />

      <AccountInfo user={user} />
    </div>
  );
}
