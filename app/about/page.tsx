import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/utils";
import { Car, Eye, Heart, MapPin, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "شركة الرشاد لصيانة السيارات وتجارة قطع غيارها - الوكيل الحصري لكيا عراق في الحلة، بابل",
};

export default function AboutPage() {
  const yearsOfExperience = new Date().getFullYear() - 2012;

  return (
    <PublicLayout>
      <section className="bg-gradient-to-bl from-primary to-primary-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">من نحن</h1>
          <p className="mt-4 max-w-3xl text-blue-100 leading-relaxed">
            شركة الرشاد لصيانة السيارات وتجارة قطع غيارها — {SITE_CONFIG.tagline}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">مقدمة</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                المجموعة الدولية العراقية لتجارة قطع غيار السيارات وصيانتها.
                تأسست الشركة بتاريخ {SITE_CONFIG.founded} ويقع المقر الرئيسي في
                شارع ٦٠ في الحلة، محافظة بابل.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                بالإضافة إلى ذلك، تقدم الشركة خدمات الصيانة الشاملة تحت إشراف
                فنيين متخصصين وقوة عاملة ماهرة ومجهزة بأحدث الأجهزة والأدوات
                والمعدات اللازمة لصيانة السيارات الحديثة.
              </p>
              <p className="text-gray-600 leading-relaxed">
                نفخر بكوننا الوكيل الحصري لكيا عراق، مما يضمن لعملائنا الحصول
                على قطع غيار أصلية وصيانة بمعايير عالية الجودة.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 h-72 flex flex-col items-center justify-center">
              <Car className="h-16 w-16 text-primary mb-4" />
              <p className="text-5xl font-bold text-primary">{yearsOfExperience}+</p>
              <p className="text-gray-600 mt-2">سنة من الخبرة والتميز</p>
              <p className="text-sm text-gray-500 mt-2">منذ {SITE_CONFIG.founded}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">رسالتنا</h3>
              <p className="text-gray-600 leading-relaxed">
                تقديم خدمات صيانة سيارات عالية الجودة وقطع غيار أصلية بأسعار
                تنافسية، مع الالتزام بمواعيد العملاء وتوفير تجربة خدمة استثنائية
                تفوق توقعاتهم في محافظة بابل ومحيطها.
              </p>
            </Card>
            <Card>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">رؤيتنا</h3>
              <p className="text-gray-600 leading-relaxed">
                أن نكون المركز الأول والأكثر ثقة في صيانة السيارات وتجارة قطع
                الغيار في وسط العراق، من خلال الابتكار المستمر والتزامنا
                بمعايير الجودة العالمية كوكيل حصري لكيا.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="!p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">قسم الصيانة</h3>
                <div className="grid gap-3 sm:grid-cols-2 text-gray-600">
                  <div>
                    <p className="text-sm text-gray-500">الهاتف</p>
                    <p dir="ltr" className="font-medium">{SITE_CONFIG.phone}</p>
                    <p dir="ltr" className="font-medium">{SITE_CONFIG.phone2}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{SITE_CONFIG.email}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="font-medium">{SITE_CONFIG.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="mx-auto h-12 w-12 text-secondary mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-4">قيمنا</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {["الجودة", "الأمانة", "الاحترافية", "الثقة"].map((value) => (
              <div key={value} className="rounded-xl border border-border bg-white p-6">
                <p className="font-bold text-primary">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
