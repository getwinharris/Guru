# Guru Architecture: The Ownership Boundary

**Critical Principle:** Guru is a mentor-orchestrator that operates over user-owned files and memory, not a centralized service that holds user data.

**Date:** January 9, 2026  
**Status:** Architecture Locked  

---

## The Core Rule (Do Not Break)

```
Guru must NEVER become the canonical holder of user memory.
```

If this rule breaks:
- ❌ Trust is gone
- ❌ Architecture collapses  
- ❌ You become "just another cloud AI"
- ❌ All privacy guarantees evaporate

If this rule holds:
- ✅ User owns everything
- ✅ Guru is replaceable
- ✅ Portable across devices
- ✅ True privacy by design

---

## Three Layers (Never Mix)

```
LAYER 1: User-Owned Data
├─ files (codebase, notes, documents)
├─ chats (conversation history)
├─ artifacts (created work)
└─ memory (personal knowledge)
│
↓ (One-way: read + embed)
│
LAYER 2: Local Memory Index
├─ embeddings (vectors)
├─ metadata (source, timestamp, hash)
├─ file references (paths, URIs)
└─ semantic links (concept graph)
│
↓ (One-way: query + reason)
│
LAYER 3: Guru Orchestration
├─ recall (find relevant context)
├─ reasoning (diagnose + frame)
└─ narration (explain + guide)
```

**Critical:** Guru **never owns or modifies Layer 1**.

---

## What Guru Can Do

### ✅ Read
- Binary content (local)
- File metadata
- Directory structure
- Modification timestamps

### ✅ Index
- Create embeddings locally
- Store vectors in local database
- Build semantic graph
- Link files conceptually

### ✅ Reference
- Point to user's files
- Suggest edits (diffs, patches)
- Show implications across codebase
- Track dependencies

### ✅ Remember
- Store pointers to user memory
- Rebuild index if needed
- Sync index across devices

---

## What Guru Can NEVER Do

### ❌ Store Raw User Data
- Raw file content on Guru servers
- Raw chat history on Guru servers
- Raw artifacts on Guru servers
- Raw knowledge base on Guru servers

### ❌ Be the Source of Truth
- User's version is authoritative, not Guru's
- If Guru index corrupts, regenerate from user's files
- If Guru disappears, user's data is intact

### ❌ Sync Through Guru's Infrastructure
- Cross-device sync via Guru's servers
- User → Guru → Device (❌)
- User → Device directly (✅)

### ❌ Force Centralization
- Cloud-based accounts only
- No offline-first capability
- No local-first design

---

## Data Flow (Correct Model)

```
User's File
    ↓
[Read Binary]
    ↓
[Chunk Content]
    ↓
[Hash Chunks]
    ↓
[Embed Vectors]
    ↓
[Store: Vector + Hash + File Path]
         ↑
    [Never Upload]
    [Always Local]
```

**Key:** User's file remains untouched. Only embeddings are stored locally.

---

## Identity Model (No Centralization)

### Option 1: Device-Local Identity
```
Username: @alice
Device ID: device_123
Local Store: ~/.guru/index/
Identity proof: local keypair

Behavior: Single device, full memory
```

### Option 2: Portable Identity
```
Username: @alice
Keypair: generated locally
Index Location: User-synced folder
  (iCloud / Dropbox / Syncthing / WebDAV)

Behavior: Same username → same index across devices
Device 1 updates index → Device 2 auto-syncs
```

### Option 3: Multi-Device (Stateless)
```
Username: @alice
Keypair: optional
Index: regenerates from source files

Behavior: Guru is always a fresh index
No sync needed, just rebuild embeddings
Trade-off: Slower first load per device
```

**Guru's role:** Stateless coordinator, not account holder.

---

## Cross-Device Behavior (If Portable Identity)

### What Syncs
```
index/
├─ embeddings/
│   └─ vectors.db
├─ metadata/
│   └─ file_references.json
└─ graph/
    └─ concept_links.json
```

Size: Small (vectors + metadata, no raw content)

