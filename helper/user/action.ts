/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { db } from "@/db";
import { address, contactUs, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { emailRegex } from "@/const/globalconst";
import { getAuthSession } from "@/helper/auth/session";

type NewAddressInput = {
  fullName: string;
  phone: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
};

export async function requireUserWithRefresh() {
  const session = await getAuthSession({ refresh: true, persistRefresh: true });
  const user = session.user;

  if (!session.authenticated || !user?.userId || !user?.email) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    userId: user.userId,
    email: user.email,
  };
}
export async function getCurrentUser() {
  const session = await getAuthSession({ refresh: false });
  const user = session.user;

  if (!session.authenticated || !user?.userId || !user?.email) return null;

  return {
    userId: user.userId,
    email: user.email,
  };
}

export async function getProfile() {
  const { email }: any = await requireUserWithRefresh();

  if (!email) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!result.length) throw new Error("User not found");

  const user = result[0];

  return {
    userId: user.id,
    fullName: user.name,
    email: user.email,
    phone: user.phone,
    emailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}

export async function updateProfile(data: {
  fullName: string;
  phone: string;
}) {
  const { email }: any = await requireUserWithRefresh();

  if (!email) throw new Error("Unauthorized");

  const updated = await db
    .update(users)
    .set({
      name: data.fullName,
      phone: data.phone,
    })
    .where(eq(users.email, email))
    .returning();

  if (!updated.length) throw new Error("User not found");

  const user = updated[0];

  return {
    fullName: user.name,
    email: user.email,
    phone: user.phone,
  };
}


export async function getAddresses() {
  const { userId } = await requireUserWithRefresh();

  if (!userId) {

    throw new Error("UNAUTHORIZED");
  }
  return await db
    .select()
    .from(address)
    .where(eq(address.userId, userId));
}

export async function getUserAddressById(addressId: number) {
  const { userId } = await requireUserWithRefresh();

  const data = await db
    .select()
    .from(address)
    .where(
      and(
        eq(address.id, addressId),
        eq(address.userId, userId)
      )
    );

  return data[0] || null;
}

export async function updateUserAddress(data: any) {
  const { userId } = await requireUserWithRefresh();

  if (data.isDefault) {
    await db
      .update(address)
      .set({ isDefault: false })
      .where(eq(address.userId, userId));
  }

  await db
    .update(address)
    .set({
      streetAddress1: data.street,
      streetAddress2: data.locality,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      isDefault: data.isDefault,
    })
    .where(
      and(
        eq(address.id, Number(data.id)),
        eq(address.userId, userId)
      )
    );

  return { success: true };
}

export async function deleteUserAddress(id: number) {
  const { userId } = await requireUserWithRefresh();

  await db
    .delete(address)
    .where(
      and(
        eq(address.id, id),
        eq(address.userId, userId)
      )
    );

  return { success: true };
}

export async function setDefaultAddress(id: number) {
  const { userId } = await requireUserWithRefresh();

  await db
    .update(address)
    .set({ isDefault: false })
    .where(eq(address.userId, userId));

  await db
    .update(address)
    .set({ isDefault: true })
    .where(
      and(
        eq(address.id, id),
        eq(address.userId, userId)
      )
    );

  return { success: true };
}

export async function createUserAddress(data: NewAddressInput) {
  const { userId } = await requireUserWithRefresh();

  try {
    if (data.isDefault) {
      await db
        .update(address)
        .set({ isDefault: false })
        .where(eq(address.userId, userId));
    }

    const [newAddress] = await db
      .insert(address)
      .values({
        userId,
        streetAddress1: data.street,
        streetAddress2: data.locality,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country,
        isDefault: data.isDefault ?? false,
      })
      .returning();

    return { success: true, data: newAddress };
  } catch (error) {
    return { success: false, error };
  }
}

export async function subscribeEmail(email: string) {

  if (!email) {
    return { success: false, message: "Email is required" };
  }

  if (!emailRegex.test(email.trim())) {
    return { success: false, message: "Please enter a valid email" };
  }

  await db.insert(contactUs).values({
    email,
    message: "Newsletter",
  });

  return { success: true, message: "Subscribed successfully 🎉" };
}
