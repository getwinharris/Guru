# IMPLEMENTATION INTEGRATION GUIDE

**How the New Specs & Local Models Integrate with Phase 1-4**

---

## 1. Specification Hierarchy

All code and features must satisfy this stack (in order):

```
GURU_SYSTEM_SPEC.md (Doctrine)
    ↓
MENTOR_LOOP_SPEC.md (6-stage process)
    ↓
LOCAL_MODELS_STRATEGY.md (Inference backbone)
    ↓
OWNERSHIP_BOUNDARY.md (Data architecture)
    ↓
IMPLEMENTATION_ROADMAP.md (Timeline)
```

**Enforcement:** Any feature that violates a higher layer must be rejected.

---

## 2. Service Architecture (Updated)

### New Inference Layer

```typescript
// Before (Cloud)
geminiService.fastChat(prompt)
  ↓ (network call)
  ↓ (data leaves device)
Gemini API

// After (Local)
localModelService.reason(prompt)
  ↓ (local inference)
  ↓ (no network)
Phi-3 Mini (device)
```

### Integration Points

**diagnosticService.ts** needs update:

```typescript
// OLD:
const response = await geminiService.think(prompt);

// NEW:
const modelRouter = await getModelRouter();
const response = await modelRouter.reason(prompt);
```

**localEmbeddingService.ts** needs update:

```typescript
// OLD:
const embedding = await geminiService.embed(text);

// NEW:
const modelRouter = await getModelRouter();
const embedding = await modelRouter.embed(text);
```

---

## 3. Phase 1: Diagnostic Loop UI

**Same 6 components, now powered by local models:**

### DiagnosticLoopUI
```typescript
import { getModelRouter } from './services/localModelService';

function DiagnosticLoopUI() {
  const [questions, setQuestions] = useState([]);
  
  async function handleObserve(observation: string) {
    const router = await getModelRouter();
    
    // Generate questions using Phi-3 Mini (local)
    const prompt = buildQuestionPrompt(observation);
    const response = await router.reason(prompt);
    
    setQuestions(parseJSON(response));
  }
}
```

**Benefit:** Inference happens on user's device. No data leaves.

---

## 4. Phase 2: Bi-Directional Retrieval

**Backward retrieval** now uses **local embeddings**:

```typescript
// services/retrievalService.ts

async getSimilarPastProblems(currentProblem: ProblemSnapshot) {
  const router = await getModelRouter();
  
  // Embed current problem locally
  const currentEmbed = await router.embed(currentProblem.description);
  
  // Search against user's local index
  const similarProblems = this.index.cosineSimilarity(currentEmbed, k=5);
  
  return similarProblems;
}
```

**Advantage:** User's history stays on device. Perfect privacy.

---

## 5. Phase 3: Evidence Intake (Multimodal)

**Image analysis** now uses **MobileVLM**:

```typescript
// Analyzing a broken car for diagnostics

async function analyzeCarImage(imageBuffer: Buffer) {
  const router = await getModelRouter();
  
  // Switch to MobileVLM for vision
  const analysis = await router.analyzeImage(
    imageBuffer,
    "What's broken? What's the likely cause?"
  );
  
  // Returns: ImageAnalysisResult with description + suggested questions
  return analysis;
}
```

**Capability:** Diagnose problems from photos, fully offline.

---

## 6. Phase 4: Mentor Decision Engine

**Reasoning loop** uses **local inference**:

```typescript
// services/mentorDecisionEngine.ts

async decideNextAction(session: DiagnosticSession): Promise<MentorAction> {
  const router = await getModelRouter();
  
  // Reason about what to do next (completely local)
  const decisionPrompt = buildDecisionPrompt(session);
  const decision = await router.reason(decisionPrompt);
  
  return parseAction(decision);
}
```

**Result:** Guru's reasoning is transparent, local, controllable.

---

## 7. Model Selection at Runtime

### Recommended Logic

```typescript
// services/modelRouter.ts - enhanced

async chooseModelFor(task: string) {
  if (task === 'image_analysis') {
    return 'mobilevlm-3b'; // Vision
  } else if (task === 'ultra_fast' && lowMemory()) {
    return 'tinyllama-1b'; // Speed
  } else {
    return 'phi-3-mini'; // Default (best reasoning)
  }
}
```

### User Control

```typescript
// Settings UI
<ModelSelector 
  current="phi-3-mini"
  available={['phi-3-mini', 'mobilevlm-3b', 'tinyllama-1b']}
  onSwitch={async (model) => {
    const router = await getModelRouter();
    await router.switchModel(model);
  }}
/>
```

---

## 8. CRITICAL: What NEVER Changes

These must hold throughout all phases:

✅ **No upload of user data**
```
FORBIDDEN: await geminiService.uploadUserFiles(userFiles)
FORBIDDEN: await firebaseService.storeUserCode()
FORBIDDEN: network call with raw content
```

✅ **No direct file mutation**
```
FORBIDDEN: fs.writeFile(userFile, modelOutput)
ALLOWED: Display diff + ask user to apply
```

✅ **Diagnostic loop always followed**
```
ALLOWED: Generate questions → User answers → Analyze pain points
FORBIDDEN: Solve problem without questions
```

✅ **Teaching-first always**
```
ALLOWED: "Here's how to fix this..."
FORBIDDEN: Apply fix automatically
```

---

## 9. Types Integration

### New Model Types (Already in types.ts)

```typescript
// From types.ts

interface LocalModelConfig {
  name: 'phi-3-mini' | 'mobilevlm-3b' | 'tinyllama-1b';
  type: 'reasoning' | 'multimodal' | 'ultra-light';
  // ... full config
}

interface InferenceOptions {
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  task?: 'question_generation' | 'evidence_analysis' | ...;
}

interface ModelRuntimeStatus {
  initialized: boolean;
  activeModel: string;
  memoryUsageMB: number;
}
```

