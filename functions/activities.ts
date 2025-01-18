import { Config, Context } from '../server/types';
import { CorsOkResponse, MethodNotAllowedResponse, UnknownOperationErrorResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { updateGoals } from '../src/handlers/activities/update-goals';
import { getActivities } from '../src/handlers/activities/get-activities';
import { createInitialData } from '../src/handlers/activities/create-initial-data';
import { addChore } from '../src/handlers/activities/add-chore';
import { updateChore } from '../src/handlers/activities/update-chore';
import { deleteChore } from '../src/handlers/activities/delete-chore';

export const config: Config = {
  path: ['/activities', '/activities/:operation', '/activities/:operation/:id'],
  method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation, id } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (operation) {
    case undefined:
      return await getActivities(req, dbManager, authManager);
    case 'initialize':
      return await createInitialData(req, dbManager, authManager);
    case 'goals':
      return await updateGoals(req, dbManager, authManager);
    case 'chore':
      if (!id) {
        return await addChore(req, dbManager, authManager);
      }
      if (req.method === 'PUT') {
        return await updateChore(req, id, dbManager, authManager);
      } else if (req.method === 'DELETE') {
        return await deleteChore(req, id, dbManager, authManager);
      } else {
        return new MethodNotAllowedResponse(req.method);
      }
    default:
      return new UnknownOperationErrorResponse(`/activities/${operation}`);
  }
};
