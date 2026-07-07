"use client";

import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { media } from "@/styles/theme";

import { DonationWizard } from "./DonationWizard";
import { StatsBanner } from "./StatsBanner";

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

export function DonationPage() {
  const { t } = useTranslation();

  return (
    <>
      <Intro>
        <Title>{t("home.title")}</Title>
        <Lead>{t("home.lead")}</Lead>
      </Intro>
      <StatsBanner />
      <DonationWizard />
    </>
  );
}
