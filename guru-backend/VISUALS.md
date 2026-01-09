# Guru Visuals (SVG) — Design & Integration

Status: in-progress

Purpose
-------
This document describes Guru's visual subsystem: lightweight, educational visuals generated as SVG (not true 3-D rendering). The visual subsystem is an "underground agent"—an autonomous component that converts reasoning outputs (from the Thinker/Researcher) into SVG visuals, flashcards, and accessible media for learning while the user listens.

Principles
----------
- Local-first: visuals are generated in the client or by local model/tooling only; nothing is uploaded without consent.
- SVG-first: visuals are created as scalable vector graphics (SVG) derived from semantic data produced by the reasoning pipeline.
- Educational focus: visuals explain concepts, show relationships, and produce flashcards—designed for comprehension and recall rather than flashy 3-D scenes.
- Accessible: visuals include textual descriptions and subtitles for screen readers and audio sync.

What "Visual" Means Here
------------------------
- An SVG visual is a static or minimally animated vector diagram (nodes, links, icons, labels), produced from a structured payload (nodes, links, highlights).
- The UI renders SVGs inline, supports download/export, and turns some visuals into `VisualFlashcard` artifacts for spaced review.
- No 3-D runtime is required. Any references to "SpacialFlow" or similar are implemented as SVG generators (2-D spatial layout) in the extracted UI.

Producer (Underground Agent)
----------------------------
The visual producer is an agent in the Thinker/Researcher family. Responsibilities:

- Receive semantic output from the reasoning pipeline: `VisualHighlight`, `spacialData` (nodes/links), `thinkerNotes`.
- Synthesize a compact SVG description: positions, shapes, colors, labels, accessibility attributes, and optional simple animations (SVG `<animate>`).
- Produce metadata: `title`, `caption`, `sources[]`, `altText`, `createdAt`, `relatedLessonId`.
- Emit artifacts to the frontend event stream (message + `visualHighlights`), and optionally persist a `KnowledgePatch` or `VisualFlashcard` entry in local storage or vector DB.

Consumer (UI Components)
------------------------
Main components that consume visuals:

- `SpacialFlow` / `VisualCanvas` — render nodes/links as SVG; responsive layout.
- `VisualFlashcard` — flip-card UI showing the visual on front and explanation on back; includes `sources` and `why` text.
- `ImageSlideshow` — presents image/simulation visuals derived from `visualHighlights`.
- `CinemaSubtitles` — displays subtitle text synchronized with audio/TTS and links to visuals in the timeline.
- `AgentStatusCards` — shows which role generated visuals (Thinker/Visualizer)

Data Contracts
--------------
Use the existing `VisualHighlight` and `spacialData` shapes (see `types.ts`). Example minimal visual payload:

```json
{
  "type": "visual",
  "title": "Fuel System Check",
  "altText": "Diagram showing fuel pump location and flow to engine",
  "nodes": [
    {"id":"n1","label":"Fuel Pump","x":100,"y":120,"icon":"pump.svg"},
    {"id":"n2","label":"Fuel Filter","x":260,"y":120}
  ],
  "links": [{"source":"n1","target":"n2","label":"flow"}],
  "highlights": ["fuel pump is suspect"],
  "sources": [{"title":"Manual: Section 4","uri":"file:///path/manual.pdf","relevance":0.84}],
  "createdAt": 1670000000000
}
```

Rendering Guidance
------------------
- Layout: compute simple force or grid layout on client (D3-force) and then serialize to absolute `x,y` positions for SVG placement.
- Shapes: use basic SVG primitives (rect, circle, path, text) and inline small icons as `<image href='...'>`.
- Animations: prefer declarative SVG `<animate>` or CSS transitions for hover; avoid heavy JS animation engines.
- Accessibility: include `role="img"` and `aria-label`/`desc` elements; provide `altText` and a textual `caption` alongside the visual.
- Export: allow `svg` download and render-to-png fallback for sharing.

Open-source Libraries Recommended
--------------------------------
- D3.js (for layout and simple SVG helpers) — lightweight subset used for node/link placement.
- svg.js or Snap.svg — helpers for SVG DOM management (optional).
- dom-to-image / svg-crowbar — for svg → png exports.
- For force layout only: `d3-force` package.

Integration Points (where to wire)
---------------------------------
- Producer: `services/geminiService.ts` / `diagnosticService` (reasoning) should emit `visualHighlights` or `spacialData` in the assistant response object.
- Connector: `services/guruBackendConnector.ts` should surface an endpoint `/api/guru/visual/generate` (optional) that returns the structured visual payload when visuals require server-side composition.
- Consumer: `resources/guru_agents_extracted/App.tsx` listens for `result.spacialData` and calls `setSpacialData()` which feeds `SpacialFlow`.
- Persistence: `recallService` or `localStorage` may store generated visuals as `KnowledgePatch` or `VisualFlashcard` for later recall.

Minimal Server API (optional)
----------------------------
If visuals are composed server-side (e.g., complex graph layout), add a simple API:

- POST `/api/guru/visual/generate`
  - Body: `{ prompt: string, nodes?:[], links?:[], options?:{} }`
  - Response: `{ svg: "<svg>...</svg>", payload: { nodes, links, meta } }`

Prefer client-side generation where possible to obey local-first and privacy rules.

How Visuals Fit the Mentor Loop
--------------------------------
- OBSERVE / BASELINE: visuals can show timeline or initial state snapshots.
- QUESTIONS: visuals can highlight areas to probe (red nodes for uncertainty).
- FRAME: visuals represent the framed model (root cause graphs).
- GUIDE: visuals supply step-by-step annotated diagrams or checklists.
- REFLECT: visuals become flashcards/principles stored for recall.

Developer Notes
---------------
- The existing extracted UI already treats visuals as 2-D SVG-like payloads (`spacialData` in `App.tsx`).
- Replace any mention of full 3-D rendering with SVG generation and 2-D spatial layout.
- Keep the visual agent implementation small and open-source only — all recommended libs above are permissively licensed.

Next steps / Choices
--------------------
1. Wire `diagnosticService`/`geminiService` to emit `visualHighlights` with the payload described above.  
2. Add client-side layout helper (D3-force) and `SpacialFlow` should render SVG from nodes/links.  
3. Optionally add `/api/guru/visual/generate` for server-side composition when necessary.

If you want, I can implement the client-side SVG generator for `SpacialFlow` (using `d3-force`), or instead implement the optional server endpoint. Tell me which and I will proceed. If you prefer to provide an existing code snippet for a specific SVG function, share it and I'll integrate it.

References in repo
------------------
- `resources/guru_agents_extracted/components/SpacialFlow.tsx` — current visual renderer (treat as SVG generator).  
- `resources/guru_agents_extracted/components/VisualCanvas.tsx` — canvas that should render SVG content.  
- `resources/guru_agents_extracted/components/VisualFlashcard.tsx` — flashcard UI.
- `resources/guru_agents_extracted/types.ts` — `VisualHighlight`, `Node3D` and `Link3D` types.

---

Document created by automation. Ask if you want a working client-side SVG implementation now.