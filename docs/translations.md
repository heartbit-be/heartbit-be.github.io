# Editing translations

All website copy lives in two files:

- `src/i18n/en.json` — English.
- `src/i18n/nl.json` — Dutch (written for a Belgian audience).

Each file has the same sections: `common`, `home`, `experience`, `printing`, and `notFound`. Edit the value beside a key to change the wording. For example, change `home.intro` for the introduction, `home.capabilities` for the service descriptions, or `experience.entries` for the career history. Navigation, buttons, page descriptions, email subjects, accessibility labels, and the interactive heart's messages are included too.

Keep the keys and array lengths in both files aligned. When adding a career entry or paragraph, add its counterpart to the other language. JSON strings use double quotes; use `\n` for a line break. The site renders these values as text, not HTML. Translation changes do not require editing templates.

Run `npm run verify` before committing. It checks matching translation keys, rendered copy in both languages, browser language selection, internal links, metadata, types, and the build. `npm run dev` lets you preview edits at `/en/` and `/nl/`.

## Language selection

- Each language has its own static pages: `/en/`, `/nl/`, and the corresponding `experience/`, `3d-printing/`, and `404/` routes.
- The original URLs (`/`, `/experience/`, `/3d-printing/`) remain working entry points. They select the visitor's saved choice, otherwise the first supported language in the browser's ordered preferences (`navigator.languages`). Regional variants such as `nl-BE` and `nl-NL` select Dutch. English is the fallback when no preference matches.
- The language picker keeps the current page, query string, and section anchor. A manual choice is saved locally in the browser. An explicit `/en/` or `/nl/` URL is always respected, including when following a shared link.
- If browser storage is unavailable, selection and navigation still work; the choice simply cannot be remembered across visits to the entry URLs.
- GitHub Pages serves static files, so automatic selection uses a small script in the page head. With JavaScript disabled, the original URLs show English and the language links still work. Both translated versions contain complete HTML, with their own `lang`, canonical, and alternate-language metadata.
- The root GitHub Pages 404 chooses a localized error page. Explicitly prefixed missing URLs retain their requested language; error pages are marked `noindex`.

The source PDF remains in English. Both languages link to the same file and label it accordingly. Shared addresses and asset URLs are in `src/data/site.ts`. If you add a Dutch CV later, update the asset selection and its translated labels together.
