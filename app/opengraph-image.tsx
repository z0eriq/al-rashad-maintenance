import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/utils";

export const runtime = "edge";
export const alt = SITE_CONFIG.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0F4C81 0%, #0a3a63 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {SITE_CONFIG.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#1D9BF0",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          صيانة السيارات وقطع الغيار — الوكيل الحصري لكيا عراق
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            opacity: 0.8,
          }}
        >
          الحلة، بابل — احجز موعد صيانة سيارتك
        </div>
      </div>
    ),
    { ...size }
  );
}
