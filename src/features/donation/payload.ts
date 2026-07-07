import { parseAmount } from "@/lib/currency";
import { toInternationalPhone } from "@/lib/phone";

import { contributeRequestSchema, type ContributeRequestValues, type HelpType } from "./schemas";
import type { DonorDraft } from "./store";

interface PayloadInput {
  helpType: HelpType | null;
  shelterID: number | null;
  amount: string;
  donors: DonorDraft[];
}

/**
 * Merges the wizard state into the POST payload and validates it against
 * the API-contract schema. Returns `null` when the state is incomplete —
 * the wizard steps should have caught that already.
 */
export function buildContributePayload(input: PayloadInput): ContributeRequestValues | null {
  const value = parseAmount(input.amount);
  if (value === null) {
    return null;
  }

  const candidate = {
    contributors: input.donors.map((donor) => ({
      firstName: donor.firstName.trim(),
      lastName: donor.lastName.trim(),
      email: donor.email.trim(),
      phone:
        donor.phoneNumber.trim() === ""
          ? null
          : toInternationalPhone(donor.phonePrefix, donor.phoneNumber),
    })),
    shelterID: input.shelterID,
    value,
  };

  const parsed = contributeRequestSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}
