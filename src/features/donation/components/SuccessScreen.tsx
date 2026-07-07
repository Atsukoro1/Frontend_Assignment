"use client";

import { Dog, PawPrint } from "lucide-react";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";

import { Button } from "@/components/ui/Button";

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => `${theme.space.xl} 0`};
  text-align: center;
  overflow: hidden;
`;

const pop = keyframes`
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.successSoft};
  color: ${({ theme }) => theme.colors.success};
  animation: ${pop} ${({ theme }) => theme.transitions.base};
`;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  outline: none;
`;

const Message = styled.p`
  max-width: 26rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const drift = keyframes`
  from {
    transform: translateY(20px) rotate(-8deg);
    opacity: 0;
  }
  30% {
    opacity: 0.55;
  }
  to {
    transform: translateY(-70px) rotate(10deg);
    opacity: 0;
  }
`;

/** A handful of paw prints gently drifting up — one delight, not many. */
const Paw = styled(PawPrint)`
  position: absolute;
  bottom: 15%;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0;
  animation: ${drift} 1.8s ease-out both;
  pointer-events: none;

  &:nth-of-type(1) {
    left: 12%;
    animation-delay: 0.1s;
  }
  &:nth-of-type(2) {
    left: 30%;
    animation-delay: 0.45s;
  }
  &:nth-of-type(3) {
    left: 68%;
    animation-delay: 0.25s;
  }
  &:nth-of-type(4) {
    left: 85%;
    animation-delay: 0.6s;
  }
`;

interface SuccessScreenProps {
  headingRef: Ref<HTMLHeadingElement>;
  onRestart(): void;
}

export function SuccessScreen({ headingRef, onRestart }: SuccessScreenProps) {
  const { t } = useTranslation();

  return (
    <Wrap>
      <span aria-hidden="true">
        <Paw size={22} />
        <Paw size={16} />
        <Paw size={20} />
        <Paw size={15} />
      </span>
      <Badge aria-hidden="true">
        <Dog size={40} />
      </Badge>
      <Heading tabIndex={-1} ref={headingRef}>
        {t("success.heading")}
      </Heading>
      <Message>{t("success.message")}</Message>
      <Button type="button" $variant="secondary" onClick={onRestart}>
        {t("success.again")}
      </Button>
    </Wrap>
  );
}
