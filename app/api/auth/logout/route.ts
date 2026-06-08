import { apiSuccess } from "@/lib/api-utils";
import { clearAuthCookieOnResponse } from "@/lib/jwt";

export async function POST() {
  const response = apiSuccess({ message: "تم تسجيل الخروج بنجاح" });
  clearAuthCookieOnResponse(response);
  return response;
}
