import type { Config, Context } from '@netlify/functions';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { getNotes } from '../src/handlers/notes/get-notes';
import { createNote } from '../src/handlers/notes/create-note';
import { updateNote } from '../src/handlers/notes/update-note';
import { deleteNote } from '../src/handlers/notes/delete-note';

export const config: Config = {
  path: ['/notes', '/notes/:id'],
  method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { id } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (req.method) {
    case 'GET':
      return await getNotes(req, dbManager, authManager);
    case 'POST':
      return await createNote(req, dbManager, authManager);
    case 'PUT':
      return await updateNote(req, id, dbManager, authManager);
    case 'DELETE':
      return await deleteNote(req, id, dbManager, authManager);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
};
