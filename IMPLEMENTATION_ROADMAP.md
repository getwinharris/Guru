# Guru Implementation Roadmap: Diagnostic Mentor Loop

**Project:** Guru - Universal Diagnostic Mentor System  
**Date:** January 9, 2026  
**Status:** Foundation Phase Complete ✅

---

## Overview

Guru is transitioning from a **generalist AI chat** to a **diagnostic mentor engine** that works across any domain (coding, car repair, thesis writing, project management, etc.).

**Core Innovation:** The mentor loop is universal, but diagnostic trees are domain-specific.

---

## ✅ What's Done (Phase 0 - Foundation)

### Documentation
- ✅ [MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md) - Why Guru matters
- ✅ [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md) - Universal mentor pattern

### Type System
- ✅ [types.ts](types.ts) - 40+ new diagnostic interfaces:
  - `DiagnosticSession` - session management
  - `UserDiagnosticProfile` - bi-directional backward retrieval
  - `ProblemFrame` - problem categorization
  - `DomainDiagnosticModule` - bi-directional forward retrieval
  - `MentorAction` - decision tree outcomes
  - `GuidanceStep` - structured guidance renderer

### Services (Skeletons)
- ✅ [services/diagnosticService.ts](services/diagnosticService.ts) - Mentor loop orchestrator
- ✅ [services/classifierService.ts](services/classifierService.ts) - Problem classification
- ✅ [services/retrievalService.ts](services/retrievalService.ts) - Bi-directional retrieval

---

## 📋 Phase 1: Diagnostic Loop UI (Week 1-2)

### Goal
Make the diagnostic loop **visible and interactive**. Users understand they're in a structured diagnostic process, not just chatting.

### Components to Build

#### 1. `DiagnosticLoopUI.tsx`
Shows current stage and progress

```tsx
// Visual indicator
OBSERVE → BASELINE → QUESTIONS → PAIN → FRAME → GUIDE → COMPLETE
  ✓        ✓           →         -      -       -        -

// What Guru is currently doing
"Understanding your current situation..."

// User prompt/action
"Tell me what's happening"
```

**Status:** Not started  
**Dependency:** None  
**Est. Time:** 4 hours  
**Success Criteria:**
- Visual stage indicator visible
- Progress bar shows completion
- Current action described in plain English

---

#### 2. `ProblemClassifier` integration
Show classification results to user

```tsx
// After observation collected
"I think this is a {DATABASE QUERY} problem, not a {GENERAL API} problem.
Does that match what you're seeing?"

[Yes, that's it] [Not quite] [Explain more]
```

**Status:** Not started  
**Dependency:** classifierService stubs complete  
**Est. Time:** 3 hours  
**Success Criteria:**
- Classification shown to user
- User can confirm or correct
- Classification stored for diagnostics

---

#### 3. `DiagnosticQuestionRenderer.tsx`
Render max 3 targeted questions

```tsx
"Quick clarification (3 questions):
1. When you say 'slow', do you mean:
   ○ Takes 5+ seconds per request
   ○ Hangs indefinitely
   ○ Shows no response at all

2. Did this just start or was it always slow?

[Submit answers]
```

**Status:** Not started  
**Dependency:** diagnosticService.generateQuestions() works  
**Est. Time:** 3 hours  
**Success Criteria:**
- Max 3 questions displayed
- Each question is precise (not "tell me more")
- Answers collected in structured format

---

#### 4. `PainPointExtractor.tsx`
Surface hidden constraints

```tsx
"I notice a few things that might be blocking you:
□ Time pressure (deadline is tomorrow?)
□ Skill gap (you haven't used this framework before?)
□ Tool limitation (can't modify X?)

[Any of these ring true?]
```

**Status:** Not started  
**Dependency:** classifierService.detectMisconceptions()  
**Est. Time:** 2 hours  
**Success Criteria:**
- Pain points inferred from observation
- User can confirm/add more
- Stored for guidance phase

