# Guru Retrieval Agent Assignment & Pipeline

## Core Problem

User query needs to flow through **specialized retrieval agents**, NOT generic RAG:

```
User Query
    ↓
[DISCOVERER] — Search (like Google crawler)
    ↓
[RESEARCHER] — Retrieve documents + files + code + courses
    ↓
[ARCHIVIST] — Ground in recall + context
    ↓
[THINKER] — Synthesize with web research
    ↓
User (grounded answer)
```

---

## Agent Role Assignments (from existing types.ts)

### 1. **DISCOVERER** (Search Agent)
**Responsibility:** Find what's relevant before retrieval

**Tasks:**
- Scan query for intent (research? coding? learning?)
- Search user's local files (documents, code, notes)
- Search courses platform (if indexed)
- Search web (if enabled)
- Return ranked list of sources

**Implementation:**
```typescript
async performDiscovery(userId: string, query: string): Promise<SourceSignal[]> {
  // 1. Keyword extraction
  const keywords = extractKeywords(query);
  
  // 2. Search local files (artifacts)
  const localResults = await searchUserArtifacts(userId, keywords);
  
  // 3. Search courses
  const courseResults = await searchCourses(keywords);
  
  // 4. Search web (optional)
  const webResults = process.env.WEB_SEARCH ? 
    await searchWeb(keywords) : [];
  
  // 5. Rank by relevance
  return rankSources([...localResults, ...courseResults, ...webResults]);
}
```

---

### 2. **RESEARCHER** (Retrieval Agent)
**Responsibility:** Fetch actual content from discovered sources

**Tasks:**
- Query OpenWebUI vector DB for documents matching keywords
- Retrieve code chunks from local index
- Fetch course content/syllabus
- Extract snippets with context
- Generate grounding sources

**Implementation:**
```typescript
async performRetrieval(
  userId: string, 
  sources: SourceSignal[], 
  query: string
): Promise<RetrievalResult> {
  const results = {
    documents: [],
    code: [],
    courses: [],
    webSnippets: []
  };
  
  for (const source of sources) {
    if (source.origin === 'Internal') {
      // Query OpenWebUI vector DB
      const docs = await queryVectorDB(
        source.uri, 
        query, 
        topK: 3
      );
      results.documents.push(...docs);
    }
    
    if (source.category === 'course') {
      // Fetch course content
      const course = await fetchCourseContent(source.uri);
      results.courses.push(course);
    }
    
    if (source.origin === 'Web') {
      // Fetch web snippet
      const snippet = await fetchWebSnippet(source.uri);
      results.webSnippets.push(snippet);
    }
  }
  
  return results;
}
```

---

### 3. **ARCHIVIST** (Context Agent)
**Responsibility:** Ground response in user history + recall

**Tasks:**
- Query user's recall thread (recallService)
- Retrieve past problems (retrievalService.getSimilarPastProblems)
- Find user preferences + learning style
- Detect if question was asked before (Inquiry Graph)
- Return consolidated context

**Implementation:**
```typescript
async performArchiving(
  userId: string, 
  query: string,
  retrieval: RetrievalResult
): Promise<GroundingContext> {
  // 1. Search user's recall patches
  const recallPatches = await recallService.searchRecall(userId, query);
  
  // 2. Get user's learning profile
  const userProfile = await retrievalService.getBackwardContext(userId);
  
  // 3. Find past similar problems
  const pastProblems = await retrievalService.getSimilarPastProblems(
    userId, 
    domain, 
    problemType
  );
  
  // 4. Check inquiry graph (if it solved this before)
  const inquiryHistory = await inquiryGraphService.findRelated(query);
  
  return {
    userProfile,
    recallContext: recallPatches,
    pastProblems,
    inquiryHistory,
    shouldRefuseToAnswer: checkResponseGates(...)
  };
}
```

---

### 4. **THINKER** (Synthesis Agent)
**Responsibility:** Reason over all retrieved context

**Tasks:**
- Consolidate retrieved documents + courses + web research
- Detect contradictions
- Build synthesis strategy
- Identify missing context
- Generate grounding confidence

