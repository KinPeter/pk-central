import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, ErrorResponse, MethodNotAllowedResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { createInitialData } from '../src/handlers/cycling/create-initial-data';
import { getCycling } from '../src/handlers/cycling/get-cycling';
import { updateWeeklyGoal } from '../src/handlers/cycling/update-weekly-goal';
import { updateMonthlyGoal } from '../src/handlers/cycling/update-monthly-goal';
import { addChore } from '../src/handlers/cycling/add-chore';
import { updateChore } from '../src/handlers/cycling/update-chore';
import { deleteChore } from '../src/handlers/cycling/delete-chore';

export const config: Config = {
  path: ['/cycling', '/cycling/:operation', '/cycling/:operation/:id'],
  method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation, id } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (operation) {
    case undefined:
      return await getCycling(req, dbManager, authManager);
    case 'initialize':
      return await createInitialData(req, dbManager, authManager);
    case 'weekly-goal':
      return await updateWeeklyGoal(req, dbManager, authManager);
    case 'monthly-goal':
      return await updateMonthlyGoal(req, dbManager, authManager);
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
      return new ErrorResponse(`Unknown operation: /cycling/${operation}`, 400);
  }
};
