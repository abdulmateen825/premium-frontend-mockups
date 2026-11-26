# Nexora — design replication prompt

Recreate the Nexora editorial landing page for an AI agent-operations platform. Inspect the current project before editing and use its stack. Maintain the dark, precise, premium B2B tone: the product is a governed team of agents with defined roles, connected tools, audit trails and human review.

## Visual direction

Near-black charcoal canvas (#0b0b0d range), faint technical grid, warm white type, subdued gray supporting text and restrained hot coral/orange with violet undertones. Use Hanken Grotesk for clean body and IBM Plex Mono for all metadata, status, section indexes and system labels. Avoid generic purple AI gradients. Editorial typography is large and spare; the UI mockups use thin gray borders, compact typography and careful alignment. A glowing fluid coral/violet ribbon is the signature visual.

## Structure and signature elements

- Header: compact geometric four-part mark and NEXORA wordmark; anchor links Capabilities, Method, Product, Ecosystem; log in and coral get-started CTA; accessible mobile menu.
- Hero: full-height dark shader field with fine grid overlay; tiny metadata row (platform/version/system status/date); left-aligned three-line headline “Give agents / work worth / doing.”, supporting role/boundary/human-judgment message, primary and video-style secondary actions, mono operational stats. Small right-side coordinates/system annotation and scroll cue.
- Proof: understated connected-tool strip with repeating Linear, Stripe, Slack, Postgres, Vercel wordmarks.
- Capabilities: indexed mono label and oversized paragraph with inline bordered chips for role, bounded brief and connected tools; emphasize human escalation and reliable routine work.
- Method: three vertical “BRIEF / RUN / REVIEW” text steps paired with sticky small product window. Window has app chrome, sidebar, working panel; its UI changes among a task brief, staged multi-agent handoff and review-ready output as the reader moves through steps. Track active step with intersection, not only hover.
- Product: large headline and realistic dashboard mockup in a browser frame. Dashboard has side nav, account, date range, greeting/status, metrics, restrained coral activity area chart and recent activity rows. Use HTML/SVG, not screenshot raster, so it stays crisp and responsive.
- Ecosystem: three expandable rows for Workspace, shared context and specialist marketplace. Accordion reveals one short explanation and a simple system diagram. Make button state and keyboard behavior real.
- Practice quote: very large restrained quotation and mono attribution.
- CTA: full-width warmer coral/violet instance of same animated field and grid, compact invitation and CTA.
- Footer: brand, short promise, grouped platform/company/social links, legal metadata, oversized low-contrast NEXORA wordmark.

## Ribbon field and motion

Reference implements a custom WebGL2 fragment shader: noise-shaped flowing sine ribbons, dark base, violet field, coral hot line, subtle grain and vignette. React canvas uniforms respond gently to pointer and scroll; CTA uses a warmer state. Cap DPR (2, lower on small screens), resize with ResizeObserver, pause rendering when not visible, dispose listeners/resources and show CSS gradient if WebGL2 fails. Reduced motion renders a static frame. Use local shader/native observers as in reference; do not add Three.js or fake product screenshots. Entrance reveals, scroll-active workflow panel, mild parallax and slow marquee should remain restrained and stop for reduced motion.

## Fit and behavior

Keep ample negative space and consistent max-width. At narrow widths stack hero and method, use readable scrollable or simplified dashboard, collapse navigation, avoid clipped copy, make diagrams fit, and retain status hierarchy. Provide semantic anchors, visible focus, labeled controls, meaningful status copy and reduced-motion support. All metric/customer/workflow data must be labeled as illustrative if used as mock data; do not invent proof. Preserve product intent/content where it differs. Inspect existing dependencies; don't add a heavy canvas library when the native shader pattern suffices. Implement all sections and interactions, then report changed files and known demo limitations. No tests unless asked.
