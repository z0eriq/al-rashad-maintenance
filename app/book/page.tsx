"use client";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import {
  ALLOWED_CAR_TYPES,
  guestBookingSchema,
  type GuestBookingInput,
} from "@/lib/validation";
import { formatDuration } from "@/lib/scheduling";
import { formatDate, formatTime } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Car, CheckCircle, Phone, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Service {
  id: string;
  nameAr: string;
  duration: number;
  slug: string;
}

interface BookingSuccess {
  bookingNumber: string;
  guestName: string;
  guestPhone: string;
  carType: string;
  date: string;
  time: string;
  serviceName: string;
}

const CAR_TYPES = [
  { value: "", label: "-- اختر نوع السيارة --" },
  ...ALLOWED_CAR_TYPES.map((type) => ({ value: type, label: type })),
];

function BookPageContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");

  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [success, setSuccess] = useState<BookingSuccess | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GuestBookingInput>({ resolver: zodResolver(guestBookingSchema) });

  const watchedDate = watch("date");
  const watchedServiceId = watch("serviceId");

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setServices(json.data.services);
          if (preselectedService) {
            const match = json.data.services.find(
              (s: Service & { slug?: string }) => s.slug === preselectedService
            );
            if (match) setValue("serviceId", match.id);
          }
        } else {
          toast(json.error || "فشل تحميل الخدمات", "error");
        }
      })
      .catch(() => toast("فشل تحميل الخدمات", "error"));
  }, [preselectedService, setValue, toast]);

  const fetchSlots = useCallback(
    async (date: string, serviceId: string) => {
      if (!serviceId) {
        setSlots([]);
        return;
      }
      const res = await fetch(
        `/api/availability?date=${date}&serviceId=${serviceId}`
      );
      try {
        const json = await res.json();
        if (json.success) {
          setSlots(json.data.slots);
          setValue("time", "");
        } else {
          setSlots([]);
          toast(json.error || "فشل تحميل الأوقات المتاحة", "error");
        }
      } catch {
        setSlots([]);
        toast("فشل تحميل الأوقات المتاحة", "error");
      }
    },
    [setValue, toast]
  );

  useEffect(() => {
    if (watchedDate && watchedServiceId) {
      fetchSlots(watchedDate, watchedServiceId);
    }
  }, [watchedDate, watchedServiceId, fetchSlots]);

  const minDate = new Date().toISOString().split("T")[0];
  const selectedService = services.find((s) => s.id === watchedServiceId);

  const onSubmit = async (data: GuestBookingInput) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let json;
    try {
      json = await res.json();
    } catch {
      toast("فشل إرسال الحجز. حاول مرة أخرى.", "error");
      return;
    }

    if (json.success) {
      setSuccess({
        bookingNumber: json.data.bookingNumber,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        carType: data.carType,
        date: data.date,
        time: data.time,
        serviceName: json.data.appointment.service.nameAr,
      });
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast(json.error || "فشل إرسال الحجز", "error");
    }
  };

  if (success) {
    return (
      <PublicLayout>
        <section className="py-20">
          <div className="mx-auto max-w-lg px-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">تم إرسال الحجز</h1>
            <p className="text-gray-600 mb-8">
              تم استلام طلبك بنجاح. سيتواصل معك فريق الصيانة لتأكيد الموعد.
            </p>

            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 mb-8">
              <p className="text-sm text-gray-500 mb-2">رقم الحجز</p>
              <p className="text-3xl font-bold text-primary tracking-wider" dir="ltr">
                {success.bookingNumber}
              </p>
              <p className="text-xs text-gray-400 mt-2">احتفظ بهذا الرقم للمتابعة</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 text-right space-y-3 text-sm mb-8">
              <div className="flex justify-between">
                <span className="text-gray-500">الاسم</span>
                <span className="font-medium">{success.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الهاتف</span>
                <span className="font-medium" dir="ltr">{success.guestPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">نوع السيارة</span>
                <span className="font-medium">{success.carType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الخدمة</span>
                <span className="font-medium">{success.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">التاريخ والوقت</span>
                <span className="font-medium">
                  {formatDate(success.date)} — {formatTime(success.time)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => setSuccess(null)}>حجز جديد</Button>
              <Link href="/">
                <Button variant="outline">العودة للرئيسية</Button>
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="bg-gradient-to-bl from-primary to-primary-dark py-12 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">حجز موعد صيانة</h1>
          <p className="mt-3 text-blue-100">
            أدخل بياناتك واختر الخدمة والموعد — لا حاجة لتسجيل حساب
          </p>
          <p className="mt-2 text-sm text-blue-200">
            أوقات العمل: السبت–الخميس | 8:00–12:30 صباحاً و 2:00–4:00 مساءً | كل نصف ساعة
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
                <User className="h-4 w-4" /> بياناتك
              </p>
              <div className="space-y-4">
                <Input
                  label="الاسم الكامل"
                  id="guestName"
                  placeholder="أدخل اسمك"
                  error={errors.guestName?.message}
                  {...register("guestName")}
                />
                <Input
                  label="رقم الهاتف"
                  id="guestPhone"
                  dir="ltr"
                  placeholder="07XXXXXXXXX"
                  error={errors.guestPhone?.message}
                  {...register("guestPhone")}
                />
                <Select
                  label="نوع السيارة"
                  id="carType"
                  options={CAR_TYPES}
                  error={errors.carType?.message}
                  {...register("carType")}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> الموعد والخدمة
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-gray-700">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    id="date"
                    min={minDate}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register("date")}
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
                  )}
                </div>

                <Select
                  label="الخدمة المطلوبة"
                  id="serviceId"
                  options={[
                    { value: "", label: "-- اختر الخدمة --" },
                    ...services.map((s) => ({ value: s.id, label: s.nameAr })),
                  ]}
                  error={errors.serviceId?.message}
                  {...register("serviceId")}
                />

                {selectedService && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    مدة الحجز: {formatDuration(Math.min(selectedService.duration, 120))}
                  </p>
                )}

                {watchedDate && watchedServiceId && (
                  <Select
                    label="الوقت المتاح"
                    id="time"
                    options={[
                      {
                        value: "",
                        label: slots.length ? "-- اختر الوقت --" : "لا توجد أوقات متاحة",
                      },
                      ...slots.map((t) => ({ value: t, label: formatTime(t) })),
                    ]}
                    error={errors.time?.message}
                    {...register("time")}
                  />
                )}

                {watchedDate && !watchedServiceId && (
                  <p className="text-sm text-amber-600">اختر الخدمة أولاً لعرض الأوقات المتاحة</p>
                )}

                <Textarea
                  label="ملاحظات إضافية (اختياري)"
                  id="notes"
                  rows={3}
                  placeholder="وصف المشكلة أو أي تفاصيل إضافية..."
                  error={errors.notes?.message}
                  {...register("notes")}
                />
              </div>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              <Phone className="h-5 w-5" />
              إرسال الحجز
            </Button>

            <p className="text-center text-xs text-gray-400">
              بالضغط على إرسال الحجز، سيتم إرسال طلبك لفريق الصيانة للمراجعة والتأكيد
            </p>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <BookPageContent />
    </Suspense>
  );
}
