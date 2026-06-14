import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const firstError = error.errors[0]?.message || "بيانات غير صالحة";
    return apiError(firstError, 422);
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return apiError("البيانات مسجلة مسبقاً. يرجى التحقق والمحاولة مرة أخرى.", 409);
  }

  console.error("API Error:", error);
  return apiError("حدث خطأ في الخادم. يرجى المحاولة لاحقاً.", 500);
}

export function parseJsonBody<T>(body: unknown): T {
  return body as T;
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

export function rateLimitResponse() {
  return NextResponse.json(
    { success: false, error: "طلبات كثيرة. يرجى المحاولة بعد دقيقة." },
    { status: 429 }
  );
}
