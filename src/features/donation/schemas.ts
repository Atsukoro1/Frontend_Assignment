import { z } from "zod";

import { parseAmount } from "@/lib/currency";
import { isValidNationalNumber, PHONE_PREFIXES, type PhonePrefix } from "@/lib/phone";

/**
 * Validation schemas — one per wizard step plus a merged schema for the
 * final POST payload. Error messages are i18n keys resolved with `t()`
 * where the error is rendered.
 */

export const HELP_TYPES = ["shelter", "general"] as const;
export type HelpType = (typeof HELP_TYPES)[number];

export const AMOUNT_OPTIONS = [5, 10, 20, 30, 50, 100] as const;

const PHONE_PREFIX_VALUES = PHONE_PREFIXES.map((p) => p.prefix) as [PhonePrefix, ...PhonePrefix[]];

/**
 * Amount is validated on the field itself (not in the object-level
 * refinement) so the error shows even while other fields are invalid —
 * cross-field refinements only run once the base object parses.
 */
const amountSchema = z
  .string()
  .trim()
  .min(1, "validation.amountRequired")
  .superRefine((value, ctx) => {
    const parsed = parseAmount(value);
    if (parsed === null) {
      ctx.addIssue({ code: "custom", message: "validation.amountInvalid" });
    } else if (parsed <= 0) {
      ctx.addIssue({ code: "custom", message: "validation.amountPositive" });
    }
  });

/** Step 1 — form of help, shelter and amount (raw string, comma allowed). */
export const helpStepSchema = z
  .object({
    helpType: z.enum(HELP_TYPES, { error: "validation.helpType" }),
    shelterID: z.number().int().positive().nullable(),
    amount: amountSchema,
  })
  .superRefine((data, ctx) => {
    // Runs only when the base object parses, i.e. a help type is chosen.
    if (data.helpType === "shelter" && data.shelterID === null) {
      ctx.addIssue({ code: "custom", path: ["shelterID"], message: "validation.shelterRequired" });
    }
  });

export type HelpStepValues = z.infer<typeof helpStepSchema>;

/**
 * Single donor. The assignment marks the first name optional, but the API
 * rejects contributors without a non-empty `firstName`, so the API contract
 * wins and the field is required (see README).
 */
export const donorSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "validation.firstNameRequired")
    .min(2, "validation.firstNameLength")
    .max(20, "validation.firstNameLength"),
  lastName: z
    .string()
    .trim()
    .min(1, "validation.lastNameRequired")
    .min(2, "validation.lastNameLength")
    .max(30, "validation.lastNameLength"),
  email: z.string().trim().min(1, "validation.emailRequired").pipe(
    z.email({ error: "validation.emailInvalid" }),
  ),
  phonePrefix: z.enum(PHONE_PREFIX_VALUES),
  /** Optional — validated only when the user typed something. */
  phoneNumber: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidNationalNumber(value), "validation.phoneInvalid"),
});

export type DonorValues = z.infer<typeof donorSchema>;

/** Step 2 — one or more donors. */
export const donorsStepSchema = z.object({
  donors: z.array(donorSchema).min(1),
});

export type DonorsStepValues = z.infer<typeof donorsStepSchema>;

/** Step 3 — GDPR consent. */
export const consentStepSchema = z.object({
  consent: z.boolean().refine((value) => value, "validation.consentRequired"),
});

export type ConsentStepValues = z.infer<typeof consentStepSchema>;

/**
 * Merged schema of the final POST payload, mirroring the API contract of
 * POST /api/v1/shelters/contribute. The payload is validated against it
 * once more right before submitting.
 */
export const contributeRequestSchema = z.object({
  contributors: z
    .array(
      z.object({
        firstName: z.string().min(2).max(20),
        lastName: z.string().min(2).max(30),
        email: z.email(),
        phone: z
          .string()
          .regex(/^\+42[01][1-9]\d{8}$/)
          .nullable(),
      }),
    )
    .min(1),
  shelterID: z.number().int().positive().nullable(),
  value: z.number().positive(),
});

export type ContributeRequestValues = z.infer<typeof contributeRequestSchema>;
