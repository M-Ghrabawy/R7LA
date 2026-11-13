# SPACE RELICS — AFTERLIGHT

**Humanity's footprints beyond Earth.**

An interactive space archaeology archive of human-made objects on the Moon and Mars, presented through **REX**, an original fictional archaeological explorer, and a five-chapter evidence-led story mode.

> Every mission leaves something behind. Every relic has a story. And every story deserves to be remembered.

SPACE RELICS is an independent editorial project by **AFTERLIGHT**. It is not affiliated with, endorsed by, or operated by NASA.

---

## What is included

### Archive

- 14 researched artifact records across the Moon and Mars.
- 60 source records, 43 evidence claims, 71 timeline events, and 27 local NASA photographs.
- Physical status separated from operational status:
  - present
  - present but not directly imaged
  - active
  - passive but still detectable
  - inactive
  - decommissioned
- Verified mission records separated from scientific interpretation and hypothetical scenarios.
- Sourced coordinates with precision labels.
- Planned versus actual operational lifetime comparisons.
- Editorial Legacy Score with adjustable weights and explicit “not a NASA rating” disclosure.

### Observatory and Explorer

- Procedural Moon and Mars globes.
- Instanced starfield and artifact markers.
- 3D orbit and 2D coordinate-plot modes.
- Search, mission/category filters, coordinates, and status indicators.
- WebGL error boundary and 2D fallback.

### Relic investigations

Each relic page includes:

- REX Discovery Log with citations.
- NASA historical photography with attribution.
- Interactive AFTERLIGHT schematic, clearly labeled as not flight hardware.
- Mission purpose, operational history, current condition, and scientific legacy.
- Planned versus actual lifetime study.
- Mission timeline.
- Evidence chain.
- Legacy assessment.
- REX field study entry point.
- Object-aware grounded assistant.

### REX Expedition

Five interactive chapters:

1. **The Departure**
2. **Silent Footprints**
3. **The Forgotten Journey**
4. **What Remains**
5. **A Message to Tomorrow**

Plus **14 field studies**, one for every relic.

Story features:

- Consistent original SVG REX character, based on the supplied reference, **without the cape**.
- Reusable vector landscapes, artifact props, character poses, expressions, and scene transitions.
- Data-driven scene system.
- Reusable interactive puzzles:
  - hotspot site scans
  - mission-event sequencing
  - status classification
  - evidence classification
  - interpretation choices
- Source citations attached to scenes and Discovery Logs.
- Browser-synthesized ambient audio for every scene and interaction sound effects.
- Audio muted until the visitor enables it.
- Scene audio pauses when the tab is hidden.
- Local-only chapter and field-study progress.
- Reduced-motion support through global CSS preferences.

### AI / REX assistant

- Provider abstraction:
  - `demo` — deterministic responses from structured archive records, no LLM.
  - `openai-compatible` — optional live model with grounded archive context.
- No API key is required for demo mode.
- Demo mode is visibly labeled.
- Citations are limited to stored sources.
- Hypothetical answers are labeled.
- Cadet and Archivist reading levels.
- Request validation, rate limiting, and citation filtering.

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Observatory landing experience |
| `/explore` | Planet Explorer |
| `/relics/[id]` | Artifact investigation |
| `/timeline` | Mission chronology |
| `/evidence` | Claim and citation ledger |
| `/legacy` | Adjustable editorial assessment |
| `/archaeologist` | Talk to REX |
| `/rex` | Five-chapter expedition hub |
| `/rex/chapter/[slug]` | Playable REX chapter |
| `/rex/relic/[id]` | Playable relic field study |
| `/about` | Methodology, attribution, AI and fiction disclosures |
| `/api/assistant` | Grounded assistant endpoint |
| `/api/health` | Health check |

---

## Getting started

Requirements:

- Node.js 20 or newer
- npm

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Production:

```powershell
npm run build
npm run start
```

---

## Environment variables

AI is optional. Without a key, REX demo mode is used and visibly labeled.

Copy `.env.example` to `.env.local`:

```env
AI_PROVIDER=openai-compatible
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4.1-mini
```

