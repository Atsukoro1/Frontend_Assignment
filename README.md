# GoodBoy — darovací formulář pro psí útulky 🐾

A multi-step donation form for the fictional **GoodBoy** foundation supporting Slovak dog
shelters, built as the GoodRequest frontend assignment. The whole UI is in Czech.

## What it does

- **3-step wizard**: choose the form of help (specific shelter / whole foundation) with a
  shelter picker and amount selection → personal details of one or more donors → review,
  GDPR consent and submit to the API.
- **Live stats** — collected amount and donor count, refetched every 30 s and on window
  focus, with a count-up animation.
- **Contact page** at `/kontakt` with (invented) foundation details.

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build (zero TS/ESLint errors)
pnpm lint
```

## Tech stack & decisions

| Choice                                          | Why                                                                                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 16 (App Router) + strict TypeScript** | Required stack; static pages, Metadata API for SEO.                                                                                                                                         |
| **TanStack Query**                              | All server state (`useShelters`, `useDonationStats`, `useSubmitDonation`); loading/error/empty states handled for every query, stats poll via `refetchInterval`.                            |
| **Zustand**                                     | Small typed store for wizard progress and the form draft (`src/features/donation/store.ts`). Nothing sensitive is persisted.                                                                |
| **react-hook-form + Zod**                       | One Zod schema per step + a merged schema mirroring the POST contract exactly (`schemas.ts`); the payload is re-validated against it right before submitting. Error messages are i18n keys. |
| **styled-components**                           | SWC transform + SSR registry per the Next docs; all design tokens live in a single typed theme (`src/styles/theme.ts`) — no magic hex values in components.                                 |
| **i18next / react-i18next**                     | Every user-facing string lives in `src/locales/cs/common.json`, keys structured by feature; translation keys are type-checked.                                                              |

The API layer (`src/api/`) is fully typed from the OpenAPI spec at
`https://frontend-assignment-api.goodrequest.dev/apidoc/` and is the only place that talks
to the network.

## Design

The component structure and step flow follow the official Figma assignment file
(Frontend Assignment 2.0): inline numbered stepper with check marks, segmented
help-type toggle, prominent centered amount input above the preset chips, flag
dropdown for the phone prefix, flat label/value summary rows on the confirmation
step and arrowed back/continue buttons.

The visual identity is deliberately custom (the Figma file's indigo-on-white
look was not copied):

- **Palette**: warm browns — cream background `#FAF6F1`, primary brown `#8C5E3C`,
  espresso headings `#3E2C22`, terracotta errors and muted green success, all chosen to
  pass WCAG AA on their backgrounds (cream-on-brown buttons ≈ 5.2:1).
- **Type**: Nunito (rounded terminals fit the friendly mood) via `next/font`, with the
  `latin-ext` subset for Czech diacritics.
- **Shape**: generous radii (cards 20–24 px, inputs 14 px, pills fully rounded) and soft
  diffuse shadows instead of hard borders.
- **Dog personality, lightly**: a paw favicon and OG image, and a gentle paw-drift
  animation on the success screen — content first.
- **Motion**: 150–300 ms ease-out transitions (step slide-in, hover lift, error enter),
  cream shimmer skeletons; everything respects `prefers-reduced-motion`.

## Nice-to-haves implemented

- **i18next** — no hardcoded UI strings in components.
- **Accessibility** — semantic HTML, label/input associations, `aria-describedby` +
  `aria-invalid` on errors, `role="alert"` for submit errors, focus moves to the step
  heading on navigation, visible focus rings, skip link, keyboard-operable custom
  controls (help-type cards and the flag/prefix selector are native radios; the shelter
  picker is a styled native `<select>`).
- **Responsive** — mobile-first from 360 px; breakpoints (480/768/1024) defined in the theme.
- **SEO** — per-route titles/descriptions via the Metadata API, `og:*` tags and a
  generated 1200×630 `og:image` (`next/og`).
- **Multiple donors (bonus)** — the personal-details step uses `useFieldArray`; a donor
  can be added/removed before submit and all donors are sent in the `contributors` array
  of a single contribution. UX choice: the first donor is always present, additional
  donors get numbered cards with a remove action.

## Edge cases covered

- Custom amount accepts a comma decimal separator (`12,5`); `0`, negatives and
  non-numbers are rejected with distinct messages.
- Switching the help type **keeps** the selected shelter deliberately — it stays valid as
  an optional choice for a general contribution (and required for a specific one).
- Shelter list failure shows an error with a retry button; stats failure degrades quietly.
- Double-submit prevention: the submit button is disabled while the mutation is pending.
- Server errors: human-readable API messages are shown verbatim; technical `joi.*`
  validation identifiers fall back to a generic Czech error banner.

## Assumptions

- The assignment marks the first name optional, but the live API rejects contributors
  without a non-empty `firstName` — **the API contract wins**, so the field is required
  (2–20 characters) in the UI.
- E-mail is required by the API → required in the UI. Phone is nullable in the API →
  optional, but validated (9-digit SK/CZ national number, sent as `+421…`/`+420…`) when
  filled.
- `metadataBase` falls back to `http://localhost:3000`; set `NEXT_PUBLIC_SITE_URL` for a
  real deployment (marked `TODO/ASSUMPTION` in `src/app/layout.tsx`).
- Contact details on `/kontakt` are invented placeholders.
