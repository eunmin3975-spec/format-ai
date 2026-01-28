
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateResponse(userInput: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userInput,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.8,
          topP: 0.95,
        },
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "시스템 복구 중 치명적인 오류가 발생했습니다. 로그를 재점검하십시오. \n\n error_code: 0x800401";
    }
  }
}

export const geminiService = new GeminiService();
