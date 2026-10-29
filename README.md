# afriendlywave.com

A website for the Salt Spring listening space. We poll Mixcloud for new shows and rebuild the static Astro site when one is published. The [DJ tutorial](https://afriendlywave.com/dj-tutorial/) is an Astro-native deck within the shared site layout, including the header, footer, and Mixcloud player.

## Project guidance

See [AGENTS.md](AGENTS.md) for development conventions and [docs/identity.md](docs/identity.md) for visual identity guidance. See [docs/dj-tutorial.md](docs/dj-tutorial.md) for tutorial editing and navigation.

## Requirements

- Node.js 22.13+
- pnpm 11.15.1 (pinned in the root `package.json`)

## Development

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev # http://localhost:4322
```

The same Astro server serves the tutorial at http://localhost:4322/dj-tutorial/. There is no separate tutorial package or development command. Slide links use hashes, e.g. `/dj-tutorial/#slide-3`, and work on refresh and with browser Back/Forward without a server fallback route.

## Build and preview

```sh
pnpm build              # astro build; the complete site goes into dist/
pnpm preview            # Astro preview of dist/ (use the URL printed in the terminal)
# Alternatively, check Cloudflare static-asset routing:
pnpm preview:cloudflare # http://localhost:8787/dj-tutorial/
```

Tutorial images and logos live in `public/dj-tutorial/` and are served under `/dj-tutorial/`; fonts are shared under `/fonts/`. Astro bundles scripts and styles under `/_astro/`. No separate deck build or copy step is needed.

## Checks

```sh
pnpm check
pnpm exec playwright install chromium # First time; add --with-deps on Linux CI
pnpm test                             # Builds, checks rebuild cleanup, then browser tests
```

`pnpm test:build` checks generated pages, the native eleven-slide deck, shared layout and bundled assets, absence of presenter/notes pages, and removal of deleted public assets on rebuild. `pnpm test:browser` tests the existing `dist/` with Wrangler: slide navigation, deep links, assets, responsive behaviour, existing site routes, and 404s. Browser checks suppress Cloudflare's third-party analytics script; tutorial assets load normally. Builds fetch current Mixcloud data and require network access. To run browser checks against a deployed preview instead:

```sh
TEST_BASE_URL=https://<preview-host> pnpm test:browser
```

## Deployment

The existing `afriendlywave` Cloudflare Worker serves `./dist` using `wrangler.jsonc`. No new Worker, domain, DNS record, or SPA fallback is needed.

- `.github/workflows/rebuild.yml` installs with the frozen root lockfile, runs `pnpm build`, and deploys with Wrangler. Its Mixcloud dispatch inputs and secret configuration are unchanged.
- Manual deployment from the repository root: `pnpm build && pnpm exec wrangler deploy`.
- Cloudflare Git-connected Workers Builds is also enabled (confirmed by the repository's Cloudflare check runs). Use repository root `/`, Node.js 22.13+ and pnpm 11.15.1, install `pnpm install --frozen-lockfile`, build `pnpm build`, and deploy `pnpm exec wrangler deploy`. Dashboard commands and preview settings are not managed by this repository; verify them before release.

Before production deployment, verify the output on a Cloudflare preview deployment if available, then verify https://afriendlywave.com/dj-tutorial/ after deployment. Local checks alone do not establish live success. Keep credentials in the existing secret stores.

`workers/mixcloud-poller/` retains its separate package installation and lockfile; it is not part of the root installation.