**Implementation:**
```typescript
async performSynthesis(
  retrieval: RetrievalResult,
  grounding: GroundingContext,
  query: string
): Promise<ThinkerNotes> {
  // 1. Detect contradictions
  const contradictions = detectContradictions(
    retrieval.documents,
    retrieval.webSnippets,
    grounding.pastProblems
  );
  
  // 2. Build synthesis strategy
  const strategy = {
    prioritize: ['user_artifacts', 'courses', 'web'],
    skipRedundant: true,
    emphasizeRecent: true
  };
  
  // 3. Estimate confidence
  const confidence = calculateGroundingConfidence(
    retrieval.documents.length,
    retrieval.courses.length,
    contradictions.length
  );
  
  return {
    groundingConfidence: confidence,
    sourceVerification: retrieval.documents.map(d => d.source),
    contradictionsFound: contradictions,
    synthesisStrategy: strategy,
    suggestedTools: suggestTools(query, retrieval),
    knowledgeGraphNodes: buildNodes(retrieval, grounding)
  };
}
```

---

### 5. **WATCHER** (Monitoring Agent)
**Responsibility:** Track new courses, monitor retrieval quality

**Tasks:**
- Detect new courses added to platform
- Monitor retrieval speed + coverage
- Index new artifacts
- Update changelog
- Track system health

---

## Pipeline Flow (TypeScript Implementation)

```typescript
export async function executeRetrievalPipeline(
  userId: string, 
  query: string,
  domain: string
): Promise<PipelineOutput> {
  
  // Step 1: DISCOVERER
  console.log('[DISCOVERER] Searching for relevant sources...');
  const sources = await discovererAgent.performDiscovery(userId, query);
  
  // Step 2: RESEARCHER
  console.log('[RESEARCHER] Retrieving content from sources...');
  const retrieval = await researcherAgent.performRetrieval(userId, sources, query);
  
  // Step 3: ARCHIVIST
  console.log('[ARCHIVIST] Grounding in user context...');
  const grounding = await archivistAgent.performArchiving(userId, query, retrieval);
  
  // Step 4: Check Response Gates
  if (grounding.shouldRefuseToAnswer) {
    return {
      status: 'gated',
      message: 'Insufficient context. Need to ask clarifying question.',
      guidedQuestion: generateClarifyingQuestion(query, grounding)
    };
  }
  
  // Step 5: THINKER (Synthesis)
  console.log('[THINKER] Synthesizing response...');
  const thinkerNotes = await thinkerAgent.performSynthesis(
    retrieval, 
    grounding, 
    query
  );
  
  // Step 6: Return grounded output
  return {
    status: 'success',
    query,
    sources: sources,
    documents: retrieval.documents,
    courses: retrieval.courses,
    grounding: grounding,
    thinkerNotes: thinkerNotes,
    isGrounded: thinkerNotes.groundingConfidence > 0.6
  };
}
```

---

## Course Retrieval (NotebookLM-style)

### Implementation Plan

```typescript
export class CourseRecallService {
  /**
   * Index course materials (like NotebookLM)
   * - Download course syllabus
   * - Extract lessons as knowledge patches
   * - Embed into vector DB
   */
  async indexCourseMaterials(
    courseId: string,
    syllabus: CourseSyllabus
  ): Promise<void> {
    for (const module of syllabus.modules) {
      for (const lesson of module.lessons) {
        const patch: KnowledgePatch = {
          id: `course-${courseId}-${lesson}`,
          content: lesson.content,
          type: 'concept',
          timestamp: Date.now()
        };
        await recallService.addPatch(courseId, patch);
      }
    }
  }
  
  /**
   * Retrieve relevant course content
   */
  async retrieveCourseLessons(
    userId: string,
    courseId: string,
    query: string
  ): Promise<CourseLessonResult[]> {
    // 1. Search within course recall thread
    const courseThread = await recallService.getThread(courseId);
    
    // 2. Find relevant lessons
    const lessons = await recallService.searchRecall(courseId, query, limit: 5);
    
    // 3. Return with context
    return lessons.map(lesson => ({
      courseId,
      content: lesson.content,
      relevanceScore: calculateRelevance(lesson, query),
      relatedModules: findRelatedModules(lesson)
    }));
  }
}
```

---

## Web Research Integration

