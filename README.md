# Heartbit

Pocket, the Heartbit website. Astro generates static HTML for GitHub Pages and Coolify. Commits to `main` are verified, built, and deployed to GitHub Pages.

## Local development

Use Node 24.13.1 (`nvm use` with nvm installed), then:

```sh
npm ci
npm run dev
```

Astro prints the local preview address. With Astro 7, the development server runs in the background; stop it with `npx astro dev stop`.

```sh
npm run verify
npm run preview
```

`verify` checks formatting and Astro/TypeScript, builds all pages, and checks generated internal links and anchors, navigation, metadata, assets, and deployment configuration. `dist/` is the complete static output. Do not publish `src/` or run a development server as the deployed site.

## Editing

- `docs/website-content-brief.md` and `docs/website-content-draft.md`: approved content direction and copy.
- `src/i18n/en.json` and `src/i18n/nl.json`: all English and Dutch copy, including career history, dates, capabilities, metadata, and accessibility labels. See [editing translations](docs/translations.md).
- `src/data/site.ts`: shared contact and asset URLs, and the optional LinkedIn destination. Set `linkedInUrl` only after the profile URL is confirmed; links then appear in contact areas and the footer.
- `src/views/`: shared Home, Experience, 3D printing, and 404 templates; `src/pages/` generates their language routes. Home brings together the introduction, capabilities, team approach, and contact. Experience includes career history, education, PDF viewing/downloading, and a collapsed application-renewal story. The printing page covers custom work and the feeding-pump holder example.
- `src/components/ContactLinks.astro`: direct email actions and the optional LinkedIn link.
- `src/styles/global.css`: shared Pocket palette, typography, and responsive layout.
- `src/components/PixelHeart.astro`: pixel logo and hero mark.

Fonts are bundled locally through Fontsource. No UI framework or form service is required. Contact links open the visitor's email client addressed to laurens.bolle@heartbit.be; printing enquiries include a subject. No messages or personal data are stored by the site. Navigation, email links, and the project-story disclosure work without JavaScript.

The public CV is stored at `public/cv/Laurens_Bolle_CV_2026_public.pdf`. Its URL is maintained in `src/data/site.ts`; career entries are in the translation files. Project photos are optional. Add separately branded shop links to the 3D-printing page only once the shops are live; there is no public coming-soon section or blog.

## Staging

Staging is live at https://heartbit-staging.46.225.75.37.sslip.io. See [Coolify setup](docs/coolify-staging.md) and [staging architecture](docs/staging-architecture.md). Build-time settings:

```sh
SITE_URL=https://heartbit-staging.46.225.75.37.sslip.io PUBLIC_SITE_ENV=staging npm run build
```

`PUBLIC_CONTACT_EMAIL` optionally overrides the public contact address. Staging builds include a `noindex, nofollow` robots meta tag. Coolify also adds the equivalent HTTP response header.

## Production

The default site origin is `https://heartbit.be`, with root-relative paths and trailing slashes. `public/CNAME` and `public/.nojekyll` are copied into the output for Pages compatibility. The root `index.html` is retained as the old production source; Astro builds only `src/pages/`, and only `dist/` is deployed.

GitHub Pages uses GitHub Actions as its publishing source. `.github/workflows/deploy.yml` runs only on `main`, verifies the production build, uploads `dist/`, and deploys through the `github-pages` environment. The custom domain remains `heartbit.be`. The separate check workflow validates changes on feature branches and pull requests, including staging output.

## Remaining content

- Supply the confirmed LinkedIn destination when available.
- Add approved project images if available.
- Review Pocket in desktop/mobile browsers and with keyboard navigation.
- Recheck staging HTTPS, static routing, and noindex headers after deployment changes.
