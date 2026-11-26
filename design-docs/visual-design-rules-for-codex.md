# Visual Design Rules for Codex

Use this file as the visual quality standard for this project. Follow it whenever creating or modifying frontend UI. These rules apply to every page, component, responsive state, and interaction.

## 1. Color system: strict 60-30-10 rule

Build the interface around a deliberate three-part color system:

- **60% - dominant/base:** the main page background and large surfaces. Use a restrained neutral such as warm off-white, paper, charcoal, or a carefully chosen brand-tinted neutral.
- **30% - secondary:** supporting surfaces, navigation, sections, panels, and structural contrast. Use a complementary neutral or a muted version of the brand color.
- **10% - accent:** the strongest brand color. Reserve it for primary actions, important highlights, active states, key data, and small visual moments.

Rules:
- Define the palette with CSS variables or design tokens before building pages.
- Keep the same palette consistent across the entire product.
- Check text/background contrast and make all states readable.
- Use semantic colors for success, warning, and error only where needed.
- Do not add extra colors just to make a screen feel more lively.
- Do not assume every product needs blue, purple, or green. Choose colors that fit the product, audience, and visual direction.
- The 60-30-10 ratio is a visual guide, not a requirement to make every component mathematically exact.

## 2. Strictly avoid these visual habits

Do not use:
- Glassmorphism, frosted-glass panels, translucent blurred cards, or glass navigation.
- Generic gradients, gradient text, gradient borders, or glowing gradient blobs.
- Capsule/pill-shaped tags, badges, filters, or navigation items. Use compact rectangular labels with modest corner radii when labels are needed.
- Excessive rounded cards. Use a clear radius scale and prefer crisp, intentional geometry.
- Decorative blobs, random floating orbs, meaningless 3D objects, or stock-looking AI illustrations.
- Huge empty hero sections with generic slogans.
- Excessive shadows, nested cards, or borders around every element.
- Emoji as interface icons.
- Generic dashboard layouts that look copied from a template.
- Em dashes (—) or en dashes (–) in UI copy, headings, labels, comments, or generated content. Use commas, colons, parentheses, or separate sentences instead.
- Fake data, fake testimonials, fake customer logos, fake metrics, or placeholder content in a finished interface.

Use gradients only if the product's visual identity genuinely requires one and the design reference demonstrates a purposeful use. The default is solid colors.

## 3. Typography: make it feel art-directed

Typography is a major part of the design, not a finishing detail. Choose a deliberate type system with a display face for headlines and a highly readable face for body text and controls.

Consider these premium, professionally designed typefaces:

1. **Neue Haas Grotesk**: refined, precise Swiss-style sans serif. Strong choice for clean product interfaces, navigation, and editorial headings. Commercial license required.
2. **Söhne**: contemporary grotesk with a polished, confident feel. Excellent for premium SaaS and product interfaces. Commercial license required.
3. **Canela**: expressive editorial serif with elegant contrast. Use selectively for large headlines or editorial moments, not dense UI. Commercial license required.
4. **GT Super**: distinctive display serif with a confident editorial character. Use for a small number of high-impact headings. Commercial license required.

Important font rules:
- Do not assume these fonts are installed or freely usable. Check project assets and licensing before using them.
- Never fake a premium font by naming it in CSS when the actual font files are unavailable.
- If a licensed font is unavailable, use a visually appropriate, legally available alternative. Good alternatives include **DM Sans**, **Manrope**, **Plus Jakarta Sans**, **Space Grotesk**, **Instrument Sans**, and **DM Serif Display** from Google Fonts.
- Prefer one strong sans-serif family for the interface. Add a display serif only when it supports the product's identity.
- Use no more than two font families in the same interface.
- Define a consistent type scale for display headings, page headings, section headings, body text, captions, labels, and buttons.
- Use appropriate font weights and line heights. Avoid making every heading bold.
- Keep body copy comfortable to read. Do not use tiny text to squeeze in content.
- Load fonts efficiently and include sensible fallback stacks.

## 4. Use reliable sources for UI components and visual assets

Do not invent icons, charts, controls, or animations from scratch when a reliable, maintained library is available. Use these sources appropriately:

### Icons
- **Lucide**: https://lucide.dev/
- Use `lucide-react` for React projects.
- Keep icon style, stroke weight, and sizing consistent.
- Use icons that clearly communicate their purpose. Avoid decorative icons that add no information.
- Do not mix Lucide with random icon packs or emoji.
- Do not use Unicode symbols as substitutes for proper interface icons.

