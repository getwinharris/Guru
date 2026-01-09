# LOCAL MODELS STRATEGY

**Shifting from Cloud API to GitHub-Hosted Tiny Models**

---

## 1. Why Local Models

### Current State (Cloud)
* Gemini API calls = network latency + vendor lock-in
* User data crosses network = breach risk
* Dependency on Google quota/pricing changes
* Not usable offline
* No true ownership

### Target State (Local)
* Models run on user's device
* Model weights hosted in GitHub (cached locally once)
* Zero network calls for inference
* Fully functional offline
* Complete user ownership + control

---

## 2. Model Selection Criteria

Models must be:

| Criterion | Requirement | Examples |
|-----------|-------------|----------|
| **Size** | ≤ 5GB (fits in typical repo) | Phi-3, MobileVLM, DistilBERT |
| **Language** | Reasoning + natural language | Phi-3 Mini, TinyLlama |
| **Multimodal** | Optional but preferred | MobileVLM (7B, ~3.5GB) |
| **Speed** | <500ms per query | Optimized for CPU/GPU inference |
| **License** | MIT/Apache/Open | Not proprietary |
| **Quantized** | Yes (4-bit/8-bit) | Reduces size 80% |

---

## 3. Recommended Models for Guru

### Primary: Phi-3 Mini (3.8B)
```
Use Case: Diagnostic reasoning + mentor loop
Size: ~2.3GB (4-bit quantized)
Speed: 20-50ms inference (GPU), 200-400ms (CPU)
License: MIT
Hosted: microsoft/Phi-3-mini-4k-instruct-gguf
```

**Why:** Exceptional reasoning for its size. Trained on logic puzzles, code, math.

### Secondary: MobileVLM (3.5B)
```
Use Case: Image analysis (car diagnostics, code screenshots, diagrams)
Size: ~2.0GB (quantized)
Speed: 100-200ms per image (GPU)
License: Apache 2.0
Hosted: ywj/MobileVLM-3B
```

**Why:** Multimodal + tiny. Sees problems visually.

### Fallback: TinyLlama (1.1B)
```
Use Case: Ultra-light reasoning when bandwidth critical
Size: ~0.6GB
Speed: <100ms anywhere
License: MIT
Hosted: TinyLlama/TinyLlama-1.1B-Chat-v1.0
```

**Why:** Ultra-portable for low-end devices.

---

## 4. Architecture: Local Model Runtime

### Runtime Layer
```typescript
// services/localModelService.ts (NEW)

class LocalModelRuntime {
  private model: LLM;
  private cache: EmbeddingCache;

  async initialize() {
    // Download from GitHub (if not cached)
    // Load quantized weights
    // Warm up GPU (if available)
  }

  async reason(prompt: string): Promise<string> {
    // CPU or GPU inference (adaptive)
    // Respect token limits
    // No network calls
  }

  async embed(text: string): Promise<float32[]> {
    // Local embedding (for retrieval)
    // Cached to disk
  }

  async analyzeImage(buffer: Buffer): Promise<ImageAnalysis> {
    // Multimodal if MobileVLM available
  }
}
```

### Integration with Existing Services

```typescript
// services/diagnosticService.ts (UPDATED)

class DiagnosticService {
  private model: LocalModelRuntime;

  async generateQuestions(): Promise<DiagnosticQuestion[]> {
    // Was: await geminiService.generateQuestions(...)
    // Now: await this.model.reason(questionPrompt)
    // NO CHANGE to diagnostic loop logic
  }
}
```

---

## 5. Hosting Strategy

### GitHub Releases (Model Weights)
```
https://github.com/getwinharris/Guru/releases/
├── v1.0-phi3-mini-4bit.gguf        (2.3GB)
├── v1.0-mobilevlm-3b-4bit.gguf     (2.0GB)
└── v1.0-tinyllama-1b-8bit.gguf     (0.6GB)
```

**Download on First Run:**
```bash
# On app startup, if model not in ~/.guru/models/
# Download from GitHub release
# Cache locally (never re-download)
# Checksum verify
```

**Why GitHub:**
* Free bandwidth
* Versioning (one model per Guru version)
* Distribution built-in
* No server costs

---

## 6. Migration Plan (Minimal Risk)

### Phase 0 (This Week)
- [ ] Create `localModelService.ts` with Phi-3 Mini integration
- [ ] Test reasoning quality vs. Gemini on diagnostic prompts
- [ ] Measure latency (target: <500ms)

### Phase 1 (Weeks 1-2)
- [ ] Replace `geminiService.reason()` calls with `localModelService.reason()`
- [ ] Add model download on first run
- [ ] Keep Gemini as fallback (offline detection)

### Phase 2 (Weeks 3-4)
- [ ] Add MobileVLM for image analysis
- [ ] Test multimodal diagnostic (e.g., broken car image → questions)
- [ ] Remove Gemini fallback (confidence threshold reached)

