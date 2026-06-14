import { createHash, randomUUID } from "crypto";

const META_GRAPH_API_VERSION = "v21.0";

export type MetaConversionEventName =
  | "Lead"
  | "Schedule"
  | "Contact"
  | "CompleteRegistration";

type MetaUserDataInput = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
};

type MetaConversionEventInput = {
  eventName: MetaConversionEventName;
  eventId?: string;
  eventSourceUrl?: string;
  customData?: Record<string, string | number | boolean>;
  userData?: MetaUserDataInput;
};

function getMetaPixelId(): string | null {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2195039458004580";
}

function getMetaAccessToken(): string | null {
  return process.env.META_CONVERSIONS_ACCESS_TOKEN ?? null;
}

/** Create a unique event id for browser/server deduplication. */
export function createMetaEventId(): string {
  return randomUUID();
}

function hashMetaValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Normalize Iraqi phone numbers for Meta hashing (e.g. 07xx -> 9647xx). */
export function normalizePhoneForMeta(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("964") && digits.length >= 12) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return `964${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length >= 9) return `964${digits}`;

  return digits.length >= 9 ? digits : null;
}

function normalizeEmailForMeta(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  return normalized.includes("@") ? normalized : null;
}

function splitName(name: string): { firstName?: string; lastName?: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {};

  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  };
}

function buildHashedUserData(userData?: MetaUserDataInput) {
  if (!userData) return undefined;

  const hashed: Record<string, string[]> = {};

  if (userData.email) {
    const email = normalizeEmailForMeta(userData.email);
    if (email) hashed.em = [hashMetaValue(email)];
  }

  if (userData.phone) {
    const phone = normalizePhoneForMeta(userData.phone);
    if (phone) hashed.ph = [hashMetaValue(phone)];
  }

  if (userData.firstName) {
    hashed.fn = [hashMetaValue(userData.firstName.trim().toLowerCase())];
  }

  if (userData.lastName) {
    hashed.ln = [hashMetaValue(userData.lastName.trim().toLowerCase())];
  }

  return Object.keys(hashed).length ? hashed : undefined;
}

function getCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();

  return request.headers.get("x-real-ip") ?? undefined;
}

function getEventSourceUrl(request: Request, override?: string): string | undefined {
  if (override) return override;

  return (
    request.headers.get("referer") ??
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    undefined
  );
}

function buildServerEvent(
  request: Request,
  event: MetaConversionEventInput
) {
  const hashedUserData = buildHashedUserData(event.userData);
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? undefined;
  const fbc = getCookie(request, "_fbc");
  const fbp = getCookie(request, "_fbp");

  const user_data: Record<string, string | string[]> = {};

  if (hashedUserData) Object.assign(user_data, hashedUserData);
  if (clientIp) user_data.client_ip_address = clientIp;
  if (userAgent) user_data.client_user_agent = userAgent;
  if (fbc) user_data.fbc = fbc;
  if (fbp) user_data.fbp = fbp;

  return {
    event_name: event.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: event.eventId ?? createMetaEventId(),
    action_source: "website",
    event_source_url: getEventSourceUrl(request, event.eventSourceUrl),
    user_data,
    custom_data: event.customData,
  };
}

/** Send one or more conversion events to Meta Conversions API. */
export async function sendMetaConversionEvents(
  request: Request,
  events: MetaConversionEventInput[]
): Promise<void> {
  const pixelId = getMetaPixelId();
  const accessToken = getMetaAccessToken();

  if (!pixelId || !accessToken || events.length === 0) return;

  const payload: Record<string, unknown> = {
    data: events.map((event) => buildServerEvent(request, event)),
    access_token: accessToken,
  };

  const testEventCode = process.env.META_TEST_EVENT_CODE;
  if (testEventCode) payload.test_event_code = testEventCode;

  const response = await fetch(
    `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Meta Conversions API error:", response.status, errorBody);
  }
}

export function buildMetaUserDataFromContact(input: {
  name: string;
  email: string;
  phone: string;
}): MetaUserDataInput {
  const { firstName, lastName } = splitName(input.name);

  return {
    email: input.email,
    phone: input.phone,
    firstName,
    lastName,
  };
}

export function buildMetaUserDataFromBooking(input: {
  guestName: string;
  guestPhone: string;
}): MetaUserDataInput {
  const { firstName, lastName } = splitName(input.guestName);

  return {
    phone: input.guestPhone,
    firstName,
    lastName,
  };
}
