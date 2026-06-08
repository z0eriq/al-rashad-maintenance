import type { AppointmentStatus, Role } from "@prisma/client";

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  role: Role;
  createdAt: Date;
}

export interface AppointmentWithRelations {
  id: string;
  date: Date;
  time: string;
  notes: string | null;
  adminNotes: string | null;
  status: AppointmentStatus;
  createdAt: Date;
  user: SafeUser;
  service: {
    id: string;
    nameAr: string;
    name: string;
    duration: number;
    icon: string;
  };
}

export interface DashboardStats {
  totalCustomers: number;
  totalAppointments: number;
  pendingRequests: number;
  completedRequests: number;
  todayAppointments: number;
  monthlyBookings: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
