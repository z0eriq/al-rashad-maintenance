import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card } from "@/components/ui/Card";
import { SITE_CONFIG } from "@/lib/utils";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Privacy Policy",
  description:
    "سياسة الخصوصية لتطبيق الرشاد لحجز مواعيد صيانة السيارات باللغة العربية والإنجليزية.",
};

const lastUpdatedAr = "20 يونيو 2026";
const lastUpdatedEn = "June 20, 2026";

const arabicSections = [
  {
    title: "المعلومات التي نجمعها",
    content: "قد يطلب التطبيق من المستخدم إدخال المعلومات التالية:",
    items: [
      "الاسم",
      "رقم الهاتف",
      "نوع السيارة",
      "بيانات الحجز مثل الخدمة المختارة، التاريخ، الوقت، والملاحظات الاختيارية",
    ],
  },
  {
    title: "كيفية استخدام المعلومات",
    content: "نستخدم هذه المعلومات للأغراض التالية:",
    items: [
      "إنشاء موعد صيانة لدى شركة الرشاد",
      "التواصل مع المستخدم بخصوص الحجز",
      "عرض الخدمات والأوقات المتاحة",
      "تحسين تجربة استخدام التطبيق وخدمات الصيانة",
    ],
  },
  {
    title: "مشاركة المعلومات",
    paragraphs: [
      "لا نقوم ببيع أو تأجير بيانات المستخدمين لأي طرف ثالث.",
      "قد تتم مشاركة بيانات الحجز مع نظام الحجز الخاص بشركة الرشاد فقط لغرض إدارة مواعيد الصيانة وتنفيذ الخدمة المطلوبة.",
    ],
  },
  {
    title: "تخزين البيانات",
    paragraphs: [
      "يتم إرسال بيانات الحجز إلى نظام الحجز الخاص بشركة الرشاد. كما قد يحتفظ التطبيق محليًا على جهاز المستخدم بالاسم ورقم الهاتف لتسهيل عمليات الحجز المستقبلية.",
    ],
  },
  {
    title: "حماية البيانات",
    paragraphs: [
      "نلتزم باتخاذ إجراءات مناسبة لحماية بيانات المستخدمين من الوصول غير المصرح به أو الاستخدام غير المشروع.",
    ],
  },
  {
    title: "الإشعارات",
    paragraphs: [
      "قد يستخدم التطبيق إشعارات محلية أو إشعارات عبر Firebase Cloud Messaging لإرسال تنبيهات متعلقة بالحجز أو التذكير بالموعد، عند تفعيل هذه الخدمة.",
    ],
  },
  {
    title: "روابط خارجية",
    paragraphs: [
      "قد يحتوي التطبيق على روابط تؤدي إلى موقع شركة الرشاد الرسمي، مثل صفحة من نحن وصفحة تواصل معنا. نحن غير مسؤولين عن محتوى أو سياسات الخصوصية الخاصة بأي مواقع خارجية غير تابعة لنا.",
    ],
  },
  {
    title: "حقوق المستخدم",
    paragraphs: [
      "يمكن للمستخدم طلب تعديل أو حذف بياناته المتعلقة بالحجز من خلال التواصل مع شركة الرشاد عبر بيانات التواصل أدناه.",
    ],
  },
  {
    title: "خصوصية الأطفال",
    paragraphs: [
      "التطبيق غير موجه للأطفال دون سن 13 عامًا، ولا نقوم بجمع بيانات الأطفال بشكل مقصود.",
    ],
  },
  {
    title: "التغييرات على سياسة الخصوصية",
    paragraphs: [
      "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تحديث على هذه الصفحة.",
    ],
  },
];

