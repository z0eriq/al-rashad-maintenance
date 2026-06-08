import { apiError } from "@/lib/api-utils";

export async function POST() {
  return apiError("التسجيل غير متاح. يمكنك حجز موعد مباشرة من صفحة الحجز.", 403);
}
