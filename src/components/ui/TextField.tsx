"use client";

import { CircleAlert } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import styled from "styled-components";

import { ErrorMessage, FieldWrapper, Hint, inputStyles, Label, OptionalTag } from "./fieldStyles";

const InputShell = styled.div`
  position: relative;
`;

const Input = styled.input<{ $invalid?: boolean; $hasSuffix?: boolean }>`
  ${inputStyles};
  padding-right: ${({ theme, $hasSuffix }) => ($hasSuffix ? theme.space.xl : theme.space.md)};
`;

const Suffix = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.space.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 700;
  pointer-events: none;
`;

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  /** Rendered next to the label, e.g. “nepovinné”. */
  optionalTag?: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  optionalTag,
  error,
  hint,
  suffix,
  id,
  ...rest
}: TextFieldProps) {
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
      <InputShell>
        <Input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          $invalid={Boolean(error)}
          $hasSuffix={Boolean(suffix)}
          {...rest}
        />
        {suffix ? <Suffix aria-hidden="true">{suffix}</Suffix> : null}
      </InputShell>
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
