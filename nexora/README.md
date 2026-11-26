# NEXORA

An editorial landing page for a team AI workforce. Built with Vite, React, and TypeScript. The hero and final call to action share a custom WebGL2 ribbon shader; product visuals are HTML and CSS.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Tune the shader

The raw WebGL2 shaders live in the `Field` component in `src/main.tsx`.

- Edit `base`, `violet`, `coral`, and `hot` in the fragment shader. They are normalized RGB values from 0 to 1.
- Adjust `t*(.042+s*.025)` for the base animation rate and scroll response.
- Change the grain multiplier (`.03`) and cursor bend (`.15`) to tune texture and parallax.
- The CTA uses the same shader with a warmer-state uniform.

The canvas caps DPR at 2 (1.25 on narrow screens), pauses outside the viewport, eases pointer movement, reacts subtly to scroll, and renders a static frame when reduced motion is requested. A CSS gradient remains visible when WebGL2 is unavailable.

## Runtime note

The local npm registry connection did not respond during dependency installation, so GSAP and Lenis could not be added in this environment. The page uses native scrolling and local CSS / IntersectionObserver motion. Its dependencies remain React and Vite; no Three.js or image-based product mockups are used. Fonts are Hanken Grotesk and IBM Plex Mono from Google Fonts.
