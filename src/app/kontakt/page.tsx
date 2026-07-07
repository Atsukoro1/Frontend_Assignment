import type { Metadata } from "next";

import { ContactPage } from "@/features/contact/components/ContactPage";
import sk from "@/locales/sk/common.json";

export const metadata: Metadata = {
  title: sk.seo.contact.title,
  description: sk.seo.contact.description,
  openGraph: {
    title: `${sk.seo.contact.title} · ${sk.seo.siteName}`,
    description: sk.seo.contact.description,
  },
};

export default function KontaktRoute() {
  return <ContactPage />;
}
