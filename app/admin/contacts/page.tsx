"use client";

import { AdminLayout } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import { Mail } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/contacts?page=${page}&limit=15`);
    const json = await res.json();
    if (json.success) {
      setMessages(json.data.items);
      setTotalPages(json.data.pagination.totalPages);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id: string) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMessages();
  };

  const markAllRead = async () => {
    const res = await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    const json = await res.json();
    if (json.success) {
      toast("تم تحديد الكل كمقروء", "success");
      fetchMessages();
    }
  };

  if (loading) return <AdminLayout><PageLoader /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">رسائل التواصل</h1>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          تحديد الكل كمقروء
        </Button>
      </div>

      {messages.length === 0 ? (
        <EmptyState title="لا توجد رسائل" description="ستظهر رسائل العملاء هنا" />
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`!p-4 ${!msg.isRead ? "border-r-4 border-r-secondary" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <p className="font-bold text-primary">{msg.subject}</p>
                    {!msg.isRead && (
                      <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">
                        جديد
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {msg.name} — {msg.email} — {msg.phone}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(msg.createdAt)}</p>
                </div>
                {!msg.isRead && (
                  <Button variant="outline" size="sm" onClick={() => markAsRead(msg.id)}>
                    مقروء
                  </Button>
                )}
              </div>
            </Card>
          ))}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </AdminLayout>
  );
}
