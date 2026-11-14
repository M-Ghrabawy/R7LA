# R7LA — Technical & Feature Brief

**Humanity's footprints beyond Earth.**
An interactive space-archaeology archive of human-made objects on the Moon and Mars, with a 3D solar-system observatory, a five-chapter REX expedition, and an interactive mission timeline.

Independent editorial project by **AFTERLIGHT**. Not affiliated with NASA.

---

## 1. One-slide summary

| | |
|---|---|
| Product | R7LA — interactive space archaeology archive |
| Core idea | Every relic is a place; every claim has a source |
| Content | 26 archive records · 17 3D artifacts · 71 dated events |
| Experience | Archive + 3D Observatory + REX Expedition + Timeline |
| Stack | Next.js 16 · React 19 · TypeScript · Tailwind 4 · three.js |
| Rendering | Static site generation; optional pure HTML/CSS/JS export |
| Deployment | Cloudflare Pages (static `out/`) |
| External services | None — no API keys, accounts, or live data |
| Codebase | 23,706 lines of TS/TSX across 87 files |

---

## 2. By the numbers

| Metric | Value |
|---|---|
| Primary artifact investigations | **14** |
| Extended NASA catalogue records | **12** |
| Total archive records | **26** |
| 3D interactive artifacts | **17** |
| Source records | **60** |
| Evidence claims | **43** |
| Dated timeline events | **71** |
| Timeline span | **1967 – 2026** |
| REX chapters | **5** |
| REX scenes | **42** |
| REX field studies | **14** |
| REX discovery logs | **14** |
| NASA images in primary records | **27** |
| Bundled NASA image files | **47** |
| Generated pages / routes | **57** |
| TypeScript / TSX files | **87** |
| React components | **34** |
| Source size | **0.94 MB** |
| Public assets | **5.2 MB** |
| Static build | **18.4 MB / 454 files** |
| Cloudflare zip | **8.5 MB** |

---

## 3. Product features

### 3.1 Archive

- 14 full primary investigations across the Moon and Mars.
- 12 extended catalogue records covering the Moon, Mars, Ceres, Eros, deep space, and heliocentric orbit.
- Every record includes mission history, purpose, operational history, current condition, scientific legacy, coordinates, imagery, chronology, evidence claims, and sources.
- **Physical status** separated from **operational status**:
  - present
  - present but not directly imaged
  - active
  - passive but still detectable
  - inactive
  - decommissioned
- Sourced coordinates with explicit precision labels:
  - exact
  - approximate
  - landing ellipse
- Planned versus actual operational lifetime comparison.
- NASA historical photography with attribution and external source links.
- Related-object recommendations from the same world.
- Direct 3D scan link from every primary relic.
- Source lists split into imagery and reference records.

### 3.2 3D Observatory

- 17 interactive 3D artifacts on the Moon, Mars, and deep space.
- Three-act experience:
  1. **Launch pad** — nighttime complex, floodlights, launch tower, R7LA vehicle.
  2. **Solar system** — Sun, eight planets, Moon, Ceres, 433 Eros, asteroid belt, elliptical orbits, stars.
  3. **Artifact inspection** — procedural 3D model, orbit controls, 7-scene journey.
- Artemis-style launch sequence with ignition, ascent, MECO, upper-stage separation, orbital pullback.
- **Procedural PBR models** — no external GLB assets required.
- **Procedural vector planets** — flat illustrated surfaces, crisp features, custom atmosphere rims.
- Surface-pinned artifact markers using latitude/longitude projection.
- 2D coordinate plot mode for precise positions.
- Search, world filters, category filters, and object index.
- Deep links: `/observatory?artifact=<id>`.
- WebGL error boundary and graceful fallback.
- Software-GL detection with reduced quality.
- Optional custom model/audio manifests for team-supplied assets.

### 3.3 REX Expedition

- Five chapters:
  1. The Departure
  2. Silent Footprints
  3. The Forgotten Journey
  4. What Remains
  5. A Message to Tomorrow
