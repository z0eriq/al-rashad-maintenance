"use client";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (json.success) {
      if (json.data.redirectTo !== "/admin") {
        toast("هذا الحساب ليس حساب مدير", "error");
        await fetch("/api/auth/logout", { method: "POST" });
        return;
      }
      toast("مرحباً بك في لوحة الإدارة", "success");
      router.push("/admin");
      router.refresh();
    } else {
      toast(json.error || "فشل تسجيل الدخول", "error");
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
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">لوحة الإدارة</h1>
          </div>
          <p className="text-center text-sm text-gray-500 mb-6">تسجيل دخول الموظفين — إدارة الحجوزات</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              id="email"
              type="email"
              dir="ltr"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="كلمة المرور"
              id="password"
              type="password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" loading={isSubmitting} className="w-full">
              دخول
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link href="/admin/forgot-password" className="text-primary hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
