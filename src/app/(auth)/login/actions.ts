"use server";

import { cookies } from "next/headers";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAction(credentials: {
  userId: string;
  userPassword: string;
}): Promise<LoginResult> {
  const envUserId = (
    process.env.USERID ||
    process.env.USER_ID ||
    process.env.USERNAME ||
    "admin"
  ).trim();

  const envUserPassword = (
    process.env.USERPASSWORD ||
    process.env.USER_PASSWORD ||
    process.env.PASSWORD ||
    "password123"
  ).trim();

  const inputUserId = (credentials.userId || "").trim();
  const inputUserPassword = (credentials.userPassword || "").trim();

  if (inputUserId === envUserId && inputUserPassword === envUserPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days persistent session
    });

    return { success: true };
  }

  return {
    success: false,
    error: "Invalid User ID or Password. Please try again.",
  };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function checkAuthStatus(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "authenticated";
}