```typescript
export class WebResearchAgent {
  /**
   * Perform web search (Google-like)
   */
  async searchWeb(query: string, limit: number = 5): Promise<WebResult[]> {
    if (!process.env.ENABLE_WEB_SEARCH) return [];
    
    const results = await fetch(`${process.env.TAVILY_API_URL}/search`, {
      method: 'POST',
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        include_answer: true,
        max_results: limit
      })
    }).then(r => r.json());
    
    return results.results.map((r: any) => ({
      url: r.url,
      title: r.title,
      snippet: r.snippet,
      relevance: r.score
    }));
  }
  
  /**
   * Fetch and parse web content
   */
  async fetchWebSnippet(url: string): Promise<WebSnippet> {
    const html = await fetch(url).then(r => r.text());
    const text = extractTextFromHTML(html);
    return {
      url,
      content: text.substring(0, 1000), // First 1000 chars
      timestamp: Date.now()
    };
  }
}
```

---

## Response Gating Rules

Before LLM responds, **all gates must pass**:

```typescript
function checkResponseGates(
  query: string,
  grounding: GroundingContext,
  retrieval: RetrievalResult
): boolean {
  // Gate 1: Must have retrieved something
  if (retrieval.documents.length === 0 && 
      retrieval.courses.length === 0) {
    return true; // REFUSE: No content found
  }
  
  // Gate 2: User profile confidence
  if (!grounding.userProfile.explainationDepth) {
    return true; // REFUSE: Don't know user's learning level
  }
  
  // Gate 3: Contradiction detection
  if (grounding.thinkerNotes.contradictionsFound.length > 3) {
    return true; // REFUSE: Too many conflicting sources
  }
  
  // Gate 4: Past problem loop detection
  if (grounding.inquiryHistory.isRepeatQuestion) {
    return false; // ASK: Have we seen this? What changed?
  }
  
  // All gates pass: safe to answer
  return false;
}
```

---

## SQLite Schema for Agents

```sql
-- Discovered sources
CREATE TABLE discovered_sources (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  query TEXT,
  source_origin TEXT,
  source_category TEXT,
  relevance_score REAL,
  indexed_at TIMESTAMP
);

-- Retrieval results
CREATE TABLE retrieval_results (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  query TEXT,
  source_id TEXT,
  content TEXT,
  content_type TEXT, -- 'document', 'course', 'code', 'web'
  relevance_score REAL,
  retrieved_at TIMESTAMP
);

-- Course indexing
CREATE TABLE course_materials (
  id TEXT PRIMARY KEY,
  course_id TEXT,
  lesson_id TEXT,
  content TEXT,
  module_id TEXT,
  embedded_at TIMESTAMP
);

-- Pipeline execution logs
CREATE TABLE retrieval_pipeline_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  query TEXT,
  discoverer_results INT,
  researcher_results INT,
  archivist_context_size INT,
  thinker_confidence REAL,
  gated_at TEXT,
  executed_at TIMESTAMP
);
```

---

## What's Next

1. **Implement DISCOVERER agent** → Query all sources (local, courses, web)
2. **Wire RESEARCHER to OpenWebUI** → Fetch actual documents
3. **Integrate ARCHIVIST with recallService** → Grounding in user history
4. **Implement THINKER synthesis** → Consolidate all context
5. **Add response gates** → Refuse if constraints violated
6. **Test with courses** → Index real course materials like NotebookLM
7. **Add web research** → Optional external knowledge

---

## Testing the Pipeline

```bash
# Test full pipeline
curl -X POST http://localhost:8000/api/guru/retrieval/execute \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "query": "How do I optimize Python list operations?",
    "domain": "coding"
  }'

# Should return:
# {
#   "discoverer": 5 sources found,
#   "researcher": 12 documents retrieved,
#   "archivist": user profile + recall context,
#   "thinker": grounding confidence 0.85,
#   "isGrounded": true,
#   "courses": [course materials matched]
# }
```

---

## Key Insight

> **This is not about building new retrieval. It's about assigning existing agents to their proper retrieval roles.**

We have:
- ✅ OpenWebUI vector DB
- ✅ recallService (user memory)
- ✅ retrievalService (domain knowledge)
- ✅ Agent roles defined
- ✅ Diagnostic pipeline

We need to:
- 🔲 Wire agents in proper sequence
- 🔲 Implement search (DISCOVERER)
- 🔲 Add response gates
- 🔲 Index courses
- 🔲 Add web research

**Not a philosophy problem. An orchestration problem.**
