# Guru: Complete System Overview

**Status:** Foundation + Planning Complete ✅  
**Date:** January 9, 2026  
**Next Phase:** Phase 1 Implementation (Week 1-2)

---

## CRITICAL ARCHITECTURE PRINCIPLE

**User owns all data. Guru indexes locally. Never centralized.**

→ See [OWNERSHIP_BOUNDARY.md](OWNERSHIP_BOUNDARY.md) for the full rule.

---

## What is Guru?

**The Problem Guru Solves:**

Only **1 in 4 people** ever has a mentor. Fewer than **1 in 10** have a good one.

Why human mentors fail:
- **Ego** - They gatekeep knowledge
- **Power** - They create fear of looking stupid
- **Time** - They're too busy for patience
- **Access** - They're geographically/socially limited

**Guru's Solution:**

A **judgment-free, patient, diagnostic mentor** that removes every barrier human mentors create—**without ever owning your data**.

---

## The Mentor Loop (Universal)

Every domain follows the same pattern:

```
1. OBSERVE   → Gather evidence (images, documents, descriptions)
2. BASELINE  → Understand current state (what works, what doesn't)
3. QUESTIONS → Ask targeted clarifying questions (max 3)
4. PAIN      → Identify hidden blockers (time, skill, tools)
5. FRAME     → Reframe the problem correctly
6. GUIDE     → Step-by-step guidance with verification
```

This works for:
- 🚗 Broken car
- 💻 Crashing code
- 📝 Weak thesis
- 📊 Project issues
- 🎓 Learning gaps

---

## Competitive Advantage

Traditional AI (ChatGPT, Claude):
- Answers questions
- But forgets history
- Jumps to solutions
- Generic for every domain
- **Owns your data** ⚠️

**Guru:**
- Diagnoses problems
- **Remembers user history** (backward retrieval)
- **Understands domain knowledge** (forward retrieval)
- **Customizes for intersection** (this specific user + this problem type)
- **You own your data** ✅ (Guru indexes locally, never stores)

---

## Architecture

### Data Ownership Model (Critical)

```
YOUR FILES → Guru reads locally → Guru creates embeddings locally
   ↑                                         ↓
   └─────────────────── You own everything ──┘
   
Guru never uploads, never stores, never owns.
```

See [OWNERSHIP_BOUNDARY.md](OWNERSHIP_BOUNDARY.md) for complete architecture.

### Five Core Services

#### 1. **DiagnosticService** ([services/diagnosticService.ts](services/diagnosticService.ts))
Orchestrates the 6-stage mentor loop

```typescript
- Create diagnostic session
- Advance through stages
- Collect evidence systematically
- Make mentor decisions
- Complete and archive session
```

#### 2. **BiDirectionalRetrieval** ([services/retrievalService.ts](services/retrievalService.ts))
Connects user history ↔ problem space

```typescript
BACKWARD (User History):
- Past problems solved
- Learning style
- Skill levels by domain
- Mistakes repeated
- Constraints discovered

FORWARD (Problem Space):
- Diagnostic trees (decision nodes)
- Problem types + indicators
- Standards + best practices
- Common pitfalls
- Example problems

INTERSECTION:
- Customized questions
- Personalized explanations
- Relevant precedents
```

#### 3. **ClassifierService** ([services/classifierService.ts](services/classifierService.ts))
Maps evidence → problem type

```typescript
- Extract indicators from observation
- Classify problem type
- Calculate confidence
- Identify constraints
- Detect misconceptions
```

#### 4. **LocalFileService** ([services/localFileService.ts](services/localFileService.ts))
**NEW:** Operates over user-owned files respecting ownership boundary

```typescript
- Read user's files (with permission)
- Create file references (metadata only, no raw content)
- Chunk files for embedding
- Watch for file changes
- Respect OS permissions + exclusion patterns
```

#### 5. **LocalEmbeddingService** ([services/localEmbeddingService.ts](services/localEmbeddingService.ts))
**NEW:** Generate and store embeddings locally

```typescript
- Embed chunks with local model (never upload)
- Build searchable index locally
- Query index (semantic search, all local)
- Update when files change
- Save/load index from user's device
```

---

## Data Flow (You Control Everything)

