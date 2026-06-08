import prisma from "./prisma";

export async function getAdminDashboardData() {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [
    totalCustomers,
    totalAppointments,
    pendingRequests,
    completedRequests,
    todayAppointments,
    monthlyBookings,
    recentAppointments,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({
      where: {
        date: new Date(new Date().toISOString().split("T")[0]),
        status: { not: "CANCELLED" },
      },
    }),
    prisma.appointment.count({
      where: { createdAt: { gte: monthStart } },
    }),
    prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        service: { select: { nameAr: true } },
      },
    }),
  ]);

  return {
    stats: {
      totalCustomers,
      totalAppointments,
      pendingRequests,
      completedRequests,
      todayAppointments,
      monthlyBookings,
    },
    recentAppointments,
  };
}
