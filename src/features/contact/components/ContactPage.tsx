"use client";

import { Building2, Clock, Mail, MapPin, PawPrint, Phone } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Card } from "@/components/ui/Card";
import { media } from "@/styles/theme";

const Intro = styled.section`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.space.xs};

  ${media.md} {
    font-size: ${({ theme }) => theme.fontSizes.display};
  }
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 34rem;
  margin: 0 auto;
`;

const OrgName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const Rows = styled.address`
  display: grid;
  gap: ${({ theme }) => theme.space.md};
  font-style: normal;

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.sm};
`;

const IconBadge = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
`;

const RowLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RowValue = styled.p`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading};

  a {
    color: inherit;
    text-decoration-color: ${({ theme }) => theme.colors.borderStrong};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Note = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
  margin-top: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.heading};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  text-align: center;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ size?: number | string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <Row>
      <IconBadge aria-hidden="true">
        <Icon size={20} />
      </IconBadge>
      <div>
        <RowLabel>{label}</RowLabel>
        <RowValue>{children}</RowValue>
      </div>
    </Row>
  );
}

export function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <Intro>
        <Title>{t("contact.heading")}</Title>
        <Lead>{t("contact.lead")}</Lead>
      </Intro>

      <Card>
        <OrgName>{t("contact.orgName")}</OrgName>
        <Rows>
          <ContactRow icon={MapPin} label={t("contact.addressLabel")}>
            {t("contact.addressStreet")}
            <br />
            {t("contact.addressCity")}
          </ContactRow>
          <ContactRow icon={Mail} label={t("contact.emailLabel")}>
            <a href={`mailto:${t("contact.email")}`}>{t("contact.email")}</a>
          </ContactRow>
          <ContactRow icon={Phone} label={t("contact.phoneLabel")}>
            <a href={`tel:${t("contact.phone").replace(/\s/g, "")}`}>{t("contact.phone")}</a>
          </ContactRow>
          <ContactRow icon={Building2} label={t("contact.icoLabel")}>
            {t("contact.ico")}
          </ContactRow>
          <ContactRow icon={Clock} label={t("contact.hoursLabel")}>
            {t("contact.hours")}
          </ContactRow>
        </Rows>
        <Note>
          <PawPrint size={18} aria-hidden="true" />
          {t("contact.note")}
        </Note>
      </Card>
    </>
  );
}
