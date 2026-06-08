import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-gray-600">الصفحة غير موجودة</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90"
        >
          العودة للرئيسية
        </Link>
        <Link
          href="/admin/login"
          className="rounded-xl border border-border bg-white px-6 py-3 text-sm font-medium text-primary hover:bg-gray-50"
        >
          دخول الإدارة
        </Link>
      </div>
    </div>
  );
}
