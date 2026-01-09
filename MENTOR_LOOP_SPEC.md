# Guru System Architecture: The Mentor Loop Primitive

**Date:** January 9, 2026  
**Status:** Foundation Specification  
**Scope:** Universal diagnostic mentorship system (domain-agnostic)

---

## Executive Summary

Guru is not a chatbot or code generator.

Guru is a **diagnostic mentor engine** that progressively understands:
- **The user** (history, learning style, constraints)
- **The problem** (domain, patterns, standards, risks)
- **The intersection** (what questions unlock understanding)

**One sentence:**
> Guru does not jump to solutions; it diagnoses by understanding the user's history and the problem's domain, asking precise questions and guiding the user step-by-step toward understanding and resolution.

---

## Part 1: The Mentor Loop (Universal Primitive)

### The Six-Stage Pattern

Regardless of domain, the mentor's job is:

```
OBSERVE
   ↓
ESTABLISH BASELINE
   ↓
ASK TARGETED QUESTIONS
   ↓
IDENTIFY PAIN POINTS
   ↓
FRAME THE PROBLEM
   ↓
GUIDE ACTION
```

### Stage 1: Observe

**Input:** Evidence of the problem

```
What Guru captures:
- Images/screenshots
- Documents/files
- Code/artifacts
- User description
- Metadata (context, timeline)
```

**Why this matters:**
- A description alone is incomplete
- Visual evidence reveals assumptions
- Code shows intent, comments show confusion

**Implementation:**
- [ChatInput.tsx](../components/ChatInput.tsx) already accepts files ✓
- Need: Structured evidence templates (e.g., "Car won't start → provide: sound, lights, last action")

---

### Stage 2: Establish Baseline

**Question:** What already exists?

```
Baseline includes:
- What works
- What doesn't work
- Previous attempts
- Constraints (time, budget, skill, tools)
- Standards (for this domain)
```

**Why this matters:**
- Users often skip context, jumps to solutions
- The fix depends on what already exists
- Constraints shape all next steps

**Implementation needed:**
- Structured intake form (2-3 targeted questions, not 10 generic ones)
- Store baseline in message metadata
- Retrieve baseline in all future diagnostic steps

---

### Stage 3: Ask Targeted Clarifying Questions

**Principle:** Minimal, precise, diagnostic.

```
NOT: "Tell me more about the problem"
YES: "When you say X doesn't work, do you mean:
     a) It crashes completely?
     b) It runs but gives wrong output?
     c) It hangs (no response)?"
```

**Why this matters:**
- Generic questions waste time
- Precise questions compress problem space
- User feels respected

**Implementation needed:**
- Decision tree by domain/problem type
- Max 3 questions per turn (not 10)
- Each question must narrow possibilities by 50%+

---

### Stage 4: Identify Pain Points

**Question:** What are the real blockers?

```
Pain points != problems

Example:
- STATED: "My thesis is bad"
- REAL PAIN:
  ├─ Argument is unclear
  ├─ I don't have time to rewrite
  ├─ My advisor is vague
  └─ I'm unsure if methodology is sound
```

**Why this matters:**
- Solving the stated problem often misses the real one
- Constraints are often the blocker, not capability
- Users need permission to acknowledge pain

**Implementation needed:**
- Diagnosis framework that surfaces hidden constraints
- Safe language ("It sounds like X is blocking you—is that right?")
- Store pain points in user history for future reference

---

### Stage 5: Frame the Problem

**Question:** What kind of problem is this, really?

```
Example: "My code runs slow"
↓
REFRAME: "This is not a code problem—
it's a database query optimization problem"
↓
NOW mentor knows: check indexes, explain plans, etc.
```

**Why this matters:**
- Misframing leads to wrong solutions
- Framing determines which domain knowledge applies
- User learns to think categorically

**Implementation needed:**
- Problem taxonomy per domain
- Classification rules (if X and Y, then this problem category)
- Show the frame to user ("I think this is an X problem—does that match?")