---

#### 5. `ProblemFrameConfirmation.tsx`
Show reframing to user

```tsx
"Here's what I think is actually happening:

YOUR DESCRIPTION: "My code is slow"

ACTUAL PROBLEM: "Your database queries are unoptimized"

This changes what we check:
- Not: General performance profiling
- Yes: Query optimization and indexing

[This matches] [Not quite] [Need more explanation]
```

**Status:** Not started  
**Dependency:** classifierService.classifyProblem()  
**Est. Time:** 2 hours  
**Success Criteria:**
- Original description vs. reframing shown
- Implications of reframing clear
- User can validate frame accuracy

---

#### 6. `GuideStepRenderer.tsx`
Multi-step guidance with verification

```tsx
STEP 1: Check database indexes
Success looks like: You see "idx_user_id" in SHOW INDEXES

[↓ Success] [↓ Still has issue]

If issue remains →
STEP 2: Analyze query execution plan
Success looks like: You see "Full table scan" is the problem

[↓ Success] [↓ Still confused]

If confused →
[Ask me to explain Step 2 in more detail]
```

**Status:** Not started  
**Dependency:** diagnosticService.decideAction()  
**Est. Time:** 4 hours  
**Success Criteria:**
- Step-by-step format clear
- Success criteria visible
- Verification flow works
- Loop-back (restart step) option available

---

### Phase 1 Success Metrics

- [ ] User sees diagnostic loop stage indicator
- [ ] 4+ diagnostic UI components created
- [ ] All components integrated in App.tsx
- [ ] Test with at least 1 example (coding problem)
- [ ] User feedback: "I understand what Guru is doing"

---

## 🔄 Phase 2: Bi-Directional Retrieval (Week 3-4)

### Goal
Connect user history (backward) with domain knowledge (forward) to personalize diagnosis.

### Key Tasks

#### 1. Backward Retrieval Implementation
**File:** [services/retrieval/backwardRetrieval.ts](services/retrieval/backwardRetrieval.ts)

```typescript
// Query patterns from user's past
- Similar problems solved before
- Learning style (visual, conceptual, hands-on)
- Common mistakes
- Skill level in domain

// Use for:
- Adjust question complexity
- Reference past success ("Remember when you...")
- Adapt explanation style
```

**Dependency:** User history stored + indexed  
**Est. Time:** 8 hours  
**Success Criteria:**
- Past problems retrieved correctly
- Skill level inferred from history
- Learning style patterns extracted

---

#### 2. Forward Retrieval Implementation
**File:** [services/retrieval/forwardRetrieval.ts](services/retrieval/forwardRetrieval.ts)

```typescript
// Domain knowledge by problem type
- Diagnostic trees (decision nodes)
- Standard solutions
- Common pitfalls
- Example problems

// Use for:
- Which questions to ask next
- What problem type this is
- Recommended solutions
```

**Dependency:** Domain modules defined (see Phase 2b)  
**Est. Time:** 8 hours  
**Success Criteria:**
- Domain modules load correctly
- Diagnostic tree traversal works
- Examples retrievable by problem type

---

#### 3. Intersection Logic
**File:** [services/retrieval/intersectionLogic.ts](services/retrieval/intersectionLogic.ts)

```typescript
// Combine both directions
User history ∩ Problem space = Personalized mentor

// Example:
- User is intermediate developer
- Problem is database performance
- User has debugged SQL before
→ Use intermediate-friendly diagnostic tree
→ Reference past SQL debugging success
→ Skip beginner explanations
```

**Dependency:** Both backward + forward retrieval working  
**Est. Time:** 4 hours  
**Success Criteria:**
- Customized questions generated
- Explanations match user skill level
- References to past problems work

---

### Phase 2b: Domain Module Definition

**Goal:** Define at least 2 diagnostic trees as proof-of-concept

