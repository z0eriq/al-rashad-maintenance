import { SITE_CONFIG, SITE_SOCIAL } from "@/lib/utils";
import { ExternalLink, Facebook, Instagram, MapPin } from "lucide-react";

interface SocialLinksProps {
  variant?: "footer" | "contact";
}

export function SocialLinks({ variant = "contact" }: SocialLinksProps) {
  const linkClass =
    variant === "footer"
      ? "text-sm text-blue-100 hover:text-white transition-colors flex items-center gap-2"
      : "flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors";

  const sectionTitleClass =
    variant === "footer"
      ? "mb-3 text-sm font-bold text-white"
      : "text-sm font-bold text-primary mb-2";

  return (
    <div className={variant === "footer" ? "space-y-4" : "space-y-6"}>
      <div>
        <p className={sectionTitleClass}>موقعنا</p>
        <a
          href={SITE_CONFIG.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <MapPin className="h-4 w-4 shrink-0" />
          <span>عرض الموقع على خرائط جوجل</span>
          {variant === "contact" && <ExternalLink className="h-4 w-4 mr-auto text-gray-400" />}
        </a>
      </div>

      <div>
        <p className={sectionTitleClass}>
          <Instagram className="inline h-4 w-4 ml-1" />
          إنستغرام
        </p>
        <ul className={variant === "footer" ? "space-y-2" : "space-y-3"}>
          {SITE_SOCIAL.instagram.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {variant === "contact" && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600">
                    <Instagram className="h-5 w-5" />
                  </span>
                )}
                <span>{item.label}</span>
                {variant === "contact" && (
                  <ExternalLink className="h-4 w-4 mr-auto text-gray-400" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className={sectionTitleClass}>
          <Facebook className="inline h-4 w-4 ml-1" />
          فيسبوك
        </p>
        <ul className={variant === "footer" ? "space-y-2" : "space-y-3"}>
          {SITE_SOCIAL.facebook.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {variant === "contact" && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <Facebook className="h-5 w-5" />
                  </span>
                )}
                <span>{item.label}</span>
                {variant === "contact" && (
                  <ExternalLink className="h-4 w-4 mr-auto text-gray-400" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
