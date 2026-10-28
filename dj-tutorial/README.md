# Your First DJ Mix

Slidev slides for a 10-minute introductory DJ workshop. Canonical URL: https://afriendlywave.com/dj-tutorial/.

## Work locally

Requires Node.js 22.13+ and pnpm 11.15.1, selected by the repository root. Install from the root; there is one workspace lockfile for Astro and Slidev:

```sh
pnpm install --frozen-lockfile
pnpm dev:tutorial # http://localhost:3030
```

Edit `dj-tutorial/slides.md` for slides and presenter notes, `dj-tutorial/style.css` for styling, `dj-tutorial/components/DeckSetup.vue` for the deck diagram, and `dj-tutorial/public/` for assets. Keep assets scoped to this package. Slide links use hash routing, e.g. `/dj-tutorial/#/3`.

## Build and deploy

From the repository root:

```sh
pnpm build
pnpm preview:cloudflare
```

Open http://localhost:8787/dj-tutorial/. The combined build runs Astro first, builds Slidev with base `/dj-tutorial/`, and copies the deck into root `dist/dj-tutorial/`. Generated output is not committed.

For a slides-only build, run `pnpm --filter intro-to-djing build`; output goes to `dj-tutorial/dist/`, not the deployment directory. Use the root combined build for every deployment.

The slides deploy with the existing Cloudflare site, not GitHub Pages. See the [root README](../README.md#deployment) for deployment and verification. The original slides repository is not modified or retired by this integration.
