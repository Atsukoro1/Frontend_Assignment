import type { Metadata } from "next";

import { ContactPage } from "@/features/contact/components/ContactPage";
import cs from "@/locales/cs/common.json";

export const metadata: Metadata = {
  title: cs.seo.contact.title,
  description: cs.seo.contact.description,
  openGraph: {
    title: `${cs.seo.contact.title} · ${cs.seo.siteName}`,
    description: cs.seo.contact.description,
  },
};

export default function KontaktRoute() {
  return <ContactPage />;
}
