import {
  apiSuccess,
  handleApiError,
  rateLimitResponse,
} from "@/lib/api-utils";
import { createBooking } from "@/lib/create-booking";
import { sendEmail } from "@/lib/email";
import {
  buildMetaUserDataFromBooking,
  createMetaEventId,
  sendMetaConversionEvents,
} from "@/lib/meta-conversions";
import { checkRateLimit } from "@/lib/rate-limit";
import { formatDuration } from "@/lib/scheduling";
import { guestBookingSchema } from "@/lib/validation";
import { formatDate, formatTime } from "@/lib/utils";
import { after } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rateCheck = checkRateLimit(request, "guest-booking", 5, 60_000);
    if (!rateCheck.success) return rateLimitResponse();

    const body = await request.json();
    const data = guestBookingSchema.parse(body);

    const result = await createBooking(data);
    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    const { appointment, bookingNumber, duration } = result;
    const scheduleEventId = createMetaEventId();
    const leadEventId = createMetaEventId();
    const metaUserData = buildMetaUserDataFromBooking({
      guestName: data.guestName,
      guestPhone: data.guestPhone,
    });

    after(() => {
      void sendMetaConversionEvents(request, [
        {
          eventName: "Schedule",
          eventId: scheduleEventId,
          userData: metaUserData,
          customData: {
            content_name: appointment.service.nameAr,
            content_category: "car_maintenance",
            booking_number: bookingNumber,
          },
        },
        {
          eventName: "Lead",
          eventId: leadEventId,
          userData: metaUserData,
          customData: {
            content_name: appointment.service.nameAr,
            content_category: "car_maintenance",
            booking_number: bookingNumber,
          },
        },
      ]);
    });

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_EMAIL ||
      "info@alrashad.com.iq";

    await sendEmail({
      to: adminEmail,
      subject: `حجز جديد ${bookingNumber}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2 style="color: #0F4C81;">حجز جديد</h2>
          <p><strong>رقم الحجز:</strong> ${bookingNumber}</p>
          <p><strong>الاسم:</strong> ${data.guestName}</p>
          <p><strong>الهاتف:</strong> ${data.guestPhone}</p>
          <p><strong>نوع السيارة:</strong> ${data.carType}</p>
          <p><strong>الخدمة:</strong> ${appointment.service.nameAr}</p>
          <p><strong>التاريخ:</strong> ${formatDate(appointment.date)}</p>
          <p><strong>الوقت:</strong> ${formatTime(data.time)} (${formatDuration(duration)})</p>
        </div>
      `,
    });

    return apiSuccess(
      {
        bookingNumber,
        message: "تم إرسال الحجز بنجاح",
        metaEvents: {
          scheduleEventId,
          leadEventId,
        },
        appointment: {
          bookingNumber,
          guestName: appointment.guestName,
          guestPhone: appointment.guestPhone,
          carType: appointment.carType,
          date: appointment.date,
          time: appointment.time,
          duration,
          service: appointment.service,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
