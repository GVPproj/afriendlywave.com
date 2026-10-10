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
