# NASA Space Apps Challenge 2026 — Submission Content (R7LA)

This file contains every field from the project submission page, ready to paste. The uploaded PDF is a printout of the form, not a fillable PDF, so enter these values on the Space Apps site.

Project page: https://www.spaceappschallenge.org/2026/find-a-team/plero/?tab=project

---

## 1. Project Name

```
R7LA
```

---

## 2. Summary (max 1500 characters)

```
R7LA is an interactive space-archaeology archive that makes the physical record of human exploration explorable. It brings together 26 sourced records of objects on the Moon, Mars, and deep space — landers, rovers, experiments, and relics — with a 3D solar-system observatory, a five-chapter REX expedition, and a 71-event mission timeline.

Every claim resolves to a stored source. Physical status is separated from operational status, coordinates carry precision labels, and interpretation is clearly distinguished from verified records. In the observatory, 17 artifacts are rebuilt as procedural 3D models that can be inspected and animated through their mission lifecycle. REX adds playable field studies, puzzles, and a local field journal. The timeline lets anyone filter five decades of exploration by world, event type, or era.

R7LA is fully static, needs no API keys, and runs in any modern browser. It is built to make space archaeology legible to students, educators, and the public — and to show that every object left behind is a document.
```

Character count: ~1,240 / 1,500.

---

## 3. Project Demonstration (max 7 slides or 30 seconds)

```
https://github.com/M-Ghrabawy/R7LA/blob/main/docs/R7LA-Demo.pdf
```

The deck is exactly **7 slides** (title + 6 content slides). It is public, no login or permission required.

If you prefer a video instead, record 30 seconds using this script:

1. **0–5s** — Home page: "R7LA is an interactive space-archaeology archive."
2. **5–12s** — 3D Observatory: launch pad → solar system.
3. **12–19s** — Open Lunokhod 1 or Surveyor 3; orbit the model.
4. **19–24s** — Timeline: filter Mars, expand one event.
5. **24–30s** — REX chapter or About page: "26 records, 17 3D artifacts, 71 events — all sourced."

---

## 4. Project Link

```
https://github.com/M-Ghrabawy/R7LA
```

Public repository containing the full source, build scripts, README, and the demo deck. No login or permission required.

---

## 5. Project Details

```
R7LA is an interactive space-archaeology archive and 3D observatory. It documents human-made objects left on the Moon, Mars, and deep space and turns each one into a place you can investigate. It combines four experiences: a sourced archive of 26 records, a 3D solar-system observatory with 17 inspectable artifacts, a five-chapter REX expedition with 14 field studies, and an interactive 71-event timeline.

WHAT IT DOES
- 14 primary investigations and 12 extended catalogue records cover descent stages, rovers, landers, experiments, retroreflectors, and deep-space probes.
- Every record includes mission history, original purpose, operational history, current condition, physical and operational status, sourced coordinates with precision labels, NASA imagery, a chronology, evidence claims, a planned-vs-actual lifetime comparison, and source links.
- The 3D observatory begins at a launch complex, transitions to an orbital solar system, and lets users select artifacts pinned to the Moon, Mars, asteroids, and deep-space trajectories. Models can be orbited and animated through a seven-scene lifecycle.
- REX, an original fictional guide, turns 14 relics into playable field studies with hotspot scans, sequencing, classification, excavation, spectrum scanning, and laser-alignment puzzles. Progress and a field journal are stored locally.
- The timeline presents all 71 events with a year-density chart, world and event-type filters, search, decade navigation, and expandable sources.

HOW IT WORKS
R7LA is a Next.js 16 application built with React 19 and TypeScript. All content routes are statically generated. The data layer is typed and validated with Zod at import time: duplicate IDs, unknown source references, and schema violations fail the build. The 3D layer uses three.js and React Three Fiber; all 17 artifacts, their textures, and the planet surfaces are generated procedurally, so there are no external model downloads. Zustand manages observatory state, Tailwind CSS 4 handles the design system, and the Web Audio API synthesizes ambience and cues in the browser. A pure static export produces HTML, CSS, and JavaScript that runs on any static host with no server, database, or API key.

IMPACT
R7LA makes space archaeology legible to students, educators, and the public. It treats each object as a document: a place with coordinates, a history, a physical condition, and a reason to matter. The source-first design supports science communication and classroom use, while the 3D and story layers lower the barrier for people who would not read a technical catalog. Accessibility was a design constraint: keyboard navigation, reduced-motion support, a 2D fallback for devices without WebGL, and a mobile-first layout.

TOOLS
Next.js 16.4.6, React 19.3, TypeScript 5, Tailwind CSS 4.3, three.js 0.187, React Three Fiber 9.8, drei 10.7, Zustand 5, Zod 4, Framer Motion 14, Radix UI, lucide-react, Fontsource fonts, Node.js 24, Git/GitHub, and an AI coding assistant (disclosed separately).

CREATIVITY
The project connects four normally separate forms — archive, 3D model, narrative game, and timeline — through a shared object identity. The same relic is reachable from its record, its 3D scan, its timeline events, and its REX field study. The 3D models are original procedural reconstructions rather than imported assets, and the planet art is a custom flat vector style rather than stock imagery.

WHAT WE CONSIDERED
Source integrity came before visual polish: no invented citations, no filled-in gaps, and explicit separation of verified records, interpretation, and hypothesis. We also considered performance and reach: no external services, local fonts and imagery, a static build, and a fallback path for low-end devices. NASA branding is not used or modified; NASA imagery is public domain and attributed.
```

