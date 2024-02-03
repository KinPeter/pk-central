import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response.js';
import { NoteRequest, Note, noteSchema } from 'pk-common';
import { v4 as uuid } from 'uuid';
import { omitIdsForOne } from '../../utils/omit-ids.js';

export async function createNote(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody: NoteRequest = await req.json();

    try {
      await noteSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Note>('notes');

    const newNote = {
      id: uuid(),
      userId: user.id,
      createdAt: new Date(),
      ...requestBody,
    };

    await collection.insertOne(newNote);

    return new OkResponse(omitIdsForOne(newNote), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
