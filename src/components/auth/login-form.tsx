"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { loginAction } from "@/app/(auth)/login/actions";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userPassword: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
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
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setFormState({
          isLoading: false,
          errorMessage: result.error || "Invalid User ID or Password.",
        });
      }
    } catch {
      setFormState({
        isLoading: false,
        errorMessage: "An error occurred while logging in. Please try again.",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-neutral-950 font-sans text-neutral-100">
      {/* Back Arrow Button at the Top to go to Home Page */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-sm font-medium text-neutral-300 backdrop-blur-md transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-4" />
          <span>Home</span>
        </Link>
      </div>

      <div className="flex min-h-screen w-full">
        {/* Left Side: Login Form Section */}
        <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-1/2">
          <div className="relative flex w-full max-w-sm flex-col items-center p-8 outline-0 outline-border/40 outline-offset-0.5 sm:outline-2 dark:outline-border/80">
            {/* Architectural Frame Accents */}
            <div className="absolute inset-x-0 top-0 w-[calc(100%+4rem)] -translate-x-8 border-t border-neutral-800 max-sm:hidden" />
            <div className="absolute inset-x-0 bottom-0 w-[calc(100%+4rem)] -translate-x-8 border-b border-neutral-800 max-sm:hidden" />
            <div className="absolute inset-y-0 left-0 h-[calc(100%+4rem)] -translate-y-8 border-s border-neutral-800 max-sm:hidden" />
            <div className="absolute inset-y-0 right-0 h-[calc(100%+4rem)] -translate-y-8 border-e border-neutral-800 max-sm:hidden" />

            <div className="absolute inset-x-0 -top-1 w-[calc(100%+3rem)] -translate-x-6 border-t border-neutral-800 max-sm:hidden" />
            <div className="absolute inset-x-0 -bottom-1 w-[calc(100%+3rem)] -translate-x-6 border-b border-neutral-800 max-sm:hidden" />
            <div className="absolute inset-y-0 -left-1 h-[calc(100%+3rem)] -translate-y-6 border-s border-neutral-800 max-sm:hidden" />
            <div className="absolute inset-y-0 -right-1 h-[calc(100%+3rem)] -translate-y-6 border-e border-neutral-800 max-sm:hidden" />

            {/* 1. Logo */}
            <Logo className="h-8 w-auto fill-current text-neutral-100" />

            {/* 2. Login Title */}
            <h1 className="mt-4 text-xl font-medium tracking-tight text-neutral-100">
              Login
            </h1>

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
                    <FieldLabel>User ID</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      className="w-full border-neutral-800 bg-neutral-900/60 text-neutral-100 placeholder:text-neutral-500 focus-visible:border-amber-400/80 focus-visible:ring-amber-400/20"
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
                    <FieldLabel>User Password</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      className="w-full border-neutral-800 bg-neutral-900/60 text-neutral-100 placeholder:text-neutral-500 focus-visible:border-amber-400/80 focus-visible:ring-amber-400/20"
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
                  className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-center text-xs text-red-400"
                >
                  {formState.errorMessage}
                </div>
              )}

              {formState.successMessage && (
                <div
                  role="status"
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-center text-xs text-emerald-400"
                >
                  {formState.successMessage}
                </div>
              )}

              {/* 5. Submit Button */}
              <Button
                className="mt-6 w-full cursor-pointer bg-neutral-100 font-medium text-neutral-950 transition-colors hover:bg-neutral-200 disabled:opacity-50"
                disabled={formState.isLoading}
                type="submit"
              >
                {formState.isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side: Canadian Wooden House Image Section */}
        <div className="relative hidden w-full grow border-l border-neutral-800 bg-neutral-900 lg:block lg:w-1/2">
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
