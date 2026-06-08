import { PublicLayout } from "@/components/layout/PublicLayout";
import { ServiceIcon } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { SITE_CONFIG } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await safeQuery(
    () => prisma.service.findFirst({ where: { slug } }),
    null
  );
  if (!service) return { title: "خدمة غير موجودة" };
  return {
    title: service.nameAr,
    description: service.descriptionAr,
  };
}

export const revalidate = 3600;

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await safeQuery(
    () =>
      prisma.service.findFirst({
        where: { slug, isActive: true },
      }),
    null
  );

  if (!service) notFound();

  const features = [
    "فنيون متخصصون في صيانة السيارات",
    "قطع غيار أصلية — وكيل كيا حصري",
    "أحدث الأجهزة والمعدات",
    "صيانة شاملة تحت إشراف متخصصين",
  ];

  return (
    <PublicLayout>
      <section className="bg-gradient-to-bl from-primary to-primary-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <ServiceIcon icon={service.icon} className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{service.nameAr}</h1>
              <p className="mt-2 text-blue-100">{SITE_CONFIG.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-primary mb-4">عن الخدمة</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {service.descriptionAr}
              </p>

              <h3 className="text-xl font-bold text-primary mt-8 mb-4">مميزات الخدمة</h3>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Card className="h-fit sticky top-24">
              <h3 className="font-bold text-primary text-lg mb-4">احجز هذه الخدمة</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">المدة التقريبية</span>
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <Clock className="h-4 w-4" />
                    {service.duration} دقيقة
                  </span>
                </div>
              </div>
              <Link href={`/book?service=${service.slug}`}>
                <Button className="w-full" size="lg">احجز موعد</Button>
              </Link>
              <Link href="/services" className="block mt-3">
                <Button variant="ghost" className="w-full" size="sm">
                  ← العودة للخدمات
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
