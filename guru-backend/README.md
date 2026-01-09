# Guru Backend

**Native Guru mentor system backend** — built on OpenWebUI's proven RAG + vector DB architecture, rebranded and customized for diagnostic mentorship.

## Architecture

```
User Files (owned) → LocalFileService (read, hash, chunk)
                        ↓
                  LocalEmbeddingService (embed locally)
                        ↓
                  GuruVectorDB (index, retrieve)
                        ↓
                  DiagnosticService (6-stage mentor loop)
                        ↓
                  ModelRouter (Phi-3 Mini / MobileVLM / TinyLlama)
                        ↓
                  Mentor Output (questions, guidance, frame)
                        ↓
                  User (learns, applies, owns all memory)
```

## What's Included

- **Backend**: Python FastAPI server extending OpenWebUI with Guru mentor logic
- **RAG Pipeline**: Vector DB (Chroma/Qdrant), hybrid search, reranking
- **Model Management**: Ollama integration, Phi-3 Mini, MobileVLM, TinyLlama
- **Diagnostic Loop**: 6-stage mentor orchestration
- **Ownership Layer**: Strict user data isolation, no uploads without consent
- **API**: RESTful endpoints for diagnostic sessions, retrieval, model management

## Getting Started

### 1. Start Backend

```bash
cd guru-backend
python -m pip install -r requirements.txt
python open_webui/main.py
```

Backend runs at `http://localhost:8000`.

### 2. Configure Environment

```bash
# .env
OPENWEBUI_BASE_URL=http://localhost:8000
USE_OPENWEBUI=true
LOCAL_MODEL_CACHE_DIR=~/.guru/models
ALLOW_MULTIMODAL=true
```

### 3. Frontend Integration

```bash
npm install
npm run dev
```

Frontend connects to backend and runs diagnostic UI.

## Key Endpoints (Guru-Branded)

### Diagnostic Sessions

- `POST /api/guru/diagnostic/session/create` — Start new diagnostic session
- `POST /api/guru/diagnostic/observe` — Record observation
- `POST /api/guru/diagnostic/baseline` — Record baseline
- `POST /api/guru/diagnostic/questions` — Generate diagnostic questions
- `POST /api/guru/diagnostic/frame` — Frame the problem
- `POST /api/guru/diagnostic/guide` — Get guided actions

### Retrieval & RAG

- `POST /api/guru/retrieval/query` — Query user's past problems
- `POST /api/guru/retrieval/index` — Index user files (local, encrypted)
- `GET /api/guru/retrieval/domains` — Available diagnostic domains

### Models

- `GET /api/guru/models/list` — Available local models
- `POST /api/guru/models/switch` — Switch active model (Phi-3 → MobileVLM)
- `POST /api/guru/models/generate` — Inference (local or fallback)

## Ownership Guarantees

✅ **User Files**: Never uploaded. Hashed locally, indexed locally.
✅ **User Memory**: Lives on user's device or user-controlled storage.
✅ **User Consent**: Explicit opt-in for any remote features.
✅ **No Vendor Lock-In**: All data portable, all models open-source.

## Differences from OpenWebUI

| Aspect | OpenWebUI | Guru |
|--------|-----------|------|
| **Purpose** | General chat + RAG | Diagnostic mentorship |
| **Loop** | Message-based | 6-stage diagnostic loop |
| **Data Model** | Server-centric | User-centric (local-first) |
| **Endpoints** | Generic chat/retrieval | Diagnostic + retrieval + mentor |
| **UI** | Chat interface | Diagnostic questionnaire UI |
| **Branding** | OpenWebUI | Guru |

## Development

### Adding a Diagnostic Domain

```python
# guru-backend/open_webui/retrieval/domains/car_repair.py
class CarRepairDiagnosticModule:
    domain = "car_repair"
    diagnostic_tree = {...}
    common_pitfalls = [...]
    examples = [...]
```

### Extending the Mentor Loop

```python
# guru-backend/open_webui/functions.py
@app.post("/api/guru/diagnostic/custom_stage")
async def custom_diagnostic_stage(payload):
    # Your custom reasoning here
    pass
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Docker, Kubernetes, production setup.

## License

Same as OpenWebUI (MIT + specific modifications for Guru).

---

**Guru is a personal mentor orchestrator that respects user ownership, privacy, and agency.**
