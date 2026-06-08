import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { getAdminDashboardData } from "@/lib/admin-stats";
import { safeQuery } from "@/lib/safe-query";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60;

export default async function AdminDashboardPage() {
  const auth = await getCurrentUser();
  if (!auth || auth.role !== "ADMIN") redirect("/admin/login");

  const data = await safeQuery(
    () => getAdminDashboardData(),
    {
      stats: {
        totalCustomers: 0,
        totalAppointments: 0,
        pendingRequests: 0,
        completedRequests: 0,
        todayAppointments: 0,
        monthlyBookings: 0,
      },
      recentAppointments: [],
    }
  );

  return <AdminDashboardView {...data} />;
}
