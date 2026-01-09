# Guru: The Diagnostic Mentor System

**Guru is not a chatbot. It's a diagnostic mentor that helps you think clearly, diagnose problems, and grow competence — across any domain.**

---

## 📖 Documentation (Start Here)

**New to Guru?** Read these in order:

1. **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** (5 min)
   - What is Guru?
   - Why it matters
   - Quick architecture overview

2. **[MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md)** (15 min)
   - Research: Why mentorship matters
   - Current codebase assessment
   - What needs to change

3. **[MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md)** (30 min)
   - Universal 6-stage mentor loop
   - Technical specification
   - Implementation examples

4. **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)** (20 min)
   - 8-week execution plan
   - Phase-by-phase breakdown
   - Team structure

5. **[DELIVERABLES.md](DELIVERABLES.md)** (10 min)
   - What's been completed
   - What's next
   - Quick reference guide
6. **[REBRANDING_COMPLETE.md](REBRANDING_COMPLETE.md)** (10 min) — **NEW**
   - OpenWebUI rebranded as Guru's native backend
   - Architecture changes
   - How to use

7. **[guru-backend/ARCHITECTURE.md](guru-backend/ARCHITECTURE.md)** (20 min) — **API REFERENCE**
   - Complete system architecture
   - All API endpoints
   - Configuration guide

---

## 🧠 The Mentor Loop

Every problem follows the same pattern:

```
1. OBSERVE     → Gather evidence
2. BASELINE    → Understand current state
3. QUESTIONS   → Ask targeted clarifying questions
4. PAIN POINTS → Identify hidden blockers
5. FRAME       → Categorize problem correctly
6. GUIDE       → Step-by-step guidance
```

This works for:
- 💻 Coding problems
- 🚗 Car repair
- 📝 Thesis writing
- 📊 Project management
- 🎓 Learning anything

---

## 🚀 Quick Start (Development)

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

4. View your app in AI Studio: https://ai.studio/apps/drive/10LAwHFzcA47xl72ZPNCrh5MOkTQTVfdz

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| [types.ts](types.ts) | Complete type system (40+ diagnostic types) |
| [services/diagnosticService.ts](services/diagnosticService.ts) | Mentor loop orchestrator |
| [services/classifierService.ts](services/classifierService.ts) | Problem type classifier |
| [services/retrievalService.ts](services/retrievalService.ts) | Bi-directional retrieval |
| [App.tsx](App.tsx) | Main application (integrate services here) |

---

## 🎯 Current Status

### ✅ Foundation Phase (Complete)
- [x] Research on mentorship gap
- [x] Universal mentor loop pattern
- [x] Type system (40+ types)
- [x] Service skeletons
- [x] Complete documentation (2,200+ lines)
- [x] 8-week implementation plan

### ⏳ Phase 1 (Next - 2 weeks)
- [ ] Diagnostic loop UI (visual stage indicator)
- [ ] Problem classification display
- [ ] Diagnostic question renderer
- [ ] Pain point extractor
- [ ] Problem frame confirmation
- [ ] Guidance step renderer

### 🔮 Phases 2-4 (Following 6 weeks)
- [ ] Bi-directional retrieval
- [ ] Domain modules
- [ ] Evidence intake templates
- [ ] Mentor decision engine

---

## 💡 Why Guru Matters

**Problem:** Only 1 in 4 people have a mentor. Fewer than 1 in 10 have a good one.

**Why:** Human mentors fail due to:
- Ego (gatekeeping knowledge)
- Power imbalance (fear of looking dumb)
- Time pressure (rushed sessions)
- Access (geography, connections)

**Solution:** Guru removes every barrier:
- ✅ Available 24/7 (no scheduling)
- ✅ Never judges (by design)
- ✅ Never gatekeeps (scales infinitely)
- ✅ Never tires (consistent patience)
- ✅ Remembers context (user history)
- ✅ Understands domain (diagnostic trees)

---

## 🏗️ Architecture

### Three Core Services

**DiagnosticService** — Orchestrates the 6-stage mentor loop
- Session management
- Stage progression
- Action decisions

**ClassifierService** — Maps evidence → problem type
- Signal extraction
- Type classification
- Confidence scoring

**RetrievalService** — Bi-directional context
- **Backward:** User history, patterns, constraints
- **Forward:** Domain knowledge, diagnostic trees, examples
- **Intersection:** Personalized mentor

---

## 🤝 How to Contribute

### For UI Engineers
- Start with [IMPLEMENTATION_ROADMAP.md - Phase 1](IMPLEMENTATION_ROADMAP.md#phase-1-diagnostic-loop-ui-week-1-2)
- Build diagnostic loop UI components
- Connect to [services/diagnosticService.ts](services/diagnosticService.ts)

### For Backend Engineers
- Review [types.ts](types.ts) data model
- Implement [services/classifierService.ts](services/classifierService.ts)
- Design database schema for sessions
- Build [services/retrievalService.ts](services/retrievalService.ts) queries

### For Domain Experts
- Reference [MENTOR_LOOP_SPEC.md - Part 8](MENTOR_LOOP_SPEC.md#part-8-implementation-roadmap)
- Define diagnostic tree for your domain
- Document 5-10 example problems
- Add to [data/domains/](data/domains/)

---

## 📚 Documentation Structure

```
Root Documentation:
├── README.md (this file)
├── SYSTEM_OVERVIEW.md (start here)
├── MISSION_ALIGNMENT.md (research + gaps)
├── MENTOR_LOOP_SPEC.md (technical spec)
├── IMPLEMENTATION_ROADMAP.md (execution plan)
├── DELIVERABLES.md (what's done)

Code:
├── types.ts (40+ diagnostic types)
├── services/
│   ├── diagnosticService.ts
│   ├── classifierService.ts
│   └── retrievalService.ts
├── components/ (Phase 1+)
└── data/
    └── domains/ (Phase 2+)
```

---

## 🎓 Learning Path

**For Stakeholders:**
1. [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)
2. Success metrics section

**For Architects:**
1. [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)
2. [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md)
3. [types.ts](types.ts)

**For UI Engineers:**
1. [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)
2. [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md#phase-1-diagnostic-loop-ui-week-1-2)
3. [types.ts](types.ts) DiagnosticSession section

**For Backend Engineers:**
1. [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)
2. [types.ts](types.ts)
3. All service files

---

## ✨ Key Insights

- **The mentor loop is universal** — works for car repair, coding, thesis writing, anything
- **Only the diagnostic tree differs** — same loop, domain-specific questions
- **Guru operates at the intersection** of user history + problem space
- **Diagnosis > Answers** — teaching how to think beats giving solutions

---

## 📞 Questions?

- **Why Guru?** → [MISSION_ALIGNMENT.md](MISSION_ALIGNMENT.md)
- **How does it work?** → [MENTOR_LOOP_SPEC.md](MENTOR_LOOP_SPEC.md)
- **What do I build?** → [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)
- **What's the architecture?** → [types.ts](types.ts)

---

## 📝 Version

- **Foundation Phase:** ✅ Complete
- **Implementation Plan:** ✅ Complete
- **Status:** Ready for Phase 1 Development

**Last Updated:** January 9, 2026
