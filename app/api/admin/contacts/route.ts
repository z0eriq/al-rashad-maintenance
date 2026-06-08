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
  const { page, limit, skip } = parsePagination(searchParams);

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count(),
  ]);

  return apiSuccess(paginatedResponse(messages, total, page, limit));
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      await prisma.contactMessage.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return apiSuccess({ message: "تم تحديد الكل كمقروء" });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف الرسالة مطلوب" },
        { status: 400 }
      );
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    return apiSuccess({ message: "تم التحديث" });
  } catch (error) {
    return handleApiError(error);
  }
}
