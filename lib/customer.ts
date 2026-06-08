import prisma from "./prisma";
import { ALLOWED_CAR_TYPES, type AllowedCarType } from "./validation";

export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^\+964/, "0").replace(/^964/, "0");
}

export async function findOrCreateCustomer(input: {
  name: string;
  phone: string;
  carType: string;
}) {
  const phone = normalizePhone(input.phone.trim());
  const name = input.name.trim();
  const carType = input.carType.trim() as AllowedCarType;

  if (!ALLOWED_CAR_TYPES.includes(carType)) {
    return { error: "نوع السيارة غير مدعوم", status: 400 as const };
  }

  const existing = await prisma.customer.findUnique({ where: { phone } });

  if (existing) {
    return { customer: existing, isNew: false };
  }

  const customer = await prisma.customer.create({
    data: { name, phone, carType },
  });

  return { customer, isNew: true };
}
