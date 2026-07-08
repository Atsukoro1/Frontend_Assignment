"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import type { Ref } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useShelters } from "@/api/hooks";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/fieldStyles";
import { SelectField } from "@/components/ui/SelectField";
import { Skeleton } from "@/components/ui/Skeleton";
import { parseAmount } from "@/lib/currency";
import { useValidationMessage } from "@/lib/useValidationMessage";

import { AMOUNT_OPTIONS, helpStepSchema, type HelpStepValues } from "../schemas";
import { useDonationStore } from "../store";
import { ButtonRow, Fieldset, Legend, StepForm, StepHeading } from "./stepShared";

const Segmented = styled.div`
  display: flex;
  border: 1.5px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`;

const SegmentOption = styled.div`
  position: relative;
  display: flex;
  flex: 1;

  & + & {
    border-left: 1.5px solid ${({ theme }) => theme.colors.border};
  }
`;

const SegmentLabel = styled.label`
  flex: 1;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.xs}`};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.heading};
  }
`;

const SegmentRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;

  &:checked + ${SegmentLabel} {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
  }

  &:focus-visible + ${SegmentLabel} {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -3px;
  }
`;

const AmountDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.xs};
  margin: ${({ theme }) => `${theme.space.sm} 0 ${theme.space.md}`};
`;

const AmountInput = styled.input<{ $invalid?: boolean }>`
  width: 8ch;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.display};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.heading};
  background: transparent;
  border: none;
  border-bottom: 3px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.borderStrong)};
  padding: ${({ theme }) => `0 ${theme.space.xxs}`};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.5;
  }

  &:focus-visible {
    outline: none;
    border-bottom-color: ${({ theme, $invalid }) =>
      $invalid ? theme.colors.error : theme.colors.focus};
  }
`;

const EuroSign = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
`;

const Chip = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 2px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.textOnPrimary : theme.colors.text)};
  font-weight: 700;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CenteredError = styled(ErrorMessage)`
  justify-content: center;
`;

const ShelterFallback = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  align-items: flex-start;
`;

const AMOUNT_ERROR_ID = "amount-error";

export function HelpStep({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  const { t } = useTranslation();
  const tv = useValidationMessage();
  const shelters = useShelters();
  const { helpType, shelterID, amount, saveHelpStep } = useDonationStore();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HelpStepValues>({
    resolver: zodResolver(helpStepSchema),
    mode: "onTouched",
    defaultValues: {
      helpType: helpType ?? undefined,
      shelterID,
      amount,
    },
  });

  const selectedHelpType = useWatch({ control, name: "helpType" });
  const currentAmount = useWatch({ control, name: "amount" });
  const parsedAmount = parseAmount(currentAmount ?? "");

  const onSubmit = handleSubmit((values) => saveHelpStep(values));

  return (
    <StepForm onSubmit={onSubmit} noValidate>
      <StepHeading step={0} ref={headingRef}>
        {t("help.heading")}
      </StepHeading>

      <Fieldset>
        <Legend>{t("help.helpTypeLegend")}</Legend>
        <Segmented role="radiogroup" aria-label={t("help.helpTypeLegend")}>
          <SegmentOption>
            <SegmentRadio
              type="radio"
              id="help-type-shelter"
              value="shelter"
              {...register("helpType")}
            />
            <SegmentLabel htmlFor="help-type-shelter">{t("help.optionShelter.title")}</SegmentLabel>
          </SegmentOption>
          <SegmentOption>
            <SegmentRadio
              type="radio"
              id="help-type-general"
              value="general"
              {...register("helpType")}
            />
            <SegmentLabel htmlFor="help-type-general">{t("help.optionGeneral.title")}</SegmentLabel>
          </SegmentOption>
        </Segmented>
        {errors.helpType ? <ErrorMessage>{tv(errors.helpType.message)}</ErrorMessage> : null}
      </Fieldset>

      {shelters.isPending ? (
        <Skeleton $height="3.25rem" />
      ) : shelters.isError ? (
        <ShelterFallback>
          <Alert variant="error">{t("help.shelterLoadError")}</Alert>
          <Button type="button" $variant="secondary" onClick={() => void shelters.refetch()}>
            {t("help.retry")}
          </Button>
        </ShelterFallback>
      ) : (
        <Controller
          control={control}
          name="shelterID"
          render={({ field, fieldState }) => (
            <SelectField
              label={t("help.shelterLabel")}
              optionalTag={selectedHelpType !== "shelter" ? t("help.optionalTag") : undefined}
              error={tv(fieldState.error?.message)}
              hint={shelters.data.length === 0 ? t("help.sheltersEmpty") : undefined}
              disabled={shelters.data.length === 0}
              name={field.name}
              ref={field.ref}
              value={field.value === null ? "" : String(field.value)}
              onBlur={field.onBlur}
              onChange={(event) =>
                field.onChange(event.target.value === "" ? null : Number(event.target.value))
              }
            >
              <option value="">{t("help.shelterPlaceholder")}</option>
              {shelters.data.map((shelter) => (
                <option key={shelter.id} value={shelter.id}>
                  {shelter.name}
                </option>
              ))}
            </SelectField>
          )}
        />
      )}

      <Fieldset>
        <Legend>{t("help.amountLegend")}</Legend>
        <AmountDisplay>
          <AmountInput
            aria-label={t("help.customAmountLabel")}
            placeholder="0"
            inputMode="decimal"
            autoComplete="off"
            aria-invalid={errors.amount ? true : undefined}
            aria-describedby={errors.amount ? AMOUNT_ERROR_ID : undefined}
            $invalid={Boolean(errors.amount)}
            {...register("amount")}
          />
          <EuroSign aria-hidden="true">€</EuroSign>
        </AmountDisplay>
        <ChipRow>
          {AMOUNT_OPTIONS.map((option) => {
            const selected = parsedAmount === option;
            return (
              <Chip
                key={option}
                type="button"
                $selected={selected}
                aria-pressed={selected}
                onClick={() =>
                  setValue("amount", String(option), {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              >
                {option} €
              </Chip>
            );
          })}
        </ChipRow>
        {errors.amount ? (
          <CenteredError id={AMOUNT_ERROR_ID}>{tv(errors.amount.message)}</CenteredError>
        ) : null}
      </Fieldset>

      <ButtonRow>
        <Button type="submit">
          {t("wizard.next")}
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </ButtonRow>
    </StepForm>
  );
}
