# Coolify staging

This describes the deployed configuration verified on 2026-09-06. For network boundaries and the deployment flow, see [Staging architecture](staging-architecture.md).

Staging is publicly accessible at **https://heartbit-staging.46.225.75.37.sslip.io**. Tailscale is required only for the Coolify dashboard. The generated hostname replaces the originally planned `staging.heartbit.be`; no Heartbit DNS records were changed.

## Application and build settings

| Setting                      | Value                                                  |
| ---------------------------- | ------------------------------------------------------ |
| Coolify version              | 4.3.17                                                 |
| Project / environment        | `Heartbit` / `staging`                                 |
| Application                  | `heartbit-staging`                                     |
| Application UUID             | `0n5mhtbtqgxadzjjnwxhx3eb`                             |
| Server / Docker network      | `localhost` / `coolify`                                |
| Repository                   | `https://github.com/heartbit-be/heartbit-be.github.io` |
| Source                       | Coolify's existing Public GitHub source                |
| Branch / revision            | `codex/pocket-website` / `HEAD`                        |
| Build pack                   | Nixpacks, static-site mode enabled                     |
| Base directory               | `/` (repository root)                                  |
| Install command              | `npm ci`                                               |
| Build command                | `npm run build`                                        |
| Publish directory            | `/dist`                                                |
| Static image / internal port | `nginx:alpine` / `80`                                  |
| SPA fallback                 | Disabled                                               |
| Automatic push deployment    | Enabled                                                |
| Pull-request previews        | Disabled                                               |
| HTTPS / force HTTPS          | Enabled                                                |
| Noindex domains              | `https://heartbit-staging.46.225.75.37.sslip.io`       |

There is one persistent staging application. It serves Astro's generated files through Nginx; it has no runtime Node server, SSR adapter, database, or persistent storage volume.

### Build-time environment

These values are application-specific Coolify environment variables, enabled at build time and disabled at runtime:

| Key                     | Value                                            |
| ----------------------- | ------------------------------------------------ |
| `SITE_URL`              | `https://heartbit-staging.46.225.75.37.sslip.io` |
| `PUBLIC_SITE_ENV`       | `staging`                                        |
| `NIXPACKS_NODE_VERSION` | `24.13.1`                                        |

The repository pins Node `24.13.1` in `.nvmrc`, and `package.json` requires Node `24.x`. The installed Nixpacks 1.41.0 resolves the requested version to its Node 24 package: **24.10.0** in the verified build. The same-major fallback is accepted for staging; inspect future build logs when changing the pin or build tooling. Coolify initially supplied a Node 22 override, which has been corrected for this application.

`SITE_URL` sets the staging canonical origin. `PUBLIC_SITE_ENV=staging` adds a robots meta tag; Coolify's noindex-domain setting separately adds `X-Robots-Tag: noindex, nofollow` at the proxy. Noindex discourages indexing but does not restrict public access.

## Automatic deployment

Pushing commits to `codex/pocket-website` triggers deployment through GitHub repository webhook `675434529`. It subscribes to `push` events and sends JSON over verified HTTPS to:

```text
https://heartbit-staging.46.225.75.37.sslip.io/_deploy/github
```

Nginx forwards that exact POST endpoint to Coolify's supported manual GitHub webhook handler. Coolify verifies the HMAC signature and matches the repository and branch. Pushes to `main` do not select this staging application. Commits marked `[skip ci]` or `[skip cd]` can suppress deployment under Coolify's webhook rules.

The shared webhook secret is stored in Coolify's application webhook settings and GitHub's webhook configuration. Keep it out of this repository, command output, and documentation. Public repository cloning requires no deploy key. API credentials used for administration are separate from the webhook secret.

The GitHub Actions check workflow validates the website separately; its successful completion is not a prerequisite enforced by this push webhook. Local, unpushed changes do not deploy.

## Operations and validation

In Coolify, open **Heartbit → staging → heartbit-staging** to inspect configuration and deployments. Verify the deployment's commit, rather than assuming the latest branch commit is already live. A failed build should be investigated in its deployment logs.

After changing build-time environment variables or Custom Nginx Configuration, use a forced rebuild if Coolify reuses an existing image for the same commit. A container restart alone does not rebuild static files or replace the Nginx configuration baked into the image.

Initial validation passed for commit `9488d6e7dfb33d233a4b51acfd2fc21ef730b347`:

- `npm ci` and `npm run build` succeeded with Node 24; Astro generated nine static pages.
- HTTPS presented a valid Let's Encrypt certificate for the generated hostname.
- The homepage, CSS, font files, favicon, `/services/`, and direct `/work/letter-generator/` requests returned HTTP 200.
- An unknown path returned HTTP 404 with the generated error page, not the homepage.
- The noindex response header and staging canonical origin were present.
- GitHub's webhook ping returned HTTP 200. Signed simulated push requests matched the feature branch and ignored `main`, with skip markers preventing test deployments. An invalid signature was rejected by the handler.
- Dashboard and API paths on the staging hostname returned 404.
- Production returned HTTP 200, and Coolify and Traefik health endpoints responded successfully.

These are the initial verification results, not a guarantee about future deployments. Coolify reported `running:unknown` for the application's container health status; the HTTP checks above independently verified serving behavior.

## Production boundary

Production remains at `https://heartbit.be` on GitHub Pages, publishing `main` from `/` with HTTPS enforced. The `heartbit.be` and `www.heartbit.be` DNS records and Pages publishing settings were not changed. The repository's `CNAME` file does not create an Nginx redirect.

If adopting a custom staging domain later, update the application domain, noindex-domain selection, build-time `SITE_URL`, and GitHub webhook URL together, then rebuild and repeat validation. Production migration is a separate task.
