"""Build the served Latin subsets from original, lowercase-named WOFF2 files.

Usage: python scripts/subset-fonts.py /path/to/original-fonts
Requires fonttools[woff]==4.63.0; see public/fonts/README.md.
"""

import argparse
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

# Latin (including extended/accented letters), combining marks, punctuation,
# currency, letterlike symbols, arrows, minus, BOM and replacement character.
UNICODES = (
    "U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,"
    "U+2100-214F,U+2190-21FF,U+2212,U+FEFF,U+FFFD"
)
FILENAMES = (
    "iosevka-regular.woff2",
    "iosevka-bold.woff2",
    "iosevka-aile-heavy.woff2",
)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    destination = Path(__file__).resolve().parents[1] / "public" / "fonts"
    if args.source.resolve() == destination:
        parser.error("Use original fonts outside public/fonts, not existing subsets.")

    for filename in FILENAMES:
        source = args.source / filename
        with TTFont(source, recalcTimestamp=False) as font:
            options = subset.Options()
            options.flavor = "woff2"
            # Keep the font's normal shaping features and required glyph closure.
            subsetter = subset.Subsetter(options=options)
            subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
            subsetter.subset(font)
            output = destination / filename
            font.save(output)
            print(f"{filename}: {source.stat().st_size:,} -> {output.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
