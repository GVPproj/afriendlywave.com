# Your First DJ Mix

Slidev slides for a 10-minute introductory DJ workshop. [View the slides](https://gvpproj.github.io/DJ-Workshop-Slides/).

## Work locally

Requires Node.js 22.12+ and pnpm 10.

```sh
pnpm install
pnpm dev
```

Edit `slides.md` for slides and presenter notes, `style.css` for styling, `components/DeckSetup.vue` for the deck diagram, and `public/` for assets.

Run `pnpm build` to generate the site in `dist/`. Pushes to `main` deploy via GitHub Pages.
