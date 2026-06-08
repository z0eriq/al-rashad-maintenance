import { apiError, apiSuccess, handleApiError } from "@/lib/api-utils";
import prisma from "@/lib/prisma";
import {
  generateTimeSlots,
  getAvailableStartSlots,
  getBookingDuration,
  isBookableDay,
  parseDateOnly,
} from "@/lib/scheduling";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceId = searchParams.get("serviceId");
    const excludeId = searchParams.get("excludeId") || undefined;

    const allSlots = generateTimeSlots();

    if (!date) {
      return apiSuccess({ slots: allSlots, allSlots });
    }

    if (!isBookableDay(date)) {
      return apiSuccess({
        slots: [],
        allSlots,
        message: "الحجز غير متاح يوم الجمعة",
      });
    }

    let bookingCode = "D";
    let duration = 60;

    if (serviceId) {
      const service = await prisma.service.findFirst({
        where: { id: serviceId, isActive: true },
        select: { duration: true, bookingCode: true },
      });
      if (!service) return apiError("الخدمة غير متوفرة", 404);
      bookingCode = service.bookingCode;
      duration = getBookingDuration(service.duration);
    }

    const appointmentDate = parseDateOnly(date);
    const booked = await prisma.appointment.findMany({
      where: {
        date: appointmentDate,
        status: { not: "CANCELLED" },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: { service: { select: { bookingCode: true } } },
    });

    const bookedSlots = booked.map((a) => ({
      time: a.time,
      bookingCode: a.service.bookingCode,
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = appointmentDate.getTime() === today.getTime();

    const availableSlots = getAvailableStartSlots(bookingCode, bookedSlots, {
      isToday,
      now: new Date(),
    });

    return apiSuccess({ slots: availableSlots, allSlots, duration });
  } catch (error) {
    return handleApiError(error);
  }
}
