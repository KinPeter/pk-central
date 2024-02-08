import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { personalDataSchema, UUID } from 'pk-common';
import { updateItemHandler } from '../_base-crud-handlers/update-handler';
import { toPersonalDataRequest } from '../../utils/request-mappers';

export async function updatePersonalData(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await updateItemHandler(
    req,
    id,
    dbManager,
    authManager,
    'personal-data',
    personalDataSchema,
    toPersonalDataRequest,
    'Personal data'
  );
}
