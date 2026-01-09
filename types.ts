
export type GuruRole = 'LISTENER' | 'THINKER' | 'ORCHESTRATOR' | 'SPEAKER' | 'SUBTITLER' | 'VISUALIZER' | 'ARCHIVIST' | 'WORKSPACE_SYNC' | 'EXAMINER' | 'DISCOVERER' | 'RESEARCHER' | 'WATCHER';

export type SourceCategory = 'AI' | 'Machine Learning' | 'Web3' | 'Hardware' | 'Robotics' | 'DevOps';
export type SourceOrigin = 'GitHub' | 'HuggingFace' | 'Arxiv' | 'YouTube' | 'Web' | 'Internal';

export interface GroundingSource {
  title: string;
  uri: string;
  type: 'web';
  relevance: number;
  icon?: string;
  snippet?: string;
}

export interface KnowledgePatch {
  id: string;
  content: string;
  type: 'concept' | 'artifact' | 'preference' | 'fact' | 'system_log';
  timestamp: number;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  timestamp: number;
  type: 'feature' | 'fix' | 'sync' | 'security';
}

export interface WatcherStatus {
  lastSync: number;
  activeTasks: string[];
  systemHealth: number;
  newCoursesFound: number;
  indexingSpeed: string;
}

export interface SourceSignal {
  url: string;
  origin: SourceOrigin;
  category: SourceCategory;
  title: string;
  relevanceScore: number;
}

export interface ThinkerNotes {
  groundingConfidence: number;
  sourceVerification: string[];
  contradictionsFound: string[];
  synthesisStrategy: string;
  suggestedTools: string[];
  knowledgeGraphNodes: string[];
}

export interface Message {
  role: 'user' | 'assistant' | 'thinker' | 'system';
  id: string;
  timestamp: number;
  content: string;
  englishSubtitle?: string;
  visualHighlights?: VisualHighlight[];
  sources?: GroundingSource[];
  discoveredCourses?: DiscoveredCourse[];
  activeSources?: SourceSignal[];
  reasoningTrace?: string;
  thinkerNotes?: ThinkerNotes;
  detectedLanguage?: string;
  activeRole?: GuruRole;
  isGrounded?: boolean;
  guidedQuestion?: string;
  spacialData?: {
    nodes: Node3D[];
    links: Link3D[];
  };
}

export interface VisualHighlight {
  keyword: string;
  type: 'image' | 'icon' | 'formula' | 'diagram' | 'flashcard' | 'shop' | 'gif' | 'simulation';
  data: string;
  explanation?: string;
  externalLink?: string; 
  isAnimated?: boolean;
  conceptId?: string; 
}

export interface DiscoveredCourse {
  title: string;
  provider: string;
  url: string;
  thumbnail?: string;
  relevanceReason: string;
  isInternal: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: SourceCategory;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: string[];
  completed: boolean;
}

export interface CourseSyllabus {
  id: string;
  title: string;
  description: string;
  category: SourceCategory;
  modules: CourseModule[];
  sourceSignals: SourceSignal[];
  githubUrl?: string;
  paperUrl?: string;
  youtubeUrl?: string;
}

export enum AppState {
  IDLE = 'idle',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  GENERATING = 'generating',
  RESEARCHING = 'researching'
}

export type ViewMode = 'home' | 'discover' | 'spaces' | 'finance' | 'library' | 'docs' | 'changelog' | 'billing' | 'admin';

export interface User {
  uid: string;
  name: string;
  role: 'student' | 'admin';
  xp: number;
  streak: number;
  avatar: string;
  plan: 'free' | 'pro' | 'elite';
  title: string;
  level: number;
  points: number;
  coursesStarted: number;
  projectsCompleted: number;
  referralCode: string;
  certificates: Certificate[];
}

export interface RecallThread {
  userId: string;
  lastRecallTime: number;
  patches: KnowledgePatch[];
  retentionPolicy: 'standard' | 'strict';
}

export interface Node3D {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  type: 'concept' | 'source' | 'user_focus' | 'paper' | 'repo';
}

export interface Link3D {
  source: string;
  target: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalXP: number;
  eliteUsers: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
}

export interface CourseProgress {
  courseId: string;
  currentModuleIndex: number;
  currentLessonIndex: number;
  completed: boolean;
  quizScores: number[];
  completedModules: string[];
  lastAccessed: number;
}

// ============================================
// DIAGNOSTIC MENTOR LOOP TYPES
// ============================================

