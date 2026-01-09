import { EmbeddingChunk, FileReference, LocalMemoryIndex } from '../types';

/**
 * LocalEmbeddingService: Generate and store embeddings locally
 * 
 * CRITICAL: Never uploads raw content to remote servers.
 * All embeddings computed locally on user's device.
 */

export class LocalEmbeddingService {
  // TODO: Initialize local embedding model (e.g., Ollama, LlamaCpp)
  // Options:
  // - all-MiniLM-L6-v2 (small, fast)
  // - nomic-embed-text (medium)
  // - sentence-transformers models
  
  private modelName: string = 'all-MiniLM-L6-v2';
  private embeddingDim: number = 384;

  /**
   * Embed a chunk of text locally (never upload)
   */
  async embedChunk(chunk: {
    content: string;
    source: FileReference;
    chunkType: string;
  }): Promise<EmbeddingChunk> {
    // TODO: Call local embedding model
    // Placeholder: return zero vector
    const vector = new Array(this.embeddingDim).fill(0);

    return {
      id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vector,
      contentHash: this.hashContent(chunk.content),
      source: {
        ...chunk.source,
      },
      chunkType: chunk.chunkType as any,
      embeddedAt: Date.now(),
      sourceReadAt: chunk.source.modifiedAt,
    };
  }

  /**
   * Build index from file chunks (all local)
   */
  async buildIndex(
    chunks: Array<{ content: string; source: FileReference; chunkType: string }>,
    userId: string,
    deviceId: string
  ): Promise<LocalMemoryIndex> {
    const embeddedChunks: EmbeddingChunk[] = [];

    for (const chunk of chunks) {
      const embedded = await this.embedChunk(chunk);
      embeddedChunks.push(embedded);
    }

    const uniqueFiles = new Map<string, FileReference>();
    chunks.forEach(c => {
      uniqueFiles.set(c.source.path, c.source);
    });

    return {
      userId,
      deviceId,
      chunks: embeddedChunks,
      trackedFiles: Array.from(uniqueFiles.values()),
      conceptGraph: [],  // Will be built by semantic graph service
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0',
      sizeBytes: embeddedChunks.length * this.embeddingDim * 4,  // approximate
    };
  }

  /**
   * Update index when file changes (local)
   */
  async updateIndex(
    index: LocalMemoryIndex,
    changedFile: FileReference,
    newChunks: Array<{ content: string; chunkType: string }>
  ): Promise<LocalMemoryIndex> {
    // Remove old chunks from this file
    const filtered = index.chunks.filter(c => c.source.path !== changedFile.path);

    // Add new chunks
    const updated = [...filtered];
    for (const chunk of newChunks) {
      const embedded = await this.embedChunk({
        content: chunk.content,
        source: changedFile,
        chunkType: chunk.chunkType,
      });
      updated.push(embedded);
    }

    index.chunks = updated;
    index.updatedAt = Date.now();

    return index;
  }

  /**
   * Query index (semantic search, all local)
   */
  async query(index: LocalMemoryIndex, queryText: string, topK: number = 5): Promise<EmbeddingChunk[]> {
    // Embed the query locally
    const queryVector = await this.embedChunk({
      content: queryText,
      source: {
        path: 'query',
        readable: true,
        contentHash: '',
        modifiedAt: Date.now(),
        type: 'other',
      },
      chunkType: 'query',
    });

    // Score all chunks (cosine similarity)
    const scored = index.chunks.map(chunk => ({
      chunk,
      score: this.cosineSimilarity(queryVector.vector, chunk.vector),
    }));

    // Sort and return top-K
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.chunk);
  }

  /**
   * Save index locally (never upload)
   */
  async saveIndex(index: LocalMemoryIndex, path: string): Promise<void> {
    // TODO: Serialize index to file (JSON or binary)
    // Store at user-controlled path
    console.log(`Saving index to ${path}`);
    // JSON.stringify(index) → write to path
  }

  /**
   * Load index locally
   */
  async loadIndex(path: string): Promise<LocalMemoryIndex | null> {
    // TODO: Deserialize index from file
    console.log(`Loading index from ${path}`);
    // read from path → JSON.parse
    return null;
  }

  /**
   * Helper: Cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (magA * magB);
  }

  /**
   * Helper: Hash content
   */
  private hashContent(content: string): string {
    // TODO: Use crypto.createHash('sha256')
    // For now, simple hash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;  // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Get embedding model info
   */
  getModelInfo(): { name: string; dimension: number } {
    return {
      name: this.modelName,
      dimension: this.embeddingDim,
    };
  }

  /**
   * Check if local embeddings are available
   */
  async isReady(): Promise<boolean> {
    // TODO: Test if embedding model can be loaded
    // Try loading model and return true/false
    return true;  // Placeholder
  }
}

export const localEmbeddingService = new LocalEmbeddingService();
