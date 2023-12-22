import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { Context } from '@netlify/functions';
import { ErrorResponse } from './response.js';

const client = new MongoClient(process.env.MONGO_DB_URI ?? '', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectionPromise = client.connect();

export async function withMongoDb(
  nextStepFunction: (req: Request, context: Context, db: Db) => Promise<Response>,
  req: Request,
  context: Context
): Promise<Response> {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const db = (await connectionPromise).db('tripz');
    console.log('Connected to the database');
    return await nextStepFunction(req, context, db);
  } catch (e) {
    return new ErrorResponse('Could not connect to the database', 500, e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('Closed connection to the database');
  }
}
