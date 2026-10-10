# Project guidance

Astro static site with Tailwind CSS and TypeScript. Use pnpm.

## Commands

```sh
pnpm dev       # http://localhost:4322
pnpm build     # Output: dist/
pnpm preview
```

## Styling

Use semantic colour tokens from `src/styles/global.css`:

- `surface`: backgrounds
- `ink`: text and borders
- `muted`: secondary text
- `accent`: links and buttons
- `secondary`: secondary panels
- `highlight`: hover, focus, emphasis
- `on-accent`, `on-secondary`: text on coloured panels

Use `text-muted` for secondary text rather than text opacity modifiers.

For visual changes, read `docs/identity.md`.
For font changes, read `public/fonts/README.md`.
