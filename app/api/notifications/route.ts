import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import {
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const notifications = await getUserNotifications(auth.user.userId);
  return apiSuccess({ notifications });
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      await markAllNotificationsRead(auth.user.userId);
      return apiSuccess({ message: "تم تحديد جميع الإشعارات كمقروءة" });
    }

    if (id) {
      await markNotificationRead(id, auth.user.userId);
      return apiSuccess({ message: "تم تحديد الإشعار كمقروء" });
    }

    return NextResponse.json(
      { success: false, error: "معرف الإشعار مطلوب" },
      { status: 400 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
