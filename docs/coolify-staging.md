# Coolify staging handoff

Repository: `https://github.com/heartbit-be/heartbit-be.github.io`

Branch: `codex/pocket-website`

Application: `heartbit-staging`

| Setting                         | Value                              |
| ------------------------------- | ---------------------------------- |
| Domain                          | `https://staging.heartbit.be`      |
| Build pack                      | Nixpacks, static-site mode enabled |
| Base directory                  | `/` (the repository root)          |
| Install command                 | `npm ci`                           |
| Build command                   | `npm run build`                    |
| Publish directory               | `/dist`                            |
| Internal port                   | `80`                               |
| SPA fallback                    | Disabled                           |
| Node                            | `24.13.1` (see `.nvmrc`)           |
| Build-time `SITE_URL`           | `https://staging.heartbit.be`      |
| Build-time `PUBLIC_SITE_ENV`    | `staging`                          |
| Optional `PUBLIC_CONTACT_EMAIL` | `laurens.bolle@heartbit.be`        |

Use the same Node major if the installed Nixpacks provider does not honor the patch pin. Confirm the selected version in build logs. There is no SSR adapter, database, storage volume, or runtime Node server.

Connect the Heartbit repository using the appropriate GitHub integration or deploy key. Enable push-triggered deployment for the feature branch only. The source checkout's CI workflow runs checks and has no production deployment permissions.

Point only `staging.heartbit.be` at the VPS, enable HTTPS, and add `X-Robots-Tag: noindex, nofollow` through supported application-level configuration. Keep `heartbit.be` and `www.heartbit.be` and their production GitHub Pages configuration unchanged. The `CNAME` static file does not redirect requests on Nginx.

Serve directory index files for routes such as `/services/` and `/work/letter-generator/`. Use `404.html` for the error page while retaining HTTP status 404; do not fall back to the homepage for missing routes.

After deployment, check HTTPS, the current commit, static assets, direct visits to nested routes, an unknown URL returning 404, the noindex response header, and the existing production homepage. Staging has not been configured by the local website implementation task.
