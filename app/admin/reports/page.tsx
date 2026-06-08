"use client";

import { AdminLayout } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/Spinner";
import { APPOINTMENT_STATUS_LABELS, formatDate, formatTime } from "@/lib/utils";
import { Download, FileSpreadsheet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ReportData {
  month: number;
  year: number;
  appointments: Array<{
    id: string;
    date: string;
    time: string;
    status: string;
    guestName?: string | null;
    guestPhone?: string | null;
    user: { name: string; email: string; phone: string | null } | null;
    service: { nameAr: string; bookingCode: string };
  }>;
  statusBreakdown: Record<string, number>;
  serviceBreakdown: Record<string, number>;
  total: number;
}

function getClientName(apt: ReportData["appointments"][number]) {
  return apt.guestName || apt.user?.name || "عميل";
}

function getClientPhone(apt: ReportData["appointments"][number]) {
  return apt.guestPhone || apt.user?.phone || "";
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?month=${month}&year=${year}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setData(null);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    if (!data) return;

    const rows = data.appointments.map((a) => ({
      العميل: getClientName(a),
      البريد: a.user?.email || "",
      الهاتف: getClientPhone(a),
      الخدمة: a.service.nameAr,
      "رمز الحجز": a.service.bookingCode,
      التاريخ: formatDate(a.date),
      الوقت: formatTime(a.time),
      الحالة: APPOINTMENT_STATUS_LABELS[a.status],
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تقرير");
    XLSX.writeFile(wb, `al-rashad-report-${year}-${month}.xlsx`);
  };

  const exportPDF = async () => {
    if (!data) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = data.appointments
      .map(
        (a) => `
        <tr>
          <td>${getClientName(a)}</td>
          <td>${a.service.nameAr}</td>
          <td>${formatDate(a.date)}</td>
          <td>${formatTime(a.time)}</td>
          <td>${APPOINTMENT_STATUS_LABELS[a.status]}</td>
        </tr>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير الرشاد - ${month}/${year}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 24px; color: #1a1a2e; }
          h1 { color: #0F4C81; margin-bottom: 8px; }
          .summary { color: #666; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #0F4C81; color: white; padding: 10px; text-align: right; }
          td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f4f7fa; }
        </style>
      </head>
      <body>
        <h1>تقرير الرشاد للصيانة</h1>
        <p class="summary">
          الشهر: ${month}/${year} |
          الإجمالي: ${data.total} |
          مكتملة: ${data.statusBreakdown?.COMPLETED || 0}
        </p>
        <table>
          <thead>
            <tr>
              <th>العميل</th>
              <th>الخدمة</th>
              <th>التاريخ</th>
              <th>الوقت</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  if (loading) return <AdminLayout><PageLoader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">التقارير</h1>
        <div className="flex flex-wrap gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-xl border border-border px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>شهر {i + 1}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl border border-border px-3 py-2 text-sm"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={exportExcel}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF}>
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <p className="text-sm text-gray-500">إجمالي المواعيد</p>
          <p className="text-3xl font-bold text-primary">{data?.total || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">معتمدة</p>
          <p className="text-3xl font-bold text-secondary">{data?.statusBreakdown?.APPROVED || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">مكتملة</p>
          <p className="text-3xl font-bold text-green-600">{data?.statusBreakdown?.COMPLETED || 0}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardTitle className="mb-4">حسب الحالة</CardTitle>
          {data && Object.entries(data.statusBreakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
              <span>{APPOINTMENT_STATUS_LABELS[k]}</span>
              <span className="font-bold">{v}</span>
            </div>
          ))}
        </Card>
        <Card>
          <CardTitle className="mb-4">حسب الخدمة</CardTitle>
          {data && Object.entries(data.serviceBreakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
              <span>{k}</span>
              <span className="font-bold">{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </AdminLayout>
  );
}
