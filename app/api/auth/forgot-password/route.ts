import { generateResetToken } from "@/lib/auth";
import {
  apiSuccess,
  handleApiError,
  rateLimitResponse,
} from "@/lib/api-utils";
import { sendPasswordResetEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const rateCheck = checkRateLimit(request, "forgot-password", 3, 60_000);
    if (!rateCheck.success) return rateLimitResponse();

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user?.role === "ADMIN") {
      const token = generateResetToken();
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetTokenExpiry: expiry },
      });

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    return apiSuccess({
      message:
        "إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط إعادة تعيين كلمة المرور.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
