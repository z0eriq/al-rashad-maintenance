"use client";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { resetPasswordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ResetInput = z.infer<typeof resetPasswordSchema>;

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetInput) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      toast("تم تغيير كلمة المرور", "success");
      router.push("/admin/login");
    } else {
      toast(json.error || "فشل إعادة التعيين", "error");
    }
  };

  if (!token) {
    return (
      <div className="text-center text-red-600">
        رابط غير صالح.{" "}
        <Link href="/admin/forgot-password" className="underline">
          اطلب رابطاً جديداً
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("token")} />
      <Input
        label="كلمة المرور الجديدة"
        id="password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" loading={isSubmitting} className="w-full">
        تغيير كلمة المرور
      </Button>
    </form>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <div className="text-white [&_span]:text-white">
            <Logo />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <KeyRound className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">إعادة تعيين كلمة المرور</h1>
          </div>
          <Suspense fallback={<div className="text-center">جاري التحميل...</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
