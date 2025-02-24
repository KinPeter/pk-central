import { GenerateContentRequest, GenerativeModel, GoogleGenerativeAI, Tool } from '@google/generative-ai';
import { AiManager } from './ai-manager';
import { getEnv } from './environment';

export class GeminiManager implements AiManager {
  private model: GenerativeModel | null = null;

  constructor() {
    this.init();
  }

  public async generate(input: GenerateContentRequest): Promise<any> {
    if (!this.model) {
      throw new Error('Gemini AI model is not initialized');
    }
    return await this.model.generateContent(input);
  }

  private init(): void {
    const [GEMINI_API_KEY] = getEnv('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Missing Gemini API Key');
    }
    const genAi = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = genAi.getGenerativeModel({
      model: 'gemini-2.0-flash',
      tools: [{ googleSearch: {} } as unknown as Tool],
    });
  }
}
