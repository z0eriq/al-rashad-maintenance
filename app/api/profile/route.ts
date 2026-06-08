import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import prisma from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  return apiSuccess({ user });
}

export async function PUT(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: auth.user.userId },
      data: {
        name: data.name,
        phone: data.phone || null,
        address: data.address || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
      },
    });

    return apiSuccess({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