### What Does NOT Sync
```
❌ Raw file content
❌ Raw chat history
❌ Guru's internal state

✅ Files sync through user's mechanism:
   (Git / iCloud / Dropbox / etc.)
```

### Sync Mechanism
```
NOT: User → Guru Server → Device
YES: User → Sync Service → Device
     (Same username detected → same index loaded)
```

---

## Implementation Pattern

### Phase: Local Mentor (First)
```
App runs locally:
- Reads user's files from disk
- Builds embeddings locally (CPU/GPU)
- Stores index locally
- Never phones home
```

### Phase: Optional Sync (Later)
```
If user enables sync:
- Index file syncs to user's provider
- App detects same identity
- Reuses index on new device
- Still no raw data to Guru servers
```

### Phase: Collaboration (Future)
```
If user shares files with collaborator:
- Both have local copies
- Both maintain separate indexes
- Guru stays mentoring, not coordinating
- Sharing happens outside Guru
```

---

## Mentor Capability Model

### What This Enables

Because Guru has file access (but not ownership):

```
Guru can:
├─ "I see this function calls that function"
├─ "You wrote similar logic last month in file X"
├─ "This breaks the pattern you established here"
├─ "Let me trace how this flows through your codebase"
└─ "Here's what changed since I last saw this"

Without:
├─ Owning your files
├─ Storing your code on servers
├─ Becoming an IDE
└─ Creating vendor lock-in
```

---

## File Interaction Rules

### Reading Files
```
IF user has granted permission
AND file is in permitted directory
THEN:
  - Read binary
  - Hash content
  - Embed if needed
  - Store: vector + hash + path
```

### Suggesting Changes
```
IF user asks for help
AND Guru has diagnosed problem
THEN:
  - Generate diff (never auto-apply)
  - Show to user
  - User controls acceptance
  - File remains user-owned
```

### Building Context
```
IF Guru needs to understand codebase
THEN:
  - Scan permitted directories
  - Build semantic graph
  - Link files conceptually
  - Store graph (not code)
  
NO: Upload to servers
NO: Index for product analytics
NO: Use for training
```

---

## The Embedding Strategy

### What Gets Embedded
```
Code:
  - Functions / classes
  - Comments + docstrings
  - Code structure + patterns

Documents:
  - Paragraphs
  - Concepts
  - Key ideas

Chats:
  - User questions
  - Guru answers
  - Resolved issues
```

### Storage (Local Database)
```
{
  "id": "chunk_123",
  "vector": [0.1, 0.2, ...],      // 1,536 dimensions
  "hash": "sha256:abc...",
  "source": "/Users/alice/project/file.js:10-20",
  "type": "function",
  "timestamp": 1704816000,
  "metadata": {
    "language": "javascript",
    "domain": "api-layer"
  }
}
```

**Size per file:** ~1-5KB of embeddings per 100 lines of code

---

## Open WebUI Integration (Perfect Fit)

Open WebUI already provides:

```
✅ Local embedding models (llama2-embeddings, etc.)
✅ Vector database (Chroma, Weaviate, etc.)
✅ RAG pipeline hooks
✅ Tool/function integration
✅ Self-hosted, no cloud required
```

You only need to:

```
1. Connect file system reader
2. Point to user-controlled directory
3. Embed with local model
4. Store in local vector DB
5. Query on user request

Result: Complete system, zero data upload
```

---

## Privacy Guarantees (Rock Solid)

### What Guru Knows
- Your files (local read)
- Your questions (local query)
- Your memory graph (local)

### What Guru Stores
- Embeddings (unrecoverable to original)
- File references (paths only)
- Timestamps
- Usage patterns (local)

### What Guru NEVER Gets
- Raw file content (servers)
- Chat history (servers)
- Personal notes (servers)
- Account data (minimal)

### What Users Control
- Which directories to index
- What to ask Guru
- Whether to sync
- Which device identities link

---

## Vendor Lock-In: Zero Risk

Because user owns everything:

