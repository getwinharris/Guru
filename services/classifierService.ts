import { ObservationData, BaselineData, ProblemType, ConstraintInfo } from '../types';

/**
 * ClassifierService: Problem type identification
 * 
 * Maps observation + baseline → problem category
 * Identifies domain, root causes, and applicable rules
 */

export class ClassifierService {
  /**
   * Classify problem from evidence
   */
  async classifyProblem(
    domain: string,
    observation: ObservationData,
    baseline?: BaselineData
  ): Promise<{
    problemType: string;
    confidence: number;
    secondaryTypes: string[];
    rootCauseCategory: string;
    indicators: string[];
  }> {
    // TODO: Implement multi-signal classification
    // Signals:
    // 1. Keyword matching (observation text)
    // 2. Image analysis (if provided)
    // 3. File extension/content (if provided)
    // 4. Constraint analysis (from baseline)
    // 5. Historical patterns (from user profile)

    const indicators = this.extractIndicators(observation, baseline);
    const problemType = this.mapIndicatorsToProblemType(domain, indicators);
    const confidence = this.calculateConfidence(indicators);

    return {
      problemType,
      confidence,
      secondaryTypes: [],
      rootCauseCategory: this.categorizeRootCause(domain, problemType),
      indicators,
    };
  }

  /**
   * Extract indicators from observation and baseline
   */
  private extractIndicators(observation: ObservationData, baseline?: BaselineData): string[] {
    const indicators: string[] = [];

    // From observation text
    const text = observation.description.toLowerCase();
    if (text.includes('error')) indicators.push('has_error');
    if (text.includes('crash') || text.includes('hang')) indicators.push('system_failure');
    if (text.includes('slow') || text.includes('performance')) indicators.push('performance_issue');
    if (text.includes('won\'t') || text.includes('doesn\'t')) indicators.push('functionality_broken');

    // From baseline
    if (baseline) {
      if (baseline.whatWorks.length === 0) indicators.push('nothing_works');
      if (baseline.previousAttempts.length > 3) indicators.push('multiple_attempts');
      if (baseline.constraints.some(c => c.type === 'time' && c.severity === 'high')) {
        indicators.push('time_critical');
      }
    }

    return indicators;
  }

  /**
   * Map indicators to problem type
   */
  private mapIndicatorsToProblemType(domain: string, indicators: string[]): string {
    // Simple heuristic; should be replaced with ML classifier
    if (indicators.includes('has_error') && indicators.includes('system_failure')) {
      return 'crash_error';
    }
    if (indicators.includes('performance_issue')) {
      return 'performance';
    }
    if (indicators.includes('functionality_broken')) {
      return 'broken_functionality';
    }
    return 'unknown';
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(indicators: string[]): number {
    // More indicators = higher confidence
    const baseConfidence = 0.3;
    const perIndicator = 0.15;
    return Math.min(0.95, baseConfidence + indicators.length * perIndicator);
  }

  /**
   * Categorize root cause
   */
  private categorizeRootCause(domain: string, problemType: string): string {
    // TODO: Domain-specific categorization rules
    const mapping: Record<string, string> = {
      crash_error: 'error_handling',
      performance: 'resource_optimization',
      broken_functionality: 'logic_fault',
    };
    return mapping[problemType] || 'unknown';
  }

  /**
   * Identify constraints from baseline
   */
  extractConstraints(baseline: BaselineData): ConstraintInfo[] {
    const constraints: ConstraintInfo[] = [];

    // Example: Time-based constraints
    if (baseline.previousAttempts.length > 5) {
      constraints.push({
        type: 'time',
        value: 'limited - multiple attempts already made',
        severity: 'high',
      });
    }

    // Tool-based constraints
    const toolRegex = /tool|framework|library|platform/i;
    baseline.whatDoesntWork?.forEach(item => {
      if (toolRegex.test(item)) {
        constraints.push({
          type: 'tools',
          value: `Cannot use: ${item}`,
          severity: 'medium',
        });
      }
    });

    return constraints;
  }

  /**
   * Identify misconceptions or assumptions
   */
  detectMisconceptions(observation: ObservationData, baseline: BaselineData): string[] {
    const misconceptions: string[] = [];

    // Example: User assumes error is in component A when it's in B
    if (observation.description.includes('assume') || observation.description.includes('probably')) {
      misconceptions.push('User is making assumptions rather than verifying');
    }

    // Example: Tried solution X, Y, Z without understanding root cause
    if (baseline.previousAttempts.length > 3 && baseline.whatDoesntWork.length > 0) {
      misconceptions.push('Trying solutions without diagnosing root cause');
    }

    return misconceptions;
  }
}

export const classifierService = new ClassifierService();
