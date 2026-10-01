# Apple Touch Icon

The Apple touch icon for ZALVY is supplied as SVG at `public/icons/apple-touch-icon.svg` (180 × 180 px).

Safari 10+ and all Chromium-based browsers support SVG apple-touch icons. The root layout references the SVG by default.

If a PNG version is required (for older iOS versions 7-9 weeks, rare in 2026):

```bash
npx sharp -i public/icons/apple-touch-icon.svg -o public/icons/apple-touch-icon.png --width 180 --height 180
```

Or export the SVG at 180 × 180 from any design tool as PNG.

The metadata references in `src/app/layout.tsx` currently point to the SVG path — if you need PNG, update the `url` and `type` fields in the icons array.