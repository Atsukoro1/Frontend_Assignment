"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Zod schemas store i18n keys as error messages; this resolves them to
 * Slovak text. Dynamic keys bypass the typed `t` overloads, hence the cast.
 */
export function useValidationMessage() {
  const { t } = useTranslation();

  return useCallback(
    (key: string | undefined): string | undefined =>
      key ? (t as unknown as (k: string) => string)(key) : undefined,
    [t],
  );
}
