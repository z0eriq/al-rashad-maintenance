import { getAdminDashboardData } from "@/lib/admin-stats";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const data = await getAdminDashboardData();
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
