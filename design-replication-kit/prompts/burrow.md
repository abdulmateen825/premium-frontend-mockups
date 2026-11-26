# Burrow — design replication prompt

Recreate the **Burrow** roommate-household app landing experience as a complete, responsive React page. Use the current repository and its existing stack first. Treat the visual and interaction details below as the design brief. Preserve the new app's real content and user goals; use Burrow's wording only as placeholder inspiration. The reference is the `burrow/` project in this workspace.

## Design intent

Make household admin (chores, shared bills and shopping) feel warm, fair and low-friction, like a friendly illustrated object you can touch. The voice is lightly witty and specific to shared-house life, never childish or corporate. It should feel like a tactile, colorful, handmade-feeling product, not a conventional SaaS dashboard.

## Visual system

- Light cream canvas (`#FFF4E6`) and deep plum-ink text (`#2B2140`); saturated tomato (`#FF6B5B`), sunflower (`#FFC933`), mint (`#4FD1A5`), sky (`#5BB8FF`), lilac (`#A78BFA`) and bubblegum (`#FF8FC7`) are role-based accents. Define these as reusable CSS variables.
- Display face: Gabarito (heavy, compact, friendly headlines); body: Hanken Grotesk (clear, human reading). Keep system fallbacks.
- Large rounded forms: roughly 28–52px radii. Cards are thick, soft, colorful “clay” objects: bright radial top-left sheen, dark inset lower bevel, soft cast shadow, slight grain/noise and restrained highlight. Pressed state changes inset depth and moves down; hover lifts slightly. Avoid flat pastel cards and generic glassmorphism.
- Buttons are pill-shaped, weighty, high contrast, beveled; tactile hover and pressed feedback. Kicker labels have a small colored bead. Generous vertical whitespace and bold, tightly set headlines contrast with readable body copy.
- Use responsive max-width content wrapper and consistent spacing. Avoid overusing decorative effects; reserve clay treatment for meaningful objects.

## Page, in order

1. **Header:** left Burrow wordmark with the small three-hole burrow emblem; centered links (“How it works”, “The rota”, “Pricing”); prominent “Get the app” pill. On mobile use a real toggle button, expanded state, close on Escape and after selecting a link.
2. **Hero:** two-column at desktop, stacked at narrow widths. Left: kicker “Roommate life, a little lighter”; three-line oversized headline about roommates without group-chat drama; short explanation; filled household-start CTA and quieter how-it-works link; row of four tiny character avatars plus reassuring sentence. Right: custom composition, not stock art: two overlapping rounded clay blocks, four named blob roommates, and floating household objects (coin, sponge, pizza, toilet-paper roll) plus handwritten-style note. Layer objects with intentional depth and gentle movement. Keep all essential meaning in HTML text.
3. **Reminder marquee:** rounded light band with repeating household micro-reminders (dishes, bins, yogurt, hob, plants, subscription); varied accent chips and small stars. Loop seamlessly, keep readable, honor reduced-motion; never make it the only source of information.
4. **Problem statement:** large editorial text with a few colored inline words illustrating familiar group-chat requests; concise aside about fewer follow-up texts and more sofa time.
5. **Chore rota:** kicker, headline and short intro. A large circular lilac wheel with inner ring, dashed orbit, four roommate avatars/names around it and central “THIS WEEK”; pointer fixed above it. Beside it, a colorful changing card names who is on the rota, chore, friendly one-line instruction, fairness note and next control. Desktop scroll may pin and rotate wheel through four roommates while synchronizing the card; provide the explicit “Next” button as an equivalent accessible/manual control. On mobile remove pinning; make control usable without scroll tricks.
6. **Bill splitting:** warm cream section; left title and three selectable numbered steps (add bill, choose participants, settle up) with descriptions. Right is a large CSS-drawn phone in a colored clay shell. Phone UI has greeting, total/status card, staged bill breakdown, roommate shares or settled confirmation, button and step dots. Clicking steps/dots and desktop scroll progression must update the same UI state. Mobile must not pin the phone.
7. **Shared shopping list:** four wide, colorful tactile cards for milk, oat milk, dish soap and bulbs. Create product mini-art with CSS geometry (bottle, carton, sponge, bulb pack) rather than unrelated stock thumbnails. Cards are real buttons; clicking checks/unchecks, changes check icon, line-through, scale/pressed surface and `aria-pressed`. Desktop grid; mobile horizontally scrollable snap track with keyboard access and a visible swipe hint.
8. **Bento feature grid:** large mint two-row streak tile with count and “Add a tidy day” action; sky quiet-hours tile with semantic toggle; tomato shared-subscriptions tile with oversized subtle letter and overlapping character avatars; sunflower reminder tile with illustrated bell and toggle. Controls visibly change state; labels describe state; no false system notification claims.
9. **Testimonials:** peach ground, three slightly rotated colored note cards with large quote mark, short roommate-specific copy and byline. Label mock/sample quotes as illustrative, never fabricate real endorsements.
10. **Pricing:** two side-by-side clay plan cards, free and larger/lilac Plus, feature lists and CTAs; jaunty sunflower sticker. Preserve clear price units and responsive stacking.
11. **Final CTA:** full-width tomato section, enormous short headline, cream CTA and all four characters peeking/waving from the bottom edge.
12. **Footer:** logo, three link columns, giant cropped tomato wordmark as background typography and simple legal / sign-off row.