- 14 relic field studies — one per primary object.
- 42 data-driven scenes.
- Original blue-and-white vector REX character with poses and expressions.
- Reusable puzzle systems:
  - hotspot site scans
  - mission-event sequencing
  - status classification
  - evidence classification
  - interpretation choices
  - dust-table excavation
  - spectrum scanning
  - laser-link alignment
- Source citations attached to scenes and discovery logs.
- Progress and completed scenes stored locally.
- REX Field Journal at `/rex/journal`.
- Browser-synthesized ambient audio and interaction sounds.
- Audio muted until enabled; pauses when the tab is hidden.
- Reduced-motion support.

### 3.4 Timeline

- 71 dated events from 1967 to 2026.
- Year-by-year event-density chart.
- Filters:
  - world: All / Moon / Mars
  - event type: launch, arrival, landing, deployment, discovery, record, loss, end, aftermath
  - free-text search across title, mission, object, and summary
- Oldest-first / newest-first sorting.
- Sticky decade headers.
- Era navigation with event counts.
- Expandable event cards with:
  - full summary
  - primary/secondary significance
  - source links
  - object record link
  - REX field study link
- Deep links: `/timeline#event-<id>`.
- Empty state and one-click reset.

### 3.5 Interface & design

- Deep-abyss palette with teal and gold accents.
- Space Grotesk display type, IBM Plex Mono technical labels, IBM Plex Sans for the 3D layer, Plus Jakarta Sans for R7LA headings.
- Hairline borders, corner frames, technical labels, grain overlays.
- Editorial layouts that prioritise records over decoration.
- Responsive from mobile to 1600px+ desktop.
- Reduced-motion support through global CSS.
- Accessible focus states, skip link, semantic landmarks.
- Custom 404, loading, and error states.

### 3.6 About & disclosures

- Methodology page.
- Source policy.
- NASA media attribution.
- REX fiction disclosure.
- Known limitations.
- Data model notes.

---

## 4. Technology stack

| Layer | Technology |
|---|---|
| Framework | Next.js **16.4.6** (App Router, Turbopack) |
| UI runtime | React **19.3.0**, React DOM **19.3.0** |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS **4.3.3**, CVA, clsx, tailwind-merge |
| 3D | three.js **0.187**, @react-three/fiber **9.8**, @react-three/drei **10.7** |
| 3D utilities | three-stdlib |
| State | Zustand 5 (3D observatory) |
| Validation | Zod 4 |
| Motion | Framer Motion 14, GSAP 3 (available) |
| UI primitives | Radix Dialog, Separator, Slot, Tabs, Tooltip |
| Icons | lucide-react |
| Fonts | Fontsource variable packages (self-hosted) |
| Tooling | ESLint 9, tsx, Next ESLint config |
| Runtime | Node.js 20+ (validated on Node 24.18, npm 11.16) |

---

