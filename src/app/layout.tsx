import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import sk from "@/locales/sk/common.json";
import { StyledComponentsRegistry } from "@/styles/StyledComponentsRegistry";
import { theme } from "@/styles/theme";

import { Providers } from "./providers";

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

// TODO/ASSUMPTION: replace with the real production URL when the app is deployed.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: sk.seo.home.title,
    template: `%s · ${sk.seo.siteName}`,
  },
  description: sk.seo.home.description,
  openGraph: {
    type: "website",
    locale: "sk_SK",
    siteName: sk.seo.siteName,
    title: sk.seo.home.title,
    description: sk.seo.home.description,
  },
};

export const viewport: Viewport = {
  themeColor: theme.colors.background,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk" className={nunito.variable}>
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
