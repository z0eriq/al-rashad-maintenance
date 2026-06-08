"use client";

import { AdminLayout } from "@/components/layout/AdminSidebar";
import { ServiceIcon } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDuration } from "@/lib/scheduling";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Service {
  id: string;
  bookingCode: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  duration: number;
  isActive: boolean;
}

const emptyForm = {
  bookingCode: "",
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  icon: "wrench",
  duration: 60,
  isActive: true,
};

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services?all=true");
      const json = await res.json();
      if (json.success) {
        setServices(json.data.services);
      } else {
        toast(json.error || "فشل تحميل الخدمات", "error");
      }
    } catch {
      toast("فشل تحميل الخدمات. أعد تشغيل الخادم ثم حدّث الصفحة.", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/services/${editId}` : "/api/services";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        bookingCode: form.bookingCode.toUpperCase(),
        duration: Number(form.duration),
      }),
    });
    const json = await res.json();
    if (json.success) {
      toast(editId ? "تم التحديث" : "تم الإضافة", "success");
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      fetchServices();
    } else {
      toast(json.error || "فشل العملية", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    const json = await res.json();
    toast(json.data?.message || json.message || "تم", json.success ? "success" : "error");
    fetchServices();
  };

  if (loading) return <AdminLayout><PageLoader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">إدارة الخدمات</h1>
        <Button size="sm" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>
          <Plus className="h-4 w-4" /> إضافة خدمة
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-bold text-primary mb-4">{editId ? "تعديل خدمة" : "إضافة خدمة"}</h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              label="رمز الحجز (حرف واحد)"
              value={form.bookingCode}
              onChange={(e) => setForm({ ...form, bookingCode: e.target.value.toUpperCase().slice(0, 1) })}
              placeholder="مثل: D"
              maxLength={1}
              dir="ltr"
              required
            />
            <Input label="الاسم (EN)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="الاسم (AR)" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
            <Textarea label="الوصف (EN)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            <Textarea label="الوصف (AR)" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={2} required />
            <Input label="المدة (دقيقة)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} required />
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit">{editId ? "تحديث" : "إضافة"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id}>
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ServiceIcon icon={s.icon} className="h-6 w-6" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditId(s.id);
                    setForm({
                      bookingCode: s.bookingCode,
                      name: s.name,
                      nameAr: s.nameAr,
                      description: s.description,
                      descriptionAr: s.descriptionAr,
                      icon: s.icon,
                      duration: s.duration,
                      isActive: s.isActive,
                    });
                    setShowForm(true);
                  }}
                  className="rounded-lg p-1.5 text-primary hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-mono font-bold text-primary" dir="ltr">
                {s.bookingCode}
              </span>
              <h3 className="font-bold text-primary">{s.nameAr}</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">{formatDuration(s.duration)}</p>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
