/**
 * Guru Backend Connector
 * 
 * Bridges TypeScript services to the native Guru Backend (OpenWebUI extended with Guru routes).
 * Provides type-safe wrappers around Guru's Python backend endpoints.
 * 
 * Architecture:
 * - TypeScript frontend/services call guruBackendConnector
 * - guruBackendConnector calls openWebUIAdapter (with Guru-specific endpoints)
 * - openWebUIAdapter calls Guru Backend (localhost:8000 or configured URL)
 * - Guru Backend orchestrates diagnostic services
 */

import { openWebUIAdapter } from "./openWebUIAdapter";

export interface DiagnosticSessionRequest {
  userId: string;
  domain: string;
  problemDescription: string;
}

export interface DiagnosticSessionResponse {
  status: string;
  sessionId: string;
  stage: string;
  domain: string;
}

export interface ObservationRequest {
  sessionId: string;
  observation: string;
}

export interface ObservationResponse {
  stage: string;
  status: string;
  classification?: string;
  similarPastProblems: number;
  nextStage: string;
  nextPrompt: string;
}

export interface BaselineRequest {
  sessionId: string;
  baseline: {
    whatWorks: string;
    constraints: string;
    affectedAreas: string[];
  };
}

export interface BaselineResponse {
  stage: string;
  status: string;
  questionsGenerated: number;
  nextStage: string;
  questions: Array<{
    id: string;
    text: string;
    priority?: string;
  }>;
}

export interface AnswerRequest {
  sessionId: string;
  questionId: string;
  answer: string;
}

export interface AnswerResponse {
  status: string;
  nextAction: "ask" | "frame" | "guide";
  nextQuestion?: any;
  message?: string;
}

export interface FrameResponse {
  stage: string;
  status: string;
  frame: {
    primaryType: string;
    isntType: string[];
    rootCauseCategory: string;
    reasoning: string;
    confidence: number;
    nextSteps: string[];
  };
  nextStage: string;
  nextPrompt: string;
}

export interface GuideResponse {
  stage: string;
  status: string;
  guidance: Array<{
    step: number;
    action: string;
    why: string;
    expectedOutcome: string;
    troubleIfFails: string;
  }>;
  nextStage: string;
  nextPrompt: string;
}

/**
 * Guru Backend Connector
 */
export class GuruBackendConnector {
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:8000") {
    this.baseURL = baseURL;
  }

  // ========================================================================
  // DIAGNOSTIC SESSION MANAGEMENT
  // ========================================================================

  async createDiagnosticSession(
    request: DiagnosticSessionRequest
  ): Promise<DiagnosticSessionResponse> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/diagnostic/session/create`,
      "POST",
      request
    );
  }

  async recordObservation(
    request: ObservationRequest
  ): Promise<ObservationResponse> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/diagnostic/observe`,
      "POST",
      request
    );
  }

  async recordBaseline(request: BaselineRequest): Promise<BaselineResponse> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/diagnostic/baseline`,
      "POST",
      request
    );
  }

  async answerQuestion(request: AnswerRequest): Promise<AnswerResponse> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/diagnostic/answer`,
      "POST",
      request
    );
  }

  async getFrame(sessionId: string): Promise<FrameResponse> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/diagnostic/frame`,
      "POST",
      { sessionId }
    );
  }

  async getGuidance(sessionId: string): Promise<GuideResponse> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/diagnostic/guide`,
      "POST",
      { sessionId }
    );
  }

  // ========================================================================
  // RETRIEVAL
  // ========================================================================

  async queryUserHistory(
    userId: string,
    domain: string,
    query: string
  ): Promise<any> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/retrieval/query`,
      "POST",
      {
        userId,
        domain,
        query,
      }
    );
  }

  async indexUserFiles(
    userId: string,
    files: string[],
    userConsent: boolean = false
  ): Promise<any> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/retrieval/index`,
      "POST",
      {
        userId,
        files,
        userConsent,
      }
    );
  }

  async listDiagnosticDomains(): Promise<any> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/retrieval/domains`,
      "GET"
    );
  }

  // ========================================================================
  // MODELS
  // ========================================================================

  async listModels(): Promise<any> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/models/list`,
      "GET"
    );
  }

  async switchModel(modelId: string): Promise<any> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/models/switch`,
      "POST",
      { modelId }
    );
  }

  async generateInference(prompt: string, options: any = {}): Promise<any> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/models/generate`,
      "POST",
      {
        prompt,
        options,
      }
    );
  }

  // ========================================================================
  // HEALTH
  // ========================================================================

  async healthCheck(): Promise<any> {
    return await openWebUIAdapter.fetchJson(
      `${this.baseURL}/api/guru/health`,
      "GET"
    );
  }
}

/**
 * Singleton instance
 */
let connectorInstance: GuruBackendConnector | null = null;

export function getGuruBackendConnector(
  baseURL?: string
): GuruBackendConnector {
  if (!connectorInstance) {
    connectorInstance = new GuruBackendConnector(
      baseURL || process.env.GURU_BACKEND_URL || "http://localhost:8000"
    );
  }
  return connectorInstance;
}

export default GuruBackendConnector;
