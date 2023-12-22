import { Config, Context } from '@netlify/functions';
import { withMongoDb } from '../src/mongo-hof.js';
import { Db } from 'mongodb';
import { OkResponse } from '../src/response.js';

export default async (req: Request, context: Context) => {
  console.log(context.params);

  return await withMongoDb(run, req, context);
  // return await withMongoDb(await withAuthentication(run), req, context);
};

export const config: Config = {
  path: '/auth/:operation',
};

async function run(_req: Request, context: Context, _db: Db): Promise<Response> {
  return new OkResponse({ hello: 'world', operation: context.params.operation });
}