## Original character art (high priority)

Burrow's four roommates Pip (tomato), Moss (mint), Dot (sky), Sunny (sunflower) are the visual identity. Make them custom irregular blob SVGs with subtly different silhouettes, two simple eyes, curved smile, translucent gloss overlay and small cheek shine. Reuse the same component and colors for hero, avatars, wheel, bill split, feature card and CTA peeking row. Add occasional staggered eye blinks only when motion is allowed; clean up timers and pause when offscreen if practical. Preserve accessible names when informative; mark decorative repeats `aria-hidden`. Don't substitute emoji, stock art or a generic avatar pack.

## Motion and interaction

- Use short, elastic but controlled reveal entrances, hero line mask reveal, small object float, card hover/press, and smooth scroll only if an installed library already supports it.
- Desktop chore wheel is scroll-scrubbed/pinned; phone demo may be pinned to its section. The wheel/bill step must be a single source of truth shared with manual controls, not separate contradictory animations.
- Marquee runs slowly and continuously; offer a pause control if present in the source/reference. Stop or simplify all continuous motion for `prefers-reduced-motion`.
- No layout-shifting animation; use transform/opacity. Don't hijack scroll on mobile. Do not autoplay motion that obscures reading.

## Responsive, accessibility, quality

- Match the reference breakpoints roughly at 980/900/760/420px: hero stacks by tablet; menu replaces nav on mobile; sections collapse; chores stack; phone follows copy; shopping becomes swipeable; bento/testimonials/plans stack; footer becomes two columns. Reflow the artwork instead of shrinking it until illegible.
- Semantic landmarks/headings, skip link, focus-visible ring, keyboard-operable buttons, explicit labels, truthful pressed/expanded states, alt text for meaningful SVG, sufficient contrast. Give controls targets around 44px; respect reduced motion.
- Keep CSS tokens, shared character, card and button styles; avoid one-off inline style values unless driven by character/active-state data.
- If cloning the working demo, preserve its clearly labeled fictional/sample nature; keep frontend-only demos local and do not pretend payment, reminder delivery, sign-up or persistence exists unless actually implemented.

## Build approach

Inspect existing files and dependencies before editing. Implement the whole scroll story, not only the hero. Prefer hand-authored React/SVG/CSS to new image dependencies. Use existing motion tools only where already available; provide native interactions without them. At completion summarize files changed and any interaction/demo limitations. Do not add tests unless requested.