export type DiagnosticStage = 'observe' | 'baseline' | 'questions' | 'pain_points' | 'frame' | 'guide' | 'complete';

export interface DiagnosticSession {
  id: string;
  userId: string;
  threadId: string;
  stage: DiagnosticStage;
  domain: string;
  problemType?: string;
  
  // Collected data
  observation: ObservationData;
  baseline?: BaselineData;
  userProfile?: UserDiagnosticProfile;
  painPoints?: PainPoint[];
  problemFrame?: ProblemFrame;
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  feedback?: DiagnosticFeedback;
}

export interface ObservationData {
  description: string;
  files?: Array<{ type: string; url: string; }>;
  images?: Array<{ url: string; description?: string; }>;
  evidence: string[];
  metadata?: Record<string, any>;
}

export interface BaselineData {
  whatWorks: string[];
  whatDoesntWork: string[];
  previousAttempts: string[];
  constraints: ConstraintInfo[];
  applicableStandards: string[];
}

export interface ConstraintInfo {
  type: 'time' | 'budget' | 'skill' | 'tools' | 'environment' | 'other';
  value: string;
  severity: 'low' | 'medium' | 'high';
}

export interface UserDiagnosticProfile {
  userId: string;
  learningStyle: 'visual' | 'conceptual' | 'hands-on' | 'hybrid';
  learnsBest: string[];
  frustratedBy: string[];
  skillLevels: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'>;
  riskTolerance: 'low' | 'medium' | 'high';
  explainationDepth: 'brief' | 'moderate' | 'deep';
  
  // History patterns
  pastProblems: ProblemSnapshot[];
  successPatterns: string[];
  mistakesRepeated: string[];
  
  // Current session context
  timeAvailable?: 'minutes' | 'hours' | 'days';
  toolsAvailable?: string[];
  updatedAt: number;
}

export interface ProblemSnapshot {
  id: string;
  domain: string;
  problemType: string;
  problemFrame?: string;
  solutionPath: string[];
  outcome: 'resolved' | 'partially_resolved' | 'abandoned';
  lessonsLearned: string[];
  timestamp: number;
}

export interface PainPoint {
  id: string;
  category: 'blocker' | 'constraint' | 'unknown' | 'assumption' | 'misconception';
  description: string;
  severity: 'low' | 'medium' | 'high';
  identified: boolean;
}

export interface ProblemFrame {
  primaryType: string;
  secondaryTypes?: string[];
  isntType: string[];  // what it's NOT
  rootCauseCategory: string;
  applicableDomainRules: string[];
  reasoning: string;
  userAgreed?: boolean;
  confidence: number;  // 0-1
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  priority: 'primary' | 'secondary' | 'optional';
  answerOptions?: string[];
  followUpQuestions?: Record<string, DiagnosticQuestion>;
  narrows: string[];  // what this question narrows (problem categories)
}

export interface DiagnosticFeedback {
  wasHelpful: boolean;
  frameAccurate: boolean;
  guidanceClarity: 'unclear' | 'okay' | 'clear' | 'excellent';
  comments?: string;
  timestamp: number;
}

export interface DomainDiagnosticModule {
  domain: string;
  problemTypes: ProblemType[];
  diagnosticTree: DiagnosticNode;
  standards: Standard[];
  commonPitfalls: Pitfall[];
  exampleProblems: ExampleProblem[];
}

export interface ProblemType {
  id: string;
  name: string;
  indicators: string[];
  rootCauses: string[];
  typicalConstraints: ConstraintInfo[];
  solutionPatterns: SolutionPattern[];
}

export interface DiagnosticNode {
  id: string;
  question: DiagnosticQuestion;
  branches: {
    yes?: string | DiagnosticNode;
    no?: string | DiagnosticNode;
    maybe?: string | DiagnosticNode;
  };
  framingIfReached: ProblemFrame;
}

export interface Standard {
  id: string;
  domain: string;
  category: string;
  description: string;
  references: string[];
}

export interface Pitfall {
  id: string;
  domain: string;
  description: string;
  commonIn: string[];
  howToAvoid: string;
}

export interface ExampleProblem {
  id: string;
  domain: string;
  description: string;
  baselineWas: string;
  painPointWas: string;
  wasFramedAs: string;
  resolution: string;
  lessonsLearned: string[];
}

export interface SolutionPattern {
  id: string;
  steps: string[];
  successCriteria: string;
  failureHandling: string;
  learningGoals: string[];
}

export interface MentorAction {
  type: 'ask' | 'explain' | 'guide' | 'loop_back' | 'confirm_frame';
  content: string;
  questions?: DiagnosticQuestion[];
  guidance?: GuidanceStep[];
  reasoning: string;
}

