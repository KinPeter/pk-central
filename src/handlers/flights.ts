import { Context } from '@netlify/functions';
import { Db } from 'mongodb';
import { User } from '../types/users.js';
import { ErrorResponse, MethodNotAllowedResponse, OkResponse } from '../utils/response.js';
import { FlightDocument } from '../types/flights.js';

export async function getAllFlights(req: Request, _context: Context, db: Db, user: User): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const collection = db.collection<FlightDocument>('flights');
    const cursor = collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(results);
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}
