"use client";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { forgotPasswordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ForgotInput = z.infer<typeof forgotPasswordSchema>;

export default function AdminForgotPasswordPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotInput) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      toast(json.data?.message || "تم الإرسال", "success");
    } else {
      toast(json.error || "فشل الإرسال", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <div className="text-white [&_span]:text-white">
            <Logo />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <KeyRound className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">نسيت كلمة المرور</h1>
          </div>
          <p className="text-center text-sm text-gray-500 mb-6">
            أدخل بريد حساب المدير وسنرسل رابط إعادة التعيين
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              id="email"
              type="email"
              dir="ltr"
              error={errors.email?.message}
              {...register("email")}
            />
            <Button type="submit" loading={isSubmitting} className="w-full">
              إرسال رابط إعادة التعيين
            </Button>
          </form>
          <p className="mt-6 text-center text-sm">
            <Link href="/admin/login" className="text-primary hover:underline">
              ← العودة لتسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
