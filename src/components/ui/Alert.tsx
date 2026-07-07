"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";

type AlertVariant = "error" | "success";

const enter = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Box = styled.div<{ $variant: AlertVariant }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  animation: ${enter} ${({ theme }) => theme.transitions.base};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  ${({ $variant, theme }) =>
    $variant === "error"
      ? css`
          background: ${theme.colors.errorSoft};
          color: ${theme.colors.error};
        `
      : css`
          background: ${theme.colors.successSoft};
          color: ${theme.colors.success};
        `}
`;

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
}

/** Announced immediately by screen readers via role="alert". */
export function Alert({ variant, children }: AlertProps) {
  return (
    <Box role="alert" $variant={variant}>
      {variant === "error" ? (
        <CircleAlert size={18} aria-hidden="true" />
      ) : (
        <CircleCheck size={18} aria-hidden="true" />
      )}
      <div>{children}</div>
    </Box>
  );
}
