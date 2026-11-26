# Mangalyaan-X — Space Organisation of India

A responsive React + Vite concept site for the PICT ACM Pulzion ’18 web development brief. It imagines a human Mars programme with a procedural Three.js planet, a scroll-linked spacecraft route, mission timeline, crew support information and a local interest form.

> **Concept only:** SOI, Mangalyaan-X, the future dates, heritage metrics and mission details on this page are fictional. This is not an official agency site, an actual astronaut application or a real seat reservation.

## Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal. For the reservation form, start the API in a second terminal from this folder:

```bash
npm run server
```

Vite forwards `/api/*` requests to the local Express service at `127.0.0.1:3001`. Form submissions are validated and appended to `server/data/reservations.json`. The file is created on the first successful submission. The API also exposes `GET /api/health`.

To create a production bundle:

```bash
npm run build
npm run preview
```

## Project map

```text
src/
  App.jsx       Page sections, content, form state and accessible controls
  scene.js      Procedural Mars, Phobos, Earth, route, spacecraft and particles
  motion.js     GSAP / ScrollTrigger, Lenis, reveal, parallax, tilt and cursor
  styles.css    Tokens, layout, responsive styles and reduced-motion rules
  main.jsx      React entry point
server/
  server.js     Express validation and JSON-file persistence
```

## Judging brief map

| Requirement | Implementation |
| --- | --- |
| 0. Attention-grabbing animation | `src/motion.js`: split hero reveal, ScrollTrigger section entrances, progress line, parallax, tilt, magnetic CTAs and partner marquee. `src/scene.js`: rotating procedural Mars and scroll-progress spacecraft. Motion is reduced when the system preference requests it. |
| 1. Mars images with descriptions | `src/App.jsx`: six inline SVG terrain illustrations and descriptive field-guide cards. No external image files are required. |
| 2. Trip timeline | `src/App.jsx`: eight mission stages. `src/motion.js`: pinned desktop intro and scroll-drawn timeline line. |
| 3. SOI achievements | `src/App.jsx`: count-up concept metrics and milestone gallery. The section labels the fictional heritage clearly. |
| 4. Services and requirements | `src/App.jsx`: six crew-support tiles and an interactive, non-binding self-check list. |
| 5. 3D animation library | `src/scene.js`: Three.js geometry displacement, craters, vertex-coloured terrain, atmosphere, orbit, moon, Earth, spacecraft, route, lighting and particles. |
| Bonus: small backend | `server/server.js`: validated `POST /api/reserve`, local JSON persistence and `GET /api/health`; `vite.config.js` provides the development proxy. |

## Notes

- The form records demo interest only; it does not create a booking or payment.
- The scene is generated in code and falls back to the page’s pale gradient if WebGL is unavailable.
- The scene caps pixel ratio at 2, uses fewer particles on small screens, pauses rendering when the tab is hidden and disposes Three.js resources on unmount.
- Google Fonts are progressive enhancements; local system fallbacks remain defined.

## Theme system

The site opens in dark theme by default, unless the visitor has already chosen a theme or the system preference requests light on a first visit. The navbar sun/moon control stores a choice under `soi-theme` in local storage. If storage is blocked, the toggle still works for the current page session. The inline script in `index.html` sets the theme before styles load to avoid a flash of the wrong palette.

Edit the shared light palette in the `:root` block and its dark counterpart in `[data-theme="dark"]` in `src/styles.css`. The same theme tokens include Three.js scene colors and light intensities. `src/scene.js` listens for `soi:theme` and eases the scene lighting, fog, background, particles, stars and route opacity to their new values. The page respects `prefers-reduced-motion`; it renders the theme change immediately when animation is reduced.

The pinned timeline heading is implemented with CSS sticky positioning in `src/styles.css` so it stays in normal document flow and does not overlap its timeline cards. The timeline progress line remains scrubbed by ScrollTrigger in `src/motion.js`.
