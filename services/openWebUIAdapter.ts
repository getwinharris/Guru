/**
 * OpenWebUI Adapter
 *
 * Thin, auditable HTTP client to talk to a local or remote OpenWebUI backend.
 * Enforces ownership rules: no raw-file upload without explicit user consent.
 */

const DEFAULT_BASE = process.env.OPENWEBUI_BASE_URL || "http://localhost:3000";

export interface OpenWebUIAdapterOptions {
  baseUrl?: string;
  apiToken?: string; // optional if backend requires auth
}

export class OpenWebUIAdapter {
  private baseUrl: string;
  private token?: string;

  constructor(opts: OpenWebUIAdapterOptions = {}) {
    this.baseUrl = opts.baseUrl || DEFAULT_BASE;
    this.token = opts.apiToken || process.env.OPENWEBUI_API_TOKEN;
  }

  private headers() {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (this.token) h["Authorization"] = `Bearer ${this.token}`;
    return h;
  }

  private async fetchJson(path: string, method = "POST", body?: any) {
    const url = this.baseUrl.replace(/\/$/, "") + path;
    const res = await fetch(url, {
      method,
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenWebUI error ${res.status}: ${text}`);
    }
    return res.json();
  }

  // Generate text (calls backend generate/chat endpoints)
  async generate(model: string, prompt: string, options: any = {}) {
    return this.fetchJson(`/api/generate`, "POST", {
      model,
      prompt,
      options,
    });
  }

  // Ask the backend to embed a text (server-side embedding)
  async embed(model: string, text: string) {
    return this.fetchJson(`/api/embeddings`, "POST", { model, input: text });
  }

  // Query a vector collection by text (server will embed and query)
  async queryByText(collection: string, text: string, topK = 5) {
    return this.fetchJson(`/api/retrieval/query`, "POST", {
      collection,
      query: text,
      top_k: topK,
    });
  }

  // Upsert chunks into a collection. Requires explicit user consent to send content
  async upsertChunks(collection: string, chunks: Array<{ id: string; text: string; metadata?: any }>, userConsent = false) {
    if (!userConsent) {
      throw new Error("User consent required to upload chunks to remote vector DB");
    }
    return this.fetchJson(`/api/retrieval/upsert`, "POST", { collection, chunks });
  }

  // Analyze image via multimodal endpoint (consent required for sending image bytes)
  async analyzeImage(model: string, imageBase64: string, prompt?: string, userConsent = false) {
    if (!userConsent) throw new Error("User consent required to send image to remote server");
    return this.fetchJson(`/api/retrieval/analyze_image`, "POST", { model, image: imageBase64, prompt });
  }

  // Health check
  async health() {
    const url = this.baseUrl.replace(/\/$/, "") + "/api/status";
    const res = await fetch(url, { headers: this.headers() });
    return res.ok;
  }
}

let singleton: OpenWebUIAdapter | null = null;
export function getOpenWebUIAdapter(): OpenWebUIAdapter {
  if (!singleton) singleton = new OpenWebUIAdapter();
  return singleton;
}

export default OpenWebUIAdapter;
