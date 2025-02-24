import { GenerateContentRequest } from '@google/generative-ai';
import { AiManager } from '../../utils/ai-manager';
import { AuthManager } from '../../utils/auth-manager';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';

export async function promptGemini(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  aiManager: AiManager
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = (await req.json()) as GenerateContentRequest;

    const result = await aiManager.generate(requestBody);

    return new OkResponse(result);
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
