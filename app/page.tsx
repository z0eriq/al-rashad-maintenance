import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/layout/Logo";
import { Card } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { SITE_CONFIG } from "@/lib/utils";
import {
  Award,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

async function getServices() {
  return safeQuery(
    () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
    []
  );
}

const reviews = [
  {
    name: "علي حسين",
    text: "صيانة ممتازة لسيارتي كيا. فريق محترف وقطع غيار أصلية.",
    rating: 5,
  },
  {
    name: "محمد كاظم",
    text: "أفضل مركز صيانة في الحلة. التزام بالمواعيد وأسعار مناسبة.",
    rating: 5,
  },
  {
    name: "حسين عبدالله",
    text: "تعاملت معهم أكثر من مرة. صيانة شاملة وأجهزة حديثة.",
    rating: 5,
  },
];

const features = [
  {
    icon: Shield,
    title: "الوكيل الحصري لكيا",
    desc: "قطع غيار أصلية وصيانة معتمدة لسيارات كيا",
  },
  {
    icon: Wrench,
    title: "أحدث المعدات",
    desc: "مجهزون بأحدث الأجهزة والأدوات لصيانة السيارات الحديثة",
  },
  {
    icon: Users,
    title: "فنيون متخصصون",
    desc: "فريق فني ماهر تحت إشراف متخصصين في صيانة السيارات",
  },
  {
    icon: Clock,
    title: "صيانة شاملة",
    desc: "خدمات صيانة متكاملة لجميع أنظمة السيارة",
  },
];

export default async function HomePage() {
  const services = await getServices();
  const yearsOfExperience = new Date().getFullYear() - 2012;

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary to-primary-dark text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-secondary" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-secondary" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl animate-fade-in">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              {SITE_CONFIG.tagline} — منذ {SITE_CONFIG.founded}
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              صيانة السيارات
              <span className="block text-secondary">وتجارة قطع الغيار</span>
            </h1>
            <p className="mt-6 text-lg text-blue-100 leading-relaxed">
              شركة الرشاد لصيانة السيارات وتجارة قطع غيارها — المجموعة الدولية
              العراقية. نقدم صيانة شاملة للسيارات في الحلة بأحدث المعدات وفريق
              فني متخصص. احجز موعد صيانة سيارتك الآن.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book">
                <Button size="lg" variant="secondary">
                  <Calendar className="h-5 w-5" />
                  احجز موعد صيانة
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  تصفح خدماتنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: `${yearsOfExperience}+`, label: "سنة خبرة" },
            { value: "كيا", label: "وكيل حصري" },
            { value: "8+", label: "خدمات صيانة" },
            { value: "100%", label: "فنيون متخصصون" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Car className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4">من نحن</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                تأسست الشركة بتاريخ {SITE_CONFIG.founded} ويقع المقر الرئيسي في
                شارع ٦٠ في الحلة، محافظة بابل. نحن الوكيل الحصري لكيا عراق —
                المجموعة الدولية العراقية لتجارة قطع غيار السيارات وصيانتها.
              </p>
              <p className="text-gray-600 leading-relaxed">
                نقدم خدمات الصيانة الشاملة تحت إشراف فنيين متخصصين وقوة عاملة
                ماهرة، مجهزين بأحدث الأجهزة والأدوات والمعدات اللازمة لصيانة
                السيارات الحديثة.
              </p>
              <Link href="/about" className="inline-block mt-4 text-primary font-medium hover:underline">
                اقرأ المزيد عن الشركة ←
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
              <h3 className="font-bold text-primary text-lg mb-4">قسم الصيانة</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                  <span dir="ltr">{SITE_CONFIG.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                  <span dir="ltr">{SITE_CONFIG.phone2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                  <span>{SITE_CONFIG.email}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                  <a
                    href={SITE_CONFIG.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {SITE_CONFIG.address}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">خدمات صيانة السيارات</h2>
            <p className="mt-3 text-gray-600">
              صيانة شاملة لجميع أنظمة السيارة بإشراف فنيين متخصصين
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} hover className="group">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ServiceIcon icon={service.icon} className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-primary">{service.nameAr}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {service.descriptionAr}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    التفاصيل ←
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services">
              <Button variant="outline">عرض جميع الخدمات</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">لماذا تختار الرشاد؟</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-primary">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">آراء عملائنا</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <Card key={review.name}>
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-4 font-semibold text-primary">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Award className="mx-auto h-12 w-12 text-secondary mb-4" />
          <h2 className="text-3xl font-bold">جاهز لصيانة سيارتك؟</h2>
          <p className="mt-4 text-blue-100 max-w-xl mx-auto">
            احجز موعدك الآن عبر الموقع أو تواصل مع قسم الصيانة مباشرة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/book">
              <Button size="lg" variant="secondary">
                احجز موعد صيانة
              </Button>
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                تواصل عبر واتساب
              </Button>
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