export interface GuidanceStep {
  stepNumber: number;
  action: string;
  successCriteria: string;
  failureHandling: string;
  verification: string;
}

// Extend existing Message interface with diagnostic context
export interface DiagnosticMessage extends Message {
  diagnosticContext?: {
    sessionId: string;
    stage: DiagnosticStage;
    confidence: number;
  };
  action?: MentorAction;
}
// ============================================
// OWNERSHIP BOUNDARY TYPES (Critical)
// User owns data, Guru indexes and reasons over it
// ============================================

/**
 * CRITICAL RULE: Guru never becomes the canonical holder of user memory.
 * All user data is owned by the user; Guru only stores references + embeddings.
 */

export interface FileReference {
  /** Canonical path to user's file (local or URI) */
  path: string;
  
  /** OS-level permissions allow reading this file */
  readable: boolean;
  
  /** Content hash (SHA256) for integrity checking */
  contentHash: string;
  
  /** File last modified timestamp */
  modifiedAt: number;
  
  /** File type: 'code' | 'document' | 'note' | 'artifact' | 'chat' | 'other' */
  type: 'code' | 'document' | 'note' | 'artifact' | 'chat' | 'other';
  
  /** Language for code, format for documents */
  language?: string;
  
  /** Size in bytes (for tracking) */
  sizeBytes?: number;
}

export interface EmbeddingChunk {
  /** Unique ID for this chunk */
  id: string;
  
  /** The actual vector (never store raw content) */
  vector: number[];
  
  /** Hash of original content (for verification) */
  contentHash: string;
  
  /** Where this came from: file + line range */
  source: FileReference & {
    startLine?: number;
    endLine?: number;
    startChar?: number;
    endChar?: number;
  };
  
  /** What kind of content: function, class, concept, paragraph, etc. */
  chunkType: 'function' | 'class' | 'concept' | 'paragraph' | 'code_block' | 'other';
  
  /** Semantic metadata extracted during embedding */
  metadata?: {
    keywords?: string[];
    domain?: string;
    importance?: 'low' | 'medium' | 'high';
    references?: string[];  // other chunk IDs this relates to
  };
  
  /** When this was embedded */
  embeddedAt: number;
  
  /** When source file was read */
  sourceReadAt: number;
}

export interface LocalMemoryIndex {
  /** User identifier (local username or ID) */
  userId: string;
  
  /** Device identifier (for multi-device scenarios) */
  deviceId: string;
  
  /** All chunks currently indexed */
  chunks: EmbeddingChunk[];
  
  /** File references being tracked */
  trackedFiles: FileReference[];
  
  /** Semantic graph linking chunks (concept relationships) */
  conceptGraph: ConceptLink[];
  
  /** Index metadata */
  createdAt: number;
  updatedAt: number;
  version: string;
  
  /** Size of index (for diagnostics) */
  sizeBytes: number;
}

export interface ConceptLink {
  /** ID of source chunk */
  fromChunk: string;
  
  /** ID of target chunk */
  toChunk: string;
  
  /** Relationship type: 'related' | 'depends_on' | 'implements' | 'extends' | 'contradicts' */
  relationship: 'related' | 'depends_on' | 'implements' | 'extends' | 'contradicts' | 'example_of';
  
  /** Strength of relationship (0-1) */
  strength: number;
}

export interface PortableIdentity {
  /** Username (local) */
  username: string;
  
  /** Optional device keypair (for encryption) */
  keypair?: {
    publicKey: string;
    /** Never store private key */
  };
  
  /** Where index is stored (user-controlled location) */
  indexLocation?: 'local' | 'icloud' | 'dropbox' | 'syncthing' | 'webdav' | 'custom';
  
  /** Last sync timestamp (if applicable) */
  lastSync?: number;
  
  /** Devices using this identity */
  linkedDevices?: string[];
  
  /** Identity created timestamp */
  createdAt: number;
}

export interface UserPermissions {
  /** Directories user allows Guru to index */
  allowedPaths: string[];
  
  /** File types to index (or exclude) */
  filePatterns?: {
    include?: string[];  // glob patterns
    exclude?: string[];  // glob patterns
  };
  
  /** Whether embedding data can sync across devices */
  allowSync: boolean;
  
  /** Whether Guru can watch for file changes */
  watchForChanges: boolean;
  
  /** Sensitive patterns to exclude from indexing */
  exclusionPatterns?: string[];
  
