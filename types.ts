
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
