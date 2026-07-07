"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Plus, Trash2 } from "lucide-react";
import { useId, type Ref } from "react";
import { Controller, useFieldArray, useForm, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Button } from "@/components/ui/Button";
import {
  ErrorMessage,
  FieldWrapper,
  Hint,
  inputStyles,
  Label,
  OptionalTag,
} from "@/components/ui/fieldStyles";
import { CzechFlag, SlovakFlag } from "@/components/ui/flags";
import { TextField } from "@/components/ui/TextField";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { PHONE_PREFIXES, type PhonePrefix } from "@/lib/phone";
import { useValidationMessage } from "@/lib/useValidationMessage";
import { media } from "@/styles/theme";

import { donorsStepSchema, type DonorsStepValues } from "../schemas";
import { createEmptyDonor, useDonationStore } from "../store";
import { ButtonRow, StepForm, StepHeading } from "./stepShared";

const DonorCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const DonorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};
`;

const DonorTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const NameGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.md};

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }
`;

const PhoneRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
`;

const PrefixGroup = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ theme }) => theme.colors.borderStrong};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
`;

const PrefixOption = styled.div`
  position: relative;
  display: flex;

  & + & {
    border-left: 1.5px solid ${({ theme }) => theme.colors.border};
  }
`;

const PrefixLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.xs}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  svg {
    border-radius: 2px;
  }
`;

const PrefixRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;

  &:checked + ${PrefixLabel} {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.heading};
  }

  &:focus-visible + ${PrefixLabel} {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -3px;
  }
`;

const PhoneInput = styled.input<{ $invalid?: boolean }>`
  ${inputStyles};
`;

const AddDonorRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.xxs};
`;

const FLAG_BY_PREFIX = {
  "+421": SlovakFlag,
  "+420": CzechFlag,
} as const satisfies Record<PhonePrefix, unknown>;

interface PhoneFieldProps {
  index: number;
  control: Control<DonorsStepValues>;
  error?: string;
}

function PhoneField({ index, control, error }: PhoneFieldProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <FieldWrapper>
      <Label htmlFor={inputId}>
        {t("donors.phone")} <OptionalTag>({t("donors.optionalTag")})</OptionalTag>
      </Label>
      <PhoneRow>
        <Controller
          control={control}
          name={`donors.${index}.phonePrefix`}
          render={({ field }) => (
            <PrefixGroup role="radiogroup" aria-label={t("donors.prefixLegend")}>
              {PHONE_PREFIXES.map((option) => {
                const Flag = FLAG_BY_PREFIX[option.prefix];
                const optionId = `${inputId}-prefix-${option.prefix}`;
                return (
                  <PrefixOption key={option.prefix}>
                    <PrefixRadio
                      type="radio"
                      id={optionId}
                      name={field.name}
                      value={option.prefix}
                      checked={field.value === option.prefix}
                      onChange={() => field.onChange(option.prefix)}
                      onBlur={field.onBlur}
                    />
                    <PrefixLabel htmlFor={optionId}>
                      <Flag />
                      <VisuallyHidden>{t(option.labelKey)} </VisuallyHidden>
                      <span aria-hidden="true">{option.prefix}</span>
                    </PrefixLabel>
                  </PrefixOption>
                );
              })}
            </PrefixGroup>
          )}
        />
        <Controller
          control={control}
          name={`donors.${index}.phoneNumber`}
          render={({ field }) => (
            <PhoneInput
              id={inputId}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={t("donors.phonePlaceholder")}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : hintId}
              $invalid={Boolean(error)}
              {...field}
            />
          )}
        />
      </PhoneRow>
      {error ? (
        <ErrorMessage id={errorId}>
          <CircleAlert size={14} aria-hidden="true" />
          {error}
        </ErrorMessage>
      ) : (
        <Hint id={hintId}>{t("donors.phoneHint")}</Hint>
      )}
    </FieldWrapper>
  );
}

export function DonorsStep({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  const { t } = useTranslation();
  const tv = useValidationMessage();
  const donors = useDonationStore((state) => state.donors);
  const saveDonorsStep = useDonationStore((state) => state.saveDonorsStep);
  const updateDonors = useDonationStore((state) => state.updateDonors);
  const goBack = useDonationStore((state) => state.goBack);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<DonorsStepValues>({
    resolver: zodResolver(donorsStepSchema),
    mode: "onTouched",
    defaultValues: { donors },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "donors" });

  const onSubmit = handleSubmit((values) => saveDonorsStep(values.donors));

  const onBack = () => {
    updateDonors(getValues("donors"));
    goBack();
  };

  return (
    <StepForm onSubmit={onSubmit} noValidate>
      <StepHeading step={1} ref={headingRef}>
        {t("donors.heading")}
      </StepHeading>

      {fields.map((field, index) => {
        const donorErrors = errors.donors?.[index];
        return (
          <DonorCard key={field.id} aria-label={t("donors.donorTitle", { index: index + 1 })}>
            {fields.length > 1 ? (
              <DonorHeader>
                <DonorTitle>{t("donors.donorTitle", { index: index + 1 })}</DonorTitle>
                {index > 0 ? (
                  <Button type="button" $variant="ghost" onClick={() => remove(index)}>
                    <Trash2 size={16} aria-hidden="true" />
                    {t("donors.removeDonor", { index: index + 1 })}
                  </Button>
                ) : null}
              </DonorHeader>
            ) : null}

            <NameGrid>
              <TextField
                label={t("donors.firstName")}
                autoComplete="given-name"
                error={tv(donorErrors?.firstName?.message)}
                {...register(`donors.${index}.firstName`)}
              />
              <TextField
                label={t("donors.lastName")}
                autoComplete="family-name"
                error={tv(donorErrors?.lastName?.message)}
                {...register(`donors.${index}.lastName`)}
              />
            </NameGrid>
            <TextField
              label={t("donors.email")}
              type="email"
              autoComplete="email"
              error={tv(donorErrors?.email?.message)}
              {...register(`donors.${index}.email`)}
            />
            <PhoneField
              index={index}
              control={control}
              error={tv(donorErrors?.phoneNumber?.message)}
            />
          </DonorCard>
        );
      })}

      <AddDonorRow>
        <Button type="button" $variant="secondary" onClick={() => append(createEmptyDonor())}>
          <Plus size={16} aria-hidden="true" />
          {t("donors.addDonor")}
        </Button>
        <Hint>{t("donors.addDonorHint")}</Hint>
      </AddDonorRow>

      <ButtonRow>
        <Button type="button" $variant="ghost" onClick={onBack}>
          {t("wizard.back")}
        </Button>
        <Button type="submit">{t("wizard.next")}</Button>
      </ButtonRow>
    </StepForm>
  );
}
