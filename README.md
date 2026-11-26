# Premium Frontend Mockups

A collection of four independent React experiences, plus project-wide design guidance and reusable Codex prompts and skills. Each app has its own dependencies and commands; install and run it from that app's folder.

## Projects

| Folder | Experience | Main technologies |
| --- | --- | --- |
| [`burrow/`](burrow/) | A playful roommate-household landing page covering chores, bill splitting, shopping lists and household features. | React, TypeScript, Vite, GSAP, Lenis, custom SVG/CSS artwork |
| [`nexora/`](nexora/) | An editorial website for an AI-agent operations platform, with workflow and dashboard mockups. | React, TypeScript, Vite, native WebGL2 shader |
| [`ecommerce-experience/`](ecommerce-experience/) | Obsidian Audio headphone campaign, product detail, interactive product preview and shopping cart demo. | React, TypeScript, Vite, React Router, Motion, custom WebGL |
| [`soi-mangalyaan-x/`](soi-mangalyaan-x/) | A fictional human Mars mission concept site with a procedural Mars scene and mission story. | React, Vite, Three.js, GSAP, Lenis, Express demo API |

These are separate Vite projects, not one combined app. There is no root `package.json`.

## Requirements

- Node.js and npm compatible with the Vite version in the app you want to run.
- A terminal and browser.

## Run an app

In a terminal, change into one project folder, install its dependencies, then start Vite:

```bash
cd burrow
npm install
npm run dev
```

Replace `burrow` with `nexora`, `ecommerce-experience`, or `soi-mangalyaan-x` to run another project. Vite prints the local address to open in a browser.

To create and preview a production build, run these commands inside an app that defines the scripts:

```bash
npm run build
npm run preview
```

### SOI demo form API

The Mangalyaan-X interest form uses a small local Express API. Start the frontend and API in separate terminals from `soi-mangalyaan-x/`:

```bash
npm run dev
```

```bash
npm run server
```

Vite proxies `/api/*` to the local service. Successful demo interest submissions are stored in `server/data/reservations.json`; that generated file is ignored by Git. The form is not a real astronaut application or seat reservation.

## Design and contribution guidance

Before making frontend changes, read [`design-docs/visual-design-rules-for-codex.md`](design-docs/visual-design-rules-for-codex.md). It defines the shared visual standards for this collection. The other files in [`design-docs/`](design-docs/) provide a design prompt and agent guidance.

The [`design-replication-kit/`](design-replication-kit/) contains detailed prompts and Codex Agent Skills for each app, plus a universal design-replication prompt. The skills are in `design-replication-kit/skills/<project>/SKILL.md`; matching prompts are in `design-replication-kit/prompts/`. See its [README](design-replication-kit/README.md) for usage.

## Repository hygiene

Each app has a `.gitignore`, and the root `.gitignore` excludes dependency folders, build output, local environment files, logs and machine-local agent skills. Do not commit secrets, `node_modules`, or generated `dist` output. Keep each app's lockfile with its `package.json` so its dependencies can be reproduced independently.

## Concept and demo limitations

- Nexora's dashboard values and activity are illustrative product mockup content.
- Obsidian Audio's search/account and checkout/payment flows are previews; no payment is collected.
- SOI and Mangalyaan-X, its dates, heritage figures and mission plans are fictional. The form records local demo interest only.
- Burrow's landing-page controls demonstrate interface behavior; do not assume they connect to a production household service.
