# Guru: The Ownership Boundary - Final Architecture Lock-In

**Date:** January 9, 2026  
**Status:** ✅ CRITICAL ARCHITECTURE DECISION LOCKED IN  
**Priority:** Non-negotiable

---

## The One Sentence That Defines Guru

> **Guru operates as an indexer + reasoner + narrator over user-owned files and memory on the user's device, like an IDE's intelligence layer, without owning, storing, or centralizing user data.**

If this sentence ever stops being true, Guru has failed its mission.

---

## What Just Got Locked In

### The Rule
```
Guru must NEVER become the canonical holder of user memory.
```

### The Architecture
```
YOUR DATA (User-owned, on your device)
    ↓
[Local Reading] → [Local Embedding] → [Local Index]
    ↓
[Guru Reasoning] → [Mentor Guidance]
    ↓
[You Apply or Ignore]
```

### The Three Layers (Never Mix)
1. **User-Owned Data** (you control entirely)
2. **Local Index** (vectors + references, not content)
3. **Guru Reasoning** (stateless mentor layer)

---

## Why This Matters

### It's Not Just Privacy (Though That Matters)

This is about **freedom**.

If Guru owns your data:
- ❌ Guru can change terms of service
- ❌ Guru can monetize your work
- ❌ Guru can disappear and take everything
- ❌ Guru can be hacked and expose everything
- ❌ Guru can be regulated away

If you own your data:
- ✅ You can switch mentors anytime
- ✅ You can use Guru offline
- ✅ You can sync to any provider you want
- ✅ Your data survives Guru's existence
- ✅ Zero regulatory risk

### It's Architecturally Superior

Most AI systems are **backwards**:
```
User → AI Company → AI Company's servers → AI Company's database
```

Guru is **forwards**:
```
User's Device → Local Index → Guru (stateless) → User's Device
```

This is how:
- Email clients work
- IDEs work
- Search engines work (before they became cloud)

It's proven architecture. You're not inventing anything exotic.

---

## What Changed in Code

### 1. New Types (15+ in types.ts)
```typescript
FileReference          // Metadata, never content
EmbeddingChunk         // Vector + source reference
LocalMemoryIndex       // All on device
PortableIdentity       // User controls identity
UserPermissions        // User grants access
OwnershipBoundary      // Enforces the rule
```

### 2. New Services

**LocalFileService** — Reads user's files with permission checks
- Never uploads content
- Creates references (path + hash)
- Respects OS permissions
- Watches for changes

**LocalEmbeddingService** — Embeds locally with local model
- Never sends to remote API
- Stores vectors locally
- Queries locally
- All computation on user's device

### 3. Data Flow

```
File → Hash → Chunk → Embed → Store Reference
       ↑                           ↓
       └──────── User Device ──────┘
```

---

## What This Means Day-to-Day

### For You (As Developer)
- Build against local APIs first
- Never write code that uploads user data
- All indexing happens locally
- Sync is optional, user-controlled

### For Users
- No account required (optional)
- Works offline
- Data is theirs forever
- Can share, migrate, delete anytime

### For Product
- Defensible forever
- No GDPR compliance debt
- No data breach risk
- True competitive moat (trust)

---

## The Services Architecture

### Five Services (Not Three)

**Diagnostic:**
- DiagnosticService (mentor loop)
- ClassifierService (problem diagnosis)
- RetrievalService (context retrieval)

**Data (NEW):**
- LocalFileService (file I/O + permissions)
- LocalEmbeddingService (embeddings only)

**Pattern:**
1. Data services work locally
2. Diagnostic services reason
3. No data ever leaves device
4. User controls everything

---

## Open WebUI Integration (Still Perfect)

Open WebUI provides:
```
✅ Local embedding models
✅ Vector database (local)
✅ RAG pipelines
✅ Tool hooks
✅ Self-hosted
```

You add:
```
✅ File system reader
✅ Permission system
✅ Guru reasoning layer
✅ Portable identity
```

Result: Complete, local, user-owned system.

---

## When You Might Break This (Danger Signs)

### 🚨 Danger Sign 1
```
"Let's store chat history on servers"
→ NO. Store locally. Sync user-controlled.
```

### 🚨 Danger Sign 2
```
"We need accounts for analytics"
→ NO. Analyze only what's local, never upload.
```

