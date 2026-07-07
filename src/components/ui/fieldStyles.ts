"use client";

import styled, { css, keyframes } from "styled-components";

/** Shared look for text inputs and selects. */
export const inputStyles = css<{ $invalid?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.borderStrong)};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, $invalid }) =>
      $invalid ? theme.colors.error : theme.colors.primary};
  }

  &:focus-visible {
    outline-offset: 0;
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.focus)};
  }
`;

export const Label = styled.label`
  display: block;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.heading};
  margin-bottom: ${({ theme }) => theme.space.xxs};
`;

export const OptionalTag = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Hint = styled.p`
  margin-top: ${({ theme }) => theme.space.xxs};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const errorEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ErrorMessage = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  margin-top: ${({ theme }) => theme.space.xxs};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error};
  animation: ${errorEnter} ${({ theme }) => theme.transitions.fast};
`;

export const FieldWrapper = styled.div`
  width: 100%;
`;
