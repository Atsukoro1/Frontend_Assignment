/** Supported dial prefixes — Slovakia and Czechia. */
export const PHONE_PREFIXES = [{ prefix: "+421" }, { prefix: "+420" }] as const;

export type PhonePrefix = (typeof PHONE_PREFIXES)[number]["prefix"];

export const DEFAULT_PHONE_PREFIX: PhonePrefix = "+421";

/**
 * National number for both +421 and +420: exactly 9 digits without a
 * leading zero (the trunk "0" is replaced by the dial prefix).
 */
const NATIONAL_NUMBER_RE = /^[1-9]\d{8}$/;

/** Strips spaces and common separators users paste into phone inputs. */
export function normalizeNationalNumber(raw: string): string {
  return raw.replace(/[\s/.-]/g, "");
}

export function isValidNationalNumber(raw: string): boolean {
  return NATIONAL_NUMBER_RE.test(normalizeNationalNumber(raw));
}

/** Builds the E.164-like value the API accepts, e.g. "+421903123456". */
export function toInternationalPhone(prefix: PhonePrefix, national: string): string {
  return `${prefix}${normalizeNationalNumber(national)}`;
}