### 🚨 Danger Sign 3
```
"Let's use our servers as the index"
→ NO. Index is user-local. Guru is stateless.
```

### 🚨 Danger Sign 4
```
"We should train on user data"
→ NO. You can't see user data. Ever.
```

### 🚨 Danger Sign 5
```
"Users need login to use Guru"
→ NO. Optional for sync. Local-first mandatory.
```

---

## File Structure (After This Commit)

```
Guru/
├── OWNERSHIP_BOUNDARY.md        ← THE RULE (read first)
├── SYSTEM_OVERVIEW.md           ← Architecture summary
├── MENTOR_LOOP_SPEC.md          ← Mentor behavior
├── IMPLEMENTATION_ROADMAP.md    ← What to build
├── README.md                     ← Project entry
│
├── types.ts
│   ├── Diagnostic types (40+)
│   └── Ownership boundary types (15+ NEW)
│
└── services/
    ├── diagnosticService.ts     ← Mentor loop
    ├── classifierService.ts     ← Problem diagnosis
    ├── retrievalService.ts      ← Context retrieval
    ├── localFileService.ts      ← NEW: File I/O
    └── localEmbeddingService.ts ← NEW: Local embeddings
```

---

## Recent Commits (The Evolution)

```
51ad1b0 - Update system overview to emphasize ownership boundary
28e3149 - Lock in ownership boundary architecture (user owns data)
39b92e8 - Update README with comprehensive documentation
74826b3 - Add complete deliverables summary
b9e1219 - Add complete system overview
c5de5a4 - Add detailed 8-week implementation roadmap
abaa50d - Phase 1: Add diagnostic mentor loop foundation
7b5568c - Add comprehensive mentor loop specification
7610bcd - Add comprehensive mission alignment analysis
e8e2910 - Add extracted Guru project files and configuration
```

---

## Next Phase: Implementation

### Phase 1: Local Mentor (Weeks 1-4)
- [ ] LocalFileService fully implemented
- [ ] LocalEmbeddingService fully implemented
- [ ] Test: Read a file → embed → store index
- [ ] Test: Query index returns relevant chunks

### Phase 2: Diagnostic Loop UI (Weeks 5-8)
- [ ] Integrate local services with DiagnosticService
- [ ] Build UI for 6-stage mentor loop
- [ ] Test with sample codebase

### Phase 3: Identity & Sync (Weeks 9-12)
- [ ] PortableIdentity implementation
- [ ] Optional sync to user's provider
- [ ] Multi-device index sharing

### Phase 4: Production Ready (Weeks 13+)
- [ ] File watching + real-time updates
- [ ] Semantic graph building
- [ ] Collaboration (without owning data)

---

## The Competitive Moat

In a world where AI companies race to become data companies:

**You're choosing to not be a data company.**

```
ChatGPT:       "We own your usage data"
Guru:          "You own your everything"

ChatGPT:       "We'll improve based on you"
Guru:          "We improve based on research"

ChatGPT:       "Switch = lose history"
Guru:          "Switch = take everything"

ChatGPT:       Compliance debt
Guru:          Zero compliance debt
```

This is your **permanent advantage**.

---

## The Final Statement

This architecture is:
- ✅ Defensible (forever)
- ✅ Trustworthy (provable)
- ✅ Portable (user-owned)
- ✅ Profitable (no compliance debt)
- ✅ Aligned (with users)
- ✅ Correct (architecturally sound)

**Do not compromise it.**

---

## Reference Documents

**For Understanding:**
- [OWNERSHIP_BOUNDARY.md](OWNERSHIP_BOUNDARY.md) — The complete architecture
- [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) — Updated with new services

**For Implementation:**
- [types.ts](types.ts) — New ownership types (FileReference, EmbeddingChunk, etc.)
- [services/localFileService.ts](services/localFileService.ts) — File I/O template
- [services/localEmbeddingService.ts](services/localEmbeddingService.ts) — Embedding template

**For Execution:**
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) — What to build next

---

**This is the foundation. Everything else is execution.**

**Lock it in. Never compromise it. Build on it.**

---

**Document Version:** 1.0  
**Status:** ✅ LOCKED IN  
**Date:** January 9, 2026  
**Next Review:** After Phase 1 implementation
