# Handoff: host the DJ tutorial in afriendlywave.com

## Goal and agreed approach

Serve the Slidev workshop at `https://afriendlywave.com/dj-tutorial/`, keeping the existing Astro site and its URLs working unchanged. The user chose to bring the slide source into this repository rather than coordinate builds between two repositories. Keep Slidev as a separate package; do not convert the slides into Astro pages.

This session only copied the source and recorded this plan. Build, workspace, routing, CI, and deployment integration are **not implemented**. No build or browser tests have been run. No changes were made to the original slides repository or to Cloudflare.

## Copied source

`dj-tutorial/` contains the original `slides.md`, `style.css`, `styles/`, `components/`, `public/` (including fonts and licenses), package manifest, lockfile, workspace settings, README, and `.gitignore`.

Source: `https://github.com/GVPproj/DJ-Workshop-Slides.git`, commit `f56887a0117f6961fdec19fc0f2a3d0899c1dcff`.
Local original: `../DJ-Workshop-Slides/`.

Did not copy `.git/`, `node_modules/`, generated output, or the GitHub Pages workflow. The original repository remains intact. Asset and component directories were checked with `diff -qr` against the originals, with no differences.

The copied README still describes the old standalone repository/GitHub Pages workflow; update it as part of integration. The nested lockfile and workspace file are migration inputs, not the intended final workspace layout.

## Existing deployment: inspect before changing

- Read `AGENTS.md` for repository guidance.
- `package.json`: Astro site, root `build` currently runs `astro build`.
- `astro.config.mjs`: static Astro site; keep existing development server behavior.
- `wrangler.jsonc`: existing `afriendlywave` Worker serves `./dist` as static assets.
- `.github/workflows/rebuild.yml`: workflow-dispatch build/deploy, also used by Mixcloud automation. It installs with a frozen lockfile, runs `pnpm build`, and deploys with Wrangler.
- `workers/mixcloud-poller/`: separate worker/package. Do not inadvertently fold its existing dependency setup into this migration or change its dispatch contract.

No extra DNS, custom domain, reverse-proxy Worker, or Terraform resource is expected for this addition. Use the existing deployment and version-controlled build/configuration. Inspect Cloudflare build settings or other deployment entry points before assuming the checked-in workflow is the only path.

## Implementation plan

### 1. Establish a pnpm workspace

- Add the `dj-tutorial` package to the root `pnpm-workspace.yaml`, preserving existing settings.
- Use the root package manager version and one root lockfile for the site and slides. The copied package currently declares pnpm 12.16.1; the root declares pnpm 11.15.1. Resolve this intentionally rather than letting CI select inconsistent versions.
- Remove the slide package's redundant `packageManager` declaration, nested lockfile, and nested workspace configuration once migrated. Preserve necessary build permissions (`esbuild` is already allowed at the root).
- Keep the Mixcloud worker's separate lockfile/setup unchanged unless there is an explicit need to change it.
- Install and confirm a clean `pnpm install --frozen-lockfile` succeeds.

### 2. Configure Slidev for the subpath

- Build with `slidev build --base /dj-tutorial/` (via the package's build script or root orchestration).
- Add `routerMode: hash` to the opening frontmatter of `dj-tutorial/slides.md`. This was the recommended simple routing approach; verify it with the user if clean per-slide URLs are required instead.
- Hash routing yields URLs like `/dj-tutorial/#/3`, avoiding a server fallback for nested slide routes. Do not apply a site-wide SPA fallback: it could change Astro page and 404 behavior.
- Audit images, CSS fonts/backgrounds, and other assets for root-relative URLs. `slides.md` contains `/afw-wordmark.svg`, `/dj-controller.jpg`, and `/logos/...` references. Do not assume all HTML asset references are automatically rewritten by Slidev/Vite: inspect the build and test in a browser. Use base-aware references where necessary.
- Keep tutorial assets scoped under `/dj-tutorial/`; do not copy them into the root site's public directory and risk filename collisions.

### 3. Add a reproducible combined build

- Retain an explicit Astro-only build step/script.
- Root `pnpm build` must build Astro, build Slidev, then copy Slidev's generated output into root `dist/dj-tutorial/`.
- Copy **after** Astro builds, because Astro regenerates `dist/`.
- Prefer a small Node script in `scripts/` for directory operations, with failures propagated. Clear the destination before copying so removed slide assets do not linger across repeated builds.
- Do not commit generated output.
- Preserve root `pnpm dev` behavior for Astro and add a distinct tutorial development command. Document how to preview the combined output; Astro development mode need not serve the slides unless deliberately implemented.

### 4. Integrate every deployment entry point

- The existing Mixcloud-triggered workflow must deploy the combined output too. Making root `pnpm build` the combined build should cover its current build step.
- Ensure any Cloudflare dashboard/Git-connected builds and manual documented deployment commands also use the combined build. Otherwise a later deployment could remove the tutorial.
- Existing `wrangler.jsonc` assets directory should remain `./dist`; a new Worker should not be necessary.
- Keep secrets in their existing secret stores, never in configuration or documentation.
- No GitHub Pages workflow is needed in this repository. Retiring/archiving the original repository can happen separately after the new URL is verified; do not delete or archive it during implementation without approval.

### 5. Documentation and optional navigation

- Update root and tutorial READMEs with workspace installation, both dev commands, combined build, and the canonical tutorial URL. Remove stale standalone deployment instructions and reconcile runtime requirements.
- A homepage/navigation link is optional, not yet requested. If adding visual changes, read `docs/identity.md`; for font changes, also read `public/fonts/README.md`.

## Acceptance checks

- Existing Astro pages still build and render at their current URLs.
- Clean frozen-lockfile installation and root build succeed; repeated builds do not retain deleted tutorial assets.
- `dist/dj-tutorial/index.html` and its bundled assets exist after the combined build.
- Preview the combined output under a server that matches deployed static-asset behavior.
- `/dj-tutorial` resolves to the deck (normalizing to `/dj-tutorial/` is fine), and `/dj-tutorial/` loads correctly.
- Advance/back navigation, direct links such as `/dj-tutorial/#/3`, and refresh work.
- Images, logos, fonts, styling, and the interactive deck diagram load without console/network errors or unintentional requests to root-level tutorial assets.
- Existing Astro 404 behavior is preserved; no blanket SPA fallback is introduced.
- The Mixcloud dispatch inputs and deployment credentials remain unchanged; its workflow still builds the complete site.
- Before final deployment, verify Cloudflare's actual asset routing and the canonical URL on a preview deployment if available. Do not claim live success based only on local build success.

## Suggested skills

- `/skill:implement` — `/home/gvp/agent-skills/skills/implement/SKILL.md`: read if using the local implementation workflow; this handoff is its task context.
- `/skill:tdd` — `/home/gvp/agent-skills/skills/tdd/SKILL.md`: follow if adding automated integration/build regression tests.
- `/skill:diagnosing-bugs` — `/home/gvp/agent-skills/skills/diagnosing-bugs/SKILL.md`: use if asset loading, workspace installation, or deployed routing fails.
- `/skill:code-review` — `/home/gvp/agent-skills/skills/code-review/SKILL.md`: review the completed migration diff against this plan and repository standards.