  /** Permissions set by user at */
  grantedAt: number;
}

export interface IndexUpdateLog {
  /** Files added to index */
  filesAdded: FileReference[];
  
  /** Files removed from index */
  filesRemoved: FileReference[];
  
  /** Files updated in index */
  filesUpdated: FileReference[];
  
  /** When this update happened */
  timestamp: number;
  
  /** Trigger: 'manual' | 'watch' | 'sync' | 'startup' */
  trigger: 'manual' | 'watch' | 'sync' | 'startup';
  
  /** Total chunks after update */
  totalChunks: number;
}

/**
 * Critical constraint types that enforce ownership boundary
 */
export interface OwnershipBoundary {
  /** User data lives here, Guru cannot modify */
  userDataPath: string;
  
  /** Guru index lives here (local) */
  indexPath: string;
  
  /** Files Guru can read (permission-based) */
  readableFiles: string[];
  
  /** Files Guru CANNOT read (security/privacy) */
  excludedFiles: string[];
  
  /** Last time permissions were verified */
  permissionsCheckedAt: number;

// ===== LOCAL MODELS TYPES =====
/**
 * Model configuration for local LLM inference
 * Defines available models: Phi-3 Mini, MobileVLM, TinyLlama
 */
export interface LocalModelConfig {
  /** Unique model identifier */
  name: 'phi-3-mini' | 'mobilevlm-3b' | 'tinyllama-1b';
  
  /** Human-readable name */
  displayName: string;
  
  /** Size in bytes (uncompressed) */
  sizeMB: number;
  
  /** Model type: reasoning (text), multimodal (text+image), or ultra-light */
  type: 'reasoning' | 'multimodal' | 'ultra-light';
  
  /** Quantization level (reduces size) */
  quantization: '4bit' | '8bit' | 'fp16';
  
  /** Maximum context window in tokens */
  contextWindow: number;
  
  /** Typical latency on GPU (ms) */
  latencyGPUMs: number;
  
  /** Typical latency on CPU (ms) */
  latencyCPUMs: number;
  
  /** GitHub release URL for downloading weights */
  downloadUrl?: string;
  
  /** License identifier (MIT, Apache, etc.) */
  license: string;
}

/**
 * Inference options for model.reason() or model.embed()
 * Controls output quality, latency, and resource usage
 */
export interface InferenceOptions {
  /** Maximum tokens to generate (default: 4096) */
  maxTokens?: number;
  
  /** Sampling temperature (0.0-2.0, default: 0.7) */
  temperature?: number;
  
  /** Top-P nucleus sampling (0.0-1.0, default: 0.9) */
  topP?: number;
  
  /** Hard timeout in milliseconds (default: 5000) */
  timeout?: number;
  
  /** Whether to stream response tokens (for UI) */
  stream?: boolean;
  
  /** User-facing task description (for logging) */
  task?: 'question_generation' | 'problem_framing' | 'evidence_analysis' | 'embedding' | 'image_analysis';
}

/**
 * Model runtime status for monitoring and debugging
 */
export interface ModelRuntimeStatus {
  /** Is model loaded and ready? */
  initialized: boolean;
  
  /** Currently active model */
  activeModel: 'phi-3-mini' | 'mobilevlm-3b' | 'tinyllama-1b';
  
  /** GPU available? */
  hasGPU: boolean;
  
  /** Model memory footprint (MB) */
  memoryUsageMB: number;
  
  /** Embedding cache size (number of cached vectors) */
  embeddingCacheSize: number;
  
  /** Location where models are cached */
  cacheDirectory: string;
  
  /** When model was last initialized */
  initializedAt?: number;
}

/**
 * Result of model inference (for structured tasks like problem framing)
 */
export interface InferenceResult<T = any> {
  /** Generated content or structured result */
  content: T;
  
  /** Tokens generated */
  tokensGenerated: number;
  
  /** Tokens consumed from context */
  tokensConsumed: number;
  
  /** Latency in milliseconds */
  latencyMs: number;
  
  /** Which model was used */
  modelUsed: string;
  
  /** Timestamp */
  timestamp: number;
}

/**
 * Image analysis result from multimodal models
 */
export interface ImageAnalysisResult {
  /** Detailed description of what's in the image */
  description: string;
  
  /** Identified problems or issues */
  identifiedIssues: string[];
  
  /** Confidence score (0-1) */
  confidence: number;
  
  /** Suggested diagnostic questions */
  suggestedQuestions: string[];
  
  /** Image hash for deduplication */
  imageHash: string;
}
}