## 5. Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App Router                   │
│                                                             │
│  Server Components                 Client Components        │
│  ├─ /                (archive)     ├─ 3D observatory        │
│  ├─ /relics/[id]                   ├─ REX story player      │
│  ├─ /catalog/[id]                  ├─ puzzles / excavation  │
│  ├─ /timeline                      ├─ timeline filters      │
│  ├─ /about                         ├─ R7LA launch scene     │
│  └─ /api/health                    └─ shared interactive UI  │
│                                                             │
│  Data layer (build time)                                    │
│  ├─ relics.ts         14 records                            │
│  ├─ extended-catalog  12 records                            │
│  ├─ sources.ts        60 sources                            │
│  ├─ rex/chapters.ts   5 chapters / 42 scenes                │
│  ├─ rex/field-studies 14                                    │
│  └─ r7la/missions.ts  17 3D artifacts                       │
│                                                             │
│  Zod validation at import → build fails on bad data         │
└─────────────────────────────────────────────────────────────┘
```

### Rendering strategy

- **Static Site Generation** for all content routes.
- 57 pages pre-rendered at build time.
- Client components only where interaction is required (3D, story, timeline filters).
- The R7LA 3D tree is loaded with `next/dynamic` and `ssr: false`, keeping WebGL out of the server render.
- Optional full static export for Cloudflare Pages (`STATIC_EXPORT=1`).
- Server-only health endpoint excluded from static builds.

### Data flow

1. Raw data lives in typed TypeScript modules.
2. Zod schemas validate every record at import time.
3. Reference integrity checks reject unknown source IDs.
4. Derived selectors build timelines, evidence lists, statistics, and legacy scores.
5. Server components pass only serialisable view models to client components.
6. A bridge module maps 3D artifact IDs to archive records and catalogue entries.

---

## 6. Data model

### Primary relic record

- identity: `id`, `name`, `shortName`, `mission`, `missionShort`
- classification: `destination`, `category`
- status: `physicalStatus`, `operationalStatus`
- location: `latitude`, `longitude`, precision, site name
- narrative: description, purpose, operational history, current condition, scientific legacy
- media: images with credit, source, NASA ID
- chronology: dated events with type, title, summary, sources, significance
- evidence: claims with status, interpretation, source IDs
- lifetime: planned vs actual, units, ongoing flag, claims, sources
- legacy: five weighted editorial dimensions
- sources: resolved source records
- related models and schematics

### Validation guarantees

- Unknown source references fail the build.
- Duplicate IDs fail the build.
- Invalid dates, enums, and required fields fail the build.
- Story scenes, puzzles, and field studies are schema-validated.
- Source URLs can be checked with `npm run check:sources`.

---

## 7. 3D system

### Rendering

- `@react-three/fiber` canvas with ACES filmic tone mapping.
- Studio environment via PMREM where appropriate.
- Instanced starfield (2,600 points) and asteroid belt (460 instances).
- Elliptical orbit lines generated procedurally.
- Surface coordinates projected onto spheres for artifact beacons.
- Orbit controls with damping; camera choreography per scene.

### Procedural models

All 17 artifacts are built from geometry primitives:

- Apollo Lunar Modules
- Apollo 15 Lunar Roving Vehicle
- ALSEP & Retroreflectors
- Surveyor 3
- Sojourner
- Spirit & Opportunity
- Curiosity
- Perseverance
- Mars Pathfinder Lander
- Viking 1 & 2
- Phoenix & InSight
- Ingenuity
- Dawn
- NEAR Shoemaker
- Pioneer 10 & 11
- Kepler
- Lunokhod 1

Techniques:

- PBR materials: gold Kapton, silver foil, white thermal, titanium, carbon, copper, solar cells, optics.
- Procedural canvas textures for gold foil and solar panels.
- Parabolic dish lathe geometry.
- Structural struts generated between arbitrary points.
- Correct wheel axle rigs; per-wheel spin axis metadata.
- Rotor, ascent-stage, ion-plume, arm, and dish animation refs.
- Double-sided dish materials to prevent backface culling.

### Vector planets

- Procedural 1024×512 canvas textures.
- Flat, crisp vector shapes: continents, clouds, polar caps, gas bands, red spot, craters.
- Unlit materials for a flat illustrated look.
- Thin silhouette outlines.
- Custom atmosphere rims.
- Soft limb shading kept minimal.

### Animation

- 7-scene lifecycle per artifact: design, liftoff, transit, landing, operation, science, legacy.
- Camera keyframes per scene.
- Stage choreography: blueprint rotation, launch ascent, landing bounce, roving, cruise drift, dormant state.
- Artifact-specific animation:
  - wheels spin on the correct axle
  - Ingenuity rotors counter-rotate
  - Apollo ascent stage separates
  - Dawn ion plume flickers
  - Surveyor/Viking sampler arms deploy
- Software-GL fallback reduces DPR and disables expensive effects.

---

## 8. REX expedition system

- Data-driven scenes with backgrounds, character pose/expression, narration, puzzle, and sources.
- Story player state machine:
  - scene index
  - puzzle solved state
  - hotspot discovery
  - audio enabled/unlocked
  - scene completion
- Puzzle components are reusable and schema-driven.
- Progress and journal persisted in `localStorage`.
- Audio engine uses the Web Audio API:
  - synthesized ambience and cues
  - no required audio files
  - optional MP3 manifest support
  - analyser data available for visual reactions
- Skip interaction is a prominent full-width control under Continue; Back is always visible.
- Keyboard navigation: left/right arrows move between scenes.

---

## 9. Timeline system

- Derived from 71 relic timeline events.
- Grouped by decade, sorted chronologically or reverse.
- Density chart computed per year and per world.
- Filter state is local and instant.
- Event cards expand inline; sources and record links load on demand.
- Hash-based deep links open and scroll to a specific event.
- No server calls; entire dataset is bundled at build time.

---

## 10. Performance

- 57 static pages; no server rendering at request time.
- Route-level code splitting.
- 3D bundle isolated behind a dynamic import.
- Instanced meshes for stars and asteroids.
- DPR capped at 2; reduced to 1 on software GL.
- Canvas textures cached in memory.
- Local fonts; no third-party font requests.
- Local NASA imagery; no runtime image API.
- Static export inlines the route payloads and serves immutable `_next` assets.
- Measured build (local): compile ≈3s, TypeScript ≈8s, 57 pages ≈1.3s.

---

## 11. Accessibility

- Semantic landmarks (`header`, `main`, `footer`, `nav`).
- Skip-to-content link.
- Visible focus rings.
- Buttons with `aria-label` and `aria-expanded` where needed.
- Keyboard navigation in the story player.
- Reduced-motion media query disables animation.
- Colour contrast tuned for the dark palette.
- 2D fallback for users without WebGL.

---

## 12. Security & privacy

- No accounts, cookies, analytics, or tracking.
- No API keys or secrets required.
- Progress stored only in the browser.
- Security headers configured for the server build and `_headers` for static hosting:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
- External links use `rel="noopener noreferrer"`.

---

## 13. Build & deployment

### Development

```powershell
npm install
npm run dev
```

### Production

```powershell
npm run build
npm run start
```

### Static export (Cloudflare Pages)

```powershell
$env:STATIC_EXPORT="1"
npm run build
```

Output: `out/`

Cloudflare settings:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `STATIC_EXPORT=1 npm run build` |
| Output directory | `out` |

- 18.4 MB / 454 files.
- 8.5 MB zip.
- `_headers` included for caching and security.
- No server or database required.
- `/api/health` is excluded from static builds.

### Repository

- Branch: `main`
- Remote: `https://github.com/M-Ghrabawy/R7LA.git`
- Latest commit: `d56bb00`

