# afriendlywave.com

A website for the Salt Spring listening space. We poll Mixcloud for new shows and rebuild the static Astro site when one is published. The [DJ tutorial](https://afriendlywave.com/dj-tutorial/) is a separate Slidev package deployed alongside Astro.

## Project guidance

See [AGENTS.md](AGENTS.md) for development conventions and [docs/identity.md](docs/identity.md) for visual identity guidance.

## Requirements

- Node.js 22.13+
- pnpm 11.15.1 (pinned in the root `package.json`)

## Development

Run from the repository root; both packages use the root workspace and lockfile:

```sh
pnpm install --frozen-lockfile
pnpm dev            # Astro: http://localhost:4322
pnpm dev:tutorial   # Slidev: http://localhost:3030 (separate terminal)
```

Astro development mode does not serve the tutorial. See [dj-tutorial/README.md](dj-tutorial/README.md) for slide editing.

## Build and preview

```sh
pnpm build              # Astro, then Slidev, then copy into dist/dj-tutorial/
pnpm preview:cloudflare # Combined output using Wrangler's local asset server
```

Open http://localhost:8787/ or http://localhost:8787/dj-tutorial/. Slide links use hashes, e.g. `/dj-tutorial/#/3`; no site-wide SPA fallback is needed. Tutorial assets stay under `/dj-tutorial/`.

`pnpm build:site` builds only Astro (and clears the tutorial from `dist/`). `pnpm preview` remains the Astro preview server; use the Cloudflare preview above to check deployment routing.

## Checks

```sh
pnpm check
pnpm exec playwright install chromium # First time; add --with-deps on Linux CI
pnpm test                             # Builds, checks rebuild cleanup, then browser tests
```

`pnpm test:build` checks generated output and repeated builds. `pnpm test:browser` tests the existing `dist/` with Wrangler: slide navigation, assets, Astro routes, and 404s. Builds fetch current Mixcloud data and require network access. To run the browser checks against a deployed preview instead:

```sh
TEST_BASE_URL=https://<preview-host> pnpm test:browser
```

## Deployment

The existing `afriendlywave` Cloudflare Worker serves `./dist` using `wrangler.jsonc`. No new Worker, domain, or DNS record is needed.

- `.github/workflows/rebuild.yml` installs with the frozen root lockfile, runs the combined `pnpm build`, and deploys with Wrangler. Its Mixcloud dispatch inputs and secret configuration are unchanged.
- Manual deployment from the repository root: `pnpm build && pnpm exec wrangler deploy`.
- Cloudflare Git-connected Workers Builds is also enabled (confirmed by the repository's Cloudflare check runs). Use repository root `/`, Node.js 22.13+ and pnpm 11.15.1, install `pnpm install --frozen-lockfile`, build `pnpm build`, and deploy `pnpm exec wrangler deploy`. Its actual dashboard commands and preview settings could not be inspected without Cloudflare authentication; verify them before release. They are not managed by this repository. Never deploy an Astro-only build, which would remove the tutorial.

Before production deployment, verify the combined output on a Cloudflare preview deployment if available, then verify https://afriendlywave.com/dj-tutorial/ after deployment. Local checks alone do not establish live success. Keep credentials in the existing secret stores.

`workers/mixcloud-poller/` retains its separate package installation and lockfile; it is not part of this workspace.
