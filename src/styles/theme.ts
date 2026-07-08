/**
 * Design tokens for the GoodBoy theme.
 *
 * Warm, brown-based palette — the UI should feel like a cozy shelter.
 * All colors are chosen to keep WCAG AA contrast on their intended
 * backgrounds (e.g. `textOnPrimary` on `primary` is ~5.2:1).
 */
export const theme = {
  colors: {
    /** Warm cream page background. */
    background: "#FAF6F1",
    /** Slightly deeper latte tone for alternating sections. */
    backgroundAlt: "#F3EBE2",
    /** White cards sitting on the cream background. */
    surface: "#FFFFFF",
    /** Soft beige for muted surfaces (summary rows, hints). */
    surfaceMuted: "#F5EEE5",
    /** Low-contrast warm border. */
    border: "#E4D7C7",
    /** Stronger border for interactive elements. */
    borderStrong: "#C9B49E",

    /** Rich medium brown — primary brand color. */
    primary: "#8C5E3C",
    /** Darker brown for hover/active states. */
    primaryHover: "#74492C",
    /** Tinted brown background for selected states. */
    primarySoft: "#F3E7DB",
    /** Cream text on primary buttons. */
    textOnPrimary: "#FDF9F4",

    /** Espresso headings. */
    heading: "#3E2C22",
    /** Dark warm body text. */
    text: "#4E342E",
    /** Muted brown-gray for secondary text. */
    textMuted: "#6F5A4B",

    /** Muted green, harmonized with the brown palette. */
    success: "#4E7C4A",
    successSoft: "#E9F0E4",
    /** Warm terracotta for errors — no pure red. */
    error: "#B4533A",
    errorSoft: "#F9EAE4",

    /** Focus ring color. */
    focus: "#A9744F",
  },
  fonts: {
    body: "var(--font-nunito), 'Segoe UI', system-ui, sans-serif",
    heading: "var(--font-nunito), 'Segoe UI', system-ui, sans-serif",
  },
  fontSizes: {
    xs: "0.8125rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.375rem",
    xxl: "1.75rem",
    display: "2.25rem",
  },
  radii: {
    sm: "10px",
    md: "14px",
    lg: "20px",
    xl: "24px",
    pill: "999px",
  },
  space: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  shadows: {
    sm: "0 2px 10px rgba(62, 44, 34, 0.06)",
    md: "0 8px 30px rgba(62, 44, 34, 0.10)",
    lg: "0 18px 50px rgba(62, 44, 34, 0.14)",
  },
  transitions: {
    fast: "150ms ease-out",
    base: "220ms ease-out",
  },
  breakpoints: {
    sm: "480px",
    md: "768px",
    lg: "1024px",
  },
} as const;

export type AppTheme = typeof theme;

/** Mobile-first media query helpers: `${media.md} { … }`. */
export const media = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
} as const;

/** Max-width counterparts for below-breakpoint rules. */
export const mediaMax = {
  sm: `@media (max-width: ${parseInt(theme.breakpoints.sm, 10) - 1}px)`,
} as const;