```
Your Files (on your device)
     ↓
[LocalFileService: read + permission check]
     ↓
[Chunk into semantic units]
     ↓
[LocalEmbeddingService: embed locally]
     ↓
[Store: vectors + file references locally]
     ↓
[Query for mentor assistance]
     ↓
[Guru reasons + narrates guidance]
     ↓
[You apply suggestions (or not)]
```

**Network traffic:** Zero (fully local) or optional (sync your index to your iCloud/Dropbox)

---

## New Type System

Complete diagnostic framework ([types.ts](types.ts) - 40+ new types):

```typescript
// Session management
DiagnosticSession          // Top-level session
DiagnosticStage            // 6 stages: observe → complete

// Data collection
ObservationData            // User's problem + evidence
BaselineData               // What works/doesn't work
PainPoint                  // Hidden blockers
ProblemFrame               // Problem categorization

// User context
UserDiagnosticProfile      // Learning style, history, constraints
ProblemSnapshot            // Past problem + outcome

// Domain knowledge
DomainDiagnosticModule     // Per-domain expertise
DiagnosticQuestion         // Precise questions
DiagnosticNode             // Decision tree node
Standard, Pitfall, Example // Domain assets

// Mentor actions
MentorAction               // ask / explain / guide / loop_back
GuidanceStep               // Multi-step guidance
DiagnosticFeedback         // User feedback on session
```

---

## Document Hierarchy

### 1. [MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md)
**What:** Why Guru matters + research backing  
**Audience:** Stakeholders, founders  
**Key Insight:** 75% of people lack good mentors due to fear/ego, not intelligence

---

### 2. [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md)
**What:** Universal diagnostic pattern + implementation spec  
**Audience:** Architects, engineers  
**Key Innovation:** 6-stage loop works across ANY domain

---

### 3. [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)
**What:** 8-week execution plan with detailed tasks  
**Audience:** Project managers, engineers  
**Key Detail:** Phase-by-phase breakdown with success criteria

---

### 4. This Document
**What:** Bird's-eye overview of entire system  
**Audience:** Anyone joining the project  
**Purpose:** Single source of truth

---

## Current State

### ✅ Complete
- [ ] Research on mentorship gap
- [ ] Universal mentor loop pattern
- [ ] Type system for diagnosis
- [ ] Service skeletons (diagnosticService, classifierService, retrievalService)
- [ ] Documentation (3 major specs)

### ⏳ In Progress (Phase 1)
- [ ] DiagnosticLoopUI component (visual stage indicator)
- [ ] ProblemClassifier UI (show classification to user)
- [ ] DiagnosticQuestionRenderer (display 2-3 targeted questions)
- [ ] PainPointExtractor (surface blockers)
- [ ] ProblemFrameConfirmation (reframe validation)
- [ ] GuideStepRenderer (multi-step guidance)

### 🔮 Future (Phases 2-4)
- [ ] Bi-directional retrieval logic
- [ ] Domain modules (JavaScript, Car Repair, Thesis Writing, etc.)
- [ ] Evidence intake templates
- [ ] Mentor decision engine
- [ ] Loop-back handling

---

## Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| [types.ts](types.ts) | Diagnostic type system | ✅ Complete |
| [services/diagnosticService.ts](services/diagnosticService.ts) | Mentor loop orchestrator | ✅ Skeleton |
| [services/classifierService.ts](services/classifierService.ts) | Problem classification | ✅ Skeleton |
| [services/retrievalService.ts](services/retrievalService.ts) | Bi-directional retrieval | ✅ Skeleton |
| [MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md) | Why Guru matters | ✅ Complete |
| [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md) | Universal mentor pattern | ✅ Complete |
| [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) | 8-week execution plan | ✅ Complete |

---

## How to Contribute

