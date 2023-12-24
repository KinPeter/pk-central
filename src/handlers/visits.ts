import { Context } from '@netlify/functions';
import { Db } from 'mongodb';
import { User } from '../types/users.js';
import { ErrorResponse, MethodNotAllowedResponse, OkResponse } from '../utils/response.js';
import { VisitDocument } from '../types/visits.js';

export async function getAllVisits(req: Request, _context: Context, db: Db, user: User): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const collection = db.collection<VisitDocument>('visits');
    const cursor = collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(results);
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}