### Update Existing Types

**diagnostic/mentorAction**: Add model info
```typescript
export interface MentorAction {
  // ... existing fields
  
  // NEW: Which model generated this?
  generatedByModel: string;
  generatedAt: number;
  reasoning: string; // Why did Guru choose this action?
}
```

**Evidence/EvidenceItem**: Support image analysis
```typescript
export interface EvidenceItem {
  // ... existing fields
  
  // NEW: For image evidence
  imageAnalysis?: ImageAnalysisResult;
}
```

---

## 10. Testing Strategy

### Unit Tests (Model Service)

```typescript
describe('LocalModelService', () => {
  it('should initialize Phi-3 Mini', async () => {
    const runtime = new LocalModelRuntime('phi-3-mini');
    await runtime.initialize();
    expect(runtime.getStatus().initialized).toBe(true);
  });

  it('should generate embeddings locally', async () => {
    const runtime = new LocalModelRuntime('phi-3-mini');
    const embed = await runtime.embed('test text');
    expect(embed.length).toBe(384);
  });
});
```

### Integration Tests (Diagnostic Loop)

```typescript
describe('DiagnosticService with Local Models', () => {
  it('should generate questions without API calls', async () => {
    const service = new DiagnosticService();
    const questions = await service.generateQuestions({...});
    
    // Verify no network calls were made
    expect(nock.isDone()).toBe(true);
  });
});
```

### E2E Tests (Full Mentor Loop)

```typescript
describe('Full Mentor Loop (Local)', () => {
  it('should complete diagnostic session offline', async () => {
    // Run diagnostic loop without network
    const session = await runDiagnosticSession({...});
    
    // Verify all inference happened locally
    expect(session.allStagesLocal).toBe(true);
  });
});
```

---

## 11. Migration Checklist

### Week 1-2 (Phase 1)
- [ ] Replace geminiService.fastChat() with localModelService.reason()
- [ ] Test question generation with Phi-3 Mini
- [ ] Measure latency + GPU memory
- [ ] Update diagnosticService.ts

### Week 3-4 (Phase 2)
- [ ] Replace geminiService.embed() with localModelService.embed()
- [ ] Test retrieval with local embeddings
- [ ] Verify index quality vs. cloud embeddings
- [ ] Update localEmbeddingService.ts

### Week 5-6 (Phase 3)
- [ ] Add MobileVLM image analysis
- [ ] Test multimodal diagnostic (car image → questions)
- [ ] Build EvidenceIntake.tsx with image upload
- [ ] Update types (ImageAnalysisResult)

### Week 7-8 (Phase 4)
- [ ] Complete MentorDecisionEngine with local reasoning
- [ ] Add ModelRouter for adaptive selection
- [ ] Test all failure scenarios (out of memory, etc.)
- [ ] Document fallback strategy

---

## 12. Deployment Architecture

### Before (Cloud)

```
User → Guru → Gemini API → Response
         ↓
      Firebase (user data)
```

**Problem:** Data leaves device. Vendor lock-in.

### After (Local)

```
User → Guru → Phi-3 (device) → Response
                 ↓
              Embeddings (device)
                 ↓
              Index (device)

User files (untouched) → LocalFileService (reads only) → Guru
```

**Benefit:** Data stays. Privacy guaranteed. Offline works.

---

## 13. Configuration & Environment

### .env.local (OLD)

```
API_KEY=sk-proj-xxxxx
FIREBASE_PROJECT_ID=guru-project
```

### .env.local (NEW)

```
# Optional: Keep for fallback
API_KEY=sk-proj-xxxxx
FALLBACK_TO_GEMINI=false

# New: Local model control
LOCAL_MODEL_CACHE_DIR=~/.guru/models
ALLOW_MULTIMODAL=true
GPU_AVAILABLE=auto
EMBEDDING_CACHE_SIZE_MB=500
```

---

## 14. Documentation Updates Needed

After each phase, update:

- [ ] [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Mark completed phases
- [ ] [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) - Show actual architecture running
- [ ] README.md - Add "Local Model Status" section
- [ ] Model documentation in `/docs/MODELS.md` - How to swap models, troubleshoot

---

## 15. Success Criteria

By end of Phase 4:

✅ All inference happens on user's device (zero cloud calls for reasoning/embedding)
✅ Images analyzed locally (MobileVLM)
✅ Full mentor loop works offline
✅ Model runtime status visible to user
✅ User can swap between Phi-3/MobileVLM/TinyLlama at runtime
✅ All existing diagnostic features work identically
✅ Latency still <500ms per mentor loop stage
✅ No vendor lock-in (can remove Gemini API key)

---

## 16. Rollout Plan

### Beta (Internal)
- Week 1-4: Phi-3 Mini only, team testing
- Collect latency + memory metrics
- Fix any reasoning quality issues

### Canary (Trusted Users)
- Week 5: Release to 10% of users with Phi-3 Mini
- A/B test latency: local vs. cloud
- Monitor errors + feedback

### General Availability (All Users)
- Week 6: Roll out to 100%, make local default
- Keep Gemini as optional fallback
- Disable cloud-only features

### Full Decommission (Optional)
- Week 7+: Remove Gemini dependency entirely
- Archive geminiService.ts (maybe keep as reference)
- Announce Guru is now fully local + private

---

## END OF INTEGRATION GUIDE

This guide bridges the doctrine (GURU_SYSTEM_SPEC), strategy (LOCAL_MODELS_STRATEGY),
and implementation (4-phase roadmap). Use it to ensure every code change aligns with
the non-negotiable principles.

**Key Principle:** Guru is a mentor orchestrator running on user's device, not a cloud
service wearing mentor's clothes.