#### Domain 1: JavaScript/Node.js Debugging
**File:** [data/domains/javascript.ts](data/domains/javascript.ts)

```typescript
export const javascriptDiagnosticModule = {
  domain: 'javascript',
  problemTypes: [
    { name: 'async_error', indicators: ['promise', 'await', 'undefined'], ... },
    { name: 'null_reference', indicators: ['null', 'undefined', 'not a function'], ... },
    { name: 'performance', indicators: ['slow', 'lag', 'timeout'], ... },
  ],
  diagnosticTree: {
    // Actual decision tree with questions
  },
  standards: [ /* ESLint, async/await best practices */ ],
  commonPitfalls: [ /* forgetting await, promise chaining errors */ ],
  exampleProblems: [ /* 5-10 annotated examples */ ],
};
```

**Est. Time:** 6 hours  
**Owner:** JavaScript expert  
**Deliverables:**
- 3+ problem types
- Diagnostic tree (5-7 question nodes)
- 5 example problems with solutions
- Common pitfalls list

---

#### Domain 2: Car Repair Diagnostics
**File:** [data/domains/car_repair.ts](data/domains/car_repair.ts)

```typescript
export const carRepairDiagnosticModule = {
  domain: 'car_repair',
  problemTypes: [
    { name: 'wont_start', indicators: ['click', 'crank', 'silent'], ... },
    { name: 'overheating', indicators: ['temperature', 'warning light'], ... },
    { name: 'brake_issues', indicators: ['soft pedal', 'grinding'], ... },
  ],
  diagnosticTree: {
    // Actual decision tree
  },
  standards: [ /* SAE standards, maintenance schedules */ ],
  commonPitfalls: [ /* replacing battery when it's alternator */ ],
  exampleProblems: [ /* real car problems with solutions */ ],
};
```

**Est. Time:** 6 hours  
**Owner:** Automotive expert  
**Deliverables:**
- 3+ problem types
- Diagnostic tree (5-7 question nodes)
- 5 example problems with solutions
- Common pitfalls list

---

### Phase 2 Success Metrics

- [ ] Backward retrieval returns user history correctly
- [ ] Forward retrieval loads domain knowledge
- [ ] Intersection logic personalizes recommendations
- [ ] 2 domain modules defined and tested
- [ ] Customized questions change based on user skill level

---

## 📝 Phase 3: Evidence Intake & Templates (Week 5-6)

### Goal
Structured problem intake → users provide right evidence immediately

### Components

#### 1. Template System
**File:** [data/templates/index.ts](data/templates/index.ts)

```typescript
export const templates = {
  'coding_error': {
    title: 'Code Error/Crash',
    fields: [
      { name: 'error_message', type: 'text', required: true },
      { name: 'when_started', type: 'select', options: ['today', 'recent', 'always'] },
      { name: 'what_changed', type: 'text' },
      { name: 'code_snippet', type: 'code' },
    ],
  },
  'car_wont_start': {
    title: 'Car Won\'t Start',
    fields: [
      { name: 'symptom', type: 'select', options: ['click', 'crank_no_catch', 'silent'] },
      { name: 'dashboard_lights', type: 'multiselect', options: ['battery', 'check_engine', 'none'] },
      { name: 'photos', type: 'image', count: 3 },
    ],
  },
  'thesis_problem': {
    title: 'Thesis Issue',
    fields: [
      { name: 'current_state', type: 'file', accept: '.docx,.pdf' },
      { name: 'main_issue', type: 'text' },
      { name: 'deadline', type: 'date' },
    ],
  },
};
```

**Est. Time:** 4 hours  
**Success Criteria:**
- 5+ templates defined
- Easy to add new templates
- Works across domains

---

#### 2. Dynamic Template UI
**File:** [components/EvidenceIntake.tsx](components/EvidenceIntake.tsx)

