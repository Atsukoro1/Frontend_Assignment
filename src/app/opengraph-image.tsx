import { ImageResponse } from "next/og";

import sk from "@/locales/sk/common.json";
import { theme } from "@/styles/theme";

export const alt = sk.seo.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        backgroundColor: theme.colors.background,
        backgroundImage: `radial-gradient(circle at 85% 20%, ${theme.colors.primarySoft} 0%, transparent 45%)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: theme.colors.primary,
          fontSize: 72,
        }}
      >
        🐾
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: theme.colors.heading,
        }}
      >
        {sk.app.name}
      </div>
      <div
        style={{
          fontSize: 40,
          color: theme.colors.primary,
        }}
      >
        {sk.app.tagline}
      </div>
    </div>,
    { ...size, emoji: "twemoji" },
  );
}
