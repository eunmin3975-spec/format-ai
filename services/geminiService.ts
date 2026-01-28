import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

// Vite가 인식할 수 있는 유일한 방식입니다.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // 키가 비어있는지 콘솔에서 확인할 수 있게 에러 처리를 넣었습니다.
    if (!apiKey) {
      console.error("Vercel에서 VITE_GEMINI_API_KEY를 설정했는지 확인하세요!");
    }
    this.ai = new GoogleGenAI(apiKey || "");
  }

  async generateResponse(userInput: string) {
    try {
      const model = this.ai.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: SYSTEM_PROMPT 
      });
      const result = await model.generateContent(userInput);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "시스템 복구 중 오류가 발생했습니다. 키 설정을 확인하십시오.";
    }
  }
}

export const geminiService = new GeminiService();
