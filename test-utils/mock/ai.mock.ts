import { jest } from '@jest/globals';
import { AiManager } from '../../src/utils/ai-manager';

export class MockAiManager implements AiManager {
  generate = jest.fn<(input: any) => Promise<any>>();
}