### Charts and data visualization
- **Recharts**: https://recharts.org/
- Use Recharts for standard React charts when it fits the project.
- Use **Apache ECharts** (https://echarts.apache.org/) for more advanced or highly interactive visualizations.
- Use **Nivo** (https://nivo.rocks/) when its chart types and design fit the requirement.
- Choose the simplest suitable library. Do not add a chart library for a screen that only needs a simple number or progress indicator.
- Charts must have readable labels, units, legends, tooltips, sensible scales, and responsive behavior.
- Never fabricate data. Clearly label demo data when real data is not available.

### Animation and interaction
- **Motion for React**: https://motion.dev/
- Use Motion for purposeful transitions, entrance sequences, layout changes, hover feedback, and interaction states.
- Use **GSAP** (https://gsap.com/) only when a more controlled timeline or complex sequence is genuinely needed.
- Use **React Three Fiber** (https://r3f.docs.pmnd.rs/) and **Three.js** (https://threejs.org/) only when 3D meaningfully supports the product or story.
- Animation must explain state, guide attention, or improve feedback. Do not animate everything.
- Keep transitions short and smooth. Respect `prefers-reduced-motion`.
- Avoid constant looping animations, distracting parallax, unnecessary particles, and heavy 3D scenes that slow down the interface.

### Buttons, forms, and accessible primitives
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/primitives
- Use the project's existing component system first. If the project uses shadcn/ui, extend its components rather than creating inconsistent replacements.
- Buttons must have clear hierarchy: primary, secondary, tertiary/ghost, and destructive where appropriate.
- Provide hover, focus-visible, active, disabled, and loading states.
- Use semantic HTML and accessible labels. Ensure keyboard navigation works.
- Do not make every button pill-shaped. Use a restrained radius consistent with the design system.

### Design references and inspiration
Use these for research and visual direction, not for blindly copying a whole interface:
- **Mobbin**: https://mobbin.com/
- **Godly**: https://godly.website/
- **Awwwards**: https://www.awwwards.com/
- **Refero**: https://refero.design/
- **Dribbble**: https://dribbble.com/

Before designing a major screen, identify a relevant reference or establish a clear visual concept. Do not combine unrelated patterns from multiple references.

## 5. Layout and component quality

- Establish a consistent spacing scale and use it throughout the application.
- Use a clear grid, alignment system, and content-width rules.
- Create hierarchy through typography, spacing, contrast, and composition, not through piles of cards.
- Give each page one clear primary action.
- Make navigation understandable and consistent.
- Use whitespace intentionally. Avoid both cramped layouts and enormous empty gaps.
- Use borders and shadows sparingly and consistently.
- Prefer simple, purposeful shapes over decorative complexity.
- Make the interface responsive at mobile, tablet, laptop, and wide desktop sizes.
- Design empty, loading, error, success, and disabled states, not only the ideal populated state.

## 6. How to work before writing large amounts of code

For each major page or feature:

1. Inspect the existing app, routes, components, dependencies, and design conventions.
2. Identify the user, purpose of the page, and most important action.
3. Establish the visual direction, palette, typography, spacing, and component style before implementation.
4. If useful, inspect one or two relevant references from the sources above. Do not spend excessive time browsing.
5. Build the page structure and the most important screen first.
6. Reuse existing components and dependencies where possible. Do not install a new library without a clear reason.
7. Run the app and inspect the actual rendered result at desktop and mobile widths.
8. Fix visual problems visible in the browser. Do not assume the page looks correct because the code compiles.
9. Check accessibility, responsive behavior, loading states, and console/build errors.

## 7. Codex implementation behavior

- Read this file before making frontend changes.
- Do not redesign unrelated pages or alter working product functionality unless requested.
- Do not replace real content or data with placeholders.
- Do not introduce a new design system on every page. Maintain one coherent visual language.
- Avoid large, speculative rewrites. Work in small, reviewable steps.
- For a large task, first state the proposed visual direction and implementation plan briefly, then implement the highest-value screen.
- Do not spend hours polishing invisible abstractions. Prioritize the rendered UI and the user's core workflow.
- After implementation, summarize the files changed, visual decisions made, and checks actually completed. Never claim to have tested something that was not run.

## Final quality check

Before considering a page complete, verify:

- [ ] The 60-30-10 color balance is clear and consistent.
- [ ] No glassmorphism or generic gradients have slipped in.
- [ ] No capsule-shaped tags or unnecessary pill controls are used.
- [ ] No em dashes or en dashes appear in interface copy.
- [ ] Typography has a deliberate hierarchy and valid font sources.
- [ ] Icons come from one consistent icon library.
- [ ] Charts use a suitable chart library and truthful data.
- [ ] Animations are purposeful, restrained, and accessible.
- [ ] Buttons and forms have complete interaction states.
- [ ] The page is responsive and visually inspected in the browser.
- [ ] The result feels designed for this product, not like a generic AI-generated template.
