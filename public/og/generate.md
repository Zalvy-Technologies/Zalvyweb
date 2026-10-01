# OG image conversion

The OG image source for ZALVY is `src/og/zalvy-og.svg` (1200 × 630 px).

To convert to PNG:

```bash
npx sharp -i public/og/zalvy-og.svg -o public/og/zalvy-og.png --width 1200 --height 630
```

Or via svgexport:
```
svgexport public/og/zalvy-og.svg public/og/zalvy-og.png 1200:630
```

Or by exporting in Figma / Illustrator / Sketch:
- Open the SVG file
- Export as PNG at 1200 × 630 px
- Uncheck transparency — our dark canvas (#07090d) is solid

Place the resulting `zalvy-og.png` in `public/og/` — the existing metadata references (`site.ts` → `ogImage`) already point to this path.