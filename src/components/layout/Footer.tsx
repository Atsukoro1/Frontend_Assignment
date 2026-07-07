"use client";

import { PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Bar = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundAlt};
`;

const Inner = styled.div`
  max-width: 44rem;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.md}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MadeWith = styled.p`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
`;

export function Footer() {
  const { t } = useTranslation();

  return (
    <Bar>
      <Inner>
        <p>{t("app.footerNote")}</p>
        <MadeWith>
          {t("app.footerMadeWith")}
          <PawPrint size={16} aria-hidden="true" />
        </MadeWith>
      </Inner>
    </Bar>
  );
}
