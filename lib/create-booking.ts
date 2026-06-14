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

  const appointmentData = {
    customerId: customer.id,
    serviceId: data.serviceId,
    guestName: customer.name,
    guestPhone: customer.phone,
    carType: data.carType.trim(),
    date: appointmentDate,
    time: data.time,
    notes: data.notes || null,
    status: data.status || "PENDING",
  };

  const include = {
    service: { select: { nameAr: true, duration: true, bookingCode: true } },
    customer: { select: { id: true, name: true, phone: true } },
  } as const;

  const maxAttempts = 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const bookingNumber = await generateBookingNumber(data.serviceId);

    try {
      const appointment = await prisma.appointment.create({
        data: {
          bookingNumber,
          ...appointmentData,
        },
        include,
      });

      return { appointment, bookingNumber, duration, customer };
    } catch (error) {
      const isDuplicateBookingNumber =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002";

      if (!isDuplicateBookingNumber || attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  return { error: "تعذر إنشاء رقم حجز فريد. حاول مرة أخرى.", status: 409 as const };
}
