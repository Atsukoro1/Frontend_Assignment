"use client";

import { Check, CircleAlert } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import styled from "styled-components";

import { ErrorMessage } from "./fieldStyles";

const Wrapper = styled.div`
  width: 100%;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
`;

const Box = styled.span<{ $invalid?: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  margin-top: 1px;
  border-radius: 7px;
  border: 1.5px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.borderStrong)};
  background: ${({ theme }) => theme.colors.surface};
  color: transparent;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;

  &:checked + ${Box} {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
  }

  &:focus-visible + ${Box} {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export function CheckboxField({ label, error, id, ...rest }: CheckboxFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <Wrapper>
      <CheckboxLabel htmlFor={fieldId}>
        <HiddenInput
          type="checkbox"
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        <Box $invalid={Boolean(error)} aria-hidden="true">
          <Check size={14} strokeWidth={3} />
        </Box>
        <span>{label}</span>
      </CheckboxLabel>
      {error ? (
        <ErrorMessage id={errorId}>
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </ErrorMessage>
      ) : null}
    </Wrapper>
  );
}
