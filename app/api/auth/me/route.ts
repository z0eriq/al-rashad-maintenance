import { getCurrentUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-utils";
import prisma from "@/lib/prisma";

export async function GET() {
  const auth = await getCurrentUser();
  if (!auth) return apiError("غير مصرح", 401);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
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

  if (!user) return apiError("المستخدم غير موجود", 404);

  return apiSuccess({ user });
}