```
If you stop using Guru:
  ✅ Your files remain intact
  ✅ Your index can be rebuilt anywhere
  ✅ Your memory graph is semantic (portable)
  ✅ Your identity has no lock-in

You could switch to:
  - Different mentor AI
  - Different index provider
  - Different sync method
  
Your data is untouched.
```

---

## Security Model

### No Authentication = No Breach
```
Local files:
  - Protected by OS permissions
  - User controls access
  - No account to hack

Local index:
  - Same protection as files
  - Encrypted if user wants
  - No remote access
```

### Optional: Encrypted Sync
```
IF user syncs index:
  - Can encrypt before sync
  - Decrypt locally
  - Your sync provider never sees plaintext
  
Example: iCloud with Guru app
  - Files iCloud-synced
  - Index iCloud-synced
  - iCloud sees nothing (encrypted)
```

---

## This Is How Personal AI Should Work

### Contrast: Current Cloud AI
```
User → Cloud AI → Cloud Storage → User
        ↑
    Owns your data
    Can change terms
    Can be breached
    Creates GDPR problems
```

### Contrast: Guru Model
```
User's Device → Local Guru → User's Sync
   ↑                             ↑
Owns data              User-chosen provider
Owns identity          (iCloud / Syncthing / etc.)
Offline-first
GDPR-compliant
```

---

## Implementation Checklist

### Phase 1: Local Mentor (Week 1-4)
- [ ] File reader (OS permissions)
- [ ] Local embeddings (CPU-based)
- [ ] Local vector DB (Chroma)
- [ ] File reference system (no raw storage)
- [ ] Offline-first operation

### Phase 2: Indexing (Week 5-8)
- [ ] Semantic graph builder
- [ ] File link discovery
- [ ] Concept extraction
- [ ] Update tracking (file changes)
- [ ] Index invalidation (file deleted)

### Phase 3: Memory (Week 9-12)
- [ ] Chat history (local)
- [ ] Artifact storage (user-owned)
- [ ] Conversation embeddings
- [ ] Recall engine (query index)

### Phase 4: Sync (Week 13+)
- [ ] Identity detection (username)
- [ ] Index serialization
- [ ] Sync provider integration
- [ ] Multi-device index sharing
- [ ] Conflict resolution (optional)

---

## What This Means for Guru's Positioning

### You Can Say
```
"Guru is your mentor that lives on your device,
remembers your work, and helps you think better—
without ever seeing your files leave your computer."
```

### You CANNOT Say (Would Break Design)
```
"Guru stores your code in the cloud"
"Guru is your team knowledge base"
"Guru backs up your files"
"Guru is the source of truth for your work"
```

---

## The One Sentence That Locks It All In

If this matches your intent, you're architected correctly:

> **Guru operates as an indexer + reasoner + narrator over user-owned files and memory on the user's device, like an IDE's intelligence layer, without owning, storing, or centralizing user data.**

---

## When You Might Break This Rule (Watch For)

### ❌ Danger Sign 1: "Let's store chat history on servers"
- No. Store locally.
- Sync via user's provider if needed.

### ❌ Danger Sign 2: "We need accounts for collaboration"
- No. Collaboration happens user-to-user.
- Guru doesn't coordinate, just mentors.

### ❌ Danger Sign 3: "Let's analyze user data to improve Guru"
- No. You can't see raw data.
- Use anonymized query patterns only.

### ❌ Danger Sign 4: "We should cache embeddings on servers for speed"
- No. Cache locally.
- Rebuild on each device if needed.

### ❌ Danger Sign 5: "Users need an account to use Guru"
- No. Optional identity only.
- Local-first, no login required.

---

## This Is Your Moat

In a world where every AI company becomes a data company:

**You are choosing to not be a data company.**

That's:
- More defensible
- More trustworthy
- More aligned with users
- Actually more profitable long-term (no compliance debt)

Lock this in. Never compromise it.

---

**Document Version:** 1.0  
**Status:** Architectural Rule - Lock In  
**Reviewed:** January 9, 2026
