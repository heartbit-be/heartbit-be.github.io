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

`verify` checks Astro/TypeScript, builds all pages, and checks generated internal links, metadata, assets, and deployment configuration. `dist/` is the complete static output. Do not publish `src/` or run a development server as the deployed site.

## Editing

- `src/content/projects/`: Markdown project writeups with a typed schema in `src/content.config.ts`.
- `src/data/site.ts`: service descriptions, contact address, and future store destinations. Set a shop's `url` when it launches.
- `src/pages/`: homepage, About, Services, Shops, Contact, Work, and 404 pages.
- `src/styles/global.css`: shared Pocket palette, typography, and responsive layout.
- `src/components/PixelHeart.astro`: pixel logo and hero mark.

Fonts are bundled locally through Fontsource. No UI framework or form service is required. Contact prepares an email draft addressed to laurens.bolle@heartbit.be, which the visitor reviews and sends through their email client. No messages or personal data are stored by the site.

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

- Review the provisional biography, service descriptions, and two initial project writeups.
- Add approved project images and any further work worth showing.
- Review Pocket in desktop/mobile browsers and with keyboard navigation.
- Recheck staging HTTPS, static routing, and noindex headers after deployment changes.
- Set up the production deployment workflow when the redesign is approved.
