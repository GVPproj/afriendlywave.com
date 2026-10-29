# DJ tutorial

The eleven-slide workshop lives at https://afriendlywave.com/dj-tutorial/ as a native Astro page. It uses the shared site header, footer, and Mixcloud player. There is no separate Slidev package, build, or copied output.

## Edit the workshop

- `src/pages/dj-tutorial.astro` is the route and shared-layout entry point.
- `src/components/tutorial/TutorialDeck.astro` composes the slides in workshop order. Focused slide components live alongside it under `slides/`.
- Keep presenter notes beside their slides as source-only comments or unrendered frontmatter, not HTML comments or hidden markup. There is no public notes panel, notes page, or presenter route.
- Tutorial images and logos belong in `public/dj-tutorial/`; reference them as `/dj-tutorial/<filename>`. Shared fonts belong in `public/fonts/` and are referenced as `/fonts/<filename>`. Read [the font guidance](../public/fonts/README.md) before changing fonts and [identity.md](identity.md) before visual changes.
- Keep the slide IDs `slide-1` through `slide-11` stable: existing links and browser history depend on them. If the workshop length intentionally changes, update the navigation and the agreed test expectations together.

Astro handles bundling the page's scripts and styles into `/_astro/`. Do not add generated assets to `public/`, a second package manifest or lockfile, or a post-build copy step.

## Navigation and layout

A link such as `/dj-tutorial/#slide-3` opens the third slide. Previous/next buttons, Left/Right arrows, Home/End, swipe gestures, and title-slide contents links navigate the deck. The counter and controls sit below the slide, with disabled states at the boundaries. Hash navigation supports refresh and browser Back/Forward; nested routes such as `/dj-tutorial/3` are not slide links.

Wide screens use a centred 16:9 canvas whose width sets its height. Its width is capped to leave room for navigation and the fixed player on typical laptop screens, while retaining the site's outer gutters. Very short windows may still scroll rather than shrinking the artwork indefinitely. Narrow screens use fluid, readable slides rather than scaling the entire canvas down. Preserve fade transitions, animations, and reduced-motion behaviour when editing. There is no fullscreen mode or extra main-navigation link.

## Develop, build, and preview

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
# Open http://localhost:4322/dj-tutorial/#slide-3
```

The tutorial uses normal Astro development and hot reload, not a separate dev server or command alias.

```sh
pnpm check
pnpm build              # astro build -> dist/, including dj-tutorial/index.html
pnpm preview            # Open /dj-tutorial/#slide-3 at the printed preview URL
# Or use Cloudflare's local asset server:
pnpm preview:cloudflare # http://localhost:8787/dj-tutorial/#slide-3
```

`pnpm build` produces the complete site in one step. Astro copies `public/dj-tutorial/` into `dist/dj-tutorial/`, alongside the generated page, and copies shared fonts into `dist/fonts/`. Rebuilding removes deleted assets.

## Verify changes

```sh
pnpm test:build
pnpm exec playwright install chromium # First run; add --with-deps on Linux CI
pnpm test:browser                     # Uses the dist/ built above
```

Build-output tests check the eleven stable slide targets, shared layout/player, bundled JS/CSS and shared fonts, absence of presenter/notes output, and stale public-asset cleanup. Browser tests exercise the user-facing deck and HTTP routes. Check direct links, refresh and Back/Forward, keyboard and swipe navigation, boundary controls, title contents links, asset loading, mobile readability, wide/short screens, and reduced motion. Existing site URLs must still work; unknown paths, including `/dj-tutorial/presenter` and `/dj-tutorial/notes`, must remain 404s. Do not add a site-wide SPA fallback.

## Deploy

Use the existing root build and Cloudflare deployment described in [README.md](../README.md#deployment): `pnpm build && pnpm exec wrangler deploy`. The existing rebuild workflow also uses `pnpm build`. No tutorial-specific deployment is required. Verify the canonical tutorial URL and a `#slide-3` deep link on a preview and after release; local tests do not prove live deployment success.

The Mixcloud poller in `workers/mixcloud-poller/` remains a separately installed package with its own lockfile. The site and tutorial share the root installation and lockfile.