### For UI Engineers
- Build Phase 1 components (see [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md#phase-1))
- Create diagnostic loop visual
- Connect to diagnosticService stubs

### For Backend Engineers
- Implement classifierService logic
- Build retrievalService queries
- Create database schema for sessions + user profiles

### For Domain Experts
- Define diagnostic tree for your domain
- List problem types + indicators
- Provide 5-10 example problems with solutions

### For Architects
- Review type system for extensibility
- Suggest retrieval optimizations
- Plan for multi-domain scaling

---

## Success Metrics

### User Experience
✅ User understands diagnostic stage at all times  
✅ User feels respected ("No dumb questions" culture)  
✅ User gets specific guidance, not generic answers  
✅ User learns *how* to diagnose, not just the solution  

### Technical
✅ Diagnostic session completes with resolution  
✅ Bi-directional retrieval personalizes per user + domain  
✅ New domains can be added without core changes  
✅ Decision tree handles edge cases + loop-back  

### Business
✅ Session completion rate > 80%  
✅ User satisfaction > 4.5/5  
✅ Reusable across domains (not just coding)  
✅ Defensible against generic LLMs  

---

## Why This Matters (For the Team)

You're not building:
- ❌ Another chatbot
- ❌ A code generator
- ❌ A search engine

You are building:
- ✅ **The first diagnostic mentor engine** that works across domains
- ✅ **A system that removes barriers** to learning (fear, shame, gatekeeping)
- ✅ **A defensible moat** against commoditized LLMs (diagnosis > answers)

**This is the next step in AI mentorship.**

---

## Questions to Ask Yourself

When writing code or making decisions, ask:

1. **Does this remove fear?**
   - Can a user ask without shame?
   - Is there judgment in the UI/language?

2. **Does this show we respect the user?**
   - Do we explain WHY we're asking?
   - Do we acknowledge their constraints?

3. **Does this prevent gatekeeping?**
   - Can anyone use this, regardless of background?
   - Or does it assume certain knowledge?

4. **Does this teach, not just tell?**
   - Does the user understand the process?
   - Would they recognize the pattern next time?

If the answer to any is "no", reconsider.

---

## Next Steps (This Week)

### Immediate
1. ✅ Distribute [MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md) to stakeholders
2. ✅ Distribute [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md) to engineers
3. ✅ Schedule sprint planning meeting
4. ⏳ Assign Phase 1 tasks to UI engineer

### By End of Week
5. ⏳ First diagnostic UI component mocked
6. ⏳ Integration with App.tsx planned
7. ⏳ Test with 3 sample diagnostic sessions

---

## Resources

### Reading Order
1. This document (5 min overview)
2. [MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md) (understand the why)
3. [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md) (understand the how)
4. [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) (understand the what)

### Code Entry Points
- Start reading: [services/diagnosticService.ts](services/diagnosticService.ts)
- Type reference: [types.ts](types.ts) (search "DiagnosticSession")
- Understand flow: Review the 6-stage pattern in [MENTOR_LOOP_SPEC.md#part-1](MENTOR_LOOP_SPEC.md#part-1)

---

## FAQ

**Q: Isn't this just ChatGPT with extra steps?**  
A: No. ChatGPT answers questions. Guru diagnoses problems. Guru remembers your history. Guru asks *why*, not just answers.

**Q: How is this different from Stack Overflow or forums?**  
A: Stack Overflow is async and impersonal. Guru is real-time and personalized. Guru knows your skill level and history.

**Q: What about privacy?**  
A: User data stays private. No advertising. No training on user conversations (TBD - add to privacy policy).

**Q: Can this really work across car repair AND coding?**  
A: Yes. The mentor loop is universal. Only the diagnostic tree differs. See car/code examples in [MENTOR_LOOP_SPEC.md#part-1](MENTOR_LOOP_SPEC.md#part-1).

**Q: How long until launch?**  
A: 8 weeks for full system. 2 weeks for MVP diagnostic UI. Can test with real users in 4 weeks.

---

## Commit History

```
commit abaa50d - Phase 1: Add diagnostic mentor loop foundation types and services
commit 7b5568c - Add comprehensive mentor loop specification - universal diagnostic framework
commit 7610bcd - Add comprehensive mission alignment analysis based on mentorship research
commit e8e2910 - Add extracted Guru project files and configuration
```

---

## Contact & Questions

- Questions about the mentor loop? → See [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md)
- Questions about implementation? → See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)
- Questions about why this matters? → See [MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md)
- Questions about types? → See [types.ts](types.ts)

---

**Version:** 1.0  
**Last Updated:** January 9, 2026  
**Maintainer:** Copilot Analysis  
**Status:** Ready for Review & Sprint Planning
