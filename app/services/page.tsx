import { PublicLayout } from "@/components/layout/PublicLayout";
import { ServiceIcon } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "خدمات صيانة السيارات",
  description:
    "خدمات صيانة السيارات الشاملة - صيانة دورية، محرك، فرامل، تكييف، زيت، فحص شامل، قطع غيار كيا",
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const services = await safeQuery(
    () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    []
  );

  return (
    <PublicLayout>
      <section className="bg-gradient-to-bl from-primary to-primary-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">خدماتنا</h1>
          <p className="mt-4 max-w-2xl text-blue-100">
            خدمات صيانة شاملة للسيارات بإشراف فنيين متخصصين — الوكيل الحصري لكيا عراق
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} hover>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ServiceIcon icon={service.icon} className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-primary">{service.nameAr}</h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{service.descriptionAr}</p>
                <div className="mt-4 flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {service.duration} دقيقة
                </div>
                <div className="mt-6 flex gap-2">
                  <Link href={`/services/${service.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      التفاصيل
                    </Button>
                  </Link>
                  <Link href="/book" className="flex-1">
                    <Button className="w-full" size="sm">
                      احجز الآن
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
