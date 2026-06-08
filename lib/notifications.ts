import { sendAppointmentStatusEmail } from "./email";
import prisma from "./prisma";
import { formatDate, formatTime } from "./utils";

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
}

export async function createNotification(
  params: CreateNotificationParams
): Promise<void> {
  await prisma.notification.create({ data: params });
}

const STATUS_MESSAGES: Record<string, { title: string; message: string }> = {
  PENDING: {
    title: "تم استلام طلبك",
    message: "تم استلام طلب حجز الصيانة وسيتم مراجعته قريباً.",
  },
  APPROVED: {
    title: "تمت الموافقة على حجزك",
    message: "تمت الموافقة على موعد الصيانة. سيتواصل معك فريقنا قريباً.",
  },
  COMPLETED: {
    title: "اكتملت الخدمة",
    message: "تم إكمال خدمة الصيانة بنجاح. شكراً لثقتكم بنا.",
  },
  CANCELLED: {
    title: "تم إلغاء الحجز",
    message: "تم إلغاء موعد الصيانة. يمكنك حجز موعد جديد في أي وقت.",
  },
};

export async function notifyAppointmentStatusChange(
  userId: string,
  appointmentId: string,
  status: string
): Promise<void> {
  const content = STATUS_MESSAGES[status];
  if (!content) return;

  await createNotification({
    userId,
    title: content.title,
    message: content.message,
    type: "APPOINTMENT_STATUS",
    relatedId: appointmentId,
  });

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      user: { select: { email: true, name: true } },
      service: { select: { nameAr: true } },
    },
  });

  if (appointment?.user?.email) {
    await sendAppointmentStatusEmail(
      appointment.user.email,
      appointment.user.name,
      status,
      appointment.service.nameAr,
      formatDate(appointment.date),
      formatTime(appointment.time)
    );
  }
}

export async function getUserNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}
