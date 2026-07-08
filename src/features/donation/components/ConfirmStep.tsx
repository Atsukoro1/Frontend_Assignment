"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Fragment, useState, type ReactNode, type Ref } from "react";
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
import { ButtonRow, Legend, StepForm, StepHeading } from "./stepShared";

const SummaryBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Summary = styled.dl`
  display: flex;
  flex-direction: column;
  margin: 0;
`;

const SummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => `${theme.space.xxs} ${theme.space.md}`};
  padding: ${({ theme }) => `${theme.space.xs} 0`};
`;

const SummaryLabel = styled.dt`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SummaryValue = styled.dd`
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading};
  text-align: right;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => `${theme.space.sm} 0`};
`;

const DonorTag = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.xxs};
`;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <SummaryRow>
      <SummaryLabel>{label}</SummaryLabel>
      <SummaryValue>{children}</SummaryValue>
    </SummaryRow>
  );
}

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

      <SummaryBlock>
        <Legend as="h3">{t("confirm.summaryLabel")}</Legend>
        <Summary>
          <Row label={t("confirm.helpTypeLabel")}>
            {helpType === "shelter" ? t("confirm.helpShelter") : t("confirm.helpGeneral")}
          </Row>
          <Row label={t("confirm.shelterLabel")}>{shelterName ?? t("confirm.noShelter")}</Row>
          <Row label={t("confirm.amountLabel")}>
            {amountValue === null ? "—" : formatEur(amountValue)}
          </Row>
        </Summary>

        {donors.map((donor, index) => (
          <Fragment key={index}>
            <Divider />
            {donors.length > 1 ? (
              <DonorTag>{t("confirm.donorLabel", { index: index + 1 })}</DonorTag>
            ) : null}
            <Summary>
              <Row label={t("confirm.nameLabel")}>
                {donor.firstName} {donor.lastName}
              </Row>
              <Row label={t("confirm.emailLabel")}>{donor.email}</Row>
              <Row label={t("confirm.phoneLabel")}>
                {donor.phoneNumber.trim() !== ""
                  ? toInternationalPhone(donor.phonePrefix, donor.phoneNumber)
                  : "—"}
              </Row>
            </Summary>
          </Fragment>
        ))}
        <Divider />
      </SummaryBlock>

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
        <Button
          type="button"
          $variant="muted"
          onClick={goBack}
          disabled={submitDonation.isPending}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t("wizard.back")}
        </Button>
        <Button type="submit" disabled={submitDonation.isPending}>
          {submitDonation.isPending ? t("wizard.submitting") : t("wizard.submit")}
        </Button>
      </ButtonRow>
    </StepForm>
  );
}
