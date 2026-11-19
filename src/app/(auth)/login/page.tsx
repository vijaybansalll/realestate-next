import type { Metadata } from "next";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Login | Architectural Real Estate",
  description: "Sign in to access your account",
};

export default function LoginPage() {
  return <LoginForm />;
}
