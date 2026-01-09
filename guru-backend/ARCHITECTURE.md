# Guru: Native Mentor System

**Guru** is a native mentor operating system for learning and problem-solving. It uses OpenWebUI's proven RAG and model infrastructure as its foundation, rebranded and extended with a 6-stage diagnostic mentor loop.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GURU FRONTEND                            │
│  (Svelte UI: Diagnostic Loop, Mentor Conversation, Files)   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              GURU TYPESCRIPT LAYER                           │
│  (Frontend Services: Diagnostic State, Retrieval, Models)   │
│     • diagnosticService.ts (6-stage orchestration)          │
│     • retrievalService.ts (History + Domain Knowledge)      │
│     • localModelService.ts (Model router)                   │
│     • guruBackendConnector.ts (Bridge to backend)           │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ↓                               ↓
    HTTP Calls                    Local Files
    (JSON API)                    (user files)
         │                               │
         ↓                               ↓
┌─────────────────────────────────────────────────────────────┐
│          GURU BACKEND (Python FastAPI)                       │
│  Extended OpenWebUI with Diagnostic Endpoints               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ GURU ROUTES (/api/guru/*)                            │   │
│  │  • /diagnostic/session/* (6-stage orchestration)    │   │
│  │  • /retrieval/* (Query history & index files)       │   │
│  │  • /models/* (Model switching, inference)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ GURU CORE SERVICES                                   │   │
│  │  • mentor_loop.py (6-stage orchestration)           │   │
│  │  • diagnostic_service.py (Problem framing)          │   │
│  │  • retrieval_service.py (History + domain knowledge)│   │
│  │  • config.py (Feature flags, privacy settings)      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ OPENWEBUI CORE (RAG + Models)                        │   │
│  │  • Vector DBs (Chroma, Qdrant, Milvus, Weaviate)   │   │
│  │  • Retrieval Pipeline (Hybrid search, reranking)    │   │
│  │  • Model Runtime (Ollama, llama.cpp)                │   │
│  │  • Web Loaders (YouTube, web scraping)              │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬─────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────┐
    ↓            ↓            ↓          ↓
 Chroma      Vector Embeddings  Models  User Files
 (Local DB)   (Phi-3, Device)  (Ollama)  (on Disk)
```

## The 6-Stage Mentor Loop

Guru orchestrates diagnostic mentorship through six stages:

### 1. **OBSERVE** — User Describes the Problem
- **Mentor's Role:** Listen to what the user perceives
- **Output:** Problem classification, retrieval of similar past problems
- **User Sees:** "Tell me what's happening"

### 2. **BASELINE** — Establish What's Working & Constraints
- **Mentor's Role:** Understand the scope (what works, what doesn't, limitations)
- **Output:** Diagnostic questions tailored to the problem type
- **User Sees:** "What currently works? What are your constraints?"

### 3. **QUESTIONS** — Systematically Narrow the Problem Space
- **Mentor's Role:** Ask targeted questions to disambiguate
- **Output:** Probability distribution over root causes
- **User Sees:** "When did this start?" "Have you tried...?" "Does X happen?"

### 4. **FRAME** — Diagnosis: What the Problem IS and ISN'T
- **Mentor's Role:** Synthesize observations into a coherent model
- **Output:** Problem type, root cause hypothesis, confidence, caveats
- **User Sees:** "I think this is a fuel pump issue, not electrical"

### 5. **GUIDE** — Teach Action (Not Just Execute)
- **Mentor's Role:** Decide first step, explain reasoning, set expectations
- **Output:** Guided action steps with reasoning and risk assessment
- **User Sees:** "Try X first because Y. You'll know it worked when Z."

### 6. **REFLECT** — Extract Principles for Future
- **Mentor's Role:** Understand outcome, teach the principle
- **Output:** "When you see X, do Y" — stored for future reference
- **User Sees:** "That's a valuable lesson for next time"

## User Ownership (Non-Negotiable)

✅ **User owns all:**
- Problem descriptions
- Solution attempts and outcomes
- Extracted principles and lessons
- All indexed files

✅ **Guru never:**
- Uploads user files without explicit consent
- Calls external APIs (default: offline only)
- Shares data across users
- Locks user into vendor platform

✅ **Data flow (locked):**
```
User's Files (Device)
  ↓
LocalFileService (respects permissions)
  ↓
LocalEmbeddingService (Phi-3, device only)
  ↓
GuruVectorDB (local index, owned by user)
  ↓
DiagnosticService (stateless reasoning)
  ↓
ModelRouter (Phi-3 → MobileVLM → TinyLlama on device)
  ↓
Mentor Output → User applies (always in control)
```

## Getting Started

### Prerequisites
- Docker & Docker Compose (or Python 3.10+)
- 4GB RAM minimum (8GB recommended)
- GPU optional but recommended (CUDA 11.8+)

### Option 1: Docker Compose (Recommended)

```bash
cd /workspaces/Guru
docker-compose up -d
```

This starts:
- Guru Backend (FastAPI) on `localhost:8000`
- Chroma Vector DB on `localhost:8000`
- Ollama (if configured) on `localhost:11434`

### Option 2: Local Python

```bash
cd /workspaces/Guru/guru-backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python -m uvicorn open_webui.main:app --reload --port 8000
```

### Option 3: Local TypeScript (Frontend Only)

```bash
cd /workspaces/Guru
npm install
npm run dev
```

Frontend will call backend at `http://localhost:8000` (configurable via `.env.local`).

## API Endpoints

### Diagnostic Sessions

**Create Session**
```bash
POST /api/guru/diagnostic/session/create
{
  "userId": "user123",
  "domain": "car_repair",
  "problemDescription": "Car won't start..."
}
```

**Record Observation**
```bash
POST /api/guru/diagnostic/observe
{
  "sessionId": "user123-car_repair-12345",
  "observation": "Car won't start..."
}
```

**Record Baseline**
```bash
POST /api/guru/diagnostic/baseline
{
  "sessionId": "...",
  "baseline": {
    "whatWorks": "Lights turn on, battery is good",
    "constraints": "Can't tow to shop until Friday",
    "affectedAreas": ["engine", "starting"]
  }
}
```

**Answer Diagnostic Question**
```bash
POST /api/guru/diagnostic/answer
{
  "sessionId": "...",
  "questionId": "q1",
  "answer": "When I turn the key, I hear a click but no cranking"
}
```

**Get Frame (Diagnosis)**
```bash
POST /api/guru/diagnostic/frame
{
  "sessionId": "..."
}
→ {
  "frame": {
    "primaryType": "fuel_system_failure",
    "isntType": ["battery_dead", "alternator"],
    "rootCauseCategory": "fuel_pump",
    "confidence": 0.85
  }
}
```

**Get Guidance**
```bash
POST /api/guru/diagnostic/guide
{
  "sessionId": "..."
}
→ {
  "guidance": [
    {
      "step": 1,
      "action": "Check fuel pressure with gauge",
      "why": "Rules in/out pump failure"
    }
  ]
}
```

### Retrieval & RAG

**Query User History**
```bash
POST /api/guru/retrieval/query
{
  "userId": "user123",
  "domain": "car_repair",
  "query": "won't start fuel pump"
}
```

**Index User Files**
```bash
POST /api/guru/retrieval/index
{
  "userId": "user123",
  "files": ["/Users/user/Documents/car_manual.pdf"],
  "userConsent": true
}
```

**List Diagnostic Domains**
```bash
GET /api/guru/retrieval/domains
→ {
  "domains": [
    {"name": "car_repair", "label": "Car Repair"},
    {"name": "coding", "label": "Software Development"}
  ]
}
```

### Models

**List Available Models**
```bash
GET /api/guru/models/list
→ {
  "models": [
    {"id": "phi-3-mini", "type": "reasoning", "active": true},
    {"id": "mobilevlm-3b", "type": "multimodal", "active": false}
  ]
}
```

**Switch Model**
```bash
POST /api/guru/models/switch
{
  "modelId": "phi-3-mini"
}
```

**Generate Inference**
```bash
POST /api/guru/models/generate
{
  "prompt": "Explain fuel pump failures",
  "options": {"maxTokens": 500}
}
```

## Key Files

**Frontend (TypeScript)**
- `services/guruBackendConnector.ts` — Bridge to Guru Backend
- `services/diagnosticService.ts` — Frontend diagnostic state
- `services/retrievalService.ts` — History + domain knowledge
- `services/localModelService.ts` — Model routing
- `components/diagnostic/` — UI components for 6-stage loop

**Backend (Python)**
- `guru-backend/open_webui/routes/guru.py` — Guru API endpoints
- `guru-backend/core/mentor_loop.py` — 6-stage orchestration
- `guru-backend/core/config.py` — Feature flags, privacy settings
- `guru-backend/services/` — Diagnostic, retrieval, model services
- `resources/open-webui/` — Base OpenWebUI stack (RAG + models)

**Configuration**
- `.env.local` — Environment variables
- `guru-backend/core/config.py` — Backend feature flags
- `docker-compose.yml` — Container orchestration

## Configuration

### Environment Variables

```bash
# Frontend
GURU_BACKEND_URL=http://localhost:8000
USE_OPENWEBUI=true

# Backend
OPENWEBUI_PATH=/workspaces/Guru/resources/open-webui
CHROMA_DB_PATH=/data/chroma
VECTOR_DB_TYPE=chroma
DEFAULT_REASONING_MODEL=phi-3-mini
REQUIRE_CONSENT_FOR_UPLOADS=true
BLOCK_EXTERNAL_API_CALLS=false
```

### Backend Feature Flags

Edit `guru-backend/core/config.py`:

```python
class GuruBackendConfig:
    ENABLE_DIAGNOSTIC_LOOP = True      # Run 6-stage mentor loop
    ENABLE_LOCAL_MODELS = True          # Use device-local models
    ENABLE_RETRIEVAL = True             # Query history + domain knowledge
    ENABLE_MENTOR_MEMORY = True         # Store/retrieve past sessions
    
    REQUIRE_CONSENT_FOR_UPLOADS = True  # Block uploads without consent
    BLOCK_EXTERNAL_API_CALLS = False    # Never call external APIs
```

## Development

### Adding a New Diagnostic Domain

1. **Create domain classifier** in `guru-backend/services/diagnostic_service.py`:
```python
@staticmethod
def classify_thesis_writing(observation: str) -> str:
    """Classify thesis writing problems."""
    # Return problem type
```

2. **Add domain questions** in `guru-backend/core/mentor_loop.py`:
```python
"thesis_writing": {
    "baseline": ["Is your thesis drafted?", "What's the deadline?"],
    "diagnostic": ["What section are you stuck on?", "Have you researched...?"],
}
```

3. **Test with curl**:
```bash
curl -X POST http://localhost:8000/api/guru/diagnostic/session/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test",
    "domain": "thesis_writing",
    "problemDescription": "..."
  }'
```

### Extending the Mentor Loop

1. Edit `guru-backend/core/mentor_loop.py`
2. Add new stage methods to `MentorLoopOrchestrator`
3. Update `MentorStage` enum
4. Register in `guru-backend/open_webui/routes/guru.py`
5. Add tests in `tests/mentor_loop_test.py`

### Running Tests

```bash
cd /workspaces/Guru
python -m pytest tests/ -v
```

## Architecture Decisions

### Why OpenWebUI as Foundation?

✅ **Already has:**
- Battle-tested RAG pipeline (used in production)
- Multiple vector DB adapters (Chroma, Qdrant, Weaviate, etc.)
- Web loaders (YouTube, web scraping)
- Model runtime (Ollama, llama.cpp)
- Semantic chunking + reranking

✅ **We extend with:**
- 6-stage diagnostic mentor loop
- Problem-centric (not chat-centric) UI
- User ownership enforcement
- Principle extraction & storage

### Why Local-First?

✅ **Privacy:** User files never leave device
✅ **Speed:** 100ms latency vs. 5s cloud round-trip
✅ **Offline:** Works without internet
✅ **Cost:** No API bills
✅ **Control:** User owns all data

### Why Phi-3 Mini?

✅ **3.8B parameters:** Runs on 4GB RAM
✅ **Reasoning:** Excellent for problem-solving
✅ **Local:** No external API calls
✅ **Fast:** 50-100 tokens/sec on CPU

Fallback chain: Phi-3 Mini → MobileVLM (multimodal) → TinyLlama (ultra-light)

## Ownership Boundary (Locked)

**This is non-negotiable:**

```python
# Every endpoint enforces:
if endpoint_uploads_files and not user_consent:
    raise PermissionError("User consent required")

# Every interaction logs:
logger.info(f"User {user_id} owns: {files_accessed}")

# Every session stores:
session.owner = user_id  # Not Guru, not OpenWebUI
```

**Verification:**
- Grep for `user_consent` — should appear in all upload paths
- Grep for `userId` — should be in all storage/retrieval
- Check `guru-backend/core/config.py` — `REQUIRE_CONSENT_FOR_UPLOADS = True`

## Differences from Vanilla OpenWebUI

| Feature | OpenWebUI | Guru |
|---------|-----------|------|
| **Primary UX** | Chat interface | Diagnostic mentor loop |
| **Problem Model** | Conversational | 6-stage: observe → baseline → questions → frame → guide → reflect |
| **Data Ownership** | Shared across users | Per-user isolation |
| **Consent** | Optional | Required for uploads |
| **Reasoning** | Model-as-black-box | Problem-centric mentorship |
| **History** | Chat log | Problem-solution-principle pairs |
| **Teaching** | Model explains | Mentor teaches why |

## License

Guru wraps OpenWebUI (MIT License) and extends it with proprietary mentor logic.
See `LICENSE.md` for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/getwinharris/Guru/issues)
- **Discussions:** [GitHub Discussions](https://github.com/getwinharris/Guru/discussions)
- **Docs:** `/docs/` folder
- **Specs:** Root-level `*_SPEC.md` files

---

**Guru: Learn by solving real problems, with a mentor who teaches, not just answers.**
