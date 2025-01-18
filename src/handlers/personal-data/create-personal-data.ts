import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { personalDataSchema } from '../../../common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';
import { toPersonalDataRequest } from '../../utils/request-mappers';
import { DbCollection } from '../../utils/collections';

export async function createPersonalData(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await createItemHandler(
    req,
    dbManager,
    authManager,
    DbCollection.PERSONAL_DATA,
    personalDataSchema,
    toPersonalDataRequest
  );
}
