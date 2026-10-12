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
  const rows = await db
    .select()
    .from(address)
    .where(eq(address.userId, userId));

  return rows.map((row) => ({
    ...row,
    street: row.streetAddress1 || "",
    locality: row.streetAddress2 || "",
    fullName: row.fullName || "",
    phone: row.phone || "",
  }));
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

  const row = data[0];
  if (!row) return null;
  return {
    ...row,
    street: row.streetAddress1 || "",
    locality: row.streetAddress2 || "",
    fullName: row.fullName || "",
    phone: row.phone || "",
  };
}

export async function updateUserAddress(data: any) {
  const { userId } = await requireUserWithRefresh();

  if (data.isDefault) {
    await db
      .update(address)
      .set({ isDefault: false })
      .where(eq(address.userId, userId));
  }

  const [updated] = await db
    .update(address)
    .set({
      fullName: data.fullName || "",
      phone: data.phone || "",
      streetAddress1: data.street ?? data.streetAddress1 ?? "",
      streetAddress2: data.locality ?? data.streetAddress2 ?? "",
      city: data.city || "",
      state: data.state || "",
      pincode: data.pincode || "",
      country: data.country || "India",
      isDefault: Boolean(data.isDefault),
    })
    .where(
      and(
        eq(address.id, Number(data.id)),
        eq(address.userId, userId)
      )
    )
    .returning();

  return {
    success: true,
    data: updated
      ? {
          ...updated,
          street: updated.streetAddress1 || "",
          locality: updated.streetAddress2 || "",
          fullName: updated.fullName || "",
          phone: updated.phone || "",
        }
      : null,
  };
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
        fullName: data.fullName || "",
        phone: data.phone || "",
        streetAddress1: data.street || "",
        streetAddress2: data.locality || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        country: data.country || "India",
        isDefault: data.isDefault ?? false,
      })
      .returning();

    return {
      success: true,
      data: {
        ...newAddress,
        street: newAddress.streetAddress1 || "",
        locality: newAddress.streetAddress2 || "",
        fullName: newAddress.fullName || "",
        phone: newAddress.phone || "",
      },
    };
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

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  if (!data.name || !data.email || !data.message) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (!emailRegex.test(data.email.trim())) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    await db.insert(contactUs).values({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone ? data.phone.trim() : null,
      message: data.message.trim(),
    });

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully. We will get back to you shortly.",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again or WhatsApp us directly.",
    };
  }
}
