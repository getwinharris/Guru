import { UserDiagnosticProfile, ProblemSnapshot, DomainDiagnosticModule } from '../types';

/**
 * RetrievalService: Bi-directional context retrieval
 * 
 * Direction 1 (Backward): User history, patterns, constraints
 * Direction 2 (Forward): Domain knowledge, diagnostic trees, examples
 * 
 * The mentor operates at the INTERSECTION of these two directions
 */

export class RetrievalService {
  // In-memory caches; would be replaced with database queries
  private userProfiles: Map<string, UserDiagnosticProfile> = new Map();
  private domainModules: Map<string, DomainDiagnosticModule> = new Map();

  // ============================================
  // DIRECTION 1: BACKWARD (User History)
  // ============================================

  /**
   * Retrieve user diagnostic profile
   * 
   * Returns: User's learning style, past problems, constraints discovered
   */
  async getBackwardContext(userId: string, options: {
    depth?: 'diagnostic' | 'full';
    relatedDomains?: string[];
    maxRecency?: number;  // days
  } = {}): Promise<UserDiagnosticProfile> {
    // TODO: Query database
    // For now, return placeholder
    return {
      userId,
      learningStyle: 'conceptual',
      learnsBest: ['step-by-step', 'examples'],
      frustratedBy: ['jargon', 'long answers'],
      skillLevels: { 'coding': 'intermediate', 'car_repair': 'beginner' },
      riskTolerance: 'medium',
      explainationDepth: 'moderate',
      pastProblems: [],
      successPatterns: ['Debugging with print statements'],
      mistakesRepeated: ['Forgetting to save changes'],
      updatedAt: Date.now(),
    };
  }

  /**
   * Retrieve past similar problems from user history
   */
  async getSimilarPastProblems(
    userId: string,
    domain: string,
    problemType: string
  ): Promise<ProblemSnapshot[]> {
    // TODO: Query database with similarity search
    // Return past problems in same domain + type
    return [];
  }

  /**
   * Record new problem snapshot for future retrieval
   */
  async recordProblemSnapshot(userId: string, snapshot: ProblemSnapshot): Promise<void> {
    // TODO: Store in database
    // Update user's pastProblems array
  }

  // ============================================
  // DIRECTION 2: FORWARD (Problem Space)
  // ============================================

  /**
   * Retrieve domain diagnostic module
   * 
   * Returns: Diagnostic tree, problem types, standards, examples
   */
  async getForwardContext(domain: string, options: {
    userSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    problemIndicators?: string[];
  } = {}): Promise<DomainDiagnosticModule> {
    // TODO: Load from database or JSON config
    // TODO: Filter diagnostic tree based on user skill level

    // Placeholder
    return {
      domain,
      problemTypes: [],
      diagnosticTree: {
        id: 'root',
        question: {
          id: 'q1',
          text: 'What is the primary symptom?',
          priority: 'primary',
          narrows: [],
        },
        branches: {},
        framingIfReached: {
          primaryType: 'unknown',
          isntType: [],
          rootCauseCategory: 'unknown',
          applicableDomainRules: [],
          reasoning: '',
          confidence: 0,
        },
      },
      standards: [],
      commonPitfalls: [],
      exampleProblems: [],
    };
  }

  /**
   * Retrieve diagnostic tree for domain
   */
  async getDiagnosticTree(domain: string) {
    const module = await this.getForwardContext(domain);
    return module.diagnosticTree;
  }

  /**
   * Retrieve example problems for learning
   */
  async getExamples(domain: string, problemType: string) {
    const module = await this.getForwardContext(domain);
    return module.exampleProblems.filter(ex => ex.domain === domain);
  }

  // ============================================
  // INTERSECTION: Combine Both Directions
  // ============================================

  /**
   * Get customized diagnostic questions
   * 
   * Combines:
   * - User's learning style (backward)
   * - Domain's diagnostic tree (forward)
   * - Problem indicators (current)
   */
  async getCustomizedQuestions(
    userId: string,
    domain: string,
    problemIndicators: string[]
  ) {
    // Get both directions
    const [userProfile, domainModule] = await Promise.all([
      this.getBackwardContext(userId, { relatedDomains: [domain] }),
      this.getForwardContext(domain),
    ]);

    // Customize questions based on intersection
    const baseQuestions = this.extractQuestionsFromTree(domainModule.diagnosticTree);

    // Filter based on:
    // 1. User's skill level (use intermediate questions, not beginner)
    // 2. User's learning style (visual? conceptual? hands-on?)
    // 3. Problem indicators (ask about error? or about behavior?)

    return baseQuestions.slice(0, 3);  // Max 3 questions
  }

  /**
   * Helper: Extract questions from diagnostic tree
   */
  private extractQuestionsFromTree(tree: any): any[] {
    // TODO: Traverse tree and collect questions
    return [];
  }

  /**
   * Get recommended next steps for user
   * 
   * Based on:
   * - What they've successfully done before (backward)
   * - What solutions work for this problem type (forward)
   * - Current problem frame
   */
  async getRecommendedNextSteps(
    userId: string,
    domain: string,
    problemType: string
  ) {
    const [userHistory, domainKnowledge] = await Promise.all([
      this.getSimilarPastProblems(userId, domain, problemType),
      this.getForwardContext(domain),
    ]);

    // Combine:
    // 1. Solutions that worked for this user in similar problems (backward)
    // 2. Recommended solution patterns for this problem type (forward)
    // 3. Adjust for user's confidence/risk tolerance

    return {
      successPath: userHistory[0]?.solutionPath || [],
      recommendedPath: [],
      alternativePaths: [],
    };
  }

  // ============================================
  // Utilities
  // ============================================

  /**
   * Register a domain module (for initialization)
   */
  registerDomainModule(module: DomainDiagnosticModule): void {
    this.domainModules.set(module.domain, module);
  }

  /**
   * List available domains
   */
  getAvailableDomains(): string[] {
    return Array.from(this.domainModules.keys());
  }
}

export const retrievalService = new RetrievalService();
