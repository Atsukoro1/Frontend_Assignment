"use client";

import { HandCoins, Users } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useDonationStats } from "@/api/hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatEur } from "@/lib/currency";
import { useCountUp } from "@/lib/useCountUp";

const Banner = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
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

const StatBody = styled.div`
  min-width: 0;
`;

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.heading};
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
`;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatError = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{ size?: number | string }>;
  value: ReactNode;
  label: string;
}) {
  return (
    <StatCard>
      <IconBadge aria-hidden="true">
        <Icon size={20} />
      </IconBadge>
      <StatBody>
        <StatValue>{value}</StatValue>
        <StatLabel>{label}</StatLabel>
      </StatBody>
    </StatCard>
  );
}

function AnimatedAmount({ target }: { target: number }) {
  const animated = useCountUp(target);
  // Whole euros while animating, the exact value at rest.
  return <>{formatEur(animated === target ? target : Math.round(animated))}</>;
}

function AnimatedCount({ target }: { target: number }) {
  const animated = useCountUp(target);
  return <>{Math.round(animated)}</>;
}

export function StatsBanner() {
  const { t } = useTranslation();
  const { data, isPending, isError } = useDonationStats();

  return (
    <Banner aria-label={t("stats.heading")}>
      {isPending ? (
        <>
          <StatCard>
            <Skeleton $width="100%" $height="2.5rem" />
          </StatCard>
          <StatCard>
            <Skeleton $width="100%" $height="2.5rem" />
          </StatCard>
        </>
      ) : isError ? (
        <StatError>{t("stats.error")}</StatError>
      ) : (
        <>
          <Stat
            icon={HandCoins}
            value={<AnimatedAmount target={data.contribution ?? 0} />}
            label={t("stats.collectedLabel")}
          />
          <Stat
            icon={Users}
            value={<AnimatedCount target={data.contributors} />}
            label={t("stats.donorsLabel")}
          />
        </>
      )}
    </Banner>
  );
}
