import {
  apiSuccess,
  handleApiError,
  rateLimitResponse,
} from "@/lib/api-utils";
import { sendContactNotificationEmail } from "@/lib/email";
import {
  buildMetaUserDataFromContact,
  createMetaEventId,
  sendMetaConversionEvents,
} from "@/lib/meta-conversions";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";
import { after } from "next/server";

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

    const contactEventId = createMetaEventId();
    const leadEventId = createMetaEventId();
    const metaUserData = buildMetaUserDataFromContact(data);

    after(() => {
      void sendMetaConversionEvents(request, [
        {
          eventName: "Contact",
          eventId: contactEventId,
          userData: metaUserData,
          customData: {
            content_name: data.subject,
          },
        },
        {
          eventName: "Lead",
          eventId: leadEventId,
          userData: metaUserData,
          customData: {
            content_name: data.subject,
          },
        },
      ]);
    });

    return apiSuccess({
      message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.",
      metaEvents: {
        contactEventId,
        leadEventId,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
