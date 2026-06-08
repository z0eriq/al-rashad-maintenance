import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
  const auth = await requireAuth(["ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const appointments = await prisma.appointment.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
    },
    select: {
      id: true,
      date: true,
      time: true,
      status: true,
      guestName: true,
      guestPhone: true,
      user: { select: { name: true, email: true, phone: true } },
      service: { select: { nameAr: true, bookingCode: true } },
    },
    orderBy: { date: "asc" },
  });

  const statusBreakdown = {
    PENDING: appointments.filter((a) => a.status === "PENDING").length,
    APPROVED: appointments.filter((a) => a.status === "APPROVED").length,
    COMPLETED: appointments.filter((a) => a.status === "COMPLETED").length,
    CANCELLED: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  const serviceBreakdown = appointments.reduce(
    (acc, apt) => {
      const name = apt.service.nameAr;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return apiSuccess({
    month,
    year,
    appointments,
    statusBreakdown,
    serviceBreakdown,
    total: appointments.length,
  });
  } catch (error) {
    return handleApiError(error);
  }
}
