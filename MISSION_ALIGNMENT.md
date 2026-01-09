# Guru Mission Alignment: Research-to-Code Analysis

## Core Mission Statement

**Guru** is a private, judgment-free, patient mentor that helps people think clearly, diagnose problems, and grow competence.

---

## Part 1: Research Foundation

### The Problem Guru Solves

**Reality Check from Research:**

| Population | Has Access to Mentor | Quality/Ongoing | 
|-----------|----------------------|-----------------|
| Students | 30-40% | <50% effective |
| Professionals | 20-35% | <50% sustained |
| First-Gen/Self-Taught | <15-20% | Mostly informal |
| **Global Average** | **~1 in 4** | **<1 in 10 good** |

### Why Human Mentors Fail

1. **Ego & Authority** → Gatekeeping knowledge
2. **Power Imbalance** → Creates fear, filters questions
3. **Time Scarcity** → Rushed sessions, forgotten context
4. **Survivorship Bias** → "Just work hard" advice ignores constraints
5. **Inaccessibility** → Geographically/socially limited

### Why the Web Became the Default

- Non-judgmental access
- No hierarchy
- Always available
- **BUT:** Impersonal, no continuity, lacks diagnosis

### What Makes an AI Mentor Different

An LLM mentor removes barriers when designed correctly:

✅ Available 24/7 (no scheduling)  
✅ Remembers context (with retrieval)  
✅ Never judges (by design)  
✅ Never gatekeeps (scales freely)  
✅ Never tires (consistent patience)  

---

## Part 2: Code Architecture Assessment

### Current Strengths Aligned with Mission

