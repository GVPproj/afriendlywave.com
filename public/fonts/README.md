# Iosevka

Latin-subsetted WOFF2 fonts from [Iosevka v34.9.0](https://github.com/be5invis/Iosevka/releases/tag/v34.9.0).
Licensed under [SIL OFL 1.1](iosevka-LICENSE.md). Served files are modified subsets.

## Rebuild

Download the release archives and extract the originals into a separate directory:

| Archive | Original | Rename to |
| --- | --- | --- |
| `PkgWebFont-Unhinted-Iosevka-34.9.0.zip` | `WOFF2-Unhinted/Iosevka-Regular.woff2` | `iosevka-regular.woff2` |
| `PkgWebFont-Unhinted-Iosevka-34.9.0.zip` | `WOFF2-Unhinted/Iosevka-Bold.woff2` | `iosevka-bold.woff2` |
| `PkgWebFont-Unhinted-IosevkaAile-34.9.0.zip` | `WOFF2-Unhinted/IosevkaAile-Heavy.woff2` | `iosevka-aile-heavy.woff2` |

Run from the repo root:

```sh
python3 -m venv /tmp/afw-font-tools
/tmp/afw-font-tools/bin/pip install 'fonttools[woff]==4.63.0' 'brotli==1.2.0'
/tmp/afw-font-tools/bin/python scripts/subset-fonts.py /path/to/original-fonts
```

For additional character coverage, update the ranges in `scripts/subset-fonts.py`
and regenerate from originals, not existing subsets. Font tooling is not part of the site build.

## Testing

Keep the regular font preload in `src/layouts/Layout.astro` aligned with its CSS URL and `crossorigin`.
Fallbacks in `src/styles/global.css` reduce layout shifts but can still rewrap headings;
systems without the named local fonts use unadjusted generic fallbacks.

After font or heading-copy changes, delay font responses until after first paint
and compare heading wrapping and nav positions before and after loading at mobile
and desktop widths. Test on Linux, Windows, macOS, and mobile.
