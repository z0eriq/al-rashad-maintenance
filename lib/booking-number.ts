import prisma from "./prisma";

export async function generateBookingNumber(serviceId: string): Promise<string> {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { bookingCode: true },
  });

  const code = service?.bookingCode || "X";
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = now.getFullYear().toString().slice(-2);
  const prefix = `${code}${mm}${yy}`;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const count = await prisma.appointment.count({
    where: {
      serviceId,
      createdAt: { gte: monthStart, lte: monthEnd },
      bookingNumber: { startsWith: prefix },
    },
  });

  return `${prefix}-${count}`;
}