```tsx
// When user says "My code crashes"
↓
// Guru auto-detects domain = coding
↓
// Load template "code_error"
↓
// Show structured form:
[ Error message: ________ ]
[ When did it start? [dropdown] ]
[ Paste code snippet: ]
[ Upload screenshot/log ]

// User fills form → better evidence → better diagnosis
```

**Est. Time:** 6 hours  
**Dependency:** Template system defined  
**Success Criteria:**
- User auto-assigned template based on description
- Form guides user to complete evidence
- Collected data maps to DiagnosticSession.observation

---

#### 3. Evidence Validator
**File:** [services/evidenceValidator.ts](services/evidenceValidator.ts)

```typescript
// Check if evidence is sufficient
function isEvidenceSufficient(observation: ObservationData, domain: string): {
  sufficient: boolean;
  missingFields: string[];
  suggestions: string[];
} {
  // For 'coding_error' domain:
  // - MUST have: error message
  // - SHOULD have: when it started
  // - NICE to have: code snippet

  const missing = [];
  if (!observation.description) missing.push('error_message');
  if (!observation.files && domain === 'coding') missing.push('code_snippet');

  return {
    sufficient: missing.length === 0,
    missingFields: missing,
    suggestions: ['Upload screenshots to help me visualize'],
  };
}
```

**Est. Time:** 3 hours  
**Success Criteria:**
- Validators work per domain
- User gets feedback if evidence incomplete
- Can proceed with partial evidence but with warning

---

### Phase 3 Success Metrics

- [ ] 5+ templates defined
- [ ] Template UI works and auto-selects
- [ ] Evidence validator prevents incomplete sessions
- [ ] 80%+ of users complete evidence form on first try

---

## 🧭 Phase 4: Mentor Decision Tree (Week 7-8)

### Goal
Implement the decision logic: When to ask vs. explain vs. guide

### Decision Tree

```
IF observation is incomplete
  → ASK: "Tell me more about..."
  → Show template

ELSE IF baseline is unclear
  → ASK: "What currently works?"
  → Show baseline template

ELSE IF we haven't narrowed problem yet
  → ASK: 2-3 diagnostic questions
  → Display with high clarity

ELSE IF pain points unclear
  → ASK: "What's blocking you?"
  → Show pain point extractor

ELSE IF problem frame ambiguous
  → EXPLAIN: "I think this is X, not Y"
  → Show evidence for reframing
  → Ask user to confirm

ELSE IF frame confirmed but solution unclear
  → GUIDE: "Follow these steps"
  → Step-by-step with verification

ELSE IF guidance didn't work
  → LOOP_BACK: "What happened at step 2?"
  → Re-diagnose that specific step
  → Don't just repeat advice

ELSE
  → CONFIRM: "Did you resolve this?"
  → Store outcome for learning
```

### Implementation

#### 1. `MentorDecisionEngine.ts`
**File:** [services/mentorDecisionEngine.ts](services/mentorDecisionEngine.ts)

```typescript
async function decideNextAction(session: DiagnosticSession): Promise<MentorAction> {
  // 1. Check what's missing
  // 2. Look at current stage
  // 3. Evaluate user responses
  // 4. Return appropriate action

  if (!session.observation) return askForObservation();
  if (!session.baseline) return askForBaseline();
  if (!session.painPoints) return askForPainPoints();
  // ... etc
}
```

**Est. Time:** 6 hours  
**Success Criteria:**
- Decision tree logic comprehensive
- Every path leads to resolution
- No infinite loops

---

#### 2. `LoopBackHandler.ts`
**File:** [services/loopBackHandler.ts](services/loopBackHandler.ts)

```typescript
// When user says "Step 3 didn't work"
function handleFailure(session: DiagnosticSession, failedStep: number) {
  // Don't just repeat the step
  // Instead, diagnose WHY it failed
  
  // Option 1: User misunderstood the step
  → Re-explain more clearly
  
  // Option 2: Prerequisite wasn't met
  → Go back to step {failedStep - 1}
  
  // Option 3: Problem was misframed
  → Loop back to frame stage
  
  // Option 4: New information emerged
  → Start new diagnostic session
}
```