Set `AI_PROVIDER=demo` to force demo behavior even if a key exists.

Never commit `.env.local` or API keys.

---

## Scripts

```powershell
npm run dev           # Development server
npm run build         # Production build
npm run start         # Production server
npm run typecheck     # TypeScript check
npm run lint          # ESLint
npm run validate:data # Schema, source, story, and asset validation
npm run check         # typecheck + lint + validate:data
npm run smoke         # Route and assistant API smoke test
npm run check:sources # Verify all source URLs respond
npm run ingest:nasa   # Refresh normalized NASA image metadata manifest
```

`npm run smoke` expects a running server at `http://localhost:3000`, or set:

```powershell
$env:BASE_URL="http://localhost:3000"; npm run smoke
```

---

## Data architecture

- `src/data/relics.ts` — artifact records.
- `src/data/sources.ts` — central source registry and NASA image catalog.
- `src/data/rex/chapters.ts` — five data-driven chapters.
- `src/data/rex/discovery-logs.ts` — 14 REX logs.
- `src/data/rex/field-studies.ts` — reusable field-study generator for every relic.
- `src/lib/story/schema.ts` — Zod schemas for scenes, puzzles, logs, and chapters.
- `src/lib/story/audio.ts` — Web Audio ambient engine and sound effects.
- `src/lib/story/progress.ts` — local completion state.
- `scripts/validate-data.ts` — cross-checks sources, artifacts, scenes, and puzzles.

### Adding a story scene

Add a typed scene object to a chapter or field study in `src/data/rex/`. The player renders scenes by `kind` and supports `hotspot`, `sequence`, `classify`, and `choice` puzzles. Scenes can reuse any environment, prop, and REX pose.

Every scene should define:

- `audioTheme`
- `rexPose`
- `rexExpression`
- `background`
- `props`
- `sourceIds`
- `artifactIds`

Run `npm run validate:data` after editing.

---

## Audio

- Ambient soundscapes are synthesized at runtime through the Web Audio API.
- No external or copyrighted audio assets are bundled.
- Audio is muted until the visitor presses **Enable audio**.
- Every scene has its own ambient theme.
- Puzzles, hotspot reveals, advances, errors, and completion use synthesized cues.
- Audio pauses when the tab is hidden.
- Reduced-motion mode does not disable audio automatically; sound remains a separate control.

---

## Source and media policy

Primary source families:

- NASA NSSDCA Master Catalog
- NASA mission pages
- Apollo Lunar Surface Journal
- NASA Image and Video Library
- NASA / LROC lunar imaging
- International Laser Ranging Service
- NASA Solar System Exploration

Rules:

- No invented dates, coordinates, lifetimes, or citations.
- Missing data stays missing.
- Approximate and landing-ellipse coordinates are labeled.
- NASA imagery is linked to its original Image and Video Library record.
- No NASA logo, insignia, or implied endorsement.
- Vector scenes and schematics are original AFTERLIGHT visualizations, not NASA mission footage, recovered telemetry, or flight hardware.

---

## REX disclosure

REX is an original fictional character created by AFTERLIGHT for SPACE RELICS. REX is not a NASA robot, mission, or official spokesperson. Narrative dialogue is interpretive storytelling built around sources. Puzzles are educational reconstructions and not operational simulations.

---

## Known limitations

- No authentic NASA GLB/GLTF model is bundled; schematics are illustrative.
- Some Mars final positions are approximate or represented by landing regions.
- Active mission status should be checked against current NASA updates.
- REX story scenes are vector interpretations, not historical imagery.
- The Legacy Score is an editorial instrument, not an official rating.
- Live LLM mode requires an external API key and has not been exercised in demo-only environments.

---

## Git

The project is developed with local commits. Do not commit secrets or generated caches. Ignored directories include `.next`, `node_modules`, `.tmp`, `.npm-cache`, and environment files.

---

## License and attribution

Original application code, visual identity, REX character, vector scenes, and editorial text: © 2026 AFTERLIGHT.

NASA imagery remains subject to NASA media usage guidelines. Source links and attribution are displayed with each image. No NASA endorsement is implied.
