This document shows several ways to export PNG versions of the SVG logos and generate favicons.

Recommended outputs

- `src/assets/nrandstore-logo-400.png` (wide, 400×120)
- `src/assets/nrandstore-logo-200.png` (medium)
- `src/assets/nrandstore-logo-64.png` (small)
- `src/assets/favicon-32.png` and `src/assets/favicon-16.png` (favicon sizes)

1) Inkscape (recommended if installed)

```bash
# export specific size (Inkscape 1.0+)
inkscape src/assets/nrandstore-logo.svg --export-type=png --export-filename=src/assets/nrandstore-logo-400.png --export-width=400 --export-height=120

# export multiple sizes
inkscape src/assets/nrandstore-logo.svg --export-type=png --export-filename=src/assets/nrandstore-logo-200.png --export-width=200
inkscape src/assets/nrandstore-logo.svg --export-type=png --export-filename=src/assets/nrandstore-logo-64.png --export-width=64

# favicons
inkscape src/assets/nrandstore-logo.svg --export-type=png --export-filename=src/assets/favicon-32.png --export-width=32
inkscape src/assets/nrandstore-logo.svg --export-type=png --export-filename=src/assets/favicon-16.png --export-width=16
```

2) ImageMagick (if `magick` is available)

```bash
magick convert -background none src/assets/nrandstore-logo.svg -resize 400x120 src/assets/nrandstore-logo-400.png
magick convert -background none src/assets/nrandstore-logo.svg -resize 200x src/assets/nrandstore-logo-200.png
magick convert -background none src/assets/nrandstore-logo.svg -resize 64x src/assets/nrandstore-logo-64.png
magick convert -background none src/assets/nrandstore-logo.svg -resize 32x src/assets/favicon-32.png
magick convert -background none src/assets/nrandstore-logo.svg -resize 16x src/assets/favicon-16.png
```

3) npx `svgexport` (no global install)

```bash
# single-file examples
npx svgexport src/assets/nrandstore-logo.svg src/assets/nrandstore-logo-400.png 400:
npx svgexport src/assets/nrandstore-logo.svg src/assets/nrandstore-logo-64.png 64:

# multiple exports in one call (svgexport supports multiple pairs)
npx svgexport src/assets/nrandstore-logo.svg src/assets/nrandstore-logo-400.png 400: src/assets/nrandstore-logo-64.png 64: src/assets/favicon-32.png 32:
```

4) Node + `sharp` (programmatic)

```js
// install: npm install --save-dev sharp
// example script: scripts/convert-logos.js
const sharp = require('sharp');
sharp('src/assets/nrandstore-logo.svg').png().resize(400, 120).toFile('src/assets/nrandstore-logo-400.png');
sharp('src/assets/nrandstore-logo.svg').png().resize(64).toFile('src/assets/nrandstore-logo-64.png');
sharp('src/assets/nrandstore-logo.svg').png().resize(32).toFile('src/assets/favicon-32.png');
```

Notes and tips

- Use `--export-background=none` (or equivalent) to keep transparency when supported by the tool.
- For best crispness on small icons, consider editing the SVG shape stroke widths or exporting at higher scale and downscaling.
- To add a favicon to your site, convert to `favicon-32.png`/`16.png` and include in `index.html`:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/src/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/src/assets/favicon-16.png">
```

If you want, I can attempt to run `npx svgexport` here to create the PNGs now — say "please run" and I'll run the commands. Otherwise run one of the commands above on your machine.
