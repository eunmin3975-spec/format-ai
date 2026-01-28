
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // 이 부분을 수정했습니다. Vercel에 설정한 VITE_GEMINI_API_KEY를 불러옵니다.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.ai = new GoogleGenAI(apiKey);
  }

  async generateResponse(userInput: string) {
    try {
      const model = this.ai.getGenerativeModel({ 
        model: "gemini-1.5-flash", // 최신 모델명으로 업데이트했습니다.
        systemInstruction: SYSTEM_PROMPT 
      });

      const result = await model.generateContent(userInput);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "시스템 복구 중 치명적인 오류가 발생했습니다. 로그를 재점검하십시오. \n\n error_code: 0x800401";
    }
  }
}

export const geminiService = new GeminiService();
