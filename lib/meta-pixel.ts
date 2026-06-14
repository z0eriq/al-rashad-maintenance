export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2195039458004580";

type MetaPixelEvent =
  | "PageView"
  | "Lead"
  | "Schedule"
  | "Contact"
  | "CompleteRegistration";

type MetaPixelParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: (
      action: "track" | "trackCustom" | "init",
      event: string,
      params?: MetaPixelParams,
      options?: { eventID?: string }
    ) => void;
  }
}

/** Fire a standard Meta Pixel event (client-side only). */
export function trackMetaEvent(
  event: MetaPixelEvent,
  params?: MetaPixelParams,
  eventId?: string
): void {
  if (typeof window === "undefined" || !window.fbq) return;

  if (eventId) {
    window.fbq("track", event, params ?? {}, { eventID: eventId });
    return;
  }

  window.fbq("track", event, params);
}
