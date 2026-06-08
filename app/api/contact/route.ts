import {
  apiSuccess,
  handleApiError,
  rateLimitResponse,
} from "@/lib/api-utils";
import { sendContactNotificationEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const rateCheck = checkRateLimit(request, "contact", 5, 60_000);
    if (!rateCheck.success) return rateLimitResponse();

    const body = await request.json();
    const data = contactSchema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });

    await sendContactNotificationEmail(data);

    return apiSuccess({
      message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