---

### Stage 6: Guide Action

**Principle:** Step-by-step, human-executed, learning-oriented.

```
NOT: "Here's the full solution"
YES: 
  Step 1: [specific action]
  Success looks like: [observable outcome]
  If it fails: [diagnostic step]
```

**Why this matters:**
- User learns the process, not just the answer
- Guided action is verifiable
- Failure points reveal deeper misunderstandings

**Implementation needed:**
- Action guidelines (not code generation)
- Success metrics (how to know if step worked)
- Loop-back option (if this fails, we revisit step X)

---

## Part 2: Bi-Directional Retrieval System

### The Two Retrieval Directions

The mentor retrieves simultaneously from **two sources**:

```
DIRECTION 1: BACKWARD (User History)
├─ Past conversations
├─ Past decisions
├─ Past mistakes
├─ Learning level
├─ Preferences
├─ Recurring issues
└─ Constraints discovered

DIRECTION 2: FORWARD (Problem Space)
├─ Domain knowledge
├─ Known patterns
├─ Standards/best practices
├─ Diagnostic trees
├─ Example problems
└─ Common pitfalls
```

### Why Both Are Required

**Direction 1 alone** (backward):
- "I know your history"
- But doesn't know how to diagnose *this specific problem*

**Direction 2 alone** (forward):
- "I know the domain"
- But doesn't know *you*, your constraints, your style

**Both together** (intersection):
- "I understand your history AND this problem type"
- → Mentor can ask *your* specific diagnostic questions
- → Mentor can frame *your* specific constraints

---

## Part 3: Retrieval Architecture Specification

### Direction 1: Backward Retrieval (User History)

**What to retrieve:**

```typescript
interface UserDiagnosticProfile {
  // Learning & cognition
  learningStyle: 'visual' | 'conceptual' | 'hands-on' | 'hybrid';
  learnsBest: string[];  // e.g., ["examples", "diagrams", "step-by-step"]
  frustratedBy: string[];  // e.g., ["jargon", "theory-first", "long answers"]
  
  // History
  pastProblems: ProblemSnapshot[];
  mistakesRepeated: string[];
  successPatterns: string[];
  
  // Constraints discovered
  timeAvailable: 'days' | 'hours' | 'minutes';
  toolsAvailable: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  riskTolerance: 'low' | 'medium' | 'high';
  
  // Preferences
  preferencesStated: string[];
  defaultsPreferred: boolean;
  explanationDepth: 'brief' | 'moderate' | 'deep';
  
  // Conversation context
  currentThread: Message[];
  relatedThreads: string[];  // IDs of past related conversations
}

interface ProblemSnapshot {
  id: string;
  domain: string;
  problemType: string;
  frameUsed: string;
  solutionPath: string[];
  outcome: 'resolved' | 'partially_resolved' | 'abandoned';
  lessonsLearned: string[];
  timestamp: number;
}
```

**Retrieval strategy:**

```typescript
// In diagnostic phase
const userProfile = await retrieval.getBackward({
  userId: current.userId,
  depth: 'diagnostic',  // not full history, just relevant patterns
  relatedDomains: [inferred_problem_domain],
  maxRecency: 90,  // last 90 days
});

// Use for:
// 1. What questions to ask (user-aware)
// 2. What framing to use (respects learning style)
// 3. What to avoid (respects frustrations)
// 4. What tool assumptions to make
```

---

### Direction 2: Forward Retrieval (Problem Space)

**What to retrieve:**

