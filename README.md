# R7LA — AFTERLIGHT

**Humanity's footprints beyond Earth.**

R7LA is an interactive space-archaeology archive of human-made objects on the Moon and Mars, paired with a 3D solar-system observatory and a five-chapter REX expedition. Every claim is tied to a stored source; every object is a place you can visit.

> Every mission leaves something behind. Every relic has a story. And every story deserves to be remembered.

R7LA is an independent editorial project by **AFTERLIGHT**. It is not affiliated with, endorsed by, or operated by NASA.

---

## What is included

### Archive

- **14 full primary investigations** across the Moon and Mars.
- **12 extended NASA catalogue records** spanning the Moon, Mars, Ceres, Eros, deep space, and heliocentric orbit.
- **26 archive records** in total, backed by **60 source records**, **43 evidence claims**, and **71 dated timeline events**.
- Physical status is separated from operational status: present, present but not directly imaged, active, passive but still detectable, inactive, decommissioned.
- Sourced coordinates with explicit precision labels.
- Planned versus actual operational lifetime comparisons.
- 27 local NASA photographs with attribution and source links.
- Fourteen REX discovery logs.

### 3D Observatory

- **17 interactive 3D artifacts** across the Moon, Mars, and deep space.
- Cinematic launch pad, orbital solar system, and artifact inspection scenes.
- Procedural PBR models — no external GLB downloads required.
- Vector-style planets and moons rendered with flat, illustrated surfaces.
- Instanced starfield, asteroid belt, elliptical orbits, and surface-pinned artifact markers.
- 2D coordinate plots for every primary object.
- Deep links: `/observatory?artifact=apollo-lunar-modules`.
- WebGL error boundary and graceful fallback.

### REX Expedition

Five interactive chapters:

1. **The Departure**
2. **Silent Footprints**
3. **The Forgotten Journey**
4. **What Remains**
5. **A Message to Tomorrow**

Plus **14 field studies**, one for every primary relic.

Story features:

- Consistent original blue-and-white SVG REX character, without the cape and without reproducing the NASA logo.
- Data-driven scene system with 42 scenes.
- Reusable interactive puzzles: hotspot scans, event sequencing, status classification, evidence classification, interpretation choices.
- Dust-table excavation, spectrum scanning, and laser-link alignment.
- Source citations attached to scenes and discovery logs.
- Browser-synthesized ambient audio and interaction sound effects, muted until enabled.
- Local-only chapter and field-study progress.
- Reduced-motion support.

### Timeline

- **71 dated events** on a single interactive chronograph.
- Year-by-year event-density chart, 1967–2026.
- Filters for world, event type, and free-text search.
- Oldest/newest sorting and sticky decade headers.
- Expandable event records with sources and direct links to the object record and REX field study.
- Deep links: `/timeline#event-<id>`.

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Archive landing experience |
| `/observatory` | 3D launch pad, solar system, and artifact inspection |
| `/explore` | Planet explorer and object index |
| `/catalog` | Extended NASA catalogue |
| `/catalog/[id]` | Extended catalogue record |
| `/relics/[id]` | Primary artifact investigation |
| `/timeline` | Interactive mission chronograph |
| `/rex` | Five-chapter expedition hub |
| `/rex/chapter/[slug]` | Playable REX chapter |
| `/rex/relic/[id]` | Playable relic field study |
| `/rex/journal` | Locally stored REX field journal |
| `/about` | Methodology, attribution, and disclosures |
| `/api/health` | Health check (server build only) |

---

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **three.js** + **@react-three/fiber** + **@react-three/drei**
- **Zustand** for 3D observatory state
- **Zod** for runtime data validation
- **Framer Motion** for interface reveals
- **Radix UI** primitives
- Fontsource variable fonts

No API keys, accounts, or external services are required.

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

## Static export (Cloudflare Pages)

The site can be exported to plain HTML, CSS, and JavaScript:

```powershell
$env:STATIC_EXPORT="1"
npm run build
```

Output:

```text
out/
```

Upload the **contents** of `out/` to Cloudflare Pages. Recommended settings:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `STATIC_EXPORT=1 npm run build` |
| Build output directory | `out` |

A `_headers` file is included for security headers and long-lived caching of `/_next/*`.

