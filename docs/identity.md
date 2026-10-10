# Web identity

## Palette

| Colour | Web value | Use |
| --- | --- | --- |
| Navy | `#001a72` | Backgrounds, text on copper/lime |
| Copper | `#e06c3a` | Links and actions |
| Berry | `#b34479` | Secondary backgrounds |
| Lime | `#e2ff78` | Highlights, text on berry |
| Chalk | `#f0f0eb` | Body text |

Use semantic tokens from `src/styles/global.css`, not palette literals.
Berry/navy contrast is 2.9:1; use chalk on navy and lime on berry for body text.
Preserve raster artwork and third-party iframe colours.

## Typography and layout

- Iosevka Aile Heavy for headings; Iosevka Regular for copy.
- Use the spacing and typography tokens in `src/styles/global.css`.
- Use `site-container` for page alignment and `content-grid` for prose/forms.
- Use square panel edges and uppercase display titles.

## Accessibility

Keep the screen-reader transcript in `SeasonSchedule.astro` in sync with the schedule artwork.
