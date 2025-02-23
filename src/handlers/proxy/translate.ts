import { TranslationRequest, TranslationResponse, translationSchema } from '../../../common';
import { AuthManager } from '../../utils/auth-manager';
import { getEnv } from '../../utils/environment';
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
import { DeeplTranslationResponse, sourceLanguages, targetLanguages } from '../../utils/third-parties';

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

    const [DEEPL_API_KEY, PROXY_DEEPL_TRANSLATE_URL] = getEnv('DEEPL_API_KEY', 'PROXY_DEEPL_TRANSLATE_URL');
    if (!DEEPL_API_KEY) return new NotFoundErrorResponse('DeepL API key');

    const url = PROXY_DEEPL_TRANSLATE_URL;
    httpClient.setHeaders({
      'Content-Type': 'application/json',
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
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
