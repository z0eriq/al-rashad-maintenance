import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import prisma from "@/lib/prisma";
import { serviceSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const auth = await requireAuth(["ADMIN"]);
      if (auth instanceof NextResponse) return auth;
    }

    const services = await prisma.service.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return apiSuccess({ services });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const data = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        ...data,
        slug: slugify(data.nameAr),
      },
    });

    return apiSuccess({ service }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
