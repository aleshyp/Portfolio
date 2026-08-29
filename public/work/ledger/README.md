# Ledger case-study captures

These are **generated**, not hand-made. Don't edit them by hand — regenerate.

```bash
npm run dev                       # or npm run start after a build
node scripts/capture-ledger.mjs
```

The script drives the real demo at `/ledger-demo` into each state, screenshots
the app itself (not the page chrome around it), and encodes WebP at quality 82.

| File | Shot | Where it appears |
|---|---|---|
| `overview-{light,dark}.webp` | Seeded group, untouched | Case-study cover + Work-grid card |
| `add-expense-{light,dark}.webp` | Form open, £100 split 3 ways | Block 5 |
| `failed-save-{light,dark}.webp` | Rollback with Retry/Discard | Block 4 |
| `mobile-{light,dark}.webp` | 390px viewport | "More screens" |
| `card-{light,dark}.webp` | Settle-up panel alone | Work-grid thumbnail (light only) |

## Things that will bite you

- **Both themes are required.** The case study picks between them with a
  `<picture>` media source, so a missing dark file leaves a light screenshot
  glowing out of a dark page. The script always writes both.
- **Files are 2x DPR.** `SHOT_SIZES` in `src/components/LedgerAsset.tsx` records
  the *CSS* size (half the file's pixel size). A stale entry there doesn't fail
  the build — it silently distorts the frame and reintroduces layout shift, so
  update it whenever a capture's dimensions change. The script prints both sizes.
- **The mobile shot is capped** at `max-w-sm` in `LedgerAsset`. It's 342px wide;
  letting it fill the 1088px content column upscales it 3x into a soft,
  4679px-tall image that also becomes the page's LCP element.
- **The script hides `header`/`footer` before shooting.** An element screenshot
  captures the element's box, not its stacking context, so the fixed navbar
  otherwise paints across the top of the frame.
- **`.next/cache/images` survives a restart.** Replacing a source file here keeps
  serving the *old* optimized output until you `rm -rf .next/cache/images`. It
  looks exactly like your change not applying — the `<img src>` still points at
  the right file, and the file on disk is correct.
- **The `card` shot uses `padTo`** to come out at 16:9. Without it the panel is
  2.06:1 and the card's `object-cover` crops the sides, cutting off the very text
  the crop exists to show.
- **Re-run this whenever the demo's UI changes.** These are the one part of the
  study that *can* drift from the running app — the three diagram scenes derive
  their figures from the engine at render time and can't.
