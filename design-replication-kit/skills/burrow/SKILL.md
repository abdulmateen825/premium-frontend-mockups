---
name: burrow-design-replication
description: Recreate or extend the Burrow roommate-household visual design in React projects. Use for its claymorphic cards, blob roommate characters, chore rota, bill-splitting phone demo, shared shopping list, or responsive playful household UI.
---

# Burrow design replication

Detailed prompt: [`../../prompts/burrow.md`](../../prompts/burrow.md). Workspace reference: `burrow/`.

## Workflow

1. Inspect repository instructions, routes, components, CSS, assets and installed packages. Preserve the target product's real behavior and content.
2. Implement the complete page: header, hero/art, reminder marquee, problem story, chore rota, bill split demo, shopping cards, bento features, testimonials, pricing, final CTA and footer.
3. Define shared tokens: cream `#FFF4E6`, ink `#2B2140`, tomato `#FF6B5B`, sunflower `#FFC933`, mint `#4FD1A5`, sky `#5BB8FF`, lilac `#A78BFA`, bubblegum `#FF8FC7`; Gabarito display and Hanken Grotesk body. Use large rounded geometry and tactile bevels, not flat pastel cards or generic glassmorphism.
4. Prioritize Burrow's custom identity: reusable irregular SVG blobs Pip/Moss/Dot/Sunny with consistent color and gloss; layered clay blocks and household-object collage in the hero. Never replace these with emoji, stock art, or generic avatars.
5. Make interactions real: one chore step drives wheel and card; one bill step drives controls and phone UI; list items toggle checked; feature toggles and streak visibly update. Provide manual controls equivalent to scroll effects; mobile cannot depend on pinning.
6. Responsive pass: stack hero and sections, use a snap-scrolling shopping track on phone, expose mobile nav, keep touch targets readable, and avoid clipped character art.
7. Use semantic structure, skip link, focus rings, labels, truthful pressed/expanded/status states. Honor reduced motion for loops, blinks, reveals and scroll effects.
8. Review the full composition and state any demo-only behaviors accurately. Do not add tests unless requested.

## Preserve

- Friendly, specific, lightly witty household tone; no corporate dashboard styling.
- Reusable roommate art across hero, rota, bills, features and CTA.
- Clear contrast over colorful soft surfaces; distinct raised and pressed states.
- Honest sample quotes, prices, reminders, payment and sign-up claims.
- No forced pinned scroll animation on small screens.