**Est. Time:** 4 hours  
**Success Criteria:**
- Failures don't dead-end
- System learns from failed steps
- User feels supported, not blamed

---

#### 3. `DecisionRenderer.tsx`
**File:** [components/DecisionRenderer.tsx](components/DecisionRenderer.tsx)

Shows the mentor's decision process

```tsx
// User sees:
"Guru is thinking..."

Then:

"Based on what you've told me:
✓ I understand your current situation
✓ I've narrowed it to a database problem
✗ I'm not sure what specifically is slow

Next: I'm going to ask 2 quick questions to pinpoint the issue"

[Show the questions]
```

**Est. Time:** 3 hours  
**Success Criteria:**
- User sees decision logic
- Feels respected (not confused)
- Understands why questions are asked

---

### Phase 4 Success Metrics

- [ ] Decision tree covers all scenarios
- [ ] Loop-back handling prevents dead-ends
- [ ] User doesn't repeat same guidance twice
- [ ] 90%+ of sessions resolve in <10 exchanges

---

## 🎯 Success Criteria (All Phases)

### User Experience
- [ ] User knows what stage they're in (diagnostic loop visible)
- [ ] User feels respected ("No dumb questions")
- [ ] User gets specific guidance, not generic answers
- [ ] User learns *how* to diagnose, not just the solution

### Technical
- [ ] Diagnostic session completes with resolution
- [ ] Bi-directional retrieval working
- [ ] Domain modules expandable
- [ ] Decision tree handles edge cases

### Metrics
- [ ] Session completion rate > 80%
- [ ] User satisfaction > 4.5/5
- [ ] Average session length 5-15 exchanges (not 50+)
- [ ] Reusability across domains

---

## 📊 Project Timeline

```
Week 1-2:  Phase 1 (Diagnostic Loop UI)
Week 3-4:  Phase 2 (Bi-Directional Retrieval)
Week 5-6:  Phase 3 (Evidence Intake)
Week 7-8:  Phase 4 (Decision Tree)

Week 9+:   Launch + Iterate
```

---

## 🔗 Dependencies & Blockers

### Hard Blockers (Must resolve first)
- [ ] User authentication / profile storage
- [ ] File upload infrastructure (for evidence)
- [ ] Database schema for diagnostic sessions

### Soft Blockers (Can work around)
- [ ] ML-based problem classifier (can use heuristics for now)
- [ ] Multi-language support (start with English)
- [ ] Real-time collaboration (not needed for MVP)

---

## 👥 Team Structure

| Role | Responsible For | Time Commitment |
|------|-----------------|-----------------|
| UI Engineer | Phase 1 components | Full-time, 2 weeks |
| Backend Engineer | Services + data layer | Full-time, 4 weeks |
| Domain Expert (JS) | JavaScript diagnostic module | 8 hours |
| Domain Expert (Car) | Car repair diagnostic module | 8 hours |
| QA | Test diagnostic flow | 4 hours/week |

---

## ✅ Commit Strategy

Each phase is a single commit:

```
Phase 1 commit: "Implement diagnostic loop UI and state management"
Phase 2 commit: "Add bi-directional retrieval + 2 domain modules"
Phase 3 commit: "Add evidence intake templates and validation"
Phase 4 commit: "Implement mentor decision engine and loop-back"
```

---

## 🚀 Next Immediate Step

1. ✅ Foundation specs done (MENTOR_LOOP_SPEC.md, types.ts, services)
2. ⏳ **START:** Phase 1 - Build DiagnosticLoopUI component
3. ⏳ Then: Integrate all Phase 1 components into App.tsx

**Owner:** UI Engineer  
**Deadline:** 1 week

---

**Document Version:** 1.0  
**Last Updated:** January 9, 2026  
**Status:** Ready for Sprint Planning
