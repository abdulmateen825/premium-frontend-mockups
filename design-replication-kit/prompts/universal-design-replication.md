# Universal design replication prompt

Use this when you need to reproduce a supplied website or app design in any existing codebase. First inspect the repository, screenshots/references, design files and any local instruction files. Treat supplied evidence as the visual authority; do not guess at details you can inspect. Keep the target product's actual purpose, copy, data and functional requirements.

## 1. Observe before building

Inventory routes, entry points, components, styles, assets, fonts, installed UI/animation/rendering libraries and responsive breakpoints. Read relevant app code and project README. Inspect every supplied screenshot/reference at its actual dimensions. Record:

- Product intent, target user, primary task and tone.
- Information architecture: routes, sections, order, content hierarchy and navigation.
- Layout: page width, columns, alignment, whitespace, section heights, sticky/fixed elements and stacking behavior.
- Type: font family/weights, scale, line-height, tracking, case, wrapping and hierarchy.
- Color: canvas, surface, text, muted text, accents, borders, states and gradients.
- Shape/surface: corner radii, strokes, shadows, texture, blur, depth and material character.
- Visual assets: product art, icons, illustrations, photography, charts, decorative forms and their crop/position.
- Interaction states: default, hover, focus, active, pressed, selected, disabled, loading, success, error, empty, expanded and dismissed.
- Motion: trigger, distance, duration, easing, looping, scroll relation and reduced-motion fallback.
- Responsive behavior at large desktop, compact desktop/tablet, phone and narrow phone.

Do not infer unseen screens as facts: label assumptions and build the smallest coherent extrapolation that preserves the system.

## 2. Define a design specification

Before writing page markup, translate observations into a compact specification:

1. One-sentence visual thesis and product tone.
2. Ordered page/route map and purpose of each region.
3. Design tokens: colors (semantic names), typography, spacing scale, widths, radii, borders, shadows, motion and breakpoints.
4. Reusable components and variants, including all meaningful states.
5. Asset plan: reuse existing supplied assets first; create faithful CSS/SVG/canvas visuals where source is code-native; never substitute unrelated stock art.
6. Interaction map: trigger → state change → feedback; identify keyboard/touch equivalent.
7. Responsive map and accessibility notes.

## 3. Implement faithfully

- Follow the existing framework, routing, package manager, component conventions, linting style and installed libraries. Avoid replacing the stack or adding dependencies when existing tools suffice.
- Implement the entire requested experience and all referenced routes/sections; a polished first viewport is not a complete replication.
- Centralize shared design tokens. Reuse components rather than copying near-identical markup. Preserve content meaning and information hierarchy.
- Recreate custom visuals in their natural medium (HTML/CSS/SVG/canvas/WebGL) when that is how the reference works. Prefer supplied assets. Avoid fake screenshots for interfaces that must be responsive or interactive.
- Match composition before micro-decoration: overall proportions and spacing, typography, colors, assets, then shadows and small details.
- Implement every visible control as a real action or clearly disabled/preview state. State must remain consistent across coupled controls and routes. Do not claim a backend action succeeded unless it did.
- Do not add tests unless requested. If the user asks for verification, run only relevant checks and report the results.

## 4. Quality bar

- Responsive without horizontal overflow, clipped controls, overlapping text or unreadable shrinking.
- Semantic landmarks, ordered headings, labels, keyboard operation, visible focus, sufficient contrast, accessible names for icon-only controls and status announcements for asynchronous changes.
- Reduced-motion support for entrances, loops, smooth scrolling, parallax and interactive 3D; preserve content visibility when animation is disabled.
- Efficient rendering: defer offscreen heavy visuals, cap high-DPI canvases, clean up listeners/observers/animation loops, and provide a useful fallback for unsupported features.
- Avoid layout shifts; use stable dimensions and transform/opacity for animation.
- Keep sample/fictional data identified, preserve privacy and payment limitations, and maintain required legal/product disclaimers.

## 5. Final pass

Compare the built experience to reference region by region and at multiple widths. Correct large deviations first, then details. Verify all controls with keyboard and pointer, inspect reduced-motion behavior, and check that fallback and empty/error states remain coherent. Summarize what changed, how it works, any important limitations, and where the implementation lives. Be precise about what you actually verified.
