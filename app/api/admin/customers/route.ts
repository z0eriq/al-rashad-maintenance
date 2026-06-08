import {
  apiError,
  apiSuccess,
  handleApiError,
  paginatedResponse,
  parsePagination,
} from "@/lib/api-utils";
import { normalizePhone } from "@/lib/customer";
import prisma from "@/lib/prisma";
import { adminCustomerSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const { page, limit, skip } = parsePagination(searchParams);

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
            { carType: { contains: search } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          name: true,
          phone: true,
          carType: true,
          createdAt: true,
          _count: { select: { appointments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return apiSuccess(paginatedResponse(customers, total, page, limit));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const data = adminCustomerSchema.parse(body);
    const phone = normalizePhone(data.phone);

    const existing = await prisma.customer.findUnique({ where: { phone } });
    if (existing) {
      return apiError("رقم الهاتف مسجل مسبقاً لعميل آخر", 409);
    }

    const customer = await prisma.customer.create({
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
        createdAt: true,
      },
    });

    return apiSuccess({ customer }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
