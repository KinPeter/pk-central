import { TranslationRequest, TranslationResponse, translationSchema } from '../../../common';
import { AuthManager } from '../../utils/auth-manager';
import { DbCollection } from '../../utils/collections';
import { HttpClient } from '../../utils/http-client';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { DeeplTranslationResponse, SharedKeys, sourceLanguages, targetLanguages } from '../../utils/third-parties';

export async function translate(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  httpClient: HttpClient
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = (await req.json()) as TranslationRequest;

    try {
      await translationSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { text, targetLang, sourceLang } = requestBody;

    const sharedKeysCollection = db.collection<SharedKeys>(DbCollection.SHARED_KEYS);
    const keys = await sharedKeysCollection.findOne();
    const deeplApiKey = keys?.deeplApiKey;
    if (!deeplApiKey) return new NotFoundErrorResponse('DeepL API key');

    const url = process.env.PROXY_DEEPL_TRANSLATE_URL;
    httpClient.setHeaders({
      'Content-Type': 'application/json',
      Authorization: `DeepL-Auth-Key ${deeplApiKey}`,
    });
    const deeplResponse = await httpClient.post<DeeplTranslationResponse>(url!, {
      text: [text],
      target_lang: targetLanguages[targetLang],
      source_lang: sourceLanguages[sourceLang],
    });

    const result: TranslationResponse = {
      original: text,
      translation: deeplResponse.translations.map(({ text }) => text).join(' '),
      targetLang,
      sourceLang,
    };

    return new OkResponse(result);
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
