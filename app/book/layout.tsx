import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حجز موعد صيانة",
  description: "احجز موعد صيانة سيارتك بسهولة — بدون تسجيل حساب",
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
