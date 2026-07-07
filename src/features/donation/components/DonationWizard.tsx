"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";

import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";

import { useDonationStore } from "../store";
import { DonorsStep } from "./DonorsStep";
import { HelpStep } from "./HelpStep";

const stepEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StepPane = styled.div`
  animation: ${stepEnter} ${({ theme }) => theme.transitions.base};
`;

export function DonationWizard() {
  const { t } = useTranslation();
  const step = useDonationStore((state) => state.step);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Move focus to the step heading when the wizard navigates.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const steps = [
    t("wizard.steps.help"),
    t("wizard.steps.details"),
    t("wizard.steps.confirm"),
  ] as const;

  return (
    <Card>
      <Stepper steps={steps} current={step} aria-label={t("a11y.stepper")} />
      <StepPane key={step}>
        {step === 0 ? <HelpStep headingRef={headingRef} /> : null}
        {step === 1 ? <DonorsStep headingRef={headingRef} /> : null}
      </StepPane>
    </Card>
  );
}
