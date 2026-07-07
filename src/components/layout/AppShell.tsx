"use client";

import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Footer } from "./Footer";
import { Header } from "./Header";

const MAIN_CONTENT_ID = "obsah";

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: ${({ theme }) => theme.space.sm};
  z-index: 100;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-weight: 700;
  text-decoration: none;

  &:focus-visible {
    left: ${({ theme }) => theme.space.sm};
  }
`;

const Main = styled.main`
  width: 100%;
  max-width: 44rem;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.md} ${theme.space.xxl}`};
`;

const Shell = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  ${Main} {
    flex: 1;
  }
`;

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <Shell>
      <SkipLink href={`#${MAIN_CONTENT_ID}`}>{t("nav.skipToContent")}</SkipLink>
      <Header />
      <Main id={MAIN_CONTENT_ID}>{children}</Main>
      <Footer />
    </Shell>
  );
}