const englishSections = [
  {
    title: "Information We Collect",
    content: "The application may ask users to provide the following information:",
    items: [
      "Name",
      "Phone number",
      "Vehicle type",
      "Booking details such as the selected service, date, time, and optional notes",
    ],
  },
  {
    title: "How We Use Information",
    content: "We use this information for the following purposes:",
    items: [
      "Creating a maintenance appointment with Al Rashad",
      "Contacting the user regarding the booking",
      "Displaying available services and appointment times",
      "Improving the application experience and maintenance services",
    ],
  },
  {
    title: "Information Sharing",
    paragraphs: [
      "We do not sell or rent user data to any third party.",
      "Booking data may be shared only with Al Rashad's booking system for the purpose of managing maintenance appointments and delivering the requested service.",
    ],
  },
  {
    title: "Data Storage",
    paragraphs: [
      "Booking data is sent to Al Rashad's booking system. The application may also store the user's name and phone number locally on the user's device to make future bookings easier.",
    ],
  },
  {
    title: "Data Protection",
    paragraphs: [
      "We are committed to taking appropriate measures to protect user data from unauthorized access or unlawful use.",
    ],
  },
  {
    title: "Notifications",
    paragraphs: [
      "The application may use local notifications or Firebase Cloud Messaging to send booking-related alerts or appointment reminders when this service is enabled.",
    ],
  },
  {
    title: "External Links",
    paragraphs: [
      "The application may contain links to Al Rashad's official website, such as the About Us and Contact Us pages. We are not responsible for the content or privacy policies of any external websites that are not affiliated with us.",
    ],
  },
  {
    title: "User Rights",
    paragraphs: [
      "Users may request to modify or delete their booking-related data by contacting Al Rashad using the contact details below.",
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "The application is not directed to children under the age of 13, and we do not knowingly collect children's data.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Any update will be published on this page.",
    ],
  },
];

function PolicySection({
  title,
  content,
  paragraphs,
  items,
}: {
  title: string;
  content?: string;
  paragraphs?: string[];
  items?: string[];
}) {
  return (
    <section className="border-b border-border pb-6 last:border-b-0 last:pb-0">
      <h3 className="mb-3 text-xl font-bold text-primary">{title}</h3>
      {content && <p className="mb-3 leading-relaxed text-gray-600">{content}</p>}
      {paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mb-3 leading-relaxed text-gray-600 last:mb-0">
          {paragraph}
        </p>
      ))}
      {items && (
        <ul className="space-y-2 text-gray-600">
          {items.map((item) => (
            <li key={item} className="flex gap-2 leading-relaxed">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ContactDetails({ lang }: { lang: "ar" | "en" }) {
  const isArabic = lang === "ar";

  return (
    <Card className="bg-muted">
      <h3 className="mb-4 text-xl font-bold text-primary">
        {isArabic ? "التواصل معنا" : "Contact Us"}
      </h3>
      <p className="mb-4 leading-relaxed text-gray-600">
        {isArabic
          ? "لأي استفسار حول سياسة الخصوصية، يمكنكم التواصل معنا عبر:"
          : "For any inquiries about this Privacy Policy, please contact us through:"}
      </p>
      <div className="grid gap-3 text-gray-700 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-500">{isArabic ? "الهاتف" : "Phone"}</p>
            <p dir="ltr" className="font-medium">
              {SITE_CONFIG.phone} / {SITE_CONFIG.phone2}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-gray-500">
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </p>
            <p className="font-medium">{SITE_CONFIG.email}</p>
          </div>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">
            {isArabic ? "الموقع" : "Website"}
          </p>
          <a
            href={SITE_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="font-medium text-primary hover:text-primary-dark"
          >
            {SITE_CONFIG.url}
          </a>
        </div>
      </div>
    </Card>
  );
}

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-bl from-primary to-primary-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold">سياسة الخصوصية</h1>
              <p className="mt-3 text-lg text-blue-100">Privacy Policy</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 text-blue-100">
              <p>آخر تحديث: {lastUpdatedAr}</p>
              <p dir="ltr">Last updated: {lastUpdatedEn}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Card className="!p-8">
            <div dir="rtl">
              <div className="mb-8">
                <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                  العربية
                </span>
                <p className="mt-5 leading-relaxed text-gray-600">
                  توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات عند
                  استخدام تطبيق الرشاد لحجز مواعيد صيانة السيارات.
                </p>
              </div>
              <div className="space-y-6">
                {arabicSections.map((section) => (
                  <PolicySection key={section.title} {...section} />
                ))}
              </div>
              <div className="mt-8">
                <ContactDetails lang="ar" />
              </div>
            </div>
          </Card>

          <Card className="!p-8">
            <div dir="ltr">
              <div className="mb-8">
                <span className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-primary">
                  English
                </span>
                <p className="mt-5 leading-relaxed text-gray-600">
                  This Privacy Policy explains how information is collected, used,
                  and protected when using the Al Rashad application for booking car
                  maintenance appointments.
                </p>
              </div>
              <div className="space-y-6">
                {englishSections.map((section) => (
                  <PolicySection key={section.title} {...section} />
                ))}
              </div>
              <div className="mt-8">
                <ContactDetails lang="en" />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
