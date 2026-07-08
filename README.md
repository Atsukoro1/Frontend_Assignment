# GoodBoy — darovací formulář pro psí útulky 🐾

Vícekrokový darovací formulář pro (fiktivní) nadaci **GoodBoy**, která podporuje slovenské
psí útulky. Vypracováno jako frontend assignment pro GoodRequest. Celé UI je v češtině.

## Co to umí

- **Wizard o 3 krocích**: výběr formy pomoci (konkrétní útulek / celá nadace) s výběrem
  útulku a částky → osobní údaje jednoho či více dárců → rekapitulace, souhlas se
  zpracováním osobních údajů a odeslání na API.
- **Živé statistiky** — vybraná částka a počet dárců, refetch každých 30 s a při fokusu
  okna, s count-up animací.
- **Kontaktní stránka** na `/kontakt` s (vymyšlenými) údaji nadace.

## Jak to spustit

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # produkční build (bez TS/ESLint chyb)
pnpm lint
```

## Technologie a rozhodnutí

| Volba                                           | Proč                                                                                                                                                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 16 (App Router) + strict TypeScript** | Požadovaný stack; statické stránky, Metadata API pro SEO.                                                                                                                                          |
| **TanStack Query**                              | Veškerý server state (`useShelters`, `useDonationStats`, `useSubmitDonation`); každý dotaz má ošetřený loading/error/empty stav, statistiky se dotahují přes `refetchInterval`.                    |
| **Zustand**                                     | Malý typovaný store pro průchod wizardem a rozpracovaný formulář (`src/features/donation/store.ts`). Nic citlivého se nepersistuje.                                                                |
| **react-hook-form + Zod**                       | Jedno Zod schéma na krok + sloučené schéma přesně kopírující POST kontrakt (`schemas.ts`); payload se proti němu validuje ještě jednou těsně před odesláním. Chybové hlášky jsou i18n klíče.       |
| **styled-components**                           | SWC transform + SSR registry podle Next dokumentace; všechny design tokeny žijí v jednom typovaném theme (`src/styles/theme.ts`) — žádné magické hexy v komponentách.                              |
| **i18next / react-i18next**                     | Každý uživatelský string je v `src/locales/cs/common.json`, klíče strukturované podle feature; překladové klíče jsou typově kontrolované.                                                          |

API vrstva (`src/api/`) je plně otypovaná podle OpenAPI specifikace na
`https://frontend-assignment-api.goodrequest.dev/apidoc/` a je to jediné místo, které
komunikuje se sítí.

## Design

Struktura komponent a flow kroků vychází z oficiálního Figma souboru zadání
(Frontend Assignment 2.0): inline číslovaný stepper s fajfkami, segmentovaný přepínač
formy pomoci, výrazný vycentrovaný input částky nad preset chipy, dropdown s vlajkou
pro telefonní předvolbu, ploché label/value řádky v rekapitulaci a tlačítka zpět/pokračovat
se šipkami.

Vizuální identitu jsem si záměrně udělal vlastní (indigovo-bílý look z Figmy jsem
nekopíroval):

- **Paleta**: teplé hnědé — krémové pozadí `#FAF6F1`, primární hnědá `#8C5E3C`, espresso
  nadpisy `#3E2C22`, terakotové chyby a tlumená zelená pro úspěch; vše zvolené tak, aby
  na svém pozadí prošlo WCAG AA (krémová na hnědých tlačítkách ≈ 5,2:1).
- **Písmo**: Nunito (zaoblené ukončení tahů sedí k přátelské náladě) přes `next/font`,
  se subsetem `latin-ext` kvůli české diakritice.
- **Tvary**: velkorysé radiusy (karty 20–24 px, inputy 14 px, pilulky plně kulaté) a měkké
  rozptýlené stíny místo tvrdých rámečků.
- **Psí osobnost, ale s mírou**: tlapka ve favikoně a OG obrázku, jemná animace
  poletujících tlapek na success obrazovce — obsah má přednost.
- **Motion**: 150–300 ms ease-out přechody (slide-in kroků, hover lift, objevení chyby),
  krémové shimmer skeletony; všechno respektuje `prefers-reduced-motion`.

## Implementovaná nice-to-have kritéria

- **i18next** — žádné natvrdo zadrátované stringy v komponentách.
- **Accessibility** — sémantické HTML, provázání labelů s inputy, `aria-describedby` +
  `aria-invalid` u chyb, `role="alert"` pro chyby odeslání, fokus se při navigaci přesouvá
  na nadpis kroku, viditelné focus ringy, skip link, custom ovládací prvky obsluhovatelné
  klávesnicí (karty formy pomoci a výběr vlajky/předvolby jsou nativní radia; výběr útulku
  je stylovaný nativní `<select>`).
- **Responzivita** — mobile-first od 360 px; breakpointy (480/768/1024) definované v theme.
- **SEO** — titles/descriptions pro jednotlivé routy přes Metadata API, `og:*` tagy a
  generovaný 1200×630 `og:image` (`next/og`).
- **Více dárců (bonus)** — krok s osobními údaji používá `useFieldArray`; dárce jde před
  odesláním přidat/odebrat a všichni se posílají v poli `contributors` jednoho příspěvku.
  UX volba: první dárce je vždy přítomný, další dostanou číslované karty s možností
  odebrání.

## Ošetřené edge casy

- Vlastní částka akceptuje čárku jako desetinný oddělovač (`12,5`); `0`, záporné hodnoty
  a nečísla se odmítají s rozlišenými hláškami.
- Přepnutí formy pomoci vybraný útulek **záměrně nechává** — zůstává platný jako
  nepovinná volba u obecného příspěvku (a povinná u konkrétního).
- Selhání načtení útulků ukáže chybu s tlačítkem pro opakování; selhání statistik
  degraduje potichu.
- Ochrana proti dvojímu odeslání: submit tlačítko je během běžící mutace disabled.
- Chyby ze serveru: lidsky čitelné hlášky z API se zobrazují tak, jak přišly; technické
  `joi.*` validační identifikátory padají na obecný český error banner.

## Předpoklady

- Zadání uvádí jméno jako nepovinné, ale živé API odmítá contributors bez neprázdného
  `firstName` — **API kontrakt vyhrává**, takže pole je v UI povinné (2–20 znaků).
- E-mail je na API povinný → povinný i v UI. Telefon je v API nullable → nepovinný, ale
  když je vyplněný, validuje se (9místné SK/CZ národní číslo, odesílá se jako
  `+421…`/`+420…`).
- `metadataBase` padá na `http://localhost:3000`; pro reálný deploy nastavte
  `NEXT_PUBLIC_SITE_URL` (označeno `TODO/ASSUMPTION` v `src/app/layout.tsx`).
- Kontaktní údaje na `/kontakt` jsou vymyšlené placeholdery.
