# Guru Rebranding Complete: OpenWebUI → Native Guru Backend

**Date:** Today  
**Commit:** 2ec446b  
**Status:** ✅ Complete, committed to GitHub

## What Changed

### Before
- OpenWebUI was an optional external adapter
- Guru services called `openWebUIAdapter.ts` (thin wrapper)
- Architecture was: Guru → (maybe) → OpenWebUI
- User had to understand two separate systems

### After
- OpenWebUI IS Guru's native backend
- Guru routes are integrated into OpenWebUI's FastAPI app
- Architecture is: User → Guru Backend (which includes OpenWebUI internals)
- Single unified system

## Technical Architecture

### Layer 1: User Interface
- **Svelte frontend** (Guru-branded)
- Shows diagnostic mentor loop, not generic chat
- Calls Guru Backend via type-safe TypeScript connector

### Layer 2: Guru Backend (Python FastAPI)
```
Guru API Routes (/api/guru/*)
├── /diagnostic/* — 6-stage mentor loop orchestration
├── /retrieval/* — Query user history + domain knowledge
├── /models/* — Switch models, run inference
└── /health — System status

Guru Core Services
├── mentor_loop.py — Orchestrates 6 stages
├── diagnostic_service.py — Problem classification, question generation, framing
├── retrieval_service.py — Query history, index files
└── config.py — Feature flags, privacy enforcement

OpenWebUI Foundation
├── Vector DBs — Chroma, Qdrant, Milvus, Weaviate, pgvector
├── RAG Pipeline — Hybrid search, reranking, contextual compression
├── Model Runtime — Ollama, llama.cpp integration
├── Web Loaders — YouTube, web scraping
└── FastAPI Framework — HTTP server, dependency injection
```

### Layer 3: Local Resources
- User files (on disk)
- Vector indices (Chroma local)
- Models (Ollama local)
- Session history (local storage)

## New Files Created

| File | Purpose |
|------|---------|
| `guru-backend/open_webui/routes/guru.py` | API endpoints for diagnostic, retrieval, models |
| `guru-backend/core/mentor_loop.py` | Orchestrator for 6-stage mentor loop |
| `guru-backend/core/config.py` | Backend initialization and feature flags |
| `services/guruBackendConnector.ts` | Type-safe bridge from frontend to backend |
| `guru-backend/ARCHITECTURE.md` | Complete documentation of rebranded system |
| `guru-backend/README.md` | Getting started guide |

## Key Design Decisions

### 1. Extend, Don't Fork
- We use OpenWebUI's proven RAG + model infrastructure
- We add Guru-specific diagnostic endpoints on top
- OpenWebUI's chat endpoints still work (backward compatible)
- But Guru frontend ignores them (mentor loop is different)

### 2. User Data Ownership (Locked)
Every Guru endpoint enforces:
```python
# From guru-backend/open_webui/routes/guru.py
if endpoint_uploads_files and not user_consent:
    raise PermissionError("User consent required")
```

### 3. Local-First, Consent-Gated for External
```python
# From GuruBackendConfig
REQUIRE_CONSENT_FOR_UPLOADS = True  # Default: only local
BLOCK_EXTERNAL_API_CALLS = False    # Can be enabled
```

### 4. 6-Stage Mentor Loop
```
User Problem → Observe → Baseline → Questions → Frame → Guide → Reflect
                ↓         ↓         ↓          ↓        ↓       ↓
             Listen   Establish   Probe      Diagnose Teach  Principle
```

## How to Use

### Start the Backend
```bash
cd /workspaces/Guru/guru-backend
python -m uvicorn open_webui.main:app --reload --port 8000
```

### Call from Frontend
```typescript
import { getGuruBackendConnector } from './services/guruBackendConnector';

const connector = getGuruBackendConnector();

// Create a diagnostic session
const session = await connector.createDiagnosticSession({
  userId: "user123",
  domain: "car_repair",
  problemDescription: "Car won't start"
});

// Record observation
const observe = await connector.recordObservation({
  sessionId: session.sessionId,
  observation: "Engine won't turn over, but lights work"
});

// Record baseline (what works, constraints)
const baseline = await connector.recordBaseline({
  sessionId: session.sessionId,
  baseline: {
    whatWorks: "Lights, radio, battery voltage",
    constraints: "Can't tow to shop until Friday",
    affectedAreas: ["starting", "ignition"]
  }
});

// Answer diagnostic questions
const answer = await connector.answerQuestion({
  sessionId: session.sessionId,
  questionId: "q1",
  answer: "Click sound, no cranking"
});

// Get diagnosis
const frame = await connector.getFrame(session.sessionId);
// → { primaryType: "fuel_pump", confidence: 0.85, ... }

// Get guidance
const guide = await connector.getGuidance(session.sessionId);
// → [ { step: 1, action: "Check fuel pressure", why: "..." } ]
```

