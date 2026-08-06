# afriendlywave.com

Astro 7 static site for [afriendlywave.com](https://afriendlywave.com) — a landing page with a Mixcloud show grid and audio player widget. Deployed to Cloudflare Workers.

## Deployment

Plain static build — no `@astrojs/cloudflare` adapter (it broke static output under Astro 7). `astro build` writes static HTML to `./dist/`, which the Cloudflare Worker serves as assets-only (no worker script — see `wrangler.jsonc`). Images are optimized at build time via `astro:assets`/sharp, and `public/_headers` sets immutable caching for `/_astro/*`.

## Development

Requires [Node.js](https://nodejs.org/) 22+ and [pnpm](https://pnpm.io/).

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server at localhost:4322
pnpm build            # Build production site to ./dist/
pnpm preview          # Preview production build locally
```

## Mixcloud Poller

A Cloudflare Worker (`workers/mixcloud-poller/`) automatically detects new Mixcloud uploads and triggers a site rebuild so the show grid stays current.

### How it works

1. **Cron trigger** — The worker runs on a cron schedule (every 30 minutes) via Cloudflare's scheduled events.
2. **Fetch latest show** — It calls the Mixcloud API (`/afriendlywave/cloudcasts/?limit=1`) to get the most recent upload.
3. **Compare with stored key** — The last-seen show key is persisted in Cloudflare KV. If the latest key matches, the worker exits early.
4. **Dispatch rebuild** — When a new show is detected, the worker calls the GitHub Actions API to dispatch the `rebuild.yml` workflow, passing the show name and key as inputs.
5. **Update KV** — Only after a successful dispatch does it update the stored key, so a failed dispatch will be retried on the next run.

### Rebuild workflow (`.github/workflows/rebuild.yml`)

The `Rebuild and Deploy Site` workflow can be triggered by the poller or manually via `workflow_dispatch`. It checks out the repo, installs dependencies with pnpm, runs `astro build` (which fetches the latest shows from the Mixcloud API at build time), and deploys the output to Cloudflare using `wrangler`.

### Worker commands

```bash
pnpm poller:dev       # Run the worker locally with wrangler dev
pnpm poller:deploy    # Deploy the worker to Cloudflare
```

### Worker secrets

The worker requires these secrets (set via `wrangler secret put`):

- `GITHUB_TOKEN` — A GitHub personal access token with `actions:write` scope for dispatching workflows.

It also uses a KV namespace (`POLLER_KV`) configured in `workers/mixcloud-poller/wrangler.jsonc`.

## TODOs

- Per-show dynamic routes (can pull tracklists if we have the patience for that?)
- Tag routes that collect similar shows
