"use client";

import { ChevronDown, CircleAlert } from "lucide-react";
import { useId, type ReactNode, type Ref, type SelectHTMLAttributes } from "react";
import styled from "styled-components";

import { ErrorMessage, FieldWrapper, Hint, inputStyles, Label, OptionalTag } from "./fieldStyles";

const SelectShell = styled.div`
  position: relative;
`;

const Select = styled.select<{ $invalid?: boolean }>`
  ${inputStyles};
  appearance: none;
  padding-right: ${({ theme }) => theme.space.xl};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Chevron = styled(ChevronDown)`
  position: absolute;
  right: ${({ theme }) => theme.space.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  optionalTag?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  ref?: Ref<HTMLSelectElement>;
}

export function SelectField({
  label,
  optionalTag,
  error,
  hint,
  id,
  children,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <FieldWrapper>
      <Label htmlFor={fieldId}>
        {label} {optionalTag ? <OptionalTag>({optionalTag})</OptionalTag> : null}
      </Label>
      <SelectShell>
        <Select
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          $invalid={Boolean(error)}
          {...rest}
        >
          {children}
        </Select>
        <Chevron size={18} aria-hidden="true" />
      </SelectShell>
      {hint && !error ? <Hint id={hintId}>{hint}</Hint> : null}
      {error ? (
        <ErrorMessage id={errorId}>
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </ErrorMessage>
      ) : null}
    </FieldWrapper>
  );
}