The static export omits `/api/health`; every page, the 3D observatory, the archive, REX expedition, and timeline are fully static.

---

## Scripts

```powershell
npm run dev            # Development server
npm run build          # Production build
npm run start          # Production server
npm run typecheck      # TypeScript check
npm run lint           # ESLint
npm run validate:data  # Schema, source, story, and asset validation
npm run check          # typecheck + lint + validate:data
npm run smoke          # Route smoke test (expects a running server)
npm run check:sources  # Verify all source URLs respond
npm run ingest:nasa    # Refresh normalized NASA image metadata manifest
```

`npm run smoke` expects `http://localhost:3000` unless `BASE_URL` is set:

```powershell
$env:BASE_URL="http://localhost:3000"; npm run smoke
```

---

## Data architecture

- `src/data/relics.ts` — 14 primary artifact records.
- `src/data/extended-catalog.ts` — 12 extended catalogue records.
- `src/data/sources.ts` — central source registry and NASA image catalog.
- `src/data/rex/chapters.ts` — five data-driven chapters.
- `src/data/rex/discovery-logs.ts` — 14 REX discovery logs.
- `src/data/rex/field-studies.ts` — 14 relic field studies.
- `src/lib/schema.ts` — Zod schemas for relics, sources, claims, timelines, and lifetimes.
- `src/lib/data.ts` — validated accessors and derived archive statistics.
- `src/r7la/data/missions.ts` — 17 3D artifact records.
- `src/r7la/bridge.ts` — mapping between 3D artifacts and archive records.

All records are validated at import time. Duplicate IDs, unknown source references, and schema violations fail the build.

---

## Project structure

```text
src/
  app/                 Next.js routes
  components/
    brand/             Logo and wordmark
    catalog/           Extended catalogue explorer
    explore/           Planet explorer
    layout/            Header, footer, immersive chrome
    observatory/       Archive landing globe
    relic/             Relic detail panels
    rex/               REX character, stage, discovery logs
    shared/            Shared UI and planet map
    story/             Story player, puzzles, excavation
    three/             Archive 3D scenes
    timeline/          Timeline chronograph
  data/                Archive, sources, REX chapters
  lib/                 Schema, derived data, story state, utilities
  r7la/                R7LA 3D observatory (scenes, models, store)
public/
  nasa/                Local NASA imagery and manifest
  audio/               Voiceover manifest
  models/              Custom model manifest
scripts/               Validation, ingestion, smoke test, static server
```

---

## Design system

- Deep abyss palette with teal and gold accents.
- Space Grotesk for display, IBM Plex Mono for technical labels.
- Hairline borders, corner frames, technical labels, and grain overlays.
- Editorial layouts that prioritise the record over decoration.
- Reduced-motion support through global CSS preferences.

---

## Disclosures

- NASA imagery is public domain unless otherwise noted. No NASA logo or endorsement is implied.
- Object schematics and 3D models are original AFTERLIGHT visualizations, not flight hardware or official NASA models.
- REX is an original fictional character created by AFTERLIGHT. Narrative dialogue is interpretive storytelling built around sources.
- Puzzles are educational reconstructions, not operational simulations.
- Hypothetical scenarios are explicitly labeled.
- Where a field is unknown, it is left missing rather than filled with plausible-looking data.
- Positions marked approximate or landing-ellipse are not exact points.

---

## Known limitations

- Some rover positions are landing regions or approximate final areas; each record states its precision.
- No authentic NASA 3D models are bundled. All 3D objects are procedural interpretations.
- The archive is not a live mission-status feed. Active status comes from cited mission material and should be checked against current NASA updates.
- The REX expedition is fiction built on a sourced archive; it is not a mission reconstruction.
- Static exports do not include the `/api/health` endpoint.

---

## Sources

- [NASA Image and Video Library](https://images.nasa.gov/)
- [NASA NSSDCA Master Catalog](https://nssdc.gsfc.nasa.gov/nmc/)
- [NASA Solar System Exploration](https://science.nasa.gov/solar-system/)
- [Apollo Lunar Surface Journal](https://www.nasa.gov/history/alsj-and-afj/)
- [USGS Astrogeology](https://astrogeology.usgs.gov/)

---

**R7LA** · AFTERLIGHT · Humanity's footprints beyond Earth.
