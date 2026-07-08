const eurFormatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatEur(value: number): string {
  return eurFormatter.format(value);
}

/**
 * Parses a user-entered amount, accepting a comma decimal separator
 * ("12,50") and thousands spaces. Returns `null` for anything that is
 * not a plain positive-or-zero number with at most two decimals.
 */
export function parseAmount(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