#### 1. **Judgment-Free Design**
- **Evidence in Code:**
  - [ChatInput.tsx](ChatInput.tsx) - Universal input (text, voice, files)
  - [CinemaSubtitles.tsx](CinemaSubtitles.tsx) - Multi-language support (no "correct" language bias)
  - No validation/rejection of user questions at UI level
  - Async processing (doesn't make user wait = no pressure)

- **Status:** ✅ **ALIGNED**
- **Recommendation:** Add explicit UX pattern: "No question is too basic" messaging

---

#### 2. **Patience (Context Retention)**
- **Evidence in Code:**
  - [types.ts](types.ts) - `Message` interface stores full history
  - [geminiService.ts](geminiService.ts) - `think()` function includes history parameter
  - [App.tsx](App.tsx) - `messages` state accumulates, not replaced
  
- **Status:** ✅ **ALIGNED**
- **Recommendation:** Ensure history is never silently truncated; add warning if context length nears limit

---

#### 3. **Privacy-First**
- **Evidence in Code:**
  - [.env.local](.env.local) - API keys local, not exposed
  - No analytics tracking visible in codebase
  - [firebaseService.ts](services/firebaseService.ts) - Likely handles auth gating
  
- **Status:** ⚠️ **NEEDS CLARIFICATION**
- **Gap:** No explicit privacy policy visible; data retention unclear
- **Recommendation:** Add privacy declaration to [README.md](README.md)

---

#### 4. **Think Clearly (Grounding)**
- **Evidence in Code:**
  - [GroundingPanel.tsx](components/GroundingPanel.tsx) - Displays 50+ real-time academic sources
  - [geminiService.ts](services/geminiService.ts#L39) - `think()` uses academic-only grounding:
    ```typescript
    GROUNDING_PRIORITY: ArXiv, HuggingFace, GitHub, Academic Papers, Documentation
    ```
  - [types.ts](types.ts#L10) - `GroundingSource` tracks source fidelity

- **Status:** ✅ **ALIGNED**
- **Recommendation:** Make grounding strategy visible in UI ("Why this answer comes from...")

---

#### 5. **Diagnose Problems (Guided Questioning)**
- **Evidence in Code:**
  - [Message interface](types.ts#L30) - `guidedQuestion?` field exists but may be underutilized
  - [geminiService.ts](services/geminiService.ts) - Synthesis strategy stored
  - [ThinkerNotes interface](types.ts#L52) - Stores reasoning, contradictions found
  
- **Status:** ⚠️ **PARTIALLY ALIGNED**
- **Gap:** "Guided questions" not visible in UI/LandingPage marketing
- **Recommendation:** Prioritize diagnostic flow over answer-giving

---

#### 6. **Grow Competence (Learning Progression)**
- **Evidence in Code:**
  - [VisualFlashcard.tsx](components/VisualFlashcard.tsx) - Spaced repetition pattern
  - [CourseDiscovery.tsx](components/CourseDiscovery.tsx) - Resource escalation
  - [types.ts](types.ts#L115) - `DiscoveredCourse` with difficulty levels
  
- **Status:** ✅ **ALIGNED**
- **Recommendation:** Add learning path continuity (e.g., "You've completed this concept, ready for...")

---

### Current Gaps vs. Mission

| Gap | Location | Severity | Fix |
|-----|----------|----------|-----|
| **Judgment detection** | No UX validation that checks "Did Guru sound judgmental?" | Medium | Add feedback loop |
| **Privacy transparency** | No explicit data retention/deletion policy | High | Add to docs & footer |
| **Diagnostic questioning** | `guidedQuestion` field exists but underutilized in UI | Medium | Redesign chat flow |
| **Patience messaging** | UI doesn't say "no dumb questions" | Low | Update LandingPage copy |
| **Competence tracking** | No clear "progress" view vs. "chat" view | Medium | Add learning dashboard |
| **Ego boundaries** | No explicit "Guru doesn't know everything" messaging | Low | Add confidence thresholds |

---

## Part 3: Code Realignment Required

### Priority 1: Privacy Declaration (CRITICAL)

**File:** [README.md](README.md)

Add section:
```markdown
## Privacy & Trust

**Guru stores:**
- Your questions (encrypted)
- Your progress (private account)
- Your learning history (never shared)

**Guru does NOT:**
- Track behavior for ads
- Sell data
- Train on your conversations
- Share without consent
```

---

### Priority 2: Diagnostic Flow UI (HIGH)

**Files:** [App.tsx](App.tsx), [ChatInput.tsx](ChatInput.tsx)

Current: User asks → Guru answers

**New flow:**
1. User asks
2. Guru asks clarifying questions (uses `thinkerNotes.contradictionsFound` + domain logic)
3. User refines
4. Guru provides grounded answer

**Implementation point:**
```typescript
// In App.tsx handleUserMessage():
if (thinkerNotes.contradictionsFound?.length > 0) {
  // Present diagnostic questions instead of direct answer
  const diagnosticQuestions = generateDiagnosticQuestions(
    userMessage, 
    thinkerNotes.contradictionsFound
  );
  setMessages([...messages, { role: 'assistant', content: diagnosticQuestions }]);
  // DON'T jump to answer yet
}
```

---

### Priority 3: "No Dumb Questions" UX (MEDIUM)

**File:** [LandingPage.tsx](components/LandingPage.tsx)

Current hero text:
```
"Always Learning. Always On."
```

**New messaging aligned with research:**
```
"Always Learning. Always Judgment-Free."
```

And add trust signal:
```
"Ask anything. No question is too basic.
Guru is patient, grounded, and only cares about your growth."
```

---

### Priority 4: Competence Tracking (MEDIUM)

**Files:** [types.ts](types.ts), [workspaceService.ts](services/workspaceService.ts)

Add interface:
```typescript
export interface CompetenceNode {
  topicId: string;
  topic: string;
  foundationalUnderstanding: number; // 0-100
  appliedPractice: number; // 0-100
  questionsAsked: number;
  sourcesGrounded: number;
  suggestedNextTopic?: string;
  masteredAt?: number;
}
```

UI component: `LearningDashboard.tsx` showing:
- What you understand
- What's next (scaffolded, not pushed)
- Your diagnostic style (how you ask questions)

---

### Priority 5: Ego Boundaries (LOW)

**File:** [geminiService.ts](services/geminiService.ts)

In system instruction for `think()`:

```typescript
const systemInstruction = `ROLE: GURU_ACADEMIC_THINKER. 
...
GUARDRAIL: If confidence < 0.6, say "I'm not grounded enough on this yet" 
rather than speculating.
CONSTRAINT: Never claim certainty where contradictions exist.`;
```

---

## Part 4: Alignment Checklist

### User-Facing Mission Fulfillment

- [ ] **Private** 
  - Privacy policy in README ✗
  - Data retention stated ✗
  - User controls visible in settings ✗

- [ ] **Judgment-Free**
  - UI says "no dumb questions" ✗
  - Multi-language support shown ✓
  - No validation rejecting inputs ✓
  - Feedback loop detects tone issues ✗

- [ ] **Patient**
  - Full history stored ✓
  - No time pressure UI ✓
  - Async everywhere ✓
  - Diagnostic questions before answers ✗

- [ ] **Helps Think Clearly**
  - Sources shown (50+) ✓
  - Contradictions noted ✓
  - Reasoning visible ✓

- [ ] **Diagnose Problems**
  - Guided questions generated ✗
  - Root-cause questioning ✗
  - User input shapes diagnosis ✗

- [ ] **Grow Competence**
  - Progression visible ✗
  - Next steps scaffolded ✗
  - Difficulty tracking ✓ (in code, not UI)

---

## Part 5: Implementation Priority

### Phase 1 (This Week)
1. Update README with privacy statement
2. Change LandingPage hero copy to "Always Judgment-Free"
3. Add "Guru doesn't pretend to know everything" confidence messaging

### Phase 2 (Next Week)
4. Implement diagnostic questioning flow in `App.tsx`
5. Create `LearningDashboard.tsx` component
6. Wire `CompetenceNode` tracking to `workspaceService`

### Phase 3 (Following Week)
7. Add user feedback loop ("Was Guru judgmental?")
8. Add ego boundary guardrails to `geminiService`
9. Privacy settings UI in admin view

---

## Part 6: Why This Matters

Your research identified the brutal gap:

> **1 in 4 people ever has a mentor. Fewer than 1 in 10 have a good one.**

The barrier isn't intelligence—it's **fear, shame, gatekeeping, and ego**.

Guru's competitive advantage isn't raw AI capability. It's **removing every barrier that human mentors create**.

**Every line of code should answer:**
- *Does this remove fear?*
- *Does this show Guru respects the user?*
- *Does this prevent gatekeeping?*
- *Does this prioritize the user's growth over Guru's correctness?*

If a feature doesn't answer YES to at least one of these, it dilutes the mission.

---

## Code Review Lens

When reviewing PRs, ask:

1. **Privacy:** Does this expose user data or assume consent?
2. **Judgment:** Could a user feel dumb using this feature?
3. **Patience:** Does this rush the user or truncate their history?
4. **Diagnosis:** Does this ask *why* or just give answers?
5. **Competence:** Does this scaffold growth or just deliver content?

---

## Next Steps

1. ✅ Commit this analysis to repo
2. ⏳ Run Priority 1-3 immediately
3. ⏳ Tag issues with `mission-alignment` label
4. ⏳ Quarterly review: "Are we still solving the research problem?"

---

**Author:** Copilot Analysis  
**Date:** January 9, 2026  
**Version:** 1.0
