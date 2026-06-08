import { z } from "zod";

export const ALLOWED_CAR_TYPES = ["كيا", "هيونداي", "شانجان"] as const;
export type AllowedCarType = (typeof ALLOWED_CAR_TYPES)[number];

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
  phone: z
    .string()
    .min(10, "رقم الهاتف غير صالح")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(10, "رقم الهاتف غير صالح").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, "يرجى اختيار الخدمة"),
  date: z.string().min(1, "يرجى اختيار التاريخ"),
  time: z.string().min(1, "يرجى اختيار الوقت"),
  notes: z.string().max(500, "الملاحظات طويلة جداً").optional().or(z.literal("")),
});

export const guestBookingSchema = z.object({
  guestName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  guestPhone: z
    .string()
    .min(10, "رقم الهاتف غير صالح")
    .max(15, "رقم الهاتف غير صالح"),
  carType: z.enum(ALLOWED_CAR_TYPES, {
    message: "يرجى اختيار كيا أو هيونداي أو شانجان",
  }),
  serviceId: z.string().min(1, "يرجى اختيار الخدمة"),
  date: z.string().min(1, "يرجى اختيار التاريخ"),
  time: z.string().min(1, "يرجى اختيار الوقت"),
  notes: z.string().max(500, "الملاحظات طويلة جداً").optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  subject: z.string().min(3, "الموضوع مطلوب"),
  message: z.string().min(10, "الرسالة قصيرة جداً"),
});

export const serviceSchema = z.object({
  bookingCode: z
    .string()
    .length(1, "رمز الحجز حرف واحد")
    .regex(/^[A-Z]$/, "رمز الحجز حرف إنجليزي كبير واحد"),
  name: z.string().min(2),
  nameAr: z.string().min(2, "اسم الخدمة بالعربية مطلوب"),
  description: z.string().min(10),
  descriptionAr: z.string().min(10, "الوصف بالعربية مطلوب"),
  icon: z.string().optional(),
  duration: z.number().min(15).max(480),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const adminCustomerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  carType: z.enum(ALLOWED_CAR_TYPES).optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "COMPLETED", "CANCELLED"]).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  guestName: z.string().min(2).optional(),
  guestPhone: z.string().min(10).optional(),
  carType: z.enum(ALLOWED_CAR_TYPES).optional(),
  serviceId: z.string().optional(),
  notes: z.string().max(500).optional(),
  adminNotes: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type GuestBookingInput = z.infer<typeof guestBookingSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