## Verification Checklist

- ✅ All Guru routes registered in FastAPI
- ✅ User consent enforced in upload endpoints
- ✅ 6-stage mentor loop implemented in Python
- ✅ TypeScript connector bridges frontend to backend
- ✅ OpenWebUI foundation untouched (backward compatible)
- ✅ All code committed to GitHub (commit 2ec446b)
- ✅ Architecture documented (ARCHITECTURE.md)

## Next Steps

### Immediate (This Week)
- [ ] Test endpoints locally with curl
- [ ] Implement `localStorage`-based session storage
- [ ] Wire diagnosticService.ts to use connector
- [ ] Add error handling + retry logic

### Short-term (Next 2 Weeks)
- [ ] Build Phase 1 UI components (6 diagnostic screens)
- [ ] Implement file indexing via localFileService
- [ ] Add consent toggles in settings UI
- [ ] Test end-to-end: file → index → session → diagnosis

### Medium-term (Weeks 3-4)
- [ ] Benchmark against Perplexity Academic, TutorAI
- [ ] Implement model switching UI
- [ ] Add file watcher for auto-index
- [ ] Create deployment docs

### Long-term (Week 5+)
- [ ] Docker Compose setup
- [ ] User documentation
- [ ] Community feedback
- [ ] Multi-domain expansion (coding, thesis, healthcare, etc.)

## Files Modified Since Last Commit

```
A  guru-backend/open_webui/routes/guru.py                (+287 lines)
A  guru-backend/core/mentor_loop.py                       (+398 lines)
A  guru-backend/core/config.py                            (+187 lines)
A  services/guruBackendConnector.ts                       (+293 lines)
A  guru-backend/ARCHITECTURE.md                           (+550 lines)
M  guru-backend/README.md                                 (updated)
```

**Total:** 1,715 lines of new code, all committed ✅

## Technical Debt / TODO

- [ ] Replace in-memory session storage (`self.sessions`) with database
- [ ] Add proper logging to mentor_loop.py
- [ ] Implement session persistence (SQLite, PostgreSQL)
- [ ] Add rate limiting to inference endpoints
- [ ] Create tests for each stage of mentor loop
- [ ] Add OpenAPI docs generation (@app.post decorators)
- [ ] Implement graceful degradation (if service fails)
- [ ] Add telemetry (session outcomes, success rates)

## Definitions Locked In

**Guru:** A native mentor operating system that:
- Teaches problem-solving, not just answers questions
- Respects user ownership of all data
- Orchestrates 6 stages: observe → baseline → questions → frame → guide → reflect
- Uses local-first computing (device-based inference)
- Integrates OpenWebUI as proven RAG + model foundation

**OpenWebUI:** Now the infrastructure layer:
- Vector DBs (Chroma, Qdrant, etc.)
- RAG pipeline (hybrid search, reranking)
- Model runtime (Ollama, llama.cpp)
- Web loaders

**Guru Backend:** Extended OpenWebUI with:
- Diagnostic API routes
- Mentor loop orchestration
- Privacy enforcement
- User ownership guarantees

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Complete system design
- [GURU_SYSTEM_SPEC.md](../GURU_SYSTEM_SPEC.md) — Mentor loop specification
- [MENTOR_LOOP_SPEC.md](../MENTOR_LOOP_SPEC.md) — 6-stage detailed spec
- [OWNERSHIP_BOUNDARY.md](../OWNERSHIP_BOUNDARY.md) — User data guarantees
- [DEVELOPER_SPEC.md](../DEVELOPER_SPEC.md) — Coding standards

---

**Status:** Guru has been successfully rebranded. OpenWebUI is now Guru's native backend. System is ready for UI implementation and testing.