---

## 14. Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run validate:data` | Schema, source, story, and asset validation |
| `npm run check` | typecheck + lint + validate:data |
| `npm run smoke` | Route and API smoke test |
| `npm run check:sources` | Verify all source URLs respond |
| `npm run ingest:nasa` | Refresh NASA image metadata manifest |

---

## 15. Project structure

```text
src/
  app/                 12 route files + dynamic routes
    relics/[id]/       primary artifact records
    catalog/[id]/      extended catalogue records
    observatory/       3D experience
    rex/               expedition, chapters, field studies, journal
    timeline/          interactive chronograph
    about/             methodology and disclosures
    api/health/        server health endpoint
  components/          34 React components
    brand/ catalog/ explore/ layout/ observatory/
    relic/ rex/ shared/ story/ three/ timeline/ ui/
  data/
    relics.ts          14 primary records
    extended-catalog   12 extended records
    sources.ts         60 sources
    rex/               chapters, field studies, logs
  lib/
    schema.ts          Zod schemas
    data.ts            validated selectors and statistics
    story/             progress, journal, audio, scene schema
  r7la/
    data/missions.ts   17 3D artifacts
    scene/             canvas, models, textures, vector planets
    store/             Zustand state
    bridge.ts          3D ↔ archive mapping
public/
  nasa/                47 NASA images + manifest
  audio/               voiceover manifest
  models/              custom model manifest
scripts/               validation, ingestion, smoke, static server
```