```typescript
interface DomainDiagnosticModule {
  domain: string;  // 'car-repair', 'coding', 'thesis', 'project-management'
  
  // Problem taxonomy
  problemTypes: ProblemType[];
  
  // Diagnostic rules
  diagnosticTree: DiagnosticNode;
  
  // Standards & best practices
  standards: Standard[];
  commonPitfalls: Pitfall[];
  
  // Examples
  exampleProblems: ExampleProblem[];
}

interface DiagnosticNode {
  id: string;
  question: string;  // "Does it make a sound?"
  branches: {
    yes: string | DiagnosticNode;  // next node ID or nested
    no: string | DiagnosticNode;
    maybe?: string | DiagnosticNode;
  };
  framingIfReached: string;  // if diagnosis reaches here, problem is X type
}

interface ProblemType {
  name: string;
  indicators: string[];  // symptoms
  rootCauses: string[];
  typicalConstraints: string[];
  solutionPatterns: string[];
}

interface ExampleProblem {
  description: string;
  baselineWas: string;
  painPointWas: string;
  wasFramedAs: string;
  resolution: string;
  lessonsLearned: string[];
}
```

**Retrieval strategy:**

```typescript
// In diagnostic phase
const problemModule = await retrieval.getForward({
  problemIndicators: [from user observation],
  domain: inferred_domain,
  userSkillLevel: userProfile.skillLevel,
});

// Use for:
// 1. Which diagnostic questions apply
// 2. What framing options exist
// 3. What constraints are typical
// 4. What examples help explain
```

---

## Part 4: Diagnostic Question Policy

### When to Ask

```
1. After OBSERVE (never skip observation)
2. Only if baseline is unclear
3. Only if problem framing is ambiguous
4. Maximum 3 per turn
```

### How to Ask

```
Principle: Each question must be:

✓ SPECIFIC: "Does X do Y or Z?"
✗ VAGUE: "Tell me more"

✓ PROGRESSIVE: Narrows possibility space by 50%+
✗ SHOTGUN: Random questions

✓ RESPECTFUL: Assumes user can answer precisely
✗ CONDESCENDING: "You did check X, right?"

✓ DIAGNOSTIC: Answer determines next path
✗ FILLER: Asked just to seem engaged
```

### Question Examples by Domain

#### Car Repair
```
✓ "Does the engine turn over but not catch? 
    Or does the starter not respond at all?"
✓ "When was the last time the battery was replaced?"
✓ "Any warning lights on the dashboard?"
```

#### Coding
```
✓ "Does it throw an error, or runs but wrong output?"
✓ "When did this start—after a recent change?"
✓ "Have you checked the logs?"
```

#### Thesis/Writing
```
✓ "Is the argument unclear or the evidence weak?"
✓ "What's your advisor's main feedback?"
✓ "How much time do you have before deadline?"
```

---

## Part 5: Evidence Intake Rules

### Structured Templates

Instead of "Tell me about your problem", use domain-specific forms:

#### Car Won't Start Template
```
I need a few things to diagnose this:
1. What happens when you turn the key?
   [ ] Engine cranks but won't catch
   [ ] Just a click, no crank
   [ ] Nothing, totally silent
   [ ] Other: ___

2. Any dashboard lights?
   [ ] Battery light (red)
   [ ] Check engine
   [ ] None
   [ ] Multiple

3. When did this start?
   [ ] Suddenly today
   [ ] Gradually over days
   [ ] After I did X

4. Photo of:
   [ ] Engine bay
   [ ] Dashboard
   [ ] Battery connections
```

#### Code Won't Work Template
```
1. What's the symptom?
   [ ] Error message (what?)
   [ ] Wrong output (what expected?)
   [ ] Hangs/no response
   [ ] Other

2. When did it break?
   [ ] Never worked
   [ ] Worked, now broken
   [ ] After change to X

3. What have you tried?
   [ ] Restarted/rerun
   [ ] Searched error online
   [ ] Checked logs
   [ ] Other: ___

4. Paste:
   [ ] Error message
   [ ] Relevant code snippet
   [ ] Environment details
```

---

## Part 6: Mentor Decision Tree

### When to Explain vs Ask vs Guide

