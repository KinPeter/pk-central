import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { getEnv } from './environment';

export class MongoDbManager {
  private client: MongoClient | null = null;

  public async getMongoDb(): Promise<{ client: MongoClient; db: Db }> {
    try {
      const [MONGO_DB_URI, MONGO_DB_NAME] = getEnv('MONGO_DB_URI', 'MONGO_DB_NAME');
      this.client = new MongoClient(MONGO_DB_URI ?? '', {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      const db = (await this.client.connect()).db(MONGO_DB_NAME);
      console.log('Connected to the database:', db.databaseName);
      return { client: this.client, db };
    } catch (e) {
      throw new Error(`Could not connect to the database: ${JSON.stringify(e)}`);
    }
  }

  public async closeMongoClient(): Promise<void> {
    if (this.client) {
      // Ensures that the client will close when you finish/error
      await this.client.close();
      console.log('Closed connection to the database');
    }
  }
}
