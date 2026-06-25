import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, pattern = "d MMMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: arSA });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد الانتظار",
  APPROVED: "موافق عليه",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export { generateTimeSlots, formatDuration, isBookableDay, isFriday } from "./scheduling";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}

const DEFAULT_SITE_URL = "https://alrashad.com.iq";
const DEFAULT_ADDRESS = "بابل - الحلة - شارع ٦٠ قرب مجسر الثورة";
const DEFAULT_MAPS_URL = "https://maps.app.goo.gl/8Y8RAQAC7pVGJLoh7";

function hasBrokenEncoding(value: string): boolean {
  return /\?{2,}|\uFFFD/.test(value);
}

function envText(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && !hasBrokenEncoding(value) ? value : fallback;
}

function envUrl(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  if (!value || hasBrokenEncoding(value)) {
    return fallback;
  }

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const SITE_CONFIG = {
  name: "شركة الرشاد لصيانة السيارات",
  shortName: "الرشاد",
  nameEn: "Al Rashad Auto Maintenance",
  tagline: "الوكيل الحصري لكيا عراق",
  description:
    "شركة الرشاد لصيانة السيارات وتجارة قطع غيارها - المجموعة الدولية العراقية. صيانة شاملة للسيارات في الحلة، محافظة بابل منذ 2012.",
  founded: "10/1/2012",
  url: envUrl("NEXT_PUBLIC_APP_URL", DEFAULT_SITE_URL),
  phone: envText("NEXT_PUBLIC_PHONE", "07830032800"),
  phone2: envText("NEXT_PUBLIC_PHONE2", "07730032800"),
  email: envText("NEXT_PUBLIC_EMAIL", "info@alrashad.com.iq"),
  whatsapp: envText("NEXT_PUBLIC_WHATSAPP_NUMBER", "9647830032800"),
  address: envText("NEXT_PUBLIC_ADDRESS", DEFAULT_ADDRESS),
  mapsUrl: envUrl("NEXT_PUBLIC_MAPS_URL", DEFAULT_MAPS_URL),
  mapLat: envText("NEXT_PUBLIC_MAP_LAT", "32.4739"),
  mapLng: envText("NEXT_PUBLIC_MAP_LNG", "44.4100"),
  ratingFormUrl:
    envUrl("NEXT_PUBLIC_RATING_FORM_URL", "https://forms.gle/b3SNXJd2UwpiQWHS9"),
};

export const SITE_SOCIAL = {
  instagram: [
    {
      url: "https://www.instagram.com/alrashad_company/",
      label: "الإنستغرام الرسمي",
    },
    {
      url: "https://www.instagram.com/alrashad_changan/",
      label: "إنستغرام حصريات شانجان",
    },
    {
      url: "https://www.instagram.com/alrashadautospareparts/",
      label: "إنستغرام قسم الصيانة",
    },
  ],
  facebook: [
    {
      url: "https://www.facebook.com/profile.php?id=61588880280889",
      label: "فيسبوك الرسمي",
    },
    {
      url: "https://www.facebook.com/alrashadautospareparts",
      label: "فيسبوك الصيانة وقطع الغيار",
    },
    {
      url: "https://www.facebook.com/profile.php?id=61574721794219",
      label: "المعرض ومبيعات السيارات",
    },
  ],
} as const;
