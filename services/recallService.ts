
import { RecallThread, KnowledgePatch } from '../types';

class RecallService {
  private threads: Map<string, RecallThread> = new Map();
  private STORAGE_KEY = 'GURU_RECALL_V3';

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([uid, thread]) => {
        this.threads.set(uid, thread as RecallThread);
      });
    }
  }

  private save() {
    const data = Object.fromEntries(this.threads);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async getThread(userId: string): Promise<RecallThread> {
    if (!this.threads.has(userId)) {
      this.threads.set(userId, {
        userId,
        lastRecallTime: Date.now(),
        patches: [],
        retentionPolicy: 'standard'
      });
      this.save();
    }
    return this.threads.get(userId)!;
  }

  async addPatch(userId: string, patch: Omit<KnowledgePatch, 'id' | 'timestamp'>) {
    const thread = await this.getThread(userId);
    const newPatch: KnowledgePatch = {
      ...patch,
      id: `patch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now()
    };
    thread.patches.push(newPatch);
    thread.lastRecallTime = Date.now();
    this.save();
    console.debug(`[Recall Engine] Grounded Bi-directional context: ${newPatch.id} type: ${newPatch.type}`);
  }

  /**
   * Directional Semantic Search
   * Combines keyword relevance with temporal decay and type-based weighting.
   */
  async searchRecall(userId: string, query: string, limit: number = 12): Promise<KnowledgePatch[]> {
    const thread = await this.getThread(userId);
    if (thread.patches.length === 0) return [];

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\W+/).filter(w => w.length > 2);

    const scored = thread.patches.map(patch => {
      let score = 0;
      const contentLower = patch.content.toLowerCase();

      // 1. Keyword Relevance (Semantic Base)
      queryWords.forEach(word => {
        if (contentLower.includes(word)) score += 10;
        // Boost if word is in the first 50 chars
        if (contentLower.indexOf(word) < 50) score += 5;
      });

      // 2. Type-based Weighting (Importance)
      switch (patch.type) {
        case 'preference': score += 25; break; // Highest: User likes/dislikes
        case 'concept':    score += 15; break; // High: Stable definitions
        case 'artifact':   score += 10; break; // Medium: Flashcards for reuse
        case 'fact':       score += 5;  break; // Low: General chat facts
        default:           score += 0;
      }

      // 3. Recency Decay (Directional: Prioritize fresh memory)
      const ageMs = Date.now() - patch.timestamp;
      const ageInDays = ageMs / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(0, 20 - ageInDays); // Extra points for recent patches
      score += recencyBoost;

      return { patch, score };
    });

    // Sort by descending score and return top results
    return scored
      .sort((a, b) => b.score - a.score)
      .filter(s => s.score > 5) // Only return "somewhat relevant" items
      .slice(0, limit)
      .map(s => s.patch);
  }

  async getContextString(userId: string, query: string): Promise<string> {
    const patches = await this.searchRecall(userId, query);
    if (patches.length === 0) return "No relevant history found.";
    
    return patches.map(p => `[${p.type.toUpperCase()} | ${new Date(p.timestamp).toLocaleDateString()}] ${p.content}`).join('\n');
  }
}

export const recallService = new RecallService();
