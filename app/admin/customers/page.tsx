"use client";

import { AdminLayout } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { ALLOWED_CAR_TYPES } from "@/lib/validation";
import { formatDate } from "@/lib/utils";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  carType: string | null;
  createdAt: string;
  _count: { appointments: number };
}

const emptyForm = { name: "", phone: "", carType: "" };

export default function AdminCustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/customers?search=${encodeURIComponent(search)}&page=${page}&limit=15`
      );
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data.items);
        setTotalPages(json.data.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/admin/customers/${editId}` : "/api/admin/customers";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        carType: form.carType || undefined,
      }),
    });
    const json = await res.json();
    if (json.success) {
      toast(editId ? "تم التحديث" : "تم الإضافة", "success");
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      fetchCustomers();
    } else {
      toast(json.error || "فشل العملية", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast("تم الحذف", "success");
      fetchCustomers();
    } else {
      toast(json.error || "فشل الحذف", "error");
    }
  };

  const startEdit = (c: Customer) => {
    setEditId(c.id);
    setForm({ name: c.name, phone: c.phone, carType: c.carType || "" });
    setShowForm(true);
  };

  if (loading && customers.length === 0) return <AdminLayout><PageLoader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">إدارة العملاء</h1>
          <p className="text-sm text-gray-500 mt-1">كل عميل يُسجّل مرة واحدة برقم هاتف فريد</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(emptyForm);
          }}
        >
          <Plus className="h-4 w-4" /> إضافة عميل
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="بحث بالاسم أو الهاتف أو نوع السيارة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border py-2.5 pr-10 pl-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-bold text-primary mb-4">{editId ? "تعديل عميل" : "إضافة عميل"}</h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              label="الاسم"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="الهاتف"
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Select
              label="نوع السيارة"
              id="carType"
              options={[
                { value: "", label: "-- اختياري --" },
                ...ALLOWED_CAR_TYPES.map((t) => ({ value: t, label: t })),
              ]}
              value={form.carType}
              onChange={(e) => setForm({ ...form, carType: e.target.value })}
            />
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit">{editId ? "تحديث" : "إضافة"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-right font-semibold">الاسم</th>
              <th className="px-4 py-3 text-right font-semibold">الهاتف</th>
              <th className="px-4 py-3 text-right font-semibold">نوع السيارة</th>
              <th className="px-4 py-3 text-right font-semibold">الحجوزات</th>
              <th className="px-4 py-3 text-right font-semibold">تاريخ التسجيل</th>
              <th className="px-4 py-3 text-right font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3" dir="ltr">{c.phone}</td>
                <td className="px-4 py-3">{c.carType || "-"}</td>
                <td className="px-4 py-3">{c._count.appointments}</td>
                <td className="px-4 py-3">{formatDate(c.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(c)}
                      className="rounded-lg p-1.5 text-primary hover:bg-primary/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </AdminLayout>
  );
}