### Phase 3 (Week 5+)
- [ ] Add TinyLlama for ultra-portable scenarios
- [ ] Support swapping models at runtime
- [ ] Document model selection for self-hosting

---

## 7. Performance & Constraints

### Latency Budget (Mentor Loop)
| Stage | Latency | Budget |
|-------|---------|--------|
| Observe (user input) | 0ms | - |
| Generate Questions | 500ms | <1s |
| Analyze Image | 200ms | <500ms |
| Frame Problem | 300ms | <1s |
| Guide Action | 400ms | <1s |

**With Phi-3 Mini on GPU:** All stages ✅ pass

**With Phi-3 Mini on CPU:** All stages ⚠️ marginal (may need TinyLlama for users on CPU-only)

### Memory Footprint
```
Model (loaded):    3-4GB (GPU VRAM)
Cache (embeddings): ~100MB per 1K problems
Index (user):      Depends on files (typically <1GB)
Total per device:  3-5GB (typical laptop has 8+GB)
```

---

## 8. Embedding Service (Local)

### Current: `localEmbeddingService.ts` (Skeleton)
```typescript
// Was using remote Gemini embeddings API
// Now: all embeddings local

async embedChunk(chunk: EmbeddingChunk): Promise<EmbeddingChunk> {
  // Use Phi-3 or MobileVLM for embeddings
  const embedding = await this.model.embed(chunk.content);
  // 384-dim vector (standard for small models)
  // Stored locally in IndexedDB or SQLite
  return { ...chunk, embedding };
}
```

**Advantage:** Embeddings never leave user's device. True privacy.

---

## 9. Offline Capability (Bonus)

Once models are cached:

```
✅ Full diagnostic mentor loop works offline
✅ Image analysis works offline
✅ Question generation works offline
✅ Retrieval works offline (index is local)

❌ Web retrieval (forward knowledge) requires network
❌ Open WebUI connection requires network (for future RAG)
```

**Result:** Guru is 95% functional offline. Core mentorship never goes down.

---

## 10. Comparison: Gemini → Local Models

| Feature | Gemini API | Local Models |
|---------|-----------|--------------|
| **Cost** | $0.075/1K tokens | $0 (once cached) |
| **Latency** | 500-2000ms | 100-500ms |
| **Privacy** | Google servers | User device only |
| **Offline** | ❌ No | ✅ Yes |
| **Customization** | Limited | Full control |
| **Lock-in Risk** | 🔴 High | 🟢 None |
| **Portability** | ❌ Vendor | ✅ Device |
| **Reasoning Quality** | Excellent | Very Good (Phi-3) |

---

## 11. Fallback & Hybrid Strategy

### Recommended Approach

```typescript
// services/modelRouter.ts (NEW)

class ModelRouter {
  async chooseModel(task: DiagnosticTask) {
    if (task.requiresMultimodal && hasGPU()) {
      return MobileVLM; // Image analysis
    } else if (isOnline() && isComplexReasoning()) {
      // Optional: call Gemini if available (user opt-in)
      return Gemini; // Better reasoning for hard problems
    } else {
      return Phi3Mini; // Default local
    }
  }
}
```

**Effect:** User gets best-effort reasoning. Guru never breaks offline.

---

## 12. Model Licensing & Attribution

All models are open-source. Guru must:

1. Include model licenses in `/licenses/` folder
2. Cite attribution when distributing models
3. Keep model sources documented

```
Microsoft Phi-3: MIT License (phi-3-mini)
HuggingFace MobileVLM: Apache 2.0 (ywj/MobileVLM)
TinyLlama Community: MIT License (TinyLlama-1.1B-Chat)
```

---

## 13. Implementation Checklist

### Week 1
- [ ] Create `services/localModelService.ts`
- [ ] Integrate Phi-3 Mini (GGUF format)
- [ ] Test diagnostic loop (Q&A generation)
- [ ] Measure latency on GPU + CPU
- [ ] Add model caching to filesystem

### Week 2
- [ ] Create `services/modelRouter.ts`
- [ ] Update `diagnosticService.ts` to use local models
- [ ] Test with real diagnostic sessions
- [ ] Add error handling (out of memory, etc.)

### Week 3
- [ ] Integrate MobileVLM for image analysis
- [ ] Update image diagnostic types
- [ ] Test multimodal scenarios

### Week 4+
- [ ] Add telemetry (latency, model usage)
- [ ] Support model swapping (Phi-3 ↔ TinyLlama)
- [ ] Document self-hosting

---

## 14. Non-Negotiable Rules

This strategy MUST maintain:

✅ **User Ownership:** Models cached locally. User owns the cache.
✅ **No Upload:** No model invocation logs sent to servers.
✅ **Offline-First:** Works without network (except web retrieval).
✅ **Mentor Loop:** Same diagnostic process, better privacy.
✅ **Teaching Mode:** Guru still explains, not automates.

---

## END OF STRATEGY
