import { ImageResponse } from "next/og";
import { SITE } from "./lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.tagline}`;

/** Rendered from the same copy as the page, so the card can never drift. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #0a0a0b 0%, #14141c 55%, #1a0d04 100%)",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#ED661D" }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#ED661D" }} />
          {SITE.name}
        </div>
        <div style={{ marginTop: 26, fontSize: 78, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
          {SITE.tagline}
        </div>
        <div style={{ marginTop: 22, fontSize: 30, color: "#a1a1aa", maxWidth: 940, lineHeight: 1.35 }}>
          Your IPv4 and IPv6 address, with location, ISP and VPN status.
        </div>
        <div style={{ marginTop: "auto", fontSize: 22, color: "#71717a" }}>
          Powered by the ipstack API from APILayer
        </div>
      </div>
    ),
    size
  );
}
