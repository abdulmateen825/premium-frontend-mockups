# Product photo drop-in points

Add transparent studio WebP files here, ideally around 2000 pixels wide and under 300 KB each:

- `obsidian-one-red.webp`
- `obsidian-one-cream.webp`
- `obsidian-one-black.webp`
- `obsidian-one-detail.webp`

They are served at `/assets/products/...`. Until the individual photos are supplied, `ProductImage` uses the reference photo at `/images/image.png` with temporary finish filters. Set `useReferencePlaceholder` to `false` in `src/components/product/ProductImage.tsx` once all four files are present.
