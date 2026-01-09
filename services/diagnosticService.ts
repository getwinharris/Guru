import { DiagnosticSession, DiagnosticStage, ObservationData, BaselineData, UserDiagnosticProfile, MentorAction, DiagnosticQuestion, ProblemFrame } from '../types';

/**
 * DiagnosticService: Core mentor loop engine
 * 
 * Orchestrates the six-stage diagnostic process:
 * 1. OBSERVE - gather evidence
 * 2. BASELINE - understand current state
 * 3. QUESTIONS - narrow possibilities
 * 4. PAIN_POINTS - identify blockers
 * 5. FRAME - categorize problem
 * 6. GUIDE - recommend actions
 */

export class DiagnosticService {
  private sessions: Map<string, DiagnosticSession> = new Map();

  /**
   * Create a new diagnostic session
   */
  createSession(userId: string, threadId: string, domain: string): DiagnosticSession {
    const session: DiagnosticSession = {
      id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      threadId,
      stage: 'observe',
      domain,
      observation: {
        description: '',
        evidence: [],
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get current session
   */
  getSession(sessionId: string): DiagnosticSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Record observation (STAGE 1)
   */
  recordObservation(sessionId: string, observation: ObservationData): DiagnosticSession {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.observation = observation;
    session.updatedAt = Date.now();

    // Auto-advance to next stage if observation is sufficient
    if (this.isObservationSufficient(observation)) {
      session.stage = 'baseline';
    }

    return session;
  }

  /**
   * Record baseline (STAGE 2)
   */
  recordBaseline(sessionId: string, baseline: BaselineData): DiagnosticSession {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.baseline = baseline;
    session.updatedAt = Date.now();
    session.stage = 'questions';

    return session;
  }

  /**
   * Generate clarifying questions (STAGE 3)
   */
  async generateQuestions(sessionId: string, userProfile?: UserDiagnosticProfile): Promise<DiagnosticQuestion[]> {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    // TODO: Integrate with classifier to determine problem type
    // TODO: Query diagnostic tree for domain
    // TODO: Filter questions based on user skill level
    // TODO: Limit to 3 primary questions

    const questions: DiagnosticQuestion[] = [
      // Placeholder - will be replaced with actual domain logic
      {
        id: 'q1',
        text: 'What is the primary symptom?',
        priority: 'primary',
        answerOptions: ['Error', 'Wrong output', 'No response', 'Other'],
        narrows: ['error_based', 'behavior_based'],
      },
    ];

    session.stage = 'pain_points';
    return questions;
  }

  /**
   * Identify pain points (STAGE 4)
   */
  async identifyPainPoints(sessionId: string, userResponses: Record<string, string>): Promise<DiagnosticSession> {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    // TODO: Parse responses to extract hidden constraints
    // TODO: Compare against typical pain points for domain
    // TODO: Identify assumptions vs. facts

    session.painPoints = [
      // Placeholder
      {
        id: 'p1',
        category: 'blocker',
        description: 'Time constraint identified',
        severity: 'high',
        identified: true,
      },
    ];

    session.stage = 'frame';
    return session;
  }

  /**
   * Frame the problem (STAGE 5)
   */
  async frameProblem(sessionId: string): Promise<ProblemFrame> {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    // TODO: Use classifier to map observation + baseline + pain points → problem type
    // TODO: Query domain rules
    // TODO: Generate reframe explanation
    // TODO: Return frame for user confirmation

    const frame: ProblemFrame = {
      primaryType: 'unknown',
      isntType: [],
      rootCauseCategory: 'unclear',
      applicableDomainRules: [],
      reasoning: 'Analysis pending',
      confidence: 0.5,
    };

    session.problemFrame = frame;
    session.stage = 'guide';
    return frame;
  }

  /**
   * Determine next mentor action
   */
  async decideAction(sessionId: string): Promise<MentorAction> {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    // Decision tree logic:
    // IF baseline is unclear → ASK
    // ELSE IF problem framing is ambiguous → ASK DIAGNOSTIC
    // ELSE IF framing is clear but user didn't realize → EXPLAIN
    // ELSE IF user has all info but needs direction → GUIDE
    // ELSE IF stuck after guidance → LOOP_BACK

    if (!session.baseline) {
      return {
        type: 'ask',
        content: 'I need to understand your current situation better.',
        reasoning: 'Baseline data is incomplete',
      };
    }

    if (!session.problemFrame) {
      return {
        type: 'ask',
        content: 'Let me narrow down what kind of problem this is.',
        questions: await this.generateQuestions(sessionId, session.userProfile),
        reasoning: 'Problem type needs clarification',
      };
    }

    return {
      type: 'guide',
      content: 'Now let me guide you through the resolution.',
      guidance: [
        {
          stepNumber: 1,
          action: 'Check X',
          successCriteria: 'You see Y',
          failureHandling: 'Try Z next',
          verification: 'Report result',
        },
      ],
      reasoning: 'All diagnostic phases complete',
    };
  }

  /**
   * Helper: Check if observation has sufficient evidence
   */
  private isObservationSufficient(observation: ObservationData): boolean {
    return (
      observation.description.length > 20 &&
      observation.evidence.length > 0
    );
  }

  /**
   * Complete diagnostic session
   */
  completeSession(sessionId: string): DiagnosticSession {
    const session = this.getSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.stage = 'complete';
    session.completedAt = Date.now();
    return session;
  }

  /**
   * Get session summary for display
   */
  getSummary(sessionId: string): string {
    const session = this.getSession(sessionId);
    if (!session) return 'Session not found';

    return `
Diagnostic Session: ${session.domain}
Stage: ${session.stage}
Problem Type: ${session.problemType || 'Unclassified'}
Confidence: ${session.problemFrame?.confidence || 0}
Pain Points: ${session.painPoints?.length || 0}
    `.trim();
  }
}

export const diagnosticService = new DiagnosticService();