Character count: ~4,300. If the field is capped at 5,000, this fits.

---

## 6. Use of Super Intelligence (SI)

### Free-text disclosure

```
AI-assisted tools were used during development, not as sources of mission facts. Specifically, AI tools assisted with: (1) code generation, refactoring, debugging, and integration of the 3D observatory into the Next.js application; (2) drafting and editing interface copy and documentation; (3) ideation and assistance designing procedural 3D geometry and animation rigs.

AI was not used to invent mission facts, coordinates, citations, or historical claims. All mission records, coordinates, and source references come from the NASA, NSSDCA, and USGS resources listed in the NASA Data section and are validated against typed schemas at build time. No AI-generated images, video, or audio are included. NASA imagery is real public-domain imagery used with attribution. No NASA logos, flags, mission identifiers, or branding were generated, used, or modified. REX is an original fictional character; its vector art and dialogue are authored project content.

All AI-assisted elements are disclosed here and in the project repository documentation.
```

### SI options — select all that apply

Select:

- Code generation / coding assistance
- Text generation / editing / documentation
- Ideation / design assistance

Do **not** select:

- Image generation
- Audio generation
- Video generation
- NASA branding or design elements

If there is an "I did not use SI" option, leave it unselected.

---

## 7. NASA Data (required)

Enter each row as **Link Text** + **Link Url**.

| Link Text | Link Url |
|---|---|
| NASA Image and Video Library | https://images.nasa.gov/ |
| NASA NSSDCA Master Catalog | https://nssdc.gsfc.nasa.gov/nmc/ |
| NASA Solar System Exploration | https://science.nasa.gov/solar-system/ |
| NASA Apollo Program | https://www.nasa.gov/mission/apollo-11/ |
| Apollo Lunar Surface Journal | https://www.nasa.gov/history/alsj-and-afj/ |
| NASA Mars | https://science.nasa.gov/mars/ |
| NASA Moon | https://science.nasa.gov/moon/ |
| R7LA NASA image manifest (project) | https://github.com/M-Ghrabawy/R7LA/blob/main/public/nasa/source-manifest.json |

Notes:

- 27 credited NASA images are used in the primary archive; 47 NASA image files are bundled in total.
- Every image is attributed and linked to its NASA Image and Video Library record.
- NASA imagery is public domain; no NASA logo or endorsement is implied.

---

## 8. Space Agency Partner & Other Data

List every external code, text, image, font, and tool resource.

| Link Text | Link Url |
|---|---|
| Next.js 16 (MIT) | https://nextjs.org/ |
| React 19 (MIT) | https://react.dev/ |
| TypeScript (Apache-2.0) | https://www.typescriptlang.org/ |
| Tailwind CSS 4 (MIT) | https://tailwindcss.com/ |
| three.js (MIT) | https://threejs.org/ |
| React Three Fiber (MIT) | https://docs.pmnd.rs/react-three-fiber |
| drei (MIT) | https://github.com/pmndrs/drei |
| Zustand (MIT) | https://github.com/pmndrs/zustand |
| Zod (MIT) | https://zod.dev/ |
| Framer Motion (MIT) | https://www.framer.com/motion/ |
| Radix UI (MIT) | https://www.radix-ui.com/ |
| lucide-react (ISC) | https://lucide.dev/ |
| Fontsource (MIT packages) | https://fontsource.org/ |
| Space Grotesk, IBM Plex, Plus Jakarta Sans (SIL OFL) | https://fonts.google.com/ |
| OpenCode AI coding agent (development tool; see SI disclosure) | https://opencode.ai/ |

Additional notes:

- **No external 3D models, textures, music, video, or stock photography.**
- All 17 artifact models, all planet surfaces, and all textures are generated procedurally in code.
- All ambience and interaction audio is synthesized in the browser with the Web Audio API; no audio files are bundled.
- No copyrighted music or third-party imagery is used beyond the attributed NASA public-domain imagery.
- NASA branding is not used: no NASA logos, flags, or mission identifiers.

---

## 9. Agreements

- **Agree to Terms and Conditions** — check.
- **Confirm All Work is Original** — check, with all external resources listed above.

---

## 10. Final checklist

- [ ] Project Name: `R7LA`
- [ ] Summary pasted (≤1500 chars)
- [ ] Demo link: `https://github.com/M-Ghrabawy/R7LA/blob/main/docs/R7LA-Demo.pdf` — open it in a private window to confirm public access
- [ ] Project link: `https://github.com/M-Ghrabawy/R7LA`
- [ ] Project Details pasted
- [ ] SI disclosure pasted and SI options selected
- [ ] NASA Data links added (8 rows)
- [ ] Other Data links added
- [ ] Terms and originality checked
- [ ] Click **Save Progress**
- [ ] Click **Submit for Judging** (submission is final)
