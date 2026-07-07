"use client";

import { Check, PawPrint } from "lucide-react";
import styled, { css } from "styled-components";

const List = styled.ol`
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Step = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  flex: 1;
  max-width: 9rem;
  position: relative;

  /* Connector line between step markers. */
  &:not(:first-child)::before {
    content: "";
    position: absolute;
    top: 1.25rem;
    right: calc(50% + 1.75rem);
    width: calc(100% - 3.5rem);
    height: 2px;
    border-radius: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

type StepState = "done" | "current" | "upcoming";

const Marker = styled.span<{ $state: StepState }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  transition:
    background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  ${({ $state, theme }) => {
    switch ($state) {
      case "done":
        return css`
          background: ${theme.colors.success};
          color: ${theme.colors.textOnPrimary};
        `;
      case "current":
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.textOnPrimary};
          box-shadow: 0 0 0 5px ${theme.colors.primarySoft};
        `;
      default:
        return css`
          background: ${theme.colors.surfaceMuted};
          color: ${theme.colors.textMuted};
        `;
    }
  }}
`;

const StepLabel = styled.span<{ $state: StepState }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 700;
  text-align: center;
  color: ${({ theme, $state }) =>
    $state === "upcoming" ? theme.colors.textMuted : theme.colors.heading};
`;

interface StepperProps {
  steps: readonly string[];
  /** Zero-based index of the active step. */
  current: number;
  "aria-label": string;
}

export function Stepper({ steps, current, "aria-label": ariaLabel }: StepperProps) {
  return (
    <nav aria-label={ariaLabel}>
      <List>
        {steps.map((label, index) => {
          const state: StepState =
            index < current ? "done" : index === current ? "current" : "upcoming";
          return (
            <Step key={label} aria-current={state === "current" ? "step" : undefined}>
              <Marker $state={state} aria-hidden="true">
                {state === "done" ? <Check size={18} strokeWidth={3} /> : <PawPrint size={18} />}
              </Marker>
              <StepLabel $state={state}>{label}</StepLabel>
            </Step>
          );
        })}
      </List>
    </nav>
  );
}
