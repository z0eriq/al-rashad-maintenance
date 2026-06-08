import { requireAuth } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-utils";
import prisma from "@/lib/prisma";
import { serviceSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const service = await prisma.service.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!service) return apiError("الخدمة غير موجودة", 404);

    return apiSuccess({ service });
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
    const data = serviceSchema.parse(body);

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return apiError("الخدمة غير موجودة", 404);

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        slug: slugify(data.nameAr),
      },
    });

    return apiSuccess({ service });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return apiError("الخدمة غير موجودة", 404);

    const appointmentCount = await prisma.appointment.count({
      where: { serviceId: id },
    });

    if (appointmentCount > 0) {
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });
      return apiSuccess({ message: "تم تعطيل الخدمة (لديها مواعيد مرتبطة)" });
    }

    await prisma.service.delete({ where: { id } });
    return apiSuccess({ message: "تم حذف الخدمة" });
  } catch (error) {
    return handleApiError(error);
  }
}
