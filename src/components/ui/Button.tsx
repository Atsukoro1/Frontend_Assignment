"use client";

import styled, { css } from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Themed button. `$variant` defaults to primary (brown, cream text);
 * secondary is an outlined variant, ghost is borderless.
 */
export const Button = styled.button<{ $variant?: ButtonVariant; $fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.lg}`};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid transparent;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.3;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ $variant = "primary", theme }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background: ${theme.colors.surface};
          border-color: ${theme.colors.borderStrong};
          color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primarySoft};
          }
        `;
      case "ghost":
        return css`
          background: transparent;
          color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primarySoft};
            box-shadow: none;
          }
        `;
      default:
        return css`
          background: ${theme.colors.primary};
          color: ${theme.colors.textOnPrimary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
          }
        `;
    }
  }}
`;
