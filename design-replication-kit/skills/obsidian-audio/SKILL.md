---
name: obsidian-audio-design-replication
description: Recreate or extend the Obsidian Audio premium headphone storefront, including its cream/red campaign, custom WebGL product model, finish/gallery controls, bag drawer, product detail, and cart.
---

# Obsidian Audio design replication

Detailed prompt: [`../../prompts/obsidian-audio.md`](../../prompts/obsidian-audio.md). Workspace reference: `ecommerce-experience/`.

## Workflow

1. Inspect router, cart context, styles, packages and ProductViewer before edits. Preserve route and cart-state conventions.
2. Use cream `#F6EFE4`, deep ink `#1A1210`, signal red `#E5322D`, yellow `#FFC93C`; Space Grotesk display and DM Sans body. Maintain premium editorial spacing and product-first composition.
3. Build full home campaign, product and cart routes. Finish, angle and route context stay synchronized.
4. Prefer existing procedural WebGL ProductViewer: layered cups/cushions/headband, warm light, drag and arrow-key rotation, finish palettes, capped DPR, offscreen lifecycle, cleanup and fallback. Do not replace it with stock art or Three.js if native viewer exists.
5. Keep bag item, count, quantity, prices and subtotal consistent. Add opens accessible drawer; Escape and scrim close it. Maintain coherent empty cart and detail states.
6. Be honest about coming-soon search, sample rating, newsletter, payment and checkout. Never imply payment was collected.
7. Respect reduced motion, focus, semantic swatches, quantity labels, dialog naming and canvas instructions.
8. Report actual implementation and checks. Do not add tests unless requested.

## Preserve

- Cream/red/yellow identity and considered product imagery.
- Consistent cart across drawer and routes; minimum quantity one.
- Explicit demo limitations around ratings, newsletter and checkout.
