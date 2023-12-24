import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { Context } from '@netlify/functions';
import { ErrorResponse } from './response.js';

export async function withMongoDb(
  nextStepFunction: (req: Request, context: Context, db: Db) => Promise<Response>,
  req: Request,
  context: Context
): Promise<Response> {
  let client: MongoClient | null = null;

  try {
    client = new MongoClient(process.env.MONGO_DB_URI ?? '', {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    const db = (await client.connect()).db(process.env.MONGO_DB_NAME);
    console.log('Connected to the database:', db.databaseName);
    return await nextStepFunction(req, context, db);
  } catch (e) {
    return new ErrorResponse('Could not connect to the database', 500, e);
  } finally {
    // Ensures that the client will close when you finish/error
    if (client) {
      await client.close();
      console.log('Closed connection to the database');
    }
  }
}
