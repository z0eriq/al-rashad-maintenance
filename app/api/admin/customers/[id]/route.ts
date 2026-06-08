import { requireAuth } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-utils";
import { normalizePhone } from "@/lib/customer";
import prisma from "@/lib/prisma";
import { adminCustomerSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        carType: true,
        createdAt: true,
        appointments: {
          include: { service: { select: { nameAr: true } } },
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    if (!customer) return apiError("العميل غير موجود", 404);

    return apiSuccess({ customer });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const body = await request.json();
    const data = adminCustomerSchema.parse(body);
    const phone = normalizePhone(data.phone);

    const phoneTaken = await prisma.customer.findFirst({
      where: { phone, NOT: { id } },
    });
    if (phoneTaken) {
      return apiError("رقم الهاتف مسجل مسبقاً لعميل آخر", 409);
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name.trim(),
        phone,
        carType: data.carType || null,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        carType: true,
      },
    });

    return apiSuccess({ customer });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return apiError("العميل غير موجود", 404);

    const appointmentCount = await prisma.appointment.count({
      where: { customerId: id },
    });
    if (appointmentCount > 0) {
      return apiError("لا يمكن حذف عميل لديه حجوزات مسجلة", 400);
    }

    await prisma.customer.delete({ where: { id } });

    return apiSuccess({ message: "تم حذف العميل" });
  } catch (error) {
    return handleApiError(error);
  }
}
