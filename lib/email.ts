import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const from =
    process.env.SMTP_FROM ||
    process.env.NEXT_PUBLIC_EMAIL ||
    "noreply@alrashad.com";

  if (!isEmailConfigured()) {
    console.log("[Email - Dev Mode]", {
      to: options.to,
      subject: options.subject,
      text: options.text || options.html,
    });
    return false;
  }

  try {
    await getTransporter().sendMail({
      from: `"الرشاد للصيانة" <${from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "إعادة تعيين كلمة المرور - الرشاد للصيانة",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F4C81;">إعادة تعيين كلمة المرور</h2>
        <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
        <p>اضغط على الرابط التالي لإعادة التعيين (صالح لمدة ساعة واحدة):</p>
        <a href="${resetUrl}" style="display: inline-block; background: #0F4C81; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          إعادة تعيين كلمة المرور
        </a>
        <p style="color: #666; font-size: 14px;">إذا لم تطلب هذا التغيير، تجاهل هذه الرسالة.</p>
      </div>
    `,
    text: `إعادة تعيين كلمة المرور: ${resetUrl}`,
  });
}

export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<void> {
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_EMAIL ||
    "info@alrashad.com";

  await sendEmail({
    to: adminEmail,
    subject: `رسالة جديدة: ${data.subject}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2 style="color: #0F4C81;">رسالة تواصل جديدة</h2>
        <p><strong>الاسم:</strong> ${data.name}</p>
        <p><strong>البريد:</strong> ${data.email}</p>
        <p><strong>الهاتف:</strong> ${data.phone}</p>
        <p><strong>الموضوع:</strong> ${data.subject}</p>
        <p><strong>الرسالة:</strong></p>
        <p style="background: #f4f7fa; padding: 16px; border-radius: 8px;">${data.message}</p>
      </div>
    `,
  });
}

export async function sendAppointmentStatusEmail(
  email: string,
  name: string,
  status: string,
  serviceName: string,
  date: string,
  time: string
): Promise<void> {
  const statusLabels: Record<string, string> = {
    PENDING: "قيد الانتظار",
    APPROVED: "موافق عليه",
    COMPLETED: "مكتمل",
    CANCELLED: "ملغي",
  };

  await sendEmail({
    to: email,
    subject: `تحديث حالة الموعد - ${statusLabels[status] || status}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2 style="color: #0F4C81;">مرحباً ${name}</h2>
        <p>تم تحديث حالة موعد الصيانة الخاص بك:</p>
        <ul>
          <li><strong>الخدمة:</strong> ${serviceName}</li>
          <li><strong>التاريخ:</strong> ${date}</li>
          <li><strong>الوقت:</strong> ${time}</li>
          <li><strong>الحالة:</strong> ${statusLabels[status] || status}</li>
        </ul>
      </div>
    `,
  });
}
