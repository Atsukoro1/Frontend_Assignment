"use client";

import { Check } from "lucide-react";
import styled, { css } from "styled-components";

import { mediaMax } from "@/styles/theme";

const List = styled.ol`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Step = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};

  /* Connector line towards the next step. */
  &:not(:last-child) {
    flex: 1;

    &::after {
      content: "";
      flex: 1;
      min-width: ${({ theme }) => theme.space.md};
      height: 2px;
      border-radius: 1px;
      background: ${({ theme }) => theme.colors.border};
    }
  }
`;

type StepState = "done" | "current" | "upcoming";

const Marker = styled.span<{ $state: StepState }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 800;
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
          box-shadow: 0 0 0 4px ${theme.colors.primarySoft};
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
  white-space: nowrap;
  color: ${({ theme, $state }) =>
    $state === "upcoming" ? theme.colors.textMuted : theme.colors.heading};

  /* On narrow screens only the active step keeps its label. */
  ${mediaMax.sm} {
    ${({ $state }) =>
      $state !== "current" &&
      css`
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
      `}
  }
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
                {state === "done" ? <Check size={16} strokeWidth={3} /> : index + 1}
              </Marker>
              <StepLabel $state={state}>{label}</StepLabel>
            </Step>
          );
        })}
      </List>
    </nav>
  );
}
