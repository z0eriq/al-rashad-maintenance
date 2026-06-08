import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    bookingCode: "D",
    name: "Periodic Maintenance",
    nameAr: "الصيانة الدورية",
    slug: "periodic-maintenance",
    description: "Scheduled maintenance for all vehicle types",
    descriptionAr:
      "صيانة دورية شاملة للسيارات تشمل الفحص والتشحيم وفحص السوائل والأنظمة الأساسية",
    icon: "car",
    duration: 90,
    sortOrder: 1,
  },
  {
    bookingCode: "M",
    name: "Engine Maintenance",
    nameAr: "صيانة المحرك",
    slug: "engine-maintenance",
    description: "Engine diagnostics, repair and overhaul",
    descriptionAr:
      "تشخيص وإصلاح أعطال المحرك باستخدام أحدث الأجهزة والمعدات المتخصصة",
    icon: "settings",
    duration: 120,
    sortOrder: 2,
  },
  {
    bookingCode: "F",
    name: "Brake Service",
    nameAr: "صيانة الفرامل",
    slug: "brake-service",
    description: "Brake pads, discs and hydraulic system service",
    descriptionAr:
      "فحص وصيانة نظام الفرامل وتبديل تيل وأقراص الفرامل وضبط كفاءة الكبح",
    icon: "brakes",
    duration: 90,
    sortOrder: 3,
  },
  {
    bookingCode: "T",
    name: "Car AC Service",
    nameAr: "صيانة تكييف السيارة",
    slug: "car-ac-service",
    description: "Automotive air conditioning service and repair",
    descriptionAr:
      "صيانة وإصلاح نظام التكييف في السيارات وشحن الفريون وفحص الضاغط",
    icon: "air-vent",
    duration: 60,
    sortOrder: 4,
  },
  {
    bookingCode: "Z",
    name: "Oil & Filter Change",
    nameAr: "تبديل الزيت والفلاتر",
    slug: "oil-filter-change",
    description: "Engine oil and filter replacement service",
    descriptionAr:
      "تبديل زيت المحرك والفلاتر بأنواعها بمواد أصلية ومعتمدة لضمان أداء المحرك",
    icon: "fuel",
    duration: 45,
    sortOrder: 5,
  },
  {
    bookingCode: "H",
    name: "Full Vehicle Inspection",
    nameAr: "الفحص الشامل للسيارة",
    slug: "full-inspection",
    description: "Complete multi-point vehicle inspection",
    descriptionAr:
      "فحص شامل لجميع أنظمة السيارة قبل السفر أو الشراء مع تقرير مفصل",
    icon: "gauge",
    duration: 60,
    sortOrder: 6,
  },
  {
    bookingCode: "N",
    name: "Transmission Service",
    nameAr: "صيانة ناقل الحركة",
    slug: "transmission-service",
    description: "Gearbox and transmission diagnostics and repair",
    descriptionAr:
      "صيانة وإصلاح ناقل الحركة اليدوي والأوتوماتيكي بإشراف فنيين متخصصين",
    icon: "cog",
    duration: 120,
    sortOrder: 7,
  },
  {
    bookingCode: "K",
    name: "Kia Spare Parts",
    nameAr: "قطع غيار كيا",
    slug: "kia-spare-parts",
    description: "Original Kia spare parts supply and installation",
    descriptionAr:
      "توفير وتركيب قطع غيار كيا الأصلية - الوكيل الحصري لكيا عراق",
    icon: "wrench",
    duration: 60,
    sortOrder: 8,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@alrashad.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { phone: "07830032800" },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "مدير النظام",
      phone: "07830032800",
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  const newSlugs = services.map((s) => s.slug);
  await prisma.service.updateMany({
    where: { slug: { notIn: newSlugs } },
    data: { isActive: false },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, isActive: true },
      create: { ...service, isActive: true },
    });
  }

  console.log(`✅ ${services.length} car services seeded`);

  const appointments = await prisma.appointment.findMany({
    where: { guestPhone: { not: null } },
    select: { id: true, guestName: true, guestPhone: true, carType: true },
  });

  let linked = 0;
  for (const apt of appointments) {
    if (!apt.guestPhone || !apt.guestName) continue;
    const phone = apt.guestPhone.replace(/\s+/g, "");
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {},
      create: {
        name: apt.guestName,
        phone,
        carType: apt.carType,
      },
    });
    await prisma.appointment.update({
      where: { id: apt.id },
      data: { customerId: customer.id },
    });
    linked++;
  }

  if (linked > 0) {
    console.log(`✅ Linked ${linked} appointments to customers`);
  }

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
