import { findOrCreateCustomer } from "./customer";
import { generateBookingNumber } from "./booking-number";
import {
  getBookingDuration,
  hasScheduleConflict,
  isBookableDay,
  parseDateOnly,
} from "./scheduling";
import prisma from "./prisma";

export interface CreateBookingInput {
  serviceId: string;
  guestName: string;
  guestPhone: string;
  carType: string;
  date: string;
  time: string;
  notes?: string | null;
  status?: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED";
}

export async function createBooking(
  data: CreateBookingInput,
  excludeId?: string
) {
  const service = await prisma.service.findFirst({
    where: { id: data.serviceId, isActive: true },
  });

  if (!service) {
    return { error: "الخدمة غير متوفرة", status: 404 as const };
  }

  if (!isBookableDay(data.date)) {
    return { error: "الحجز غير متاح يوم الجمعة", status: 400 as const };
  }

  const appointmentDate = parseDateOnly(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    return { error: "لا يمكن الحجز في تاريخ سابق", status: 400 as const };
  }

  const customerResult = await findOrCreateCustomer({
    name: data.guestName,
    phone: data.guestPhone,
    carType: data.carType,
  });

  if ("error" in customerResult) {
    return { error: customerResult.error, status: customerResult.status };
  }

  const { customer } = customerResult;
  const duration = getBookingDuration(service.duration);

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      date: appointmentDate,
      status: { not: "CANCELLED" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    include: { service: { select: { bookingCode: true } } },
  });

  const booked = existingAppointments.map((a) => ({
    time: a.time,
    bookingCode: a.service.bookingCode,
  }));

  if (hasScheduleConflict(data.time, service.bookingCode, booked)) {
    return {
      error: "هذا الوقت ممتلئ، يرجى اختيار موعد آخر",
      status: 409 as const,
    };
  }

  const bookingNumber = await generateBookingNumber(data.serviceId);

  const appointment = await prisma.appointment.create({
    data: {
      bookingNumber,
      customerId: customer.id,
      serviceId: data.serviceId,
      guestName: customer.name,
      guestPhone: customer.phone,
      carType: data.carType.trim(),
      date: appointmentDate,
      time: data.time,
      notes: data.notes || null,
      status: data.status || "PENDING",
    },
    include: {
      service: { select: { nameAr: true, duration: true, bookingCode: true } },
      customer: { select: { id: true, name: true, phone: true } },
    },
  });

  return { appointment, bookingNumber, duration, customer };
}
