import { requireAuth } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-utils";
import { notifyAppointmentStatusChange } from "@/lib/notifications";
import prisma from "@/lib/prisma";
import {
  hasScheduleConflict,
  isBookableDay,
  parseDateOnly,
} from "@/lib/scheduling";
import { updateAppointmentSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      service: true,
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!appointment) return apiError("الموعد غير موجود", 404);

  return apiSuccess({ appointment });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const body = await request.json();
    const data = updateAppointmentSchema.parse(body);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: { select: { duration: true } } },
    });
    if (!appointment) return apiError("الموعد غير موجود", 404);

    const newDate = data.date || appointment.date.toISOString().split("T")[0];
    const newTime = data.time || appointment.time;
    const newServiceId = data.serviceId || appointment.serviceId;

    if (!isBookableDay(newDate)) {
      return apiError("الحجز غير متاح يوم الجمعة", 400);
    }

    const service = await prisma.service.findUnique({
      where: { id: newServiceId },
      select: { duration: true, bookingCode: true, isActive: true },
    });
    if (!service) return apiError("الخدمة غير موجودة", 404);

    const appointmentDate = parseDateOnly(newDate);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        date: appointmentDate,
        status: { not: "CANCELLED" },
        id: { not: id },
      },
      include: { service: { select: { bookingCode: true } } },
    });

    const booked = existingAppointments.map((a) => ({
      time: a.time,
      bookingCode: a.service.bookingCode,
    }));

    if (hasScheduleConflict(newTime, service.bookingCode, booked)) {
      return apiError("هذا الوقت ممتلئ", 409);
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.date && { date: appointmentDate }),
        ...(data.time && { time: data.time }),
        ...(data.serviceId && { serviceId: data.serviceId }),
        ...(data.guestName && { guestName: data.guestName }),
        ...(data.guestPhone && { guestPhone: data.guestPhone }),
        ...(data.carType && { carType: data.carType }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.adminNotes !== undefined && { adminNotes: data.adminNotes }),
      },
      include: {
        service: { select: { nameAr: true, duration: true, bookingCode: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (
      data.status &&
      data.status !== appointment.status &&
      appointment.userId
    ) {
      await notifyAppointmentStatusChange(
        appointment.userId,
        id,
        data.status
      );
    }

    return apiSuccess({ appointment: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;

  await prisma.appointment.delete({ where: { id } });

  return apiSuccess({ message: "تم حذف الحجز" });
}
