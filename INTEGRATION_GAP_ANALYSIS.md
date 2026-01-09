# Integration Gap Analysis & Action Plan

**Status:** Post-Backend-Deployment (Backend: ✅ Running on :8000)

---

## 🔴 CRITICAL GAPS (Blocking UI)

### Gap 1: Frontend Not Connected to Backend
- **Issue:** `diagnosticService.ts` uses in-memory sessions; `guruBackendConnector.ts` exists but is NOT wired into the UI
- **Impact:** App components don't call backend endpoints
- **Fix:** Wire `App.tsx` and components to call `guruBackendConnector.*` methods instead of `diagnosticService.*` methods
- **Files to update:** `App.tsx`, `ChatInput.tsx`, `components/AgentStatusCards.tsx`

### Gap 2: Frontend Dev Server Not Running
- **Issue:** `npm run dev` hasn't been executed; Vite is not serving on port 3000
- **Impact:** You can't see the UI at all (nothing on :3000)
- **Fix:** `npm run dev` from `/workspaces/Guru`
- **Where:** Terminal in codespace

### Gap 3: No UI Preview Method in Codespace
- **Issue:** You said "can't see the UI in VSCode codespace"
- **Impact:** Standard `localhost:3000` doesn't reach your browser
- **Fix:** Install VS Code's **Simple Browser** extension to preview inside the editor
- **How:** Right-click URL in editor → "Open with Simple Browser"

---

## 🟡 SECONDARY GAPS (Nice-to-Have but Needed for Full Demo)

### Gap 4: Session Persistence
- **Files:** `guru-backend/core/mentor_loop.py` uses in-memory `self.sessions = {}`
- **Fix:** Swap for SQLite: `CREATE TABLE diagnostic_sessions (id, user_id, domain, stage, JSON state)`
- **Timeline:** After UI connects

### Gap 5: Consent UI Not Visible
- **Files:** `App.tsx` has no consent toggle for uploads
- **Fix:** Add checkbox before `openWebUIAdapter.upsertChunks()` calls
- **Timeline:** After UI connects

### Gap 6: Flashcard & Visual Integration Not Wired
- **Files:** `VisualFlashcard.tsx` exists but `App.tsx` doesn't pass `highlights` data
- **Issue:** `highlights` should come from `diagnosticService.getVisualHighlights()` or backend
- **Fix:** Call backend to generate highlights; pass to `VisualFlashcard`

### Gap 7: Changelog Live Watcher
- **Files:** `ChangelogView.tsx` calls `watcherService.getLogs()`
- **Issue:** `watcherService.ts` watches nothing yet (needs wired to actual code changes)
- **Fix:** After diagnosticService is stable, wire `watcherService` to track session changes

---

## 📋 CONFIGURATION CHECKLIST

### What's Already Configured ✅
- [x] Backend running (guv🐍uvicorn + FastAPI)
- [x] Python services: diagnosticService, retrieval, models
- [x] TypeScript connector exists (`guruBackendConnector.ts`)
- [x] Components exist (VisualFlashcard, ChangelogView, AgentStatusCards)
- [x] Package.json configured for Vite + React
- [x] Vite dev server ready (`npm run dev`)

### What Still Needs Configuration ⚠️
- [ ] Frontend **connected** to backend (guruBackendConnector calls in App.tsx)
- [ ] Frontend dev server **running** (`npm run dev`)
- [ ] Simple Browser extension **installed** (for preview in codespace)
- [ ] Session **persistence** (SQLite in guru-backend)
- [ ] Consent **UI toggles** (checkboxes before uploads)
- [ ] Visual highlights **generated** by backend
- [ ] Watcher **observing** live service code

---

## 🚀 NEXT IMMEDIATE ACTIONS (In Order)

### Step 1: Wire Frontend to Backend (15 min)
```typescript
// App.tsx change:
- import { diagnosticService } from './services/diagnosticService';
+ import { guruBackendConnector } from './services/guruBackendConnector';

// When user clicks "Create Session":
- const session = diagnosticService.createSession(userId, threadId, domain);
+ const session = await guruBackendConnector.createSession({ userId, domain, problemDescription });
```

### Step 2: Start Frontend Dev Server (5 min)
```bash
cd /workspaces/Guru
npm run dev
# Vite will start on http://localhost:3000
```

### Step 3: Install Simple Browser Extension (2 min)
- Command palette: `Extensions: Install Extensions`
- Search: `Simple Browser`
- Install

### Step 4: Preview UI (1 min)
- Terminal: open browser to `http://localhost:3000`
- OR in VS Code: Ctrl+Shift+P → "Simple Browser: Show"

### Step 5: Test Diagnostic Flow (10 min)
- Click "Start Session"
- Enter: domain="car_repair", problem="won't start"
- Observe, baseline, questions flow through to backend
- Verify backend calls hit (check terminal logs)

### Step 6: Persistence + Consent (30 min after UI works)
- Add SQLite to guru-backend
- Add consent toggle to ChatInput.tsx
- Wire session storage

---

## Why I "Stopped"

I paused because:
1. **Backend was built successfully** (tests passing ✅)
2. **Frontend infrastructure exists** but was not deployed
3. **Wiring gap** between frontend and backend was a decision point (needed to understand your docs first)
4. **Browser preview** wasn't clear in codespace context (needed to ask you)

Now you know:
- What's built ✅
- What's not connected ⚠️
- How to see it (Simple Browser)
- What to wire (guruBackendConnector calls)

---

## 🎓 Architecture Summary

```
User Interacts (App.tsx)
        ↓
ChatInput.tsx / ChangelogView.tsx / etc.
        ↓
guruBackendConnector.ts (TYPE-SAFE wrapper) 🔗 ← YOU ARE HERE
        ↓
openWebUIAdapter.ts (HTTP to 127.0.0.1:8000)
        ↓
guru-backend (Python FastAPI)
        ├── /api/guru/diagnostic/* (6-stage mentor loop)
        ├── /api/guru/retrieval/* (RAG pipeline)
        ├── /api/guru/models/* (local model routing)
        └── /health (system status)
        ↓
MentorLoopOrchestrator + DiagnosticService
        ↓
User Gets Diagnosis + Guidance + Learning
```

---

## Files Manifest: What Exists vs. What's Missing

### Existing & Functional ✅
- `guru-backend/open_webui/main.py` - FastAPI bootstrap
- `guru-backend/open_webui/routes/guru.py` - 13 endpoints
- `guru-backend/core/mentor_loop.py` - 6-stage orchestrator
- `services/guruBackendConnector.ts` - Type-safe bridge
- `components/VisualFlashcard.tsx` - Flashcard UI
- `components/ChangelogView.tsx` - Live changelog
- `App.tsx` - Root React component
- `package.json` - Frontend deps
- `vite.config.ts` - Vite config

### Existing but Not Connected ⚠️
- `services/diagnosticService.ts` (in-memory, should call backend)
- `components/ChatInput.tsx` (accepts input, but doesn't wire to backend calls)
- `components/AgentStatusCards.tsx` (displays UI, but no data source)

### Missing / To-Do 🔴
- SQLite session persistence (guru-backend)
- Consent toggle UI (frontend)
- Visual highlights generation (backend)
- Watcher service wired to actual changes
- Frontend connected to backend (guruBackendConnector calls)
- Vite dev server running

