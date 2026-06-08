"use client";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { SocialLinks } from "@/components/layout/SocialLinks";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SITE_CONFIG } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, MessageCircle, Phone, Send, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/lib/validation";

export default function ContactPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      toast(json.data.message, "success");
      reset();
    } else {
      toast(json.error || "حدث خطأ", "error");
    }
  };

  const mapLat = SITE_CONFIG.mapLat;
  const mapLng = SITE_CONFIG.mapLng;

  return (
    <PublicLayout>
      <section className="bg-gradient-to-bl from-primary to-primary-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">اتصل بنا</h1>
          <p className="mt-4 text-blue-100">
            قسم الصيانة جاهز لاستقبال استفساراتك وحجوزاتك. تواصل معنا بأي طريقة تناسبك.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">أرسل رسالة</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="الاسم"
                  id="name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="البريد الإلكتروني"
                  id="email"
                  type="email"
                  dir="ltr"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="رقم الهاتف"
                  id="phone"
                  dir="ltr"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="الموضوع"
                  id="subject"
                  error={errors.subject?.message}
                  {...register("subject")}
                />
                <Textarea
                  label="الرسالة"
                  id="message"
                  rows={5}
                  error={errors.message?.message}
                  {...register("message")}
                />
                <Button type="submit" loading={isSubmitting} className="w-full">
                  <Send className="h-4 w-4" />
                  إرسال الرسالة
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary">قسم الصيانة</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: "الهاتف الأول", value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone}` },
                  { icon: Phone, label: "الهاتف الثاني", value: SITE_CONFIG.phone2, href: `tel:${SITE_CONFIG.phone2}` },
                  { icon: Mail, label: "البريد الإلكتروني", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                  {
                    icon: MapPin,
                    label: "العنوان",
                    value: SITE_CONFIG.address,
                    href: SITE_CONFIG.mapsUrl,
                    external: true,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-medium text-primary hover:underline"
                          dir={item.external ? undefined : "ltr"}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن صيانة السيارات أو حجز موعد")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-white font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                تواصل عبر واتساب
              </a>

              <div className="rounded-2xl border border-border bg-white p-6 text-center">
                <h3 className="text-lg font-bold text-primary mb-2">قيّم خدمتنا</h3>
                <p className="text-sm text-gray-500 mb-4">
                  رأيك يهمّنا — امسح الرمز أو اضغط الزر أدناه
                </p>
                <a
                  href={SITE_CONFIG.ratingFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Image
                    src="/rate-qr.png"
                    alt="رمز QR لتقييم خدمة الرشاد"
                    width={180}
                    height={180}
                    className="mx-auto rounded-xl border border-border"
                  />
                </a>
                <a
                  href={SITE_CONFIG.ratingFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary/90 transition-colors"
                >
                  <Star className="h-4 w-4" />
                  قيّمنا
                </a>
              </div>

              <div>
                <h3 className="text-lg font-bold text-primary mb-4">وسائل التواصل الاجتماعي</h3>
                <SocialLinks variant="contact" />
              </div>

              <div className="rounded-2xl overflow-hidden border border-border">
                <iframe
                  title="موقع الشركة"
                  src={`https://maps.google.com/maps?q=${mapLat},${mapLng}&z=15&output=embed`}
                  className="w-full h-56 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={SITE_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  فتح الموقع في خرائط جوجل
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
