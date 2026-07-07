import { create } from "zustand";

import { DEFAULT_PHONE_PREFIX, type PhonePrefix } from "@/lib/phone";

import type { HelpType } from "./schemas";

export interface DonorDraft {
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: PhonePrefix;
  phoneNumber: string;
}

export function createEmptyDonor(): DonorDraft {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phonePrefix: DEFAULT_PHONE_PREFIX,
    phoneNumber: "",
  };
}

export const WIZARD_STEP_COUNT = 3;

interface DonationStore {
  step: number;
  helpType: HelpType | null;
  /**
   * Kept when the user switches the help type: a picked shelter stays
   * valid as an optional choice for the general contribution too.
   */
  shelterID: number | null;
  /** Raw user input — parsed (comma-friendly) only when building the payload. */
  amount: string;
  donors: DonorDraft[];
  saveHelpStep(values: { helpType: HelpType; shelterID: number | null; amount: string }): void;
  saveDonorsStep(donors: DonorDraft[]): void;
  /** Persists edits without advancing — used when navigating back. */
  updateDonors(donors: DonorDraft[]): void;
  goBack(): void;
  reset(): void;
}

const initialState = {
  step: 0,
  helpType: null,
  shelterID: null,
  amount: "",
} as const;

export const useDonationStore = create<DonationStore>()((set) => ({
  ...initialState,
  donors: [createEmptyDonor()],
  saveHelpStep: (values) =>
    set((state) => ({ ...values, step: Math.min(state.step + 1, WIZARD_STEP_COUNT - 1) })),
  saveDonorsStep: (donors) =>
    set((state) => ({ donors, step: Math.min(state.step + 1, WIZARD_STEP_COUNT - 1) })),
  updateDonors: (donors) => set({ donors }),
  goBack: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  reset: () => set({ ...initialState, donors: [createEmptyDonor()] }),
}));
