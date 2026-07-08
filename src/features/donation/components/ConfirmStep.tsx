"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type Ref } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useShelters, useSubmitDonation } from "@/api/hooks";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { formatEur, parseAmount } from "@/lib/currency";
import { toInternationalPhone } from "@/lib/phone";
import { useValidationMessage } from "@/lib/useValidationMessage";

import { buildContributePayload } from "../payload";
import { consentStepSchema, type ConsentStepValues } from "../schemas";
import { useDonationStore } from "../store";
import { describeSubmitError } from "../submitError";
import { ButtonRow, StepForm, StepHeading } from "./stepShared";

const Summary = styled.dl`
  display: flex;
  flex-direction: column;
  margin: 0;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const SummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => `${theme.space.xxs} ${theme.space.md}`};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};

  &:nth-child(odd) {
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }
`;

const SummaryLabel = styled.dt`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SummaryValue = styled.dd`
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading};
  text-align: right;
`;

const DonorList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs};
`;

const DonorContact = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface ConfirmStepProps {
  headingRef: Ref<HTMLHeadingElement>;
  onSuccess(): void;
}

export function ConfirmStep({ headingRef, onSuccess }: ConfirmStepProps) {
  const { t } = useTranslation();
  const tv = useValidationMessage();
  const helpType = useDonationStore((state) => state.helpType);
  const shelterID = useDonationStore((state) => state.shelterID);
  const amount = useDonationStore((state) => state.amount);
  const donors = useDonationStore((state) => state.donors);
  const goBack = useDonationStore((state) => state.goBack);

  const shelters = useShelters();
  const submitDonation = useSubmitDonation();
  const [payloadInvalid, setPayloadInvalid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentStepValues>({
    resolver: zodResolver(consentStepSchema),
    defaultValues: { consent: false },
  });

  const shelterName =
    shelterID === null
      ? null
      : (shelters.data?.find((shelter) => shelter.id === shelterID)?.name ?? `#${shelterID}`);
  const amountValue = parseAmount(amount);

  const onSubmit = handleSubmit(() => {
    if (submitDonation.isPending) {
      return;
    }
    const payload = buildContributePayload({ helpType, shelterID, amount, donors });
    if (!payload) {
      setPayloadInvalid(true);
      return;
    }
    setPayloadInvalid(false);
    submitDonation.mutate(payload, { onSuccess });
  });

  const submitError = submitDonation.isError
    ? describeSubmitError(submitDonation.error)
    : payloadInvalid
      ? ({ kind: "key", key: "errors.submitFailed" } as const)
      : null;

  return (
    <StepForm onSubmit={onSubmit} noValidate>
      <StepHeading step={2} ref={headingRef}>
        {t("confirm.heading")}
      </StepHeading>

      <Summary>
        <SummaryRow>
          <SummaryLabel>{t("confirm.helpTypeLabel")}</SummaryLabel>
          <SummaryValue>
            {helpType === "shelter" ? t("confirm.helpShelter") : t("confirm.helpGeneral")}
          </SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>{t("confirm.shelterLabel")}</SummaryLabel>
          <SummaryValue>{shelterName ?? t("confirm.noShelter")}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>{t("confirm.amountLabel")}</SummaryLabel>
          <SummaryValue>{amountValue === null ? "—" : formatEur(amountValue)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>{t("confirm.donorsLabel")}</SummaryLabel>
          <SummaryValue>
            <DonorList>
              {donors.map((donor, index) => (
                <li key={index}>
                  {donor.firstName} {donor.lastName}
                  <DonorContact>
                    {donor.email}
                    {donor.phoneNumber.trim() !== ""
                      ? ` · ${toInternationalPhone(donor.phonePrefix, donor.phoneNumber)}`
                      : ""}
                  </DonorContact>
                </li>
              ))}
            </DonorList>
          </SummaryValue>
        </SummaryRow>
      </Summary>

      <CheckboxField
        label={t("confirm.consentLabel")}
        error={tv(errors.consent?.message)}
        {...register("consent")}
      />

      {submitError ? (
        <Alert variant="error">
          {submitError.kind === "key" ? t(submitError.key) : submitError.text}
        </Alert>
      ) : null}

      <ButtonRow>
        <Button type="button" $variant="ghost" onClick={goBack} disabled={submitDonation.isPending}>
          {t("wizard.back")}
        </Button>
        <Button type="submit" disabled={submitDonation.isPending}>
          {submitDonation.isPending ? t("wizard.submitting") : t("wizard.submit")}
        </Button>
      </ButtonRow>
    </StepForm>
  );
}
