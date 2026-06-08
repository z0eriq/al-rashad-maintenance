import {
  AirVent,
  Car,
  CircleDot,
  Cog,
  Fuel,
  Gauge,
  LucideIcon,
  Settings,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const iconMap: Record<string, LucideIcon> = {
  car: Car,
  gauge: Gauge,
  brakes: CircleDot,
  "air-vent": AirVent,
  fuel: Fuel,
  settings: Settings,
  wrench: Wrench,
  cog: Cog,
};

export function ServiceIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = iconMap[icon] || Wrench;
  return <Icon className={className} />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className || ""}`}>
      <Image
        src="/al-rashad-logo.png"
        alt="شركة الرشاد لصيانة السيارات - Al Rashad"
        width={200}
        height={56}
        className="h-11 w-auto object-contain sm:h-12"
        priority
      />
    </Link>
  );
}
