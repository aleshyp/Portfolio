# assets-src — design masters, not served

Full-resolution exports from Figma, kept as the **re-encode masters** for the
optimized assets in `public/`. Nothing here is served to browsers.

Everything under `public/` is published at the site root — a 7.5 MB JPG sitting
there is publicly fetchable even when no page links it, and it inflates the
deploy. So masters live here instead, and only the optimized derivative goes in
`public/`.

## work/northwind

| File | Serves | Derivative in `public/` |
|---|---|---|
| `v5-01-hero.jpg` | Case-study hero | `v5-01-hero.webp` |
| `v5-02-value-props.jpg` | Case-study block 01 | `v5-02-value-props.webp` |
| `v5-03-social-proof.jpg` | Case-study block 02 | `v5-03-social-proof.webp` |
| `v5-04-mobile.jpg` | Case-study block 03 | `v5-04-mobile.webp` |

`pages/` holds the eight full-page scroll exports (Product, Pricing, Docs,
Community, About, and the three auth screens). They're unused: the case-study
gallery renders `aspect-[16/9]` with `object-cover`, which would center-crop a
3200×8324 page into a meaningless band. Kept in case a full-page treatment gets
built later.

## Re-encoding

The `public/` derivatives were produced with `sharp` — 3200w JPG down to 2400w
WebP (2400 is the widest they're ever displayed: 2× on a ~1200px container):

```js
sharp(src).resize({ width: 2400, withoutEnlargement: true })
          .webp({ quality: 82, effort: 6 })
```

That took 6.2 MB to 282 KB (−95%) with no visible quality loss. Flat UI
screenshots with large solid-color regions compress far better as WebP than as
photographic JPG, which is why the ratio is so high. Check the result at full
size before trusting it — dark gradients are where banding shows up first.
