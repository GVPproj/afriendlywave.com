# Web identity

Source: `AFW_001-02_Identity-v2_1.1.ai`, received via Taildrop. The Illustrator file contains a 20-artboard PDF-compatible preview; source stays outside the repository in `~/Downloads/`.

## Palette (artboard 1)

| Colour | Web value | Use                                           |
| ------ | --------- | --------------------------------------------- |
| Navy   | `#001a72` | Surface, text on copper/lime                  |
| Copper | `#e06c3a` | Links and primary actions                     |
| Berry  | `#b34479` | Secondary backgrounds, not small text on navy |
| Lime   | `#e2ff78` | Highlights, emphasis, text on berry           |

Copper, berry and lime are the PDF's RGB fill values rounded to 8-bit hex, not sampled screenshot colours. Navy is a PANTONE 2747 C spot colour; retain the site's existing digital equivalent rather than treating a colour-managed PDF rendering as canonical RGB.

Components use semantic tokens in `src/styles/global.css`, not palette literals. Everyday text uses warm chalk white (`ink: #f0f0eb`), a web-only neutral that complements the palette. Muted text is a derived chalk/navy mixture. Approximate WCAG contrast: chalk/navy 13.2:1, lime/navy 13.5:1, copper/navy 4.6:1, lime/berry 4.7:1. Berry/navy is only 2.9:1, so berry is not a body-text colour.

## Typography and grid (artboards 2–3)

- Iosevka Aile Heavy for headings; Iosevka Regular for copy (already locally hosted).
- Artwork copy is 42pt with approximately 54pt leading; heading sample is 264pt.
- Grid has approximately 36pt outer margins, 72pt column gutters, and a 54pt baseline.
- Web adaptation: 21px body type, 1.3 leading, a roughly 28px baseline, 14px card padding, up to 28px panel padding and 84px section gaps.
- Responsive gutters run from 18px to 36px. `site-container` aligns the header and homepage; `content-grid` provides consistent gutters for prose/forms while allowing full-bleed photography.
- Square panel edges and uppercase display titles echo the posters; content order, event information and integrations are unchanged.

Existing raster artwork and third-party iframe contents are not recoloured. Lime emphasis follows the navy-background posters; chalk white is a deliberate web adaptation for regular text, not an extracted fifth palette swatch.

## Season 4 homepage hero

Selected direction: variant A, explored on `prototype/season4-hero-variants` (archive commit `055c6ed`). One copper backdrop contains the Dark Mode event and original artboard-8 schedule. Equal-height panels sit side by side at desktop widths and stack on mobile, sharing a berry offset shadow. No additional hero headings or dancer illustration. `DarkModeEvent.astro` uses container queries so its photo stays above its details in a narrow panel, regardless of viewport width.

`src/assets/events/season4-schedule.webp` is a 2000px-wide export of artboard 8 from the Illustrator source, with a screen-reader transcript in `SeasonSchedule.astro`. Its original “8pm–late” copy is preserved; the adjacent event card gives the precise 8:00–11:30pm time. The prototype branch is the primary-source archive; no implementation issue was supplied.
