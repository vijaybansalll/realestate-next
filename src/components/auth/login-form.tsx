"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { loginAction } from "@/app/(auth)/login/actions";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/ui/sonner";

const formSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userPassword: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [formState, setFormState] = useState<{
    isLoading: boolean;
    errorMessage?: string;
    successMessage?: string;
  }>({
    isLoading: false,
  });

  const form = useForm<FormValues>({
    defaultValues: {
      userId: "",
      userPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setFormState({ isLoading: true });

    try {
      const result = await loginAction(data);

      if (result.success) {
        setFormState({
          isLoading: false,
          successMessage: "Login successful! Redirecting...",
        });
        toast.success("Welcome Back", {
          description: "Login successful. Redirecting to your dashboard...",
        });
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 600);
      } else {
        const errorMsg = result.error || "Invalid User ID or Password.";
        setFormState({
          isLoading: false,
          errorMessage: errorMsg,
        });
        toast.error("Authentication Failed", {
          description: errorMsg,
        });
      }
    } catch {
      const errorMsg = "An error occurred while logging in. Please try again.";
      setFormState({
        isLoading: false,
        errorMessage: errorMsg,
      });
      toast.error("Login Error", {
        description: errorMsg,
      });
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-neutral-50 font-sans text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Top Header Bar for Back to Home & Theme Toggle */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-neutral-200/80 bg-white/90 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-neutral-700 shadow-xs backdrop-blur-md transition-colors hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-3.5 sm:size-4" />
          <span>Home</span>
        </Link>

        <ThemeToggle />
      </header>

      <div className="flex min-h-screen w-full">
        {/* Left Side: Login Form Section */}
        <div className="flex w-full flex-col items-center justify-center px-4 pt-20 pb-10 sm:p-12 lg:w-1/2">
          <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-neutral-200/80 bg-white/80 p-6 sm:p-8 shadow-xl backdrop-blur-md sm:border-transparent sm:bg-transparent sm:shadow-none sm:backdrop-blur-none sm:outline-2 outline-border/40 outline-offset-0.5 dark:border-neutral-800/80 dark:bg-neutral-900/70 sm:dark:bg-transparent dark:outline-border/80">
            {/* Architectural Frame Accents (Desktop Only) */}
            <div className="absolute inset-x-0 top-0 w-[calc(100%+4rem)] -translate-x-8 border-t border-neutral-300 max-sm:hidden dark:border-neutral-800" />
            <div className="absolute inset-x-0 bottom-0 w-[calc(100%+4rem)] -translate-x-8 border-b border-neutral-300 max-sm:hidden dark:border-neutral-800" />
            <div className="absolute inset-y-0 left-0 h-[calc(100%+4rem)] -translate-y-8 border-s border-neutral-300 max-sm:hidden dark:border-neutral-800" />
            <div className="absolute inset-y-0 right-0 h-[calc(100%+4rem)] -translate-y-8 border-e border-neutral-300 max-sm:hidden dark:border-neutral-800" />

            <div className="absolute inset-x-0 -top-1 w-[calc(100%+3rem)] -translate-x-6 border-t border-neutral-300 max-sm:hidden dark:border-neutral-800" />
            <div className="absolute inset-x-0 -bottom-1 w-[calc(100%+3rem)] -translate-x-6 border-b border-neutral-300 max-sm:hidden dark:border-neutral-800" />
            <div className="absolute inset-y-0 -left-1 h-[calc(100%+3rem)] -translate-y-6 border-s border-neutral-300 max-sm:hidden dark:border-neutral-800" />
            <div className="absolute inset-y-0 -right-1 h-[calc(100%+3rem)] -translate-y-6 border-e border-neutral-300 max-sm:hidden dark:border-neutral-800" />

            {/* 1. Logo */}
            <Logo className="h-8 w-auto text-neutral-900 dark:text-neutral-100" />

            {/* 2. Login Title */}
            <h1 className="mt-4 text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              Admin Portal
            </h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 text-center">
              Sign in to manage luxury architectural properties
            </p>

            {/* Login Form: ONLY User ID, User Password, Submit Button */}
            <form
              className="mt-6 w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* 3. User ID */}
              <Controller
                control={form.control}
                name="userId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs">User ID</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      className="w-full h-11 sm:h-10 text-sm border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-amber-500/80 focus-visible:ring-amber-500/20 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus-visible:border-amber-400/80 dark:focus-visible:ring-amber-400/20"
                      placeholder="Enter user ID"
                      type="text"
                      autoComplete="username"
                      disabled={formState.isLoading}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* 4. User Password */}
              <Controller
                control={form.control}
                name="userPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs">User Password</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      className="w-full h-11 sm:h-10 text-sm border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-amber-500/80 focus-visible:ring-amber-500/20 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus-visible:border-amber-400/80 dark:focus-visible:ring-amber-400/20"
                      placeholder="Enter user password"
                      type="password"
                      autoComplete="current-password"
                      disabled={formState.isLoading}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* Feedback messages */}
              {formState.errorMessage && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-center text-xs text-red-600 dark:text-red-400"
                >
                  {formState.errorMessage}
                </div>
              )}

              {formState.successMessage && (
                <div
                  role="status"
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-center text-xs text-emerald-600 dark:text-emerald-400"
                >
                  {formState.successMessage}
                </div>
              )}

              {/* 5. Submit Button */}
              <Button
                className="mt-6 w-full h-11 sm:h-10 cursor-pointer bg-neutral-900 font-semibold text-neutral-100 text-sm transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
                disabled={formState.isLoading}
                type="submit"
              >
                {formState.isLoading ? "Signing in..." : "Sign in to Dashboard"}
              </Button>

              {/* Sample credentials helper */}
              <div className="pt-2 text-center">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Demo access: <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">admin</code> / <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">password123</code>
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Canadian Wooden House Image Section */}
        <div className="relative hidden w-full grow border-l border-neutral-200 bg-neutral-100 lg:block lg:w-1/2 dark:border-neutral-800 dark:bg-neutral-900">
          <Image
            alt="Canadian wooden house"
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            src="/images/canadian-wooden-house.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20" />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
