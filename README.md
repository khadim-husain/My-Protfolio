# Khadimhusain: cinematic AI-agent portfolio

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

- `?agents=on` / `?agents=off` forces the robot build animation on or off for that visit.
- Dock + keyboard: **T** tour (starts/stops) · **A** agents on/off · **P** pause/resume · **Esc** stop tour.
- Agents preference is saved in `localStorage` (`kh-agents`). Reduced-motion users get the content immediately.
- Content lives in `src/lib/portfolio-data.ts` (all from `public/resume.pdf`). Timing lives in `src/lib/animation-config.ts`.
- Scheduler: `src/lib/agent-engine.ts`. Mark any element with `data-build="id" data-anim="type|pop|wipe" data-order="n"`
  (inside a `data-section`) and the agents will build it.
