"use client";

import { AdminLayout, StatCard } from "@/components/layout/AdminSidebar";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { formatDate, formatTime } from "@/lib/utils";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";

interface AdminDashboardViewProps {
  stats: {
    totalCustomers: number;
    totalAppointments: number;
    pendingRequests: number;
    completedRequests: number;
    todayAppointments: number;
    monthlyBookings: number;
  };
  recentAppointments: Array<{
    id: string;
    date: Date;
    time: string;
    status: string;
    guestName?: string | null;
    user: { name: string } | null;
    service: { nameAr: string };
  }>;
}

export function AdminDashboardView({
  stats,
  recentAppointments,
}: AdminDashboardViewProps) {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-primary mb-6">لوحة التحكم</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="إجمالي العملاء" value={stats.totalCustomers} icon={Users} color="bg-blue-100 text-blue-600" />
        <StatCard title="إجمالي المواعيد" value={stats.totalAppointments} icon={Calendar} color="bg-purple-100 text-purple-600" />
        <StatCard title="طلبات معلقة" value={stats.pendingRequests} icon={Clock} color="bg-amber-100 text-amber-600" />
        <StatCard title="مكتملة" value={stats.completedRequests} icon={CheckCircle} color="bg-green-100 text-green-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        <Card>
          <p className="text-sm text-gray-500">مواعيد اليوم</p>
          <p className="text-3xl font-bold text-primary">{stats.todayAppointments}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">حجوزات الشهر</p>
          <p className="text-3xl font-bold text-secondary">{stats.monthlyBookings}</p>
        </Card>
      </div>

      <CardTitle className="mb-4">آخر المواعيد</CardTitle>
      <div className="space-y-3">
        {recentAppointments.map((apt) => (
          <Card key={apt.id} className="!p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">
                {apt.guestName || apt.user?.name || "عميل"} - {apt.service.nameAr}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(apt.date)} {formatTime(apt.time)}
              </p>
            </div>
            <StatusBadge status={apt.status} />
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
