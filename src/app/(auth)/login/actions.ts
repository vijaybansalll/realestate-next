"use server";

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
    return { success: true };
  }

  return {
    success: false,
    error: "Invalid User ID or Password. Please try again.",
  };
}
