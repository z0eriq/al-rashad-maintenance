"use client";

import { AdminLayout } from "@/components/layout/AdminSidebar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Pagination } from "@/components/ui/Pagination";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDuration } from "@/lib/scheduling";
import { ALLOWED_CAR_TYPES } from "@/lib/validation";
import { APPOINTMENT_STATUS_LABELS, formatDate, formatTime } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Service {
  id: string;
  nameAr: string;
  duration: number;
  bookingCode: string;
}

interface Appointment {
  id: string;
  bookingNumber: string;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  adminNotes: string | null;
  guestName: string | null;
  guestPhone: string | null;
  carType: string | null;
  user: { name: string; phone: string | null; email: string } | null;
  service: { id: string; nameAr: string; duration: number; bookingCode?: string };
}

const CAR_TYPES = ALLOWED_CAR_TYPES.map((type) => ({ value: type, label: type }));

const emptyManualForm = {
  guestName: "",
  guestPhone: "",
  carType: "كيا",
  serviceId: "",
  date: "",
  time: "",
  notes: "",
  status: "APPROVED",
};

export default function AdminAppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showManual, setShowManual] = useState(false);
  const [manualForm, setManualForm] = useState(emptyManualForm);
  const [manualSlots, setManualSlots] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    date: "",
    time: "",
    guestName: "",
    guestPhone: "",
    carType: "",
    serviceId: "",
    notes: "",
    adminNotes: "",
  });
  const [editSlots, setEditSlots] = useState<string[]>([]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (filter) params.set("status", filter);
    const res = await fetch(`/api/appointments?${params}`);
    const json = await res.json();
    if (json.success) {
      setAppointments(json.data.items);
      setTotalPages(json.data.pagination.totalPages);
    }
    setLoading(false);
  }, [filter, page]);

  useEffect(() => {
    fetchAppointments();
    fetch("/api/services?all=true")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setServices(json.data.services);
      });
  }, [fetchAppointments]);

  const fetchSlots = async (
    date: string,
    serviceId: string,
    excludeId?: string
  ) => {
    if (!date || !serviceId) return [];
    const params = new URLSearchParams({ date, serviceId });
    if (excludeId) params.set("excludeId", excludeId);
    const res = await fetch(`/api/availability?${params}`);
    const json = await res.json();
    return json.success ? json.data.slots : [];
  };

  const handleManualDateOrServiceChange = async (
    date: string,
    serviceId: string
  ) => {
    const slots = await fetchSlots(date, serviceId);
    setManualSlots(slots);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(manualForm),
    });
    const json = await res.json();
    if (json.success) {
      toast(`تم إنشاء الحجز ${json.data.bookingNumber}`, "success");
      setShowManual(false);
      setManualForm(emptyManualForm);
      setManualSlots([]);
      fetchAppointments();
    } else {
      toast(json.error || "فشل إنشاء الحجز", "error");
    }
  };

  const startEdit = async (apt: Appointment) => {
    setEditId(apt.id);
    setEditForm({
      status: apt.status,
      date: apt.date.split("T")[0],
      time: apt.time,
      guestName: apt.guestName || apt.user?.name || "",
      guestPhone: apt.guestPhone || apt.user?.phone || "",
      carType: apt.carType || "",
      serviceId: "",
      notes: apt.notes || "",
      adminNotes: apt.adminNotes || "",
    });
    const serviceId = apt.service.id || services.find((s) => s.nameAr === apt.service.nameAr)?.id;
    if (serviceId) {
      setEditForm((f) => ({ ...f, serviceId }));
      const slots = await fetchSlots(apt.date.split("T")[0], serviceId, apt.id);
      setEditSlots(slots);
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const res = await fetch(`/api/appointments/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const json = await res.json();
    if (json.success) {
      toast("تم التحديث", "success");
      setEditId(null);
      fetchAppointments();
    } else {
      toast(json.error || "فشل التحديث", "error");
    }
  };

  const handleDelete = async (id: string, bookingNumber: string) => {
    if (!confirm(`هل تريد حذف الحجز ${bookingNumber}؟`)) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast("تم حذف الحجز", "success");
      fetchAppointments();
    } else {
      toast(json.error || "فشل الحذف", "error");
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">إدارة الحجوزات</h1>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setShowManual(!showManual)}>
            <Plus className="h-4 w-4" />
            حجز يدوي
          </Button>
          <Select
            options={[
              { value: "", label: "جميع الحالات" },
              ...Object.entries(APPOINTMENT_STATUS_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              })),
            ]}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="w-48"
          />
        </div>
      </div>

      {showManual && (
        <Card className="mb-6">
          <h3 className="font-bold text-primary mb-4">إنشاء حجز يدوي</h3>
          <form onSubmit={handleManualSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              label="الاسم"
              value={manualForm.guestName}
              onChange={(e) =>
                setManualForm({ ...manualForm, guestName: e.target.value })
              }
              required
            />
            <Input
              label="الهاتف"
              dir="ltr"
              value={manualForm.guestPhone}
              onChange={(e) =>
                setManualForm({ ...manualForm, guestPhone: e.target.value })
              }
              required
            />
            <Select
              label="نوع السيارة"
              options={CAR_TYPES}
              value={manualForm.carType}
              onChange={(e) =>
                setManualForm({ ...manualForm, carType: e.target.value })
              }
            />
            <Select
              label="الخدمة"
              options={[
                { value: "", label: "-- اختر --" },
                ...services
                  .filter((s) => s.id)
                  .map((s) => ({
                    value: s.id,
                    label: `${s.bookingCode} - ${s.nameAr}`,
                  })),
              ]}
              value={manualForm.serviceId}
              onChange={(e) => {
                const serviceId = e.target.value;
                setManualForm({ ...manualForm, serviceId, time: "" });
                if (manualForm.date) {
                  handleManualDateOrServiceChange(manualForm.date, serviceId);
                }
              }}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium">التاريخ</label>
              <input
                type="date"
                value={manualForm.date}
                onChange={(e) => {
                  const date = e.target.value;
                  setManualForm({ ...manualForm, date, time: "" });
                  if (manualForm.serviceId) {
                    handleManualDateOrServiceChange(date, manualForm.serviceId);
                  }
                }}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm"
                required
              />
            </div>
            <Select
              label="الوقت"
              options={[
                { value: "", label: "-- اختر --" },
                ...manualSlots.map((s) => ({ value: s, label: formatTime(s) })),
              ]}
              value={manualForm.time}
              onChange={(e) =>
                setManualForm({ ...manualForm, time: e.target.value })
              }
            />
            <Select
              label="الحالة"
              options={Object.entries(APPOINTMENT_STATUS_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              value={manualForm.status}
              onChange={(e) =>
                setManualForm({ ...manualForm, status: e.target.value })
              }
            />
            <Textarea
              label="ملاحظات"
              value={manualForm.notes}
              onChange={(e) =>
                setManualForm({ ...manualForm, notes: e.target.value })
              }
              rows={2}
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit">إنشاء الحجز</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowManual(false)}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      )}

      {editId && (
        <Card className="mb-6">
          <h3 className="font-bold text-primary mb-4">تعديل الحجز</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="الاسم"
              value={editForm.guestName}
              onChange={(e) =>
                setEditForm({ ...editForm, guestName: e.target.value })
              }
            />
            <Input
              label="الهاتف"
              dir="ltr"
              value={editForm.guestPhone}
              onChange={(e) =>
                setEditForm({ ...editForm, guestPhone: e.target.value })
              }
            />
            <Input
              label="نوع السيارة"
              value={editForm.carType}
              onChange={(e) =>
                setEditForm({ ...editForm, carType: e.target.value })
              }
            />
            <Select
              label="الحالة"
              options={Object.entries(APPOINTMENT_STATUS_LABELS).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium">التاريخ</label>
              <input
                type="date"
                value={editForm.date}
                onChange={async (e) => {
                  const date = e.target.value;
                  setEditForm({ ...editForm, date, time: "" });
                  if (editForm.serviceId) {
                    const slots = await fetchSlots(
                      date,
                      editForm.serviceId,
                      editId
                    );
                    setEditSlots(slots);
                  }
                }}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm"
              />
            </div>
            <Select
              label="الوقت"
              options={editSlots.map((s) => ({ value: s, label: formatTime(s) }))}
              value={editForm.time}
              onChange={(e) =>
                setEditForm({ ...editForm, time: e.target.value })
              }
            />
            <Textarea
              label="ملاحظات العميل"
              value={editForm.notes}
              onChange={(e) =>
                setEditForm({ ...editForm, notes: e.target.value })
              }
              rows={2}
            />
            <Textarea
              label="ملاحظات الإدارة"
              value={editForm.adminNotes}
              onChange={(e) =>
                setEditForm({ ...editForm, adminNotes: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleUpdate}>حفظ</Button>
            <Button variant="outline" onClick={() => setEditId(null)}>
              إلغاء
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {appointments.map((apt) => (
          <Card key={apt.id} className="!p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-bold text-primary">{apt.service.nameAr}</p>
                  <span
                    className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-mono font-bold text-primary"
                    dir="ltr"
                  >
                    {apt.bookingNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {apt.guestName || apt.user?.name} —{" "}
                  <span dir="ltr">{apt.guestPhone || apt.user?.phone}</span>
                </p>
                {apt.carType && (
                  <p className="text-sm text-gray-500">السيارة: {apt.carType}</p>
                )}
                <p className="text-sm text-gray-500">
                  {formatDate(apt.date)} - {formatTime(apt.time)} (
                  {formatDuration(Math.min(apt.service.duration, 120))})
                </p>
                {apt.notes && (
                  <p className="text-xs text-gray-400 mt-1">ملاحظات: {apt.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={apt.status} />
                <Button size="sm" variant="outline" onClick={() => startEdit(apt)}>
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(apt.id, apt.bookingNumber)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </AdminLayout>
  );
}
