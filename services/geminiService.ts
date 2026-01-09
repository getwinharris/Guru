import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { GroundingSource, ThinkerNotes, SourceSignal, Node3D } from "../types";
import { recallService } from "./recallService";

export class GuruService {
  private get aiInstance() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * FEATURE: Fast AI responses using gemini-flash-lite-latest
   */
  async fastChat(prompt: string): Promise<string> {
    const ai = this.aiInstance;
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });
    return response.text || "";
  }

  /**
   * FEATURE: Transcribe audio using gemini-3-flash-preview
   */
  async transcribeAudio(base64Audio: string): Promise<string> {
    const ai = this.aiInstance;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType: 'audio/wav' } },
          { text: "Transcribe this audio accurately. Only return the transcribed text." }
        ]
      }
    });
    return response.text || "";
  }

  /**
   * FEATURE: Academic Thinking Mode (Perplexity Academic Gap)
   */
  private async think(prompt: string, history: string, activeSources: SourceSignal[]): Promise<{
    notes: ThinkerNotes;
    sources: GroundingSource[];
  }> {
    const ai = this.aiInstance;
    
    // Explicit academic instruction to close the gap with Perplexity Academic
    const systemInstruction = `ROLE: GURU_ACADEMIC_THINKER. 
    TASK: Perform multi-stage research synthesis. 
    GROUNDING_PRIORITY: ArXiv, HuggingFace, GitHub, Academic Papers, Documentation. 
    RULES: Look for peer-reviewed signals. Verify citations. 
    OUTPUT: A structured JSON ThinkerNote for the Speaker node.
    CONTEXT: ${history}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: "user", parts: [{ text: `QUERY: ${prompt}` }] }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            groundingConfidence: { type: Type.NUMBER },
            sourceVerification: { type: Type.ARRAY, items: { type: Type.STRING } },
            contradictionsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            synthesisStrategy: { type: Type.STRING },
            suggestedTools: { type: Type.ARRAY, items: { type: Type.STRING } },
            knowledgeGraphNodes: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["groundingConfidence", "synthesisStrategy", "knowledgeGraphNodes"]
        }
      }
    });

    const notes = JSON.parse(response.text || "{}");
    const groundingSources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
        type: 'web' as const,
        relevance: 1,
        snippet: c.web.title // Mock snippet
      }));

    return { notes, sources: groundingSources };
  }

  /**
   * FEATURE: Tutor Orchestration (TutorAI Gap)
   */
  async process(prompt: string, userId: string, mediaParts: any[] = []): Promise<any> {
    const history = await recallService.getContextString(userId, prompt);
    const { notes, sources } = await this.think(prompt, history, []);
    
    const ai = this.aiInstance;
    const speakerResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: "user", parts: [{ text: prompt }, ...mediaParts] }],
      config: {
        systemInstruction: `ROLE: GURU_SPEAKER. ACT AS: High-Level Tutor. 
        TASK: Synthesize complex info into accessible roadmaps. 
        FORMAT: Academic, encouraging, grounded. 
        USE_NOTES: ${JSON.stringify(notes)}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            englishSubtitle: { type: Type.STRING },
            guidedQuestion: { type: Type.STRING },
            visualHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["image", "icon", "formula", "diagram", "flashcard", "simulation"] },
                  data: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["keyword", "type", "data"]
              }
            }
          },
          required: ["content", "englishSubtitle", "visualHighlights"]
        }
      }
    });

    const result = JSON.parse(speakerResponse.text || "{}");
    
    // Wire knowledge graph nodes to 3D Spacial Data (TutorAI Visualization Gap)
    const nodes: Node3D[] = (notes.knowledgeGraphNodes || []).map((n: string, i: number) => ({
      id: `node-${i}`,
      label: n,
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      z: (Math.random() - 0.5) * 500,
      type: 'concept'
    }));

    return { ...result, sources, thinkerNotes: notes, spacialData: { nodes, links: [] } };
  }

  async generateSpeech(text: string) {
    const ai = this.aiInstance;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }

  async generateImage(prompt: string, aspectRatio: string = "1:1", imageSize: string = "1K") {
    const ai = this.aiInstance;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: imageSize as any } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  }

  async generateVideo(prompt: string, imageBase64?: string) {
    const ai = this.aiInstance;
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      image: imageBase64 ? { imageBytes: imageBase64, mimeType: 'image/png' } : undefined,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async editImage(base64Image: string, prompt: string) {
    const ai = this.aiInstance;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  }

  async mapsSearch(query: string, lat?: number, lng?: number) {
    const ai = this.aiInstance;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: lat && lng ? { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } : undefined
      }
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  }
}

export const guruService = new GuruService();