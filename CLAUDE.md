# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Kawal Sehat** is a student team's entry for the UI/UX Competition IT CAS 2026 (theme: accessible, inclusive digital spaces).

It is a responsive health website with two independent layers of adaptation:
- an **age profile** (`anak` / `remaja` / `dewasa` / `lansia`), which changes illustrations, palette, copy tone and page layouts;
- **accessibility preferences** (text size, high contrast, text-to-speech, BISINDO sign-language slots, simplified view, reduced motion), which combine with any profile.

UI copy, identifiers, comments and file names are written in Indonesian. Keep that convention.

Competition deliverables live alongside the app:
- `docs/konsep.md`: concept and problem background, with cited sources.
- `public/docs/user-flow.html`: Mermaid diagrams, loaded from the CDN at a pinned version.
- `public/docs/wireframe.html`: low-fi wireframes in plain HTML/CSS.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # production build → dist/
npm run preview    # serve dist/ on http://localhost:4173 (needed by the a11y audit)
npm run lint       # ESLint incl. eslint-plugin-jsx-a11y (must stay at 0 errors)
npm test           # Vitest (nutrition logic)
npx vitest run src/lib/gizi.test.js -t "IMT dewasa"   # single test / describe block

# Accessibility audit: pa11y-ci with axe + HTML_CodeSniffer over every route × profile (.pa11yci.json).
# Requires `npm run preview` running. Puppeteer's Chrome download was skipped, so point it at a local Chrome:
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome npm run a11y
```

Demo/test URLs accept query params that override preferences on load. For example:
`/beranda?profil=lansia&teks=sangat-besar&kontras=ya&isyarat=ya&gerak=ya`

These params are parsed in `PrefsProvider.muat()`.

## Architecture

**Preference pipeline.** This is the core idea; read it before touching styles.
1. Preferences are stored in `localStorage['ks-prefs']`.
2. An inline script in `index.html` copies them to `data-*` attributes on `<html>` before first paint.
3. `src/prefs/PrefsProvider.jsx` owns the state and keeps those attributes in sync in a `useLayoutEffect`.
4. `src/styles/tokens.css` redefines CSS custom properties per `[data-profil]`, `[data-teks]`, `[data-kontras]`, and so on. Components only use tokens.
5. Profile switches run inside `document.startViewTransition` unless motion is reduced.

Selecting a profile applies `PRESET[profil]` from `src/prefs/presets.js`. For example, `lansia` turns on large text, speech and simplified view.

**Per-profile content.** Use these tools in order of how much they change:
- `usePrefs().pilih({ anak, remaja, dewasa, lansia, semua })` for copy variants;
- `<ForProfile only={[...]}>` for conditional blocks;
- separate layout components when the structure differs, such as `pages/beranda/Beranda{Anak,Remaja,Dewasa,Lansia}.jsx` and `VARIAN_DBD` in `src/content/topik/dbd.jsx`.

Only a few things must stay identical across profiles: the logo, the "Tampilan" and "119" header buttons, and the order of the queue-booking steps.

**Routing & focus.** `src/router.jsx` lazy-loads every page under `components/Layout.jsx`. On each route change, Layout scrolls to top, focuses `main h1`, and announces `document.title` in a live region. Every page must:
- call `useJudulHalaman(judul)`;
- render exactly one `<h1>`.

**CSS loading order matters.** `main.jsx` imports `tokens.css` and `base.css` first. Page CSS ships inside lazily loaded route chunks, so a page's CSS only exists after that page has been visited. Styles shared across pages belong in `base.css` or in a component's own CSS file (e.g. `listen-button.css`), never in a page's CSS.

**Mascot tour.** `src/tour/TourProvider.jsx` and `MascotTour.jsx` run the tour.
- Steps live in `src/tour/steps.js`, one set per profile. Each step points at `[data-tour="..."]` targets: `menu`, `ganti-tampilan`, `darurat`, `dengarkan` and `aksi-utama`.
- Every Beranda variant must render the targets its profile's steps use.
- Each step is a React Aria modal dialog with a spotlight cut-out, placed by `hitungPosisi()`: as a bottom sheet on mobile, otherwise beside or above/below the target.
- The tour is offered once, after onboarding (`navigate('/beranda', { state: { tawarTur: true } })`), and can be replayed from any page except onboarding via the floating Si Kawal button with a "Lihat Panduan" chat bubble (`components/TombolPanduan.jsx`, bottom-right). On mobile it sits above the bottom nav, using `--tinggi-nav`, which Layout measures. `mulai()` navigates to `/beranda` and waits for `[data-tour="aksi-utama"]` before opening, because routes are lazy-loaded.

**Nutrition (`/cek-gizi/*`).** The rule here: **never invent health numbers.**
- `src/lib/gizi.js` holds pure functions, covered by `gizi.test.js`.
- Data files in `src/data/` (`akg-2019.js`, `who-imt-u.js`, `makanan.js`, `batas-ggl.js`) are transcribed from official sources listed in `src/data/sumber.js`. UI pages cite them through `<Sumber ids={[...]} />`.
- `nilaiStatusGizi` chooses the method by age:
  - under 5 years → refer to the KIA book;
  - 5 y 1 m to 18 y 11 m → BMI-for-age z-score (WHO 2007 LMS table, Permenkes 2/2020 cut-offs);
  - 19 years and over → Indonesian adult BMI categories.
- Child and teen modes intentionally hide calorie targets.
- Food values are PGS-2014 exchange units. Fried items add 1 tsp oil and carry `perkiraan: true`; seasonings carry `hanyaNatrium: true`.

**Persistence.** Read and write only through `src/lib/simpan.js`, which wraps everything in try/catch. All data stays on the device. Keys:

| Key | Holds |
|---|---|
| `ks-prefs` | Preferences |
| `ks-data-diri` | Sex/age reused across nutrition tools |
| `ks-piringku` | Today's food log |
| `ks-tiket` | Queue ticket |
| `ks-obat`, `ks-obat-minum` | Medication reminders |
| `ks-lencana` | Kids' badges |

**Speech & sign language.** `src/lib/suara.js` wraps the Web Speech API (`id-ID`). `ListenButton` reads `h1, h2, h3, p, li, [data-baca]` inside a target and highlights each element as it is read. Mark UI chrome with `data-tidak-dibaca` so it is skipped. `SignVideo` is a clearly labelled placeholder plus transcript, shown only when `isyarat` is on.

## Accessibility conventions (scored by the competition)

- Build interactive widgets with **React Aria Components**: dialogs, radio/checkbox groups, switches. Style them through their `data-selected` / `data-focus-visible` / `data-invalid` attributes.
- Styled lists keep `role="list"`, because Safari drops list semantics under `list-style: none`. ESLint is configured to allow this.
- `autoFocus` is allowed only on RAC buttons inside dialogs.
- Never convey state by colour alone. Switches show "Aktif/Mati", and GGL bars print "melebihi batas".
- New colour pairs must keep ≥ 4.5:1 contrast (≥ 7:1 for `lansia` and `kontras`).
- Layouts must not scroll horizontally at 360 px wide, even with `teks=sangat-besar`. The usual fix is `min-width: 0` on grid/flex children.
- Form errors are linked with `aria-describedby` (or RAC `FieldError`). After a failed submit, move focus to the first invalid field.
