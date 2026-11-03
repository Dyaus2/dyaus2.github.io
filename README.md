# Hazem Ilahi — Portfolio · https://dyaus2.github.io

Immersive 3D portfolio: scroll to fly a camera through a **neural-network cosmos** where every glowing cluster is a project.

**Stack:** Vite · React 19 · TypeScript · Three.js via React Three Fiber (drei, postprocessing bloom) · GSAP ScrollTrigger · Web Audio API.

## Features
- Cinematic preloader ("neural boot" + percentage), curtain reveal.
- Particle avatar "HI" that assembles, reacts to the mouse and explodes as you scroll away.
- Scroll-driven camera path through 7 project clusters, the journey spine, a 3D skill sphere and a final pulsing core, with a speed-based FOV warp.
- Click a cluster (or "Explore project"): the camera zooms in and a panel opens with metrics that count up. ← / → / Esc work.
- EN/FR toggle (remembered), glitch/scramble text, magnetic buttons, glowing particle cursor (desktop).
- Synthesised ambient sound + UI blips (off by default; equaliser button).
- Auto-adapts: particle budgets by device, PerformanceMonitor lowers resolution/effects, honours `prefers-reduced-motion`, 2D fallback when WebGL is unavailable.

## Edit the content
Everything (projects, timeline, skills, certifications, contact) lives in **`src/content/data.ts`** (EN + FR side by side); UI labels in `src/content/i18n.tsx`.
- **Hedera certifications:** set `show: true` and the exact titles in the `certs` array once issued.
- **CVs:** replace `public/cv/Hazem_Ilahi_CV_EN.pdf` / `_FR.pdf` (keep the names).

## Run locally
```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
```

## Deploy
Every push to `main` runs `.github/workflows/deploy.yml` (build → GitHub Pages).
One-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
