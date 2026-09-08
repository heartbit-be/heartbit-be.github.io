# Heartbit

Pocket, the next Heartbit website. Astro generates static HTML for GitHub Pages and Coolify. The existing production website remains on `main` while this branch is developed.

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
- `src/data/site.ts`: capability descriptions, contact address, and the optional LinkedIn destination. Set `linkedInUrl` only after the profile URL is confirmed; links then appear in contact areas and the footer.
- `src/pages/`: Home, Experience, 3D printing, and 404 pages. Home brings together the introduction, capabilities, team approach, and contact. Experience includes CV/history placeholders and a collapsed application-renewal story. The printing page covers custom work and the feeding-pump holder example.
- `src/components/ContactLinks.astro`: direct email actions and the optional LinkedIn link.
- `src/styles/global.css`: shared Pocket palette, typography, and responsive layout.
- `src/components/PixelHeart.astro`: pixel logo and hero mark.

Fonts are bundled locally through Fontsource. No UI framework or form service is required. Contact links open the visitor's email client addressed to laurens.bolle@heartbit.be; printing enquiries include a subject. No messages or personal data are stored by the site. Navigation, email links, and the project-story disclosure work without JavaScript.

The CV controls are disabled placeholders until a real CV is supplied. Add the approved file under `public/`, replace the controls in `src/pages/experience.astro` with view/download links, and replace the clearly marked career placeholders with CV-backed entries. Project photos are optional. Add separately branded shop links to the 3D-printing page only once the shops are live; there is no public coming-soon section or blog.

## Staging

Staging is live at https://heartbit-staging.46.225.75.37.sslip.io. See [Coolify setup](docs/coolify-staging.md) and [staging architecture](docs/staging-architecture.md). Build-time settings:

```sh
SITE_URL=https://heartbit-staging.46.225.75.37.sslip.io PUBLIC_SITE_ENV=staging npm run build
```

`PUBLIC_CONTACT_EMAIL` optionally overrides the public contact address. Staging builds include a `noindex, nofollow` robots meta tag. Coolify also adds the equivalent HTTP response header.

## Production

The default site origin is `https://heartbit.be`, with root-relative paths and trailing slashes. `public/CNAME` and `public/.nojekyll` are copied into the output for Pages compatibility. The existing root `index.html` is retained as the old production source during this initial implementation; Astro builds only `src/pages/`.

The check workflow only validates code. It cannot deploy to GitHub Pages. At launch, configure GitHub Pages to use a build-and-deploy Actions workflow restricted to `main`, and publish the generated `dist/` artifact. Do not switch the live publishing source to this feature branch.

## Before launch

- Supply the real CV, career entries, and confirmed LinkedIn destination when available.
- Add approved project images if available.
- Review Pocket in desktop/mobile browsers and with keyboard navigation.
- Recheck staging HTTPS, static routing, and noindex headers after deployment changes.
- Set up the production deployment workflow when the redesign is approved.
