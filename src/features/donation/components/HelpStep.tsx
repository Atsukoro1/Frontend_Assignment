"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { House, PawPrint } from "lucide-react";
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
import { TextField } from "@/components/ui/TextField";
import { parseAmount } from "@/lib/currency";
import { useValidationMessage } from "@/lib/useValidationMessage";
import { media } from "@/styles/theme";

import { AMOUNT_OPTIONS, helpStepSchema, type HelpStepValues } from "../schemas";
import { useDonationStore } from "../store";
import { ButtonRow, Fieldset, Legend, StepForm, StepHeading } from "./stepShared";

const HelpGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }
`;

const HelpOption = styled.div`
  position: relative;
`;

const HelpCard = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
  height: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    transform: translateY(-1px);
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;

  &:checked + ${HelpCard} {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  &:focus-visible + ${HelpCard} {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

const HelpIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const HelpTitle = styled.span`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.heading};
  line-height: 1.3;
`;

const HelpDescription = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const Chip = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 2px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.textOnPrimary : theme.colors.text};
  font-weight: 700;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ShelterFallback = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  align-items: flex-start;
`;

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
        <HelpGrid role="radiogroup" aria-label={t("help.helpTypeLegend")}>
          <HelpOption>
            <HiddenRadio
              type="radio"
              id="help-type-shelter"
              value="shelter"
              {...register("helpType")}
            />
            <HelpCard htmlFor="help-type-shelter">
              <HelpIcon aria-hidden="true">
                <House size={20} />
              </HelpIcon>
              <HelpTitle>{t("help.optionShelter.title")}</HelpTitle>
              <HelpDescription>{t("help.optionShelter.description")}</HelpDescription>
            </HelpCard>
          </HelpOption>
          <HelpOption>
            <HiddenRadio
              type="radio"
              id="help-type-general"
              value="general"
              {...register("helpType")}
            />
            <HelpCard htmlFor="help-type-general">
              <HelpIcon aria-hidden="true">
                <PawPrint size={20} />
              </HelpIcon>
              <HelpTitle>{t("help.optionGeneral.title")}</HelpTitle>
              <HelpDescription>{t("help.optionGeneral.description")}</HelpDescription>
            </HelpCard>
          </HelpOption>
        </HelpGrid>
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
        <TextField
          label={t("help.customAmountLabel")}
          placeholder={t("help.customAmountPlaceholder")}
          inputMode="decimal"
          autoComplete="off"
          suffix="€"
          error={tv(errors.amount?.message)}
          {...register("amount")}
        />
      </Fieldset>

      <ButtonRow>
        <Button type="submit">{t("wizard.next")}</Button>
      </ButtonRow>
    </StepForm>
  );
}
