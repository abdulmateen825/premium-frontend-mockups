---
name: soi-mangalyaan-x-design-replication
description: Recreate or extend the fictional SOI Mangalyaan-X Mars mission website, including its dark/light aerospace system, procedural Three.js scene, scroll-linked spacecraft, timeline, support sections, and concept interest form.
---

# SOI Mangalyaan-X design replication

Detailed prompt: [`../../prompts/soi-mangalyaan-x.md`](../../prompts/soi-mangalyaan-x.md). Workspace reference: `soi-mangalyaan-x/`.

## Workflow

1. Inspect app entry, tokens, scene, motion, form, dependencies and project instructions. Retain existing architecture.
2. Implement the full story: nav/theme; Mars hero; six terrain cards; partner ticker; eight-stage timeline; heritage metrics/gallery; crew services/checklist; interest form; FAQ; concept footer.
3. Use pearl/ink themes, rust terrain, muted gold/lilac/sage and glass surfaces. Synchronize CSS and scene tokens; persist theme when appropriate.
4. For procedural Mars, retain deterministic terrain/noise/craters, polar variation, atmosphere, moons/Earth, spacecraft/route and particles. Scroll controls ship progress. Cap DPR and particles, pause while hidden, clean up and provide fallback; update scene lighting by theme.
5. Use GSAP/ScrollTrigger only if installed; Lenis only if available and motion is allowed. Mobile scroll remains natural.
6. Label fictional dates/stats and non-binding form. Never imply government affiliation, a real mission, application or reservation. Label and announce form states accessibly.
7. Keep canvas behind legible content; summarize limitations accurately. No tests unless requested.

## Preserve

- Aerospace editorial hierarchy without obscuring copy.
- Both theme palettes apply consistently to DOM and scene.
- Full responsive page and accessible controls.
- Fictional/concept disclosures wherever mission claims or seat interest appear.
