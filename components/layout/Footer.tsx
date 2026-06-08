import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { SITE_CONFIG } from "@/lib/utils";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  روابط: [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/services", label: "خدماتنا" },
    { href: "/contact", label: "اتصل بنا" },
  ],
  الحجز: [
    { href: "/book", label: "حجز موعد صيانة" },
    { href: "/services", label: "خدماتنا" },
    { href: "/contact", label: "اتصل بنا" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-blue-100 leading-relaxed">
              شركة الرشاد لصيانة السيارات وتجارة قطع غيارها — الوكيل الحصري
              لكيا عراق. صيانة شاملة للسيارات في الحلة، محافظة بابل منذ 2012.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-bold">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-100 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 font-bold">قسم الصيانة</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-blue-100">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr">{SITE_CONFIG.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-blue-100">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr">{SITE_CONFIG.phone2}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-blue-100">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{SITE_CONFIG.email}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-100">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <a
                  href={SITE_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.address}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold">تابعنا</h4>
            <SocialLinks variant="footer" />
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-blue-100">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
