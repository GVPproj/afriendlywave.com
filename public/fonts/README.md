# Iosevka

Latin-subsetted WOFF2 fonts from the official Iosevka v34.9.0 release:
https://github.com/be5invis/Iosevka/releases/tag/v34.9.0

| Served file                | Weight | Original bytes | Subset bytes |
| -------------------------- | ------ | -------------: | -----------: |
| `iosevka-regular.woff2`    | 400    |      1,143,420 |       50,996 |
| `iosevka-bold.woff2`       | 700    |      1,149,724 |       50,836 |
| `iosevka-aile-heavy.woff2` | 900    |      1,126,800 |       51,360 |

Total: 3,419,944 → 153,192 bytes (95.5% smaller). Aile is used for headings.
All fonts remain licensed under the SIL Open Font License 1.1; see
`iosevka-LICENSE.md`. The served files are modified subsets, not unchanged upstream files.

## Rebuild the subsets

Download the release archives and extract these originals into a separate directory,
renaming them to the served filenames above:

- `PkgWebFont-Unhinted-Iosevka-34.9.0.zip`:
  `WOFF2-Unhinted/Iosevka-Regular.woff2` and `WOFF2-Unhinted/Iosevka-Bold.woff2`.
- `PkgWebFont-Unhinted-IosevkaAile-34.9.0.zip`:
  `WOFF2-Unhinted/IosevkaAile-Heavy.woff2`.

From the repo root:

```sh
python3 -m venv /tmp/afw-font-tools
/tmp/afw-font-tools/bin/pip install 'fonttools[woff]==4.63.0' 'brotli==1.2.0'
/tmp/afw-font-tools/bin/python scripts/subset-fonts.py /path/to/original-fonts
```

The script retains Latin and extended Latin, combining accents, general punctuation,
currency, letterlike symbols, arrows, minus, BOM, and the replacement character.
It preserves normal shaping features and their dependent glyphs. All 1,193 retained
codepoints keep their original advance widths. All characters in the current Astro
and TypeScript source that were covered by the originals remain covered.

This is a reusable language subset, not a snapshot of today's copy. Other scripts
(e.g. Greek or Cyrillic in future Mixcloud titles) use system fallbacks. Expand the
ranges in `scripts/subset-fonts.py` and regenerate **from originals** if needed.
No font tooling runs during the site build.

## Fallback metrics

`src/styles/global.css` keeps `font-display: swap`, with local metric-adjusted
fallbacks. `Layout.astro` preloads only the nav-critical regular face; its URL and
`crossorigin` must continue to match the CSS font request.

- **Iosevka:** a 0.5em advance divided by a ~0.6em Courier-compatible advance gives
  `size-adjust: 83.333%`. Menlo/DejaVu (~0.602em) and Consolas (~0.55em) cannot
  share that scale. Separate regular and bold local faces preserve weight.
- **Aile:** proportional widths cannot be matched exactly with a single scale.
  Ratios of summed text advances against Nimbus Sans Bold for the ten rendered
  headings across the home, about, and four form pages give **107.78%** for mixed
  case and **90.76%** for uppercase. An overall average (97.44%) still caused
  uppercase headings to rewrap. Uppercase `h1`–`h3` elements override the heading
  font variable so `font-heading` utilities use the caps fallback too.
- **Vertical metrics:** these fonts select OS/2 typo metrics: ascent 965, descent
  285, line gap 0, units per em 1,000. CSS overrides are `96.5% / scale`,
  `28.5% / scale`, and `0%` respectively. Explicit heading/copy line heights remain.

These are mitigations, not a guarantee of zero font-related CLS. Aile can still
rewrap with different copy or near a line-break boundary. If no named local face
exists (including some mobile systems), the generic fallback is unadjusted.
Nimbus was measured on Linux; Arial/Liberation are metric-compatible alternatives,
but real Windows/macOS/mobile testing is still needed. Recheck slow-font loading
and wrapping after typography or heading-copy changes.

Validation: Linux Chromium, cold loads with fonts delayed at least 1,200ms and
external requests blocked, at 320/390/768/1440px across `/`, `/about`, `/join`,
`/artists`, `/vendors`, and `/workshop`. All heading heights/line counts stayed
stable; maximum nav displacement was 0.078125px. Regular and Aile were each
requested once; the current pages did not request bold. Also checked the mobile
home → about → home navigation. To recheck, compare fallback and loaded heading
heights/nav positions with the font responses held until after first paint;
ensure the fallback really rendered, rather than only measuring a warm cache.
