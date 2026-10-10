# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Kawan Sehat** is a student team's entry for the UI/UX Competition IT CAS 2026 (theme: accessible, inclusive digital spaces).

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

Only a few things must stay identical across profiles: the logo, the "Tampilan" and "119" header buttons, Piko's position, and the order of the queue-booking steps.

**Routing & focus.** `src/router.jsx` lazy-loads every page under `components/Layout.jsx`. On each route change, Layout scrolls to top, focuses `main h1`, and announces `document.title` in a live region. Every page must:
- call `useJudulHalaman(judul)`;
- render exactly one `<h1>`.

**CSS loading order matters.** `main.jsx` imports `tokens.css` and `base.css` first. Page CSS ships inside lazily loaded route chunks, so a page's CSS only exists after that page has been visited. Styles shared across pages belong in `base.css` or in a component's own CSS file (e.g. `listen-button.css`), never in a page's CSS.

**Mascot tour.** `src/tour/TourProvider.jsx` and `MascotTour.jsx` run the tour. It is a **per-page guide**: it explains the page that is currently open and never navigates away.
- Steps live in `src/tour/steps.js` in `PANDUAN`, keyed by page (`halamanPanduan(pathname)` maps routes to keys; Beranda has one list per profile). Every page ends with the shared steps `menu`, `piko`, `ganti-tampilan` and `darurat`.
- Each step points at a `[data-tour="..."]` element on that page. When the tour opens, steps whose target is missing or hidden are skipped, so one list can cover profile variants and states (no result yet, no ticket). A new page feature that deserves a step needs both a `data-tour` attribute and an entry in its page list.
- `judul`/`teks` are plain strings or per-profile variants resolved with `pilih()`; `profil: [...]` limits a step to some profiles.
- Each step is a React Aria modal dialog with a spotlight cut-out and a tail pointing at the target, placed by `hitungPosisi()`: as a bottom sheet on mobile, otherwise beside or above/below the target.
- The Beranda tour is offered once, after onboarding (`navigate('/beranda', { state: { tawarTur: true } })`).
- **Piko** (Pemandu Informasi Kesehatan Optimal) is the mascot and the help entry point on every page except onboarding (`src/piko/TombolPiko.jsx`). Below 900 px it sits raised in the middle of the bottom nav (Layout inserts it as the 3rd `<li>`, using `useLayarSempit()`); from 900 px it floats bottom-right, outside the header (the header's `backdrop-filter` would trap a fixed child). Its label is "Piko" ("Bantuan" for `lansia`).
- Pressing Piko opens a React Aria `Menu` in a `Popover` with two chat bubbles: **Lihat Panduan** runs `useTur().mulai()`; **Tanya Piko** opens the chat. The chosen action runs only after the popover has closed and focus has returned to Piko, so closing the tour or chat restores focus there.

**Tanya Piko (chat).** `src/piko/PikoProvider.jsx` holds the chat state (wrapped inside `TourProvider` in Layout) and renders `TanyaPiko.jsx`: a bottom sheet below 900 px, a bottom-right panel above.
- Answers come from `tanyaPiko({ teks, profil })` in `src/piko/jawab.js`, the single seam for the AI that comes later (`/api/tanya-piko`). For now it matches keywords and routes to existing pages that cite sources, covered by `jawab.test.js`. The UI says it is a sample version.
- Same rule as nutrition: answers never contain health numbers. Emergency keywords are checked first and return `darurat: true` (the UI then shows a `tel:119` button). Diagnosis, prescription and dose questions are declined.
- `anak` can only tap the preset questions in `SARAN` (no free text); `anak`/`remaja` are never sent to calorie targets.
- History lives in memory only: it survives route changes, not reloads, and is never written to storage. Replies are read aloud when `suara` is on.

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
