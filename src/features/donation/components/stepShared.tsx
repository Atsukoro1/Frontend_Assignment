"use client";

import { type ReactNode, type Ref } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { VisuallyHidden } from "@/components/ui/VisuallyHidden";

import { WIZARD_STEP_COUNT } from "../store";

export const StepForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

export const Fieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin: 0;
  min-inline-size: 0;
`;

export const Legend = styled.legend`
  padding: 0;
  margin-bottom: ${({ theme }) => theme.space.xs};
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.heading};
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: ${({ theme }) => theme.space.xs};

  /* A lone primary button (first step) sits on the right. */
  > :only-child {
    margin-left: auto;
  }
`;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin: ${({ theme }) => `${theme.space.lg} 0 ${theme.space.md}`};
  outline: none;
`;

interface StepHeadingProps {
  step: number;
  children: ReactNode;
  /** Receives programmatic focus when the wizard changes steps. */
  ref: Ref<HTMLHeadingElement>;
}

export function StepHeading({ step, children, ref }: StepHeadingProps) {
  const { t } = useTranslation();

  return (
    <Heading tabIndex={-1} ref={ref}>
      <VisuallyHidden>
        {t("wizard.stepLabel", { current: step + 1, total: WIZARD_STEP_COUNT })}{" "}
      </VisuallyHidden>
      {children}
    </Heading>
  );
}
