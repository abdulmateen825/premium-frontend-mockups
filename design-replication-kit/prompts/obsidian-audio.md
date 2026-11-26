# Obsidian Audio — design replication prompt

Recreate the Obsidian Audio premium headphone storefront: an immersive editorial campaign page plus product detail and cart routes. Work with the existing repository and preserve the real app's content and commerce behavior. Reference source is `ecommerce-experience/`.

## Visual language

Use a warm cream canvas (#F6EFE4), deep brown-black ink (#1A1210), confident signal red (#E5322D / deeper red), and sparing marigold yellow. Space Grotesk for display; DM Sans for readable UI/body. Give the product photography-like 3D model room to breathe; use strong large editorial headings, full-bleed red/cream story panels, thin hairlines, small uppercase eyebrow copy and restrained transitions. It should feel like premium audio product design, not a generic electronics catalog.

## Routes and components

### Home campaign

- Sticky/scroll-aware header with AudioLines-style mark, OBISIDIAN AUDIO brand, Shop/Technology/Our story, search and account controls, bag count/action, responsive menu. Search and account should be honestly described as preview/coming-soon if not implemented.
- Hero: dark immersive hero field, two-line headline “Silence the noise. Hear everything.”, custom rotatable 3D Obsidian One model in cream finish, two compact hardware proof labels (40-hour battery, adaptive noise cancelling), supporting copy, product and technology CTAs, moving editorial strip, scroll cue.
- Four feature cards: adaptive quiet, spatial audio, 40mm drivers, 40 hours battery. Use small custom waveform, spatial arcs, driver diagram and battery visual; count-up only when visible.
- Technology section: black model with three interactive hotspot labels tied to acoustic core, contact materials and frame accordion. Clicking a detail synchronizes active state.
- Story panel: editorial headline, color swatches Red/Cream/Black, matching 3D product finish, View and Add to bag actions.
- Purchase strip with product, price $349, red model and add-to-bag/discover CTAs.
- Footer with brand promise, newsletter demo status (do not claim a message was sent), social links and legal line.

### Product detail `/product/obsidian-one`

Breadcrumb; large interactive 3D gallery; angle selector Front / Side / Detail and active count; product title, demo rating explicitly marked sample, $349 USD, concise description, color swatches, quantity stepper, add-to-bag and buy-now, stock/delivery note, accordions for specs/materials/box/shipping. Finish and angle selection must update model/view; quantity stays >=1. Keyboard arrows and pointer drag rotate the canvas model if WebGL is supported.

### Cart `/cart` and drawer

Share cart context/state across routes and drawer. Add action opens animated right-side modal drawer; scrim and Escape close, item shows matching finish/model, quantity controls, remove, subtotal, delivery note and path to bag. Bag page has accurate empty state or item/price/summary. Checkout remains explicitly a demo with no payment. Do not persist or process real payment unless app provides that backend.

## 3D product rendering

Reference builds the headphone as custom low-level WebGL meshes, not Three.js or a bitmap. Layered rounded ear cups, inset faceplate, padded acoustic cushion, arch/headband, narrow yoke and detail marks use separate finish/material palettes, normals and a restrained warm light. Implement canvas with transparent background, pointer drag, subtle idle turn, responsive capped DPR, lazy rendering while in view, cleanup, and clear fallback if context unavailable. Product model must change palette with finish and angle with gallery state. Use existing `ProductViewer` pattern when available; do not replace it with a static image.

## Motion, responsive and accessibility

Use Motion for React reveal and route/drawer transitions where installed; honor `prefers-reduced-motion` (including model idle rotation). Header becomes compact after scroll. Reveal sections once; avoid overanimated copy. Responsive layout preserves large model visual, stacks gallery/product details, collapses feature/product grids, keeps cart drawer usable, accessible swatches and clear focus. Use semantic links/buttons, accessible dialog label/state, Escape dismissal, quantity labels, announce add confirmation, describe canvas as interactive and retain a fallback. Mark ratings and content as sample when fictional. Inspect package/dependency/config first and implement within its routing conventions.