```
IF user baseline is unclear
  → ASK clarifying questions

ELSE IF problem framing is ambiguous
  → ASK diagnostic questions (max 3)

ELSE IF framing is clear but user didn't realize
  → EXPLAIN the reframing
    (e.g., "This isn't a CSS problem, it's a layout algorithm problem")

ELSE IF user has all info but needs direction
  → GUIDE step-by-step
    (e.g., "Step 1: Check X. Success = Y. If fails, report Z")

ELSE IF user needs depth on ONE topic
  → EXPLAIN deeply but briefly
    (e.g., "Here's why databases use indexes...")

ELSE IF user is stuck after guidance
  → LOOP BACK to diagnostic phase
    (e.g., "That didn't work? Let's revisit step X")

ELSE
  → DO NOT generate full solution
  → DO ask: "What was the outcome of step 1?"
```

---

## Part 7: Current Codebase Assessment

### What Exists ✓

| Component | Status | Alignment |
|-----------|--------|-----------|
| File/image intake (ChatInput.tsx) | ✓ | Observe ✓ |
| History storage (App.tsx messages) | ✓ | Backward retrieval partial |
| Grounding system (geminiService.ts) | ✓ | Forward retrieval partial |
| Multi-role architecture (types.ts roles) | ✓ | Foundation for decision tree |
| GroundingPanel (sources shown) | ✓ | Transparency ✓ |

### What's Missing ✗

| Layer | Component | Gap | Priority |
|-------|-----------|-----|----------|
| **Diagnosis** | Diagnostic question engine | Doesn't exist | CRITICAL |
| **Diagnosis** | Problem type classifier | Not visible | CRITICAL |
| **Diagnosis** | Pain point extractor | Not visible | HIGH |
| **Retrieval** | Bi-directional retrieval contract | Not structured | HIGH |
| **Memory** | UserDiagnosticProfile | Partial in firebase | HIGH |
| **Memory** | ProblemSnapshot archive | Not visible | MEDIUM |
| **Domain** | Diagnostic trees per domain | Not visible | MEDIUM |
| **Domain** | Evidence intake templates | Not visible | MEDIUM |
| **Guidance** | Step-by-step guidance renderer | Not visible | MEDIUM |
| **Loopback** | Failure handling (if guidance fails) | Not visible | LOW |

---

## Part 8: Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Goal:** Make diagnostic loop visible

```
1. Create DiagnosticLoopUI component
   - Shows current stage (Observe → Baseline → Questions → Pain → Frame → Guide)
   - User sees where they are

2. Implement ProblemClassifier
   - Takes observation + baseline
   - Returns problem type category
   - Shows classification to user

3. Create DiagnosticQuestionEngine
   - Takes problem type
   - Takes user profile (learning style, skill level)
   - Generates 2-3 precise questions
   - Only asks if needed

4. Store UserDiagnosticProfile
   - Save learning patterns
   - Save constraint history
   - Retrieve in each new session
```

**Files to create:**
- `components/DiagnosticLoopUI.tsx`
- `services/diagnosticService.ts`
- `services/classifierService.ts`
- Update `types.ts` with new interfaces

---

### Phase 2: Bi-Directional Retrieval (Week 3-4)

**Goal:** Smart context awareness

```
1. Implement BackwardRetrieval
   - Query user history by domain
   - Extract patterns (learning style, pain points, mistakes)
   - Weight recent > old

2. Implement ForwardRetrieval
   - Domain knowledge graph per problem type
   - Diagnostic trees (decision nodes)
   - Example problems + solutions

3. Connect both directions
   - "User is intermediate + problem is X type"
   - → Use intermediate-friendly diagnostic tree
   - → Avoid beginner-level explanations
   - → Reference past similar problems

4. Create retrieval contract
   - What data flows backward
   - What data flows forward
   - How they combine
```

**Files to create:**
- `services/retrieval/backwardRetrieval.ts`
- `services/retrieval/forwardRetrieval.ts`
- `data/domains/` (diagnostic modules per domain)

---

### Phase 3: Evidence & Templates (Week 5-6)

**Goal:** Structured observation

