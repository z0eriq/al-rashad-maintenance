import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { createBooking } from "@/lib/create-booking";
import { guestBookingSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { z } from "zod";

const adminBookingSchema = guestBookingSchema.extend({
  status: z.enum(["PENDING", "APPROVED", "COMPLETED", "CANCELLED"]).optional(),
});

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const data = adminBookingSchema.parse(body);

    const result = await createBooking({
      ...data,
      status: data.status || "APPROVED",
    });

    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return apiSuccess(
      {
        bookingNumber: result.bookingNumber,
        appointment: result.appointment,
        duration: result.duration,
        message: "تم إنشاء الحجز بنجاح",
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