---

## 16. Technical challenges solved

1. **Merging two independent apps**
   - R7LA (Vite + React Three Fiber) integrated into a Next.js App Router project.
   - Client-only 3D tree isolated behind `next/dynamic` with `ssr: false`.
   - Shared fonts, Tailwind theme, state, and navigation.

2. **Static export compatibility**
   - Converted search-param pages to client-side URL reading.
   - Removed server-only assistant endpoint.
   - Added `STATIC_EXPORT` build mode and `_headers`.

3. **Data parity between experiences**
   - 17 3D artifacts mapped to 26 archive records through a bridge module.
   - Deep links work in both directions.

4. **Procedural 3D quality**
   - Rebuilt Surveyor, ALSEP, Lunokhod, Viking, Pathfinder, Ingenuity, and Pioneer.
   - Corrected wheel axle orientation and spin axis.
   - Fixed dish backface culling with double-sided materials.

5. **Performance without assets**
   - All models, textures, planets, and audio are generated in code.
   - No large downloads, no external APIs.

---

## 17. Limitations

- 3D models are stylized interpretations, not flight-accurate CAD.
- Some 3D entries group multiple records (e.g. Apollo LMs, Viking 1 & 2).
- Coordinates marked approximate or landing-ellipse are not exact points.
- The archive is not a live mission-status feed.
- Progress and journal are local to the browser.
- Static export excludes `/api/health`.
- REX narrative is fiction built around sourced records.

---

## 18. Demo script (5 minutes)

1. **Home** — archive stats, featured relics, timeline preview.
2. **3D Observatory** — launch sequence, solar system, artifact inspection.
3. **Artifact** — open Lunokhod 1 or Surveyor 3, orbit the model.
4. **Journey** — play a scene, show Skip and Back controls.
5. **Archive record** — open the object record, show sources and 3D link.
6. **Timeline** — filter to Mars, search “Apollo”, expand an event.
7. **REX** — start a chapter, solve a puzzle, open the journal.
8. **About** — methodology, attribution, disclosures.
9. **Deployment** — static build on Cloudflare, no server required.

---

## 19. Likely Q&A

**Q: Is the data real?**
A: Mission records, coordinates, imagery, and sources are drawn from NASA/NSSDCA/USGS material. Claims are classified, and interpretations are labelled.

**Q: Does it need an API?**
A: No. Everything is bundled and static. No keys, accounts, or live services.

**Q: How is the 3D built?**
A: Procedural geometry and canvas textures in React Three Fiber. No external model files.

**Q: How is content kept consistent?**
A: Zod validation at import time plus reference-integrity checks; invalid records fail the build.

**Q: How does it perform?**
A: Static pages, route-level splitting, isolated 3D bundle, instancing, DPR caps, and a WebGL fallback.

**Q: Can it be deployed anywhere?**
A: Yes — static `out/` works on Cloudflare Pages, S3, Netlify, or any static host.

**Q: What is original?**
A: The archive model, interface, REX character and story, procedural 3D models, planet art, timeline, and code. NASA imagery is public domain with attribution.

**Q: What was hardest?**
A: Merging the two codebases, making the 3D layer static-export safe, and rebuilding the procedural models and animation rigs.

**Q: What is next?**
A: More individual 3D models, richer archive records, automated visual tests, and optional CMS integration.

---

## 20. Sources

- NASA Image and Video Library
- NASA NSSDCA Master Catalog
- NASA Solar System Exploration
- Apollo Lunar Surface Journal
- USGS Astrogeology

---

**R7LA** · AFTERLIGHT · Humanity's footprints beyond Earth.
