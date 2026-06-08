import { comparePassword } from "@/lib/auth";
import {
  apiError,
  apiSuccess,
  handleApiError,
  rateLimitResponse,
} from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { signToken, setAuthCookie } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const rateCheck = checkRateLimit(request, "login", 10, 60_000);
    if (!rateCheck.success) return rateLimitResponse();

    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      return apiError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401);
    }

    const valid = await comparePassword(data.password, user.password);
    if (!valid) {
      return apiError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401);
    }

    if (user.role !== "ADMIN") {
      return apiError("تسجيل الدخول متاح للموظفين فقط", 403);
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      redirectTo: "/admin",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
