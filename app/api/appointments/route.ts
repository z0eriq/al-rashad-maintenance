import { requireAuth } from "@/lib/auth";
import {
  apiSuccess,
  handleApiError,
  paginatedResponse,
  parsePagination,
} from "@/lib/api-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireAuth(["ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const { page, limit, skip } = parsePagination(searchParams);

  const where = status
    ? { status: status as "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED" }
    : {};

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            nameAr: true,
            name: true,
            duration: true,
            icon: true,
            bookingCode: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { time: "desc" }],
      skip,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  return apiSuccess(paginatedResponse(appointments, total, page, limit));
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: "استخدم /api/bookings للحجز العام" },
    { status: 405 }
  );
}