```
1. Create DomainSpecificTemplates
   - Car repair template
   - Coding template
   - Thesis/writing template
   - Project management template

2. Evidence intake UI
   - Shows relevant template based on user description
   - Guides user to provide key evidence
   - Validates completeness

3. Baseline capture
   - "What already works?"
   - "What are your constraints?"
   - Store in standardized format
```

**Files to create:**
- `components/EvidenceIntake.tsx`
- `data/templates/` (per domain)
- `services/evidenceService.ts`

---

### Phase 4: Mentor Decision Tree (Week 7-8)

**Goal:** Smart response strategy

```
1. Implement MentorDecisionEngine
   - Takes: user state, problem state, conversation state
   - Returns: action (ask, explain, guide, loop-back)
   - With reasoning shown

2. Guide renderer
   - Formats multi-step guidance
   - Shows success criteria
   - Offers verification at each step

3. Loop-back handler
   - If user says "didn't work"
   - Diagnose *why* it didn't work
   - Loop to appropriate stage
   - Don't just give different answer
```

**Files to create:**
- `services/mentorDecisionEngine.ts`
- `components/GuideRenderer.tsx`
- `services/loopbackHandler.ts`

---

## Part 9: Testing the Loop

### Test Scenario 1: Car Repair

```
User: "My car won't start"

OBSERVE:
  Guru: [Shows template] Please upload photo of engine bay
  User: [uploads photo + "battery light is on"]

BASELINE:
  Guru: "Did it work before?" 
  User: "Yes, yesterday"

DIAGNOSE:
  Guru: "Battery light on + worked yesterday = likely battery or alternator"
  Guru: "Quick check: can you hear the engine trying to turn over?"

PAIN POINT:
  User: "It's 6am, I need to be somewhere"
  Guru: "Time constraint noted. Let's try the quick diagnostic first"

FRAME:
  Guru: "This looks like an electrical system failure, not mechanical"

GUIDE:
  Step 1: Check battery terminals (loose or corroded?)
  Success = you see them clearly
  If fails → battery itself needs testing
```

### Test Scenario 2: Coding Problem

```
User: "My API returns null"

OBSERVE:
  Guru: "Error message or no output?" 
  User: [pastes error]

BASELINE:
  Guru: "When did this break?"
  User: "After I added async/await"

DIAGNOSE:
  Guru: "Likely a promise/await issue"
  Guru: "3 quick things: Did you add await before the call?
         Does the function return the value?
         Did you check the network tab?"

PAIN POINT:
  Guru: "Which of those is unclear to you?"
  User: "I'm not sure if I need await"

FRAME:
  Guru: "This is a JavaScript promise-handling problem, not an API problem"

GUIDE:
  Step 1: Add await before the API call
  Success = compilation succeeds
  Step 2: Check browser console
  Success = no errors
  If still null → check network tab
```

---

## Part 10: Why This Matters

The mentor loop is **not** specific to code.

It applies to:
- Car repair
- Thesis writing
- Project management
- Relationship advice
- Career decisions
- Learning new skills
- Debugging machines
- Diagnosing health issues

**Guru's competitive advantage** is that it can handle *any* domain because the **mentoring process is universal**.

Every domain needs:
- Observation
- Baseline
- Diagnostic questioning
- Pain identification
- Problem framing
- Guided action

Guru implements the loop. Domains plug in their diagnostic trees.

---

## Part 11: Next Steps

1. ✅ Commit this spec to repo
2. ⏳ Review Phase 1 with team
3. ⏳ Create `services/diagnosticService.ts` (skeleton)
4. ⏳ Update `types.ts` with new interfaces
5. ⏳ Begin UI for diagnostic loop visibility

**Owner:** Engineering team  
**Timeline:** 8 weeks (2-week phases)  
**Success:** Diagnostic loop visible + functional in first problem (coding)

---

**Document Version:** 1.0  
**Last Updated:** January 9, 2026  
**Status:** Ready for implementation
