import { FileReference, EmbeddingChunk, LocalMemoryIndex, PortableIdentity, UserPermissions } from '../types';

/**
 * LocalFileService: Operates over user-owned files respecting ownership boundary
 * 
 * CRITICAL RULE: Guru never becomes the canonical holder of user memory.
 * 
 * This service:
 * - Reads user's files from their device
 * - Never uploads raw content
 * - Only stores embeddings + references locally
 * - Respects OS permissions
 * - Builds semantic graph over user's data
 */

export class LocalFileService {
  private allowedPaths: string[] = [];
  private excludedPatterns: string[] = [];
  private watchEnabled = false;

  /**
   * Initialize with user permissions
   */
  async initialize(permissions: UserPermissions, identity: PortableIdentity): Promise<void> {
    this.allowedPaths = permissions.allowedPaths;
    this.excludedPatterns = permissions.exclusionPatterns || [];
    this.watchEnabled = permissions.watchForChanges;

    // TODO: Set up file watchers if enabled
    // TODO: Verify OS permissions
    // TODO: Initialize local index path
  }

  /**
   * Read file respecting permission boundary
   */
  async readFileIfAllowed(path: string): Promise<Buffer | null> {
    // Security check 1: Is this path in allowed list?
    if (!this.isPathAllowed(path)) {
      console.warn(`Path not allowed: ${path}`);
      return null;
    }

    // Security check 2: Does it match exclusion pattern?
    if (this.matchesExclusion(path)) {
      console.warn(`Path matches exclusion pattern: ${path}`);
      return null;
    }

    // Security check 3: Can we read it (OS permissions)?
    // TODO: Verify OS-level read permission
    
    try {
      // TODO: Use fs.readFile or equivalent
      // For now, placeholder
      console.log(`Reading file: ${path}`);
      return Buffer.from('placeholder');
    } catch (error) {
      console.error(`Cannot read file: ${path}`, error);
      return null;
    }
  }

  /**
   * Create file reference (metadata only, no content)
   */
  async createFileReference(path: string): Promise<FileReference | null> {
    const buffer = await this.readFileIfAllowed(path);
    if (!buffer) return null;

    const hash = this.hashContent(buffer);
    
    return {
      path,
      readable: true,
      contentHash: hash,
      modifiedAt: Date.now(),
      type: this.detectFileType(path),
      language: this.detectLanguage(path),
      sizeBytes: buffer.length,
    };
  }

  /**
   * Convert file content to chunks (no raw storage)
   */
  async chunkFile(fileRef: FileReference): Promise<Array<{
    content: string;
    startLine?: number;
    endLine?: number;
  }> | null> {
    const buffer = await this.readFileIfAllowed(fileRef.path);
    if (!buffer) return null;

    const content = buffer.toString('utf-8');
    const chunks: Array<{ content: string; startLine?: number; endLine?: number }> = [];

    if (fileRef.type === 'code') {
      // Chunk by function/class for code
      // TODO: Parse and extract functions/classes
      chunks.push({
        content: content.substring(0, 500),  // Placeholder
        startLine: 1,
        endLine: 20,
      });
    } else if (fileRef.type === 'document') {
      // Chunk by paragraph for documents
      const paragraphs = content.split('\n\n');
      let lineNum = 1;
      paragraphs.forEach(para => {
        chunks.push({
          content: para,
          startLine: lineNum,
          endLine: lineNum + para.split('\n').length,
        });
        lineNum += para.split('\n').length + 1;
      });
    } else {
      // Default: chunk by size
      const chunkSize = 1000;
      for (let i = 0; i < content.length; i += chunkSize) {
        chunks.push({
          content: content.substring(i, i + chunkSize),
        });
      }
    }

    return chunks;
  }

  /**
   * Build semantic graph from files (linking chunks)
   */
  async buildSemanticGraph(index: LocalMemoryIndex): Promise<Map<string, string[]>> {
    // TODO: Implement relationship detection
    // For now, placeholder
    const graph = new Map<string, string[]>();

    index.chunks.forEach(chunk => {
      // Find related chunks
      const related = index.chunks.filter(other =>
        other.id !== chunk.id &&
        other.source.path === chunk.source.path  // Same file
      );
      graph.set(chunk.id, related.map(r => r.id));
    });

    return graph;
  }

  /**
   * Watch for file changes (respects permissions)
   */
  setupFileWatcher(callback: (event: 'add' | 'change' | 'delete', path: string) => void): void {
    if (!this.watchEnabled) {
      console.log('File watching disabled');
      return;
    }

    // TODO: Implement file watcher using chokidar or fs.watch
    // Only watch allowed paths
    // Call callback only for non-excluded files
  }

  /**
   * Detect file type from path
   */
  private detectFileType(path: string): FileReference['type'] {
    const codeExtensions = ['.js', '.ts', '.py', '.java', '.go', '.rs', '.c', '.cpp'];
    const docExtensions = ['.md', '.txt', '.pdf', '.doc', '.docx'];
    const chatExtensions = ['.chat', '.conversation'];

    const ext = path.substring(path.lastIndexOf('.')).toLowerCase();

    if (codeExtensions.includes(ext)) return 'code';
    if (docExtensions.includes(ext)) return 'document';
    if (chatExtensions.includes(ext)) return 'chat';
    return 'other';
  }

  /**
   * Detect programming language
   */
  private detectLanguage(path: string): string | undefined {
    const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
    const map: Record<string, string> = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.md': 'markdown',
    };
    return map[ext];
  }

  /**
   * Hash content (for integrity checking)
   */
  private hashContent(buffer: Buffer): string {
    // TODO: Use crypto.createHash('sha256')
    // For now, placeholder
    return `hash_${buffer.length}`;
  }

  /**
   * Check if path is in allowed list
   */
  private isPathAllowed(path: string): boolean {
    return this.allowedPaths.some(allowed =>
      path.startsWith(allowed)
    );
  }

  /**
   * Check if path matches exclusion pattern
   */
  private matchesExclusion(path: string): boolean {
    return this.excludedPatterns.some(pattern => {
      // TODO: Implement glob pattern matching
      return path.includes(pattern);
    });
  }

  /**
   * Get all indexable files in allowed paths
   */
  async discoverFiles(): Promise<FileReference[]> {
    const files: FileReference[] = [];

    for (const allowedPath of this.allowedPaths) {
      // TODO: Recursively scan directory
      // TODO: Filter by exclusion patterns
      // TODO: Create FileReference for each
    }

    return files;
  }
}

export const localFileService = new LocalFileService();
